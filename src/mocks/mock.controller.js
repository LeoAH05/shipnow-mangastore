const mockService = require("./mock.service");
const ErrorDictionary = require("../errors/errorDictionary");

class MockController {
  async getUsers(req, res, next) {
    try {
      const qty = parseInt(req.query.qty) || 10;
      const users = mockService.generateUsers(qty);
      res.json({ status: "success", payload: users });
    } catch (error) {
      next(error);
    }
  }

  async getProducts(req, res, next) {
    try {
      const qty = parseInt(req.query.qty) || 10;
      const products = mockService.generateProducts(qty);
      res.json({ status: "success", payload: products });
    } catch (error) {
      next(error);
    }
  }

  async seed(req, res, next) {
    try {
      const qty = parseInt(req.query.qty) || 10;
      const entity = req.query.entity;

      if (!entity) throw ErrorDictionary.MOCK_INVALID_ENTITY();

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
          throw ErrorDictionary.MOCK_INVALID_ENTITY();
      }

      res.json({ status: "success", payload: result });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new MockController();