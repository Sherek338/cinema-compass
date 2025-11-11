import jwt from 'jsonwebtoken';
import ApiError from '../exceptions/ApiError.js';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw ApiError.Unauthorized();
    }

    const accessToken = authHeader.split(' ')[1];
    let userData = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);

    req.user = userData;
    next();
  } catch (e) {
    next(e);
  }
};

export default authMiddleware;