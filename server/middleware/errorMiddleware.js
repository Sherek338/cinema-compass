import ApiError from '../exceptions/ApiError.js';

function errorMiddleware(err, req, res, next) {
  if (err instanceof ApiError) {
    if (err.status >= 500) {
      console.error(err);
    }
    return res.status(err.status).json({
      message: err.message,
      errors: err.errors || [],
    });
  }

  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.errors || [];

  return res.status(status).json({ message, errors });
}

export default errorMiddleware;