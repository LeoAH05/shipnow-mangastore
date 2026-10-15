const userService = require("../services/user.service");

class UserController {
  async getAll(req, res, next) {
    try {
      const users = await userService.getAll();
      res.json({ status: "success", payload: users });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const user = await userService.getById(req.params.id);
      res.json({ status: "success", payload: user });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const user = await userService.create(req.body);
      res.status(201).json({ status: "success", payload: user });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const user = await userService.update(req.params.id, req.body);
      res.json({ status: "success", payload: user });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await userService.delete(req.params.id);
      res.json({ status: "success", message: "Usuario eliminado" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();