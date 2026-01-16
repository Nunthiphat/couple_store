import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    images: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// ⭐ ป้องกัน model ซ้ำตอน hot reload
const Product =
  mongoose.models.Product ||
  mongoose.model("Product", productSchema);

export default Product;
