const { Router } = require("express");
const uploadController = require("../controllers/upload.controller");
const { setUploadFolder, uploadSingle } = require("../config/multer");
const { UPLOAD_FOLDERS, FILE_FIELDS } = require("../constants");

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Uploads
 *   description: Carga de documentos de usuario y comprobantes de pedidos/entregas (Multer)
 */

/**
 * @swagger
 * /api/uploads/users/{id}/documents:
 *   post:
 *     summary: Subir un documento de usuario
 *     tags: [Uploads]
 *     description: Archivos permitidos PDF, JPG o PNG, de hasta 2 MB. Se guarda en uploads/documents y los metadatos quedan en el usuario.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [document]
 *             properties:
 *               document:
 *                 type: string
 *                 format: binary
 *                 description: Archivo a subir (el campo debe llamarse "document")
 *               documentType:
 *                 type: string
 *                 enum: [dni, license, address_proof, other]
 *                 description: Tipo de documento (opcional, por defecto "other")
 *     responses:
 *       201:
 *         description: Documento cargado. Devuelve el usuario con sus documentos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Archivo requerido (FILE_REQUIRED), tipo inválido (FILE_INVALID_TYPE), campo incorrecto (FILE_INVALID_FIELD) o tipo de documento inválido (DOCUMENT_TYPE_INVALID)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado (USER_NOT_FOUND)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       413:
 *         description: Archivo mayor a 2 MB (FILE_TOO_LARGE)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error al guardar el archivo (FILE_SAVE_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/users/:id/documents",
  setUploadFolder(UPLOAD_FOLDERS.DOCUMENTS),
  uploadSingle(FILE_FIELDS.DOCUMENT),
  uploadController.uploadUserDocument
);

/**
 * @swagger
 * /api/uploads/receipts/{entity}/{id}:
 *   post:
 *     summary: Subir un comprobante asociado a un pedido o una entrega
 *     tags: [Uploads]
 *     description: Archivos permitidos PDF, JPG o PNG, de hasta 2 MB. Se guarda en uploads/receipts y los metadatos quedan en la entidad.
 *     parameters:
 *       - in: path
 *         name: entity
 *         required: true
 *         schema:
 *           type: string
 *           enum: [orders, deliveries]
 *         description: Tipo de entidad a la que se asocia el comprobante
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pedido o de la entrega
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [receipt]
 *             properties:
 *               receipt:
 *                 type: string
 *                 format: binary
 *                 description: Archivo a subir (el campo debe llamarse "receipt")
 *     responses:
 *       201:
 *         description: Comprobante asociado. Devuelve la entidad con sus comprobantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Archivo requerido (FILE_REQUIRED), tipo inválido (FILE_INVALID_TYPE), campo incorrecto (FILE_INVALID_FIELD) o entidad inválida (UPLOAD_INVALID_ENTITY)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Pedido o entrega no encontrado (ORDER_NOT_FOUND / DELIVERY_NOT_FOUND)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       413:
 *         description: Archivo mayor a 2 MB (FILE_TOO_LARGE)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error al guardar el archivo (FILE_SAVE_ERROR)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  "/receipts/:entity/:id",
  setUploadFolder(UPLOAD_FOLDERS.RECEIPTS),
  uploadSingle(FILE_FIELDS.RECEIPT),
  uploadController.uploadReceipt
);

module.exports = router;