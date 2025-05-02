import { useQuery } from "@tanstack/react-query";
import { Helicopter } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

// Placeholder data for initial rendering
const placeholderHelicopters: Partial<Helicopter>[] = [
  {
    id: 1,
    name: "Bell 407",
    model: "Bell 407",
    capacity: 6,
    imageUrl: "https://images.unsplash.com/photo-1567868075341-9a631027436b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    hourlyRate: 2500000, // in paisa (₹25,000)
  },
  {
    id: 2,
    name: "Airbus H130",
    model: "H130",
    capacity: 6,
    imageUrl: "https://images.unsplash.com/photo-1608968570831-d8174afcc8e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    hourlyRate: 3000000, // in paisa (₹30,000)
  },
  {
    id: 3,
    name: "AgustaWestland AW109",
    model: "AW109",
    capacity: 7,
    imageUrl: "https://images.unsplash.com/photo-1512447521505-d14fe4a21103?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    hourlyRate: 3500000, // in paisa (₹35,000)
  },
  {
    id: 4,
    name: "Robinson R66",
    model: "R66",
    capacity: 5,
    imageUrl: "https://images.unsplash.com/photo-1534571635040-8c1e2cca6a69?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    hourlyRate: 2000000, // in paisa (₹20,000)
  },
];

export default function LuxuryFleet() {
  const { data, isLoading, error } = useQuery<Helicopter[]>({
    queryKey: ['/api/helicopters'],
  });

  const helicopters = data || placeholderHelicopters;

  return (
    <section id="fleet" className="py-16 bg-neutral-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading mb-2">Our Luxury Fleet</h2>
          <p className="text-neutral-600 dark:text-neutral-300">
            Explore our range of premium helicopters for your journey
          </p>
        </div>
        
        <div className="flex overflow-x-auto pb-6 space-x-6 scrollbar-hide">
          {isLoading ? (
            // Skeleton loading states
            Array(4).fill(null).map((_, index) => (
              <div key={index} className="min-w-[300px] flex-shrink-0">
                <Skeleton className="h-48 w-full" />
                <div className="mt-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))
          ) : error ? (
            <div className="w-full text-center text-red-500">
              Failed to load helicopter fleet. Please try again later.
            </div>
          ) : (
            helicopters.map((helicopter) => (
              <Card 
                key={helicopter.id} 
                className="min-w-[300px] bg-white dark:bg-neutral-800 overflow-hidden shadow-md flex-shrink-0"
              >
                <div className="h-48 overflow-hidden">
                  <img 
                    src={helicopter.imageUrl} 
                    alt={helicopter.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="text-lg font-bold font-heading">{helicopter.name}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    {helicopter.capacity}-seater with {
                      helicopter.id === 1 ? "leather interior" : 
                      helicopter.id === 2 ? "panoramic views" :
                      helicopter.id === 3 ? "VIP configuration" :
                      "great views and comfort"
                    }
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
