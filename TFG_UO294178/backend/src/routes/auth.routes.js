const express = require('express');
const authController = require('../controllers/auth.controller');
const { loginLimiter } = require('../middlewares/rate-limit.middleware');

const router = express.Router();

router.post('/login', loginLimiter, authController.login);
router.post('/register', authController.register);
router.post('/logout', authController.logout);
router.get('/me', authController.me);

module.exports = router;