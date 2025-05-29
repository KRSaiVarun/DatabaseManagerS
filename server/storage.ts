import { 
  users, type User, type InsertUser, 
  helipads, type Helipad, type InsertHelipad, 
  bookings, type Booking, type InsertBooking,
  helicopters, type Helicopter, type InsertHelicopter,
  routes, type Route, type InsertRoute,
  payments, type Payment, type InsertPayment,
  testimonials, type Testimonial, type InsertTestimonial
} from "@shared/schema";
import { generateBookingReference } from "../client/src/lib/utils";
import bcrypt from 'bcrypt';

// Interface for storage methods
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, userData: Partial<User>): Promise<User | undefined>;
  
  // Helipad methods
  getAllHelipads(): Promise<Helipad[]>;
  getHelipad(id: number): Promise<Helipad | undefined>;
  getFeaturedHelipads(limit?: number): Promise<Helipad[]>;
  createHelipad(helipad: InsertHelipad): Promise<Helipad>;
  updateHelipad(id: number, helipad: Partial<Helipad>): Promise<Helipad | undefined>;
  deleteHelipad(id: number): Promise<boolean>;
  
  // Booking methods
  getAllBookings(): Promise<Booking[]>;
  getBooking(id: number): Promise<Booking | undefined>;
  getBookingByReference(reference: string): Promise<Booking | undefined>;
  getUserBookings(userId: number): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingStatus(id: number, status: string): Promise<Booking | undefined>;
  
  // Helicopter methods
  getAllHelicopters(): Promise<Helicopter[]>;
  getHelicopter(id: number): Promise<Helicopter | undefined>;
  
  // Route methods
  getAllRoutes(): Promise<Route[]>;
  getRoute(id: number): Promise<Route | undefined>;
  
  // Payment methods
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentByBookingId(bookingId: number): Promise<Payment | undefined>;
  
  // Testimonial methods
  getApprovedTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  approveTestimonial(id: number): Promise<Testimonial | undefined>;
}

export class MemStorage implements IStorage {
  private users: User[] = [];
  private helipads: Helipad[] = [];
  private bookings: Booking[] = [];
  private helicopters: Helicopter[] = [];
  private routes: Route[] = [];
  private payments: Payment[] = [];
  private testimonials: Testimonial[] = [];
  private nextUserId = 1;
  private nextHelipadId = 1;
  private nextBookingId = 1;
  private nextHelicopterId = 1;
  private nextRouteId = 1;
  private nextPaymentId = 1;
  private nextTestimonialId = 1;

  constructor() {
    this.initializeData();
  }

  private async initializeData() {
    // Initialize with sample data including admin user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    
    this.users = [
      {
        id: this.nextUserId++,
        name: "Admin User",
        email: "admin@vayuvihar.com",
        phone: "+91 98765 43210",
        password: hashedPassword,
        role: "admin",
        authProvider: null,
        authProviderId: null,
        createdAt: new Date()
      }
    ];
    
    this.helipads = [
      {
        id: this.nextHelipadId++,
        name: "Brigade Road Helipad",
        location: "Brigade Road, Bengaluru, Karnataka 560001",
        description: "Premium helipad in the heart of the city",
        imageUrl: null,
        pricePerHour: 50000,
        latitude: 12.9716,
        longitude: 77.5946,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: this.nextHelipadId++,
        name: "Electronic City Helipad",
        location: "Electronic City, Bengaluru, Karnataka 560100",
        description: "Strategic location for tech professionals",
        imageUrl: null,
        pricePerHour: 45000,
        latitude: 12.8456,
        longitude: 77.6603,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: this.nextHelipadId++,
        name: "Whitefield Helipad",
        location: "Whitefield, Bengaluru, Karnataka 560066",
        description: "Gateway to IT corridor",
        imageUrl: null,
        pricePerHour: 48000,
        latitude: 12.9698,
        longitude: 77.7500,
        isActive: true,
        createdAt: new Date()
      }
    ];

    this.helicopters = [
      {
        id: this.nextHelicopterId++,
        name: "Bell 407",
        model: "Bell 407",
        capacity: 6,
        hourlyRate: 250000,
        imageUrl: null,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: this.nextHelicopterId++,
        name: "Robinson R44",
        model: "Robinson R44",
        capacity: 4,
        hourlyRate: 180000,
        imageUrl: null,
        isActive: true,
        createdAt: new Date()
      }
    ];

    this.routes = [
      {
        id: this.nextRouteId++,
        name: "City Center to Electronic City",
        sourceHelipadId: 1,
        destinationHelipadId: 2,
        distance: 25,
        duration: 15,
        basePrice: 350000,
        isActive: true,
        createdAt: new Date()
      },
      {
        id: this.nextRouteId++,
        name: "Brigade Road to Whitefield",
        sourceHelipadId: 1,
        destinationHelipadId: 3,
        distance: 30,
        duration: 18,
        basePrice: 420000,
        isActive: true,
        createdAt: new Date()
      }
    ];

    this.testimonials = [
      {
        id: this.nextTestimonialId++,
        userId: 1,
        rating: 5,
        content: "Amazing experience! The helicopter ride was smooth and the views were breathtaking.",
        isApproved: true,
        createdAt: new Date()
      },
      {
        id: this.nextTestimonialId++,
        userId: 2,
        rating: 5,
        content: "Professional service and punctual timing. Highly recommended for business travel.",
        isApproved: true,
        createdAt: new Date()
      }
    ];
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async createUser(user: InsertUser): Promise<User> {
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
    
    const newUser: User = {
      ...user,
      id: this.nextUserId++,
      createdAt: new Date()
    } as User;
    
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    
    const userIndex = this.users.findIndex(user => user.id === id);
    if (userIndex === -1) return undefined;
    
    this.users[userIndex] = { ...this.users[userIndex], ...userData };
    return this.users[userIndex];
  }

  // Helipad methods
  async getAllHelipads(): Promise<Helipad[]> {
    return this.helipads.sort((a, b) => a.name.localeCompare(b.name));
  }

  async getHelipad(id: number): Promise<Helipad | undefined> {
    return this.helipads.find(helipad => helipad.id === id);
  }

  async getFeaturedHelipads(limit: number = 3): Promise<Helipad[]> {
    return this.helipads.filter(helipad => helipad.isActive).slice(0, limit);
  }

  async createHelipad(helipad: InsertHelipad): Promise<Helipad> {
    const newHelipad: Helipad = {
      ...helipad,
      id: this.nextHelipadId++,
      createdAt: new Date()
    } as Helipad;
    
    this.helipads.push(newHelipad);
    return newHelipad;
  }

  async updateHelipad(id: number, helipad: Partial<Helipad>): Promise<Helipad | undefined> {
    const helipadIndex = this.helipads.findIndex(h => h.id === id);
    if (helipadIndex === -1) return undefined;
    
    this.helipads[helipadIndex] = { ...this.helipads[helipadIndex], ...helipad };
    return this.helipads[helipadIndex];
  }

  async deleteHelipad(id: number): Promise<boolean> {
    const helipadIndex = this.helipads.findIndex(h => h.id === id);
    if (helipadIndex === -1) return false;
    
    this.helipads.splice(helipadIndex, 1);
    return true;
  }

  // Booking methods
  async getAllBookings(): Promise<Booking[]> {
    return this.bookings.sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    return this.bookings.find(booking => booking.id === id);
  }

  async getBookingByReference(reference: string): Promise<Booking | undefined> {
    return this.bookings.find(booking => booking.bookingReference === reference);
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return this.bookings
      .filter(booking => booking.userId === userId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    // Generate a unique booking reference if not provided
    if (!booking.bookingReference) {
      booking.bookingReference = generateBookingReference();
    }
    
    const newBooking: Booking = {
      ...booking,
      id: this.nextBookingId++,
      createdAt: new Date()
    } as Booking;
    
    this.bookings.push(newBooking);
    return newBooking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const bookingIndex = this.bookings.findIndex(booking => booking.id === id);
    if (bookingIndex === -1) return undefined;
    
    this.bookings[bookingIndex].bookingStatus = status as any;
    return this.bookings[bookingIndex];
  }

  // Helicopter methods
  async getAllHelicopters(): Promise<Helicopter[]> {
    return this.helicopters.filter(helicopter => helicopter.isActive);
  }

  async getHelicopter(id: number): Promise<Helicopter | undefined> {
    return this.helicopters.find(helicopter => helicopter.id === id);
  }

  // Route methods
  async getAllRoutes(): Promise<Route[]> {
    return this.routes.filter(route => route.isActive);
  }

  async getRoute(id: number): Promise<Route | undefined> {
    return this.routes.find(route => route.id === id);
  }

  // Payment methods
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const newPayment: Payment = {
      ...payment,
      id: this.nextPaymentId++,
      createdAt: new Date()
    } as Payment;
    
    this.payments.push(newPayment);
    return newPayment;
  }

  async getPaymentByBookingId(bookingId: number): Promise<Payment | undefined> {
    return this.payments
      .filter(payment => payment.bookingId === bookingId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())[0];
  }

  // Testimonial methods
  async getApprovedTestimonials(): Promise<Testimonial[]> {
    return this.testimonials
      .filter(testimonial => testimonial.isApproved)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: this.nextTestimonialId++,
      createdAt: new Date()
    } as Testimonial;
    
    this.testimonials.push(newTestimonial);
    return newTestimonial;
  }

  async approveTestimonial(id: number): Promise<Testimonial | undefined> {
    const testimonialIndex = this.testimonials.findIndex(testimonial => testimonial.id === id);
    if (testimonialIndex === -1) return undefined;
    
    this.testimonials[testimonialIndex].isApproved = true;
    return this.testimonials[testimonialIndex];
  }
}

// Create and export a singleton instance
export const storage = new MemStorage();
