import express from 'express';
import controller from '../controller/authController.js';

const router = express.Router();

router.post('/login', controller.login);
router.post('/registration', controller.registration);
router.post('/logout', controller.logout);
router.get('/activate/:link', controller.activate);
router.get('/refresh', controller.refresh);

export default router;
