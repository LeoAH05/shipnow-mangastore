const request = require("supertest");
const { expect } = require("chai");
const fs = require("fs");
const path = require("path");
const app = require("../src/app");
const config = require("../src/config/env.config");
const User = require("../src/models/user.model");
const Product = require("../src/models/product.model");
const Order = require("../src/models/order.model");
const Delivery = require("../src/models/delivery.model");
const {
  PRODUCT_CATEGORIES,
  USER_DOCUMENT_TYPES,
  RECEIPT_TYPE,
  UPLOAD_FOLDERS,
  FILE_FIELDS,
  FILE_RULES,
} = require("../src/constants");
const { expectError } = require("./helpers");

const FAKE_ID = "000000000000000000000000";
const uploadsRoot = path.resolve(process.cwd(), config.UPLOADS_DIR);
const pdf = Buffer.from("%PDF-1.4 archivo de prueba");

const filesIn = (folder) => {
  const dir = path.join(uploadsRoot, folder);
  return fs.existsSync(dir) ? fs.readdirSync(dir) : [];
};

describe("Uploads", () => {
  let user;
  let order;
  let delivery;

  const cleanAll = async () => {
    await Delivery.deleteMany({});
    await Order.deleteMany({});
    await User.deleteMany({});
    await Product.deleteMany({});
    fs.rmSync(uploadsRoot, { recursive: true, force: true });
  };

  before(() => {
    // Protección: nunca borrar la carpeta real de uploads
    if (!config.UPLOADS_DIR.includes("test")) {
      throw new Error("Los tests deben usar una carpeta de uploads de test (UPLOADS_DIR=uploads_test)");
    }
  });

  beforeEach(async () => {
    await cleanAll();
    user = await User.create({ name: "Cliente Test", email: "cliente@test.com", password: "123456" });
    const product = await Product.create({
      title: "Naruto Vol. 1",
      author: "Masashi Kishimoto",
      price: 1500,
      stock: 10,
      category: PRODUCT_CATEGORIES.MANGA,
    });
    order = await Order.create({
      user: user._id,
      products: [{ product: product._id, quantity: 1 }],
      total: 1500,
    });
    delivery = await Delivery.create({ order: order._id, address: "Av. Corrientes 1234" });
  });

  after(cleanAll);

  describe("POST /api/uploads/users/:id/documents", () => {
    it("carga un documento y registra solo los metadatos", async () => {
      const res = await request(app)
        .post(`/api/uploads/users/${user._id}/documents`)
        .field("documentType", USER_DOCUMENT_TYPES.DNI)
        .attach(FILE_FIELDS.DOCUMENT, pdf, { filename: "dni.pdf", contentType: "application/pdf" });

      expect(res.status).to.equal(201);
      expect(res.body.status).to.equal("success");
      expect(res.body.payload).to.not.have.property("password");
      expect(res.body.payload.documents).to.be.an("array").with.lengthOf(1);

      const doc = res.body.payload.documents[0];
      expect(doc).to.include.keys("originalName", "storedName", "path", "mimeType", "size", "documentType", "uploadedAt");
      expect(doc.originalName).to.equal("dni.pdf");
      expect(doc.storedName).to.not.equal("dni.pdf");
      expect(doc.mimeType).to.equal("application/pdf");
      expect(doc.documentType).to.equal(USER_DOCUMENT_TYPES.DNI);
      expect(doc.size).to.equal(pdf.length);

      // El archivo existe en disco y los metadatos están en la base
      expect(fs.existsSync(path.resolve(process.cwd(), doc.path))).to.equal(true);
      const saved = await User.findById(user._id);
      expect(saved.documents).to.have.lengthOf(1);
    });

    it("usa el tipo 'other' cuando no se envía documentType", async () => {
      const res = await request(app)
        .post(`/api/uploads/users/${user._id}/documents`)
        .attach(FILE_FIELDS.DOCUMENT, pdf, { filename: "otro.pdf", contentType: "application/pdf" });

      expect(res.status).to.equal(201);
      expect(res.body.payload.documents[0].documentType).to.equal(USER_DOCUMENT_TYPES.OTHER);
    });

    it("devuelve 400 FILE_REQUIRED si falta el archivo", async () => {
      const res = await request(app)
        .post(`/api/uploads/users/${user._id}/documents`)
        .field("documentType", USER_DOCUMENT_TYPES.DNI);

      expectError(res, 400, "FILE_REQUIRED");
    });

    it("devuelve 400 DOCUMENT_TYPE_INVALID y no deja el archivo en disco", async () => {
      const res = await request(app)
        .post(`/api/uploads/users/${user._id}/documents`)
        .field("documentType", "pasaporte-falso")
        .attach(FILE_FIELDS.DOCUMENT, pdf, { filename: "dni.pdf", contentType: "application/pdf" });

      expectError(res, 400, "DOCUMENT_TYPE_INVALID");
      expect(filesIn(UPLOAD_FOLDERS.DOCUMENTS)).to.have.lengthOf(0);
    });

    it("devuelve 400 FILE_INVALID_TYPE con un tipo de archivo no permitido", async () => {
      const res = await request(app)
        .post(`/api/uploads/users/${user._id}/documents`)
        .attach(FILE_FIELDS.DOCUMENT, Buffer.from("hola"), { filename: "notas.txt", contentType: "text/plain" });

      expectError(res, 400, "FILE_INVALID_TYPE");
    });

    it("devuelve 413 FILE_TOO_LARGE si supera el tamaño máximo", async () => {
      const big = Buffer.alloc(FILE_RULES.MAX_SIZE_BYTES + 1);
      const res = await request(app)
        .post(`/api/uploads/users/${user._id}/documents`)
        .attach(FILE_FIELDS.DOCUMENT, big, { filename: "grande.pdf", contentType: "application/pdf" });

      expectError(res, 413, "FILE_TOO_LARGE");
    });

    it("devuelve 400 FILE_INVALID_FIELD si el campo del archivo no es el esperado", async () => {
      const res = await request(app)
        .post(`/api/uploads/users/${user._id}/documents`)
        .attach("archivo", pdf, { filename: "dni.pdf", contentType: "application/pdf" });

      expectError(res, 400, "FILE_INVALID_FIELD");
    });

    it("devuelve 404 USER_NOT_FOUND si el usuario no existe y no deja el archivo en disco", async () => {
      const res = await request(app)
        .post(`/api/uploads/users/${FAKE_ID}/documents`)
        .attach(FILE_FIELDS.DOCUMENT, pdf, { filename: "dni.pdf", contentType: "application/pdf" });

      expectError(res, 404, "USER_NOT_FOUND");
      expect(filesIn(UPLOAD_FOLDERS.DOCUMENTS)).to.have.lengthOf(0);
    });
  });

  describe("POST /api/uploads/receipts/:entity/:id", () => {
    it("asocia un comprobante a un pedido", async () => {
      const res = await request(app)
        .post(`/api/uploads/receipts/orders/${order._id}`)
        .attach(FILE_FIELDS.RECEIPT, pdf, { filename: "comprobante.pdf", contentType: "application/pdf" });

      expect(res.status).to.equal(201);
      expect(res.body.payload._id).to.equal(order._id.toString());
      expect(res.body.payload.receipts).to.have.lengthOf(1);
      expect(res.body.payload.receipts[0].documentType).to.equal(RECEIPT_TYPE);
      expect(res.body.payload.receipts[0].originalName).to.equal("comprobante.pdf");
      expect(filesIn(UPLOAD_FOLDERS.RECEIPTS)).to.have.lengthOf(1);
    });

    it("asocia un comprobante a una entrega", async () => {
      const res = await request(app)
        .post(`/api/uploads/receipts/deliveries/${delivery._id}`)
        .attach(FILE_FIELDS.RECEIPT, pdf, { filename: "entrega.pdf", contentType: "application/pdf" });

      expect(res.status).to.equal(201);
      expect(res.body.payload._id).to.equal(delivery._id.toString());
      expect(res.body.payload.receipts).to.have.lengthOf(1);
      expect(res.body.payload.receipts[0].documentType).to.equal(RECEIPT_TYPE);
    });

    it("devuelve 400 FILE_REQUIRED si falta el archivo", async () => {
      const res = await request(app)
        .post(`/api/uploads/receipts/orders/${order._id}`)
        .field("nota", "sin archivo");

      expectError(res, 400, "FILE_REQUIRED");
    });

    it("devuelve 404 ORDER_NOT_FOUND si el pedido no existe", async () => {
      const res = await request(app)
        .post(`/api/uploads/receipts/orders/${FAKE_ID}`)
        .attach(FILE_FIELDS.RECEIPT, pdf, { filename: "comprobante.pdf", contentType: "application/pdf" });

      expectError(res, 404, "ORDER_NOT_FOUND");
      expect(filesIn(UPLOAD_FOLDERS.RECEIPTS)).to.have.lengthOf(0);
    });

    it("devuelve 404 DELIVERY_NOT_FOUND si la entrega no existe", async () => {
      const res = await request(app)
        .post(`/api/uploads/receipts/deliveries/${FAKE_ID}`)
        .attach(FILE_FIELDS.RECEIPT, pdf, { filename: "entrega.pdf", contentType: "application/pdf" });

      expectError(res, 404, "DELIVERY_NOT_FOUND");
    });

    it("devuelve 400 UPLOAD_INVALID_ENTITY con una entidad inexistente", async () => {
      const res = await request(app)
        .post(`/api/uploads/receipts/cosas/${order._id}`)
        .attach(FILE_FIELDS.RECEIPT, pdf, { filename: "comprobante.pdf", contentType: "application/pdf" });

      expectError(res, 400, "UPLOAD_INVALID_ENTITY");
    });
  });
});