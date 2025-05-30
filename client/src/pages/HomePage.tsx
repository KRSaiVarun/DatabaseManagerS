import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import HeroSection from "@/components/home/HeroSection";
import FeaturedHelipads from "@/components/home/FeaturedHelipads";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import LuxuryFleet from "@/components/home/LuxuryFleet";
import Partners from "@/components/home/Partners";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";
import BookingSection from "@/components/booking/BookingSection";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Sidebar />
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <BookingSection />
        <FeaturedHelipads />
        <WhyChooseUs />
        <LuxuryFleet />
        <Partners />
        <Testimonials />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
