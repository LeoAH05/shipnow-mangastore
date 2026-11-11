const { Router } = require("express");
const deliveryController = require("../controllers/delivery.controller");

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Deliveries
 *   description: Gestión de entregas
 */

/**
 * @swagger
 * /api/deliveries:
 *   get:
 *     summary: Obtener todas las entregas
 *     tags: [Deliveries]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, completed, failed]
 *         description: Filtrar por estado
 *     responses:
 *       200:
 *         description: Lista de entregas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Estado inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", deliveryController.getAll);

/**
 * @swagger
 * /api/deliveries/{id}:
 *   get:
 *     summary: Obtener entrega por ID
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la entrega
 *     responses:
 *       200:
 *         description: Entrega encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Entrega no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", deliveryController.getById);

/**
 * @swagger
 * /api/deliveries:
 *   post:
 *     summary: Crear una entrega asociada a un pedido
 *     tags: [Deliveries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [order, address]
 *             properties:
 *               order:
 *                 type: string
 *                 example: 6abc0c89d76fd88a8c39e86f
 *               deliveryPerson:
 *                 type: string
 *                 description: ID de un usuario con rol delivery (opcional)
 *               address:
 *                 type: string
 *                 example: Av. Corrientes 1234
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed, failed]
 *               estimatedDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Entrega creada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Campos faltantes o estado inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Pedido o repartidor no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", deliveryController.create);

/**
 * @swagger
 * /api/deliveries/{id}:
 *   put:
 *     summary: Actualizar una entrega
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed, failed]
 *               deliveryPerson:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Entrega actualizada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Estado inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Entrega o repartidor no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/:id", deliveryController.update);

/**
 * @swagger
 * /api/deliveries/{id}:
 *   delete:
 *     summary: Eliminar una entrega
 *     tags: [Deliveries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Entrega eliminada
 *       404:
 *         description: Entrega no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:id", deliveryController.delete);

module.exports = router;