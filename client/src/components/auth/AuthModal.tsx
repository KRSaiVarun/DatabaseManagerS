import { useState } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";

// Form schemas with enhanced validation
const loginSchema = z.object({
  email: z.string()
    .email("Invalid email address")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email format"),
  password: z.string()
    .min(1, "Password is required")
    .max(100, "Password is too long"),
});

const registerSchema = z.object({
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z.string()
    .email("Invalid email address")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email format"),
  phone: z.string()
    .regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number")
    .optional()
    .or(z.literal("")),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(50, "Password must be less than 50 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const adminLoginSchema = z.object({
  email: z.string()
    .email("Invalid email address")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email format"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .max(50, "Password must be less than 50 characters"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;
type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"signin" | "signup" | "admin">("signin");
  const { login, register, adminLogin, socialLoginHandler } = useAuth();

  // Login form
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Admin login form
  const adminLoginForm = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginSubmit = async (data: LoginFormValues) => {
    const success = await login(data.email, data.password);
    if (success) {
      onClose();
    }
  };

  const handleRegisterSubmit = async (data: RegisterFormValues) => {
    const success = await register(
      data.name, 
      data.email, 
      data.phone || "",
      data.password, 
      data.confirmPassword
    );
    if (success) {
      onClose();
    }
  };

  const handleAdminLoginSubmit = async (data: AdminLoginFormValues) => {
    const success = await adminLogin(data.email, data.password);
    if (success) {
      onClose();
      // Redirect to admin dashboard
      window.location.href = '/admin';
    }
  };

  const handleGoogleLogin = async () => {
    // This would be replaced with actual Google OAuth
    const token = "google-mock-token";
    const success = await socialLoginHandler("google", token);
    if (success) {
      onClose();
    }
  };

  const handleFacebookLogin = async () => {
    // This would be replaced with actual Facebook OAuth
    const token = "facebook-mock-token";
    const success = await socialLoginHandler("facebook", token);
    if (success) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="bg-primary text-white p-4 -mx-6 -mt-6 rounded-t-lg">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold">
              {activeTab === "signin" 
                ? "Sign In" 
                : activeTab === "signup" 
                  ? "Sign Up" 
                  : "Admin Login"}
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="text-white hover:bg-primary-dark"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        {activeTab !== "admin" ? (
          <Tabs 
            defaultValue="signin" 
            value={activeTab} 
            onValueChange={(value) => setActiveTab(value as "signin" | "signup")}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email/Phone</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Enter your password" {...field} />
                        </FormControl>
                        <p className="text-sm text-primary mt-1 cursor-pointer">
                          Forgot password?
                        </p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">
                    Sign In
                  </Button>
                </form>
              </Form>


            </TabsContent>

            <TabsContent value="signup">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={registerForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone (optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your phone" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Create a password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Confirm your password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">
                    Create Account
                  </Button>
                </form>
              </Form>
              <p className="text-sm text-neutral-500 text-center mt-4">
                By signing up, you agree to our{" "}
                <a href="#" className="text-primary">
                  Terms
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary">
                  Privacy Policy
                </a>
              </p>
            </TabsContent>
          </Tabs>
        ) : (
          <Form {...adminLoginForm}>
            <form onSubmit={adminLoginForm.handleSubmit(handleAdminLoginSubmit)} className="space-y-4">
              <FormField
                control={adminLoginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter admin email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={adminLoginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Admin Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter admin password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">
                Admin Login
              </Button>
            </form>
          </Form>
        )}

        <div className="px-6 py-3 bg-neutral-100 dark:bg-neutral-800 text-center -mx-6 -mb-6 rounded-b-lg">
          {activeTab === "admin" ? (
            <Button 
              variant="link" 
              className="text-sm text-primary"
              onClick={() => setActiveTab("signin")}
            >
              Return to User Login
            </Button>
          ) : (
            <Button 
              variant="link" 
              className="text-sm text-primary"
              onClick={() => setActiveTab("admin")}
            >
              Admin Login
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
