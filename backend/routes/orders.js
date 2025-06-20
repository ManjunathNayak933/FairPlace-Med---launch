import express from "express";
import Order from "../models/Order.js";
import Buyer from "../models/Buyer.js";

const router = express.Router();

// Generic order operations (kept for backward compatibility)
// For new applications, use /api/buyer-orders and /api/seller-orders instead

// Get specific order by ID (generic)
router.get("/:id", async (req, res) => {
  console.log("[GET] /api/orders/:id - Params:", req.params);
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id)
      .populate({
        path: "items.productId",
        model: "Product",
        select: "name price sellerId image category"
      })
      .populate({
        path: "buyer",
        model: "Buyer",
        select: "name phone addresses"
      });
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    res.json({ order });
  } catch (err) {
    console.error("[GET] /api/orders/:id - Error:", err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

// Update order status (generic)
router.put("/:id", async (req, res) => {
  console.log("[PUT] /api/orders/:id - Params:", req.params, "Body:", req.body);
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    const order = await Order.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: "Order status updated", order });
  } catch (err) {
    console.error("[PUT] /api/orders/:id - Error:", err);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

router.put("/:id/complete", async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(
      id,
      { status: "completed", updatedAt: new Date() },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: "Order marked as completed", order });
  } catch (err) {
    console.error("[PUT] /api/orders/:id/complete - Error:", err);
    res.status(500).json({ error: "Failed to mark order as completed" });
  }
});



////////for admin


router.get("/", async (req, res) => {
  try {
  const data = await Order.find()
    .populate("buyer") // populate buyer reference
    .populate({
      path: "items.productId", // nested populate inside items array
      model: "Product", // specify model name if needed (usually it is)
      select: "name price description", // optional: only fetch these product fields
    });

  console.log(data, "datadatadatadata");

  res.json({ message: "Order Get Successfully", data });
} catch (error) {
  console.error("🔥 Error in /orderAllForAdmin:", error);
  res.status(500).json({ message: "Internal Server Error", error: error.message });
}

});


export default router;



