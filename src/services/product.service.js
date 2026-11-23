const productRepository = require("../repositories/product.repository");
const { PRODUCT_STATUS } = require("../constants");
const ErrorDictionary = require("../errors/errorDictionary");
const { buildPagination } = require("../utils/pagination");

class ProductService {
    async getAll(filters = {}, pagination) {
    const { docs, total } = await productRepository.getAll(filters, pagination);
    return { payload: docs, pagination: buildPagination(pagination, total) };
  }

  async getById(id) {
    const product = await productRepository.getById(id);
    if (!product) throw ErrorDictionary.PRODUCT_NOT_FOUND();
    return product;
  }

  async create(data) {
    if (!data.title || !data.price || !data.category) {
      throw ErrorDictionary.PRODUCT_MISSING_FIELDS();
    }
    return await productRepository.create(data);
  }

  async update(id, data) {
    const product = await productRepository.getById(id);
    if (!product) throw ErrorDictionary.PRODUCT_NOT_FOUND();
    if (data.stock === 0) {
      data.status = PRODUCT_STATUS.OUT_OF_STOCK;
    }
    return await productRepository.update(id, data);
  }

  async delete(id) {
    const product = await productRepository.getById(id);
    if (!product) throw ErrorDictionary.PRODUCT_NOT_FOUND();
    return await productRepository.delete(id);
  }

  async getByCategory(category) {
    return await productRepository.getByCategory(category);
  }
}

module.exports = new ProductService();