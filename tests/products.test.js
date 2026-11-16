const request = require("supertest");
const { expect } = require("chai");
const app = require("../src/app");
const Product = require("../src/models/product.model");
const { PRODUCT_CATEGORIES, PRODUCT_STATUS } = require("../src/constants");
const { expectError } = require("./helpers");

const FAKE_ID = "000000000000000000000000";

const validProduct = {
  title: "Naruto Vol. 1",
  author: "Masashi Kishimoto",
  description: "El inicio de la aventura de Naruto",
  price: 1500,
  stock: 10,
  category: PRODUCT_CATEGORIES.MANGA,
};

describe("Products", () => {
  beforeEach(async () => {
    await Product.deleteMany({});
  });

  after(async () => {
    await Product.deleteMany({});
  });

  describe("GET /api/products", () => {
    it("devuelve la lista de productos disponibles", async () => {
      await Product.create(validProduct);
      const res = await request(app).get("/api/products");

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.be.an("array").with.lengthOf(1);
      expect(res.body.payload[0]).to.include.keys("_id", "title", "author", "price", "stock", "category", "status");
    });

    it("filtra por categoría", async () => {
      await Product.create(validProduct);
      await Product.create({ ...validProduct, title: "Batman", category: PRODUCT_CATEGORIES.COMIC });
      const res = await request(app).get(`/api/products?category=${PRODUCT_CATEGORIES.COMIC}`);

      expect(res.status).to.equal(200);
      expect(res.body.payload).to.have.lengthOf(1);
      expect(res.body.payload[0].category).to.equal(PRODUCT_CATEGORIES.COMIC);
    });
  });

  describe("GET /api/products/:id", () => {
    it("devuelve el producto pedido", async () => {
      const product = await Product.create(validProduct);
      const res = await request(app).get(`/api/products/${product._id}`);

      expect(res.status).to.equal(200);
      expect(res.body.payload._id).to.equal(product._id.toString());
      expect(res.body.payload.title).to.equal(validProduct.title);
    });

    it("devuelve 404 PRODUCT_NOT_FOUND si no existe", async () => {
      const res = await request(app).get(`/api/products/${FAKE_ID}`);
      expectError(res, 404, "PRODUCT_NOT_FOUND");
    });
  });

  describe("POST /api/products", () => {
    it("crea un producto con estado available por defecto", async () => {
      const res = await request(app).post("/api/products").send(validProduct);

      expect(res.status).to.equal(201);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.include({ title: validProduct.title, price: validProduct.price });
      expect(res.body.payload.status).to.equal(PRODUCT_STATUS.AVAILABLE);
    });

    it("devuelve 400 PRODUCT_MISSING_FIELDS si faltan datos", async () => {
      const res = await request(app).post("/api/products").send({ title: "Sin precio" });
      expectError(res, 400, "PRODUCT_MISSING_FIELDS");
    });
  });

  describe("PUT /api/products/:id", () => {
    it("actualiza el producto", async () => {
      const product = await Product.create(validProduct);
      const res = await request(app).put(`/api/products/${product._id}`).send({ price: 2000 });

      expect(res.status).to.equal(200);
      expect(res.body.payload.price).to.equal(2000);
    });

    it("pasa a out_of_stock cuando el stock llega a 0", async () => {
      const product = await Product.create(validProduct);
      const res = await request(app).put(`/api/products/${product._id}`).send({ stock: 0 });

      expect(res.status).to.equal(200);
      expect(res.body.payload.status).to.equal(PRODUCT_STATUS.OUT_OF_STOCK);
    });

    it("devuelve 404 PRODUCT_NOT_FOUND si no existe", async () => {
      const res = await request(app).put(`/api/products/${FAKE_ID}`).send({ price: 2000 });
      expectError(res, 404, "PRODUCT_NOT_FOUND");
    });
  });

  describe("DELETE /api/products/:id", () => {
    it("elimina el producto", async () => {
      const product = await Product.create(validProduct);
      const res = await request(app).delete(`/api/products/${product._id}`);

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal("success");
      expect(await Product.countDocuments()).to.equal(0);
    });

    it("devuelve 404 PRODUCT_NOT_FOUND si no existe", async () => {
      const res = await request(app).delete(`/api/products/${FAKE_ID}`);
      expectError(res, 404, "PRODUCT_NOT_FOUND");
    });
  });
});