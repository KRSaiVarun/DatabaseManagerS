import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  userRegistrationSchema, 
  userLoginSchema, 
  adminLoginSchema,
  predefinedBookingSchema,
  customBookingSchema,
  insertTestimonialSchema
} from "@shared/schema";
import { createHash } from "crypto";
import { generateBookingReference } from "../client/src/lib/utils";
import { requireAuth, requireAdmin } from "./middleware/auth";
import { processPayment } from "./utils/payment";
import { calculateTotal, createPredefinedBooking, createCustomBooking } from "./utils/booking";
import bcrypt from 'bcrypt';
import session from 'express-session';
import MemoryStore from 'memorystore';

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Setup session middleware
  const MemoryStoreInstance = MemoryStore(session);
  app.use(session({
    secret: process.env.SESSION_SECRET || 'vayu-vihar-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    },
    store: new MemoryStoreInstance({
      checkPeriod: 86400000 // prune expired entries every 24h
    })
  }));

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  // ===== AUTH ROUTES =====
  
  // Register new user
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const validation = userRegistrationSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: validation.error.errors[0].message });
      }
      
      const { email, password, confirmPassword, ...userData } = validation.data;
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }
      
      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      // Create new user
      const user = await storage.createUser({
        name: userData.name,
        email,
        phone: userData.phone || null,
        password: hashedPassword,
        role: 'user',
        authProvider: null,
        authProviderId: null,
      });
      
      // Set session data
      const { password: _, ...userWithoutPassword } = user;
      req.session.user = userWithoutPassword;
      
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Failed to register user' });
    }
  });
  
  // User login
  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const validation = userLoginSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: validation.error.errors[0].message });
      }
      
      const { email, password } = validation.data;
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      // Check password
      if (!user.password) {
        return res.status(401).json({ message: 'This account requires social login' });
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      
      // Set session data
      const { password: _, ...userWithoutPassword } = user;
      req.session.user = userWithoutPassword;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Failed to log in' });
    }
  });
  
  // Admin login
  app.post('/api/auth/admin/login', async (req: Request, res: Response) => {
    try {
      const validation = adminLoginSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: validation.error.errors[0].message });
      }
      
      const { email, password } = validation.data;
      
      // Find user by email
      const user = await storage.getUserByEmail(email);
      if (!user || user.role !== 'admin') {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }
      
      // Check password
      if (!user.password) {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }
      
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid admin credentials' });
      }
      
      // Set session data
      const { password: _, ...userWithoutPassword } = user;
      req.session.user = userWithoutPassword;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ message: 'Failed to log in as admin' });
    }
  });
  
  // Google OAuth login
  app.post('/api/auth/google', async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: 'Token is required' });
      }
      
      // In a real implementation, you would verify the token with Google
      // For now, we'll create a hash of the token to simulate a Google ID
      const googleId = createHash('md5').update(token).digest('hex');
      
      // Check if user exists with this auth provider ID
      let user = await storage.getUserByEmail(`google-${googleId}@example.com`);
      
      if (!user) {
        // Create new user
        user = await storage.createUser({
          name: 'Google User', // In a real implementation, you would get the name from the Google profile
          email: `google-${googleId}@example.com`,
          password: null, // Social login users don't have a password
          role: 'user',
          authProvider: 'google',
          authProviderId: googleId,
        });
      }
      
      // Set session data
      const { password: _, ...userWithoutPassword } = user;
      req.session.user = userWithoutPassword;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Google login error:', error);
      res.status(500).json({ message: 'Failed to log in with Google' });
    }
  });
  
  // Facebook OAuth login
  app.post('/api/auth/facebook', async (req: Request, res: Response) => {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: 'Token is required' });
      }
      
      // In a real implementation, you would verify the token with Facebook
      // For now, we'll create a hash of the token to simulate a Facebook ID
      const facebookId = createHash('md5').update(token).digest('hex');
      
      // Check if user exists with this auth provider ID
      let user = await storage.getUserByEmail(`facebook-${facebookId}@example.com`);
      
      if (!user) {
        // Create new user
        user = await storage.createUser({
          name: 'Facebook User', // In a real implementation, you would get the name from the Facebook profile
          email: `facebook-${facebookId}@example.com`,
          password: null, // Social login users don't have a password
          role: 'user',
          authProvider: 'facebook',
          authProviderId: facebookId,
        });
      }
      
      // Set session data
      const { password: _, ...userWithoutPassword } = user;
      req.session.user = userWithoutPassword;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Facebook login error:', error);
      res.status(500).json({ message: 'Failed to log in with Facebook' });
    }
  });
  
  // Current user
  app.get('/api/auth/me', async (req: Request, res: Response) => {
    if (req.session.user) {
      res.json(req.session.user);
    } else {
      res.status(401).json({ message: 'Not authenticated' });
    }
  });
  
  // Update profile
  app.patch('/api/auth/profile', requireAuth, async (req: Request, res: Response) => {
    try {
      const { name, email, phone } = req.body;
      const userId = req.session.user!.id;
      
      // Update user profile
      const updatedUser = await storage.updateUser(userId, { name, email, phone });
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Update session data
      const { password: _, ...userWithoutPassword } = updatedUser;
      req.session.user = userWithoutPassword;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Profile update error:', error);
      res.status(500).json({ message: 'Failed to update profile' });
    }
  });
  
  // Update user profile
  app.patch('/api/auth/profile', requireAuth, async (req: Request, res: Response) => {
    try {
      const { name, email, phone } = req.body;
      const userId = (req.session as any).user!.id;
      
      // Validate name contains only letters and spaces
      if (name && !/^[a-zA-Z\s]+$/.test(name)) {
        return res.status(400).json({ message: 'Name can only contain letters and spaces' });
      }
      
      // Validate email format
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ message: 'Please enter a valid email format' });
      }
      
      // Validate phone number (Indian format)
      if (phone && phone !== '' && !/^[6-9]\d{9}$/.test(phone)) {
        return res.status(400).json({ message: 'Please enter a valid 10-digit Indian mobile number' });
      }
      
      const updatedUser = await storage.updateUser(userId, { name, email, phone });
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Update session data
      const { password: _, ...userWithoutPassword } = updatedUser;
      (req.session as any).user = userWithoutPassword;
      
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Update profile error:', error);
      res.status(500).json({ message: 'Failed to update profile' });
    }
  });

  // Logout
  app.post('/api/auth/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        console.error('Logout error:', err);
        return res.status(500).json({ message: 'Failed to log out' });
      }
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logged out successfully' });
    });
  });
  
  // ===== HELIPAD ROUTES =====
  
  // Get all helipads
  app.get('/api/helipads', async (req: Request, res: Response) => {
    try {
      const helipads = await storage.getAllHelipads();
      res.json(helipads);
    } catch (error) {
      console.error('Get helipads error:', error);
      res.status(500).json({ message: 'Failed to fetch helipads' });
    }
  });
  
  // Get featured helipads
  app.get('/api/helipads/featured', async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 3;
      const helipads = await storage.getFeaturedHelipads(limit);
      res.json(helipads);
    } catch (error) {
      console.error('Get featured helipads error:', error);
      res.status(500).json({ message: 'Failed to fetch featured helipads' });
    }
  });
  
  // Get helipad by ID
  app.get('/api/helipads/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const helipad = await storage.getHelipad(id);
      
      if (!helipad) {
        return res.status(404).json({ message: 'Helipad not found' });
      }
      
      res.json(helipad);
    } catch (error) {
      console.error('Get helipad error:', error);
      res.status(500).json({ message: 'Failed to fetch helipad' });
    }
  });
  
  // ===== HELICOPTER ROUTES =====
  
  // Get all helicopters
  app.get('/api/helicopters', async (req: Request, res: Response) => {
    try {
      const helicopters = await storage.getAllHelicopters();
      res.json(helicopters);
    } catch (error) {
      console.error('Get helicopters error:', error);
      res.status(500).json({ message: 'Failed to fetch helicopters' });
    }
  });
  
  // Get helicopter by ID
  app.get('/api/helicopters/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const helicopter = await storage.getHelicopter(id);
      
      if (!helicopter) {
        return res.status(404).json({ message: 'Helicopter not found' });
      }
      
      res.json(helicopter);
    } catch (error) {
      console.error('Get helicopter error:', error);
      res.status(500).json({ message: 'Failed to fetch helicopter' });
    }
  });
  
  // ===== ROUTE ROUTES =====
  
  // Get all routes
  app.get('/api/routes', async (req: Request, res: Response) => {
    try {
      const routes = await storage.getAllRoutes();
      res.json(routes);
    } catch (error) {
      console.error('Get routes error:', error);
      res.status(500).json({ message: 'Failed to fetch routes' });
    }
  });
  
  // Get route by ID
  app.get('/api/routes/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const route = await storage.getRoute(id);
      
      if (!route) {
        return res.status(404).json({ message: 'Route not found' });
      }
      
      res.json(route);
    } catch (error) {
      console.error('Get route error:', error);
      res.status(500).json({ message: 'Failed to fetch route' });
    }
  });

  // Add new route (Admin only)
  app.post('/api/admin/routes', requireAdmin, async (req: Request, res: Response) => {
    try {
      const { name, sourceLocation, destinationLocation, basePrice, duration, distance, sourceHelipadId, destinationHelipadId } = req.body;
      
      if (!name || !sourceLocation || !destinationLocation || !basePrice || !duration || !distance) {
        return res.status(400).json({ message: 'All fields are required' });
      }
      
      const route = await storage.createRoute({
        name,
        sourceLocation,
        destinationLocation,
        basePrice,
        duration,
        distance,
        sourceHelipadId: sourceHelipadId || null,
        destinationHelipadId: destinationHelipadId || null,
        isActive: true,
      });
      
      res.status(201).json(route);
    } catch (error) {
      console.error('Add route error:', error);
      res.status(500).json({ message: 'Failed to add route' });
    }
  });
  
  // ===== BOOKING ROUTES =====
  
  // Create custom location booking
  app.post('/api/bookings/custom', requireAuth, async (req: Request, res: Response) => {
    try {
      const { fromLocation, toLocation, routeId, bookingDate: requestBookingDate, bookingTime, passengers, contactName, contactEmail, contactPhone, paymentMethod, specialRequests } = req.body;
      
      if (!fromLocation || !toLocation || !requestBookingDate || !bookingTime || !passengers) {
        return res.status(400).json({ message: 'Required fields missing' });
      }
      
      const userId = req.session.user!.id;
      
      // Calculate pricing
      let basePrice = 100000; // Default ₹1000 base price for custom routes
      let duration = 30; // Default 30 minutes
      
      // If a matching route exists, use its pricing
      if (routeId) {
        const route = await storage.getRoute(routeId);
        if (route) {
          basePrice = route.basePrice;
          duration = route.duration;
        }
      }
      
      const totalAmount = Math.round(basePrice * passengers * 1.18); // Add 18% GST
      
      // Create booking with correct field names
      const bookingDateTime = new Date(`${requestBookingDate}T${bookingTime}`);
      const bookingReference = `VV${Date.now().toString().slice(-6)}`;
      
      const booking = await storage.createBooking({
        userId,
        customPickupLocation: fromLocation,
        customDropLocation: toLocation,
        bookingDate: bookingDateTime,
        passengers,
        duration,
        totalAmount,
        bookingStatus: 'confirmed',
        bookingType: 'custom',
        bookingReference,
        pickupHelipadId: null,
        dropHelipadId: null,
        paymentStatus: true,
      });
      
      // Process payment
      const paymentResult = await processPayment({
        bookingId: booking.id,
        amount: totalAmount,
        paymentMethod: paymentMethod || 'card',
      });
      
      res.status(201).json({
        ...booking,
        payment: paymentResult,
      });
    } catch (error) {
      console.error('Custom booking error:', error);
      res.status(500).json({ message: 'Failed to create booking' });
    }
  });
  
  // Create predefined route booking
  app.post('/api/bookings/predefined', requireAuth, async (req: Request, res: Response) => {
    try {
      const validation = predefinedBookingSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: validation.error.errors[0].message });
      }
      
      const userId = req.session.user!.id;
      const bookingData = validation.data;
      
      // Create the booking
      const booking = await createPredefinedBooking(userId, bookingData);
      
      // Process payment
      const paymentResult = await processPayment({
        bookingId: booking.id,
        amount: booking.totalAmount,
        paymentMethod: req.body.paymentMethod || 'card',
      });
      
      // Update booking payment status if payment successful
      if (paymentResult.success) {
        await storage.updateBookingStatus(booking.id, 'confirmed');
      }
      
      res.status(201).json({ 
        booking,
        payment: paymentResult
      });
    } catch (error) {
      console.error('Create predefined booking error:', error);
      res.status(500).json({ message: 'Failed to create booking' });
    }
  });
  

  
  // Get user bookings
  app.get('/api/bookings/my-bookings', requireAuth, async (req: Request, res: Response) => {
    try {
      const userId = req.session.user!.id;
      const bookings = await storage.getUserBookings(userId);
      res.json(bookings);
    } catch (error) {
      console.error('Get user bookings error:', error);
      res.status(500).json({ message: 'Failed to fetch bookings' });
    }
  });
  
  // Get booking by ID
  app.get('/api/bookings/:id', requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await storage.getBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      // Ensure user has access to this booking
      const userId = req.session.user!.id;
      if (booking.userId !== userId && req.session.user!.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      res.json(booking);
    } catch (error) {
      console.error('Get booking error:', error);
      res.status(500).json({ message: 'Failed to fetch booking' });
    }
  });
  
  // Cancel booking
  app.post('/api/bookings/:id/cancel', requireAuth, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await storage.getBooking(id);
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      // Ensure user has access to this booking
      const userId = req.session.user!.id;
      if (booking.userId !== userId && req.session.user!.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      // Only pending and confirmed bookings can be cancelled
      if (!['pending', 'confirmed'].includes(booking.bookingStatus)) {
        return res.status(400).json({ message: `Cannot cancel booking in ${booking.bookingStatus} status` });
      }
      
      // Update booking status
      const updatedBooking = await storage.updateBookingStatus(id, 'cancelled');
      
      // Handle refund if applicable
      // In a real app, you'd integrate with payment gateway to process refund
      
      res.json(updatedBooking);
    } catch (error) {
      console.error('Cancel booking error:', error);
      res.status(500).json({ message: 'Failed to cancel booking' });
    }
  });
  
  // ===== TESTIMONIAL ROUTES =====
  
  // Get approved testimonials
  app.get('/api/testimonials/approved', async (req: Request, res: Response) => {
    try {
      const testimonials = await storage.getApprovedTestimonials();
      res.json(testimonials);
    } catch (error) {
      console.error('Get testimonials error:', error);
      res.status(500).json({ message: 'Failed to fetch testimonials' });
    }
  });
  
  // Create testimonial
  app.post('/api/testimonials', requireAuth, async (req: Request, res: Response) => {
    try {
      const validation = insertTestimonialSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ message: validation.error.errors[0].message });
      }
      
      const userId = req.session.user!.id;
      
      const testimonial = await storage.createTestimonial({
        ...validation.data,
        userId,
        isApproved: false,
      });
      
      res.status(201).json(testimonial);
    } catch (error) {
      console.error('Create testimonial error:', error);
      res.status(500).json({ message: 'Failed to create testimonial' });
    }
  });
  
  // ===== ADMIN ROUTES =====
  
  // Admin: Get all helipads (including inactive)
  app.get('/api/admin/helipads', requireAdmin, async (req: Request, res: Response) => {
    try {
      const helipads = await storage.getAllHelipads();
      res.json(helipads);
    } catch (error) {
      console.error('Admin get helipads error:', error);
      res.status(500).json({ message: 'Failed to fetch helipads' });
    }
  });
  
  // Admin: Create helipad
  app.post('/api/admin/helipads', requireAdmin, async (req: Request, res: Response) => {
    try {
      const helipad = await storage.createHelipad(req.body);
      res.status(201).json(helipad);
    } catch (error) {
      console.error('Admin create helipad error:', error);
      res.status(500).json({ message: 'Failed to create helipad' });
    }
  });
  
  // Admin: Update helipad
  app.patch('/api/admin/helipads/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const helipad = await storage.updateHelipad(id, req.body);
      
      if (!helipad) {
        return res.status(404).json({ message: 'Helipad not found' });
      }
      
      res.json(helipad);
    } catch (error) {
      console.error('Admin update helipad error:', error);
      res.status(500).json({ message: 'Failed to update helipad' });
    }
  });
  
  // Admin: Delete helipad
  app.delete('/api/admin/helipads/:id', requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const result = await storage.deleteHelipad(id);
      
      if (!result) {
        return res.status(404).json({ message: 'Helipad not found' });
      }
      
      res.json({ success: true });
    } catch (error) {
      console.error('Admin delete helipad error:', error);
      res.status(500).json({ message: 'Failed to delete helipad' });
    }
  });
  
  // Admin: Get all bookings
  app.get('/api/admin/bookings', requireAdmin, async (req: Request, res: Response) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error) {
      console.error('Admin get bookings error:', error);
      res.status(500).json({ message: 'Failed to fetch bookings' });
    }
  });
  
  // Admin: Update booking status
  app.patch('/api/admin/bookings/:id/status', requireAdmin, async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }
      
      const booking = await storage.updateBookingStatus(id, status);
      
      if (!booking) {
        return res.status(404).json({ message: 'Booking not found' });
      }
      
      res.json(booking);
    } catch (error) {
      console.error('Admin update booking status error:', error);
      res.status(500).json({ message: 'Failed to update booking status' });
    }
  });
  
  // Admin: Get all users
  app.get('/api/admin/users', requireAdmin, async (req: Request, res: Response) => {
    try {
      // In a real app, you'd implement a method to get all users
      // For now, we'll return a mock response
      res.json([
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'user' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user' },
        { id: 3, name: 'Admin User', email: 'admin@example.com', role: 'admin' },
      ]);
    } catch (error) {
      console.error('Admin get users error:', error);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  });
  
  // Admin: Get dashboard statistics
  app.get('/api/admin/statistics', requireAdmin, async (req: Request, res: Response) => {
    try {
      // In a real app, you'd calculate these statistics from the database
      // For now, we'll return mock data
      res.json({
        totalBookings: 547,
        totalRevenue: 8250000, // in paisa (₹82,500)
        totalUsers: 320,
        totalHelipads: 15,
        pendingBookings: 8,
      });
    } catch (error) {
      console.error('Admin get statistics error:', error);
      res.status(500).json({ message: 'Failed to fetch statistics' });
    }
  });
  
  // Admin: Get booking analytics (daily)
  app.get('/api/admin/analytics/daily', requireAdmin, async (req: Request, res: Response) => {
    try {
      // Mock data for daily booking analytics
      res.json([
        { name: 'Mon', bookings: 12, revenue: 180000 },
        { name: 'Tue', bookings: 15, revenue: 225000 },
        { name: 'Wed', bookings: 18, revenue: 270000 },
        { name: 'Thu', bookings: 16, revenue: 240000 },
        { name: 'Fri', bookings: 24, revenue: 360000 },
        { name: 'Sat', bookings: 32, revenue: 480000 },
        { name: 'Sun', bookings: 28, revenue: 420000 },
      ]);
    } catch (error) {
      console.error('Admin get daily analytics error:', error);
      res.status(500).json({ message: 'Failed to fetch analytics' });
    }
  });
  
  // Admin: Get booking analytics (weekly)
  app.get('/api/admin/analytics/weekly', requireAdmin, async (req: Request, res: Response) => {
    try {
      // Mock data for weekly booking analytics
      res.json([
        { name: 'Week 1', bookings: 98, revenue: 1470000 },
        { name: 'Week 2', bookings: 112, revenue: 1680000 },
        { name: 'Week 3', bookings: 125, revenue: 1875000 },
        { name: 'Week 4', bookings: 145, revenue: 2175000 },
      ]);
    } catch (error) {
      console.error('Admin get weekly analytics error:', error);
      res.status(500).json({ message: 'Failed to fetch analytics' });
    }
  });
  
  // Admin: Get booking analytics (monthly)
  app.get('/api/admin/analytics/monthly', requireAdmin, async (req: Request, res: Response) => {
    try {
      // Mock data for monthly booking analytics
      res.json([
        { name: 'Jan', bookings: 425, revenue: 6375000 },
        { name: 'Feb', bookings: 380, revenue: 5700000 },
        { name: 'Mar', bookings: 490, revenue: 7350000 },
        { name: 'Apr', bookings: 560, revenue: 8400000 },
        { name: 'May', bookings: 620, revenue: 9300000 },
        { name: 'Jun', bookings: 580, revenue: 8700000 },
      ]);
    } catch (error) {
      console.error('Admin get monthly analytics error:', error);
      res.status(500).json({ message: 'Failed to fetch analytics' });
    }
  });

  return httpServer;
}
