import ApiError from "../exceptions/ApiError.js";

export default function errorMiddleware(err, req, res, next) {
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
  return res.status(500).json({
    message: "Unexpected error",
  });
}
