const express = require('express');
const { body, validationResult } = require('express-validator');
const Employee = require('../models/Employee');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all employees
router.get('/', auth, async (req, res) => {
  try {
    const employees = await Employee.find();
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employees' });
  }
});

// Get single employee
router.get('/:id', auth, async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee' });
  }
});

// Create new employee
router.post('/',
  auth,
  authorize('admin', 'manager'),
  [
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('department').trim().notEmpty(),
    body('position').trim().notEmpty(),
    body('salary').isNumeric(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const employee = new Employee(req.body);
      await employee.save();
      res.status(201).json(employee);
    } catch (error) {
      res.status(500).json({ message: 'Error creating employee' });
    }
  }
);

// Update employee
router.put('/:id',
  auth,
  authorize('admin', 'manager'),
  [
    body('firstName').optional().trim().notEmpty(),
    body('lastName').optional().trim().notEmpty(),
    body('email').optional().isEmail().normalizeEmail(),
    body('department').optional().trim().notEmpty(),
    body('position').optional().trim().notEmpty(),
    body('salary').optional().isNumeric(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const employee = await Employee.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      res.json(employee);
    } catch (error) {
      res.status(500).json({ message: 'Error updating employee' });
    }
  }
);

// Delete employee
router.delete('/:id',
  auth,
  authorize('admin'),
  async (req, res) => {
    try {
      const employee = await Employee.findByIdAndDelete(req.params.id);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }
      res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting employee' });
    }
  }
);

// Add document to employee
router.post('/:id/documents',
  auth,
  authorize('admin', 'manager'),
  [
    body('type').trim().notEmpty(),
    body('name').trim().notEmpty(),
    body('url').trim().notEmpty(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const employee = await Employee.findById(req.params.id);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      employee.documents.push(req.body);
      await employee.save();

      res.status(201).json(employee);
    } catch (error) {
      res.status(500).json({ message: 'Error adding document' });
    }
  }
);

module.exports = router; 