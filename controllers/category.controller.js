const Category = require("../models/category.model");
const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const {
  BadRequestError,
  CustomError,
  NotFoundError,
} = require("../utils/customError");

exports.createCategory = async (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return next(new BadRequestError("Category name is required"));
  }

  try {
    const category = new Category({
      name,
      created_at: Date.now(),
      created_by: req.user.id,
    });
    await category.save();

    res
      .status(StatusCodes.CREATED)
      .send({ message: ReasonPhrases.CREATED, category });
  } catch (error) {
    next(
      new CustomError(
        "An error occurred while creating the category.",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};
exports.getCategory = async (req, res, next) => {
  try {
    const categories = await Category.find({ created_by: req.user.id });
    if (!categories) return next(new NotFoundError("Category not Found"));
    return res.send(categories);
  } catch (error) {
    next(new Error(error));
  }
};
/***
 * @param
 */
exports.updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const name = req.body;
  try {
    const category = await Category.findOneAndUpdate(
      { _id: id, created_by: req.user.id },
      name,
      { new: true }
    );
    if (!category) return next(new NotFoundError("Category not found"));
    res.send(category);
  } catch (error) {
    return next(
      new CustomError(error.message, ReasonPhrases.INTERNAL_SERVER_ERROR)
    );
  }
};

exports.deleteCategory = async (req, res, next) => {
  const { id } = req.params;
  try {
    const category = await Category.findOneAndDelete({
      _id: id,
      created_by: req.user.id,
    });
    if (!category) return next(new NotFoundError("Category not found"));
    res.send({ message: "category deleted successfully" });
  } catch (error) {
    return next(
      new CustomError(error.message, ReasonPhrases.INTERNAL_SERVER_ERROR)
    );
  }
};
