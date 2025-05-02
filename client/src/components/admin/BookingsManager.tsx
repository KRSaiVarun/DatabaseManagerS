import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Booking, bookingStatusEnum } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDate } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  Ban,
  CheckCircle,
  Search,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Calendar,
  User,
  MapPin,
  Clock,
  CreditCard,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function BookingsManager() {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch bookings
  const { data: bookings, isLoading } = useQuery<Booking[]>({
    queryKey: ['/api/admin/bookings'],
  });

  // Update booking status mutation
  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest('PATCH', `/api/admin/bookings/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Booking updated",
        description: "The booking status has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/bookings'] });
      setIsViewDialogOpen(false);
      setIsCancelDialogOpen(false);
      setCurrentBooking(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update booking",
        variant: "destructive",
      });
    },
  });

  // Handle view booking details
  const handleViewBooking = (booking: Booking) => {
    setCurrentBooking(booking);
    setIsViewDialogOpen(true);
  };

  // Handle cancel booking
  const handleCancelBookingClick = (booking: Booking) => {
    setCurrentBooking(booking);
    setIsCancelDialogOpen(true);
  };

  // Confirm booking cancellation
  const confirmCancelBooking = () => {
    if (!currentBooking) return;
    updateStatusMutation.mutate({ id: currentBooking.id, status: "cancelled" });
  };

  // Confirm booking
  const confirmBooking = (booking: Booking) => {
    updateStatusMutation.mutate({ id: booking.id, status: "confirmed" });
  };

  // Complete booking
  const completeBooking = (booking: Booking) => {
    updateStatusMutation.mutate({ id: booking.id, status: "completed" });
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Pending</Badge>;
      case "confirmed":
        return <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Confirmed</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">Completed</Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Filter bookings based on search term and status
  const filteredBookings = bookings?.filter(booking => {
    const matchesSearch = 
      booking.bookingReference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (booking.customPickupLocation && booking.customPickupLocation.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (booking.customDropLocation && booking.customDropLocation.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "all" || booking.bookingStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Bookings Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bookings</CardTitle>
          <CardDescription>Manage all helicopter bookings</CardDescription>
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Booking Ref</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Route</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings && filteredBookings.length > 0 ? (
                    filteredBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.bookingReference}</TableCell>
                        <TableCell>{formatDate(booking.bookingDate)}</TableCell>
                        <TableCell>
                          {booking.bookingType === "predefined" ? 
                            "Predefined Route" : 
                            "Custom Route"}
                        </TableCell>
                        <TableCell>{formatCurrency(booking.totalAmount)}</TableCell>
                        <TableCell>
                          {getStatusBadge(booking.bookingStatus)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewBooking(booking)}
                            className="mr-2"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          
                          {booking.bookingStatus === "pending" && (
                            <>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => confirmBooking(booking)}
                                className="mr-2 text-green-500 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/10"
                              >
                                <CheckCircle className="h-4 w-4" />
                                <span className="sr-only">Confirm</span>
                              </Button>
                              
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={() => handleCancelBookingClick(booking)}
                                className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
                              >
                                <Ban className="h-4 w-4" />
                                <span className="sr-only">Cancel</span>
                              </Button>
                            </>
                          )}
                          
                          {booking.bookingStatus === "confirmed" && (
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => completeBooking(booking)}
                              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span className="sr-only">Complete</span>
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-neutral-500">
                        {searchTerm || statusFilter !== "all" ? 
                          "No bookings matching your search criteria" : 
                          "No bookings found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination controls would go here */}
          {filteredBookings && filteredBookings.length > 0 && (
            <div className="flex items-center justify-center space-x-2 mt-6">
              <Button variant="outline" size="icon" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="px-4">1</Button>
              <Button variant="outline" size="icon" disabled>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Booking Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>
              Booking Reference: {currentBooking?.bookingReference}
            </DialogDescription>
          </DialogHeader>
          
          {currentBooking && (
            <div className="space-y-4">
              <div className="flex items-center">
                <Badge className="mr-2">
                  {currentBooking.bookingType === "predefined" ? "Predefined" : "Custom"}
                </Badge>
                {getStatusBadge(currentBooking.bookingStatus)}
              </div>
              
              <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-md space-y-3">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-neutral-500" />
                  <span className="text-sm">{formatDate(currentBooking.bookingDate)}</span>
                </div>
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-neutral-500" />
                  <span className="text-sm">
                    Duration: {currentBooking.duration} minutes
                  </span>
                </div>
                
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2 text-neutral-500" />
                  <span className="text-sm">
                    Passengers: {currentBooking.passengers}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Route Details</h4>
                {currentBooking.bookingType === "predefined" ? (
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-neutral-500" />
                      <span className="text-sm">Predefined Route</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 text-neutral-500" />
                      <div>
                        <span className="text-sm font-medium">Pickup:</span>
                        <p className="text-sm">{currentBooking.customPickupLocation}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 mr-2 mt-0.5 text-neutral-500" />
                      <div>
                        <span className="text-sm font-medium">Drop:</span>
                        <p className="text-sm">{currentBooking.customDropLocation}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Payment Details</h4>
                <div className="flex items-center">
                  <CreditCard className="h-4 w-4 mr-2 text-neutral-500" />
                  <span className="text-sm">
                    Amount: {formatCurrency(currentBooking.totalAmount)}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm pl-6">
                    Payment Status: {currentBooking.paymentStatus ? "Paid" : "Pending"}
                  </span>
                </div>
              </div>
              
              {currentBooking.bookingStatus === "pending" && (
                <div className="flex space-x-2 pt-2">
                  <Button 
                    onClick={() => confirmBooking(currentBooking)}
                    className="flex-1"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirm
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      setIsCancelDialogOpen(true);
                    }}
                    className="flex-1"
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
              
              {currentBooking.bookingStatus === "confirmed" && (
                <Button 
                  onClick={() => completeBooking(currentBooking)}
                  className="w-full"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Completed
                </Button>
              )}
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.location.href = `/admin/users?id=${currentBooking.userId}`}
              >
                <User className="mr-2 h-4 w-4" />
                View Customer
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Send Notification
              </Button>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Booking Confirmation Dialog */}
      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel booking {currentBooking?.bookingReference}?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>No, Keep Booking</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmCancelBooking}
              className="bg-red-500 hover:bg-red-600"
            >
              {updateStatusMutation.isPending ? "Cancelling..." : "Yes, Cancel Booking"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
