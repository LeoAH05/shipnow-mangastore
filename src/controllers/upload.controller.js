const uploadService = require("../services/upload.service");

class UploadController {
  async uploadUserDocument(req, res, next) {
    try {
      const user = await uploadService.attachUserDocument(
        req.params.id,
        req.file,
        req.body?.documentType
      );
      res.status(201).json({ status: "success", payload: user });
    } catch (error) {
      next(error);
    }
  }

  async uploadReceipt(req, res, next) {
    try {
      const entity = await uploadService.attachReceipt(
        req.params.entity,
        req.params.id,
        req.file
      );
      res.status(201).json({ status: "success", payload: entity });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UploadController();