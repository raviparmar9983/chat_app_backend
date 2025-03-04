/* eslint-disable @typescript-eslint/no-unused-vars */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val: { message: string }) => val.message)
      .join(', ');
  } else if (err.code === 11000) {
    statusCode = 409;
    const key = Object.keys(err.keyValue)[0];
    message = `${key} already exists. Please use a different value.`;
  } else if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  } else if (err.errors && Array.isArray(err.errors)) {
    statusCode = 400;
    message = err.errors.map((error) => error.msg).join(', ');
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token, please log in again.';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired, please log in again.';
  }

  res.status(statusCode).json({
    success: false,
    message,
  });
};
export default errorHandler;
