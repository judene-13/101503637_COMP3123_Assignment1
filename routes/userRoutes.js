
const express = require('express');
const { body } = require('express-validator');
const { signup, login } = require('../controllers/userController');

const router = express.Router();

router.post('/signup', [
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

router.post('/login', [
    body('password')
        .isString()
        .notEmpty()
], login);

module.exports = router;
