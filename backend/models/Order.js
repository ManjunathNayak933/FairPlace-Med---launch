// import mongoose from "mongoose";

// const orderSchema = new mongoose.Schema({
//   buyer: {
//     type: String,
//     required: true,
//   },
//   items: [
//     {
//       productId: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Product",
//         required: true,
//       },
//       quantity: {
//         type: Number,
//         required: true,
//         min: 1,
//       },
//     },
//   ],
//   total: {
//     type: Number,
//     required: true,
//     min: 0,
//   },
//   deliveryAddress: {
//     street: String,
//     city: String,
//     state: String,
//     postalCode: String,
//     latitude: Number,
//     longitude: Number,
//   },
//   status: {
//     type: String,
//     enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
//     default: "pending",
//   },
//   prescriptionImage: {
//     type: String,
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// const Order = mongoose.model("Order", orderSchema);

// export default Order;


import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Buyer",
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
    min: 0,
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    postalCode: String,
    latitude: Number,
    longitude: Number,
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  prescriptionImage: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
