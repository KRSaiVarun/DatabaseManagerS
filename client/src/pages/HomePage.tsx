import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import FeaturedHelipads from "@/components/home/FeaturedHelipads";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import LuxuryFleet from "@/components/home/LuxuryFleet";
import Partners from "@/components/home/Partners";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
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
