const request = require("supertest");
const { expect } = require("chai");
const app = require("../src/app");
const User = require("../src/models/user.model");
const Product = require("../src/models/product.model");
const Order = require("../src/models/order.model");
const Delivery = require("../src/models/delivery.model");
const { ROLES, PRODUCT_CATEGORIES } = require("../src/constants");
const { expectError } = require("./helpers");

describe("Mocks", () => {
  const cleanAll = async () => {
    await Delivery.deleteMany({});
    await Order.deleteMany({});
    await User.deleteMany({});
    await Product.deleteMany({});
  };

  beforeEach(cleanAll);
  after(cleanAll);

  describe("GET /api/mocks/users", () => {
    it("genera la cantidad pedida de usuarios con roles válidos, sin guardarlos", async () => {
      const res = await request(app).get("/api/mocks/users?qty=3");

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.be.an("array").with.lengthOf(3);
      res.body.payload.forEach((u) => {
        expect(u).to.include.keys("name", "email", "password", "role");
        expect(Object.values(ROLES)).to.include(u.role);
      });
      expect(await User.countDocuments()).to.equal(0);
    });

    it("devuelve 400 MOCK_INVALID_QTY con una cantidad negativa", async () => {
      const res = await request(app).get("/api/mocks/users?qty=-5");
      expectError(res, 400, "MOCK_INVALID_QTY");
    });
  });

  describe("GET /api/mocks/products", () => {
    it("genera productos con categorías válidas", async () => {
      const res = await request(app).get("/api/mocks/products?qty=2");

      expect(res.status).to.equal(200);
      expect(res.body.payload).to.be.an("array").with.lengthOf(2);
      res.body.payload.forEach((p) => {
        expect(p).to.include.keys("title", "author", "price", "stock", "category");
        expect(Object.values(PRODUCT_CATEGORIES)).to.include(p.category);
      });
    });

    it("devuelve 400 MOCK_INVALID_QTY con una cantidad negativa", async () => {
      const res = await request(app).get("/api/mocks/products?qty=-1");
      expectError(res, 400, "MOCK_INVALID_QTY");
    });
  });

  describe("POST /api/mocks/seed", () => {
    it("inserta usuarios en la base y responde la cantidad", async () => {
      const res = await request(app).post("/api/mocks/seed?entity=users&qty=5");

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.deep.equal({ insertados: 5, coleccion: "usuarios" });
      expect(await User.countDocuments()).to.equal(5);
    });

    it("inserta pedidos a partir de usuarios existentes", async () => {
      await User.create({ name: "Cliente", email: "cliente@test.com", password: "123456", role: ROLES.USER });
      const res = await request(app).post("/api/mocks/seed?entity=orders&qty=1");

      expect(res.status).to.equal(200);
      expect(res.body.payload).to.deep.equal({ insertados: 1, coleccion: "pedidos" });
      expect(await Order.countDocuments()).to.equal(1);
    });

    it("devuelve 400 MOCK_INVALID_QTY con una cantidad negativa", async () => {
      const res = await request(app).post("/api/mocks/seed?entity=users&qty=-5");
      expectError(res, 400, "MOCK_INVALID_QTY");
      expect(await User.countDocuments()).to.equal(0);
    });

    it("devuelve 400 MOCK_INVALID_ENTITY con una entidad inexistente", async () => {
      const res = await request(app).post("/api/mocks/seed?entity=cosas&qty=2");
      expectError(res, 400, "MOCK_INVALID_ENTITY");
    });

    it("devuelve 400 MOCK_INVALID_ENTITY si falta la entidad", async () => {
      const res = await request(app).post("/api/mocks/seed?qty=2");
      expectError(res, 400, "MOCK_INVALID_ENTITY");
    });

    it("devuelve 400 MOCK_NO_USERS si no hay usuarios para crear pedidos", async () => {
      const res = await request(app).post("/api/mocks/seed?entity=orders&qty=2");
      expectError(res, 400, "MOCK_NO_USERS");
    });

    it("devuelve 400 MOCK_NO_ORDERS si no hay pedidos para crear entregas", async () => {
      const res = await request(app).post("/api/mocks/seed?entity=deliveries&qty=2");
      expectError(res, 400, "MOCK_NO_ORDERS");
    });
  });
});