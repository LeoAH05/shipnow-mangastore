const fs = require("fs/promises");

const removeFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    // Si el archivo ya no existe, no hay nada que hacer
  }
};

module.exports = { removeFile };