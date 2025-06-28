import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  RefreshCw,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const Cart = () => {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    getCartSubtotal,
    getShippingCost,
    syncCartWithBackend,
    loading,
  } = useCart();
  const { isAuthenticated } = useAuth();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const subtotal = getCartSubtotal();
  const shippingCost = getShippingCost();
  const total = getCartTotal();
  const originalTotal = cartItems.reduce(
    (sum, item) => sum + item.originalPrice * item.quantity,
    0
  );
  const totalSavings = originalTotal - subtotal;

  const navigate = useNavigate();

  // Sync cart with backend when component mounts
  useEffect(() => {
    if (cartItems.length > 0 && isAuthenticated) {
      syncCartWithBackend();
    }
  }, [isAuthenticated]);

  // Show login prompt if not authenticated
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
              Please sign in or create an account to view and manage your cart.
            </p>

            <div className="space-y-4">
              <Button
                onClick={() => navigate("/login")}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-full font-medium flex items-center justify-center gap-2"
              >
                <LogIn className="h-5 w-5" />
                Sign In
              </Button>

              <Button
                onClick={() => navigate("/register")}
                variant="outline"
                className="w-full border-purple-600 text-purple-600 hover:bg-purple-50 py-3 rounded-full font-medium flex items-center justify-center gap-2"
              >
                <UserPlus className="h-5 w-5" />
                Create Account
              </Button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link
                to="/products"
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <ShoppingBag className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link
            to="/products"
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full font-medium inline-flex items-center gap-2 hover:shadow-lg transition-all"
          >
            <ShoppingBag className="h-5 w-5" />
            Start Shopping
          </Link>
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
          <Link
            to="/products"
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Continue Shopping
          </Link>

          <Button
            onClick={syncCartWithBackend}
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh Cart
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Shopping Cart ({cartItems.length} items)
              </h2>

              <div className="space-y-6">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-4 p-4 border border-gray-100 rounded-xl"
                  >
                    {/* Product Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Link
                            to={`/product/${item._id}`}
                            className="font-semibold text-gray-900 hover:text-purple-600 line-clamp-2"
                          >
                            {item.title}
                          </Link>
                          <p className="text-sm text-gray-500">
                            {item.category}
                          </p>
                          {item.stock !== undefined && (
                            <p
                              className={`text-xs ${
                                item.stock > 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {item.stock > 0
                                ? `${item.stock} in stock`
                                : "Out of stock"}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="text-red-500 hover:text-red-700 p-1"
                          aria-label="Remove item from cart"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between">
                        {/* Price */}
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900">
                            {formatPrice(item.salePrice)}
                          </span>
                          {item.originalPrice > item.salePrice && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(item.originalPrice)}
                            </span>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity - 1)
                              }
                              className="p-2 hover:bg-gray-100 rounded-l-lg disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-2 font-medium min-w-[3rem] text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item._id, item.quantity + 1)
                              }
                              className="p-2 hover:bg-gray-100 rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
                              disabled={
                                item.stock !== undefined &&
                                item.quantity >= item.stock
                              }
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? "Free" : formatPrice(shippingCost)}
                  </span>
                </div>
                {totalSavings > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Total Savings</span>
                    <span className="font-medium text-green-600">
                      -{formatPrice(totalSavings)}
                    </span>
                  </div>
                )}
                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => navigate("/checkout")}
                disabled={cartItems.length === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-full font-medium"
              >
                Proceed to Checkout
              </Button>

              <div className="mt-4 text-center">
                <Link
                  to="/products"
                  className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
