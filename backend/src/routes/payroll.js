const express = require('express');
const { body, validationResult } = require('express-validator');
const Payroll = require('../models/Payroll');
const Employee = require('../models/Employee');
const { auth, authorize } = require('../middleware/auth');

const router = express.Router();

// Get all payroll entries
router.get('/', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const payrolls = await Payroll.find()
      .populate('employee', 'firstName lastName email')
      .populate('processedBy', 'firstName lastName');
    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payroll entries' });
  }
});

// Get payroll entries for specific employee
router.get('/employee/:employeeId', auth, async (req, res) => {
  try {
    const payrolls = await Payroll.find({ employee: req.params.employeeId })
      .populate('employee', 'firstName lastName email')
      .populate('processedBy', 'firstName lastName');

    // If user is not admin/manager, only show their own payroll
    if (!['admin', 'manager'].includes(req.user.role) && 
        req.params.employeeId !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this payroll' });
    }

    res.json(payrolls);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching payroll entries' });
  }
});

// Create new payroll entry
router.post('/',
  auth,
  authorize('admin', 'manager'),
  [
    body('employee').isMongoId(),
    body('month').isInt({ min: 1, max: 12 }),
    body('year').isInt({ min: 2000 }),
    body('baseSalary').isFloat({ min: 0 }),
    body('bonus').optional().isFloat({ min: 0 }),
    body('deductions').isArray(),
    body('deductions.*.type').isIn(['tax', 'insurance', 'pension', 'other']),
    body('deductions.*.amount').isFloat({ min: 0 }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // Check if employee exists
      const employee = await Employee.findById(req.body.employee);
      if (!employee) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      // Check if payroll entry already exists for this month/year
      const existingPayroll = await Payroll.findOne({
        employee: req.body.employee,
        month: req.body.month,
        year: req.body.year,
      });

      if (existingPayroll) {
        return res.status(400).json({ message: 'Payroll entry already exists for this month' });
      }

      const payroll = new Payroll({
        ...req.body,
        processedBy: req.user._id,
      });

      await payroll.save();
      res.status(201).json(payroll);
    } catch (error) {
      res.status(500).json({ message: 'Error creating payroll entry' });
    }
  }
);

// Update payroll status
router.patch('/:id/status',
  auth,
  authorize('admin', 'manager'),
  [
    body('status').isIn(['pending', 'approved', 'paid']),
    body('paymentDate').optional().isISO8601(),
    body('paymentMethod').optional().isIn(['bank_transfer', 'check', 'cash']),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const payroll = await Payroll.findByIdAndUpdate(
        req.params.id,
        {
          status: req.body.status,
          paymentDate: req.body.paymentDate,
          paymentMethod: req.body.paymentMethod,
        },
        { new: true, runValidators: true }
      ).populate('employee', 'firstName lastName email');

      if (!payroll) {
        return res.status(404).json({ message: 'Payroll entry not found' });
      }

      res.json(payroll);
    } catch (error) {
      res.status(500).json({ message: 'Error updating payroll status' });
    }
  }
);

// Get payroll summary
router.get('/summary', auth, authorize('admin', 'manager'), async (req, res) => {
  try {
    const { month, year } = req.query;
    
    const query = {};
    if (month) query.month = parseInt(month);
    if (year) query.year = parseInt(year);

    const payrolls = await Payroll.find(query)
      .populate('employee', 'firstName lastName department');

    const summary = {
      totalEmployees: payrolls.length,
      totalBaseSalary: payrolls.reduce((sum, p) => sum + p.baseSalary, 0),
      totalBonus: payrolls.reduce((sum, p) => sum + p.bonus, 0),
      totalDeductions: payrolls.reduce((sum, p) => sum + p.totalDeductions, 0),
      totalNetSalary: payrolls.reduce((sum, p) => sum + p.netSalary, 0),
      byDepartment: {},
    };

    // Calculate department-wise summary
    payrolls.forEach(payroll => {
      const dept = payroll.employee.department;
      if (!summary.byDepartment[dept]) {
        summary.byDepartment[dept] = {
          count: 0,
          totalBaseSalary: 0,
          totalBonus: 0,
          totalDeductions: 0,
          totalNetSalary: 0,
        };
      }
      summary.byDepartment[dept].count++;
      summary.byDepartment[dept].totalBaseSalary += payroll.baseSalary;
      summary.byDepartment[dept].totalBonus += payroll.bonus;
      summary.byDepartment[dept].totalDeductions += payroll.totalDeductions;
      summary.byDepartment[dept].totalNetSalary += payroll.netSalary;
    });

    res.json(summary);
  } catch (error) {
    res.status(500).json({ message: 'Error generating payroll summary' });
  }
});

module.exports = router; 