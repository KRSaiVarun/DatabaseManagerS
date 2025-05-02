import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Route } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/auth/AuthModal';

import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { formatCurrency, calculateGST, calculateTotalWithGST } from '@/lib/utils';

// Form schema
const formSchema = z.object({
  routeId: z.string().min(1, 'Please select a route'),
  bookingDate: z.string().min(1, 'Please select a date'),
  bookingTime: z.string().min(1, 'Please select a time'),
  passengers: z.string().min(1, 'Please select number of passengers'),
});

type FormData = z.infer<typeof formSchema>;

// Sample time slots
const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
];

// Placeholder routes for initial rendering
const placeholderRoutes: Partial<Route>[] = [
  { 
    id: 1, 
    name: 'Bangalore City → Kempegowda Helipad',
    basePrice: 1200000, // in paisa (₹12,000)
    duration: 20 // minutes
  },
  { 
    id: 2, 
    name: 'Bangalore City → Electronic City',
    basePrice: 1500000, // in paisa (₹15,000)
    duration: 25 // minutes
  },
  { 
    id: 3, 
    name: 'Bangalore City → Whitefield',
    basePrice: 1800000, // in paisa (₹18,000)
    duration: 30 // minutes
  },
  { 
    id: 4, 
    name: 'Bangalore City → Airport',
    basePrice: 2000000, // in paisa (₹20,000)
    duration: 35 // minutes
  },
  { 
    id: 5, 
    name: 'Bangalore → Mysore',
    basePrice: 4500000, // in paisa (₹45,000)
    duration: 60 // minutes
  },
];

export default function PredefinedBookingForm() {
  const [selectedRoutePrice, setSelectedRoutePrice] = useState<number>(1200000); // Default price in paisa (₹12,000)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  // Fetch routes
  const { data: routes = placeholderRoutes } = useQuery<Partial<Route>[]>({
    queryKey: ['/api/routes'],
  });

  // Form definition
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      routeId: '',
      bookingDate: '',
      bookingTime: '',
      passengers: '1',
    },
  });

  // Update price when route changes
  const onRouteChange = (routeId: string) => {
    const selectedRoute = routes.find(route => route.id === parseInt(routeId));
    if (selectedRoute && selectedRoute.basePrice) {
      setSelectedRoutePrice(selectedRoute.basePrice);
    }
  };

  // Payment mutation
  const paymentMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const res = await apiRequest('POST', '/api/bookings/predefined', bookingData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Booking Successful',
        description: 'Your booking has been confirmed. Check your email for details.',
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: 'Booking Failed',
        description: error instanceof Error ? error.message : 'Please try again later',
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: FormData) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }

    // Process payment
    paymentMutation.mutate({
      routeId: parseInt(data.routeId),
      bookingDate: data.bookingDate,
      bookingTime: data.bookingTime,
      passengers: parseInt(data.passengers),
      amount: calculateTotalWithGST(selectedRoutePrice),
    });
  };

  // Calculate GST and total
  const gstAmount = calculateGST(selectedRoutePrice);
  const totalAmount = selectedRoutePrice + gstAmount;

  // Get tomorrow's date for min date in date picker
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <>
      <Card className="max-w-4xl mx-auto bg-neutral-50 dark:bg-neutral-700 rounded-lg shadow-md">
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="routeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Route</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          onRouteChange(value);
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white dark:bg-neutral-800">
                            <SelectValue placeholder="Select a route" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {routes.map((route) => (
                            <SelectItem key={route.id} value={route.id?.toString() || ''}>
                              {route.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bookingDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <FormControl>
                        <Input 
                          type="date" 
                          min={minDate}
                          className="bg-white dark:bg-neutral-800"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="bookingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white dark:bg-neutral-800">
                            <SelectValue placeholder="Select time slot" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSlots.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time.split(':')[0]}:{time.split(':')[1]} {parseInt(time.split(':')[0]) >= 12 ? 'PM' : 'AM'}
                            </SelectItem>
                          ))}
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
                      <FormLabel>Passengers</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white dark:bg-neutral-800">
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

              <div className="bg-white dark:bg-neutral-600 p-4 rounded-md">
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-700 dark:text-neutral-200">Base Price</span>
                  <span className="font-medium">{formatCurrency(selectedRoutePrice)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-700 dark:text-neutral-200">GST (18%)</span>
                  <span className="font-medium">{formatCurrency(gstAmount)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-neutral-200 dark:border-neutral-500">
                  <span className="text-neutral-700 dark:text-neutral-200 font-bold">Total</span>
                  <span className="font-bold">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-secondary hover:bg-secondary-dark"
                disabled={paymentMutation.isPending}
              >
                {paymentMutation.isPending ? 'Processing...' : 'Proceed to Payment'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
