const request = require("supertest");
const { expect } = require("chai");
const app = require("../src/app");
const { expectError } = require("./helpers");

describe("Logger", () => {
  it("GET /api/logger/test responde 200 con un mensaje", async () => {
    const res = await request(app).get("/api/logger/test");

    expect(res.status).to.equal(200);
    expect(res.body.status).to.equal("success");
    expect(res.body.message).to.be.a("string").that.is.not.empty;
  });
});

describe("Swagger", () => {
  it("GET /api/docs/ sirve la interfaz de documentación", async () => {
    const res = await request(app).get("/api/docs/");

    expect(res.status).to.equal(200);
    expect(res.headers["content-type"]).to.match(/html/);
    expect(res.text.toLowerCase()).to.include("swagger");
  });
});

describe("Ruta inexistente", () => {
  it("devuelve 404 ROUTE_NOT_FOUND", async () => {
    const res = await request(app).get("/api/ruta-que-no-existe");
    expectError(res, 404, "ROUTE_NOT_FOUND");
  });
});