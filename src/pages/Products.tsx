import { useState } from "react";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import { Filter, SortAsc, Grid3X3, List } from "lucide-react";
import { Button } from "@/components/ui/button";

const products = [
  {
    id: 1,
    title: "Traditional Dancing Doll Set",
    originalPrice: 2500,
    salePrice: 1999,
    discount: 20,
    image: "/placeholder.svg",
    category: "Traditional Dolls",
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
    category: "Traditional Dolls",
    rating: 4.9,
    reviews: 145,
    isFlashSale: false
  },
  {
    id: 5,
    title: "Peacock Wall Hanging",
    originalPrice: 1599,
    salePrice: 1199,
    discount: 25,
    image: "/placeholder.svg",
    category: "Home Decor",
    rating: 4.8,
    reviews: 92,
    isFlashSale: true,
    timeLeft: "1h 45m"
  },
  {
    id: 6,
    title: "Lord Ganesha Figurine",
    originalPrice: 2299,
    salePrice: 1799,
    discount: 22,
    image: "/placeholder.svg",
    category: "Figurines",
    rating: 4.6,
    reviews: 103,
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Traditional Toys</h1>
          <p className="text-gray-600">Discover authentic handcrafted Kondapalli treasures</p>
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
            Showing {filteredProducts.length} of {products.length} traditional toys
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
            Load More Traditional Toys
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Products;
