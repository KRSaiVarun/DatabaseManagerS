import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";

// Pages
import HomePage from "@/pages/HomePage";
import BookingPage from "@/pages/BookingPage";
import MyBookingsPage from "@/pages/MyBookingsPage";
import AboutPage from "@/pages/AboutPage";
import HelpCenterPage from "@/pages/HelpCenterPage";
import ProfilePage from "@/pages/ProfilePage";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminHelipads from "@/pages/admin/AdminHelipads";
import AdminBookings from "@/pages/admin/AdminBookings";
import AdminUsers from "@/pages/admin/AdminUsers";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={HomePage} />
      <Route path="/booking" component={BookingPage} />
      <Route path="/my-bookings" component={MyBookingsPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/help" component={HelpCenterPage} />
      
      {/* Admin routes */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/helipads" component={AdminHelipads} />
      <Route path="/admin/bookings" component={AdminBookings} />
      <Route path="/admin/users" component={AdminUsers} />
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
