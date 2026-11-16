const mongoose = require("mongoose");
const config = require("./config/env.config");
const logger = require("./config/logger");
const app = require("./app");

mongoose.connect(config.MONGODB_URI)
  .then(() => logger.info("Conexión a MongoDB establecida"))
  .catch((err) => {
    logger.fatal(`Error al conectar con MongoDB: ${err.message}`);
    process.exit(1);
  });

app.listen(config.PORT, () =>
  logger.info(`Servidor ShipNow escuchando en el puerto ${config.PORT}`)
);