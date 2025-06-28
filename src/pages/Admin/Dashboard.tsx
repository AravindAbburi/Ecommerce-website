import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  DollarSign,
  Eye,
  Plus,
  Settings,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// API base URL
const API_BASE_URL = "http://localhost:5000/api";

interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
  topProducts: any[];
  monthlyRevenue: number;
  orderGrowth: number;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is admin
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access the admin dashboard.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (user?.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access the admin dashboard.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    fetchDashboardStats();
  }, [isAuthenticated, user, navigate, toast]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/orders/dashboard-summary`);

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        throw new Error("Failed to fetch dashboard stats");
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics.",
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
              <p className="text-gray-600">Loading dashboard...</p>
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
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">Welcome back, {user?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate("/")}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Eye className="h-4 w-4" />
                View Store
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={() => navigate("/admin/products")}
              className="h-20 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
            >
              <div className="text-center">
                <Plus className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Add Product</span>
              </div>
            </Button>
            <Button
              onClick={() => navigate("/admin/orders")}
              className="h-20 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
            >
              <div className="text-center">
                <ShoppingCart className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">View Orders</span>
              </div>
            </Button>
            <Button
              onClick={() => navigate("/admin/users")}
              className="h-20 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white"
            >
              <div className="text-center">
                <Users className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Manage Users</span>
              </div>
            </Button>
            <Button
              onClick={() => navigate("/admin/analytics")}
              className="h-20 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white"
            >
              <div className="text-center">
                <BarChart3 className="h-6 w-6 mx-auto mb-2" />
                <span className="text-sm font-medium">Analytics</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                Registered customers
              </p>
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
                {stats?.totalProducts || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Available products
              </p>
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
                {stats?.totalOrders || 0}
              </div>
              <p className="text-xs text-muted-foreground">Orders placed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatPrice(stats?.totalRevenue || 0)}
              </div>
              <p className="text-xs text-muted-foreground">Lifetime revenue</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.recentOrders && stats.recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {stats.recentOrders.slice(0, 5).map((order: any) => (
                    <div
                      key={order._id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-sm">
                          #{order.orderNumber}
                        </p>
                        <p className="text-xs text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          {formatPrice(order.total)}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "shipped"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No recent orders
                </p>
              )}
              <Button
                onClick={() => navigate("/admin/orders")}
                variant="outline"
                className="w-full mt-4"
              >
                View All Orders
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Top Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stats?.topProducts && stats.topProducts.length > 0 ? (
                <div className="space-y-4">
                  {stats.topProducts.slice(0, 5).map((product: any) => (
                    <div
                      key={product._id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                    >
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
                          {product.salesCount || 0} sold
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">
                          {formatPrice(product.salePrice)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">
                  No product data
                </p>
              )}
              <Button
                onClick={() => navigate("/admin/products")}
                variant="outline"
                className="w-full mt-4"
              >
                Manage Products
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
