import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  ArrowLeft,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// API base URL
const API_BASE_URL = "http://localhost:5000/api";

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalOrders: number;
    totalUsers: number;
    totalProducts: number;
    revenueGrowth: number;
    orderGrowth: number;
    userGrowth: number;
  };
  salesData: {
    daily: Array<{ date: string; revenue: number; orders: number }>;
    monthly: Array<{ month: string; revenue: number; orders: number }>;
  };
  topProducts: Array<{
    _id: string;
    title: string;
    image: string;
    salesCount: number;
    revenue: number;
  }>;
  topCategories: Array<{
    category: string;
    salesCount: number;
    revenue: number;
  }>;
  userStats: {
    newUsers: number;
    activeUsers: number;
    userRetention: number;
  };
  orderStats: {
    averageOrderValue: number;
    conversionRate: number;
    returnRate: number;
  };
}

const Analytics = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30");

  // Check admin access
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/");
      return;
    }
    fetchAnalytics();
  }, [isAuthenticated, user, navigate, timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_BASE_URL}/analytics?days=${timeRange}`
      );
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        throw new Error("Failed to fetch analytics");
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      toast({
        title: "Error",
        description: "Failed to load analytics data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-green-600" : "text-red-600";
  };

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate("/admin")}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Analytics & Insights
                </h1>
                <p className="text-gray-600">Track your business performance</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="365">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {analyticsData ? (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatPrice(analyticsData.overview.totalRevenue)}
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    {getGrowthIcon(analyticsData.overview.revenueGrowth)}
                    <span
                      className={getGrowthColor(
                        analyticsData.overview.revenueGrowth
                      )}
                    >
                      {analyticsData.overview.revenueGrowth >= 0 ? "+" : ""}
                      {analyticsData.overview.revenueGrowth.toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">
                      vs last period
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Orders
                  </CardTitle>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(analyticsData.overview.totalOrders)}
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    {getGrowthIcon(analyticsData.overview.orderGrowth)}
                    <span
                      className={getGrowthColor(
                        analyticsData.overview.orderGrowth
                      )}
                    >
                      {analyticsData.overview.orderGrowth >= 0 ? "+" : ""}
                      {analyticsData.overview.orderGrowth.toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">
                      vs last period
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Users
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(analyticsData.overview.totalUsers)}
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    {getGrowthIcon(analyticsData.overview.userGrowth)}
                    <span
                      className={getGrowthColor(
                        analyticsData.overview.userGrowth
                      )}
                    >
                      {analyticsData.overview.userGrowth >= 0 ? "+" : ""}
                      {analyticsData.overview.userGrowth.toFixed(1)}%
                    </span>
                    <span className="text-muted-foreground">
                      vs last period
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Products
                  </CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatNumber(analyticsData.overview.totalProducts)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Available products
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Order Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Order Value</span>
                    <span className="font-medium">
                      {formatPrice(analyticsData.orderStats.averageOrderValue)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Conversion Rate</span>
                    <span className="font-medium">
                      {analyticsData.orderStats.conversionRate.toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Return Rate</span>
                    <span className="font-medium">
                      {analyticsData.orderStats.returnRate.toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">New Users</span>
                    <span className="font-medium">
                      {formatNumber(analyticsData.userStats.newUsers)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Active Users</span>
                    <span className="font-medium">
                      {formatNumber(analyticsData.userStats.activeUsers)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">User Retention</span>
                    <span className="font-medium">
                      {analyticsData.userStats.userRetention.toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    onClick={() => navigate("/admin/products")}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Manage Products
                  </Button>
                  <Button
                    onClick={() => navigate("/admin/orders")}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    View Orders
                  </Button>
                  <Button
                    onClick={() => navigate("/admin/users")}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Top Products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Top Selling Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analyticsData.topProducts.length > 0 ? (
                    <div className="space-y-4">
                      {analyticsData.topProducts
                        .slice(0, 5)
                        .map((product, index) => (
                          <div
                            key={product._id}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-medium text-purple-600">
                              {index + 1}
                            </div>
                            <img
                              src={product.image}
                              alt={product.title}
                              className="w-12 h-12 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-sm line-clamp-1">
                                {product.title}
                              </p>
                              <p className="text-xs text-gray-600">
                                {product.salesCount} sold
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-sm">
                                {formatPrice(product.revenue)}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No product data available
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Top Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {analyticsData.topCategories.length > 0 ? (
                    <div className="space-y-4">
                      {analyticsData.topCategories
                        .slice(0, 5)
                        .map((category, index) => (
                          <div
                            key={category.category}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {category.category}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {category.salesCount} sales
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-sm">
                                {formatPrice(category.revenue)}
                              </p>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">
                      No category data available
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sales Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Sales Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">
                      Sales chart will be implemented with a charting library
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Consider using Chart.js, Recharts, or similar
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No analytics data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
