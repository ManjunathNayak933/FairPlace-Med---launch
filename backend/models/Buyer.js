import mongoose from "mongoose";
import bcrypt from "bcrypt";

const buyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true},
  password: { type: String, required: true },
  phone: { type: String },
  addresses: [
    {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      isDefault: Boolean,
      latitude: Number,
      longitude: Number,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

buyerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

const Buyer = mongoose.model("Buyer", buyerSchema);

export default Buyer;
