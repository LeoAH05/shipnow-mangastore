const { Router } = require("express");
const mockController = require("./mock.controller");

const router = Router();


router.get("/users", mockController.getUsers);


router.get("/products", mockController.getProducts);


router.post("/seed", mockController.seed);

module.exports = router;