const { StatusCodes } = require("http-status-codes");
const Notification = require("../models/notification.model");
const { CustomError, NotFoundError } = require("../utils/customError");

exports.getNotifications = async (req, res, next) => {
  try {
    const notification = await Notification.find({ user: req.user.id }).sort({
      created_at: -1,
    });
    if (!notification) {
      return next(new NotFoundError("You have no notification"));
    }
    res.status(StatusCodes.OK).send(notification);
  } catch (error) {
    next(
      new CustomError(
        "Error while loading Notification",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};

exports.markAsRead = async (req, res, next) => {
  const { id } = req.params;
  try {
    const notification = await Notification.findByIdAndUpdate(
      id,
      { read: true },
      { new: true }
    );
    if (!notification) {
      return next(new NotFoundError("Notification not found"));
    }
    res.status(StatusCodes.OK).send(notification);
  } catch (error) {
    return next(
      new CustomError(
        "Error while updating notification",
        StatusCodes.INTERNAL_SERVER_ERROR
      )
    );
  }
};
