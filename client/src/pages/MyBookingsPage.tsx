import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Booking } from "@shared/schema";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import BookingsList from "@/components/my-bookings/BookingsList";
import BookingDetails from "@/components/my-bookings/BookingDetails";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { CalendarPlus, Plane } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import AuthModal from "@/components/auth/AuthModal";

export default function MyBookingsPage() {
  const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  // Fetch user bookings if authenticated
  const { data: bookings, isLoading: isBookingsLoading } = useQuery<Booking[]>({
    queryKey: ['/api/bookings/my-bookings'],
    enabled: isAuthenticated,
  });

  const handleBookingSelect = (bookingId: number) => {
    setSelectedBookingId(bookingId);
  };

  const handleBackToList = () => {
    setSelectedBookingId(null);
  };

  const selectedBooking = bookings?.find(booking => booking.id === selectedBookingId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Sidebar />
        <Header />
        <main className="flex-grow flex items-center justify-center">
          <div className="animate-pulse flex space-x-2">
            <div className="h-2 w-2 bg-primary rounded-full"></div>
            <div className="h-2 w-2 bg-primary rounded-full"></div>
            <div className="h-2 w-2 bg-primary rounded-full"></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Sidebar />
        <Header />
        <main className="flex-grow py-16 bg-neutral-50 dark:bg-neutral-900">
          <div className="container mx-auto px-4">
            <Card className="max-w-xl mx-auto text-center p-8">
              <div className="flex flex-col items-center justify-center space-y-4">
                <Plane className="h-16 w-16 text-primary mb-2" />
                <h1 className="text-2xl font-bold">My Bookings</h1>
                <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                  Please sign in to view your bookings and manage your reservations.
                </p>
                <Button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="px-8 py-2 bg-primary hover:bg-primary-dark text-white"
                >
                  Sign In
                </Button>
              </div>
            </Card>
          </div>
        </main>
        <Footer />
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      <Header />
      <main className="flex-grow py-12 bg-neutral-50 dark:bg-neutral-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Bookings</h1>
              <p className="text-neutral-600 dark:text-neutral-300">
                View and manage your helipad bookings
              </p>
            </div>
            <Button 
              onClick={() => window.location.href = '/booking'}
              className="mt-4 md:mt-0 flex items-center gap-2"
            >
              <CalendarPlus className="h-4 w-4" />
              Book New Flight
            </Button>
          </div>

          <Separator className="mb-8" />

          {selectedBookingId ? (
            <BookingDetails 
              booking={selectedBooking} 
              onBack={handleBackToList} 
            />
          ) : (
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="all">All Bookings</TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all">
                <BookingsList 
                  bookings={bookings} 
                  isLoading={isBookingsLoading}
                  onSelect={handleBookingSelect}
                  filter="all"
                />
              </TabsContent>
              
              <TabsContent value="upcoming">
                <BookingsList 
                  bookings={bookings} 
                  isLoading={isBookingsLoading}
                  onSelect={handleBookingSelect}
                  filter="upcoming"
                />
              </TabsContent>
              
              <TabsContent value="completed">
                <BookingsList 
                  bookings={bookings} 
                  isLoading={isBookingsLoading}
                  onSelect={handleBookingSelect}
                  filter="completed"
                />
              </TabsContent>
              
              <TabsContent value="cancelled">
                <BookingsList 
                  bookings={bookings} 
                  isLoading={isBookingsLoading}
                  onSelect={handleBookingSelect}
                  filter="cancelled"
                />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
