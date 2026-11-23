const { Router } = require("express");
const config = require("../config/env.config");

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Estado de la API (no expone información sensible)
 */

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check de la API
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: La API está funcionando
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
 *                     status:
 *                       type: string
 *                       example: ok
 *                     environment:
 *                       type: string
 *                       example: production
 *                     uptime:
 *                       type: number
 *                       description: Segundos desde que arrancó el servidor
 *                       example: 3600
 *                     timestamp:
 *                       type: string
 *                       format: date-time
 */
router.get("/", (req, res) => {
  res.json({
    status: "success",
    payload: {
      status: "ok",
      environment: config.NODE_ENV,
      uptime: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    },
  });
});

module.exports = router;