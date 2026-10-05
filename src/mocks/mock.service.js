const { generateUser, generateProduct, generateOrder, generateDelivery } = require("./generator");
const User = require("../models/user.model");
const Order = require("../models/order.model");
const Delivery = require("../models/delivery.model");
const Product = require("../models/product.model");
const { ROLES } = require("../constants");

class MockService {
  generateUsers(qty = 10) {
    return Array.from({ length: qty }, generateUser);
  }

  generateProducts(qty = 10) {
    return Array.from({ length: qty }, generateProduct);
  }

  async seedUsers(qty = 10) {
    const users = this.generateUsers(qty);
    const inserted = await User.insertMany(users);
    return { insertados: inserted.length, coleccion: "usuarios" };
  }

  async seedProducts(qty = 10) {
    const products = this.generateProducts(qty);
    const inserted = await Product.insertMany(products);
    return { insertados: inserted.length, coleccion: "productos" };
  }

  async seedOrders(qty = 10) {
    const users = await User.find({ role: ROLES.USER }).limit(qty);
    if (users.length === 0) throw new Error("No hay usuarios. Primero ejecutá POST /api/mocks/seed?entity=users");

    const orders = users.map((user) => generateOrder(user._id));
    const inserted = await Order.insertMany(orders);
    return { insertados: inserted.length, coleccion: "pedidos" };
  }

  async seedDeliveries(qty = 10) {
    const orders = await Order.find().limit(qty);
    if (orders.length === 0) throw new Error("No hay pedidos. Primero ejecutá POST /api/mocks/seed?entity=orders");

    const deliveryPersons = await User.find({ role: ROLES.DELIVERY });
    const deliveries = orders.map((order) => {
      const deliveryPerson = deliveryPersons.length > 0
        ? deliveryPersons[Math.floor(Math.random() * deliveryPersons.length)]._id
        : null;
      return generateDelivery(order._id, deliveryPerson);
    });

    const inserted = await Delivery.insertMany(deliveries);
    return { insertados: inserted.length, coleccion: "entregas" };
  }
}

module.exports = new MockService();