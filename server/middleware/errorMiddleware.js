const errorMiddleware = (err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const errors = err.errors || [];

  return res.status(status).json({ message, errors });
};

export default errorMiddleware;
