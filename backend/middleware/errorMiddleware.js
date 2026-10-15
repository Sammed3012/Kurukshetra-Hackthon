/* global process */
export const errorHandler = (err, req, res, _next) => { // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: err.message || 'Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
