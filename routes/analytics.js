import express from "express";
import { Order, Product, User } from "../models/index.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Admin middleware function
const adminAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res
        .status(401)
        .json({ message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    const user = await User.findById(decoded.userId);

    if (!user || user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Admin privileges required." });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// Get dashboard summary statistics
router.get("/summary", adminAuth, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

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
      .populate("customer", "name email");

    // Get top products (simplified - in real app you'd track sales)
    const topProducts = await Product.find()
      .sort({ rating: -1 })
      .limit(5)
      .select("title image salePrice rating");

    // Calculate growth percentages (simplified)
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
        ...p.toObject(),
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

// Get detailed analytics data
router.get("/", adminAuth, async (req, res) => {
  try {
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Overview data
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const orders = await Order.find({ status: { $ne: "cancelled" } });
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    // Calculate growth (simplified)
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

    const userGrowth = 0; // Simplified - would need to track user registration dates

    // Sales data (mock data for now)
    const salesData = {
      daily: [],
      monthly: [],
    };

    // Generate mock daily data
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      salesData.daily.push({
        date: date.toISOString().split("T")[0],
        revenue: Math.floor(Math.random() * 5000) + 1000,
        orders: Math.floor(Math.random() * 20) + 5,
      });
    }

    // Generate mock monthly data
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    for (let i = 0; i < 12; i++) {
      salesData.monthly.push({
        month: months[i],
        revenue: Math.floor(Math.random() * 50000) + 10000,
        orders: Math.floor(Math.random() * 200) + 50,
      });
    }

    // Top products
    const topProducts = await Product.find()
      .sort({ rating: -1 })
      .limit(10)
      .select("title image salePrice rating");

    // Top categories (mock data)
    const topCategories = [
      { category: "Religious", salesCount: 45, revenue: 125000 },
      { category: "Animals", salesCount: 38, revenue: 98000 },
      { category: "Figurines", salesCount: 32, revenue: 85000 },
      { category: "Rural Life", salesCount: 28, revenue: 72000 },
      { category: "Performing Arts", salesCount: 25, revenue: 65000 },
    ];

    // User stats (mock data)
    const userStats = {
      newUsers: Math.floor(totalUsers * 0.3),
      activeUsers: Math.floor(totalUsers * 0.7),
      userRetention: 85.5,
    };

    // Order stats
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const orderStats = {
      averageOrderValue,
      conversionRate: 3.2, // Mock data
      returnRate: 1.5, // Mock data
    };

    res.json({
      overview: {
        totalRevenue,
        totalOrders,
        totalUsers,
        totalProducts,
        revenueGrowth: Math.round(revenueGrowth * 10) / 10,
        orderGrowth: Math.round(orderGrowth * 10) / 10,
        userGrowth: Math.round(userGrowth * 10) / 10,
      },
      salesData,
      topProducts: topProducts.map((p) => ({
        ...p.toObject(),
        salesCount: Math.floor(Math.random() * 50) + 1,
        revenue: Math.floor(Math.random() * 10000) + 1000,
      })),
      topCategories,
      userStats,
      orderStats,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
