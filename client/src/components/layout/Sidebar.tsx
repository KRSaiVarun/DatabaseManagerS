import { Link } from "wouter";
import { X, Plane, Home, Info, Calendar, ClipboardList, HelpCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { isAuthenticated, user } = useAuth();

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-neutral-800 shadow-lg transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out md:hidden`}
    >
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-700 flex justify-between items-center">
        <div className="flex items-center">
          <Plane className="h-6 w-6 text-primary mr-2" />
          <h2 className="text-lg font-bold font-heading">Vayu Vihar</h2>
        </div>
        <button 
          onClick={onClose} 
          className="p-2"
          aria-label="Close menu"
        >
          <X className="h-5 w-5 text-neutral-700 dark:text-neutral-200" />
        </button>
      </div>
      <nav className="p-4">
        <ul className="space-y-3">
          <li>
            <Link 
              href="/" 
              className="flex items-center py-2 px-3 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
              onClick={onClose}
            >
              <Home className="h-5 w-5 mr-2" />
              Home
            </Link>
          </li>
          <li>
            <Link 
              href="/about" 
              className="flex items-center py-2 px-3 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
              onClick={onClose}
            >
              <Info className="h-5 w-5 mr-2" />
              About
            </Link>
          </li>
          <li>
            <Link 
              href="/booking" 
              className="flex items-center py-2 px-3 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
              onClick={onClose}
            >
              <Calendar className="h-5 w-5 mr-2" />
              Booking
            </Link>
          </li>
          <li>
            <Link 
              href="/my-bookings" 
              className="flex items-center py-2 px-3 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
              onClick={onClose}
            >
              <ClipboardList className="h-5 w-5 mr-2" />
              My Bookings
            </Link>
          </li>
          <li>
            <Link 
              href="/help" 
              className="flex items-center py-2 px-3 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-700"
              onClick={onClose}
            >
              <HelpCircle className="h-5 w-5 mr-2" />
              Help Center
            </Link>
          </li>
          
          {isAuthenticated && user?.role === 'admin' && (
            <li className="pt-2 mt-2 border-t border-neutral-200 dark:border-neutral-700">
              <Link 
                href="/admin" 
                className="flex items-center py-2 px-3 rounded-md bg-primary text-white"
                onClick={onClose}
              >
                Admin Dashboard
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}
