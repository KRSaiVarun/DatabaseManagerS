import { pgTable, text, serial, integer, boolean, timestamp, pgEnum, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User role enum
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  password: text("password"),
  role: userRoleEnum("role").notNull().default('user'),
  authProvider: text("auth_provider"),
  authProviderId: text("auth_provider_id"),
  createdAt: timestamp("created_at").defaultNow()
});

// Helipads table
export const helipads = pgTable("helipads", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  location: text("location").notNull(),
  description: text("description"),
  imageUrl: text("image_url"),
  pricePerHour: integer("price_per_hour").notNull(),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

// Booking status enum
export const bookingStatusEnum = pgEnum('booking_status', ['pending', 'confirmed', 'completed', 'cancelled']);

// Booking type enum
export const bookingTypeEnum = pgEnum('booking_type', ['predefined', 'custom']);

// Bookings table
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  pickupHelipadId: integer("pickup_helipad_id").references(() => helipads.id),
  dropHelipadId: integer("drop_helipad_id").references(() => helipads.id),
  customPickupLocation: text("custom_pickup_location"),
  customDropLocation: text("custom_drop_location"),
  bookingType: bookingTypeEnum("booking_type").notNull(),
  bookingDate: timestamp("booking_date").notNull(),
  passengers: integer("passengers").notNull(),
  duration: integer("duration").notNull(), // in minutes
  totalAmount: integer("total_amount").notNull(), // in paisa/cents
  paymentStatus: boolean("payment_status").default(false),
  bookingStatus: bookingStatusEnum("booking_status").notNull().default('pending'),
  bookingReference: text("booking_reference").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Helicopters table
export const helicopters = pgTable("helicopters", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  model: text("model").notNull(),
  capacity: integer("capacity").notNull(),
  imageUrl: text("image_url"),
  hourlyRate: integer("hourly_rate").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

// Routes table for predefined routes
export const routes = pgTable("routes", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  sourceHelipadId: integer("source_helipad_id").notNull().references(() => helipads.id),
  destinationHelipadId: integer("destination_helipad_id").notNull().references(() => helipads.id),
  duration: integer("duration").notNull(), // in minutes
  distance: integer("distance").notNull(), // in kilometers
  basePrice: integer("base_price").notNull(), // in paisa/cents
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow()
});

// Payment records
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull().references(() => bookings.id),
  amount: integer("amount").notNull(), // in paisa/cents
  paymentReference: text("payment_reference").notNull(),
  paymentMethod: text("payment_method"),
  paymentStatus: text("payment_status").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  rating: integer("rating").notNull(),
  content: text("content").notNull(),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true, createdAt: true });
export const insertHelipadSchema = createInsertSchema(helipads).omit({ id: true, createdAt: true });
export const insertBookingSchema = createInsertSchema(bookings).omit({ id: true, createdAt: true });
export const insertHelicopterSchema = createInsertSchema(helicopters).omit({ id: true, createdAt: true });
export const insertRouteSchema = createInsertSchema(routes).omit({ id: true, createdAt: true });
export const insertPaymentSchema = createInsertSchema(payments).omit({ id: true, createdAt: true });
export const insertTestimonialSchema = createInsertSchema(testimonials).omit({ id: true, createdAt: true });

// Extended schemas with validation
export const userLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const userRegistrationSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const predefinedBookingSchema = z.object({
  routeId: z.number(),
  bookingDate: z.string(),
  bookingTime: z.string(),
  passengers: z.number().min(1).max(10),
});

export const customBookingSchema = z.object({
  pickupLocation: z.string().min(5, "Please enter a valid pickup location"),
  dropLocation: z.string().min(5, "Please enter a valid drop location"),
  bookingDate: z.string(),
  bookingTime: z.string(),
  passengers: z.number().min(1).max(10),
  helicopterId: z.number(),
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Helipad = typeof helipads.$inferSelect;
export type InsertHelipad = z.infer<typeof insertHelipadSchema>;
export type Booking = typeof bookings.$inferSelect;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Helicopter = typeof helicopters.$inferSelect;
export type InsertHelicopter = z.infer<typeof insertHelicopterSchema>;
export type Route = typeof routes.$inferSelect;
export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
