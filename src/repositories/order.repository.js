const Order = require("../models/order.model");

class OrderRepository {
  async getAll(filters = {}) {
    return await Order.find(filters)
      .populate("user", "name email")
      .populate("products.product", "title price")
      .select("-__v");
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
}

module.exports = new OrderRepository();