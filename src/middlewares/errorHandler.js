const CustomError = require("../errors/CustomError");

const errorHandler = (err, req, res, next) => {
  console.error(`[ERROR] ${err.errorCode || "UNKNOWN"}: ${err.message}`);

  if (err instanceof CustomError) {
    return res.status(err.statusCode).json({
      status: "error",
      errorCode: err.errorCode,
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    errorCode: "INTERNAL_SERVER_ERROR",
    message: "Error interno del servidor",
  });
};

module.exports = errorHandler;