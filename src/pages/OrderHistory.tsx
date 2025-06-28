import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Package,
  Calendar,
  MapPin,
  CreditCard,
  Truck,
  CheckCircle,
  Clock,
  Loader2,
  Eye,
  ArrowLeft,
} from "lucide-react";

// API base URL
const API_BASE_URL = "http://localhost:5000/api";

interface OrderItem {
  _id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  status:
    | "pending"
    | "confirmed"
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const OrderHistory = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login?redirect=/orders");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Fetch orders
  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load order history");
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "shipped":
        return "bg-orange-100 text-orange-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "cancelled":
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Profile
            </Button>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Order History
            </h1>
            <p className="text-gray-600">View and track your past orders</p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <span className="ml-2 text-gray-600">Loading orders...</span>
            </div>
          ) : orders.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No orders yet
                </h3>
                <p className="text-gray-600 mb-6">
                  You haven't placed any orders yet. Start shopping to see your
                  order history here.
                </p>
                <Button
                  onClick={() => navigate("/products")}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <Card key={order._id} className="overflow-hidden">
                  <CardHeader className="bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">
                          Order #{order.orderNumber}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-4 mt-2">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(order.createdAt)}
                          </span>
                          <Badge className={getStatusColor(order.status)}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {order.status.charAt(0).toUpperCase() +
                                order.status.slice(1)}
                            </span>
                          </Badge>
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900">
                          {formatPrice(order.total)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {order.items.length} item
                          {order.items.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6">
                    {/* Order Items */}
                    <div className="space-y-4 mb-6">
                      <h4 className="font-semibold text-gray-900">Items</h4>
                      <div className="space-y-3">
                        {order.items.map((item) => (
                          <div
                            key={item._id}
                            className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                          >
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900">
                                {item.title}
                              </h5>
                              <p className="text-sm text-gray-500">
                                Qty: {item.quantity} × {formatPrice(item.price)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Shipping Address */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Shipping Address
                        </h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{order.customer.name}</p>
                          <p>{order.shippingAddress.street}</p>
                          <p>
                            {order.shippingAddress.city},{" "}
                            {order.shippingAddress.state}{" "}
                            {order.shippingAddress.pincode}
                          </p>
                          <p>{order.shippingAddress.country}</p>
                        </div>
                      </div>

                      {/* Payment & Summary */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          Payment & Summary
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">
                              Payment Method:
                            </span>
                            <span className="font-medium">
                              {order.paymentMethod}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal:</span>
                            <span>{formatPrice(order.subtotal)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Shipping:</span>
                            <span>{formatPrice(order.shippingCost)}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="font-semibold text-gray-900">
                              Total:
                            </span>
                            <span className="font-semibold text-gray-900">
                              {formatPrice(order.total)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    {order.notes && (
                      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Order Notes
                        </h4>
                        <p className="text-sm text-gray-600">{order.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
