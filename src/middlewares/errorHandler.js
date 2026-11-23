const CustomError = require("../errors/CustomError");
const ErrorDictionary = require("../errors/errorDictionary");
const logger = require("../config/logger");

const errorHandler = (err, req, res, next) => {
  // Errores del parser de Express -> errores del proyecto
  let error = err;
  if (err.type === "entity.too.large") error = ErrorDictionary.PAYLOAD_TOO_LARGE();
  else if (err.type === "entity.parse.failed") error = ErrorDictionary.INVALID_JSON();

  if (error instanceof CustomError) {
    logger.warning(`[${error.errorCode}] ${error.message}`);
    return res.status(error.statusCode).json({
      status: "error",
      errorCode: error.errorCode,
      message: error.message,
    });
  }

  logger.error(`Error inesperado: ${err.message}`);
  return res.status(500).json({
    status: "error",
    errorCode: "INTERNAL_SERVER_ERROR",
    message: "Error interno del servidor",
  });
};

module.exports = errorHandler;