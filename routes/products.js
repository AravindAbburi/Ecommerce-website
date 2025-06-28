import express from "express";
import { Product } from "../models/index.js";

const router = express.Router();

// GET /api/products - Get all products with filtering and pagination
router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      search,
      sortBy = "featured",
      minPrice,
      maxPrice,
      featured,
      flashSale,
      ids, // Add support for fetching by IDs
    } = req.query;

    // If ids parameter is provided, fetch specific products
    if (ids) {
      const productIds = ids.split(",").map((id) => id.trim());
      const products = await Product.find({ _id: { $in: productIds } }).lean();
      return res.json({ products });
    }

    // Build filter object
    const filter = {};

    if (category && category !== "All") {
      filter.category = category;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    if (minPrice || maxPrice) {
      filter.salePrice = {};
      if (minPrice) filter.salePrice.$gte = Number(minPrice);
      if (maxPrice) filter.salePrice.$lte = Number(maxPrice);
    }

    if (featured === "true") {
      filter.isFeatured = true;
    }

    if (flashSale === "true") {
      filter.isFlashSale = true;
    }

    // Build sort object
    let sort = {};
    switch (sortBy) {
      case "price-low":
        sort.salePrice = 1;
        break;
      case "price-high":
        sort.salePrice = -1;
        break;
      case "rating":
        sort.rating = -1;
        break;
      case "newest":
        sort.createdAt = -1;
        break;
      case "featured":
      default:
        sort.isFeatured = -1;
        sort.createdAt = -1;
        break;
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(filter);
    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      products,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalProducts: total,
        hasNextPage: Number(page) < totalPages,
        hasPrevPage: Number(page) > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
});

// GET /api/products/featured - Get featured products
router.get("/featured", async (req, res) => {
  try {
    const products = await Product.find({ isFeatured: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();

    res.json(products);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    res.status(500).json({
      message: "Error fetching featured products",
      error: error.message,
    });
  }
});

// GET /api/products/flash-sale - Get flash sale products
router.get("/flash-sale", async (req, res) => {
  try {
    const products = await Product.find({ isFlashSale: true })
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    res.json(products);
  } catch (error) {
    console.error("Error fetching flash sale products:", error);
    res.status(500).json({
      message: "Error fetching flash sale products",
      error: error.message,
    });
  }
});

// GET /api/products/categories - Get all categories with counts
router.get("/categories", async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          name: "$_id",
          count: 1,
          _id: 0,
        },
      },
      {
        $sort: { name: 1 },
      },
    ]);

    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res
      .status(500)
      .json({ message: "Error fetching categories", error: error.message });
  }
});

// GET /api/products/:id - Get single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
});

// POST /api/products - Create new product (Admin only)
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res
      .status(400)
      .json({ message: "Error creating product", error: error.message });
  }
});

// PUT /api/products/:id - Update product (Admin only)
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(400)
      .json({ message: "Error updating product", error: error.message });
  }
});

// DELETE /api/products/:id - Delete product (Admin only)
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
});

export default router;
