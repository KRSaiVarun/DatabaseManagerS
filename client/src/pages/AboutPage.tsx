import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BarChart3, Plane, Users, UserCheck } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero section */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold mb-6">About Vayu Vihar</h1>
              <p className="text-xl mb-6">
                Bangalore's premier helipad booking service, revolutionizing urban transportation through the skies.
              </p>
            </div>
          </div>
        </section>

        {/* Company story section */}
        <section className="py-16 bg-white dark:bg-neutral-800">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Story</h2>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  Founded in 2020, Vayu Vihar emerged as a response to Bangalore's growing traffic congestion. We recognized the need for an alternative transportation method that could save valuable time for business professionals, tourists, and residents alike.
                </p>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  Our founding team, with backgrounds in aviation and technology, set out to create a seamless platform that connects strategic helipads across the city, making air travel accessible to a broader audience.
                </p>
                <p className="text-neutral-600 dark:text-neutral-300">
                  Today, Vayu Vihar has transformed from a startup into Bangalore's leading helicopter booking service, with plans to expand to other major Indian cities in the coming years.
                </p>
              </div>
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1626353930909-a339398088b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
                  alt="Bangalore aerial view" 
                  className="rounded-lg shadow-lg w-full"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats section */}
        <section className="py-16 bg-neutral-50 dark:bg-neutral-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Impact</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 mb-4">
                    <Plane className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">15+</div>
                  <p className="text-neutral-600 dark:text-neutral-400">Helipads</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 mb-4">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">500+</div>
                  <p className="text-neutral-600 dark:text-neutral-400">Monthly Bookings</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">5,000+</div>
                  <p className="text-neutral-600 dark:text-neutral-400">Happy Customers</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="pt-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 mb-4">
                    <UserCheck className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-bold text-primary mb-2">4.9</div>
                  <p className="text-neutral-600 dark:text-neutral-400">Average Rating</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 bg-white dark:bg-neutral-800">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="mission" className="max-w-3xl mx-auto">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="mission">Our Mission</TabsTrigger>
                <TabsTrigger value="vision">Our Vision</TabsTrigger>
              </TabsList>
              
              <TabsContent value="mission" className="p-6 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  To revolutionize urban mobility in Bangalore by providing safe, efficient, and luxurious helicopter transportation services that save valuable time and enhance travel experiences.
                </p>
                <p className="text-neutral-600 dark:text-neutral-300">
                  We are committed to making air travel more accessible while maintaining the highest standards of safety and customer service.
                </p>
              </TabsContent>
              
              <TabsContent value="vision" className="p-6 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-4">
                  To become India's leading urban air mobility platform, connecting major cities with a network of strategic helipads that transform daily commutes and business travel.
                </p>
                <p className="text-neutral-600 dark:text-neutral-300">
                  We envision a future where helicopter travel is a common transportation option, freeing people from ground congestion and reducing travel time significantly.
                </p>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Team section */}
        <section className="py-16 bg-neutral-50 dark:bg-neutral-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">Our Leadership Team</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="overflow-hidden">
                <div className="h-64 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="CEO" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-1">Rajiv Sharma</h3>
                  <p className="text-primary mb-3">Founder & CEO</p>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    Former Air Force pilot with 20+ years of aviation experience and a vision to transform urban mobility.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <div className="h-64 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="COO" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-1">Priya Nair</h3>
                  <p className="text-primary mb-3">Chief Operations Officer</p>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    Tech industry veteran with expertise in scaling operations and delivering exceptional customer experiences.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden">
                <div className="h-64 overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                    alt="CTO" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-1">Arjun Mehta</h3>
                  <p className="text-primary mb-3">Chief Technology Officer</p>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    Former lead developer at a major ride-sharing platform, bringing innovation to aerial transportation.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA section */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Experience Vayu Vihar?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have elevated their journey with Bangalore's premier helicopter service.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = '/booking'}
                className="bg-white text-primary hover:bg-neutral-100 border-white"
              >
                Book Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = '/contact'}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
