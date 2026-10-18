
const express = require('express');
const { body } = require('express-validator');
const { signup } = require('../controllers/userController');

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

module.exports = router;