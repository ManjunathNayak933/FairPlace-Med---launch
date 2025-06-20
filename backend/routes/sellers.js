import express from "express";
import multer from "multer";
import path from "path";
import User from "../models/User.js";
import { count } from "console";
import Order from "../models/Order.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Get all sellers (for admin dashboard)
router.get("/", async (req, res) => {
  console.log("[GET] /api/sellers");
  try {
    const sellers = await User.find({ role: "seller" })
      .select("-password") // Exclude password field
      .sort({ createdAt: -1 });

    // Transform for frontend format
    const formattedSellers = sellers.map(seller => ({
      id: seller._id,
      name: seller.name,
      shopName: seller.shopName,
      email: seller.email,
      phone: seller.phone,
      gstNumber: seller.gstNumber,
      phone: seller.phone || "",
      address: seller.shopLocation || "",
      location: {
        lat: 0, // Default coordinates (can be enhanced later)
        lng: 0
      },
      status: "active", // Can be enhanced with actual status tracking
      createdAt: seller.createdAt || new Date().toISOString()
    }));

    res.json(formattedSellers);
  } catch (err) {
    console.error("[GET] /api/sellers - Error:", err);
    res.status(500).json({ error: "Failed to fetch sellers" });
  }
});

////////////////admin cont dashboard

router.get("/count", async (req, res) => {
  console.log("[GET] /api/sellers");
  try {
    const sellers = await User.find({ role: "seller" }).count()
    const pending = await Order.find({ status: "pending" }).count()
    const inProgress = await Order.find({ status: "shipped" }).count()
    const completed = await Order.find({ status: "confirmed" }).count()

    

    res.json({sell:sellers,pend:pending,progress:inProgress,complete:completed});
  } catch (err) {
    console.error("[GET] /api/sellers - Error:", err);
    res.status(500).json({ error: "Failed to fetch sellers" });
  }
});

// Delete seller (for admin)
router.delete("/:id", async (req, res) => {
  console.log("[DELETE] /api/sellers/:id - Params:", req.params);
  try {
    const { id } = req.params;
    
    const seller = await User.findOneAndDelete({ _id: id, role: "seller" });
    if (!seller) {
      return res.status(404).json({ error: "Seller not found" });
    }

    console.log("[DELETE] /api/sellers/:id - Seller deleted:", id);
    res.json({ message: "Seller deleted successfully" });
  } catch (err) {
    console.error("[DELETE] /api/sellers/:id - Error:", err);
    res.status(500).json({ error: "Failed to delete seller" });
  }
});

// Seller registration route
// router.post("/register", upload.single("paymentQrCode"), async (req, res) => {
//   console.log("[POST] /api/sellers/register - Body:", req.body, "File:", req.file);
//   if (req.file) {
//     console.log("[POST] /api/sellers/register - Uploaded file:", req.file.filename);
//   } else {
//     console.log("[POST] /api/sellers/register - No file uploaded");
//   }
//   try {
//     const { name, shopName, gstNumber, email, password, shopLocation } = req.body;
//     const paymentQrCode = req.file ? req.file.filename : null;

//     // Check for duplicate email
//     const existing = await User.findOne({ email });
//     if (existing) {
//       console.warn("[POST] /api/sellers/register - Duplicate email:", email);
//       return res.status(400).json({ error: "Email already registered" });
//     }

//     const user = new User({
//       name,
//       shopName,
//       gstNumber,
//       email,
//       password,
//       shopLocation,
//       paymentQrCode,
//       role: "seller",
//     });
//     await user.save();
//     console.log("[POST] /api/sellers/register - Seller created:", user._id);
//     res.status(201).json({ message: "Seller registered successfully", user });
//   } catch (err) {
//     console.error("[POST] /api/sellers/register - Error:", err);
//     res.status(400).json({ error: err.message });
//   }
// });


router.post("/register", upload.single("paymentQrCode"), async (req, res) => {
  console.log("[POST] /api/sellers/register - Body:", req.body, "File:", req.file);

  try {
    const { name, shopName, gstNumber, email, password, shopLocation,phone } = req.body;
    const paymentQrCode = req.file ? req.file.filename : null;

    // Parse shopLocation JSON string
    let parsedShopLocation = undefined;
    if (shopLocation) {
      try {
        parsedShopLocation = JSON.parse(shopLocation);
      } catch (e) {
        return res.status(400).json({ error: "Invalid shopLocation format" });
      }
    }

    // Check for duplicate email
    const existing = await User.findOne({ email });
    if (existing) {
      console.warn("[POST] /api/sellers/register - Duplicate email:", email);
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create new seller user
    const user = new User({
      name,
      shopName,
      gstNumber,
      email,
      phone,
      password, // You should hash password in real app before saving
      shopLocation: parsedShopLocation,
      paymentQrCode,
      role: "seller",
    });

    await user.save();
    console.log("[POST] /api/sellers/register - Seller created:", user._id);
    res.status(201).json({ message: "Seller registered successfully", user });
  } catch (err) {
    console.error("[POST] /api/sellers/register - Error:", err);
    res.status(400).json({ error: err.message });
  }
});


export default router;
