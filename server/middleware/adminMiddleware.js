import ApiError from '../exceptions/ApiError.js';

const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      throw ApiError.Unauthorized('User not authenticated');
    }

    if (!req.user.isAdmin) {
      throw ApiError.Forbidden('Admin access required');
    }

    next();
  } catch (e) {
    next(e);
  }
};

export default adminMiddleware;
