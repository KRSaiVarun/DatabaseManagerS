import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Plane,
  Users,
  DollarSign,
  Plus,
  LogOut,
  MapPin,
  Clock,
  Eye,
  Route,
  Settings,
  Globe,
  Edit,
  Trash2,
} from "lucide-react";

interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
  totalHelipads: number;
  pendingBookings: number;
}

interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  createdAt: string;
}

interface Booking {
  id: number;
  userId: number;
  bookingReference: string;
  bookingDate: string;
  passengers: number;
  totalAmount: number;
  bookingStatus: string;
  createdAt: string;
}

interface Helipad {
  id: number;
  name: string;
  location: string;
}

interface RouteData {
  id: number;
  name: string;
  sourceHelipadId: number;
  destinationHelipadId: number;
  basePrice: number;
  duration: number;
}

export default function AdminDashboard() {
  const { isAuthenticated, isAdmin, isLoading, logoutUser } = useAuth();
  const [_, setLocation] = useLocation();
  const [isAddRouteOpen, setIsAddRouteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isViewUserOpen, setIsViewUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [isDeleteUserOpen, setIsDeleteUserOpen] = useState(false);
  const [isViewBookingOpen, setIsViewBookingOpen] = useState(false);
  const [isEditBookingOpen, setIsEditBookingOpen] = useState(false);
  const [isDeleteBookingOpen, setIsDeleteBookingOpen] = useState(false);
  const [editUserData, setEditUserData] = useState<Partial<User>>({});
  const [editBookingData, setEditBookingData] = useState<Partial<Booking>>({});
  const { toast } = useToast();

  // Route form state
  const [routeForm, setRouteForm] = useState({
    name: '',
    sourceLocation: '',
    destinationLocation: '',
    basePrice: '',
    duration: '',
    distance: '',
  });

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      setLocation("/admin/login");
    }
  }, [isAuthenticated, isAdmin, isLoading, setLocation]);

  // Fetch data
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ['/api/admin/statistics'],
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
  });

  const { data: bookings = [] } = useQuery<Booking[]>({
    queryKey: ['/api/admin/bookings'],
  });

  const { data: helipads = [] } = useQuery<Helipad[]>({
    queryKey: ['/api/helipads'],
  });

  const { data: routes = [] } = useQuery<RouteData[]>({
    queryKey: ['/api/routes'],
  });

  // Add route mutation
  const addRouteMutation = useMutation({
    mutationFn: async (routeData: any) => {
      const res = await apiRequest('POST', '/api/admin/routes', routeData);
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Route Added Successfully",
        description: "The new route has been added and is now available for booking.",
      });
      setIsAddRouteOpen(false);
      setRouteForm({
        name: '',
        sourceLocation: '',
        destinationLocation: '',
        basePrice: '',
        duration: '',
        distance: '',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/routes'] });
    },
    onError: (error) => {
      toast({
        title: "Failed to Add Route",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    },
  });

  // User CRUD mutations
  const updateUserMutation = useMutation({
    mutationFn: async (userData: { id: number; data: Partial<User> }) => {
      const response = await fetch(`/api/admin/users/${userData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData.data),
      });
      if (!response.ok) throw new Error('Failed to update user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "User updated",
        description: "User information has been successfully updated.",
      });
      setIsEditUserOpen(false);
      setSelectedUser(null);
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update user",
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete user');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: "User deleted",
        description: "User has been successfully removed.",
      });
      setIsDeleteUserOpen(false);
      setSelectedUser(null);
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    },
  });

  // Booking CRUD mutations
  const updateBookingMutation = useMutation({
    mutationFn: async (bookingData: { id: number; data: Partial<Booking> }) => {
      const response = await fetch(`/api/admin/bookings/${bookingData.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData.data),
      });
      if (!response.ok) throw new Error('Failed to update booking');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/bookings'] });
      toast({
        title: "Booking updated",
        description: "Booking information has been successfully updated.",
      });
      setIsEditBookingOpen(false);
      setSelectedBooking(null);
    },
    onError: (error: any) => {
      toast({
        title: "Update failed",
        description: error.message || "Failed to update booking",
        variant: "destructive",
      });
    },
  });

  const deleteBookingMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete booking');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/bookings'] });
      toast({
        title: "Booking deleted",
        description: "Booking has been successfully removed.",
      });
      setIsDeleteBookingOpen(false);
      setSelectedBooking(null);
    },
    onError: (error: any) => {
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete booking",
        variant: "destructive",
      });
    },
  });

  // CRUD handlers
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setIsViewUserOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setEditUserData({ name: user.name, email: user.email, phone: user.phone });
    setIsEditUserOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteUserOpen(true);
  };

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsViewBookingOpen(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setEditBookingData({ 
      bookingStatus: booking.bookingStatus,
      totalAmount: booking.totalAmount,
      passengers: booking.passengers 
    });
    setIsEditBookingOpen(true);
  };

  const handleDeleteBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsDeleteBookingOpen(true);
  };

  const handleLogout = async () => {
    await logoutUser();
    setLocation("/");
  };

  const handleAddRoute = () => {
    if (!routeForm.name || !routeForm.sourceLocation || !routeForm.destinationLocation || !routeForm.basePrice || !routeForm.duration || !routeForm.distance) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    addRouteMutation.mutate({
      name: routeForm.name,
      sourceLocation: routeForm.sourceLocation,
      destinationLocation: routeForm.destinationLocation,
      basePrice: parseInt(routeForm.basePrice),
      duration: parseInt(routeForm.duration),
      distance: parseFloat(routeForm.distance),
      sourceHelipadId: null,
      destinationHelipadId: null,
    });
  };

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

  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Plane className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-xl font-bold">Vayu Vihar Admin</h1>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={() => window.location.href = '/'}>
                <Globe className="h-4 w-4 mr-2" />
                View Site
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Total Bookings
                  </p>
                  <h3 className="text-2xl font-bold">
                    {stats?.totalBookings || 0}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Total Revenue
                  </p>
                  <h3 className="text-2xl font-bold">
                    {formatCurrency(stats?.totalRevenue || 0)}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Registered Users
                  </p>
                  <h3 className="text-2xl font-bold">
                    {stats?.totalUsers || 0}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full">
                  <Route className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                    Active Routes
                  </p>
                  <h3 className="text-2xl font-bold">
                    {routes.length}
                  </h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="routes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="routes">Routes Management</TabsTrigger>
            <TabsTrigger value="users">Users Management</TabsTrigger>
            <TabsTrigger value="bookings">Bookings Management</TabsTrigger>
          </TabsList>

          {/* Routes Management */}
          <TabsContent value="routes">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Routes Management</CardTitle>
                    <CardDescription>
                      Manage helicopter routes and pricing
                    </CardDescription>
                  </div>
                  <Dialog open={isAddRouteOpen} onOpenChange={setIsAddRouteOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Route
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add New Route</DialogTitle>
                        <DialogDescription>
                          Create a new helicopter route for customers to book
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="routeName">Route Name</Label>
                          <Input
                            id="routeName"
                            placeholder="e.g., City Center to Airport"
                            value={routeForm.name}
                            onChange={(e) => setRouteForm({ ...routeForm, name: e.target.value })}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="sourceLocation">Source Location</Label>
                            <Input
                              id="sourceLocation"
                              placeholder="e.g., Brigade Road, Bangalore"
                              value={routeForm.sourceLocation}
                              onChange={(e) => setRouteForm({ ...routeForm, sourceLocation: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="destinationLocation">Destination Location</Label>
                            <Input
                              id="destinationLocation"
                              placeholder="e.g., Electronic City, Bangalore"
                              value={routeForm.destinationLocation}
                              onChange={(e) => setRouteForm({ ...routeForm, destinationLocation: e.target.value })}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="basePrice">Base Price (₹)</Label>
                            <Input
                              id="basePrice"
                              type="number"
                              placeholder="e.g., 15000"
                              value={routeForm.basePrice}
                              onChange={(e) => setRouteForm({ ...routeForm, basePrice: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="duration">Duration (minutes)</Label>
                            <Input
                              id="duration"
                              type="number"
                              placeholder="e.g., 30"
                              value={routeForm.duration}
                              onChange={(e) => setRouteForm({ ...routeForm, duration: e.target.value })}
                            />
                          </div>
                          <div>
                            <Label htmlFor="distance">Distance (km)</Label>
                            <Input
                              id="distance"
                              type="number"
                              placeholder="e.g., 25.5"
                              value={routeForm.distance}
                              onChange={(e) => setRouteForm({ ...routeForm, distance: e.target.value })}
                            />
                          </div>
                        </div>
                        <Button 
                          onClick={handleAddRoute} 
                          className="w-full"
                          disabled={addRouteMutation.isPending}
                        >
                          {addRouteMutation.isPending ? "Adding..." : "Add Route"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Route Name</TableHead>
                      <TableHead>Source → Destination</TableHead>
                      <TableHead>Base Price</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {routes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <Route className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p>No routes configured yet</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      routes.map((route) => {
                        const sourceHelipad = helipads.find(h => h.id === route.sourceHelipadId);
                        const destinationHelipad = helipads.find(h => h.id === route.destinationHelipadId);
                        return (
                          <TableRow key={route.id}>
                            <TableCell className="font-medium">{route.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm">{sourceHelipad?.name || 'Unknown'}</span>
                                <MapPin className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">{destinationHelipad?.name || 'Unknown'}</span>
                              </div>
                            </TableCell>
                            <TableCell>{formatCurrency(route.basePrice)}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {route.duration} min
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="secondary">Active</Badge>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Management */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Users Management</CardTitle>
                <CardDescription>
                  View and manage registered users and their credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User Details</TableHead>
                      <TableHead>Contact Information</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8">
                          <Users className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p>No users found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">ID: {user.id}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{user.email}</p>
                              {user.phone && <p className="text-sm text-muted-foreground">{user.phone}</p>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                              {user.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewUser(user)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteUser(user)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Management */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Bookings Management</CardTitle>
                <CardDescription>
                  View and manage all helicopter bookings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Booking Reference</TableHead>
                      <TableHead>Date & Passengers</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <Calendar className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p>No bookings found</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      bookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-medium">
                            {booking.bookingReference}
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="text-sm">{new Date(booking.bookingDate).toLocaleDateString()}</p>
                              <p className="text-sm text-muted-foreground">{booking.passengers} passengers</p>
                            </div>
                          </TableCell>
                          <TableCell>{formatCurrency(booking.totalAmount)}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                booking.bookingStatus === 'confirmed' ? 'default' :
                                booking.bookingStatus === 'pending' ? 'secondary' : 'destructive'
                              }
                            >
                              {booking.bookingStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewBooking(booking)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditBooking(booking)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteBooking(booking)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* User View Modal */}
      <Dialog open={isViewUserOpen} onOpenChange={setIsViewUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>View user information</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <p className="font-medium">{selectedUser.name}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="font-medium">{selectedUser.email}</p>
              </div>
              <div>
                <Label>Phone</Label>
                <p className="font-medium">{selectedUser.phone || 'Not provided'}</p>
              </div>
              <div>
                <Label>Role</Label>
                <Badge variant={selectedUser.role === 'admin' ? 'default' : 'secondary'}>
                  {selectedUser.role}
                </Badge>
              </div>
              <div>
                <Label>Member Since</Label>
                <p className="font-medium">{new Date(selectedUser.createdAt || '').toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* User Edit Modal */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>Update user information</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input
                  id="edit-name"
                  value={editUserData.name || ''}
                  onChange={(e) => setEditUserData({ ...editUserData, name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  value={editUserData.email || ''}
                  onChange={(e) => setEditUserData({ ...editUserData, email: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={editUserData.phone || ''}
                  onChange={(e) => setEditUserData({ ...editUserData, phone: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditUserOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => updateUserMutation.mutate({ id: selectedUser.id, data: editUserData })}
                  disabled={updateUserMutation.isPending}
                >
                  {updateUserMutation.isPending ? 'Updating...' : 'Update User'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* User Delete Modal */}
      <AlertDialog open={isDeleteUserOpen} onOpenChange={setIsDeleteUserOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
              {selectedUser && (
                <div className="mt-2 p-2 bg-neutral-100 rounded">
                  <strong>{selectedUser.name}</strong> ({selectedUser.email})
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedUser && deleteUserMutation.mutate(selectedUser.id)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Booking View Modal */}
      <Dialog open={isViewBookingOpen} onOpenChange={setIsViewBookingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
            <DialogDescription>View booking information</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div>
                <Label>Booking Reference</Label>
                <p className="font-medium">{selectedBooking.bookingReference}</p>
              </div>
              <div>
                <Label>Date</Label>
                <p className="font-medium">{new Date(selectedBooking.bookingDate).toLocaleDateString()}</p>
              </div>
              <div>
                <Label>Passengers</Label>
                <p className="font-medium">{selectedBooking.passengers}</p>
              </div>
              <div>
                <Label>Total Amount</Label>
                <p className="font-medium">{formatCurrency(selectedBooking.totalAmount)}</p>
              </div>
              <div>
                <Label>Status</Label>
                <Badge variant={
                  selectedBooking.bookingStatus === 'confirmed' ? 'default' :
                  selectedBooking.bookingStatus === 'pending' ? 'secondary' : 'destructive'
                }>
                  {selectedBooking.bookingStatus}
                </Badge>
              </div>
              <div>
                <Label>Created</Label>
                <p className="font-medium">{new Date(selectedBooking.createdAt || '').toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Booking Edit Modal */}
      <Dialog open={isEditBookingOpen} onOpenChange={setIsEditBookingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Booking</DialogTitle>
            <DialogDescription>Update booking information</DialogDescription>
          </DialogHeader>
          {selectedBooking && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-status">Status</Label>
                <Select
                  value={editBookingData.bookingStatus || ''}
                  onValueChange={(value) => setEditBookingData({ ...editBookingData, bookingStatus: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-passengers">Passengers</Label>
                <Input
                  id="edit-passengers"
                  type="number"
                  value={editBookingData.passengers || ''}
                  onChange={(e) => setEditBookingData({ ...editBookingData, passengers: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="edit-amount">Total Amount</Label>
                <Input
                  id="edit-amount"
                  type="number"
                  value={editBookingData.totalAmount || ''}
                  onChange={(e) => setEditBookingData({ ...editBookingData, totalAmount: parseFloat(e.target.value) })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditBookingOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={() => updateBookingMutation.mutate({ id: selectedBooking.id, data: editBookingData })}
                  disabled={updateBookingMutation.isPending}
                >
                  {updateBookingMutation.isPending ? 'Updating...' : 'Update Booking'}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Booking Delete Modal */}
      <AlertDialog open={isDeleteBookingOpen} onOpenChange={setIsDeleteBookingOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this booking? This action cannot be undone.
              {selectedBooking && (
                <div className="mt-2 p-2 bg-neutral-100 rounded">
                  <strong>{selectedBooking.bookingReference}</strong> - {formatCurrency(selectedBooking.totalAmount)}
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedBooking && deleteBookingMutation.mutate(selectedBooking.id)}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete Booking
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
