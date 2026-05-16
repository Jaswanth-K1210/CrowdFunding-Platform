import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Import all models so collections are created on startup
import User from "./models/User.js";
import "./models/Campaign.js";
import "./models/Donation.js";
import "./models/Comment.js";
import bcrypt from "bcryptjs";

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173", // React dev server
  credentials: true,              // allow cookies
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "CrowdFunding API is running" });
});

// MongoDB Atlas connection
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    tls: true,
    tlsAllowInvalidCertificates: true,
  })
  .then(async () => {
    console.log("Connected to MongoDB Atlas");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

    // Ensure all collections exist in Atlas
    try {
      const db = mongoose.connection.db;
      const existing = (await db.listCollections().toArray()).map((c) => c.name);
      const required = ["users", "campaigns", "donations", "comments"];

      for (const name of required) {
        if (!existing.includes(name)) {
          await db.createCollection(name);
          console.log(`Created collection: ${name}`);
        }
      }

      // Seed admin user if not already in DB
      const adminExists = await User.findOne({ role: "admin" });
      if (!adminExists) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, salt);
        await User.create({
          name: process.env.ADMIN_NAME,
          email: process.env.ADMIN_EMAIL,
          passwordHash,
          role: "admin",
          isVerified: true,
        });
        console.log("Admin user created");
      }
    } catch (e) {
      console.error("Post-connect init error:", e);
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });


