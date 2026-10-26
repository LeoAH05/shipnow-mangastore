const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/env.config");
const logger = require("./config/logger");

const productRoutes = require("./routes/product.routes");
const userRoutes = require("./routes/user.routes");
const mockRouter = require("./mocks/mock.router");
const loggerRouter = require("./routes/logger.routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/mocks", mockRouter);
app.use("/api/logger", loggerRouter);


app.use((req, res, next) => {
  logger.warning(`Ruta no encontrada: ${req.method} ${req.url}`);
  res.status(404).json({ status: "error", message: "Ruta no encontrada" });
});


app.use(errorHandler);


mongoose.connect(config.MONGODB_URI)
  .then(() => logger.info("Conexión a MongoDB establecida"))
  .catch((err) => {
    logger.fatal(`Error al conectar con MongoDB: ${err.message}`);
    process.exit(1);
  });


app.listen(config.PORT, () => 
  logger.info(`Servidor ShipNow escuchando en el puerto ${config.PORT}`)
);

module.exports = app;