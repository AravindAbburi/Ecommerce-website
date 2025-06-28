import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, ArrowLeft, CheckCircle, LogIn } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// API base URL
const API_BASE_URL = "http://localhost:5000/api";

interface CheckoutForm {
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  paymentMethod: string;
  notes: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    getCartTotal,
    getCartSubtotal,
    getShippingCost,
    clearCart,
    loading,
  } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState<CheckoutForm>({
    customer: {
      name: "",
      email: "",
      phone: "",
    },
    shippingAddress: {
      street: "",
      city: "",
      state: "",
      pincode: "",
      country: "India",
    },
    paymentMethod: "cod",
    notes: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  // Pre-fill form with user data when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setForm((prev) => ({
        ...prev,
        customer: {
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
        },
      }));
    }
  }, [isAuthenticated, user]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to proceed to checkout.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [isAuthenticated, navigate, toast]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleInputChange = (
    section: keyof CheckoutForm,
    field: string,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to place an order.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty. Please add items before checkout.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const orderData = {
        customer: form.customer,
        items: cartItems.map((item) => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.salePrice,
          title: item.title,
          image: item.image,
        })),
        shippingAddress: form.shippingAddress,
        paymentMethod: form.paymentMethod,
        notes: form.notes,
      };

      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to place order");
      }

      const result = await response.json();
      setOrderDetails(result.order);
      setOrderPlaced(true);
      clearCart();

      toast({
        title: "Order Placed Successfully!",
        description: `Your order #${result.order.orderNumber} has been placed.`,
      });
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Order Failed",
        description:
          error instanceof Error
            ? error.message
            : "Failed to place order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Show loading while checking authentication
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8">
            <LogIn className="h-16 w-16 text-purple-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Sign In Required
            </h2>
            <p className="text-gray-600 mb-8">
              Please sign in to proceed to checkout.
            </p>
            <Button
              onClick={() => navigate("/login")}
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-full font-medium flex items-center justify-center gap-2"
            >
              <LogIn className="h-5 w-5" />
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Please add items to your cart before proceeding to checkout.
          </p>
          <Button
            onClick={() => navigate("/products")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  if (orderPlaced && orderDetails) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. We'll process your order and send you
              updates.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold mb-4">Order Details</h3>
              <div className="space-y-2 text-left">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order Number:</span>
                  <span className="font-medium">
                    {orderDetails.orderNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount:</span>
                  <span className="font-medium">
                    {formatPrice(orderDetails.total)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600">
                    {orderDetails.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button
                onClick={() => navigate("/products")}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 w-full"
              >
                Continue Shopping
              </Button>
              <Button
                onClick={() => navigate("/orders")}
                variant="outline"
                className="w-full"
              >
                View Order History
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={() => navigate("/cart")}
            variant="outline"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Checkout Information
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Customer Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={form.customer.name}
                        onChange={(e) =>
                          handleInputChange("customer", "name", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={form.customer.email}
                        onChange={(e) =>
                          handleInputChange("customer", "email", e.target.value)
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={form.customer.phone}
                        onChange={(e) =>
                          handleInputChange("customer", "phone", e.target.value)
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Shipping Address
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="street">Street Address</Label>
                      <Input
                        id="street"
                        value={form.shippingAddress.street}
                        onChange={(e) =>
                          handleInputChange(
                            "shippingAddress",
                            "street",
                            e.target.value
                          )
                        }
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={form.shippingAddress.city}
                          onChange={(e) =>
                            handleInputChange(
                              "shippingAddress",
                              "city",
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input
                          id="state"
                          value={form.shippingAddress.state}
                          onChange={(e) =>
                            handleInputChange(
                              "shippingAddress",
                              "state",
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode">Pincode</Label>
                        <Input
                          id="pincode"
                          value={form.shippingAddress.pincode}
                          onChange={(e) =>
                            handleInputChange(
                              "shippingAddress",
                              "pincode",
                              e.target.value
                            )
                          }
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Payment Method
                  </h3>
                  <Select
                    value={form.paymentMethod}
                    onValueChange={(value) =>
                      handleInputChange("paymentMethod", "", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cod">Cash on Delivery</SelectItem>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="bank_transfer">
                        Bank Transfer
                      </SelectItem>
                      <SelectItem value="digital_wallet">
                        Digital Wallet
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Additional Notes */}
                <div>
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={form.notes}
                    onChange={(e) =>
                      handleInputChange("notes", "", e.target.value)
                    }
                    placeholder="Any special instructions or notes for your order..."
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={submitting || loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-full font-medium"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Placing Order...
                    </>
                  ) : (
                    `Place Order - ${formatPrice(getCartTotal())}`
                  )}
                </Button>
              </form>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border p-6 sticky top-8">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Order Summary
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Subtotal ({cartItems.length} items)
                  </span>
                  <span className="font-medium">
                    {formatPrice(getCartSubtotal())}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {getShippingCost() === 0
                      ? "Free"
                      : formatPrice(getShippingCost())}
                  </span>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(getCartTotal())}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Secure SSL encrypted checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Free returns within 7 days</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>24/7 customer support</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
