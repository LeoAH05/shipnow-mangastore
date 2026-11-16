const express = require("express");
const swaggerUi = require("swagger-ui-express");
const logger = require("./config/logger");
const swaggerSpec = require("./config/swagger");

const productRoutes = require("./routes/product.routes");
const userRoutes = require("./routes/user.routes");
const orderRoutes = require("./routes/order.routes");
const deliveryRoutes = require("./routes/delivery.routes");
const mockRouter = require("./mocks/mock.router");
const loggerRouter = require("./routes/logger.routes");
const errorHandler = require("./middlewares/errorHandler");

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/deliveries", deliveryRoutes);
app.use("/api/mocks", mockRouter);
app.use("/api/logger", loggerRouter);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use((req, res, next) => {
  logger.warning(`Ruta no encontrada: ${req.method} ${req.url}`);
  res.status(404).json({
    status: "error",
    errorCode: "ROUTE_NOT_FOUND",
    message: "Ruta no encontrada",
  });
});


app.use(errorHandler);

module.exports = app;