import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { scrollToElement } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

interface HeroImage {
  url: string;
  alt: string;
}

const heroImages: HeroImage[] = [
  {
    url: "https://images.unsplash.com/photo-1527061011008-3bc98128d7a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80",
    alt: "Helicopter landing pad with cityscape"
  },
  {
    url: "https://images.unsplash.com/photo-1593428338330-d7d8194b68ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80",
    alt: "Helicopter view of Bangalore"
  },
  {
    url: "https://images.unsplash.com/photo-1608378007652-3c39809bb665?ixlib=rb-4.0.3&auto=format&fit=crop&w=1500&q=80",
    alt: "Luxury helicopter interior"
  }
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleBookingClick = () => {
    scrollToElement("booking");
  };

  const handleMyBookingsClick = () => {
    if (isAuthenticated) {
      window.location.href = "/my-bookings";
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <section className="relative">
        <div className="h-[500px] md:h-[600px] overflow-hidden relative">
          {heroImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
              style={{ backgroundImage: `url('${image.url}')` }}
              aria-hidden={index !== currentSlide}
            >
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            </div>
          ))}

          <div className="absolute inset-0 flex items-center justify-center text-center z-20">
            <div className="max-w-4xl px-6">
              <h1 className="text-3xl md:text-5xl font-bold text-white font-heading mb-6">
                Welcome to Vayu Vihar – Elevate Your Journey!
              </h1>
              <p className="text-lg md:text-xl text-white mb-8">
                Experience Bangalore from a new perspective with our exclusive helipad booking service.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button
                  size="lg"
                  onClick={handleBookingClick}
                  className="px-8 py-3 bg-secondary hover:bg-secondary-dark text-white font-bold"
                >
                  Book Now
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleMyBookingsClick}
                  className="px-8 py-3 bg-white hover:bg-neutral-100 text-primary font-bold"
                >
                  My Bookings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
    </>
  );
}
