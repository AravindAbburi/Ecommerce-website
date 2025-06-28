import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";

// Import routes
import productsRouter from "./routes/products.js";
import ordersRouter from "./routes/orders.js";
import workshopVisitsRouter from "./routes/workshop-visits.js";
import authRouter from "./routes/auth.js";
import analyticsRouter from "./routes/analytics.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Get MongoDB URI from .env or mongodb.md
let mongoUri = process.env.MONGODB_URI;
if (!mongoUri) {
  try {
    mongoUri = fs.readFileSync("mongodb.md", "utf-8").trim();
  } catch (e) {
    console.error("MongoDB URI not found in .env or mongodb.md");
    process.exit(1);
  }
}

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running!" });
});

// API Routes
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/workshop-visits", workshopVisitsRouter);
app.use("/api/auth", authRouter);
app.use("/api/analytics", analyticsRouter);

// 404 handler for undefined routes
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error("Global error handler:", error);
  res.status(500).json({
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? error.message
        : "Something went wrong",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`API Documentation:`);
  console.log(`  Products: http://localhost:${PORT}/api/products`);
  console.log(`  Orders: http://localhost:${PORT}/api/orders`);
  console.log(
    `  Workshop Visits: http://localhost:${PORT}/api/workshop-visits`
  );
  console.log(`  Auth: http://localhost:${PORT}/api/auth`);
  console.log(`  Analytics: http://localhost:${PORT}/api/analytics`);
});
