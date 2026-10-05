const { faker } = require("@faker-js/faker");
const { ROLES, ORDER_STATUS, ORDER_PRIORITY, DELIVERY_STATUS, PRODUCT_CATEGORIES, PRODUCT_STATUS } = require("../constants");

const generateUser = () => ({
  name: faker.person.fullName(),
  email: faker.internet.email().toLowerCase(),
  password: faker.internet.password(),
  role: faker.helpers.arrayElement([ROLES.USER, ROLES.DELIVERY]),
});

const generateProduct = () => ({
  title: faker.commerce.productName(),
  author: faker.person.fullName(),
  description: faker.commerce.productDescription(),
  price: faker.number.int({ min: 500, max: 5000 }),
  stock: faker.number.int({ min: 0, max: 50 }),
  category: faker.helpers.arrayElement(Object.values(PRODUCT_CATEGORIES)),
  status: faker.helpers.arrayElement(Object.values(PRODUCT_STATUS)),
  thumbnail: faker.image.url(),
});

const generateOrder = (userId) => ({
  user: userId,
  products: [],
  status: faker.helpers.arrayElement(Object.values(ORDER_STATUS)),
  priority: faker.helpers.arrayElement(Object.values(ORDER_PRIORITY)),
  total: faker.number.int({ min: 1000, max: 20000 }),
});

const generateDelivery = (orderId, deliveryPersonId = null) => ({
  order: orderId,
  deliveryPerson: deliveryPersonId,
  status: faker.helpers.arrayElement(Object.values(DELIVERY_STATUS)),
  address: faker.location.streetAddress(),
  estimatedDate: faker.date.future(),
});

module.exports = { generateUser, generateProduct, generateOrder, generateDelivery };