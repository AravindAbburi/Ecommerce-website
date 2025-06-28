import mongoose from "mongoose";
import { User } from "./models/index.js";
import fs from "fs";

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

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Check if admin user already exists
    const existingAdmin = await User.findOne({
      email: "abburiaravind2005@gmail.com",
    });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      console.log("Email: abburiaravind2005@gmail.com");
      console.log("Password: Aravind@2005");
      console.log("Role: " + existingAdmin.role);
      process.exit(0);
    }

    // Create admin user
    const adminUser = new User({
      name: "Aravind Admin",
      email: "abburiaravind2005@gmail.com",
      password: "Aravind@2005",
      role: "admin",
      isEmailVerified: true,
    });

    await adminUser.save();
    console.log("Admin user created successfully!");
    console.log("Email: abburiaravind2005@gmail.com");
    console.log("Password: Aravind@2005");
    console.log("Role: admin");
    console.log("You can now login to access the admin dashboard.");
  } catch (error) {
    console.error("Error creating admin user:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdminUser();
