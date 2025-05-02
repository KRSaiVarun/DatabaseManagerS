import { storage } from '../storage';
import { InsertPayment } from '@shared/schema';
import { createHash } from 'crypto';

interface PaymentRequest {
  bookingId: number;
  amount: number;
  paymentMethod: string;
}

interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  error?: string;
  transactionDetails?: any;
}

// Process payment through Razorpay or other payment gateway
export async function processPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
  const { bookingId, amount, paymentMethod } = paymentRequest;
  
  try {
    // In a real application, this would integrate with Razorpay API
    // For now, we'll simulate a successful payment
    
    // Generate a unique payment reference
    const paymentReference = `PAY-${createHash('md5').update(`${bookingId}-${Date.now()}`).digest('hex').substring(0, 8)}`;
    
    // Create payment record
    const payment: InsertPayment = {
      bookingId,
      amount,
      paymentReference,
      paymentMethod,
      paymentStatus: 'completed',
    };
    
    const savedPayment = await storage.createPayment(payment);
    
    // Update booking payment status
    const booking = await storage.getBooking(bookingId);
    if (booking) {
      await storage.updateBookingStatus(bookingId, 'confirmed');
    }
    
    return {
      success: true,
      paymentId: savedPayment.id.toString(),
      transactionDetails: {
        id: savedPayment.id,
        reference: paymentReference,
        method: paymentMethod,
        amount,
        status: 'completed',
        timestamp: new Date().toISOString(),
      }
    };
  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      error: 'Payment processing failed',
    };
  }
}

// Verify payment status (for webhook callbacks)
export async function verifyPayment(paymentId: string): Promise<boolean> {
  // In a real application, this would verify with Razorpay API
  // For now, we'll always return true
  return true;
}

// Process refund for cancelled bookings
export async function processRefund(bookingId: number): Promise<PaymentResponse> {
  try {
    // Get payment for booking
    const payment = await storage.getPaymentByBookingId(bookingId);
    
    if (!payment) {
      return {
        success: false,
        error: 'Payment not found',
      };
    }
    
    // In a real application, this would integrate with Razorpay API
    // For now, we'll simulate a successful refund
    
    // Generate a refund reference
    const refundReference = `REF-${createHash('md5').update(`${bookingId}-${Date.now()}`).digest('hex').substring(0, 8)}`;
    
    return {
      success: true,
      transactionDetails: {
        originalPaymentId: payment.id,
        refundReference,
        amount: payment.amount,
        status: 'refunded',
        timestamp: new Date().toISOString(),
      }
    };
  } catch (error) {
    console.error('Refund processing error:', error);
    return {
      success: false,
      error: 'Refund processing failed',
    };
  }
}
