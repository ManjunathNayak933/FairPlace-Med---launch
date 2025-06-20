import express from "express";
import Order from "../models/Order.js";
import Buyer from "../models/Buyer.js";

const router = express.Router();

// Buyer orders routes
router.get("/", async (req, res) => {
  console.log("[GET] /api/buyer-orders", req.query);
  try {
    const { buyerId } = req.query;
    
    if (!buyerId) {
      return res.status(400).json({ error: "buyerId is required" });
    }

    console.log("Fetching orders for buyerId:", buyerId);
    
    const orders = await Order.find({ buyer: buyerId })
      .sort({ createdAt: -1 })
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
    
    console.log("Found buyer orders:", orders.length);
    
    // Transform orders for buyer view
    const formattedOrders = orders.map(order => {
      const buyer = order.buyer || {};
      
      // Map backend status to frontend status
      let status = order.status;
      if (status === "confirmed" || status === "shipped") status = "processing";
      if (status === "delivered") status = "delivered";
      if (status === "cancelled") status = "cancelled";
      if (status === "pending") status = "pending";
        // Compose address object for frontend - use stored deliveryAddress
      let addressObj = undefined;
      if (order.deliveryAddress) {
        // Use the specific delivery address stored with this order
        const a = order.deliveryAddress;
        addressObj = {
          id: a._id || a.id || "",
          street: a.street,
          city: a.city,
          state: a.state,
          postalCode: a.postalCode,
          isDefault: false, // This is not a default address, it's order-specific
          latitude: a.latitude,
          longitude: a.longitude
        };
      } else if (buyer.addresses && buyer.addresses[0]) {
        // Fallback to buyer's default address if no deliveryAddress stored
        const a = buyer.addresses[0];
        addressObj = {
          id: a._id || a.id || "",
          street: a.street,
          city: a.city,
          state: a.state,
          postalCode: a.postalCode,
          isDefault: a.isDefault,
          latitude: a.latitude,
          longitude: a.longitude
        };
      }
      
      return {
        id: order._id,
        userId: buyer._id || null,
        items: order.items.map(item => ({
          name: item.productId && item.productId.name ? item.productId.name : "",
          price: item.productId && typeof item.productId.price === 'number' ? item.productId.price : 0,
          quantity: typeof item.quantity === 'number' ? item.quantity : 0,
          productId: item.productId && item.productId._id ? item.productId._id : item.productId,
          image: item.productId && item.productId.image ? item.productId.image : "",
          sellerId: item.productId && item.productId.sellerId ? item.productId.sellerId : "",
          category: item.productId && item.productId.category ? item.productId.category : ""
        })),
        totalAmount: typeof order.total === 'number' ? order.total : (order.items.reduce((sum, item) => sum + ((item.productId && typeof item.productId.price === 'number' ? item.productId.price : 0) * (typeof item.quantity === 'number' ? item.quantity : 0)), 0)),
        address: addressObj,
        status: ["confirmed","shipped"].includes(order.status) ? "processing" : ["delivered"].includes(order.status) ? "delivered" : ["cancelled"].includes(order.status) ? "cancelled" : ["pending"].includes(order.status) ? "pending" : order.status,
        prescriptionImage: order.prescriptionImage || undefined,
        createdAt: order.createdAt
      };
    });
    
    res.json({ orders: formattedOrders });
  } catch (err) {
    console.error("[GET] /api/buyer-orders - Error:", err);
    res.status(500).json({ error: "Failed to fetch buyer orders" });
  }
});

// Create new order (buyers place orders)
router.post("/", async (req, res) => {
  console.log("[POST] /api/buyer-orders - Body:", req.body);  try {
    const { buyer, items, total, address, prescriptionImage } = req.body;
    
    // Find or create buyer
    let buyerDoc = await Buyer.findById(buyer);
    if (!buyerDoc) {
      console.warn("[POST] /api/buyer-orders - Buyer not found:", buyer);
      return res.status(400).json({ error: "Buyer not found" });
    }
    
    // Store the specific delivery address used for this order
    const orderData = { 
      buyer, 
      items, 
      total, 
      prescriptionImage,
      deliveryAddress: address ? {
        street: address.street,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        latitude: address.latitude,
        longitude: address.longitude
      } : undefined
    };
    
    const order = new Order(orderData);
    await order.save();
    
    console.log("[POST] /api/buyer-orders - Order created:", order._id);
    res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("[POST] /api/buyer-orders - Error:", err);
    res.status(500).json({ error: "Failed to place order", details: err.message });
  }
});

// Get specific order by ID (for buyers)
router.get("/:id", async (req, res) => {
  console.log("[GET] /api/buyer-orders/:id - Params:", req.params);
  try {
    const { id } = req.params;
    const { buyerId } = req.query;
    
    if (!buyerId) {
      return res.status(400).json({ error: "buyerId is required" });
    }
    
    const order = await Order.findOne({ _id: id, buyer: buyerId })
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
    console.error("[GET] /api/buyer-orders/:id - Error:", err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

export default router;
