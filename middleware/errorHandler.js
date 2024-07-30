const { StatusCodes, ReasonPhrases } = require("http-status-codes");
const { CustomError } = require("../utils/customError");
require("dotenv").config();

const errorHandler = async (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === "development";

  let stripAnsi;
  try {
    stripAnsi = (await import("strip-ansi")).default;
  } catch (error) {
    console.error("Error importing strip-ansi:", error);
  }

  if (err instanceof CustomError) {
    // if (isDev && stripAnsi) {
    //   console.error("CustomError:", err.message);
    //   console.error(stripAnsi(err.stack));
    // }
    return res.status(err.statusCode).json({
      status: "error",
      statusCode: err.statusCode,
      message: err.message,
      ...(isDev && {
        stack: stripAnsi(err.stack),
      }),
    });
  }

  if (isDev && stripAnsi) {
    console.error("Error occurred:", err.message);
    console.error(stripAnsi(err.stack));
  }

  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: "error",
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    message: ReasonPhrases.INTERNAL_SERVER_ERROR,
    ...(isDev && { stack: stripAnsi(err.stack) }),
  });
};

module.exports = errorHandler;
