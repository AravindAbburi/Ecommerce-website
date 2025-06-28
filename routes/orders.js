import express from "express";
import { Order, Product } from "../models/index.js";

const router = express.Router();

// POST /api/orders - Create new order
router.post("/", async (req, res) => {
  try {
    const { customer, items, shippingAddress, paymentMethod, notes } = req.body;

    // Validate required fields
    if (!customer || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Customer details and items are required" });
    }

    // Calculate totals and validate products
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res
          .status(400)
          .json({ message: `Product with ID ${item.productId} not found` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.title}. Available: ${product.stock}`,
        });
      }

      const itemTotal = product.salePrice * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        quantity: item.quantity,
        price: product.salePrice,
        title: product.title,
        image: product.images[0],
      });

      // Update product stock
      await Product.findByIdAndUpdate(product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    // Calculate shipping cost (free above ₹499)
    const shippingCost = subtotal >= 499 ? 0 : 100;
    const total = subtotal + shippingCost;

    // Create order
    const order = new Order({
      customer,
      items: orderItems,
      subtotal,
      shippingCost,
      total,
      shippingAddress,
      paymentMethod,
      notes,
    });

    await order.save();

    res.status(201).json({
      message: "Order created successfully",
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
      },
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res
      .status(500)
      .json({ message: "Error creating order", error: error.message });
  }
});

// GET /api/orders - Get orders (with filtering)
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 10, status, email, orderNumber } = req.query;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (email) {
      filter["customer.email"] = email;
    }

    if (orderNumber) {
      filter.orderNumber = orderNumber;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .populate("items.product", "title images")
      .lean();

    const total = await Order.countDocuments(filter);
    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      orders,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalOrders: total,
        hasNextPage: Number(page) < totalPages,
        hasPrevPage: Number(page) > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res
      .status(500)
      .json({ message: "Error fetching orders", error: error.message });
  }
});

// GET /api/orders/track/:orderNumber - Track order by order number
router.get("/track/:orderNumber", async (req, res) => {
  try {
    const order = await Order.findOne({ orderNumber: req.params.orderNumber })
      .populate("items.product", "title images")
      .lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error tracking order:", error);
    res
      .status(500)
      .json({ message: "Error tracking order", error: error.message });
  }
});

// GET /api/orders/stats/summary - Get order statistics (Admin only)
router.get("/stats/summary", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);

    const stats = await Order.aggregate([
      {
        $facet: {
          totalOrders: [{ $count: "count" }],
          totalRevenue: [{ $group: { _id: null, total: { $sum: "$total" } } }],
          todayOrders: [
            { $match: { createdAt: { $gte: today } } },
            { $count: "count" },
          ],
          todayRevenue: [
            { $match: { createdAt: { $gte: today } } },
            { $group: { _id: null, total: { $sum: "$total" } } },
          ],
          thisMonthOrders: [
            { $match: { createdAt: { $gte: thisMonth } } },
            { $count: "count" },
          ],
          thisMonthRevenue: [
            { $match: { createdAt: { $gte: thisMonth } } },
            { $group: { _id: null, total: { $sum: "$total" } } },
          ],
          statusCounts: [{ $group: { _id: "$status", count: { $sum: 1 } } }],
        },
      },
    ]);

    const summary = {
      totalOrders: stats[0].totalOrders[0]?.count || 0,
      totalRevenue: stats[0].totalRevenue[0]?.total || 0,
      todayOrders: stats[0].todayOrders[0]?.count || 0,
      todayRevenue: stats[0].todayRevenue[0]?.total || 0,
      thisMonthOrders: stats[0].thisMonthOrders[0]?.count || 0,
      thisMonthRevenue: stats[0].thisMonthRevenue[0]?.total || 0,
      statusCounts: stats[0].statusCounts,
    };

    res.json(summary);
  } catch (error) {
    console.error("Error fetching order stats:", error);
    res
      .status(500)
      .json({ message: "Error fetching order stats", error: error.message });
  }
});

// GET /api/orders/dashboard-summary - Get dashboard summary for admin
router.get("/dashboard-summary", async (req, res) => {
  try {
    // Import User and Product models
    const { User, Product } = await import("../models/index.js");

    // Get basic counts
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    // Calculate total revenue
    const orders = await Order.find({ status: { $ne: "cancelled" } });
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    // Get recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("customer", "name email")
      .lean();

    // Get top products (simplified - in real app you'd track sales)
    const topProducts = await Product.find()
      .sort({ rating: -1 })
      .limit(5)
      .select("title image salePrice rating")
      .lean();

    // Calculate growth percentages (simplified)
    const days = 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const previousStartDate = new Date(startDate);
    previousStartDate.setDate(previousStartDate.getDate() - days);

    const currentPeriodOrders = await Order.countDocuments({
      createdAt: { $gte: startDate },
    });
    const previousPeriodOrders = await Order.countDocuments({
      createdAt: { $gte: previousStartDate, $lt: startDate },
    });

    const currentPeriodRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: "cancelled" },
        },
      },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const previousPeriodRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousStartDate, $lt: startDate },
          status: { $ne: "cancelled" },
        },
      },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);

    const orderGrowth =
      previousPeriodOrders > 0
        ? ((currentPeriodOrders - previousPeriodOrders) /
            previousPeriodOrders) *
          100
        : 0;

    const revenueGrowth =
      previousPeriodRevenue[0]?.total > 0
        ? (((currentPeriodRevenue[0]?.total || 0) -
            previousPeriodRevenue[0]?.total) /
            previousPeriodRevenue[0]?.total) *
          100
        : 0;

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
      recentOrders,
      topProducts: topProducts.map((p) => ({
        ...p,
        salesCount: Math.floor(Math.random() * 50) + 1, // Mock data
      })),
      monthlyRevenue: currentPeriodRevenue[0]?.total || 0,
      orderGrowth: Math.round(orderGrowth * 10) / 10,
      revenueGrowth: Math.round(revenueGrowth * 10) / 10,
    });
  } catch (error) {
    console.error("Error fetching dashboard summary:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/orders/my-orders - Get orders for authenticated user
router.get("/my-orders", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const jwt = await import("jsonwebtoken");
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );

    // Get user's email from token (assuming we store email in token)
    // For now, we'll use the customer email from the request or token
    const userEmail = req.query.email || decoded.email;

    if (!userEmail) {
      return res.status(400).json({ message: "User email is required" });
    }

    const { page = 1, limit = 10, status } = req.query;

    const filter = { "customer.email": userEmail };

    if (status) {
      filter.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Order.countDocuments(filter);
    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      orders,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalOrders: total,
        hasNextPage: Number(page) < totalPages,
        hasPrevPage: Number(page) > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res
      .status(500)
      .json({ message: "Error fetching user orders", error: error.message });
  }
});

// GET /api/orders/:id - Get single order by ID
router.get("/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product", "title images category")
      .lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res
      .status(500)
      .json({ message: "Error fetching order", error: error.message });
  }
});

// PUT /api/orders/:id/status - Update order status (Admin only)
router.put("/:id/status", async (req, res) => {
  try {
    const { status, trackingNumber, estimatedDelivery, adminNotes } = req.body;

    const updateData = { status };

    if (trackingNumber) updateData.trackingNumber = trackingNumber;
    if (estimatedDelivery) updateData.estimatedDelivery = estimatedDelivery;
    if (adminNotes) updateData.notes = adminNotes;

    const order = await Order.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).populate("items.product", "title images");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    res
      .status(400)
      .json({ message: "Error updating order status", error: error.message });
  }
});

export default router;
