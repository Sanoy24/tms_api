const { StatusCodes, ReasonPhrases } = require("http-status-codes");
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.contructor);
  }
}

class NotFoundError extends CustomError {
  constructor(message = ReasonPhrases.NOT_FOUND) {
    super(message, StatusCodes.NOT_FOUND);
  }
}

class BadRequestError extends CustomError {
  constructor(message = ReasonPhrases.BAD_REQUEST) {
    super(message, StatusCodes.BAD_REQUEST);
  }
}

module.exports = {
  CustomError,
  NotFoundError,
  BadRequestError,
};
