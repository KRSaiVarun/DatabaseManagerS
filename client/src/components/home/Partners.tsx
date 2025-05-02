import { useEffect, useState } from "react";

interface Partner {
  id: number;
  name: string;
  logoUrl: string;
}

// Placeholder partners data
const partnersData: Partner[] = [
  { id: 1, name: "BLADE", logoUrl: "https://placehold.co/120x60?text=BLADE" },
  { id: 2, name: "TAJ AIR", logoUrl: "https://placehold.co/120x60?text=TAJ+AIR" },
  { id: 3, name: "HELIGO", logoUrl: "https://placehold.co/120x60?text=HELIGO" },
  { id: 4, name: "GLOBAL VECTRA", logoUrl: "https://placehold.co/120x60?text=GLOBAL+VECTRA" },
  { id: 5, name: "AIRBUS", logoUrl: "https://placehold.co/120x60?text=AIRBUS" },
];

export default function Partners() {
  const [partners, setPartners] = useState<Partner[]>(partnersData);

  useEffect(() => {
    // In a real implementation, fetch partners from API
    // For now, use the placeholder data
  }, []);

  return (
    <section className="py-12 bg-white dark:bg-neutral-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold font-heading">Our Trusted Partners</h2>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {partners.map((partner) => (
            <div key={partner.id} className="grayscale hover:grayscale-0 transition duration-300">
              <img 
                src={partner.logoUrl} 
                alt={partner.name} 
                className="h-12"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
