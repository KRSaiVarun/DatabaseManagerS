import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Eye,
  Search,
  Mail,
  Phone,
  Clock,
  Ban,
  UserCheck,
  Lock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getInitials } from "@/lib/utils";

export default function UsersManager() {
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false);
  const [isResetPasswordDialogOpen, setIsResetPasswordDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch users
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
  });

  // Block/Unblock user mutation
  const blockUserMutation = useMutation({
    mutationFn: async ({ id, blocked }: { id: number; blocked: boolean }) => {
      const res = await apiRequest('PATCH', `/api/admin/users/${id}/block`, { blocked });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "User Updated",
        description: "User status has been successfully updated.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      setIsBlockDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user",
        variant: "destructive",
      });
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('POST', `/api/admin/users/${id}/reset-password`, {});
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Password Reset",
        description: "A password reset email has been sent to the user.",
      });
      setIsResetPasswordDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reset password",
        variant: "destructive",
      });
    },
  });

  // Handle view user details
  const handleViewUser = (user: User) => {
    setCurrentUser(user);
    setIsViewDialogOpen(true);
  };

  // Handle block/unblock user
  const handleBlockUserClick = (user: User) => {
    setCurrentUser(user);
    setIsBlockDialogOpen(true);
  };

  // Handle reset password
  const handleResetPasswordClick = (user: User) => {
    setCurrentUser(user);
    setIsResetPasswordDialogOpen(true);
  };

  // Confirm block/unblock user
  const confirmBlockUser = () => {
    if (!currentUser) return;
    
    // For demo purposes, we're toggling the blocked status
    // In a real app, you'd check the actual user.blocked property
    const isCurrentlyBlocked = false; // This would come from the user object
    
    blockUserMutation.mutate({ 
      id: currentUser.id, 
      blocked: !isCurrentlyBlocked 
    });
  };

  // Confirm reset password
  const confirmResetPassword = () => {
    if (!currentUser) return;
    resetPasswordMutation.mutate(currentUser.id);
  };

  // Filter users based on search term
  const filteredUsers = users?.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage all registered users</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-500" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers && filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-primary text-white">
                                {getInitials(user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={user.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' : ''}>
                            {user.role === 'admin' ? 'Admin' : 'User'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                            Active
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewUser(user)}
                            className="mr-2"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleBlockUserClick(user)}
                            className="mr-2 text-yellow-500 hover:text-yellow-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/10"
                          >
                            <Ban className="h-4 w-4" />
                            <span className="sr-only">Block</span>
                          </Button>
                          
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleResetPasswordClick(user)}
                            className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                          >
                            <Lock className="h-4 w-4" />
                            <span className="sr-only">Reset Password</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-neutral-500">
                        {searchTerm ? "No users matching your search" : "No users found"}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination controls would go here */}
          {filteredUsers && filteredUsers.length > 0 && (
            <div className="flex items-center justify-center space-x-2 mt-6">
              <Button variant="outline" size="icon" disabled>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="px-4">1</Button>
              <Button variant="outline" size="icon" disabled>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View User Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          
          {currentUser && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-primary text-white text-xl">
                    {getInitials(currentUser.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-bold">{currentUser.name}</h3>
                  <Badge variant="outline" className={currentUser.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400' : ''}>
                    {currentUser.role === 'admin' ? 'Admin' : 'User'}
                  </Badge>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-neutral-500" />
                  <span>{currentUser.email}</span>
                </div>
                
                {currentUser.phone && (
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-neutral-500" />
                    <span>{currentUser.phone}</span>
                  </div>
                )}
                
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-neutral-500" />
                  <span className="text-sm text-neutral-600 dark:text-neutral-400">
                    Joined: {new Date(currentUser.createdAt || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                <h4 className="font-medium">Account Status</h4>
                <div className="flex items-center">
                  <UserCheck className="h-4 w-4 mr-2 text-green-500" />
                  <span>Account is active and in good standing</span>
                </div>
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    // In a real app, you'd navigate to a list of this user's bookings
                  }}
                  className="flex-1"
                >
                  View Bookings
                </Button>
                
                <Button 
                  variant="outline"
                  onClick={() => {
                    setIsViewDialogOpen(false);
                    setIsBlockDialogOpen(true);
                  }}
                  className="flex-1"
                >
                  Block User
                </Button>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsViewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Block User Confirmation Dialog */}
      <AlertDialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Block User?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to block {currentUser?.name}? They will no longer be able to log in or make bookings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmBlockUser}
              className="bg-yellow-500 hover:bg-yellow-600"
            >
              {blockUserMutation.isPending ? "Processing..." : "Block User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Password Confirmation Dialog */}
      <AlertDialog open={isResetPasswordDialogOpen} onOpenChange={setIsResetPasswordDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset Password?</AlertDialogTitle>
            <AlertDialogDescription>
              This will send a password reset email to {currentUser?.email}. The user will need to create a new password.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmResetPassword}
              className="bg-blue-500 hover:bg-blue-600"
            >
              {resetPasswordMutation.isPending ? "Sending..." : "Send Reset Email"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
