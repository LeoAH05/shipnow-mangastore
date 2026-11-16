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
  ORDER_INVALID_PRIORITY: () => new CustomError("Prioridad de pedido inválida", 400, "ORDER_INVALID_PRIORITY"),
  ORDER_MISSING_FIELDS: () => new CustomError("Faltan campos obligatorios: user, products", 400, "ORDER_MISSING_FIELDS"),

  // Entregas
  DELIVERY_NOT_FOUND: () => new CustomError("Entrega no encontrada", 404, "DELIVERY_NOT_FOUND"),
  DELIVERY_INVALID_STATUS: () => new CustomError("Estado de entrega inválido", 400, "DELIVERY_INVALID_STATUS"),
  DELIVERY_MISSING_FIELDS: () => new CustomError("Faltan campos obligatorios: order, address", 400, "DELIVERY_MISSING_FIELDS"),

  // Mocks
  MOCK_INVALID_QTY: () => new CustomError("La cantidad debe ser un número positivo mayor a 0", 400, "MOCK_INVALID_QTY"),
  MOCK_INVALID_ENTITY: () => new CustomError("Entidad no válida. Usá: users, products, orders, deliveries", 400, "MOCK_INVALID_ENTITY"),
  MOCK_NO_USERS: () => new CustomError("No hay usuarios. Primero ejecutá POST /api/mocks/seed?entity=users", 400, "MOCK_NO_USERS"),
  MOCK_NO_ORDERS: () => new CustomError("No hay pedidos. Primero ejecutá POST /api/mocks/seed?entity=orders", 400, "MOCK_NO_ORDERS"),
  MOCK_SEED_ERROR: () => new CustomError("Error al insertar datos en MongoDB", 500, "MOCK_SEED_ERROR"),
  
  // Archivos
  FILE_REQUIRED: () => new CustomError("Debés adjuntar un archivo", 400, "FILE_REQUIRED"),
  FILE_INVALID_TYPE: () => new CustomError("Tipo de archivo no permitido. Usá PDF, JPG o PNG", 400, "FILE_INVALID_TYPE"),
  FILE_TOO_LARGE: () => new CustomError("El archivo supera el tamaño máximo permitido (2 MB)", 413, "FILE_TOO_LARGE"),
  FILE_INVALID_FIELD: () => new CustomError("El nombre del campo del archivo no es el esperado", 400, "FILE_INVALID_FIELD"),
  DOCUMENT_TYPE_INVALID: () => new CustomError("Tipo de documento inválido. Usá: dni, license, address_proof, other", 400, "DOCUMENT_TYPE_INVALID"),
  UPLOAD_INVALID_ENTITY: () => new CustomError("Entidad inválida. Usá: orders o deliveries", 400, "UPLOAD_INVALID_ENTITY"),
  FILE_SAVE_ERROR: () => new CustomError("Error al guardar el archivo", 500, "FILE_SAVE_ERROR"),
};

module.exports = ErrorDictionary;