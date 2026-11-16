const request = require("supertest");
const { expect } = require("chai");
const app = require("../src/app");
const User = require("../src/models/user.model");
const Product = require("../src/models/product.model");
const Order = require("../src/models/order.model");
const { PRODUCT_CATEGORIES, ORDER_STATUS, ORDER_PRIORITY } = require("../src/constants");
const { expectError } = require("./helpers");

const FAKE_ID = "000000000000000000000000";

describe("Orders", () => {
  let user;
  let product;

  const orderBody = (extra = {}) => ({
    user: user._id.toString(),
    products: [{ product: product._id.toString(), quantity: 2 }],
    ...extra,
  });

  const createOrder = (extra = {}) =>
    Order.create({
      user: user._id,
      products: [{ product: product._id, quantity: 1 }],
      total: 1500,
      ...extra,
    });

  beforeEach(async () => {
    await Order.deleteMany({});
    await User.deleteMany({});
    await Product.deleteMany({});
    user = await User.create({ name: "Cliente Test", email: "cliente@test.com", password: "123456" });
    product = await Product.create({
      title: "Naruto Vol. 1",
      author: "Masashi Kishimoto",
      price: 1500,
      stock: 10,
      category: PRODUCT_CATEGORIES.MANGA,
    });
  });

  after(async () => {
    await Order.deleteMany({});
    await User.deleteMany({});
    await Product.deleteMany({});
  });

  describe("GET /api/orders", () => {
    it("devuelve los pedidos con el usuario poblado", async () => {
      await createOrder();
      const res = await request(app).get("/api/orders");

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.be.an("array").with.lengthOf(1);
      expect(res.body.payload[0]).to.include.keys("_id", "user", "products", "status", "priority", "total");
      expect(res.body.payload[0].user).to.have.property("name", user.name);
    });

    it("filtra por estado", async () => {
      await createOrder();
      await createOrder({ status: ORDER_STATUS.SHIPPED });
      const res = await request(app).get(`/api/orders?status=${ORDER_STATUS.SHIPPED}`);

      expect(res.status).to.equal(200);
      expect(res.body.payload).to.have.lengthOf(1);
      expect(res.body.payload[0].status).to.equal(ORDER_STATUS.SHIPPED);
    });

    it("devuelve 400 ORDER_INVALID_STATUS si el filtro no existe", async () => {
      const res = await request(app).get("/api/orders?status=invalido");
      expectError(res, 400, "ORDER_INVALID_STATUS");
    });
  });

  describe("GET /api/orders/:id", () => {
    it("devuelve el pedido pedido", async () => {
      const order = await createOrder();
      const res = await request(app).get(`/api/orders/${order._id}`);

      expect(res.status).to.equal(200);
      expect(res.body.payload._id).to.equal(order._id.toString());
      expect(res.body.payload.total).to.equal(1500);
    });

    it("devuelve 404 ORDER_NOT_FOUND si no existe", async () => {
      const res = await request(app).get(`/api/orders/${FAKE_ID}`);
      expectError(res, 404, "ORDER_NOT_FOUND");
    });
  });

  describe("POST /api/orders", () => {
    it("crea un pedido y calcula el total (precio x cantidad)", async () => {
      const res = await request(app)
        .post("/api/orders")
        .send(orderBody({ priority: ORDER_PRIORITY.HIGH }));

      expect(res.status).to.equal(201);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload.user).to.equal(user._id.toString());
      expect(res.body.payload.total).to.equal(3000);
      expect(res.body.payload.priority).to.equal(ORDER_PRIORITY.HIGH);
      expect(res.body.payload.status).to.equal(ORDER_STATUS.PENDING);
      expect(res.body.payload.products).to.have.lengthOf(1);
    });

    it("devuelve 400 ORDER_MISSING_FIELDS si faltan datos", async () => {
      const res = await request(app).post("/api/orders").send({});
      expectError(res, 400, "ORDER_MISSING_FIELDS");
    });

    it("devuelve 400 ORDER_INVALID_STATUS si el estado no existe", async () => {
      const res = await request(app).post("/api/orders").send(orderBody({ status: "invalido" }));
      expectError(res, 400, "ORDER_INVALID_STATUS");
    });

    it("devuelve 400 ORDER_INVALID_PRIORITY si la prioridad no existe", async () => {
      const res = await request(app).post("/api/orders").send(orderBody({ priority: "urgente" }));
      expectError(res, 400, "ORDER_INVALID_PRIORITY");
    });

    it("devuelve 404 USER_NOT_FOUND si el usuario no existe", async () => {
      const res = await request(app).post("/api/orders").send(orderBody({ user: FAKE_ID }));
      expectError(res, 404, "USER_NOT_FOUND");
    });
  });

  describe("PUT /api/orders/:id (actualizar estado)", () => {
    it("actualiza el estado del pedido", async () => {
      const order = await createOrder();
      const res = await request(app)
        .put(`/api/orders/${order._id}`)
        .send({ status: ORDER_STATUS.SHIPPED });

      expect(res.status).to.equal(200);
      expect(res.body.payload._id).to.equal(order._id.toString());
      expect(res.body.payload.status).to.equal(ORDER_STATUS.SHIPPED);
    });

    it("devuelve 400 ORDER_INVALID_STATUS si el estado no existe", async () => {
      const order = await createOrder();
      const res = await request(app).put(`/api/orders/${order._id}`).send({ status: "invalido" });
      expectError(res, 400, "ORDER_INVALID_STATUS");
    });

    it("devuelve 404 ORDER_NOT_FOUND si el pedido no existe", async () => {
      const res = await request(app).put(`/api/orders/${FAKE_ID}`).send({ status: ORDER_STATUS.SHIPPED });
      expectError(res, 404, "ORDER_NOT_FOUND");
    });
  });
});