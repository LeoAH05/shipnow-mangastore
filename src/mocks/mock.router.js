const { Router } = require("express");
const mockController = require("./mock.controller");

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Mocks
 *   description: Generación y carga de datos de prueba
 */

/**
 * @swagger
 * /api/mocks/users:
 *   get:
 *     summary: Generar usuarios simulados sin guardar
 *     tags: [Mocks]
 *     parameters:
 *       - in: query
 *         name: qty
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Cantidad de usuarios a generar
 *     responses:
 *       200:
 *         description: Usuarios generados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Cantidad inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/users", mockController.getUsers);

/**
 * @swagger
 * /api/mocks/products:
 *   get:
 *     summary: Generar productos simulados sin guardar
 *     tags: [Mocks]
 *     parameters:
 *       - in: query
 *         name: qty
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Cantidad de productos a generar
 *     responses:
 *       200:
 *         description: Productos generados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Cantidad inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/products", mockController.getProducts);

/**
 * @swagger
 * /api/mocks/seed:
 *   post:
 *     summary: Insertar datos de prueba en MongoDB
 *     tags: [Mocks]
 *     parameters:
 *       - in: query
 *         name: entity
 *         required: true
 *         schema:
 *           type: string
 *           enum: [users, products, orders, deliveries]
 *         description: Entidad a insertar
 *       - in: query
 *         name: qty
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Cantidad a insertar
 *     responses:
 *       200:
 *         description: Datos insertados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 payload:
 *                   type: object
 *                   properties:
 *                     insertados:
 *                       type: number
 *                       example: 10
 *                     coleccion:
 *                       type: string
 *                       example: usuarios
 *       400:
 *         description: Entidad inválida, cantidad inválida o dependencias faltantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/seed", mockController.seed);

module.exports = router;