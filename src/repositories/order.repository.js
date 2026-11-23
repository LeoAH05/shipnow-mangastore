const Order = require("../models/order.model");

class OrderRepository {
    async getAll(filters = {}, { page, limit }) {
    const [docs, total] = await Promise.all([
      Order.find(filters)
        .populate("user", "name email")
        .populate("products.product", "title price")
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-__v"),
      Order.countDocuments(filters),
    ]);
    return { docs, total };
  }

  async getById(id) {
    return await Order.findById(id)
      .populate("user", "name email")
      .populate("products.product", "title price")
      .select("-__v");
  }

  async create(data) {
    return await Order.create(data);
  }

  async update(id, data) {
    return await Order.findByIdAndUpdate(id, data, { new: true }).select("-__v");
  }

  async delete(id) {
    return await Order.findByIdAndDelete(id);
  }
    async addReceipt(id, metadata) {
    return await Order.findByIdAndUpdate(
      id,
      { $push: { receipts: metadata } },
      { new: true }
    ).select("-__v");
  }
}

module.exports = new OrderRepository();