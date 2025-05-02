import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import AdminSidebar from "@/components/admin/AdminSidebar";
import Dashboard from "@/components/admin/Dashboard";

export default function AdminDashboard() {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const [_, setLocation] = useLocation();

  useEffect(() => {
    // Redirect if user is not authenticated or not an admin
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      setLocation("/admin/login");
    }
  }, [isAuthenticated, isAdmin, isLoading, setLocation]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-neutral-900">
        <div className="animate-pulse flex space-x-2">
          <div className="h-2 w-2 bg-primary rounded-full"></div>
          <div className="h-2 w-2 bg-primary rounded-full"></div>
          <div className="h-2 w-2 bg-primary rounded-full"></div>
        </div>
      </div>
    );
  }

  // If not authenticated or not admin, don't render anything (will redirect)
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-neutral-50 dark:bg-neutral-900">
      <AdminSidebar />
      <div className="flex-1 p-8">
        <Dashboard />
      </div>
    </div>
  );
}
