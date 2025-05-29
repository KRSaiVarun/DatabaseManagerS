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

  const handleLogout = async () => {
    await logoutUser();
    setLocation("/");
  };

  const handleAddRoute = () => {
    if (!routeForm.name || !routeForm.sourceHelipadId || !routeForm.destinationHelipadId || !routeForm.basePrice || !routeForm.duration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    addRouteMutation.mutate({
      name: routeForm.name,
      sourceHelipadId: parseInt(routeForm.sourceHelipadId),
      destinationHelipadId: parseInt(routeForm.destinationHelipadId),
      basePrice: parseInt(routeForm.basePrice),
      duration: parseInt(routeForm.duration),
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
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
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
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedUser(user)}
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
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedBooking(booking)}
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
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
