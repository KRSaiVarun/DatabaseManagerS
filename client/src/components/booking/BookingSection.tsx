import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PredefinedBookingForm from './PredefinedBookingForm';
import CustomBookingForm from './CustomBookingForm';

export default function BookingSection() {
  const [bookingType, setBookingType] = useState<'predefined' | 'custom'>('predefined');

  return (
    <section id="booking" className="py-16 bg-white dark:bg-neutral-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold font-heading mb-2">Book Your Helicopter</h2>
          <p className="text-neutral-600 dark:text-neutral-300">Select your preferred booking mode</p>
        </div>
        
        <Tabs
          defaultValue="predefined"
          value={bookingType}
          onValueChange={(value) => setBookingType(value as 'predefined' | 'custom')}
          className="max-w-4xl mx-auto"
        >
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="predefined">Predefined Routes</TabsTrigger>
            <TabsTrigger value="custom">Custom Route</TabsTrigger>
          </TabsList>
          
          <TabsContent value="predefined">
            <PredefinedBookingForm />
          </TabsContent>
          
          <TabsContent value="custom">
            <CustomBookingForm />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
