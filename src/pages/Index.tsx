
import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import { Zap, TrendingUp, Star, ShoppingBag } from "lucide-react";

const featuredDeals = [
  {
    id: 1,
    title: "Traditional Dancing Doll Set",
    originalPrice: 2500,
    salePrice: 1999,
    discount: 20,
    image: "/placeholder.svg",
    category: "Traditional Toys",
    rating: 4.8,
    reviews: 124,
    isFlashSale: true,
    timeLeft: "2h 35m"
  },
  {
    id: 2,
    title: "Kondapalli Village Scene",
    originalPrice: 3999,
    salePrice: 2999,
    discount: 25,
    image: "/placeholder.svg",
    category: "Home Decor",
    rating: 4.6,
    reviews: 86,
    isFlashSale: false
  },
  {
    id: 3,
    title: "Royal Elephant Figurine",
    originalPrice: 1999,
    salePrice: 1399,
    discount: 30,
    image: "/placeholder.svg",
    category: "Figurines",
    rating: 4.7,
    reviews: 67,
    isFlashSale: true,
    timeLeft: "5h 12m"
  },
  {
    id: 4,
    title: "Bride & Groom Doll Pair",
    originalPrice: 3500,
    salePrice: 2800,
    discount: 20,
    image: "/placeholder.svg",
    category: "Traditional Toys",
    rating: 4.9,
    reviews: 145,
    isFlashSale: false
  }
];

const categories = [
  { name: "All", count: 450, active: true },
  { name: "Traditional Dolls", count: 120, active: false },
  { name: "Figurines", count: 95, active: false },
  { name: "Home Decor", count: 80, active: false },
  { name: "Gift Sets", count: 65, active: false },
  { name: "Custom Orders", count: 90, active: false }
];

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="h-8 w-8 text-yellow-300 animate-pulse" />
              <span className="text-yellow-300 font-semibold text-lg">Handcrafted Treasures!</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
              Kondapalli Toys
              <br />
              <span className="text-4xl md:text-6xl">Traditional Craft</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Discover authentic handcrafted Kondapalli toys made from eco-friendly Tella Poniki wood by skilled artisans!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/products"
                className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 flex items-center gap-2"
              >
                <ShoppingBag className="h-5 w-5" />
                Shop Now
              </Link>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-purple-600 transition-all">
                View All Collections
              </button>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-purple-50 to-transparent"></div>
      </section>

      {/* Flash Deals Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-r from-red-500 to-orange-500 p-3 rounded-full">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Flash Deals</h2>
              <p className="text-gray-600">Limited time offers - Grab these treasures fast!</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDeals.filter(deal => deal.isFlashSale).map((deal) => (
              <ProductCard key={deal.id} product={deal} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Popular Categories</h2>
              <p className="text-gray-600">Explore traditional crafts by category</p>
            </div>
          </div>
          
          <CategoryFilter 
            categories={categories} 
            selectedCategory={selectedCategory}
            onCategorySelect={setSelectedCategory}
          />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 p-3 rounded-full">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Collection</h2>
              <p className="text-gray-600">Hand-picked masterpieces from our artisans</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDeals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/products"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-lg transition-all transform hover:scale-105 inline-flex items-center gap-2"
            >
              View All Products
              <TrendingUp className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Connected with Tradition!</h2>
          <p className="text-xl mb-8 text-white/90">Get exclusive offers and new collection alerts delivered to your inbox</p>
          <div className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-full text-gray-900 border-0 focus:ring-4 focus:ring-white/30 outline-none"
            />
            <button className="bg-white text-purple-600 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
