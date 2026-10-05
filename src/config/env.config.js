require("dotenv").config();

const config = {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV,
};


const requiredVars = ["PORT", "MONGODB_URI", "NODE_ENV"];
requiredVars.forEach((key) => {
  if (!config[key]) {
    throw new Error(`❌ Variable de entorno faltante: ${key}. La aplicación no puede arrancar.`);
  }
});

module.exports = config;