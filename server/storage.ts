import { 
  users, type User, type InsertUser, 
  helipads, type Helipad, type InsertHelipad, 
  bookings, type Booking, type InsertBooking,
  helicopters, type Helicopter, type InsertHelicopter,
  routes, type Route, type InsertRoute,
  payments, type Payment, type InsertPayment,
  testimonials, type Testimonial, type InsertTestimonial
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, like, desc, gte, lte } from "drizzle-orm";
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
  constructor() {}

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(user: InsertUser): Promise<User> {
    if (user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
    
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password, salt);
    }
    
    const result = await db.update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    
    return result[0];
  }

  // Helipad methods
  async getAllHelipads(): Promise<Helipad[]> {
    return await db.select().from(helipads).orderBy(helipads.name);
  }

  async getHelipad(id: number): Promise<Helipad | undefined> {
    const result = await db.select().from(helipads).where(eq(helipads.id, id)).limit(1);
    return result[0];
  }

  async getFeaturedHelipads(limit: number = 3): Promise<Helipad[]> {
    return await db.select()
      .from(helipads)
      .where(eq(helipads.isActive, true))
      .limit(limit);
  }

  async createHelipad(helipad: InsertHelipad): Promise<Helipad> {
    const result = await db.insert(helipads).values(helipad).returning();
    return result[0];
  }

  async updateHelipad(id: number, helipad: Partial<Helipad>): Promise<Helipad | undefined> {
    const result = await db.update(helipads)
      .set(helipad)
      .where(eq(helipads.id, id))
      .returning();
    
    return result[0];
  }

  async deleteHelipad(id: number): Promise<boolean> {
    const result = await db.delete(helipads).where(eq(helipads.id, id)).returning();
    return result.length > 0;
  }

  // Booking methods
  async getAllBookings(): Promise<Booking[]> {
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const result = await db.select().from(bookings).where(eq(bookings.id, id)).limit(1);
    return result[0];
  }

  async getBookingByReference(reference: string): Promise<Booking | undefined> {
    const result = await db.select().from(bookings)
      .where(eq(bookings.bookingReference, reference))
      .limit(1);
    return result[0];
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return await db.select().from(bookings)
      .where(eq(bookings.userId, userId))
      .orderBy(desc(bookings.createdAt));
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    // Generate a unique booking reference if not provided
    if (!booking.bookingReference) {
      booking.bookingReference = generateBookingReference();
    }
    
    const result = await db.insert(bookings).values(booking).returning();
    return result[0];
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const result = await db.update(bookings)
      .set({ bookingStatus: status as any })
      .where(eq(bookings.id, id))
      .returning();
    
    return result[0];
  }

  // Helicopter methods
  async getAllHelicopters(): Promise<Helicopter[]> {
    return await db.select().from(helicopters).where(eq(helicopters.isActive, true));
  }

  async getHelicopter(id: number): Promise<Helicopter | undefined> {
    const result = await db.select().from(helicopters).where(eq(helicopters.id, id)).limit(1);
    return result[0];
  }

  // Route methods
  async getAllRoutes(): Promise<Route[]> {
    return await db.select().from(routes).where(eq(routes.isActive, true));
  }

  async getRoute(id: number): Promise<Route | undefined> {
    const result = await db.select().from(routes).where(eq(routes.id, id)).limit(1);
    return result[0];
  }

  // Payment methods
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const result = await db.insert(payments).values(payment).returning();
    return result[0];
  }

  async getPaymentByBookingId(bookingId: number): Promise<Payment | undefined> {
    const result = await db.select().from(payments)
      .where(eq(payments.bookingId, bookingId))
      .orderBy(desc(payments.createdAt))
      .limit(1);
    
    return result[0];
  }

  // Testimonial methods
  async getApprovedTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials)
      .where(eq(testimonials.isApproved, true))
      .orderBy(desc(testimonials.createdAt));
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const result = await db.insert(testimonials).values(testimonial).returning();
    return result[0];
  }

  async approveTestimonial(id: number): Promise<Testimonial | undefined> {
    const result = await db.update(testimonials)
      .set({ isApproved: true })
      .where(eq(testimonials.id, id))
      .returning();
    
    return result[0];
  }
}

// Create and export a singleton instance
export const storage = new MemStorage();
