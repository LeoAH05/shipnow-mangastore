const CustomError = require("../errors/CustomError");
const logger = require("../config/logger");

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    logger.warning(`[${err.errorCode}] ${err.message}`);
    return res.status(err.statusCode).json({
      status: "error",
      errorCode: err.errorCode,
      message: err.message,
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