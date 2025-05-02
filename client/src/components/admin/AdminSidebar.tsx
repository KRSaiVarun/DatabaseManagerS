import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useDarkMode } from "@/hooks/use-dark-mode";
import { 
  BarChart3, 
  Plane, 
  Users, 
  Calendar, 
  LogOut, 
  ChevronLeft, 
  ChevronRight,
  Moon,
  Sun 
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [location] = useLocation();
  const { user, logoutUser } = useAuth();
  const { theme, toggleTheme } = useDarkMode();
  
  const isActive = (path: string) => location === path;

  const handleLogout = async () => {
    await logoutUser();
    window.location.href = "/";
  };

  return (
    <aside 
      className={`bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700 h-screen transition-all duration-300 flex flex-col ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header with logo */}
      <div className={`p-4 border-b border-neutral-200 dark:border-neutral-700 flex ${collapsed ? "justify-center" : "justify-between"} items-center`}>
        <div className="flex items-center gap-2">
          <Plane className="h-6 w-6 text-primary" />
          {!collapsed && <span className="font-bold">Vayu Vihar Admin</span>}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className={collapsed ? "hidden" : "block"}
          onClick={() => setCollapsed(true)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Collapsed toggle button */}
      {collapsed && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="mx-auto mt-2"
          onClick={() => setCollapsed(false)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4">
        <ul className="space-y-1 px-2">
          <li>
            <Link href="/admin">
              <a className={`flex items-center ${collapsed ? "justify-center" : "justify-start"} px-3 py-2 rounded-md ${
                isActive("/admin") 
                  ? "bg-primary text-white" 
                  : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              }`}>
                <BarChart3 className="h-5 w-5" />
                {!collapsed && <span className="ml-3">Dashboard</span>}
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/helipads">
              <a className={`flex items-center ${collapsed ? "justify-center" : "justify-start"} px-3 py-2 rounded-md ${
                isActive("/admin/helipads") 
                  ? "bg-primary text-white" 
                  : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              }`}>
                <Plane className="h-5 w-5" />
                {!collapsed && <span className="ml-3">Helipads</span>}
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/bookings">
              <a className={`flex items-center ${collapsed ? "justify-center" : "justify-start"} px-3 py-2 rounded-md ${
                isActive("/admin/bookings") 
                  ? "bg-primary text-white" 
                  : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              }`}>
                <Calendar className="h-5 w-5" />
                {!collapsed && <span className="ml-3">Bookings</span>}
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/users">
              <a className={`flex items-center ${collapsed ? "justify-center" : "justify-start"} px-3 py-2 rounded-md ${
                isActive("/admin/users") 
                  ? "bg-primary text-white" 
                  : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              }`}>
                <Users className="h-5 w-5" />
                {!collapsed && <span className="ml-3">Users</span>}
              </a>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
        {!collapsed && user && (
          <div className="flex items-center mb-4">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarFallback className="bg-primary text-white">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">{user.name}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Administrator</div>
            </div>
          </div>
        )}
        
        <div className={`flex ${collapsed ? "flex-col" : "justify-between"} items-center gap-2`}>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={toggleTheme}
            className={collapsed ? "mb-2" : ""}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {!collapsed && <span className="ml-2">{theme === 'dark' ? 'Light' : 'Dark'}</span>}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/10"
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span className="ml-2">Logout</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
}
