const productService = require("../services/product.service");

class ProductController {
  async getAll(req, res, next) {
    try {
      const { category } = req.query;
      const products = category
        ? await productService.getByCategory(category)
        : await productService.getAll();
      res.json({ status: "success", payload: products });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const product = await productService.getById(req.params.id);
      res.json({ status: "success", payload: product });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const product = await productService.create(req.body);
      res.status(201).json({ status: "success", payload: product });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const product = await productService.update(req.params.id, req.body);
      res.json({ status: "success", payload: product });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      await productService.delete(req.params.id);
      res.json({ status: "success", message: "Producto eliminado" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ProductController();