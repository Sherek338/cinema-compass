import express from 'express';
import controller from '../controller/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', controller.login);
router.post('/registration', controller.registration);
router.post('/logout', controller.logout);
router.get('/activate/:link', controller.activate);
router.get('/refresh', controller.refresh);

router.get('/all', authMiddleware, controller.refresh);

export default router;
