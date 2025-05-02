import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { 
  AreaChart, 
  BarChart,
  ResponsiveContainer, 
  Area, 
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Legend
} from "recharts";
import { 
  Calendar, 
  Plane, 
  Users, 
  DollarSign,
  Clock
} from "lucide-react";

// Types for the dashboard data
interface DashboardStats {
  totalBookings: number;
  totalRevenue: number;
  totalUsers: number;
  totalHelipads: number;
  pendingBookings: number;
}

interface BookingData {
  name: string;
  bookings: number;
  revenue: number;
}

export default function Dashboard() {
  // Fetch dashboard statistics
  const { data: stats, isLoading: isStatsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/admin/statistics'],
  });

  // Fetch booking analytics
  const { data: dailyData, isLoading: isDailyLoading } = useQuery<BookingData[]>({
    queryKey: ['/api/admin/analytics/daily'],
  });

  const { data: weeklyData, isLoading: isWeeklyLoading } = useQuery<BookingData[]>({
    queryKey: ['/api/admin/analytics/weekly'],
  });

  const { data: monthlyData, isLoading: isMonthlyLoading } = useQuery<BookingData[]>({
    queryKey: ['/api/admin/analytics/monthly'],
  });

  // Placeholder data for when API data is loading
  const placeholderStats: DashboardStats = {
    totalBookings: 0,
    totalRevenue: 0,
    totalUsers: 0,
    totalHelipads: 0,
    pendingBookings: 0
  };

  const placeholderDailyData: BookingData[] = Array(7).fill(null).map((_, i) => ({
    name: `Day ${i+1}`,
    bookings: 0,
    revenue: 0
  }));

  const placeholderWeeklyData: BookingData[] = Array(4).fill(null).map((_, i) => ({
    name: `Week ${i+1}`,
    bookings: 0,
    revenue: 0
  }));

  const placeholderMonthlyData: BookingData[] = Array(6).fill(null).map((_, i) => ({
    name: `Month ${i+1}`,
    bookings: 0,
    revenue: 0
  }));

  // Use real data or placeholder data depending on loading state
  const dashboardStats = stats || placeholderStats;
  const dailyBookingsData = dailyData || placeholderDailyData;
  const weeklyBookingsData = weeklyData || placeholderWeeklyData;
  const monthlyBookingsData = monthlyData || placeholderMonthlyData;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Button>
          <Clock className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={isStatsLoading ? "animate-pulse" : ""}>
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
                  {dashboardStats.totalBookings.toLocaleString()}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={isStatsLoading ? "animate-pulse" : ""}>
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
                  {formatCurrency(dashboardStats.totalRevenue)}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={isStatsLoading ? "animate-pulse" : ""}>
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
                  {dashboardStats.totalUsers.toLocaleString()}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={isStatsLoading ? "animate-pulse" : ""}>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full">
                <Plane className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                  Active Helipads
                </p>
                <h3 className="text-2xl font-bold">
                  {dashboardStats.totalHelipads.toLocaleString()}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <Card>
        <CardHeader>
          <CardTitle>Booking Analytics</CardTitle>
          <CardDescription>View bookings and revenue trends</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily">
            <TabsList className="mb-4">
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily" className={isDailyLoading ? "animate-pulse" : ""}>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyBookingsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Area 
                      type="monotone" 
                      dataKey="bookings" 
                      yAxisId="left"
                      stroke="#0056b3" 
                      fill="#0056b3" 
                      fillOpacity={0.2} 
                      name="Bookings"
                    />
                    <Area 
                      type="monotone" 
                      dataKey="revenue" 
                      yAxisId="right"
                      stroke="#ff6b00" 
                      fill="#ff6b00" 
                      fillOpacity={0.2} 
                      name="Revenue (₹)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="weekly" className={isWeeklyLoading ? "animate-pulse" : ""}>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyBookingsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="bookings" 
                      yAxisId="left"
                      fill="#0056b3" 
                      name="Bookings"
                    />
                    <Bar 
                      dataKey="revenue" 
                      yAxisId="right"
                      fill="#ff6b00" 
                      name="Revenue (₹)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="monthly" className={isMonthlyLoading ? "animate-pulse" : ""}>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyBookingsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Bar 
                      dataKey="bookings" 
                      yAxisId="left"
                      fill="#0056b3" 
                      name="Bookings"
                    />
                    <Bar 
                      dataKey="revenue" 
                      yAxisId="right"
                      fill="#ff6b00" 
                      name="Revenue (₹)"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recent Activity and Pending Bookings would go here */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Pending Approvals</CardTitle>
            <CardDescription>
              {dashboardStats.pendingBookings} bookings require your attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Pending bookings table would go here */}
            <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
              {isStatsLoading ? 
                <div className="animate-pulse space-y-2">
                  <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mx-auto"></div>
                  <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2 mx-auto"></div>
                </div> :
                dashboardStats.pendingBookings > 0 ?
                  <Button 
                    onClick={() => window.location.href = '/admin/bookings?filter=pending'}
                    className="mt-2"
                  >
                    View Pending Bookings
                  </Button> :
                  <p>No pending bookings at the moment</p>
              }
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common administrative tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => window.location.href = '/admin/helipads/new'}
              >
                <Plane className="h-5 w-5 mb-1" />
                <span>Add Helipad</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => window.location.href = '/admin/users'}
              >
                <Users className="h-5 w-5 mb-1" />
                <span>Manage Users</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => window.location.href = '/admin/bookings'}
              >
                <Calendar className="h-5 w-5 mb-1" />
                <span>View Bookings</span>
              </Button>
              <Button
                variant="outline"
                className="h-20 flex flex-col items-center justify-center"
                onClick={() => window.location.href = '/admin/reports'}
              >
                <BarChart className="h-5 w-5 mb-1" />
                <span>Generate Reports</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
