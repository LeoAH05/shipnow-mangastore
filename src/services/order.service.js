const orderRepository = require("../repositories/order.repository");
const userRepository = require("../repositories/user.repository");
const productRepository = require("../repositories/product.repository");
const { ORDER_STATUS, ORDER_PRIORITY } = require("../constants");
const ErrorDictionary = require("../errors/errorDictionary");
const logger = require("../config/logger");

class OrderService {
  validateStatus(status) {
    if (status && !Object.values(ORDER_STATUS).includes(status)) {
      throw ErrorDictionary.ORDER_INVALID_STATUS();
    }
  }

  validatePriority(priority) {
    if (priority && !Object.values(ORDER_PRIORITY).includes(priority)) {
      throw ErrorDictionary.ORDER_INVALID_PRIORITY();
    }
  }

  async getAll(filters = {}) {
    this.validateStatus(filters.status);
    this.validatePriority(filters.priority);
    return await orderRepository.getAll(filters);
  }

  async getById(id) {
    const order = await orderRepository.getById(id);
    if (!order) {
      logger.warning(`Pedido no encontrado: ${id}`);
      throw ErrorDictionary.ORDER_NOT_FOUND();
    }
    return order;
  }

  async create(data) {
    if (!data.user || !Array.isArray(data.products) || data.products.length === 0) {
      throw ErrorDictionary.ORDER_MISSING_FIELDS();
    }
    this.validateStatus(data.status);
    this.validatePriority(data.priority);

    const user = await userRepository.getById(data.user);
    if (!user) throw ErrorDictionary.USER_NOT_FOUND();

    let total = 0;
    for (const item of data.products) {
      const product = await productRepository.getById(item.product);
      if (!product) throw ErrorDictionary.PRODUCT_NOT_FOUND();
      total += product.price * (item.quantity || 1);
    }

    const order = await orderRepository.create({ ...data, total });
    logger.info(`Pedido creado correctamente: ${order._id}`);
    return order;
  }

  async update(id, data) {
    const order = await orderRepository.getById(id);
    if (!order) throw ErrorDictionary.ORDER_NOT_FOUND();
    this.validateStatus(data.status);
    this.validatePriority(data.priority);
    return await orderRepository.update(id, data);
  }

  async delete(id) {
    const order = await orderRepository.getById(id);
    if (!order) throw ErrorDictionary.ORDER_NOT_FOUND();
    return await orderRepository.delete(id);
  }
}

module.exports = new OrderService();