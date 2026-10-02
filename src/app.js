const express = require("express");
const mongoose = require("mongoose");
const config = require("./config/env.config");

const productRoutes = require("./routes/product.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

// MongoDB
mongoose.connect(config.MONGODB_URI)
  .then(() => console.log("MongoDB conectado"))
  .catch((err) => console.error(err));

// Servidor
app.listen(config.PORT, () => console.log(`Servidor corriendo en puerto ${config.PORT}`));

module.exports = app;