const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  due_date: { type: Date, default: Date.now },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "medium",
  },
  assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: {
    type: String,
    enum: ["pending", "review", "completed"],
    default: "pending",
  },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  shared_with: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

taskSchema.pre("findOneAndUpdate", function (next) {
  this.updated_at = Date.now();
  next();
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
