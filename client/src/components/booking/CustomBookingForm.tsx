import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { z } from 'zod';
import { useMutation } from '@tanstack/react-query';
import { Helicopter } from '@shared/schema';
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
import { formatCurrency, calculateGST, calculateTotalWithGST, calculateHelicopterDuration } from '@/lib/utils';

// Form schema
const formSchema = z.object({
  pickupLocation: z.string().min(5, 'Please enter a valid pickup location'),
  dropLocation: z.string().min(5, 'Please enter a valid drop location'),
  bookingDate: z.string().min(1, 'Please select a date'),
  bookingTime: z.string().min(1, 'Please select a time'),
  passengers: z.string().min(1, 'Please select number of passengers'),
  helicopterId: z.string().min(1, 'Please select a helicopter'),
});

type FormData = z.infer<typeof formSchema>;

// Sample time slots
const timeSlots = [
  '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'
];

// Placeholder helicopters for initial rendering
const placeholderHelicopters: Partial<Helicopter>[] = [
  { id: 1, name: 'Bell 407', model: 'Bell 407', capacity: 6, hourlyRate: 2500000 },
  { id: 2, name: 'Airbus H130', model: 'H130', capacity: 6, hourlyRate: 3000000 },
  { id: 3, name: 'AgustaWestland AW109', model: 'AW109', capacity: 7, hourlyRate: 3500000 },
  { id: 4, name: 'Robinson R66', model: 'R66', capacity: 5, hourlyRate: 2000000 },
];

export default function CustomBookingForm() {
  const [customRoutePrice, setCustomRoutePrice] = useState<number>(1850000); // Default price in paisa (₹18,500)
  const [duration, setDuration] = useState<number>(45); // Default duration in minutes
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  // Fetch helicopters
  const { data: helicopters = placeholderHelicopters } = useQuery<Partial<Helicopter>[]>({
    queryKey: ['/api/helicopters'],
  });

  // Form definition
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pickupLocation: '',
      dropLocation: '',
      bookingDate: '',
      bookingTime: '',
      passengers: '1',
      helicopterId: '',
    },
  });

  // Update price when form values change (simulating distance calculation)
  const onFormChange = () => {
    const pickupLocation = form.watch('pickupLocation');
    const dropLocation = form.watch('dropLocation');
    const helicopterId = form.watch('helicopterId');
    
    if (pickupLocation && dropLocation) {
      // In a real app, we would calculate the distance between pickup and drop
      // Here we're just simulating by using string lengths
      const distance = Math.max(30, (pickupLocation.length + dropLocation.length));
      const calculatedDuration = calculateHelicopterDuration(distance);
      setDuration(calculatedDuration);
      
      // Calculate base price based on distance and helicopter type
      let basePrice = distance * 40000; // ₹400 per km in paisa
      
      // Add helicopter premium if selected
      if (helicopterId) {
        const selectedHelicopter = helicopters.find(h => h.id === parseInt(helicopterId));
        if (selectedHelicopter && selectedHelicopter.hourlyRate) {
          // Add a portion of the hourly rate based on duration
          const hourlyRatePortion = (selectedHelicopter.hourlyRate / 60) * calculatedDuration;
          basePrice += hourlyRatePortion;
        }
      }
      
      setCustomRoutePrice(basePrice);
    }
  };

  // Payment mutation
  const paymentMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const res = await apiRequest('POST', '/api/bookings/custom', bookingData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Booking Request Successful',
        description: 'Your custom route booking request has been received. We will confirm shortly.',
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

    // Process custom booking
    paymentMutation.mutate({
      pickupLocation: data.pickupLocation,
      dropLocation: data.dropLocation,
      bookingDate: data.bookingDate,
      bookingTime: data.bookingTime,
      passengers: parseInt(data.passengers),
      helicopterId: parseInt(data.helicopterId),
      duration: duration,
      amount: calculateTotalWithGST(customRoutePrice),
    });
  };

  // Calculate GST and total
  const gstAmount = calculateGST(customRoutePrice);
  const totalAmount = customRoutePrice + gstAmount;

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
                  name="pickupLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pickup Location</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter pickup location" 
                          className="bg-white dark:bg-neutral-800"
                          {...field} 
                          onChange={(e) => {
                            field.onChange(e);
                            onFormChange();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dropLocation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Drop Location</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter destination" 
                          className="bg-white dark:bg-neutral-800"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            onFormChange();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="helicopterId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Helicopter Type</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          onFormChange();
                        }}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="bg-white dark:bg-neutral-800">
                            <SelectValue placeholder="Select helicopter" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {helicopters.map((helicopter) => (
                            <SelectItem key={helicopter.id} value={helicopter.id?.toString() || ''}>
                              {helicopter.name} ({helicopter.capacity} passengers)
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Estimated Duration</FormLabel>
                  <div className="px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md bg-white dark:bg-neutral-800">
                    <span>{duration} minutes</span>
                  </div>
                </FormItem>
              </div>

              <div className="bg-white dark:bg-neutral-600 p-4 rounded-md">
                <div className="flex justify-between mb-2">
                  <span className="text-neutral-700 dark:text-neutral-200">Custom Route Price</span>
                  <span className="font-medium">{formatCurrency(customRoutePrice)}</span>
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
                {paymentMutation.isPending ? 'Processing...' : 'Get Quote & Proceed'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
