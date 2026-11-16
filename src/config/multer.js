const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const config = require("./env.config");
const logger = require("./logger");
const CustomError = require("../errors/CustomError");
const ErrorDictionary = require("../errors/errorDictionary");
const { FILE_RULES } = require("../constants");

const UPLOADS_ROOT = path.resolve(process.cwd(), config.UPLOADS_DIR);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(UPLOADS_ROOT, req.uploadFolder);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  if (!FILE_RULES.ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    logger.warning(`Intento de subir tipo no permitido: ${file.mimetype} (${file.originalname})`);
    return cb(ErrorDictionary.FILE_INVALID_TYPE());
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: FILE_RULES.MAX_SIZE_BYTES, files: 1 },
});

// Define en qué subcarpeta de uploads se guarda (la usa "destination")
const setUploadFolder = (folder) => (req, res, next) => {
  req.uploadFolder = folder;
  next();
};

// Traduce los errores de Multer al sistema de errores centralizado
const uploadSingle = (fieldName) => (req, res, next) => {
  upload.single(fieldName)(req, res, (err) => {
    if (!err) return next();

    if (err instanceof CustomError) return next(err);

    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        logger.warning(`Archivo demasiado grande en el campo "${fieldName}"`);
        return next(ErrorDictionary.FILE_TOO_LARGE());
      }
      if (err.code === "LIMIT_UNEXPECTED_FILE") {
        return next(ErrorDictionary.FILE_INVALID_FIELD());
      }
    }

    logger.error(`Error al subir archivo: ${err.message}`);
    return next(ErrorDictionary.FILE_SAVE_ERROR());
  });
};

module.exports = { setUploadFolder, uploadSingle };