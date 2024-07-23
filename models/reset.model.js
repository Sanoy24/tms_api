const mongoose = require("mongoose");

const restTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: "1h" },
});

const ResetToken = mongoose.model("ResetToken", restTokenSchema);
module.exports = ResetToken;
