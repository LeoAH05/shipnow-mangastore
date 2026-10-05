const { Router } = require("express");
const mockController = require("./mock.controller");

const router = Router();

// GET /api/mocks/users?qty=10 → genera usuarios sin guardar
router.get("/users", mockController.getUsers);

// GET /api/mocks/products?qty=10 → genera productos sin guardar
router.get("/products", mockController.getProducts);

// POST /api/mocks/seed?entity=users&qty=10 → inserta en MongoDB
router.post("/seed", mockController.seed);

module.exports = router;