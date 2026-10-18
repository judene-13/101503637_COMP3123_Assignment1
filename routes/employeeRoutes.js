
const express = require('express');
const { body, param, query } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');

const {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
} = require('../controllers/employeeController');

const router = express.Router();

router.use(authMiddleware);

const employeeValidation = [
    body('first_name').isString().trim().isLength({ min: 1, max: 50 }),
    body('last_name').isString().trim().isLength({ min: 1, max: 50 }),
    body('email').isEmail().normalizeEmail(),
    body('position').isString().trim().isLength({ min: 1, max: 100 }),
    body('salary').isFloat({ min: 0 }),
    body('date_of_joining').isISO8601({ strict: true }).toDate(),
    body('department').isString().trim().isLength({ min: 1, max: 100 })
];

router.get('/employees', getEmployees);

router.post('/employees', employeeValidation, createEmployee);

router.get('/employees/:eid',
    param('eid').isMongoId(),
    getEmployeeById
);

router.put('/employees/:eid',
    param('eid').isMongoId(),
    employeeValidation,
    updateEmployee
);

router.delete('/employees',
    query('eid').isMongoId(),
    deleteEmployee
);

module.exports = router;
