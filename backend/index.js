// Entry point for the backend server
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import medicineRoutes from "./routes/medicines.js";
import orderRoutes from "./routes/orders.js";
import buyerOrderRoutes from "./routes/buyer-orders.js";
import sellerOrderRoutes from "./routes/seller-orders.js";
import userRoutes from "./routes/users.js";
import sellerRoutes from "./routes/sellers.js";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:8081",
      "http://localhost:5173",
      "http://localhost:3000",
      "https://localhost:8080",
      "http://localhost:8080", // Added for CORS support
      "http://localhost:8082", // Added for CORS support
      "http://34.239.119.233:5173",
      "https://kamyakahub.in",
      "http://localhost:8083",
      "https://admintraya.netlify.app"
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Example route for health check
app.get("/api/health", (req, res) => {
  res.json({ status: "Backend is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/buyer-orders", buyerOrderRoutes);
app.use("/api/seller-orders", sellerOrderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sellers", sellerRoutes);

const PORT = process.env.PORT || 5001;

const MONGO_URI =
  process.env.MONGO_URI || "mongodb+srv://Ishaan123:Ishaanisgreat123@cluster0.nbqxcen.mongodb.net/medicine-shops?retryWrites=true&w=majority&appName=Cluster0";

console.log("Connecting to MongoDB:", MONGO_URI);
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Successfully connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Backend server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});
