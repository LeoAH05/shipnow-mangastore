const mongoose = require("mongoose");
const { ORDER_STATUS, ORDER_PRIORITY } = require("../constants");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  products: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
      quantity: { type: Number, default: 1 },
    },
  ],
  status: {
    type: String,
    enum: Object.values(ORDER_STATUS),
    default: ORDER_STATUS.PENDING,
  },
  priority: {
    type: String,
    enum: Object.values(ORDER_PRIORITY),
    default: ORDER_PRIORITY.MEDIUM,
  },
  total: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);