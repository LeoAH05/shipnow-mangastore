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

module.exports = {
  ROLES,
  PRODUCT_STATUS,
  PRODUCT_CATEGORIES,
  ORDER_STATUS,
  ORDER_PRIORITY,
  DELIVERY_STATUS,
};