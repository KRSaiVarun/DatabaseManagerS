import { Button } from "@/components/ui/button";

export default function AboutSection() {
  return (
    <section id="about" className="py-16 bg-neutral-50 dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1626353930909-a339398088b1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
              alt="Bangalore aerial view" 
              className="rounded-lg shadow-lg w-full"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold font-heading mb-6">About Vayu Vihar</h2>
            <p className="text-neutral-600 dark:text-neutral-300 mb-4">
              Founded in 2020, Vayu Vihar has revolutionized urban mobility in Bangalore with our premium helipad booking service. We connect the busiest parts of the city through our strategic helipad network.
            </p>
            <p className="text-neutral-600 dark:text-neutral-300 mb-6">
              Our mission is to provide efficient, luxurious, and safe helicopter transportation services that save valuable time for business executives, tourists, and anyone looking to avoid Bangalore's notorious traffic.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-primary mb-1">15+</div>
                <div className="text-neutral-600 dark:text-neutral-400">Helipads</div>
              </div>
              <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-primary mb-1">500+</div>
                <div className="text-neutral-600 dark:text-neutral-400">Monthly Bookings</div>
              </div>
              <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-primary mb-1">12</div>
                <div className="text-neutral-600 dark:text-neutral-400">Helicopters</div>
              </div>
              <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg shadow text-center">
                <div className="text-3xl font-bold text-primary mb-1">4.9</div>
                <div className="text-neutral-600 dark:text-neutral-400">Avg. Rating</div>
              </div>
            </div>
            
            <Button className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold" onClick={() => window.location.href = "/about"}>
              Learn More About Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
