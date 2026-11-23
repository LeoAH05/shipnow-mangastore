const request = require("supertest");
const { expect } = require("chai");
const app = require("../src/app");
const User = require("../src/models/user.model");
const { MOCK_MAX_QTY } = require("../src/constants");
const { expectError } = require("./helpers");

describe("Health check", () => {
  it("GET /api/health devuelve estado, entorno, uptime y timestamp", async () => {
    const res = await request(app).get("/api/health");

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.payload).to.have.all.keys("status", "environment", "uptime", "timestamp");
    expect(res.body.payload.status).to.equal("ok");
    expect(res.body.payload.environment).to.equal("test");
    expect(res.body.payload.uptime).to.be.a("number");
    expect(new Date(res.body.payload.timestamp).toString()).to.not.equal("Invalid Date");
  });

  it("no expone información sensible", async () => {
    const res = await request(app).get("/api/health");
    const text = JSON.stringify(res.body).toLowerCase();

    expect(text).to.not.include("mongodb");
    expect(text).to.not.include("password");
  });
});

describe("Paginación", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  after(async () => {
    await User.deleteMany({});
  });

  const createUsers = async (qty) => {
    for (let i = 1; i <= qty; i++) {
      await User.create({ name: `Usuario ${i}`, email: `usuario${i}@test.com`, password: "123456" });
    }
  };

  it("usa page=1 y limit=10 por defecto", async () => {
    const res = await request(app).get("/api/users");

    expect(res.status).to.equal(200);
    expect(res.body.pagination).to.deep.equal({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasPrevPage: false,
      hasNextPage: false,
    });
  });

  it("limita los resultados y calcula las páginas", async () => {
    await createUsers(3);
    const res = await request(app).get("/api/users?limit=2");

    expect(res.status).to.equal(200);
    expect(res.body.payload).to.have.lengthOf(2);
    expect(res.body.pagination).to.include({ page: 1, limit: 2, total: 3, totalPages: 2 });
    expect(res.body.pagination.hasNextPage).to.equal(true);
    expect(res.body.pagination.hasPrevPage).to.equal(false);
  });

  it("devuelve la segunda página", async () => {
    await createUsers(3);
    const res = await request(app).get("/api/users?limit=2&page=2");

    expect(res.status).to.equal(200);
    expect(res.body.payload).to.have.lengthOf(1);
    expect(res.body.pagination.hasNextPage).to.equal(false);
    expect(res.body.pagination.hasPrevPage).to.equal(true);
  });

  it("corta el limit en 100", async () => {
    const res = await request(app).get("/api/users?limit=1000");

    expect(res.status).to.equal(200);
    expect(res.body.pagination.limit).to.equal(100);
  });

  it("devuelve 400 PAGINATION_INVALID con page=0", async () => {
    const res = await request(app).get("/api/users?page=0");
    expectError(res, 400, "PAGINATION_INVALID");
  });

  it("devuelve 400 PAGINATION_INVALID con un limit no numérico", async () => {
    const res = await request(app).get("/api/users?limit=abc");
    expectError(res, 400, "PAGINATION_INVALID");
  });

  ["orders", "deliveries", "products"].forEach((resource) => {
    it(`/api/${resource} también pagina y valida los parámetros`, async () => {
      const ok = await request(app).get(`/api/${resource}`);
      expect(ok.status).to.equal(200);
      expect(ok.body.pagination).to.have.all.keys("page", "limit", "total", "totalPages", "hasPrevPage", "hasNextPage");

      const bad = await request(app).get(`/api/${resource}?limit=-1`);
      expectError(bad, 400, "PAGINATION_INVALID");
    });
  });
});

describe("Límites", () => {
  it("devuelve 400 MOCK_QTY_TOO_LARGE si se piden más mocks del máximo", async () => {
    const res = await request(app).get(`/api/mocks/users?qty=${MOCK_MAX_QTY + 1}`);
    expectError(res, 400, "MOCK_QTY_TOO_LARGE");
  });

  it("devuelve 400 MOCK_QTY_TOO_LARGE en el seed y no inserta nada", async () => {
    const res = await request(app).post(`/api/mocks/seed?entity=users&qty=${MOCK_MAX_QTY + 1}`);
    expectError(res, 400, "MOCK_QTY_TOO_LARGE");
    expect(await User.countDocuments()).to.equal(0);
  });

  it("devuelve 400 INVALID_JSON si el body está mal formado", async () => {
    const res = await request(app)
      .post("/api/users")
      .set("Content-Type", "application/json")
      .send("{ esto no es json");

    expectError(res, 400, "INVALID_JSON");
  });
});