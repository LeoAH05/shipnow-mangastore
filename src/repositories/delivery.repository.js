const Delivery = require("../models/delivery.model");

class DeliveryRepository {
  async getAll(filters = {}) {
    return await Delivery.find(filters)
      .populate("order", "status priority total")
      .populate("deliveryPerson", "name email")
      .select("-__v");
  }

  async getById(id) {
    return await Delivery.findById(id)
      .populate("order", "status priority total")
      .populate("deliveryPerson", "name email")
      .select("-__v");
  }

  async create(data) {
    return await Delivery.create(data);
  }

  async update(id, data) {
    return await Delivery.findByIdAndUpdate(id, data, { new: true }).select("-__v");
  }

  async delete(id) {
    return await Delivery.findByIdAndDelete(id);
  }
    async addReceipt(id, metadata) {
    return await Delivery.findByIdAndUpdate(
      id,
      { $push: { receipts: metadata } },
      { new: true }
    ).select("-__v");
  }
}

module.exports = new DeliveryRepository();