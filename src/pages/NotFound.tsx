import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* 404 Illustration */}
          <div className="mb-8">
            <div className="w-32 h-32 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-6xl font-bold text-white font-playfair">
                404
              </span>
            </div>
          </div>

          {/* Main Content */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4 font-playfair">
            Page Not Found
          </h1>
          <p className="text-xl text-gray-600 mb-8 font-garamond max-w-md mx-auto">
            Looks like you've followed a broken link or entered a URL that
            doesn't exist on our site.
          </p>

          {/* Error Details */}
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
            <p className="text-sm text-gray-500 mb-2">Attempted URL:</p>
            <p className="text-purple-600 font-mono bg-purple-50 p-2 rounded">
              {location.pathname}
            </p>
          </div>

          {/* Navigation Options */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 px-8 py-3">
                  <Home className="h-5 w-5 mr-2" />
                  Go to Homepage
                </Button>
              </Link>
              <Link to="/products">
                <Button variant="outline" className="px-8 py-3">
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  Browse Products
                </Button>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/about">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-purple-600"
                >
                  About Us
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-purple-600"
                >
                  Contact Support
                </Button>
              </Link>
              <Link to="/achievements">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-purple-600"
                >
                  Our Achievements
                </Button>
              </Link>
            </div>
          </div>

          {/* Helpful Tips */}
          <div className="mt-12 bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 font-playfair">
              Need Help Finding Something?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <Search className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">Search Products</h4>
                  <p className="text-sm text-gray-600">
                    Use our search feature to find specific toys
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ShoppingBag className="h-5 w-5 text-purple-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-gray-900">
                    Browse Categories
                  </h4>
                  <p className="text-sm text-gray-600">
                    Explore our traditional toy collections
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8">
            <Button
              variant="ghost"
              onClick={() => window.history.back()}
              className="text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
