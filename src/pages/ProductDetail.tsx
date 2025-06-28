import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import {
  Heart,
  ShoppingCart,
  Star,
  Zap,
  Clock,
  Share2,
  Shield,
  Truck,
  RotateCcw,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";

// API base URL
const API_BASE_URL = "http://localhost:5000/api";

interface Product {
  _id: string;
  title: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  images: string[];
  category: string;
  brand: string;
  rating: number;
  reviews: number;
  isFlashSale?: boolean;
  timeLeft?: string;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  stock: number;
  isFeatured?: boolean;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`${API_BASE_URL}/products/${id}`);

        if (!response.ok) {
          if (response.status === 404) {
            setError("Product not found");
          } else {
            throw new Error("Failed to fetch product");
          }
          return;
        }

        const productData = await response.json();
        setProduct(productData);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!product || addingToCart || cartLoading) return;

    setAddingToCart(true);
    try {
      await addToCart({
        _id: product._id,
        title: product.title,
        salePrice: product.salePrice,
        originalPrice: product.originalPrice,
        image: product.images[0],
        category: product.category,
        stock: product.stock,
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = () => {
    if (!product) return;

    addToWishlist({
      id: product._id,
      title: product.title,
      price: product.salePrice,
      originalPrice: product.originalPrice,
      image: product.images[0],
      category: product.category,
      rating: product.rating,
      reviews: product.reviews,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Product not found"}
          </h2>
          <p className="text-gray-600 mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => navigate("/products")}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Browse Products
          </Button>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-purple-600">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-purple-600">
            Products
          </Link>
          <span>/</span>
          <Link
            to={`/category/${product.category.toLowerCase().replace(" ", "-")}`}
            className="hover:text-purple-600"
          >
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-gray-900">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border relative">
              <img
                src={product.images[selectedImage]}
                alt={product.title}
                className="w-full h-96 object-cover rounded-xl"
              />
              {product.isFlashSale && (
                <div className="absolute top-6 left-6 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
                  <Zap className="h-4 w-4" />
                  Flash Sale
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-2">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-20 rounded-lg border-2 overflow-hidden ${
                    selectedImage === index
                      ? "border-purple-500"
                      : "border-gray-200"
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title and Brand */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-purple-600 font-medium text-sm">
                  {product.brand}
                </span>
                <span className="text-gray-300">•</span>
                <span className="text-gray-600 text-sm">
                  {product.category}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>
            </div>

            {/* Rating and Reviews */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="font-medium text-gray-900 ml-1">
                  {product.rating}
                </span>
              </div>
              <span className="text-gray-600">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
              <div className="flex items-center gap-4 mb-2">
                <span className="text-3xl font-bold text-gray-900">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                  {product.discount}% OFF
                </span>
              </div>
              <p className="text-sm text-gray-600">
                You save{" "}
                {formatPrice(product.originalPrice - product.salePrice)}
              </p>
            </div>

            {/* Flash Sale Timer */}
            {product.isFlashSale && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-red-500" />
                  <span className="text-red-700 font-medium">
                    Flash Sale ends in:
                  </span>
                </div>
                <div className="text-2xl font-bold text-red-600">
                  {product.timeLeft}
                </div>
              </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  !isOutOfStock ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span
                className={`font-medium ${
                  !isOutOfStock ? "text-green-700" : "text-red-700"
                }`}
              >
                {!isOutOfStock
                  ? `In Stock (${product.stock} left)`
                  : "Out of Stock"}
              </span>
            </div>

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || addingToCart}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="h-5 w-5" />
                  Add to Cart
                </Button>
                <button
                  onClick={handleWishlist}
                  className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50"
                  aria-label={
                    isInWishlist(product._id)
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                  title={
                    isInWishlist(product._id)
                      ? "Remove from wishlist"
                      : "Add to wishlist"
                  }
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isInWishlist(product._id)
                        ? "fill-red-500 text-red-500"
                        : "text-gray-600"
                    }`}
                  />
                </button>
                <button
                  className="p-3 border border-gray-300 rounded-xl hover:bg-gray-50"
                  aria-label="Share product"
                  title="Share product"
                >
                  <Share2 className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div className="text-center">
                <Truck className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">
                  Free Delivery
                </p>
                <p className="text-xs text-gray-500">Above ₹499</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">
                  Easy Returns
                </p>
                <p className="text-xs text-gray-500">7 Days</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="text-xs font-medium text-gray-700">Authentic</p>
                <p className="text-xs text-gray-500">Handcrafted</p>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border p-8">
          <div className="space-y-8">
            {/* Description */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Key Features
              </h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.features && product.features.length > 0 ? (
                  product.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-gray-500">No features listed</li>
                )}
              </ul>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Specifications
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.specifications &&
                Object.keys(product.specifications).length > 0 ? (
                  Object.entries(product.specifications).map(([key, value]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center py-2 border-b border-gray-100"
                    >
                      <span className="font-medium text-gray-700">{key}:</span>
                      <span className="text-gray-600">{value as string}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">
                    No specifications available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
