const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  created_by: { type: mongoose.Schema.Types.ObjectId, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

categorySchema.pre("save", function (next) {
  this.updated_at = Date.now();
  next();
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
