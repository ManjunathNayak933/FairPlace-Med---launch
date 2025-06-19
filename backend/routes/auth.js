import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { authenticateToken } from "../authenticateToken.js";
import multer from "multer";
import path from "path";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "changeme";

// Multer setup for prescription uploads
const prescriptionStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const uploadPrescription = multer({ storage: prescriptionStorage });

// Register
router.post("/register", async (req, res) => {
  console.log("[POST] /api/auth/register - Body:", req.body);
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      console.warn("[POST] /api/auth/register - Missing fields:", req.body);
      return res.status(400).json({ error: "All fields are required" });
    }
    const existing = await User.findOne({ email });
    if (existing) {
      console.warn("[POST] /api/auth/register - Duplicate email:", email);
      return res.status(400).json({ error: "Email already registered" });
    }
    const user = new User({ name, email, password, role });
    await user.save();
    console.log("[POST] /api/auth/register - User created:", user._id);
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("[POST] /api/auth/register - Error:", err);
    res
      .status(500)
      .json({ error: "Registration failed", details: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  console.log("[POST] /api/auth/login - Body:", req.body);
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      console.warn("[POST] /api/auth/login - Invalid credentials for email:", email);
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.warn("[POST] /api/auth/login - Password mismatch for email:", email);
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    console.log("[POST] /api/auth/login - User logged in:", user._id);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        shopName: user.shopName,
        gstNumber: user.gstNumber,
        shopLocation: user.shopLocation,
        paymentQrCode: user.paymentQrCode,
      },
      redirect: "/dashboard", // Indicate frontend should redirect after login
    });
  } catch (err) {
    console.error("[POST] /api/auth/login - Error:", err);
    res.status(500).json({ error: "Login failed", details: err.message });
  }
});

// Buyer Login
router.post("/buyer/login", async (req, res) => {
  console.log("[POST] /api/auth/buyer/login - Body:", req.body);
  try {
    const { phone, password } = req.body;
    const Buyer = (await import("../models/Buyer.js")).default;
    const buyer = await Buyer.findOne({ phone });
    if (!buyer) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    // Compare password
    const bcrypt = (await import("bcrypt")).default;
    const isMatch = await bcrypt.compare(password, buyer.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    // Generate token (optional: you can use buyer._id and email)
    const token = jwt.sign(
      { id: buyer._id, email: buyer.email, role: "buyer" },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      token,
      buyer: {
        id: buyer._id,
        name: buyer.name,
        email: buyer.email,
        phone: buyer.phone,
      },
    });
  } catch (err) {
    console.error("[POST] /api/auth/buyer/login - Error:", err);
    res.status(500).json({ error: "Login failed", details: err.message });
  }
});

// Buyer Signup
router.post("/buyer/signup", async (req, res) => {
  console.log("[POST] /api/auth/buyer/signup - Body:", req.body);
  try {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Name, email, and password are required" });
    }
    // Only check for duplicate in Buyer collection
    const Buyer = (await import("../models/Buyer.js")).default;
    // const existingBuyer = await Buyer.findOne({ email });
    const existingBuyer = await Buyer.findOne({ phone });
    if (existingBuyer) {
      return res.status(400).json({ error: "Phone number already registered as buyer" });
    }
    // Create new buyer
    const buyer = new Buyer({ name, email, password, phone });
    await buyer.save();
    console.log("[POST] /api/auth/buyer/signup - Buyer created:", buyer._id);
    res.status(201).json({ message: "Buyer registered successfully" });
  } catch (err) {
    console.error("[POST] /api/auth/buyer/signup - Error:", err);
    res.status(500).json({ error: "Signup failed", details: err.message });
  }
});

// Profile (protected)
router.get("/profile", authenticateToken, async (req, res) => {
  console.log("[GET] /api/auth/profile - User:", req.user);
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      console.warn("[GET] /api/auth/profile - User not found:", req.user.id);
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    console.error("[GET] /api/auth/profile - Error:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch profile", details: err.message });
  }
});

// Update profile (protected)
router.put("/profile", authenticateToken, async (req, res) => {
  console.log("[PUT] /api/auth/profile - User:", req.user, "Updates:", req.body);
  try {
    const updates = req.body;
    // Prevent email/role change for now, and never allow password change here
    delete updates.password;
    delete updates.role;
    delete updates.email;
    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!user) {
      console.warn("[PUT] /api/auth/profile - User not found:", req.user.id);
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    console.error("[PUT] /api/auth/profile - Error:", err);
    res
      .status(500)
      .json({ error: "Failed to update profile", details: err.message });
  }
});

// Buyer Me (profile) endpoint
router.get("/buyer/me", authenticateToken, async (req, res) => {
  try {
    const Buyer = (await import("../models/Buyer.js")).default;
    const buyer = await Buyer.findById(req.user.id).select("-password");
    if (!buyer) {
      return res.status(404).json({ error: "Buyer not found" });
    }
    res.json({ buyer });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch buyer profile", details: err.message });
  }
});

// Prescription image upload endpoint
router.post("/buyer/upload-prescription", authenticateToken, uploadPrescription.single("prescription"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  // Return the file path or URL
  const imageUrl = `/uploads/${req.file.filename}`;
  res.status(201).json({ imageUrl });
});

export default router;
