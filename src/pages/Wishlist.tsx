import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { Heart, ShoppingCart, Star, ArrowLeft, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { useCart } from "@/contexts/CartContext";

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      title: item.title,
      price: item.price,
      originalPrice: item.originalPrice,
      image: item.image,
      category: item.category,
    });
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Start adding products to your wishlist to see them here.
          </p>
          <Link
            to="/products"
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-3 rounded-full font-medium inline-flex items-center gap-2 hover:shadow-lg transition-all"
          >
            <ShoppingCart className="h-5 w-5" />
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
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/products"
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
          >
            <ArrowLeft className="h-5 w-5" />
            Continue Shopping
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            My Wishlist ({wishlistItems.length} items)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Product Image */}
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />

                  {/* Remove from Wishlist Button */}
                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>

                {/* Product Details */}
                <div className="p-4">
                  <div className="text-xs text-purple-600 font-medium mb-1">
                    {item.category}
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.title}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {item.rating}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      ({item.reviews} reviews)
                    </span>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-lg font-bold text-gray-900">
                      {formatPrice(item.price)}
                    </span>
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(item.originalPrice)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-full py-2 text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
