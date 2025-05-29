import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Shield, User, Phone, Mail, Calendar } from "lucide-react";

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  authProvider?: string;
  createdAt: string;
}

export default function UsersManager() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const { toast } = useToast();

  // Fetch users
  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
  });

  const viewUserDetails = (user: User) => {
    setSelectedUser(user);
    setIsDetailsOpen(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Users Management</CardTitle>
          <CardDescription>Loading users...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <User className="h-5 w-5 mr-2" />
            Users Management
          </CardTitle>
          <CardDescription>
            Manage all registered users and their credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User Details</TableHead>
                  <TableHead>Contact Information</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Registration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="text-muted-foreground">
                        <User className="h-8 w-8 mx-auto mb-2" />
                        <p>No users found</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="space-y-1">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Mail className="h-3 w-3 mr-1" />
                            {user.email}
                          </div>
                          {user.phone && (
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Phone className="h-3 w-3 mr-1" />
                              {user.phone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm">
                            <Calendar className="h-3 w-3 mr-1" />
                            {formatDate(user.createdAt)}
                          </div>
                          {user.authProvider && (
                            <Badge variant="outline" className="text-xs">
                              {user.authProvider}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewUserDetails(user)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Complete information about the selected user
            </DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="font-medium">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name</label>
                    <p className="text-sm bg-muted p-2 rounded">{selectedUser.name}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">User ID</label>
                    <p className="text-sm bg-muted p-2 rounded">{selectedUser.id}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email Address</label>
                    <p className="text-sm bg-muted p-2 rounded">{selectedUser.email}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <p className="text-sm bg-muted p-2 rounded">
                      {selectedUser.phone || 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div className="space-y-4">
                <h4 className="font-medium">Account Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Role</label>
                    <div className="flex items-center">
                      <Badge variant={selectedUser.role === 'admin' ? 'default' : 'secondary'}>
                        {selectedUser.role === 'admin' && <Shield className="h-3 w-3 mr-1" />}
                        {selectedUser.role}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Registration Date</label>
                    <p className="text-sm bg-muted p-2 rounded">
                      {formatDate(selectedUser.createdAt)}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Authentication Method</label>
                    <p className="text-sm bg-muted p-2 rounded">
                      {selectedUser.authProvider || 'Email/Password'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Login Credentials Section (Admin Only) */}
              <div className="space-y-4">
                <h4 className="font-medium text-red-600">Secure Information (Admin View)</h4>
                <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Login Email</label>
                    <p className="text-sm font-mono bg-red-100 dark:bg-red-900/30 p-2 rounded">
                      {selectedUser.email}
                    </p>
                  </div>
                  <div className="space-y-2 mt-3">
                    <label className="text-sm font-medium">Password Status</label>
                    <p className="text-sm bg-red-100 dark:bg-red-900/30 p-2 rounded">
                      {selectedUser.authProvider ? 'Social Login (No Password)' : 'Encrypted Password Set'}
                    </p>
                  </div>
                  {selectedUser.role === 'admin' && (
                    <div className="mt-3 p-3 bg-red-200 dark:bg-red-900/50 rounded">
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">
                        ⚠️ Admin Account - Privileged Access
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}