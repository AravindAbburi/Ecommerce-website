import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  ShoppingCart,
  Search,
  Filter,
  Eye,
  Package,
  ArrowLeft,
  Loader2,
  MoreHorizontal,
  Calendar,
  User,
  MapPin,
  Phone,
  Mail,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// API base URL
const API_BASE_URL = "http://localhost:5000/api";

interface OrderItem {
  product: {
    _id: string;
    title: string;
    image: string;
    salePrice: number;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
  shippingAddress: {
    name: string;
    phone: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  subtotal: number;
  shippingCost: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingNumber?: string;
  notes?: string;
}

const OrderManagement = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Status update form
  const [statusForm, setStatusForm] = useState({
    status: "",
    trackingNumber: "",
    notes: "",
  });

  // Check admin access
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/");
      return;
    }
    fetchOrders();
  }, [isAuthenticated, user, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/orders?limit=100`);
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        title: "Error",
        description: "Failed to load orders.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOrder) return;

    try {
      setUpdatingStatus(true);
      const response = await fetch(`${API_BASE_URL}/orders/${selectedOrder._id}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(statusForm),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Order status updated successfully!",
        });
        setIsStatusDialogOpen(false);
        setSelectedOrder(null);
        fetchOrders();
      } else {
        throw new Error("Failed to update order status");
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast({
        title: "Error",
        description: "Failed to update order status.",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDialogOpen(true);
  };

  const handleUpdateStatusClick = (order: Order) => {
    setSelectedOrder(order);
    setStatusForm({
      status: order.status,
      trackingNumber: order.trackingNumber || "",
      notes: order.notes || "",
    });
    setIsStatusDialogOpen(true);
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
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "shipped":
        return <Truck className="h-4 w-4 text-blue-600" />;
      case "confirmed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || order.status === statusFilter;
    const matchesPayment = !paymentFilter || order.paymentStatus === paymentFilter;
    
    return matchesSearch && matchesStatus && matchesPayment;
  });

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
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
                <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
                <p className="text-gray-600">Manage and track customer orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search Orders</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by order number, customer name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">Order Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="payment">Payment Status</Label>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All payments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All payments</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("");
                  setPaymentFilter("");
                }}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Loading orders...</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">#{order.orderNumber}</p>
                        <p className="text-xs text-gray-500">
                          {order.paymentMethod}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-sm">{order.user.name}</p>
                        <p className="text-xs text-gray-500">{order.user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {order.items.length} items
                        </span>
                        <div className="flex -space-x-2">
                          {order.items.slice(0, 3).map((item, index) => (
                            <img
                              key={index}
                              src={item.product.image}
                              alt={item.product.title}
                              className="w-6 h-6 rounded-full border-2 border-white object-cover"
                            />
                          ))}
                          {order.items.length > 3 && (
                            <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center">
                              <span className="text-xs">+{order.items.length - 3}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium text-sm">{formatPrice(order.total)}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(order.status)}
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.paymentStatus === "paid" ? "default" :
                          order.paymentStatus === "failed" ? "destructive" : "outline"
                        }
                      >
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <p>{formatDate(order.createdAt)}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleViewOrder(order)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateStatusClick(order)}>
                            <Package className="h-4 w-4 mr-2" />
                            Update Status
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          
          {!loading && filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No orders found</p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 text-sm text-gray-600">
          Showing {filteredOrders.length} of {orders.length} orders
        </div>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - #{selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Order Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Order Number:</span>
                      <span className="font-medium">#{selectedOrder.orderNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Date:</span>
                      <span>{formatDate(selectedOrder.createdAt)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Payment Method:</span>
                      <span>{selectedOrder.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Status:</span>
                      <Badge className={getStatusColor(selectedOrder.status)}>
                        {selectedOrder.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4" />
                      <span>{selectedOrder.user.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4" />
                      <span>{selectedOrder.user.email}</span>
                    </div>
                    {selectedOrder.user.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4" />
                        <span>{selectedOrder.user.phone}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <div>
                        <p className="font-medium">{selectedOrder.shippingAddress.name}</p>
                        <p>{selectedOrder.shippingAddress.street}</p>
                        <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</p>
                        <p>{selectedOrder.shippingAddress.postalCode}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={item.product.image}
                          alt={item.product.title}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-sm">{item.product.title}</p>
                          <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-sm">{formatPrice(item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{formatPrice(selectedOrder.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Shipping:</span>
                      <span>{formatPrice(selectedOrder.shippingCost)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total:</span>
                      <span>{formatPrice(selectedOrder.total)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpdateStatus} className="space-y-4">
            <div>
              <Label htmlFor="status">Order Status</Label>
              <Select
                value={statusForm.status}
                onValueChange={(value) => setStatusForm({...statusForm, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tracking">Tracking Number</Label>
              <Input
                id="tracking"
                value={statusForm.trackingNumber}
                onChange={(e) => setStatusForm({...statusForm, trackingNumber: e.target.value})}
                placeholder="Enter tracking number"
              />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={statusForm.notes}
                onChange={(e) => setStatusForm({...statusForm, notes: e.target.value})}
                placeholder="Add any notes"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button type="submit" className="flex-1" disabled={updatingStatus}>
                {updatingStatus ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Updating...
                  </>
                ) : (
                  "Update Status"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsStatusDialogOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderManagement; 