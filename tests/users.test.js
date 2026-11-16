const request = require("supertest");
const { expect } = require("chai");
const app = require("../src/app");
const User = require("../src/models/user.model");
const { ROLES } = require("../src/constants");
const { expectError } = require("./helpers");

const FAKE_ID = "000000000000000000000000";
const validUser = { name: "Test User", email: "test.user@mangastore.com", password: "123456" };

describe("Users", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  after(async () => {
    await User.deleteMany({});
  });

  describe("GET /api/users", () => {
    it("devuelve la lista de usuarios sin exponer la contraseña", async () => {
      await User.create(validUser);
      const res = await request(app).get("/api/users");

      expect(res.status).to.equal(200);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.be.an("array").with.lengthOf(1);
      expect(res.body.payload[0]).to.include.keys("_id", "name", "email", "role");
      expect(res.body.payload[0]).to.not.have.property("password");
    });
  });

  describe("GET /api/users/:id", () => {
    it("devuelve el usuario pedido", async () => {
      const user = await User.create(validUser);
      const res = await request(app).get(`/api/users/${user._id}`);

      expect(res.status).to.equal(200);
      expect(res.body.payload._id).to.equal(user._id.toString());
      expect(res.body.payload.email).to.equal(validUser.email);
    });

    it("devuelve 404 USER_NOT_FOUND si no existe", async () => {
      const res = await request(app).get(`/api/users/${FAKE_ID}`);
      expectError(res, 404, "USER_NOT_FOUND");
    });
  });

  describe("POST /api/users", () => {
    it("crea un usuario con rol user por defecto", async () => {
      const res = await request(app).post("/api/users").send(validUser);

      expect(res.status).to.equal(201);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.include({ name: validUser.name, email: validUser.email });
      expect(res.body.payload.role).to.equal(ROLES.USER);
    });

    it("devuelve 400 USER_MISSING_FIELDS si faltan datos", async () => {
      const res = await request(app).post("/api/users").send({ name: "Sin email" });
      expectError(res, 400, "USER_MISSING_FIELDS");
    });

    it("devuelve 400 USER_ALREADY_EXISTS si el email está repetido", async () => {
      await User.create(validUser);
      const res = await request(app).post("/api/users").send(validUser);
      expectError(res, 400, "USER_ALREADY_EXISTS");
    });
  });
});