const productRepository = require("../repositories/product.repository");
const { PRODUCT_STATUS } = require("../constants");

class ProductService {
  async getAll(filters = {}) {
    return await productRepository.getAll(filters);
  }

  async getById(id) {
    const product = await productRepository.getById(id);
    if (!product) throw new Error("Producto no encontrado");
    return product;
  }

  async create(data) {
    if (!data.title || !data.price || !data.category) {
      throw new Error("Faltan campos obligatorios: title, price, category");
    }
    return await productRepository.create(data);
  }

  async update(id, data) {
    const product = await productRepository.getById(id);
    if (!product) throw new Error("Producto no encontrado");
    if (data.stock === 0) {
      data.status = PRODUCT_STATUS.OUT_OF_STOCK;
    }
    return await productRepository.update(id, data);
  }

  async delete(id) {
    const product = await productRepository.getById(id);
    if (!product) throw new Error("Producto no encontrado");
    return await productRepository.delete(id);
  }

  async getByCategory(category) {
    return await productRepository.getByCategory(category);
  }
}

module.exports = new ProductService();