const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
require("dotenv").config();
const httpStatusCode = require("http-status-codes");
const { CustomError } = require("../utils/customError");

exports.authMiddleware = async (req, res, next) => {
  if (!req.header("Authorization")) {
    return next(
      new CustomError(
        "Authorization header is missing",
        httpStatusCode.StatusCodes.UNAUTHORIZED
      )
    );
  }
  const token = req.header("Authorization").replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.status(httpStatusCode.StatusCodes.UNAUTHORIZED).send(error.message);
    console.log(error);
  }
};
