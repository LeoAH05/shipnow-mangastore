const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ShipNow MangaStore API",
      version: "1.0.0",
      description: "API REST para una tienda de comics y mangas japoneses. Permite gestionar usuarios, productos, pedidos, entregas y datos de prueba.",
    },
    servers: [
      {
        url: "http://localhost:8080",
        description: "Servidor local",
      },
    ],
    components: {
      schemas: {
        User: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6abc0c89d76fd88a8c39e86f" },
            name: { type: "string", example: "Leonardo" },
            email: { type: "string", example: "leo@mangastore.com" },
            role: { type: "string", enum: ["user", "admin", "delivery"], example: "user" },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Product: {
          type: "object",
          properties: {
            _id: { type: "string", example: "6abc0986348e8a69f4324f3c" },
            title: { type: "string", example: "Naruto Vol. 1" },
            author: { type: "string", example: "Masashi Kishimoto" },
            description: { type: "string", example: "El inicio de la aventura de Naruto" },
            price: { type: "number", example: 1500 },
            stock: { type: "number", example: 10 },
            category: { type: "string", enum: ["manga", "comic", "figure", "artbook"] },
            status: { type: "string", enum: ["available", "out_of_stock"] },
          },
        },
        Order: {
          type: "object",
          properties: {
            _id: { type: "string" },
            user: { type: "string", example: "6abc0c89d76fd88a8c39e86f" },
            status: { type: "string", enum: ["pending", "processing", "shipped", "delivered", "cancelled"] },
            priority: { type: "string", enum: ["low", "medium", "high"] },
            total: { type: "number", example: 3000 },
          },
        },
        Delivery: {
          type: "object",
          properties: {
            _id: { type: "string" },
            order: { type: "string" },
            deliveryPerson: { type: "string" },
            status: { type: "string", enum: ["pending", "in_progress", "completed", "failed"] },
            address: { type: "string", example: "Av. Corrientes 1234" },
            estimatedDate: { type: "string", format: "date-time" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "error" },
            errorCode: { type: "string", example: "PRODUCT_NOT_FOUND" },
            message: { type: "string", example: "Producto no encontrado" },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "success" },
            payload: { type: "object" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js", "./src/mocks/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;