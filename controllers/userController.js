
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const signup = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Invalid user information',
                errors: errors.array()
            });
        }

        const { username, email, password } = req.body;

        const existingUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (existingUser) {
            return res.status(409).json({
                message: 'Username or email already exists'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: 'Username or email already exists'
            });
        }

        console.error('Signup failed:', error.message);

        res.status(500).json({
            message: 'Server error'
        });
    }
};

const login = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if ((!username && !email) || !password) {
            return res.status(400).json({
                message: 'Username or email and password are required'
            });
        }

        const user = await User.findOne({
            $or: [
                { username: username || '' },
                { email: email || '' }
            ]
        }).select('+password');

        if (!user) {
            return res.status(401).json({
                message: 'Invalid login credentials'
            });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({
                message: 'Invalid login credentials'
            });
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token: token
        });

    } catch (error) {
        console.error('Login failed:', error.message);

        res.status(500).json({
            message: 'Server error'
        });
    }
};

module.exports = { signup, login };
