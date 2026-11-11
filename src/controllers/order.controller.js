const orderService = require("../services/order.service");

class OrderController {
  async getAll(req, res, next) {
    try {
      const { status, priority } = req.query;
      const filters = {};
      if (status) filters.status = status;
      if (priority) filters.priority = priority;
      const orders = await orderService.getAll(filters);
      res.json({ status: "success", payload: orders });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const order = await orderService.getById(req.params.id);
      res.json({ status: "success", payload: order });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const order = await orderService.create(req.body);
      res.status(201).json({ status: "success", payload: order });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const order = await orderService.update(req.params.id, req.body);
      res.json({ status: "success", payload: order });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await orderService.delete(req.params.id);
      res.json({ status: "success", message: "Pedido eliminado" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new OrderController();