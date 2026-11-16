const mongoose = require("mongoose");
const { ROLES } = require("../constants");
const fileMetadataSchema = require("./fileMetadata.schema");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: Object.values(ROLES),
    default: ROLES.USER,
  },
  documents: { type: [fileMetadataSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);