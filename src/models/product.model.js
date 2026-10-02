const mongoose = require("mongoose");
const { PRODUCT_STATUS, PRODUCT_CATEGORIES } = require("../constants");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  category: {
    type: String,
    enum: Object.values(PRODUCT_CATEGORIES),
    required: true,
  },
  status: {
    type: String,
    enum: Object.values(PRODUCT_STATUS),
    default: PRODUCT_STATUS.AVAILABLE,
  },
  thumbnail: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);