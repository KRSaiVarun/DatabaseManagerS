import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Moon, Sun, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDarkMode } from "@/hooks/use-dark-mode";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import { getInitials } from "@/lib/utils";
import Sidebar from "./Sidebar";

export default function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { theme, toggleTheme } = useDarkMode();
  const { user, isAuthenticated, logoutUser } = useAuth();
  const [location] = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleAuthModal = (open: boolean) => {
    setIsAuthModalOpen(open);
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white dark:bg-neutral-800 shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Title */}
            <div className="flex items-center space-x-2">
              <button
                className="md:hidden p-2"
                onClick={toggleSidebar}
                aria-label="Toggle menu"
              >
                <Menu className="h-6 w-6 text-neutral-700 dark:text-neutral-200" />
              </button>
              <Link href="/" className="flex items-center">
                <Plane className="h-6 w-6 text-primary mr-2" />
                <h1 className="text-xl font-bold font-heading">Vayu Vihar</h1>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className={`font-medium ${
                  isActive("/")
                    ? "text-primary"
                    : "text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary"
                }`}
              >
                Home
              </Link>
              <Link
                href="/about"
                className={`font-medium ${
                  isActive("/about")
                    ? "text-primary"
                    : "text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary"
                }`}
              >
                About
              </Link>
              <Link
                href="/booking"
                className={`font-medium ${
                  isActive("/booking")
                    ? "text-primary"
                    : "text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary"
                }`}
              >
                Booking
              </Link>
              <Link
                href="/my-bookings"
                className={`font-medium ${
                  isActive("/my-bookings")
                    ? "text-primary"
                    : "text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary"
                }`}
              >
                My Bookings
              </Link>
              <Link
                href="/help"
                className={`font-medium ${
                  isActive("/help")
                    ? "text-primary"
                    : "text-neutral-600 dark:text-neutral-300 hover:text-primary dark:hover:text-primary"
                }`}
              >
                Help Center
              </Link>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-yellow-300" />
                ) : (
                  <Moon className="h-5 w-5 text-neutral-700" />
                )}
              </Button>

              {/* User Profile / Login */}
              <div>
                {isAuthenticated && user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="rounded-full p-0">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatarUrl} alt={user.name} />
                          <AvatarFallback className="bg-primary text-white">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="ml-2 text-sm font-medium hidden md:inline">
                          {user.name}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link href="/profile">Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/my-bookings">My Bookings</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/settings">Settings</Link>
                      </DropdownMenuItem>
                      {user.role === 'admin' && (
                        <>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href="/admin">Admin Dashboard</Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleLogout}>
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-white"
                      onClick={() => toggleAuthModal(true)}
                    >
                      Login
                    </Button>
                    <Button
                      className="bg-primary text-white hover:bg-primary/90"
                      onClick={() => toggleAuthModal(true)}
                    >
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar */}
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => toggleAuthModal(false)} />
    </>
  );
}
