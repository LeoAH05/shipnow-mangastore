const CustomError = require("./CustomError");

const ErrorDictionary = {
  // Usuarios
  USER_NOT_FOUND: () => new CustomError("Usuario no encontrado", 404, "USER_NOT_FOUND"),
  USER_ALREADY_EXISTS: () => new CustomError("El email ya está registrado", 400, "USER_ALREADY_EXISTS"),
  USER_MISSING_FIELDS: () => new CustomError("Faltan campos obligatorios: name, email, password", 400, "USER_MISSING_FIELDS"),

  // Productos
  PRODUCT_NOT_FOUND: () => new CustomError("Producto no encontrado", 404, "PRODUCT_NOT_FOUND"),
  PRODUCT_MISSING_FIELDS: () => new CustomError("Faltan campos obligatorios: title, price, category", 400, "PRODUCT_MISSING_FIELDS"),

  // Pedidos
  ORDER_NOT_FOUND: () => new CustomError("Pedido no encontrado", 404, "ORDER_NOT_FOUND"),
  ORDER_INVALID_STATUS: () => new CustomError("Estado de pedido inválido", 400, "ORDER_INVALID_STATUS"),

  // Entregas
  DELIVERY_NOT_FOUND: () => new CustomError("Entrega no encontrada", 404, "DELIVERY_NOT_FOUND"),

  // Mocks
  MOCK_INVALID_QTY: () => new CustomError("La cantidad debe ser un número positivo mayor a 0", 400, "MOCK_INVALID_QTY"),
  MOCK_INVALID_ENTITY: () => new CustomError("Entidad no válida. Usá: users, products, orders, deliveries", 400, "MOCK_INVALID_ENTITY"),
  MOCK_NO_USERS: () => new CustomError("No hay usuarios. Primero ejecutá POST /api/mocks/seed?entity=users", 400, "MOCK_NO_USERS"),
  MOCK_NO_ORDERS: () => new CustomError("No hay pedidos. Primero ejecutá POST /api/mocks/seed?entity=orders", 400, "MOCK_NO_ORDERS"),
  MOCK_SEED_ERROR: () => new CustomError("Error al insertar datos en MongoDB", 500, "MOCK_SEED_ERROR"),
};

module.exports = ErrorDictionary;