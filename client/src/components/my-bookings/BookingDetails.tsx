import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Booking } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatCurrency } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  CreditCard,
  Download,
  FileText,
  XCircle,
  CheckCircle,
} from "lucide-react";

interface BookingDetailsProps {
  booking?: Booking;
  onBack: () => void;
}

export default function BookingDetails({ booking, onBack }: BookingDetailsProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Cancel booking mutation
  const cancelBookingMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('POST', `/api/bookings/${id}/cancel`, {});
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been successfully cancelled.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/bookings/my-bookings'] });
      onBack();
    },
    onError: (error) => {
      toast({
        title: "Cancellation Failed",
        description: error instanceof Error ? error.message : "Failed to cancel booking",
        variant: "destructive",
      });
    },
  });

  if (!booking) {
    return (
      <Card>
        <CardContent className="p-12 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium mb-2">Booking not found</h3>
            <Button onClick={onBack}>Go Back</Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleCancelBooking = () => {
    setIsDialogOpen(true);
  };

  const confirmCancellation = () => {
    cancelBookingMutation.mutate(booking.id);
    setIsDialogOpen(false);
  };

  // Helper function to render status badge
  const renderStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Pending</Badge>;
      case 'confirmed':
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Confirmed</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Completed</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Check if booking can be cancelled
  const canCancel = ['pending', 'confirmed'].includes(booking.bookingStatus) && 
                     new Date(booking.bookingDate) > new Date();

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between border-b">
          <div>
            <CardTitle className="text-2xl">Booking Details</CardTitle>
            <CardDescription>
              Reference: {booking.bookingReference}
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="mr-2">
              {booking.bookingType === 'predefined' ? 'Predefined' : 'Custom'}
            </Badge>
            {renderStatusBadge(booking.bookingStatus)}
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-md space-y-3">
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-neutral-500" />
                <span>{formatDate(booking.bookingDate)}</span>
              </div>
              
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-neutral-500" />
                <span>Duration: {booking.duration} minutes</span>
              </div>
              
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-neutral-500" />
                <span>Passengers: {booking.passengers}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-lg">Route Details</h4>
              
              {booking.bookingType === 'predefined' ? (
                <div className="space-y-2">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-neutral-500" />
                    <span>Predefined Route</span>
                  </div>
                  <p className="text-sm text-muted-foreground pl-7">
                    Between fixed helipads (details will be sent in your confirmation email)
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 mt-0.5 text-neutral-500" />
                    <div>
                      <span className="font-medium">Pickup:</span>
                      <p>{booking.customPickupLocation}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 mr-2 mt-0.5 text-neutral-500" />
                    <div>
                      <span className="font-medium">Drop:</span>
                      <p>{booking.customDropLocation}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-lg">Payment Details</h4>
              
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2 text-neutral-500" />
                <span>Amount: {formatCurrency(booking.totalAmount)}</span>
              </div>
              
              <div className="flex items-center">
                <CheckCircle className={`h-5 w-5 mr-2 ${booking.paymentStatus ? 'text-green-500' : 'text-yellow-500'}`} />
                <span>Payment Status: {booking.paymentStatus ? 'Paid' : 'Pending'}</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-medium text-lg">Booking Status</h4>
              
              <div className="flex items-center">
                <FileText className="h-5 w-5 mr-2 text-neutral-500" />
                <span>
                  Status: <span className="font-medium">{booking.bookingStatus.charAt(0).toUpperCase() + booking.bookingStatus.slice(1)}</span>
                </span>
              </div>
              
              {booking.bookingStatus === 'pending' && (
                <p className="text-sm text-yellow-600 dark:text-yellow-400 pl-7">
                  Your booking is being processed. You will receive a confirmation shortly.
                </p>
              )}
              
              {booking.bookingStatus === 'confirmed' && (
                <p className="text-sm text-green-600 dark:text-green-400 pl-7">
                  Your booking is confirmed. Please arrive 15 minutes before your scheduled time.
                </p>
              )}
              
              {booking.bookingStatus === 'completed' && (
                <p className="text-sm text-blue-600 dark:text-blue-400 pl-7">
                  This booking has been successfully completed.
                </p>
              )}
              
              {booking.bookingStatus === 'cancelled' && (
                <p className="text-sm text-red-600 dark:text-red-400 pl-7">
                  This booking has been cancelled.
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t px-6 py-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to All Bookings
          </Button>
          
          <div className="flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
            
            {canCancel && (
              <Button 
                variant="outline" 
                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
                onClick={handleCancelBooking}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Cancel Booking
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      {/* Cancel booking confirmation dialog */}
      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
              {booking.bookingStatus === 'confirmed' && (
                <p className="mt-2 text-red-500">
                  Note: Cancellation may be subject to our refund policy.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancellation}
              className="bg-red-500 hover:bg-red-600"
            >
              {cancelBookingMutation.isPending ? "Cancelling..." : "Yes, Cancel Booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
