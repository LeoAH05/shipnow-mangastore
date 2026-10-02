const productService = require("../services/product.service");

class ProductController {
  async getAll(req, res) {
    try {
      const { category } = req.query;
      const products = category
        ? await productService.getByCategory(category)
        : await productService.getAll();
      res.json({ status: "success", payload: products });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  async getById(req, res) {
    try {
      const product = await productService.getById(req.params.id);
      res.json({ status: "success", payload: product });
    } catch (error) {
      res.status(404).json({ status: "error", message: error.message });
    }
  }

  async create(req, res) {
    try {
      const product = await productService.create(req.body);
      res.status(201).json({ status: "success", payload: product });
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async update(req, res) {
    try {
      const product = await productService.update(req.params.id, req.body);
      res.json({ status: "success", payload: product });
    } catch (error) {
      res.status(400).json({ status: "error", message: error.message });
    }
  }

  async delete(req, res) {
    try {
      await productService.delete(req.params.id);
      res.json({ status: "success", message: "Producto eliminado" });
    } catch (error) {
      res.status(404).json({ status: "error", message: error.message });
    }
  }
}

module.exports = new ProductController();