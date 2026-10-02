const ROLES = Object.freeze({
  ADMIN: "admin",
  USER: "user",
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

module.exports = { ROLES, PRODUCT_STATUS, PRODUCT_CATEGORIES };