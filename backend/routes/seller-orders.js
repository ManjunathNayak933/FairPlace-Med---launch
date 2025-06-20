import express from "express";
import Order from "../models/Order.js";
import Buyer from "../models/Buyer.js";
import mongoose from "mongoose";

const router = express.Router();

// Seller orders routes
// router.get("/", async (req, res) => {
//   console.log("[GET] /api/seller-orders", req.query);
//   try {
//     const { sellerId } = req.query;
    
//     if (!sellerId) {
//       return res.status(400).json({ error: "sellerId is required" });
//     }

//     console.log("Fetching orders for sellerId:", sellerId);
    
//     // Optimized: Use aggregation pipeline for better performance
//     const Product = (await import("../models/Product.js")).default;
    
//     // Use aggregation to efficiently find orders with seller's products
//     const orders = await Order.aggregate([
//       // Match orders that have items with products from this seller
//       {
//         $lookup: {
//           from: "products",
//           localField: "items.productId",
//           foreignField: "_id",
//           as: "productDetails"
//         }
//       },
//       // Filter orders that contain at least one product from this seller
//       {
//         $match: {
//           "productDetails.sellerId": sellerId
//         }
//       },
//       // Sort by creation date (newest first)
//       { $sort: { createdAt: -1 } },
//       // Limit to recent orders for better performance
//       { $limit: 100 },
//       // Lookup buyer information
//       {
//         $lookup: {
//           from: "buyers",
//           localField: "buyer",
//           foreignField: "_id",
//           as: "buyerInfo"
//         }
//       },
//       // Lookup product information for items
//       {
//         $lookup: {
//           from: "products",
//           localField: "items.productId",
//           foreignField: "_id",
//           as: "allProducts"
//         }
//       }
//     ]);
    
//     console.log("Found seller orders:", orders.length);    
//     // Process orders efficiently
//     const formattedOrders = orders.map(order => {
//       const buyer = order.buyerInfo && order.buyerInfo[0] ? order.buyerInfo[0] : {};
      
//       // Create a map of products for quick lookup
//       const productMap = {};
//       if (order.allProducts) {
//         order.allProducts.forEach(product => {
//           productMap[product._id.toString()] = product;
//         });
//       }
      
//       // Filter and map items to only include this seller's products
//       const sellerItems = order.items
//         .map(item => {
//           const product = productMap[item.productId.toString()];
//           return product ? { ...item, productInfo: product } : null;
//         })
//         .filter(item => item && item.productInfo && item.productInfo.sellerId === sellerId);
      
//       // Skip orders with no items from this seller
//       if (sellerItems.length === 0) {
//         return null;
//       }
      
//       // Map backend status to frontend status
//       let status = order.status;
//       if (status === "confirmed" || status === "shipped") status = "processing";
//       if (status === "delivered") status = "delivered";
//       if (status === "cancelled") status = "cancelled";
//       if (status === "pending") status = "pending";
//         // Compose address object for frontend - use stored deliveryAddress
//       let addressObj = undefined;
//       if (order.deliveryAddress) {
//         // Use the specific delivery address stored with this order
//         const a = order.deliveryAddress;
//         addressObj = {
//           id: a._id || a.id || "",
//           street: a.street,
//           city: a.city,
//           state: a.state,
//           postalCode: a.postalCode,
//           isDefault: false, // This is not a default address, it's order-specific
//           latitude: a.latitude,
//           longitude: a.longitude
//         };
//       } else if (buyer.addresses && buyer.addresses[0]) {
//         // Fallback to buyer's default address if no deliveryAddress stored
//         const a = buyer.addresses[0];
//         addressObj = {
//           id: a._id || a.id || "",
//           street: a.street,
//           city: a.city,
//           state: a.state,
//           postalCode: a.postalCode,
//           isDefault: a.isDefault,
//           latitude: a.latitude,
//           longitude: a.longitude
//         };
//       }
      
//       // Calculate total for seller's items only
//       const sellerTotal = sellerItems.reduce((sum, item) => {
//         const price = item.productInfo && typeof item.productInfo.price === 'number' ? item.productInfo.price : 0;
//         const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
//         return sum + (price * quantity);
//       }, 0);
//         // Format address as string for seller app
//       let deliveryAddressString = "Address not available";
//       if (addressObj) {
//         deliveryAddressString = `${addressObj.street}, ${addressObj.city}, ${addressObj.state} ${addressObj.postalCode}`;
//       }

//       return {
//         id: order._id,
//         userId: buyer._id || null,
//         buyerName: buyer.name || "",
//         buyerPhone: buyer.phone || "",
//         items: sellerItems.map(item => ({
//           name: item.productInfo.name || "",
//           price: item.productInfo.price || 0,
//           quantity: item.quantity || 0,
//           productId: item.productInfo._id || item.productId,
//           image: item.productInfo.image || "",
//           sellerId: item.productInfo.sellerId || "",
//           category: item.productInfo.category || ""
//         })),
//         total: sellerTotal,
//         deliveryAddress: deliveryAddressString,
//         status: status,
//         prescriptionImage: order.prescriptionImage || undefined,
//         createdAt: order.createdAt
//       };
//     }).filter(order => order !== null); // Remove null orders
    
//     res.json({ orders: formattedOrders });
//   } catch (err) {
//     console.error("[GET] /api/seller-orders - Error:", err);
//     res.status(500).json({ error: "Failed to fetch seller orders" });
//   }
// });




router.get("/", async (req, res) => {
  console.log("[GET] /api/seller-orders", req.query);
  try {
    const { sellerId } = req.query;
    
    if (!sellerId) {
      return res.status(400).json({ error: "sellerId is required" });
    }

    const sellerObjectId = new mongoose.Types.ObjectId(sellerId);

    const orders = await Order.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "allProducts"
        }
      },
      {
        $match: {
          "allProducts.sellerId": sellerId
        }
      },
      { $sort: { createdAt: -1 } },
      { $limit: 100 },
      {
        $lookup: {
          from: "buyers",
          localField: "buyer",
          foreignField: "_id",
          as: "buyerInfo"
        }
      }
    ]);

    const formattedOrders = orders.map(order => {
      const buyer = order.buyerInfo?.[0] || {};

      // Map for quick product access
      const productMap = {};
      (order.allProducts || []).forEach(prod => {
        productMap[prod._id.toString()] = prod;
      });

      const sellerItems = order.items
        .map(item => {
          const product = productMap[item.productId.toString()];
          return product?.sellerId === sellerId
            ? {
                ...item,
                productInfo: product
              }
            : null;
        })
        .filter(Boolean);

      if (!sellerItems.length) return null;

      const addressSource = order.deliveryAddress || buyer.addresses?.[0];
      const addressObj = addressSource
        ? {
            id: addressSource._id || addressSource.id || "",
            street: addressSource.street,
            city: addressSource.city,
            state: addressSource.state,
            postalCode: addressSource.postalCode,
            latitude: addressSource.latitude,
            longitude: addressSource.longitude,
            isDefault: !!addressSource.isDefault
          }
        : null;

      const sellerTotal = sellerItems.reduce((sum, item) => {
        const price = item.productInfo?.price || 0;
        const qty = item.quantity || 0;
        return sum + price * qty;
      }, 0);

      let deliveryAddressString = "Address not available";
      if (addressObj) {
        deliveryAddressString = `${addressObj.street}, ${addressObj.city}, ${addressObj.state} ${addressObj.postalCode}`;
      }

      // Status normalization
      let status = order.status;
      if (["confirmed", "shipped"].includes(status)) status = "processing";

      return {
        id: order._id,
        userId: buyer._id || null,
        buyerName: buyer.name || "",
        buyerPhone: buyer.phone || "",
        items: sellerItems.map(item => ({
          name: item.productInfo.name || "",
          price: item.productInfo.price || 0,
          quantity: item.quantity || 0,
          productId: item.productInfo._id || item.productId,
          image: item.productInfo.image || "",
          sellerId: item.productInfo.sellerId || "",
          category: item.productInfo.category || ""
        })),
        total: sellerTotal,
        deliveryAddress: deliveryAddressString,
        status: status,
        prescriptionImage: order.prescriptionImage || undefined,
        createdAt: order.createdAt
      };
    }).filter(Boolean);

    res.json({ orders: formattedOrders });
  } catch (err) {
    console.error("[GET] /api/seller-orders - Error:", err);
    res.status(500).json({ error: "Failed to fetch seller orders" });
  }
});




// Update order status (sellers update order status)
router.put("/:id", async (req, res) => {
  console.log("[PUT] /api/seller-orders/:id - Params:", req.params, "Body:", req.body);
  try {
    const { id } = req.params;
    const { status, sellerId } = req.body;
    
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    
    if (!sellerId) {
      return res.status(400).json({ error: "sellerId is required" });
    }
    
    // Verify the order contains products from this seller
    const Product = (await import("../models/Product.js")).default;
    const order = await Order.findById(id).populate("items.productId");
    
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    
    // Check if seller has products in this order
    const hasSellerProducts = order.items.some(item => 
      item.productId && 
      item.productId.sellerId && 
      item.productId.sellerId.toString() === sellerId
    );
    
    if (!hasSellerProducts) {
      return res.status(403).json({ error: "Unauthorized: This order doesn't contain your products" });
    }
    
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    
    res.json({ message: "Order status updated", order: updatedOrder });
  } catch (err) {
    console.error("[PUT] /api/seller-orders/:id - Error:", err);
    res.status(500).json({ error: "Failed to update order status" });
  }
});

// Get specific order by ID (for sellers)
router.get("/:id", async (req, res) => {
  console.log("[GET] /api/seller-orders/:id - Params:", req.params);
  try {
    const { id } = req.params;
    const { sellerId } = req.query;
    
    if (!sellerId) {
      return res.status(400).json({ error: "sellerId is required" });
    }
    
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
    
    // Check if seller has products in this order
    const hasSellerProducts = order.items.some(item => 
      item.productId && 
      item.productId.sellerId && 
      item.productId.sellerId.toString() === sellerId
    );
    
    if (!hasSellerProducts) {
      return res.status(403).json({ error: "Unauthorized: This order doesn't contain your products" });
    }
    
    res.json({ order });
  } catch (err) {
    console.error("[GET] /api/seller-orders/:id - Error:", err);
    res.status(500).json({ error: "Failed to fetch order" });
  }
});

export default router;
