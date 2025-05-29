import { users, helipads, bookings, helicopters, routes, payments, testimonials, type User, type InsertUser, type Helipad, type InsertHelipad, type Booking, type InsertBooking, type Helicopter, type Route, type InsertRoute, type Payment, type InsertPayment, type Testimonial, type InsertTestimonial } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

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
  createRoute(route: InsertRoute): Promise<Route>;
  
  // Payment methods
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentByBookingId(bookingId: number): Promise<Payment | undefined>;
  
  // Testimonial methods
  getApprovedTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  approveTestimonial(id: number): Promise<Testimonial | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set(userData)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getAllHelipads(): Promise<Helipad[]> {
    return await db.select().from(helipads);
  }

  async getHelipad(id: number): Promise<Helipad | undefined> {
    const [helipad] = await db.select().from(helipads).where(eq(helipads.id, id));
    return helipad || undefined;
  }

  async getFeaturedHelipads(limit: number = 3): Promise<Helipad[]> {
    return await db.select().from(helipads).limit(limit);
  }

  async createHelipad(helipad: InsertHelipad): Promise<Helipad> {
    const [newHelipad] = await db
      .insert(helipads)
      .values(helipad)
      .returning();
    return newHelipad;
  }

  async updateHelipad(id: number, helipadData: Partial<Helipad>): Promise<Helipad | undefined> {
    const [helipad] = await db
      .update(helipads)
      .set(helipadData)
      .where(eq(helipads.id, id))
      .returning();
    return helipad || undefined;
  }

  async deleteHelipad(id: number): Promise<boolean> {
    const result = await db.delete(helipads).where(eq(helipads.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getAllBookings(): Promise<Booking[]> {
    return await db.select().from(bookings);
  }

  async getBooking(id: number): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  async getBookingByReference(reference: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.bookingReference, reference));
    return booking || undefined;
  }

  async getUserBookings(userId: number): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.userId, userId));
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [newBooking] = await db
      .insert(bookings)
      .values(booking)
      .returning();
    return newBooking;
  }

  async updateBookingStatus(id: number, status: string): Promise<Booking | undefined> {
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status: ${status}. Must be one of: ${validStatuses.join(', ')}`);
    }
    
    const [booking] = await db
      .update(bookings)
      .set({ bookingStatus: status as 'pending' | 'confirmed' | 'completed' | 'cancelled' })
      .where(eq(bookings.id, id))
      .returning();
    return booking || undefined;
  }

  async getAllHelicopters(): Promise<Helicopter[]> {
    return await db.select().from(helicopters);
  }

  async getHelicopter(id: number): Promise<Helicopter | undefined> {
    const [helicopter] = await db.select().from(helicopters).where(eq(helicopters.id, id));
    return helicopter || undefined;
  }

  async getAllRoutes(): Promise<Route[]> {
    return await db.select().from(routes);
  }

  async getRoute(id: number): Promise<Route | undefined> {
    const [route] = await db.select().from(routes).where(eq(routes.id, id));
    return route || undefined;
  }

  async createRoute(route: InsertRoute): Promise<Route> {
    const [newRoute] = await db
      .insert(routes)
      .values(route)
      .returning();
    return newRoute;
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db
      .insert(payments)
      .values(payment)
      .returning();
    return newPayment;
  }

  async getPaymentByBookingId(bookingId: number): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.bookingId, bookingId));
    return payment || undefined;
  }

  async getApprovedTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials).where(eq(testimonials.isApproved, true));
  }

  async createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial> {
    const [newTestimonial] = await db
      .insert(testimonials)
      .values(testimonial)
      .returning();
    return newTestimonial;
  }

  async approveTestimonial(id: number): Promise<Testimonial | undefined> {
    const [testimonial] = await db
      .update(testimonials)
      .set({ isApproved: true })
      .where(eq(testimonials.id, id))
      .returning();
    return testimonial || undefined;
  }
}

export const storage = new DatabaseStorage();