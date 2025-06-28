import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import CategoryFilter from "@/components/CategoryFilter";
import ProductCard from "@/components/ProductCard";
import {
  Filter,
  SortAsc,
  Grid3X3,
  List,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";

// API base URL
const API_BASE_URL = "http://localhost:5000/api";

// Product type definition
interface Product {
  _id: string;
  title: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  image: string;
  images: string[];
  category: string;
  rating: number;
  reviews: number;
  isFlashSale: boolean;
  isFeatured: boolean;
  stock: number;
  description: string;
  createdAt: string;
}

// Category type definition
interface Category {
  name: string;
  count: number;
  active: boolean;
}

// API response type
interface ProductsResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalProducts: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMoreProducts, setHasMoreProducts] = useState(false);
  const [totalProducts, setTotalProducts] = useState(0);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  // Fetch products from API
  const fetchProducts = async (page: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: "12",
        sortBy: sortBy,
      });

      if (selectedCategory !== "All") {
        params.append("category", selectedCategory);
      }

      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const response = await fetch(`${API_BASE_URL}/products?${params}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ProductsResponse = await response.json();

      if (append) {
        setProducts((prev) => [...prev, ...data.products]);
      } else {
        setProducts(data.products);
      }

      setHasMoreProducts(data.pagination.hasNextPage);
      setTotalProducts(data.pagination.totalProducts);
      setCurrentPage(data.pagination.currentPage);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/categories`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const categoriesData = await response.json();

      // Transform API categories to match our component's expected format
      const transformedCategories: Category[] = [
        {
          name: "All",
          count: totalProducts,
          active: selectedCategory === "All",
        },
        ...categoriesData.map((cat: any) => ({
          name: cat.name,
          count: cat.count,
          active: selectedCategory === cat.name,
        })),
      ];

      setCategories(transformedCategories);
    } catch (err) {
      console.error("Error fetching categories:", err);
      // Don't set error for categories as it's not critical
    }
  };

  // Load products when component mounts or dependencies change
  useEffect(() => {
    setCurrentPage(1);
    fetchProducts(1, false);
  }, [selectedCategory, sortBy, searchQuery]);

  // Update categories when total products change
  useEffect(() => {
    fetchCategories();
  }, [totalProducts, selectedCategory]);

  const handleLoadMore = () => {
    if (hasMoreProducts && !loading) {
      fetchProducts(currentPage + 1, true);
    }
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div
        style={{
          fontFamily:
            "'Ancizar Serif', 'Cormorant Garamond', 'EB Garamond', 'PT Serif', 'Playfair Display', serif",
        }}
      >
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="container mx-auto px-4 py-8">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}. Please try refreshing the page.
              </AlertDescription>
            </Alert>
            <Button
              onClick={() => fetchProducts(1, false)}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily:
          "'Ancizar Serif', 'Cormorant Garamond', 'EB Garamond', 'PT Serif', 'Playfair Display', serif",
      }}
    >
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {searchQuery
                ? `Search Results for "${searchQuery}"`
                : "All Traditional Toys"}
            </h1>
            <p className="text-gray-600">
              {searchQuery
                ? `Found ${totalProducts} matching traditional toys`
                : "Discover authentic handcrafted Kondapalli treasures"}
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Categories */}
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Categories
                </h3>
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategorySelect={handleCategoryChange}
                />
              </div>

              {/* Sort and View Options */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Sort */}
                <div className="flex items-center gap-2">
                  <SortAsc className="h-4 w-4 text-gray-500" />
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    aria-label="Sort products"
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
              Showing {products.length} of {totalProducts} traditional toys
            </p>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>

          {/* Loading State */}
          {loading && products.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
              <span className="ml-2 text-gray-600">
                Loading traditional toys...
              </span>
            </div>
          )}

          {/* Products Grid */}
          {!loading && products.length > 0 && (
            <div
              className={`grid gap-6 ${
                viewMode === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={{
                    id: product._id,
                    title: product.title,
                    originalPrice: product.originalPrice,
                    salePrice: product.salePrice,
                    discount: product.discount,
                    image: product.images?.[0] || product.image,
                    category: product.category,
                    rating: product.rating,
                    reviews: product.reviews,
                    isFlashSale: product.isFlashSale,
                    timeLeft: undefined,
                    stock: product.stock,
                  }}
                />
              ))}
            </div>
          )}

          {/* No Products Found */}
          {!loading && products.length === 0 && !error && (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600">
                {searchQuery
                  ? `No products match your search for "${searchQuery}"`
                  : "No products available in this category"}
              </p>
            </div>
          )}

          {/* Load More */}
          <div className="text-center mt-12">
            {hasMoreProducts && (
              <Button
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-full font-medium"
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Loading...
                  </>
                ) : (
                  "Load More Traditional Toys"
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
