const express = require('express');
const { body, validationResult } = require('express-validator');
const Customer = require('../models/Customer');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all customers
router.get('/', auth, async (req, res) => {
  try {
    const customers = await Customer.find().populate('assignedTo', 'firstName lastName email');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customers' });
  }
});

// Get single customer
router.get('/:id', auth, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate('assignedTo', 'firstName lastName email');
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching customer' });
  }
});

// Create new customer
router.post('/',
  auth,
  [
    body('companyName').trim().notEmpty(),
    body('contactName').trim().notEmpty(),
    body('email').isEmail().normalizeEmail(),
    body('phone').trim().notEmpty(),
    body('type').isIn(['individual', 'business']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const customer = new Customer({
        ...req.body,
        assignedTo: req.user._id,
      });

      await customer.save();
      res.status(201).json(customer);
    } catch (error) {
      res.status(500).json({ message: 'Error creating customer' });
    }
  }
);

// Update customer
router.put('/:id',
  auth,
  [
    body('companyName').optional().trim().notEmpty(),
    body('contactName').optional().trim().notEmpty(),
    body('email').optional().isEmail().normalizeEmail(),
    body('phone').optional().trim().notEmpty(),
    body('status').optional().isIn(['active', 'inactive', 'pending']),
    body('type').optional().isIn(['individual', 'business']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const customer = await Customer.findById(req.params.id);
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }

      // Check if user has permission to update
      if (customer.assignedTo.toString() !== req.user._id.toString() && 
          !['admin', 'manager'].includes(req.user.role)) {
        return res.status(403).json({ message: 'Not authorized to update this customer' });
      }

      const updatedCustomer = await Customer.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate('assignedTo', 'firstName lastName email');

      res.json(updatedCustomer);
    } catch (error) {
      res.status(500).json({ message: 'Error updating customer' });
    }
  }
);

// Delete customer
router.delete('/:id',
  auth,
  authorize('admin', 'manager'),
  async (req, res) => {
    try {
      const customer = await Customer.findByIdAndDelete(req.params.id);
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting customer' });
    }
  }
);

// Update customer status
router.patch('/:id/status',
  auth,
  [
    body('status').isIn(['active', 'inactive', 'pending']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const customer = await Customer.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true, runValidators: true }
      );

      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }

      res.json(customer);
    } catch (error) {
      res.status(500).json({ message: 'Error updating customer status' });
    }
  }
);

module.exports = router; 