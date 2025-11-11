import express from 'express';
import { body, validationResult } from 'express-validator';
import controller from '../controller/authController.js';
import ApiError from '../exceptions/ApiError.js';

const router = express.Router();

const usernameValidation = body('username')
  .trim()
  .isLength({ min: 3, max: 20 })
  .withMessage('Username must be between 3 and 20 characters');

const emailValidation = body('email')
  .trim()
  .isEmail()
  .withMessage('Invalid email format');

const passwordValidation = body('password')
  .isLength({ min: 6, max: 56 })
  .withMessage('Password must be between 6 and 56 characters')
  .isAlphanumeric()
  .withMessage('Password must contain only letters and numbers');

const validationError = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw ApiError.BadRequest('Validation failed', errors.array());
  }
  next();
};

router.post('/login', [emailValidation, passwordValidation], validationError, controller.login);
router.post('/registration', [usernameValidation, emailValidation, passwordValidation], validationError, controller.registration);
router.post('/logout', controller.logout);
router.get('/activate/:link', controller.activate);
router.get('/refresh', controller.refresh);

router.post('/send-mail', [emailValidation], validationError, controller.sendMail);

export default router;
