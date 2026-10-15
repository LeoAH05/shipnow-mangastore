const { generateUser, generateProduct, generateOrder, generateDelivery } = require("./generator");
const User = require("../models/user.model");
const Order = require("../models/order.model");
const Delivery = require("../models/delivery.model");
const Product = require("../models/product.model");
const { ROLES } = require("../constants");
const ErrorDictionary = require("../errors/errorDictionary");

class MockService {
  validateQty(qty) {
    if (!qty || isNaN(qty) || qty <= 0) {
      throw ErrorDictionary.MOCK_INVALID_QTY();
    }
  }

  generateUsers(qty = 10) {
    this.validateQty(qty);
    return Array.from({ length: qty }, generateUser);
  }

  generateProducts(qty = 10) {
    this.validateQty(qty);
    return Array.from({ length: qty }, generateProduct);
  }

  async seedUsers(qty = 10) {
    this.validateQty(qty);
    try {
      const users = this.generateUsers(qty);
      const inserted = await User.insertMany(users);
      return { insertados: inserted.length, coleccion: "usuarios" };
    } catch (error) {
      if (error.errorCode) throw error;
      throw ErrorDictionary.MOCK_SEED_ERROR();
    }
  }

  async seedProducts(qty = 10) {
    this.validateQty(qty);
    try {
      const products = this.generateProducts(qty);
      const inserted = await Product.insertMany(products);
      return { insertados: inserted.length, coleccion: "productos" };
    } catch (error) {
      if (error.errorCode) throw error;
      throw ErrorDictionary.MOCK_SEED_ERROR();
    }
  }

  async seedOrders(qty = 10) {
    this.validateQty(qty);
    const users = await User.find({ role: ROLES.USER }).limit(qty);
    if (users.length === 0) throw ErrorDictionary.MOCK_NO_USERS();
    try {
      const orders = users.map((user) => generateOrder(user._id));
      const inserted = await Order.insertMany(orders);
      return { insertados: inserted.length, coleccion: "pedidos" };
    } catch (error) {
      if (error.errorCode) throw error;
      throw ErrorDictionary.MOCK_SEED_ERROR();
    }
  }

  async seedDeliveries(qty = 10) {
    this.validateQty(qty);
    const orders = await Order.find().limit(qty);
    if (orders.length === 0) throw ErrorDictionary.MOCK_NO_ORDERS();
    try {
      const deliveryPersons = await User.find({ role: ROLES.DELIVERY });
      const deliveries = orders.map((order) => {
        const deliveryPerson = deliveryPersons.length > 0
          ? deliveryPersons[Math.floor(Math.random() * deliveryPersons.length)]._id
          : null;
        return generateDelivery(order._id, deliveryPerson);
      });
      const inserted = await Delivery.insertMany(deliveries);
      return { insertados: inserted.length, coleccion: "entregas" };
    } catch (error) {
      if (error.errorCode) throw error;
      throw ErrorDictionary.MOCK_SEED_ERROR();
    }
  }
}

module.exports = new MockService();