const mongoose = require("mongoose");
const config = require("../src/config/env.config");

before(async function () {
  if (!config.MONGODB_URI.includes("_test")) {
    throw new Error("Los tests solo pueden correr contra una base de datos de test (_test)");
  }
  await mongoose.connect(config.MONGODB_URI);
});

after(async function () {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});