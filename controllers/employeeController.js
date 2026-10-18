
const Employee = require('../models/Employee');
const { validationResult, matchedData } = require('express-validator');

const createEmployee = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Invalid employee information',
                errors: errors.array()
            });
        }

        const employeeData = matchedData(req);

        const employee = new Employee({
            ...employeeData,
            user: req.user._id
        });

        await employee.save();

        res.status(201).json({
            message: 'Employee created successfully',
            employee: employee
        });

    } catch (error) {
        console.error('Create employee failed:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({
            user: req.user._id
        });

        res.status(200).json({
            employees: employees
        });

    } catch (error) {
        console.error('Get employees failed:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const getEmployeeById = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Invalid employee ID',
                errors: errors.array()
            });
        }

        const employee = await Employee.findOne({
            _id: req.params.eid,
            user: req.user._id
        });

        if (!employee) {
            return res.status(404).json({
                message: 'Employee not found'
            });
        }

        res.status(200).json({
            employee: employee
        });

    } catch (error) {
        console.error('Get employee failed:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateEmployee = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Invalid employee information',
                errors: errors.array()
            });
        }

        const employeeData = matchedData(req, {
            locations: ['body']
        });

        const employee = await Employee.findOneAndUpdate(
            {
                _id: req.params.eid,
                user: req.user._id
            },
            { $set: employeeData },
            {
                new: true,
                runValidators: true
            }
        );

        if (!employee) {
            return res.status(404).json({
                message: 'Employee not found'
            });
        }

        res.status(200).json({
            message: 'Employee updated successfully',
            employee: employee
        });

    } catch (error) {
        console.error('Update employee failed:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

const deleteEmployee = async (req, res) => {
    try {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Invalid employee ID',
                errors: errors.array()
            });
        }

        const employee = await Employee.findOneAndDelete({
            _id: req.query.eid,
            user: req.user._id
        });

        if (!employee) {
            return res.status(404).json({
                message: 'Employee not found'
            });
        }

        res.status(204).send();

    } catch (error) {
        console.error('Delete employee failed:', error.message);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    createEmployee,
    getEmployees,
    getEmployeeById,
    updateEmployee,
    deleteEmployee
};
