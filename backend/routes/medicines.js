import express from "express";
import multer from "multer";
import path from "path";
import Product from "../models/Product.js";
import csvParser from "csv-parser";
import fs from "fs";
import { authenticateToken } from "../authenticateToken.js";

const router = express.Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Multer setup for CSV upload (reuse storage)
const uploadCsv = multer({ dest: "uploads/" });

// Get all products (optionally filter by sellerId, paginated, with search)
// router.get("/", async (req, res) => {
//   console.log("[GET] /api/medicines - Query:", req.query);
//   try {
//     const { sellerId, page = 1, limit = 100, search } = req.query;
//       // Build base filter
//     const filter = sellerId ? { sellerId } : {};
    
//     // Add search functionality if search query provided
//     if (search && search.trim()) {
//       const searchRegex = new RegExp(search.trim(), 'i'); // Case-insensitive search
//       filter.$or = [
//         { name: { $regex: searchRegex } },
//         { description: { $regex: searchRegex } },
//         { category: { $regex: searchRegex } }
//       ];
//     }
    
//     const pageNum = parseInt(page, 10) || 1;
//     const limitNum = parseInt(limit, 10) || 100;
//     const skip = (pageNum - 1) * limitNum;
    
//     const [products, total] = await Promise.all([
//       Product.find(filter).skip(skip).limit(limitNum),
//       Product.countDocuments(filter),
//     ]);
//     console.log(products,"productsproductsproducts")
//     res.json({
//       products,
//       total,
//       page: pageNum,
//       limit: limitNum,
//       totalPages: Math.ceil(total / limitNum),
//       searchQuery: search || null,
//     });
//   } catch (err) {
//     console.error("[GET] /api/medicines - Error:", err);
//     res.status(500).json({ error: "Failed to fetch products" });
//   }
// });

// Backend: routes/medicines.js
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 12;
  const search = req.query.search || "";

  const skip = (page - 1) * limit;

  let query = { isDeleted: false };

   if (search && search.trim()) {
    query.name = { $regex: search.trim(), $options: "i" };
  }

  try {
    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    console.log("Total products:", total);
    console.log("Items per page (limit):", limit);
    console.log("Total pages calculated:", totalPages);

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
console.log(total,"total")
console.log(totalPages,"totalPages")
    res.json({
      products,
      total,
      page,
      totalPages,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
});


// Add a new product (with image upload)
router.post("/", upload.single("image"), async (req, res) => {
  console.log("[POST] /api/medicines - Body:", req.body, "File:", req.file);
  try {
    const { name, description, price, stock, category, sellerId, isGTagged } =
      req.body;
    
    // Handle sellerId if it's an array (take the first valid value)
    let validSellerId = sellerId;
    if (Array.isArray(sellerId)) {
      validSellerId = sellerId.find(id => id !== undefined && id !== 'undefined' && id !== null) || sellerId[0];
    }
    
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;

    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
      sellerId: validSellerId,
      isGTagged: isGTagged === "true" || isGTagged === true,
      image,
    });

    await product.save();
    console.log("[POST] /api/medicines - Product created:", product._id);
    res.status(201).json(product);
  } catch (err) {
    console.error("[POST] /api/medicines - Error:", err);
    res
      .status(400)
      .json({ error: "Failed to add product", details: err.message });
  }
});

// Get a product by ID
router.get("/:id", async (req, res) => {
  console.log("[GET] /api/medicines/:id - Params:", req.params);
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      console.warn("[GET] /api/medicines/:id - Product not found:", req.params.id);
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error("[GET] /api/medicines/:id - Error:", err);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// Update a product by ID
router.put("/:id", async (req, res) => {
  console.log("[PUT] /api/medicines/:id - Params:", req.params, "Body:", req.body);
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) {
      console.warn("[PUT] /api/medicines/:id - Product not found:", req.params.id);
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error("[PUT] /api/medicines/:id - Error:", err);
    res.status(400).json({ error: "Failed to update product" });
  }
});

// Delete a product by ID
router.delete("/:id", async (req, res) => {
  console.log("[DELETE] /api/medicines/:id - Params:", req.params);
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, {isDeleted: true});
    if (!product) {
      console.warn("[DELETE] /api/medicines/:id - Product not found:", req.params.id);
      return res.status(404).json({ error: "Product not found" });
    }
    console.log("Product deleted", product);
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("[DELETE] /api/medicines/:id - Error:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// Bulk add medicines from CSV
router.post("/bulk-csv", uploadCsv.single("file"), async (req, res) => {
  console.log("[POST] /api/medicines/bulk-csv - File:", req.file, "SellerId:", req.body.sellerId);
  if (!req.file) {
    console.warn("[POST] /api/medicines/bulk-csv - No file uploaded");
    return res.status(400).json({ error: "CSV file is required" });
  }
  const sellerId = req.body.sellerId;
  if (!sellerId) {
    return res.status(400).json({ error: "sellerId is required in form data" });
  }
  const medicines = [];
  fs.createReadStream(req.file.path)
    .pipe(csvParser())
    .on("data", (row) => {
      // Clean up row: remove _id if present, ensure price/stock are valid numbers, trim whitespace
      const cleanedRow = { ...row };
      if (cleanedRow._id) delete cleanedRow._id;
      // Remove empty string fields
      Object.keys(cleanedRow).forEach(key => {
        if (typeof cleanedRow[key] === 'string') cleanedRow[key] = cleanedRow[key].trim();
        if (cleanedRow[key] === '') cleanedRow[key] = undefined;
      });
      // Parse price and stock, fallback to 0 if invalid
      cleanedRow.price = Number(cleanedRow.price);
      cleanedRow.stock = Number(cleanedRow.stock);
      // Only push if required fields are present
      if (cleanedRow.name && cleanedRow.description && !isNaN(cleanedRow.price) && !isNaN(cleanedRow.stock)) {
        medicines.push({
          ...cleanedRow,
          sellerId,
        });
      }
    })
    .on("end", async () => {
      try {
        const result = await Product.insertMany(medicines);
        fs.unlinkSync(req.file.path); // Clean up uploaded file
        console.log("[POST] /api/medicines/bulk-csv - Medicines added:", result.length);
        res.status(201).json({
          message: `Medicines added from CSV: ${result.length} rows`,
          medicines: result,
        });
      } catch (err) {
        console.error("[POST] /api/medicines/bulk-csv - Error:", err);
        res.status(500).json({ error: "Failed to add medicines", details: err.message });
      }
    })
    .on("error", (err) => {
      console.error("[POST] /api/medicines/bulk-csv - CSV parse error:", err);
      res.status(500).json({ error: "Failed to parse CSV", details: err.message });
    });
});

export default router;
