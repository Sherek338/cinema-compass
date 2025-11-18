import express from 'express';
import { body, validationResult } from 'express-validator';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
import localMediaController from '../controller/localMediaController.js';
import bannedMediaController from '../controller/bannedMediaController.js';
import ApiError from '../exceptions/ApiError.js';

const router = express.Router();

const validationError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw ApiError.BadRequest('Validation failed', errors.array());
  }
  next();
};

const validateLocalMedia = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Title must be between 1 and 500 characters'),
  body('media_type')
    .notEmpty()
    .withMessage('Media type is required')
    .isIn(['movie', 'tv'])
    .withMessage('Media type must be movie or tv'),
  body('overview')
    .optional()
    .isString()
    .withMessage('Overview must be a string'),
  body('poster_path')
    .optional()
    .isString()
    .withMessage('Poster path must be a string'),
  body('backdrop_path')
    .optional()
    .isString()
    .withMessage('Backdrop path must be a string'),
  body('vote_average')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('Vote average must be between 0 and 10'),
];

const validateBanned = [
  body('tmdbId')
    .notEmpty()
    .withMessage('TMDB ID is required')
    .isInt({ min: 1 })
    .withMessage('TMDB ID must be a positive integer'),
  body('media_type')
    .notEmpty()
    .withMessage('Media type is required')
    .isIn(['movie', 'tv'])
    .withMessage('Media type must be movie or tv'),
  body('reason').optional().isString().withMessage('Reason must be a string'),
];

router.get(
  '/local/media',
  authMiddleware,
  adminMiddleware,
  localMediaController.getAll
);
router.get(
  '/local/media/:id',
  authMiddleware,
  adminMiddleware,
  localMediaController.getById
);
router.post(
  '/local/media',
  authMiddleware,
  adminMiddleware,
  validateLocalMedia,
  validationError,
  localMediaController.create
);
router.put(
  '/local/media/:id',
  authMiddleware,
  adminMiddleware,
  validateLocalMedia,
  validationError,
  localMediaController.update
);
router.delete(
  '/local/media/:id',
  authMiddleware,
  adminMiddleware,
  localMediaController.remove
);

router.get(
  '/banned',
  authMiddleware,
  adminMiddleware,
  bannedMediaController.getAll
);
router.post(
  '/banned',
  authMiddleware,
  adminMiddleware,
  validateBanned,
  validationError,
  bannedMediaController.add
);
router.delete(
  '/banned',
  authMiddleware,
  adminMiddleware,
  validateBanned,
  validationError,
  bannedMediaController.remove
);

export default router;
