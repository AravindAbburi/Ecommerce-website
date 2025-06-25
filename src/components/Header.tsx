
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X, Heart, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    navigate("/products");
  };

  return (
    <header className="bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">📞 Support: 1800-123-4567</span>
            <span className="text-sm text-gray-600">🚚 Free delivery on orders above ₹499</span>
          </div>
          <div className="hidden md:flex items-center gap-4 text-sm">
            <Link to="/track-order" className="text-gray-600 hover:text-purple-600">Track Order</Link>
            <Link to="/help" className="text-gray-600 hover:text-purple-600">Help</Link>
          </div>
        </div>

        {/* Main Header */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">K</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Kondapalli Toys
              </h1>
              <p className="text-xs text-gray-500">Traditional Handcrafted</p>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="flex w-full">
              <input
                type="text"
                placeholder="Search for traditional toys, dolls, crafts..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-6 rounded-r-full"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              <Search className="h-5 w-5 text-gray-600" />
            </button>

            {/* Notifications */}
            <button className="relative p-2 hover:bg-gray-100 rounded-full">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className="relative p-2 hover:bg-gray-100 rounded-full">
              <Heart className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-pink-500 text-white text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </Link>

            {/* Cart */}
            <Link to="/cart" className="relative p-2 hover:bg-gray-100 rounded-full">
              <ShoppingCart className="h-5 w-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 text-white text-xs rounded-full flex items-center justify-center">
                5
              </span>
            </Link>

            {/* Profile */}
            <Link to="/profile" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-full">
              <User className="h-5 w-5 text-gray-600" />
              <span className="hidden md:inline text-sm text-gray-600">Account</span>
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Search toys..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <Button type="submit" size="sm" className="bg-purple-600 hover:bg-purple-700 rounded-full">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col gap-4">
              <Link to="/products" className="text-gray-600 hover:text-purple-600">All Products</Link>
              <Link to="/categories" className="text-gray-600 hover:text-purple-600">Categories</Link>
              <Link to="/deals" className="text-gray-600 hover:text-purple-600">Flash Deals</Link>
              <Link to="/brands" className="text-gray-600 hover:text-purple-600">Artisans</Link>
              <Link to="/track-order" className="text-gray-600 hover:text-purple-600">Track Order</Link>
              <Link to="/help" className="text-gray-600 hover:text-purple-600">Help & Support</Link>
            </nav>
          </div>
        )}
      </div>

      {/* Navigation Bar */}
      <div className="hidden md:block bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <nav className="flex items-center gap-8 py-3">
            <Link to="/products" className="text-gray-600 hover:text-purple-600 font-medium">All Products</Link>
            <Link to="/traditional-dolls" className="text-gray-600 hover:text-purple-600">Traditional Dolls</Link>
            <Link to="/figurines" className="text-gray-600 hover:text-purple-600">Figurines</Link>
            <Link to="/home-decor" className="text-gray-600 hover:text-purple-600">Home Decor</Link>
            <Link to="/gift-sets" className="text-gray-600 hover:text-purple-600">Gift Sets</Link>
            <Link to="/custom-orders" className="text-gray-600 hover:text-purple-600">Custom Orders</Link>
            <Link to="/deals" className="text-red-600 hover:text-red-700 font-medium flex items-center gap-1">
              🔥 Flash Deals
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
