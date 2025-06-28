import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "./AuthContext";

// API base URL
const API_BASE_URL = "http://localhost:5000/api";

interface CartItem {
  _id: string;
  title: string;
  salePrice: number;
  originalPrice: number;
  image: string;
  quantity: number;
  category: string;
  stock: number;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Omit<CartItem, "quantity">) => Promise<void>;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartTotal: () => number;
  getCartSubtotal: () => number;
  getShippingCost: () => number;
  loading: boolean;
  syncCartWithBackend: () => Promise<void>;
  requiresAuth: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCartItems(parsedCart);
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
        localStorage.removeItem("cart");
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = useCallback(
    async (product: Omit<CartItem, "quantity">) => {
      // Check if user is authenticated
      if (!isAuthenticated) {
        toast({
          title: "Authentication Required",
          description:
            "Please sign in or create an account to add items to your cart.",
          variant: "destructive",
          action: (
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => (window.location.href = "/login")}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Sign In
              </button>
              <button
                onClick={() => (window.location.href = "/register")}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
              >
                Sign Up
              </button>
            </div>
          ),
        });
        return;
      }

      try {
        setLoading(true);

        // Check stock availability
        if (product.stock <= 0) {
          toast({
            title: "Out of Stock",
            description: `${product.title} is currently out of stock.`,
            variant: "destructive",
          });
          return;
        }

        setCartItems((prev) => {
          const existingItem = prev.find((item) => item._id === product._id);

          if (existingItem) {
            // Check if adding more would exceed stock
            if (existingItem.quantity + 1 > product.stock) {
              return prev; // Return unchanged, toast will be called outside
            }

            // If item exists, increase quantity
            return prev.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            // If item doesn't exist, add new item
            return [...prev, { ...product, quantity: 1 }];
          }
        });

        // Show toast messages outside of setState
        const existingItem = cartItems.find((item) => item._id === product._id);
        if (existingItem) {
          if (existingItem.quantity + 1 > product.stock) {
            toast({
              title: "Stock Limit Reached",
              description: `Only ${product.stock} units available for ${product.title}.`,
              variant: "destructive",
            });
          } else {
            toast({
              title: "Quantity Updated",
              description: `${product.title} quantity increased in cart.`,
            });
          }
        } else {
          toast({
            title: "Added to Cart!",
            description: `${product.title} has been added to your cart.`,
          });
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast({
          title: "Error",
          description: "Failed to add item to cart. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [cartItems, toast, isAuthenticated]
  );

  const removeFromCart = useCallback(
    (id: string) => {
      // Check if user is authenticated
      if (!isAuthenticated) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to manage your cart.",
          variant: "destructive",
        });
        return;
      }

      const item = cartItems.find((item) => item._id === id);
      setCartItems((prev) => prev.filter((item) => item._id !== id));
      toast({
        title: "Item Removed",
        description: `${item?.title} removed from cart.`,
      });
    },
    [cartItems, toast, isAuthenticated]
  );

  const updateQuantity = useCallback(
    (id: string, quantity: number) => {
      // Check if user is authenticated
      if (!isAuthenticated) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to manage your cart.",
          variant: "destructive",
        });
        return;
      }

      if (quantity === 0) {
        removeFromCart(id);
        return;
      }

      const item = cartItems.find((item) => item._id === id);
      if (item && quantity > item.stock) {
        toast({
          title: "Stock Limit Reached",
          description: `Only ${item.stock} units available for ${item.title}.`,
          variant: "destructive",
        });
        return;
      }

      setCartItems((prev) =>
        prev.map((item) => (item._id === id ? { ...item, quantity } : item))
      );
    },
    [cartItems, removeFromCart, toast, isAuthenticated]
  );

  const clearCart = useCallback(() => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to manage your cart.",
        variant: "destructive",
      });
      return;
    }

    setCartItems([]);
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    });
  }, [toast, isAuthenticated]);

  const getCartCount = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const getCartSubtotal = useCallback(() => {
    return cartItems.reduce(
      (total, item) => total + item.salePrice * item.quantity,
      0
    );
  }, [cartItems]);

  const getShippingCost = useCallback(() => {
    const subtotal = getCartSubtotal();
    return subtotal >= 499 ? 0 : 100; // Free shipping above ₹499
  }, [getCartSubtotal]);

  const getCartTotal = useCallback(() => {
    return getCartSubtotal() + getShippingCost();
  }, [getCartSubtotal, getShippingCost]);

  const syncCartWithBackend = useCallback(async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      return;
    }

    try {
      setLoading(true);

      // Get current cart items
      const cartItemIds = cartItems.map((item) => item._id);

      if (cartItemIds.length === 0) return;

      // Fetch updated product data from backend
      const response = await fetch(
        `${API_BASE_URL}/products?ids=${cartItemIds.join(",")}`
      );

      if (!response.ok) {
        throw new Error("Failed to sync cart with backend");
      }

      const data = await response.json();
      const updatedProducts = data.products;

      // Track items to remove for toast notifications
      const itemsToRemove: CartItem[] = [];

      // Update cart items with fresh data from backend
      setCartItems((prev) =>
        prev
          .map((cartItem) => {
            const updatedProduct = updatedProducts.find(
              (p: any) => p._id === cartItem._id
            );
            if (updatedProduct) {
              return {
                ...cartItem,
                salePrice: updatedProduct.salePrice,
                originalPrice: updatedProduct.originalPrice,
                stock: updatedProduct.stock,
                title: updatedProduct.title,
                image: updatedProduct.images?.[0] || updatedProduct.image,
              };
            }
            return cartItem;
          })
          .filter((cartItem) => {
            // Remove items that no longer exist in backend
            const exists = updatedProducts.find(
              (p: any) => p._id === cartItem._id
            );
            if (!exists) {
              itemsToRemove.push(cartItem);
            }
            return exists;
          })
      );

      // Show toast messages for removed items outside of setState
      itemsToRemove.forEach((item) => {
        toast({
          title: "Item Removed",
          description: `${item.title} is no longer available and has been removed from your cart.`,
          variant: "destructive",
        });
      });
    } catch (error) {
      console.error("Error syncing cart with backend:", error);
    } finally {
      setLoading(false);
    }
  }, [cartItems, toast, isAuthenticated]);

  const value: CartContextType = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartCount,
    getCartTotal,
    getCartSubtotal,
    getShippingCost,
    loading,
    syncCartWithBackend,
    requiresAuth: true, // Enable authentication requirement
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
