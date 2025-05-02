import { MapPin, CheckCircle, Route } from "lucide-react";

export default function WhyChooseUs() {
  return (
    <section className="py-16 bg-white dark:bg-neutral-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading mb-2">Why Choose Vayu Vihar?</h2>
          <p className="text-neutral-600 dark:text-neutral-300">
            Experience the ultimate in helicopter travel with our premium services
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary bg-opacity-20 rounded-full flex items-center justify-center">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold font-heading mb-2">Exclusive Bangalore Helipads</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Access to premium locations across the city with strategic connectivity.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary bg-opacity-20 rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold font-heading mb-2">Instant Confirmation</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Real-time booking and immediate confirmation with 24/7 support.
            </p>
          </div>
          
          <div className="text-center p-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-primary bg-opacity-20 rounded-full flex items-center justify-center">
              <Route className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold font-heading mb-2">Flexible Custom Routes</h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              Design your journey with custom pick-up and drop-off locations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
