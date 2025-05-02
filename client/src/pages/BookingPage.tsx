import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BookingSection from "@/components/booking/BookingSection";
import { Card, CardContent } from "@/components/ui/card";

export default function BookingPage() {
  const [bookingComplete, setBookingComplete] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="py-10 bg-neutral-50 dark:bg-neutral-900">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold mb-2 text-center">Book Your Helicopter</h1>
            <p className="text-neutral-600 dark:text-neutral-300 text-center mb-8">
              Choose from our predefined routes or create a custom journey
            </p>
            
            {bookingComplete ? (
              <Card className="max-w-2xl mx-auto">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <svg 
                      className="mx-auto h-12 w-12 text-green-500 mb-4" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M5 13l4 4L19 7" 
                      />
                    </svg>
                    <h2 className="text-2xl font-semibold mb-2">Booking Confirmed</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Your helicopter is booked! We've sent the details to your email.
                    </p>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                      <p className="font-medium">Booking Reference: VV-12345678</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        You can view your booking details in the "My Bookings" section
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <BookingSection />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
