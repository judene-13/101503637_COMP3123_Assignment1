
const express = require('express');
const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');

const { signup, login } = require('../controllers/userController');

const router = express.Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        message: 'Too many login or signup attempts. Try again in 15 minutes.'
    }
});

router.post('/signup', authLimiter, [
    body('username')
        .isString()
        .trim()
        .isLength({ min: 3, max: 30 }),

    body('email')
        .isEmail()
        .normalizeEmail(),

    body('password')
        .isString()
        .isLength({ min: 8, max: 128 })
], signup);

router.post('/login', authLimiter, [
    body('password')
        .isString()
        .notEmpty()
], login);

module.exports = router;
