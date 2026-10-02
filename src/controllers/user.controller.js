const userService = require("../services/user.service");

class UserController {
  async getAll(req, res) {
    try {
      const users = await userService.getAll();
      res.json({ status: "success", payload: users });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const user = await userService.getById(req.params.id);
      res.json({ status: "success", payload: user });
    } catch (error) {
      res.status(404).json({ status: "error", message: error.message });
    }
  }

  async create(req, res) {
    try {
      const user = await userService.create(req.body);
      res.status(201).json({ status: "success", payload: user });
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async update(req, res) {
    try {
      const user = await userService.update(req.params.id, req.body);
      res.json({ status: "success", payload: user });
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await userService.delete(req.params.id);
      res.json({ status: "success", message: "Usuario eliminado" });
    } catch (error) {
      res.status(404).json({ status: "error", message: error.message });
    }
  }
}

module.exports = new UserController();