const mongoose = require('mongoose');

const payrollSchema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Employee',
    required: true,
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  year: {
    type: Number,
    required: true,
  },
  baseSalary: {
    type: Number,
    required: true,
    min: 0,
  },
  bonus: {
    type: Number,
    default: 0,
    min: 0,
  },
  deductions: [{
    type: {
      type: String,
      required: true,
      enum: ['tax', 'insurance', 'pension', 'other'],
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    description: String,
  }],
  totalDeductions: {
    type: Number,
    default: 0,
    min: 0,
  },
  netSalary: {
    type: Number,
    required: true,
    min: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'paid'],
    default: 'pending',
  },
  paymentDate: {
    type: Date,
  },
  paymentMethod: {
    type: String,
    enum: ['bank_transfer', 'check', 'cash'],
    default: 'bank_transfer',
  },
  notes: String,
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Calculate total deductions before saving
payrollSchema.pre('save', function(next) {
  this.totalDeductions = this.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
  this.netSalary = this.baseSalary + this.bonus - this.totalDeductions;
  next();
});

// Ensure unique payroll entry per employee per month/year
payrollSchema.index({ employee: 1, month: 1, year: 1 }, { unique: true });

const Payroll = mongoose.model('Payroll', payrollSchema);

module.exports = Payroll; 