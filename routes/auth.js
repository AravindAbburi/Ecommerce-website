import express from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/index.js";

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "7d",
  });
};

// GET /api/auth - Show available auth endpoints
router.get("/", (req, res) => {
  res.json({
    message: "Authentication API",
    endpoints: {
      register: {
        method: "POST",
        path: "/api/auth/register",
        description: "Register a new user",
        body: {
          name: "string (required)",
          email: "string (required)",
          password: "string (required)",
          phone: "string (optional)",
        },
      },
      login: {
        method: "POST",
        path: "/api/auth/login",
        description: "Login user",
        body: {
          email: "string (required)",
          password: "string (required)",
        },
      },
      profile: {
        method: "GET",
        path: "/api/auth/profile",
        description: "Get user profile (requires JWT token)",
        headers: {
          Authorization: "Bearer YOUR_JWT_TOKEN",
        },
      },
      updateProfile: {
        method: "PUT",
        path: "/api/auth/profile",
        description: "Update user profile (requires JWT token)",
        headers: {
          Authorization: "Bearer YOUR_JWT_TOKEN",
        },
        body: {
          name: "string (optional)",
          phone: "string (optional)",
          profile: "object (optional)",
          preferences: "object (optional)",
        },
      },
    },
  });
});

// POST /api/auth/register - User registration
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email, and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists",
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      phone,
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      message: "Error registering user",
      error: error.message,
    });
  }
});

// POST /api/auth/login - User login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Check if account is locked
    if (user.isLocked()) {
      return res.status(423).json({
        message: "Account is temporarily locked. Please try again later.",
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      await user.incLoginAttempts();
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    // Reset login attempts on successful login
    await user.resetLoginAttempts();

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isEmailVerified: user.isEmailVerified,
      },
      token,
    });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({
      message: "Error logging in",
      error: error.message,
    });
  }
});

// GET /api/auth/profile - Get user profile
router.get("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching profile:", error);
    res.status(401).json({
      message: "Invalid token",
      error: error.message,
    });
  }
});

// PUT /api/auth/profile - Update user profile
router.put("/profile", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update allowed fields
    const { name, phone, profile, preferences } = req.body;

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (profile) user.profile = { ...user.profile, ...profile };
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profile: user.profile,
        preferences: user.preferences,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({
      message: "Error updating profile",
      error: error.message,
    });
  }
});

// POST /api/auth/change-password - Change password
router.post("/change-password", async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      message: "Error changing password",
      error: error.message,
    });
  }
});

// POST /api/auth/forgot-password - Forgot password
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || "your-secret-key",
      { expiresIn: "1h" }
    );

    // Save reset token to user
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    // TODO: Send email with reset link
    // For now, just return the token (in production, send via email)
    res.json({
      message: "Password reset link sent to your email",
      resetToken, // Remove this in production
    });
  } catch (error) {
    console.error("Error processing forgot password:", error);
    res.status(500).json({
      message: "Error processing forgot password request",
      error: error.message,
    });
  }
});

// POST /api/auth/reset-password - Reset password
router.post("/reset-password", async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    const user = await User.findById(decoded.userId);

    if (!user || user.resetPasswordToken !== token) {
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });
    }

    if (user.resetPasswordExpires < new Date()) {
      return res.status(400).json({ message: "Reset token has expired" });
    }

    // Update password and clear reset token
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({
      message: "Error resetting password",
      error: error.message,
    });
  }
});

// POST /api/auth/logout - Logout (client-side token removal)
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out successfully" });
});

// GET /api/auth/users - Get all users (Admin only)
router.get("/users", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    const adminUser = await User.findById(decoded.userId);

    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { page = 1, limit = 10, search, role, status } = req.query;
    const filter = {};

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role) {
      filter.role = role;
    }

    if (status === "verified") {
      filter.isEmailVerified = true;
    } else if (status === "unverified") {
      filter.isEmailVerified = false;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await User.countDocuments(filter);
    const totalPages = Math.ceil(total / Number(limit));

    res.json({
      users,
      pagination: {
        currentPage: Number(page),
        totalPages,
        totalUsers: total,
        hasNextPage: Number(page) < totalPages,
        hasPrevPage: Number(page) > 1,
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
});

// GET /api/auth/users/:id - Get single user (Admin only)
router.get("/users/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    const adminUser = await User.findById(decoded.userId);

    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      message: "Error fetching user",
      error: error.message,
    });
  }
});

// PUT /api/auth/users/:id - Update user (Admin only)
router.put("/users/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    const adminUser = await User.findById(decoded.userId);

    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    const { name, email, phone, role } = req.body;
    const updateData = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (role) updateData.role = role;

    const user = await User.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      message: "Error updating user",
      error: error.message,
    });
  }
});

// DELETE /api/auth/users/:id - Delete user (Admin only)
router.delete("/users/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    const adminUser = await User.findById(decoded.userId);

    if (!adminUser || adminUser.role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    // Prevent admin from deleting themselves
    if (req.params.id === adminUser._id.toString()) {
      return res
        .status(400)
        .json({ message: "Cannot delete your own account" });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      message: "Error deleting user",
      error: error.message,
    });
  }
});

export default router;
