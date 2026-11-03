const { Router } = require("express");
const logger = require("../config/logger");

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Logger
 *   description: Herramienta de validación del sistema de logs (no es una funcionalidad de negocio)
 */

/**
 * @swagger
 * /api/logger/test:
 *   get:
 *     summary: Probar todos los niveles de log
 *     tags: [Logger]
 *     description: Genera logs en todos los niveles (debug, http, info, warning, error, fatal). Solo para validación interna.
 *     responses:
 *       200:
 *         description: Logs generados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Logs generados en todos los niveles. Revisá la consola y la carpeta /logs
 */
router.get("/test", (req, res) => {
  logger.debug("Mensaje de nivel debug");
  logger.http("Mensaje de nivel http");
  logger.info("Mensaje de nivel info");
  logger.warning("Mensaje de nivel warning");
  logger.error("Mensaje de nivel error");
  logger.fatal("Mensaje de nivel fatal");

  res.json({
    status: "success",
    message: "Logs generados en todos los niveles. Revisá la consola y la carpeta /logs",
  });
});

module.exports = router;