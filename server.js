
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const morgan = require('morgan');
require('dotenv').config();

const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

app.use(helmet());
app.use(express.json());

if (process.env.VERCEL) {
    app.use(morgan(':date[iso] :method :url :status'));

    app.use(async (req, res, next) => {
        try {
            if (mongoose.connection.readyState !== 1) {
                await mongoose.connect(process.env.MONGODB_URI);
            }

            next();
        } catch (error) {
            console.error('MongoDB connection failed:', error.message);

            res.status(500).json({
                message: 'Database connection failed'
            });
        }
    });
} else {
    const logger = require('./utils/logger');
    app.use(logger);
}

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        message: 'Too many requests. Please try again later.'
    }
});

app.use('/api', apiLimiter);

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/emp', employeeRoutes);

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Employee Management API is running'
    });
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (!process.env.VERCEL) {
    const startServer = async () => {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    };

    startServer();
}

module.exports = app;
