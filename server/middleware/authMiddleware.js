import tokenService from '../services/tokenService.js';

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  let userData = tokenService.verifyToken(token, 'access');

  if (!userData) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  req.user = userData;
  next();
};

export default authMiddleware;
