const { Router } = require("express");
const logger = require("../config/logger");

const router = Router();


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