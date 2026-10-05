const mongoose = require("mongoose");
const { DELIVERY_STATUS } = require("../constants");

const deliverySchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  deliveryPerson: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: Object.values(DELIVERY_STATUS),
    default: DELIVERY_STATUS.PENDING,
  },
  address: { type: String, required: true },
  estimatedDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model("Delivery", deliverySchema);