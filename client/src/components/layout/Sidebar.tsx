import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Home,
  Calendar,
  BookOpen,
  HelpCircle,
  Info,
  Menu,
  X
} from "lucide-react";

const navigationItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/booking", label: "Book Flight", icon: Calendar },
  { href: "/my-bookings", label: "My Bookings", icon: BookOpen },
  { href: "/about", label: "About", icon: Info },
  { href: "/help", label: "Help Center", icon: HelpCircle },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [location] = useLocation();

  const NavItems = () => (
    <div className="flex flex-col space-y-2 p-4">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = location === item.href;
        
        return (
          <Link key={item.href} href={item.href}>
            <Button
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start text-left ${
                isActive 
                  ? "bg-primary text-primary-foreground" 
                  : "hover:bg-accent hover:text-accent-foreground"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Icon className="h-4 w-4 mr-3" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </div>
  );

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-40 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border shadow-lg hover:bg-white dark:hover:bg-neutral-800"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      
      <SheetContent 
        side="left" 
        className="w-80 p-0 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-sm border-r"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">VV</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold">Vayu Vihar</h2>
                <p className="text-xs text-muted-foreground">Helicopter Booking</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 overflow-y-auto">
            <NavItems />
          </div>

          {/* Footer */}
          <div className="border-t p-4">
            <div className="text-center text-sm text-muted-foreground">
              <p>&copy; 2024 Vayu Vihar</p>
              <p>Premium Helicopter Services</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}