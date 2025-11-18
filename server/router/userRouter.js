import express from 'express';
import { body, validationResult } from 'express-validator';
import authMiddleware from '../middleware/authMiddleware.js';
import controller from '../controller/userController.js';
import ApiError from '../exceptions/ApiError.js';

const router = express.Router();

const validateList = [
  body('type').isString().withMessage('Type must be a string'),
  body('id').isNumeric().withMessage('Id must be a number'),
  body('action').isString().withMessage('Action must be a string'),
];

const validationError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw ApiError.BadRequest('Validation failed', errors.array());
  }
  next();
};


router.put(
  '/favorite',
  authMiddleware,
  validateList,
  validationError,
  controller.updateFavorite
);

router.get('/favorite', authMiddleware, controller.getFavorites);


router.put(
  '/watchlist',
  authMiddleware,
  validateList,
  validationError,
  controller.updateWatchlist
);

router.get('/watchlist', authMiddleware, controller.getWatchlist);

export default router;
