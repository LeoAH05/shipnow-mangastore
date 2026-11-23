const Product = require("../models/product.model");
const { PRODUCT_STATUS } = require("../constants");

class ProductRepository {
    async getAll(filters = {}, { page, limit }) {
    const query = { status: PRODUCT_STATUS.AVAILABLE, ...filters };
    const [docs, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-__v"),
      Product.countDocuments(query),
    ]);
    return { docs, total };
  }

  async getById(id) {
    return await Product.findById(id).select("-__v");
  }

  async create(data) {
    return await Product.create(data);
  }

  async update(id, data) {
    return await Product.findByIdAndUpdate(id, data, { new: true }).select("-__v");
  }

  async delete(id) {
    return await Product.findByIdAndDelete(id);
  }

  async getByCategory(category) {
    return await Product.find({ 
      category, 
      status: PRODUCT_STATUS.AVAILABLE 
    }).select("-__v");
  }
}

module.exports = new ProductRepository();