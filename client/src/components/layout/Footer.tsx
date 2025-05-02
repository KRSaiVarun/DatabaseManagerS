import { Plane } from "lucide-react";
import { Link } from "wouter";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { scrollToElement } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center mb-4">
              <Plane className="h-6 w-6 text-secondary mr-2" />
              <h3 className="text-xl font-bold font-heading">Vayu Vihar</h3>
            </div>
            <p className="text-neutral-400 mb-4">
              Elevate your journey with Bangalore's premier helipad booking service.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-neutral-400 hover:text-white transition"
                aria-label="Facebook"
              >
                <FaFacebook size={18} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-neutral-400 hover:text-white transition"
                aria-label="Twitter"
              >
                <FaTwitter size={18} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-neutral-400 hover:text-white transition"
                aria-label="Instagram"
              >
                <FaInstagram size={18} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-neutral-400 hover:text-white transition"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-bold font-heading mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link href="/" className="text-neutral-400 hover:text-white transition">Home</Link></li>
              <li><Link href="/about" className="text-neutral-400 hover:text-white transition">About Us</Link></li>
              <li><Link href="/booking" className="text-neutral-400 hover:text-white transition">Book Now</Link></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition" onClick={() => scrollToElement('helipads')}>Helipads</a></li>
              <li><a href="#" className="text-neutral-400 hover:text-white transition" onClick={() => scrollToElement('fleet')}>Fleet</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold font-heading mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-neutral-400 hover:text-white transition">FAQs</Link></li>
              <li><Link href="/help" className="text-neutral-400 hover:text-white transition">Help Center</Link></li>
              <li><Link href="/contact" className="text-neutral-400 hover:text-white transition">Contact Us</Link></li>
              <li><Link href="/privacy" className="text-neutral-400 hover:text-white transition">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-neutral-400 hover:text-white transition">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-bold font-heading mb-4">Contact</h4>
            <ul className="space-y-2 text-neutral-400">
              <li className="flex items-start">
                <span className="mt-1 mr-2">📍</span>
                <span>100 Airport Road, Bangalore 560017, Karnataka, India</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">📞</span>
                <span>+91 80 4567 8900</span>
              </li>
              <li className="flex items-center">
                <span className="mr-2">✉️</span>
                <span>info@vayuvihar.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-6 border-t border-neutral-800 text-center text-neutral-500 text-sm">
          <p>© {new Date().getFullYear()} Vayu Vihar. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
