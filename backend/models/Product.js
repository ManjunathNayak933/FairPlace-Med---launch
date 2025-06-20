import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  category: { type: String },
  image: { type: String },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", required: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isDeleted: { type: Boolean, default: false }, // for soft delete product
});

// Create text index for efficient searching
productSchema.index({
  name: 'text',
  description: 'text',
  category: 'text'
});

// Create compound index for seller-specific queries
productSchema.index({ sellerId: 1, createdAt: -1 });

export default mongoose.model("Product", productSchema);
