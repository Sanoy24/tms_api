const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

commentSchema.pre("findOneAndUpdate", function (next) {
  this.updated_at = Date.now();
  next();
});

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
