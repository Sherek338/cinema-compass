import express from 'express';
import { body, validationResult } from 'express-validator';
import ApiError from '../exceptions/ApiError.js';
import authMiddleware from '../middleware/authMiddleware.js';
import controller from '../controller/reviewController.js';

const router = express.Router();

const validateReview = [
  body('review')
    .isString()
    .withMessage('Review must be a string')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Review must be between 10 and 1000 characters')
    .escape()
    .custom((value) => {
      if (/<script[^>]*>.*?<\/script>/gi.test(value)) {
        throw new ApiError.BadRequest('Script tags are not allowed');
      }
      if (/on\w+\s*=/gi.test(value)) {
        throw new ApiError.BadRequest('Event handlers are not allowed');
      }
      if (/javascript:/gi.test(value)) {
        throw new ApiError.BadRequest('JavaScript protocol is not allowed');
      }
      return true;
    }),
  body('rating')
    .isInt({ min: 0, max: 5 })
    .withMessage('Rating must be an integer between 0 and 5'),
];

const validationError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw ApiError.BadRequest('Validation failed', errors.array());
  }
  next();
};

router.get('/', authMiddleware, controller.getReviewsByUserId);
router.get('/:movieId', authMiddleware, controller.getReviewsByMovieId);
router.post(
  '/:movieId',
  authMiddleware,
  validateReview,
  validationError,
  controller.addReview
);
router.put(
  '/:reviewId',
  authMiddleware,
  validateReview,
  validationError,
  controller.updateReview
);
router.delete(
  '/:reviewId',
  authMiddleware,
  validateReview,
  validationError,
  controller.deleteReview
);

export default router;