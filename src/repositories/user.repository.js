const User = require("../models/user.model");

class UserRepository {
  async getAll() {
    return await User.find().select("-password -__v");
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
}

module.exports = new UserRepository();