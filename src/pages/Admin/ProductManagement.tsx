import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Package,
  ArrowLeft,
  Loader2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// API base URL
const API_BASE_URL = "http://localhost:5000/api";

interface Product {
  _id: string;
  title: string;
  description: string;
  originalPrice: number;
  salePrice: number;
  discount: number;
  category: string;
  stock: number;
  images: string[];
  rating: number;
  reviews: number;
  isFlashSale?: boolean;
  createdAt: string;
  updatedAt: string;
}

const ProductManagement = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [stockFilter, setStockFilter] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state for add/edit product
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    originalPrice: "",
    salePrice: "",
    category: "",
    stock: "",
    images: "",
    isFlashSale: false,
  });

  // Check admin access
  useEffect(() => {
    if (!isAuthenticated || user?.role !== "admin") {
      navigate("/");
      return;
    }
    fetchProducts();
  }, [isAuthenticated, user, navigate]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/products?limit=100`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to load products.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const productData = {
        title: formData.title,
        description: formData.description,
        originalPrice: parseFloat(formData.originalPrice),
        salePrice: parseFloat(formData.salePrice),
        category: formData.category,
        stock: parseInt(formData.stock),
        images: formData.images.split(",").map((url) => url.trim()),
        isFlashSale: formData.isFlashSale,
      };

      const url = editingProduct
        ? `${API_BASE_URL}/products/${editingProduct._id}`
        : `${API_BASE_URL}/products`;

      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: editingProduct
            ? "Product updated successfully!"
            : "Product added successfully!",
        });
        setIsAddDialogOpen(false);
        setEditingProduct(null);
        resetForm();
        fetchProducts();
      } else {
        throw new Error("Failed to save product");
      }
    } catch (error) {
      console.error("Error saving product:", error);
      toast({
        title: "Error",
        description: "Failed to save product.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/products/${productId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Product deleted successfully!",
        });
        fetchProducts();
      } else {
        throw new Error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      title: product.title,
      description: product.description,
      originalPrice: product.originalPrice.toString(),
      salePrice: product.salePrice.toString(),
      category: product.category,
      stock: product.stock.toString(),
      images: product.images.join(", "),
      isFlashSale: product.isFlashSale || false,
    });
    setIsAddDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      originalPrice: "",
      salePrice: "",
      category: "",
      stock: "",
      images: "",
      isFlashSale: false,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !categoryFilter || product.category === categoryFilter;
    const matchesStock =
      !stockFilter ||
      (stockFilter === "in-stock" && product.stock > 0) ||
      (stockFilter === "out-of-stock" && product.stock === 0) ||
      (stockFilter === "low-stock" && product.stock > 0 && product.stock <= 10);

    return matchesSearch && matchesCategory && matchesStock;
  });

  const categories = [...new Set(products.map((p) => p.category))];

  if (!isAuthenticated || user?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate("/admin")}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Product Management
                </h1>
                <p className="text-gray-600">Manage your product catalog</p>
              </div>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Product Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          setFormData({ ...formData, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Religious">Religious</SelectItem>
                          <SelectItem value="Animals">Animals</SelectItem>
                          <SelectItem value="Figurines">Figurines</SelectItem>
                          <SelectItem value="Rural Life">Rural Life</SelectItem>
                          <SelectItem value="Performing Arts">
                            Performing Arts
                          </SelectItem>
                          <SelectItem value="Royal">Royal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="originalPrice">Original Price</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        value={formData.originalPrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            originalPrice: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="salePrice">Sale Price</Label>
                      <Input
                        id="salePrice"
                        type="number"
                        value={formData.salePrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            salePrice: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="stock">Stock</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) =>
                          setFormData({ ...formData, stock: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="images">Image URLs (comma-separated)</Label>
                    <Input
                      id="images"
                      value={formData.images}
                      onChange={(e) =>
                        setFormData({ ...formData, images: e.target.value })
                      }
                      placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isFlashSale"
                      checked={formData.isFlashSale}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          isFlashSale: e.target.checked,
                        })
                      }
                    />
                    <Label htmlFor="isFlashSale">Flash Sale Product</Label>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="flex-1">
                      {editingProduct ? "Update Product" : "Add Product"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsAddDialogOpen(false);
                        setEditingProduct(null);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label htmlFor="search">Search Products</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="stock">Stock Status</Label>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All stock" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All stock</SelectItem>
                  <SelectItem value="in-stock">In Stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of Stock</SelectItem>
                  <SelectItem value="low-stock">Low Stock (≤10)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setCategoryFilter("");
                  setStockFilter("");
                }}
                variant="outline"
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600">Loading products...</p>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow key={product._id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-sm">{product.title}</p>
                          <p className="text-xs text-gray-500 line-clamp-1">
                            {product.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{product.category}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {formatPrice(product.salePrice)}
                        </p>
                        <p className="text-xs text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`text-sm font-medium ${
                          product.stock === 0
                            ? "text-red-600"
                            : product.stock <= 10
                            ? "text-orange-600"
                            : "text-green-600"
                        }`}
                      >
                        {product.stock} units
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {product.isFlashSale && (
                          <Badge variant="destructive">Flash Sale</Badge>
                        )}
                        {product.stock === 0 && (
                          <Badge variant="secondary">Out of Stock</Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => navigate(`/product/${product._id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(product)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(product._id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!loading && filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No products found</p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 text-sm text-gray-600">
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>
    </div>
  );
};

export default ProductManagement;
