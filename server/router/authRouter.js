const express = require('express');
const router = express.Router();

const controller = require('../controller/authController');

router.post('/login', controller.login);
router.post('/registration', controller.registration);
router.post('/logout', controller.logout);
router.get('/activate/:link', controller.activate);
router.get('/refresh', controller.refresh);

module.exports = router;
