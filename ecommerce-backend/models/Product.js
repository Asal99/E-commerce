import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    category: { type: String, required: true, lowercase: true, trim: true },
    type: { type: String, lowercase: true, trim: true },
    tag: { type: String, lowercase: true, trim: true },
    image: { type: String, required: true },
    description: { type: String, default: "" },
    sizes: { type: [String], default: ["S", "M", "L", "XL", "2XL"] },
    stock: { type: Number, default: 20 },
    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

productSchema.index({ name: "text", category: "text", tag: "text", type: "text" });

export default mongoose.model("Product", productSchema);
