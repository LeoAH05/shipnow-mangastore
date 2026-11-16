const path = require("path");
const userRepository = require("../repositories/user.repository");
const orderRepository = require("../repositories/order.repository");
const deliveryRepository = require("../repositories/delivery.repository");
const CustomError = require("../errors/CustomError");
const ErrorDictionary = require("../errors/errorDictionary");
const { USER_DOCUMENT_TYPES, RECEIPT_TYPE } = require("../constants");
const { removeFile } = require("../utils/files");
const logger = require("../config/logger");

const RECEIPT_ENTITIES = {
  orders: { repository: orderRepository, notFound: ErrorDictionary.ORDER_NOT_FOUND },
  deliveries: { repository: deliveryRepository, notFound: ErrorDictionary.DELIVERY_NOT_FOUND },
};

// Solo se guardan metadatos, nunca el archivo en la base
const buildMetadata = (file, documentType) => ({
  originalName: file.originalname,
  storedName: file.filename,
  path: path.relative(process.cwd(), file.path).replace(/\\/g, "/"),
  mimeType: file.mimetype,
  size: file.size,
  documentType,
});

class UploadService {
  // Si algo falla, borra el archivo ya guardado y responde con el error del proyecto
  async failWith(error, file) {
    if (file) await removeFile(file.path);
    if (error instanceof CustomError) throw error;
    logger.error(`Error al guardar archivo: ${error.message}`);
    throw ErrorDictionary.FILE_SAVE_ERROR();
  }

  async attachUserDocument(userId, file, documentType = USER_DOCUMENT_TYPES.OTHER) {
    try {
      if (!file) throw ErrorDictionary.FILE_REQUIRED();
      if (!Object.values(USER_DOCUMENT_TYPES).includes(documentType)) {
        throw ErrorDictionary.DOCUMENT_TYPE_INVALID();
      }

      const user = await userRepository.getById(userId);
      if (!user) throw ErrorDictionary.USER_NOT_FOUND();

      const updatedUser = await userRepository.addDocument(userId, buildMetadata(file, documentType));
      logger.info(`Documento cargado correctamente: usuario ${userId}, tipo ${documentType}, archivo ${file.filename}`);
      return updatedUser;
    } catch (error) {
      await this.failWith(error, file);
    }
  }

  async attachReceipt(entity, entityId, file) {
    try {
      if (!Object.hasOwn(RECEIPT_ENTITIES, entity)) throw ErrorDictionary.UPLOAD_INVALID_ENTITY();
      if (!file) throw ErrorDictionary.FILE_REQUIRED();

      const target = RECEIPT_ENTITIES[entity];
      const found = await target.repository.getById(entityId);
      if (!found) throw target.notFound();

      const updated = await target.repository.addReceipt(entityId, buildMetadata(file, RECEIPT_TYPE));
      logger.info(`Comprobante asociado: ${entity} ${entityId}, archivo ${file.filename}`);
      return updated;
    } catch (error) {
      await this.failWith(error, file);
    }
  }
}

module.exports = new UploadService();