import { Link } from "react-router-dom";
import {
  Heart,
  ShoppingCart,
  Star,
  Clock,
  Zap,
  Loader2,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

interface Product {
  id: string;
  title: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  isFlashSale?: boolean;
  timeLeft?: string;
  stock?: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, loading: cartLoading } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const [addingToCart, setAddingToCart] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (addingToCart || cartLoading) return;

    setAddingToCart(true);
    try {
      await addToCart({
        _id: product.id,
        title: product.title,
        salePrice: product.salePrice,
        originalPrice: product.originalPrice,
        image: product.image,
        category: product.category,
        stock: product.stock || 0,
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist({
      id: product.id,
      title: product.title,
      price: product.salePrice,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      rating: product.rating,
      reviews: product.reviews,
    });
  };

  const handleSignIn = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = "/login";
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const isOutOfStock = product.stock !== undefined && product.stock <= 0;

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isFlashSale && (
              <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Zap className="h-3 w-3" />
                Flash Sale
              </div>
            )}
            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
              {product.discount}% OFF
            </div>
            {isOutOfStock && (
              <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                Out of Stock
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all"
            aria-label={
              isInWishlist(product.id)
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
            title={
              isInWishlist(product.id)
                ? "Remove from wishlist"
                : "Add to wishlist"
            }
          >
            <Heart
              className={`h-4 w-4 ${
                isInWishlist(product.id)
                  ? "fill-red-500 text-red-500"
                  : "text-gray-600"
              }`}
            />
          </button>

          {/* Timer for Flash Sales */}
          {product.isFlashSale && product.timeLeft && (
            <div className="absolute bottom-3 left-3 bg-black/80 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {product.timeLeft}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Category */}
          <div className="text-xs text-purple-600 font-medium mb-1">
            {product.category}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-700">
                {product.rating}
              </span>
            </div>
            <span className="text-xs text-gray-500">
              ({product.reviews} reviews)
            </span>
          </div>

          {/* Pricing */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl font-bold text-gray-900">
              {formatPrice(product.salePrice)}
            </span>
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          </div>

          {/* Stock Info */}
          {product.stock !== undefined && (
            <div className="text-xs text-gray-600 mb-3">
              {isOutOfStock ? (
                <span className="text-red-600 font-medium">Out of Stock</span>
              ) : (
                <span className="text-green-600 font-medium">
                  {product.stock} in stock
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {isAuthenticated ? (
              <Button
                onClick={handleAddToCart}
                disabled={isOutOfStock || addingToCart || cartLoading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-full py-2 text-sm font-medium flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                {addingToCart ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleSignIn}
                disabled={isOutOfStock}
                className="flex-1 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-full py-2 text-sm font-medium flex items-center justify-center gap-2 disabled:cursor-not-allowed"
              >
                <LogIn className="h-4 w-4" />
                Sign In to Buy
              </Button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
