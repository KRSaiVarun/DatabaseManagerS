import { storage } from '../storage';
import { InsertBooking } from '@shared/schema';
import { generateBookingReference } from '../../client/src/lib/utils';

// Calculate total amount for a booking including GST
export function calculateTotal(baseAmount: number): number {
  // Add 18% GST
  const gst = Math.round(baseAmount * 0.18);
  return baseAmount + gst;
}

// Create a predefined route booking
export async function createPredefinedBooking(userId: number, bookingData: any) {
  const { routeId, bookingDate, bookingTime, passengers } = bookingData;
  
  // Get the route details
  const route = await storage.getRoute(routeId);
  if (!route) {
    throw new Error('Route not found');
  }
  
  // For predefined routes, we'll use the route locations directly
  // Note: This route might not have specific helipad IDs but has source/destination locations
  if (!route.sourceLocation || !route.destinationLocation) {
    throw new Error('Route locations not properly defined');
  }
  
  // Calculate booking date (combine date and time)
  const bookingDateTime = new Date(`${bookingDate}T${bookingTime}`);
  
  // Calculate total amount
  // Base price is per route, we might adjust based on passengers if needed
  const baseAmount = route.basePrice;
  const totalAmount = calculateTotal(baseAmount);
  
  // Create booking
  const booking: InsertBooking = {
    userId,
    pickupHelipadId: null,
    dropHelipadId: null,
    customPickupLocation: route.sourceLocation,
    customDropLocation: route.destinationLocation,
    bookingType: 'predefined',
    bookingDate: bookingDateTime,
    passengers,
    duration: route.duration,
    totalAmount,
    paymentStatus: false,
    bookingStatus: 'confirmed',
    bookingReference: generateBookingReference(),
  };
  
  return await storage.createBooking(booking);
}

// Create a custom route booking
export async function createCustomBooking(userId: number, bookingData: any) {
  const { 
    pickupLocation, 
    dropLocation, 
    bookingDate, 
    bookingTime, 
    passengers, 
    helicopterId,
    duration = 45, // Default duration in minutes
  } = bookingData;
  
  // Get helicopter if specified
  let helicopter = null;
  if (helicopterId) {
    helicopter = await storage.getHelicopter(helicopterId);
    if (!helicopter) {
      throw new Error('Helicopter not found');
    }
  }
  
  // Calculate booking date (combine date and time)
  const bookingDateTime = new Date(`${bookingDate}T${bookingTime}`);
  
  // Calculate total amount
  // For custom routes, we calculate based on duration and helicopter type
  let baseAmount = 1500000; // Default base amount in paisa (₹15,000)
  
  if (helicopter) {
    // Adjust price based on helicopter hourly rate and duration
    const hourlyRate = helicopter.hourlyRate;
    baseAmount = Math.round((hourlyRate / 60) * duration);
  }
  
  const totalAmount = calculateTotal(baseAmount);
  
  // Create booking
  const booking: InsertBooking = {
    userId,
    pickupHelipadId: null,
    dropHelipadId: null,
    customPickupLocation: pickupLocation,
    customDropLocation: dropLocation,
    bookingType: 'custom',
    bookingDate: bookingDateTime,
    passengers,
    duration,
    totalAmount,
    paymentStatus: false,
    bookingStatus: 'confirmed',
    bookingReference: generateBookingReference(),
  };
  
  return await storage.createBooking(booking);
}
