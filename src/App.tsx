import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "./contexts/CartContext";
import { WishlistProvider } from "./contexts/WishlistContext";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import About from "./pages/About";
import Achievements from "./pages/Achievements";
import CustomOrders from "./pages/CustomOrders";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import OrderHistory from "./pages/OrderHistory";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
// Admin pages
import AdminDashboard from "./pages/Admin/Dashboard";
import ProductManagement from "./pages/Admin/ProductManagement";
import UserManagement from "./pages/Admin/UserManagement";
import OrderManagement from "./pages/Admin/OrderManagement";
import Analytics from "./pages/Admin/Analytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/achievements" element={<Achievements />} />
                <Route path="/custom-orders" element={<CustomOrders />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/contact" element={<Contact />} />
                {/* Authentication routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/orders" element={<OrderHistory />} />
                {/* Admin routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/products" element={<ProductManagement />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/orders" element={<OrderManagement />} />
                <Route path="/admin/analytics" element={<Analytics />} />
                {/* Category routes */}
                <Route path="/electronics" element={<Products />} />
                <Route path="/fashion" element={<Products />} />
                <Route path="/home-garden" element={<Products />} />
                <Route path="/sports" element={<Products />} />
                <Route path="/beauty" element={<Products />} />
                <Route path="/deals" element={<Products />} />
                {/* Utility routes */}
                <Route path="/track-order" element={<Products />} />
                <Route path="/help" element={<Products />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
