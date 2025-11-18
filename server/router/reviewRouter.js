import express from 'express';
import { body, validationResult } from 'express-validator';
import ApiError from '../exceptions/ApiError.js';
import authMiddleware from '../middleware/authMiddleware.js';
import controller from '../controller/reviewController.js';

const router = express.Router();

const validationError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors || !errors.isEmpty()) {
    throw ApiError.BadRequest('Validation failed', errors.array());
  }
  next();
};

const validateReview = [
  body('rating')
    .isFloat({ min: 0, max: 5 })
    .withMessage('Rating must be between 0 and 5'),
  body('review')
    .isString()
    .withMessage('Review must be a string')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Review must be between 10 and 1000 characters')
    .escape()
    .custom((value) => {
      const dangerous = /<\s*script/i.test(value) || /on\w+\s*=/.test(value);
      if (dangerous) {
        throw ApiError.BadRequest('Event handlers are not allowed');
      }
      return true;
    }),
];

const validateTypeId = [
  body('type').isString().withMessage('Type must be a string'),
  body('id').isNumeric().withMessage('Id must be a number'),
];

router.get('/user', authMiddleware, controller.getReviewsByUserId);

router.get('/:type/:movieId', controller.getReviewsByMovieId);

router.post(
  '/',
  authMiddleware,
  validateReview,
  validateTypeId,
  validationError,
  controller.addReview
);

router.put('/:reviewId', authMiddleware, controller.updateReview);

router.delete('/:reviewId', authMiddleware, controller.deleteReview);

export default router;
