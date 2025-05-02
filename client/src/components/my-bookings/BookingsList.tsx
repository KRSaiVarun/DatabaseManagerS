import { Booking } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, AlertTriangle } from "lucide-react";
import { formatDate, formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface BookingsListProps {
  bookings?: Booking[];
  isLoading: boolean;
  onSelect: (bookingId: number) => void;
  filter: 'all' | 'upcoming' | 'completed' | 'cancelled';
}

export default function BookingsList({ bookings, isLoading, onSelect, filter }: BookingsListProps) {
  // Filter bookings based on the selected filter
  const filteredBookings = bookings?.filter((booking) => {
    if (filter === 'all') return true;
    
    if (filter === 'upcoming') {
      return ['pending', 'confirmed'].includes(booking.bookingStatus) && 
             new Date(booking.bookingDate) >= new Date();
    }
    
    if (filter === 'completed') {
      return booking.bookingStatus === 'completed';
    }
    
    if (filter === 'cancelled') {
      return booking.bookingStatus === 'cancelled';
    }
    
    return true;
  });

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

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array(3).fill(null).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-0">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!filteredBookings || filteredBookings.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 flex flex-col items-center justify-center text-center">
          <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No bookings found</h3>
          <p className="text-muted-foreground mb-6">
            {filter === 'all' 
              ? "You haven't made any bookings yet" 
              : filter === 'upcoming'
                ? "You don't have any upcoming bookings"
                : filter === 'completed'
                  ? "You don't have any completed bookings"
                  : "You don't have any cancelled bookings"}
          </p>
          <Button onClick={() => window.location.href = '/booking'}>
            Book a Helicopter
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Booking Reference</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Route Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredBookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell className="font-medium">{booking.bookingReference}</TableCell>
              <TableCell>{formatDate(booking.bookingDate)}</TableCell>
              <TableCell>
                {booking.bookingType === 'predefined' ? 'Predefined Route' : 'Custom Route'}
              </TableCell>
              <TableCell>{formatCurrency(booking.totalAmount)}</TableCell>
              <TableCell>{renderStatusBadge(booking.bookingStatus)}</TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onSelect(booking.id)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
