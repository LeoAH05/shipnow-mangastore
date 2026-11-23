const ENV_FILES = { test: ".env.test", production: ".env.production" };
require("dotenv").config({ path: ENV_FILES[process.env.NODE_ENV] || ".env" });

const VALID_ENVS = ["development", "test", "production"];
const VALID_LOG_LEVELS = ["fatal", "error", "warning", "info", "http", "debug"];
const DEFAULT_LOG_LEVEL = { development: "debug", test: "warning", production: "info" };


const requiredVars = ["PORT", "MONGODB_URI", "NODE_ENV"];
const missing = requiredVars.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(`❌ Variable de entorno faltante: ${missing.join(", ")}. La aplicación no puede arrancar.`);
}

const { PORT, MONGODB_URI, NODE_ENV } = process.env;

if (!VALID_ENVS.includes(NODE_ENV)) {
  throw new Error(`❌ NODE_ENV inválido: "${NODE_ENV}". Valores permitidos: ${VALID_ENVS.join(", ")}.`);
}
if (!Number.isInteger(Number(PORT)) || Number(PORT) < 1 || Number(PORT) > 65535) {
  throw new Error(`❌ PORT inválido: "${PORT}". Debe ser un número entre 1 y 65535.`);
}

const LOG_LEVEL = process.env.LOG_LEVEL || DEFAULT_LOG_LEVEL[NODE_ENV];
if (!VALID_LOG_LEVELS.includes(LOG_LEVEL)) {
  throw new Error(`❌ LOG_LEVEL inválido: "${LOG_LEVEL}". Valores permitidos: ${VALID_LOG_LEVELS.join(", ")}.`);
}

const config = Object.freeze({
  PORT: Number(PORT),
  MONGODB_URI,
  NODE_ENV,
  LOG_LEVEL,
  UPLOADS_DIR: process.env.UPLOADS_DIR || "uploads",
  PUBLIC_URL: process.env.PUBLIC_URL || `http://localhost:${PORT}`,
  
  ENABLE_SWAGGER:
    process.env.ENABLE_SWAGGER !== undefined
      ? process.env.ENABLE_SWAGGER === "true"
      : NODE_ENV !== "production",
});

module.exports = config;