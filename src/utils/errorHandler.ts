import AppError from "../errors/AppError"

const errorHandler = (err, req, res, next) => {
  let status = 500;
  let message = "Internal Server Error";

  if (err instanceof AppError) {
    status = err.status;
    message = err.message;
  }

  res.status(status).json({
    success: false,
    error: message,
  });
};
export default errorHandler;
