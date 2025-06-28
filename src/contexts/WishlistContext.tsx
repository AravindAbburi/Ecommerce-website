import React, { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";

interface WishlistItem {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
}

interface WishlistContextType {
  wishlistItems: WishlistItem[];
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (id: number) => void;
  clearWishlist: () => void;
  isInWishlist: (id: number) => boolean;
  getWishlistCount: () => number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined
);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({
  children,
}) => {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const { toast } = useToast();

  const addToWishlist = (product: WishlistItem) => {
    setWishlistItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);

      if (existingItem) {
        // If item exists, remove it (toggle off)
        toast({
          title: "Removed from Wishlist",
          description: `${product.title} removed from your wishlist.`,
        });
        return prev.filter((item) => item.id !== product.id);
      } else {
        // If item doesn't exist, add new item
        toast({
          title: "Added to Wishlist!",
          description: `${product.title} has been added to your wishlist.`,
        });
        return [...prev, product];
      }
    });
  };

  const removeFromWishlist = (id: number) => {
    const item = wishlistItems.find((item) => item.id === id);
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
    toast({
      title: "Removed from Wishlist",
      description: `${item?.title} removed from your wishlist.`,
    });
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  const isInWishlist = (id: number) => {
    return wishlistItems.some((item) => item.id === id);
  };

  const getWishlistCount = () => {
    return wishlistItems.length;
  };

  const value: WishlistContextType = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    getWishlistCount,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
