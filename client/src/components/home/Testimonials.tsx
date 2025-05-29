import { useQuery } from "@tanstack/react-query";
import { Testimonial, User } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import { getInitials } from "@/lib/utils";

// Placeholder data for initial rendering
const placeholderTestimonials = [
  {
    id: 1,
    user: { id: 1, name: "Rahul Kumar" },
    rating: 5,
    content: "Absolutely seamless experience! Booked a helicopter from Bangalore City to Electronic City and reached in just 15 minutes. Perfect for business executives."
  },
  {
    id: 2,
    user: { id: 2, name: "Sunita Patel" },
    rating: 4.5,
    content: "Used their custom booking service for an anniversary surprise. The team went above and beyond to make it special. Highly recommend for special occasions!"
  },
  {
    id: 3,
    user: { id: 3, name: "Arjun Gowda" },
    rating: 5,
    content: "As a property developer, I regularly use Vayu Vihar to visit multiple sites across Bangalore in a single day. The time saved is incredible and the service is top-notch."
  }
];

interface TestimonialWithUser extends Testimonial {
  user: User;
}

export default function Testimonials() {
  const { data, isLoading, error } = useQuery<TestimonialWithUser[]>({
    queryKey: ['/api/testimonials/approved'],
  });

  const testimonials = data || placeholderTestimonials;

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex text-yellow-400">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-current" />
        ))}
        {hasHalfStar && (
          <div className="relative">
            <Star className="h-4 w-4 fill-current" />
            <Star className="absolute left-0 top-0 h-4 w-4 fill-none" style={{ clipPath: "inset(0 50% 0 0)" }} />
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="py-16 bg-neutral-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading mb-2">What Our Customers Say</h2>
          <p className="text-neutral-600 dark:text-neutral-300">Hear from our satisfied clients</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {isLoading ? (
            // Skeleton loading states
            Array(3).fill(null).map((_, index) => (
              <Card key={index} className="bg-white dark:bg-neutral-800">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Skeleton className="w-12 h-12 rounded-full mr-4" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
              </Card>
            ))
          ) : error ? (
            <div className="col-span-3 text-center text-red-500">
              Failed to load testimonials. Please try again later.
            </div>
          ) : (
            testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="bg-white dark:bg-neutral-800 p-6 rounded-lg shadow-md">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-primary font-bold mr-4">
                      {testimonial.user ? getInitials(testimonial.user.name) : 'U'}
                    </div>
                    <div>
                      <h4 className="font-bold font-heading">{testimonial.user ? testimonial.user.name : 'Verified Customer'}</h4>
                      {renderStars(testimonial.rating)}
                    </div>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
