
import { useState } from "react";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import { Filter, SortAsc, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";

const products = [
  {
    id: 1,
    title: "iPhone 15 Pro Max 256GB",
    originalPrice: 134900,
    salePrice: 119900,
    discount: 11,
    image: "/placeholder.svg",
    category: "Electronics",
    rating: 4.8,
    reviews: 324,
    isFlashSale: true,
    timeLeft: "2h 35m"
  },
  {
    id: 2,
    title: "Samsung 55\" QLED 4K Smart TV",
    originalPrice: 89999,
    salePrice: 64999,
    discount: 28,
    image: "/placeholder.svg",
    category: "Electronics",
    rating: 4.6,
    reviews: 156,
    isFlashSale: false
  },
  {
    id: 3,
    title: "Nike Air Max 270 Running Shoes",
    originalPrice: 12995,
    salePrice: 8497,
    discount: 35,
    image: "/placeholder.svg",
    category: "Fashion",
    rating: 4.7,
    reviews: 89,
    isFlashSale: true,
    timeLeft: "5h 12m"
  },
  {
    id: 4,
    title: "MacBook Air M2 13-inch",
    originalPrice: 114900,
    salePrice: 99900,
    discount: 13,
    image: "/placeholder.svg",
    category: "Electronics",
    rating: 4.9,
    reviews: 245,
    isFlashSale: false
  },
  {
    id: 5,
    title: "Sony WH-1000XM5 Headphones",
    originalPrice: 29990,
    salePrice: 22999,
    discount: 23,
    image: "/placeholder.svg",
    category: "Electronics",
    rating: 4.8,
    reviews: 412,
    isFlashSale: true,
    timeLeft: "1h 45m"
  },
  {
    id: 6,
    title: "Adidas Ultraboost 22",
    originalPrice: 16999,
    salePrice: 11999,
    discount: 29,
    image: "/placeholder.svg",
    category: "Fashion",
    rating: 4.6,
    reviews: 203,
    isFlashSale: false
  }
];

const categories = [
  { name: "All", count: 1200, active: true },
  { name: "Electronics", count: 450, active: false },
  { name: "Fashion", count: 320, active: false },
  { name: "Home & Garden", count: 180, active: false },
  { name: "Sports", count: 150, active: false },
  { name: "Beauty", count: 100, active: false }
];

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
          <p className="text-gray-600">Discover amazing deals on your favorite products</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Categories */}
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Categories</h3>
              <CategoryFilter 
                categories={categories} 
                selectedCategory={selectedCategory}
                onCategorySelect={setSelectedCategory}
              />
            </div>

            {/* Sort and View Options */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Sort */}
              <div className="flex items-center gap-2">
                <SortAsc className="h-4 w-4 text-gray-500" />
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-1 border border-gray-300 rounded-lg p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="p-2"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="p-2"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            More Filters
          </Button>
        </div>

        {/* Products Grid */}
        <div className={`grid gap-6 ${
          viewMode === "grid" 
            ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1"
        }`}>
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button 
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-full font-medium"
          >
            Load More Products
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Products;
