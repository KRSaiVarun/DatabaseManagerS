import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";
import AuthModal from "@/components/auth/AuthModal";
import Header from "@/components/layout/Header";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Users, 
  CreditCard,
  QrCode,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Smartphone
} from "lucide-react";

// Booking form schema
const bookingSchema = z.object({
  fromLocation: z.string().min(1, "Please enter departure location"),
  toLocation: z.string().min(1, "Please enter arrival location"),
  date: z.string().min(1, "Please select date"),
  time: z.string().min(1, "Please select time"),
  passengers: z.string().min(1, "Please select number of passengers"),
  contactName: z.string()
    .min(2, "Name must be at least 2 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  contactEmail: z.string()
    .email("Invalid email address")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email format"),
  contactPhone: z.string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number"),
  paymentMethod: z.enum(["upi", "card"], {
    required_error: "Please select a payment method",
  }),
  specialRequests: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

interface Helipad {
  id: number;
  name: string;
  location: string;
}

interface Route {
  id: number;
  name: string;
  sourceLocation: string;
  destinationLocation: string;
  sourceHelipadId: number | null;
  destinationHelipadId: number | null;
  basePrice: number;
  duration: number;
  distance: number;
}

export default function BookingPage() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'details' | 'payment' | 'success'>('details');
  const [bookingData, setBookingData] = useState<any>(null);
  const [showUpiQr, setShowUpiQr] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      contactName: user?.name || "",
      contactEmail: user?.email || "",
      contactPhone: user?.phone || "",
      paymentMethod: "upi",
    },
  });

  // Fetch helipads and routes
  const { data: helipads } = useQuery<Helipad[]>({
    queryKey: ['/api/helipads'],
  });

  const { data: routes } = useQuery<Route[]>({
    queryKey: ['/api/routes'],
  });

  // Create booking mutation
  const createBookingMutation = useMutation({
    mutationFn: async (data: BookingFormValues) => {
      // Try to find matching route by location names
      const selectedRoute = routes?.find(route => {
        return route.sourceLocation.toLowerCase() === data.fromLocation.toLowerCase() && 
               route.destinationLocation.toLowerCase() === data.toLocation.toLowerCase();
      });

      const bookingPayload = {
        fromLocation: data.fromLocation,
        toLocation: data.toLocation,
        routeId: selectedRoute?.id || null,
        bookingDate: data.date,
        bookingTime: data.time,
        passengers: parseInt(data.passengers),
        contactName: data.contactName,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        paymentMethod: data.paymentMethod,
        specialRequests: data.specialRequests,
      };

      const res = await apiRequest('POST', '/api/bookings/custom', bookingPayload);
      return res.json();
    },
    onSuccess: (data) => {
      setBookingData(data);
      setCurrentStep('success');
      toast({
        title: "Booking Confirmed!",
        description: "Your helicopter booking has been successfully created.",
      });
    },
    onError: (error) => {
      toast({
        title: "Booking Failed",
        description: error instanceof Error ? error.message : "Failed to create booking",
        variant: "destructive",
      });
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-neutral-900 dark:to-neutral-800">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-4">Please Log In</h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                You need to be logged in to make a booking.
              </p>
            </div>
            <Button
              onClick={() => setIsAuthModalOpen(true)}
              className="w-full"
              size="lg"
            >
              Login / Sign Up
            </Button>
          </div>
        </div>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </div>
    );
  }

  const onSubmit = (data: BookingFormValues) => {
    setIsProcessing(true);
    
    // Stage 1: Validate booking details
    setTimeout(() => {
      if (data.paymentMethod === 'upi') {
        setCurrentStep('payment');
        setShowUpiQr(true);
        setIsProcessing(false);
      } else {
        // Stage 2: Process payment
        setTimeout(() => {
          createBookingMutation.mutate(data);
          setIsProcessing(false);
        }, 1500);
      }
    }, 1000);
  };

  const handleUpiPaymentComplete = () => {
    setIsProcessing(true);
    
    // Stage 2: Process UPI payment
    setTimeout(() => {
      const formData = form.getValues();
      createBookingMutation.mutate(formData);
      setIsProcessing(false);
    }, 2000);
  };

  const calculatePrice = () => {
    const fromLocation = form.watch('fromLocation');
    const toLocation = form.watch('toLocation');
    const passengers = form.watch('passengers');

    if (!fromLocation || !toLocation || !passengers) {
      return 0;
    }

    // Check if there's a matching route
    let basePrice = 0;
    
    if (routes) {
      const selectedRoute = routes.find(route => {
        return route.sourceLocation.toLowerCase().includes(fromLocation.toLowerCase()) && 
               route.destinationLocation.toLowerCase().includes(toLocation.toLowerCase());
      });
      
      if (selectedRoute) {
        basePrice = selectedRoute.basePrice;
      }
    }
    
    // Default pricing for custom routes
    if (basePrice === 0) {
      basePrice = 100000; // Default ₹1000 base price
    }

    const passengerCount = parseInt(passengers) || 1;
    const total = basePrice * passengerCount;
    return Math.round(total * 1.18); // Add 18% GST
  };

  const renderBookingForm = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-neutral-900 dark:to-neutral-800">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Book Your Helicopter</CardTitle>
            <CardDescription>
              Complete the form below to book your helicopter journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Route Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fromLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          From
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter departure location" 
                            {...field}
                            list="from-locations"
                          />
                        </FormControl>
                        <datalist id="from-locations">
                          {helipads?.map((helipad) => (
                            <option key={`helipad-${helipad.id}`} value={helipad.name} />
                          ))}
                          {routes?.map((route) => (
                            <option key={`route-from-${route.id}`} value={route.sourceLocation} />
                          ))}
                        </datalist>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="toLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          To
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter arrival location" 
                            {...field}
                            list="to-locations"
                          />
                        </FormControl>
                        <datalist id="to-locations">
                          {helipads?.map((helipad) => (
                            <option key={`helipad-${helipad.id}`} value={helipad.name} />
                          ))}
                          {routes?.map((route) => (
                            <option key={`route-to-${route.id}`} value={route.destinationLocation} />
                          ))}
                        </datalist>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Date
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} min={new Date().toISOString().split('T')[0]} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          Time
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Array.from({ length: 10 }, (_, i) => {
                              const hour = 9 + i;
                              return (
                                <SelectItem key={hour} value={`${hour}:00`}>
                                  {hour}:00
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="passengers"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          Passengers
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select passengers" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? 'Passenger' : 'Passengers'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Contact Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="contactName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                {/* Payment Method */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Payment Method</h3>
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            value={field.value}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                          >
                            <div className="flex items-center space-x-3 border rounded-lg p-4">
                              <RadioGroupItem value="upi" id="upi" />
                              <Label htmlFor="upi" className="flex items-center cursor-pointer flex-1">
                                <Smartphone className="h-5 w-5 mr-3 text-green-500" />
                                <div>
                                  <p className="font-medium">UPI Payment</p>
                                  <p className="text-sm text-neutral-500">Pay using any UPI app</p>
                                </div>
                              </Label>
                            </div>
                            
                            <div className="flex items-center space-x-3 border rounded-lg p-4">
                              <RadioGroupItem value="card" id="card" />
                              <Label htmlFor="card" className="flex items-center cursor-pointer flex-1">
                                <CreditCard className="h-5 w-5 mr-3 text-blue-500" />
                                <div>
                                  <p className="font-medium">Credit/Debit Card</p>
                                  <p className="text-sm text-neutral-500">Visa, Mastercard, RuPay</p>
                                </div>
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Price Summary */}
                {calculatePrice() > 0 && (
                  <Card className="bg-blue-50 dark:bg-blue-900/20">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold">Total Amount:</span>
                        <span className="text-2xl font-bold text-primary">
                          {formatCurrency(calculatePrice())}
                        </span>
                      </div>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        Includes 18% GST
                      </p>
                    </CardContent>
                  </Card>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  size="lg"
                  disabled={createBookingMutation.isPending || calculatePrice() === 0 || isProcessing}
                >
                  {isProcessing ? "Processing..." : createBookingMutation.isPending ? "Processing..." : "Proceed to Payment"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        </div>
      </div>
    </div>
  );

  const renderUpiPayment = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-neutral-900 dark:to-neutral-800">
      <Header />
      <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center">
              <QrCode className="h-5 w-5 mr-2" />
              UPI Payment
            </CardTitle>
            <CardDescription>
              Scan the QR code with any UPI app to complete payment
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            {/* QR Code placeholder */}
            <div className="flex justify-center">
              <div className="w-64 h-64 border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg flex items-center justify-center bg-white">
                <div className="text-center">
                  <QrCode className="h-16 w-16 mx-auto mb-4 text-neutral-400" />
                  <p className="text-sm text-neutral-500">QR Code</p>
                  <p className="text-xs text-neutral-400 mt-2">Amount: {formatCurrency(calculatePrice())}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium">Payment Details:</p>
              <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg">
                <p className="text-sm"><strong>Merchant:</strong> Vayu Vihar</p>
                <p className="text-sm"><strong>Amount:</strong> {formatCurrency(calculatePrice())}</p>
                <p className="text-sm"><strong>UPI ID:</strong> vayuvihar@paytm</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                After scanning and completing payment, click the button below
              </p>
              <Button onClick={handleUpiPaymentComplete} className="w-full" size="lg">
                <CheckCircle className="h-4 w-4 mr-2" />
                I Have Completed Payment
              </Button>
            </div>

            <Button variant="outline" onClick={() => setCurrentStep('details')} className="w-full">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Booking Details
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </div>
            <CardTitle className="text-2xl text-green-600">Booking Confirmed!</CardTitle>
            <CardDescription>
              Your helicopter booking has been successfully confirmed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {bookingData && (
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-400 mb-2">Booking Details</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Booking Reference:</strong> {bookingData.booking?.bookingReference}</p>
                  <p><strong>Amount Paid:</strong> {formatCurrency(calculatePrice())}</p>
                  <p><strong>Route:</strong> {form.getValues('fromLocation')} → {form.getValues('toLocation')}</p>
                  <p><strong>Date & Time:</strong> {form.getValues('date')} at {form.getValues('time')}</p>
                  <p><strong>Passengers:</strong> {form.getValues('passengers')}</p>
                </div>
              </div>
            )}

            <div className="text-center space-y-4">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                You will receive a confirmation email and SMS with all booking details shortly.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={() => window.location.href = '/my-bookings'} className="w-full">
                  View My Bookings
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/'} className="w-full">
                  Back to Home
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {currentStep === 'details' && renderBookingForm()}
      {currentStep === 'payment' && showUpiQr && renderUpiPayment()}
      {currentStep === 'success' && renderSuccess()}
    </div>
  );
}