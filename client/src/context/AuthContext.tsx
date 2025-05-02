import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@shared/schema';
import { getCurrentUser, loginUser, registerUser, logout, adminLogin, socialLogin } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string, confirmPassword: string) => Promise<boolean>;
  adminLogin: (email: string, password: string) => Promise<boolean>;
  socialLoginHandler: (provider: 'google' | 'facebook', token: string) => Promise<boolean>;
  logoutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadUser() {
      try {
        const loadedUser = await getCurrentUser();
        setUser(loadedUser);
      } catch (error) {
        console.error('Failed to load user:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadUser();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userData = await loginUser({ email, password });
      setUser(userData);
      toast({
        title: "Login successful",
        description: `Welcome back, ${userData.name}!`,
      });
      return true;
    } catch (error) {
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (
    name: string, 
    email: string, 
    phone: string,
    password: string, 
    confirmPassword: string
  ): Promise<boolean> => {
    try {
      const userData = await registerUser({ name, email, phone, password, confirmPassword });
      setUser(userData);
      toast({
        title: "Registration successful",
        description: `Welcome to Vayu Vihar, ${userData.name}!`,
      });
      return true;
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please check your details",
        variant: "destructive",
      });
      return false;
    }
  };

  const adminLoginHandler = async (email: string, password: string): Promise<boolean> => {
    try {
      const userData = await adminLogin({ email, password });
      setUser(userData);
      toast({
        title: "Admin login successful",
        description: `Welcome to the admin dashboard, ${userData.name}!`,
      });
      return true;
    } catch (error) {
      toast({
        title: "Admin login failed",
        description: error instanceof Error ? error.message : "Invalid admin credentials",
        variant: "destructive",
      });
      return false;
    }
  };

  const socialLoginHandler = async (provider: 'google' | 'facebook', token: string): Promise<boolean> => {
    try {
      const userData = await socialLogin(provider, token);
      setUser(userData);
      toast({
        title: "Login successful",
        description: `Welcome to Vayu Vihar, ${userData.name}!`,
      });
      return true;
    } catch (error) {
      toast({
        title: "Social login failed",
        description: error instanceof Error ? error.message : `Failed to login with ${provider}`,
        variant: "destructive",
      });
      return false;
    }
  };

  const logoutUser = async (): Promise<void> => {
    try {
      await logout();
      setUser(null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      toast({
        title: "Logout failed",
        description: error instanceof Error ? error.message : "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    adminLogin: adminLoginHandler,
    socialLoginHandler,
    logoutUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
