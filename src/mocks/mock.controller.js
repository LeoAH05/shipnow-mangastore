const mockService = require("./mock.service");

class MockController {
  async getUsers(req, res) {
    try {
      const qty = parseInt(req.query.qty) || 10;
      const users = mockService.generateUsers(qty);
      res.json({ status: "success", payload: users });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  async getProducts(req, res) {
    try {
      const qty = parseInt(req.query.qty) || 10;
      const products = mockService.generateProducts(qty);
      res.json({ status: "success", payload: products });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  async seed(req, res) {
    try {
      const qty = parseInt(req.query.qty) || 10;
      const entity = req.query.entity;

      let result;
      switch (entity) {
        case "users":
          result = await mockService.seedUsers(qty);
          break;
        case "products":
          result = await mockService.seedProducts(qty);
          break;
        case "orders":
          result = await mockService.seedOrders(qty);
          break;
        case "deliveries":
          result = await mockService.seedDeliveries(qty);
          break;
        default:
          return res.status(400).json({ status: "error", message: "Entidad no válida. Usá: users, products, orders, deliveries" });
      }

      res.json({ status: "success", payload: result });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }
}

module.exports = new MockController();