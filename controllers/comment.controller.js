const { StatusCodes } = require("http-status-codes");
const Comment = require("../models/comment.model");
const Task = require("../models/task.model");
const { NotFoundError, CustomError } = require("../utils/customError");

exports.addComment = async (req, res, next) => {
  const { taskId } = req.params;
  const { text } = req.body;
  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return next(new NotFoundError("Task not found"));
    }
    const comment = new Comment({
      text,
      task: taskId,
      created_by: req.user.id,
    });
    await comment.save();
    res
      .status(StatusCodes.CREATED)
      .send({ message: "comment successfully added", data: comment });
  } catch (error) {
    return next(
      new CustomError(
        "Error while adding comment",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

exports.getComments = async (req, res, next) => {
  const { taskId } = req.params;
  try {
    const comments = await Comment.find({ task: taskId }).populate(
      "created_by",
      "name -_id"
    );
    if (!comments || comments.length === 0) {
      return next(new NotFoundError("no comments found for this task"));
    }
    res.send(comments);
  } catch (error) {
    return next(
      new CustomError(
        "Error while fetching comments",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};
