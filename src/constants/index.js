const ROLES = Object.freeze({
  ADMIN: "admin",
  USER: "user",
  DELIVERY: "delivery",
});

const PRODUCT_STATUS = Object.freeze({
  AVAILABLE: "available",
  OUT_OF_STOCK: "out_of_stock",
});

const PRODUCT_CATEGORIES = Object.freeze({
  MANGA: "manga",
  COMIC: "comic",
  FIGURE: "figure",
  ARTBOOK: "artbook",
});

const ORDER_STATUS = Object.freeze({
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
});

const ORDER_PRIORITY = Object.freeze({
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
});

const DELIVERY_STATUS = Object.freeze({
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  FAILED: "failed",
});


const USER_DOCUMENT_TYPES = Object.freeze({
  DNI: "dni",
  LICENSE: "license",
  ADDRESS_PROOF: "address_proof",
  OTHER: "other",
});

const RECEIPT_TYPE = "receipt";

const UPLOAD_FOLDERS = Object.freeze({
  DOCUMENTS: "documents",
  RECEIPTS: "receipts",
});

const FILE_FIELDS = Object.freeze({
  DOCUMENT: "document",
  RECEIPT: "receipt",
});

const FILE_RULES = Object.freeze({
  ALLOWED_MIME_TYPES: Object.freeze(["application/pdf", "image/jpeg", "image/png"]),
  MAX_SIZE_BYTES: 2 * 1024 * 1024, // 2 MB
});

const MOCK_MAX_QTY = 100;

module.exports = {
  ROLES,
  PRODUCT_STATUS,
  PRODUCT_CATEGORIES,
  ORDER_STATUS,
  ORDER_PRIORITY,
  DELIVERY_STATUS,
  USER_DOCUMENT_TYPES,
  RECEIPT_TYPE,
  UPLOAD_FOLDERS,
  FILE_FIELDS,
  FILE_RULES,
  MOCK_MAX_QTY,
};