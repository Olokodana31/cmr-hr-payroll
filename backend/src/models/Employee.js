const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  position: {
    type: String,
    required: true,
    trim: true,
  },
  salary: {
    type: Number,
    required: true,
    min: 0,
  },
  hireDate: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['active', 'on_leave', 'terminated'],
    default: 'active',
  },
  contactInfo: {
    phone: String,
    address: String,
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },
  },
  documents: [{
    type: {
      type: String,
      required: true,
    },
    name: String,
    url: String,
    uploadDate: {
      type: Date,
      default: Date.now,
    },
  }],
}, {
  timestamps: true,
});

// Virtual for full name
employeeSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtuals are included in JSON
employeeSchema.set('toJSON', { virtuals: true });
employeeSchema.set('toObject', { virtuals: true });

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee; 