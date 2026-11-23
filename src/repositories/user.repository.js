const User = require("../models/user.model");

class UserRepository {
    async getAll({ page, limit }) {
    const [docs, total] = await Promise.all([
      User.find()
        .sort({ createdAt: -1, _id: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("-password -__v"),
      User.countDocuments(),
    ]);
    return { docs, total };
  }

  async getById(id) {
    return await User.findById(id).select("-password -__v");
  }

  async getByEmail(email) {
    return await User.findOne({ email });
  }

  async create(data) {
    return await User.create(data);
  }

  async update(id, data) {
    return await User.findByIdAndUpdate(id, data, { new: true }).select("-password -__v");
  }

  async delete(id) {
    return await User.findByIdAndDelete(id);
  }
    async addDocument(id, metadata) {
    return await User.findByIdAndUpdate(
      id,
      { $push: { documents: metadata } },
      { new: true }
    ).select("-password -__v");
  }
}

module.exports = new UserRepository();