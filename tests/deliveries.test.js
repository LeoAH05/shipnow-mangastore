const request = require("supertest");
const { expect } = require("chai");
const app = require("../src/app");
const User = require("../src/models/user.model");
const Product = require("../src/models/product.model");
const Order = require("../src/models/order.model");
const Delivery = require("../src/models/delivery.model");
const { PRODUCT_CATEGORIES, DELIVERY_STATUS } = require("../src/constants");
const { expectError } = require("./helpers");

const FAKE_ID = "000000000000000000000000";

describe("Deliveries", () => {
  let order;

  const cleanAll = async () => {
    await Delivery.deleteMany({});
    await Order.deleteMany({});
    await User.deleteMany({});
    await Product.deleteMany({});
  };

  beforeEach(async () => {
    await cleanAll();
    const user = await User.create({ name: "Cliente Test", email: "cliente@test.com", password: "123456" });
    const product = await Product.create({
      title: "Dragon Ball Vol. 1",
      author: "Akira Toriyama",
      price: 1500,
      stock: 10,
      category: PRODUCT_CATEGORIES.MANGA,
    });
    order = await Order.create({
      user: user._id,
      products: [{ product: product._id, quantity: 1 }],
      total: 1500,
    });
  });

  after(cleanAll);

  describe("GET /api/deliveries", () => {
    it("devuelve la lista de entregas", async () => {
      await Delivery.create({ order: order._id, address: "Av. Corrientes 1234" });
      const res = await request(app).get("/api/deliveries");

      expect(res.status).to.equal(200);
      expect(res.body.payload).to.be.an("array").with.lengthOf(1);
      expect(res.body.payload[0]).to.include.keys("_id", "order", "status", "address");
    });

    it("devuelve 400 DELIVERY_INVALID_STATUS si el filtro no existe", async () => {
      const res = await request(app).get("/api/deliveries?status=invalido");
      expectError(res, 400, "DELIVERY_INVALID_STATUS");
    });
  });

  describe("GET /api/deliveries/:id", () => {
    it("devuelve 404 DELIVERY_NOT_FOUND si no existe", async () => {
      const res = await request(app).get(`/api/deliveries/${FAKE_ID}`);
      expectError(res, 404, "DELIVERY_NOT_FOUND");
    });
  });

  describe("POST /api/deliveries", () => {
    it("crea una entrega asociada al pedido", async () => {
      const res = await request(app)
        .post("/api/deliveries")
        .send({ order: order._id.toString(), address: "Av. Corrientes 1234" });

      expect(res.status).to.equal(201);
      expect(res.body.payload.order).to.equal(order._id.toString());
      expect(res.body.payload.address).to.equal("Av. Corrientes 1234");
      expect(res.body.payload.status).to.equal(DELIVERY_STATUS.PENDING);
    });

    it("devuelve 400 DELIVERY_MISSING_FIELDS si faltan datos", async () => {
      const res = await request(app).post("/api/deliveries").send({ address: "Sin pedido" });
      expectError(res, 400, "DELIVERY_MISSING_FIELDS");
    });

    it("devuelve 404 ORDER_NOT_FOUND si el pedido no existe", async () => {
      const res = await request(app).post("/api/deliveries").send({ order: FAKE_ID, address: "Calle 1" });
      expectError(res, 404, "ORDER_NOT_FOUND");
    });
  });
});