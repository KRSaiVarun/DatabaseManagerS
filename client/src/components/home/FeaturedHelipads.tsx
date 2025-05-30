import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helipad } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";
import { formatCurrency, scrollToElement } from "@/lib/utils";

// Placeholder data for initial rendering
const placeholderHelipads: Partial<Helipad>[] = [
  {
    id: 1,
    name: "Kempegowda Helipad",
    location: "Central Bangalore",
    description: "Central Bangalore, perfect for city tours and business travel.",
    imageUrl: "https://images.unsplash.com/photo-1564519263736-9fa8b54b9a28?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    pricePerHour: 1200000, // in paisa (₹12,000)
  },
  {
    id: 2,
    name: "Electronic City Helipad",
    location: "Electronic City",
    description: "Ideal for tech professionals and quick corporate transfers.",
    imageUrl: "https://images.unsplash.com/photo-1601221963958-55233d5977ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    pricePerHour: 1050000, // in paisa (₹10,500)
  },
  {
    id: 3,
    name: "Whitefield Luxury Helipad",
    location: "Whitefield",
    description: "Premium location with exclusive facilities and lounge access.",
    imageUrl: "https://images.unsplash.com/photo-1514919818404-1cca07c5414f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    pricePerHour: 1500000, // in paisa (₹15,000)
  },
];

export default function FeaturedHelipads() {
  const [helipads, setHelipads] = useState<Partial<Helipad>[]>(placeholderHelipads);

  const { data, isLoading, error } = useQuery<Helipad[]>({
    queryKey: ['/api/helipads/featured'],
  });

  useEffect(() => {
    if (data) {
      setHelipads(data);
    }
  }, [data]);

  const handleBookHelipad = () => {
    scrollToElement("booking");
  };

  return (
    <section id="helipads" className="py-16 bg-neutral-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading mb-2">Featured Helipads</h2>
          <p className="text-neutral-600 dark:text-neutral-300">
            Discover our premium locations across Bangalore
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {isLoading ? (
            // Skeleton loading states
            Array(3).fill(null).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex justify-between items-center mb-4">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))
          ) : error ? (
            <div className="col-span-3 text-center text-red-500">
              Failed to load helipads. Please try again later.
            </div>
          ) : (
            helipads.map((helipad) => (
              <Card key={helipad.id} className="bg-white dark:bg-neutral-800 overflow-hidden shadow-md hover:shadow-lg transition">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={helipad.imageUrl} 
                    alt={helipad.name} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold font-heading mb-2">{helipad.name}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-4">
                    {helipad.description}
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm">
                        {helipad.rating || "4.8"} ({helipad.reviewCount || "120"} reviews)
                      </span>
                    </div>
                    <div className="text-primary font-semibold">
                      {formatCurrency(helipad.pricePerHour || 0)}/hour
                    </div>
                  </div>
                  <Button 
                    onClick={handleBookHelipad} 
                    className="w-full bg-primary hover:bg-primary-dark"
                  >
                    Book This Helipad
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
        

      </div>
    </section>
  );
}
