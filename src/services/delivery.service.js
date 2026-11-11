const deliveryRepository = require("../repositories/delivery.repository");
const orderRepository = require("../repositories/order.repository");
const userRepository = require("../repositories/user.repository");
const { DELIVERY_STATUS, ROLES } = require("../constants");
const ErrorDictionary = require("../errors/errorDictionary");
const logger = require("../config/logger");

class DeliveryService {
  validateStatus(status) {
    if (status && !Object.values(DELIVERY_STATUS).includes(status)) {
      throw ErrorDictionary.DELIVERY_INVALID_STATUS();
    }
  }

  async validateDeliveryPerson(userId) {
    if (!userId) return;
    const person = await userRepository.getById(userId);
    if (!person) throw ErrorDictionary.USER_NOT_FOUND();
    if (person.role !== ROLES.DELIVERY) {
      throw ErrorDictionary.USER_NOT_FOUND();
    }
  }

  async getAll(filters = {}) {
    this.validateStatus(filters.status);
    return await deliveryRepository.getAll(filters);
  }

  async getById(id) {
    const delivery = await deliveryRepository.getById(id);
    if (!delivery) {
      logger.warning(`Entrega no encontrada: ${id}`);
      throw ErrorDictionary.DELIVERY_NOT_FOUND();
    }
    return delivery;
  }

  async create(data) {
    if (!data.order || !data.address) {
      throw ErrorDictionary.DELIVERY_MISSING_FIELDS();
    }
    this.validateStatus(data.status);

    const order = await orderRepository.getById(data.order);
    if (!order) throw ErrorDictionary.ORDER_NOT_FOUND();
    await this.validateDeliveryPerson(data.deliveryPerson);

    const delivery = await deliveryRepository.create(data);
    logger.info(`Entrega creada correctamente: ${delivery._id}`);
    return delivery;
  }

  async update(id, data) {
    const delivery = await deliveryRepository.getById(id);
    if (!delivery) throw ErrorDictionary.DELIVERY_NOT_FOUND();
    this.validateStatus(data.status);
    await this.validateDeliveryPerson(data.deliveryPerson);
    return await deliveryRepository.update(id, data);
  }

  async delete(id) {
    const delivery = await deliveryRepository.getById(id);
    if (!delivery) throw ErrorDictionary.DELIVERY_NOT_FOUND();
    return await deliveryRepository.delete(id);
  }
}

module.exports = new DeliveryService();