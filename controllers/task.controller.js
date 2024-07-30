const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const Task = require("../models/task.model");
const { NotFoundError, CustomError } = require("../utils/customError");

exports.createTask = async (req, res) => {
  const { title, description, due_date, priority, assigned_to, category } =
    req.body;
  const task = new Task({
    title,
    description,
    due_date,
    priority,
    assigned_to,
    created_by: req.user.id,
    category,
  });
  try {
    await task.save();
    res.status(StatusCodes.OK).send({ message: ReasonPhrases.OK, task });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).send(error.message);
    console.log(error.message);
  }
};

exports.getTasks = async (req, res, next) => {
  const { category, due_date, priority } = req.query;
  const filter = { created_by: req.user.id };
  if (category) filter.category = decodeURIComponent(category);
  if (due_date) filter.due_date = { $lte: new Date(due_date) };
  if (priority) filter.priority = priority;
  try {
    const tasks = await Task.find(filter)
      .select(
        "title description due_date priority status category assigned_to -_id"
      )
      .populate({
        path: "assigned_to",
        select: "name email -_id",
      })
      .populate({
        path: "category",
        select: "name -_id",
      });
    if (!tasks.length) {
      return next(new NotFoundError("Resource not found"));
    }
    res.send(tasks);
  } catch (error) {
    next(
      new CustomError(
        ReasonPhrases.INTERNAL_SERVER_ERROR,
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

exports.updateTask = async (req, res, next) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const task = await Task.findByIdAndUpdate(
      {
        _id: id,
        created_by: req.user.id,
      },
      updates,
      { new: true }
    );
    if (!task) {
      return next(new NotFoundError("task not found"));
    }
    res.send(task);
  } catch (error) {
    return next(new Error(error));
  }
};
exports.deleteTask = async (req, res, next) => {
  const { id } = req.params;
  try {
    const task = await Task.findOneAndDelete({
      _id: id,
      created_by: req.user.id,
    });
    if (!task) {
      return next(new NotFoundError("task does not exist"));
    }
    res.send("task deleted successfully");
  } catch (error) {
    return next(new Error(error));
  }
};
exports.updateStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const task = await Task.findOneAndUpdate(
      { _id: id, created_by: req.user.id },
      { status },
      { new: true }
    );
    if (!task) {
      return next(new NotFoundError("task not found"));
    }
    res.send(task);
  } catch (error) {
    return next(new Error(error));
  }
};
