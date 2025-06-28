import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  X,
  Heart,
  LogOut,
  Settings,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { getCartCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { user, logout, isAuthenticated } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to products page with search query
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(""); // Clear search input
      setIsSearchOpen(false); // Close mobile search
    } else {
      // If no search query, just go to products page
      navigate("/products");
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    navigate("/");
  };

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex items-center gap-4">
            {/* Removed support phone and delivery text */}
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm">
            <Link
              to="/track-order"
              className="text-gray-600 hover:text-purple-600 font-garamond"
            >
              Track Order
            </Link>
            <Link
              to="/help"
              className="text-gray-600 hover:text-purple-600 font-garamond"
            >
              Help
            </Link>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl font-playfair">
                K
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent font-playfair">
                Kondapalli Toys
              </h1>
              <p className="text-xs text-gray-500 font-garamond italic">
                Traditional Handcrafted
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              to="/products"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors font-garamond"
            >
              All Products
            </Link>
            <Link
              to="/about"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors font-garamond"
            >
              About
            </Link>
            <Link
              to="/achievements"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors font-garamond"
            >
              Achievements
            </Link>
            <Link
              to="/custom-orders"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors font-garamond"
            >
              Custom Orders
            </Link>
            <Link
              to="/contact"
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors font-garamond"
            >
              Contact
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="flex w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for traditional toys, dolls, crafts..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent font-garamond"
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3 rounded-r-full min-w-[60px]"
                aria-label="Search"
              >
                <Search className="h-6 w-6" />
              </Button>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full"
              aria-label="Toggle search"
            >
              <Search className="h-5 w-5 text-gray-600" />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative p-2 hover:bg-gray-100 rounded-full"
            >
              <Heart className="h-5 w-5 text-gray-600" />
              {getWishlistCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center font-ancizar">
                  {getWishlistCount()}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 hover:bg-gray-100 rounded-full"
            >
              <ShoppingCart className="h-5 w-5 text-gray-600" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center font-ancizar">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* User Account */}
            <div className="relative" ref={userMenuRef}>
              {isAuthenticated ? (
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="User menu"
                  title="User menu"
                >
                  <User className="h-5 w-5 text-gray-600" />
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Sign in"
                  title="Sign in"
                >
                  <User className="h-5 w-5 text-gray-600" />
                </Link>
              )}

              {/* User Dropdown Menu */}
              {isAuthenticated && isUserMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.name}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <Settings className="h-4 w-4" />
                    My Profile
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Shield className="h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search toys..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 font-garamond"
              />
              <Button
                type="submit"
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 rounded-full px-6 py-2 min-w-[50px]"
                aria-label="Search"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col gap-4">
              <Link
                to="/products"
                className="text-gray-600 hover:text-purple-600 font-garamond"
                onClick={() => setIsMenuOpen(false)}
              >
                All Products
              </Link>
              <Link
                to="/about"
                className="text-gray-600 hover:text-purple-600 font-garamond"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/achievements"
                className="text-gray-600 hover:text-purple-600 font-garamond"
                onClick={() => setIsMenuOpen(false)}
              >
                Achievements
              </Link>
              <Link
                to="/custom-orders"
                className="text-gray-600 hover:text-purple-600 font-garamond"
                onClick={() => setIsMenuOpen(false)}
              >
                Custom Orders
              </Link>
              <Link
                to="/contact"
                className="text-gray-600 hover:text-purple-600 font-garamond"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/track-order"
                className="text-gray-600 hover:text-purple-600 font-garamond"
                onClick={() => setIsMenuOpen(false)}
              >
                Track Order
              </Link>
              <Link
                to="/help"
                className="text-gray-600 hover:text-purple-600 font-garamond"
                onClick={() => setIsMenuOpen(false)}
              >
                Help & Support
              </Link>
              {/* Mobile Authentication */}
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="text-gray-600 hover:text-purple-600 font-garamond"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="text-gray-600 hover:text-purple-600 font-garamond"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="text-left text-gray-600 hover:text-purple-600 font-garamond"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-purple-600 font-garamond"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* Navigation Bar */}
      <div className="hidden md:block bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-8 py-3">
            <Link
              to="/products"
              className="text-gray-600 hover:text-purple-600 font-garamond"
            >
              All Products
            </Link>
            <Link
              to="/about"
              className="text-gray-600 hover:text-purple-600 font-garamond"
            >
              About
            </Link>
            <Link
              to="/achievements"
              className="text-gray-600 hover:text-purple-600 font-garamond"
            >
              Achievements
            </Link>
            <Link
              to="/custom-orders"
              className="text-gray-600 hover:text-purple-600 font-garamond"
            >
              Custom Orders
            </Link>
            <Link
              to="/contact"
              className="text-gray-600 hover:text-purple-600 font-garamond"
            >
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
