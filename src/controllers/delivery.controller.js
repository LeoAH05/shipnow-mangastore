const deliveryService = require("../services/delivery.service");
const { parsePagination } = require("../utils/pagination");

class DeliveryController {
    async getAll(req, res, next) {
    try {
      const { status } = req.query;
      const filters = {};
      if (status) filters.status = status;
      const result = await deliveryService.getAll(filters, parsePagination(req.query));
      res.json({ status: "success", ...result });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const delivery = await deliveryService.getById(req.params.id);
      res.json({ status: "success", payload: delivery });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const delivery = await deliveryService.create(req.body);
      res.status(201).json({ status: "success", payload: delivery });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const delivery = await deliveryService.update(req.params.id, req.body);
      res.json({ status: "success", payload: delivery });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await deliveryService.delete(req.params.id);
      res.json({ status: "success", message: "Entrega eliminada" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new DeliveryController();