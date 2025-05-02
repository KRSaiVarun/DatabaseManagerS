import { Button } from "@/components/ui/button";
import { scrollToElement } from "@/lib/utils";

export default function CallToAction() {
  const handleBookNow = () => {
    scrollToElement("booking");
  };

  const handleContactUs = () => {
    window.location.href = "/contact";
  };

  return (
    <section className="py-20 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold font-heading mb-6">Ready to Elevate Your Journey?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">
          Experience Bangalore from above and leave traffic behind with our premium helicopter service.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button
            size="lg"
            variant="outline"
            onClick={handleBookNow}
            className="px-8 py-3 bg-white text-primary hover:bg-neutral-100 border-white"
          >
            Book Now
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={handleContactUs}
            className="px-8 py-3 bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary"
          >
            Contact Us
          </Button>
        </div>
      </div>
    </section>
  );
}
