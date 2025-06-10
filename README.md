# CRM, HR & Payroll System

A comprehensive system for managing customer relationships, human resources, and payroll operations.

## Features

- User Authentication and Authorization
- Employee Management
- Customer Relationship Management
- Payroll Processing
- Role-based Access Control
- Responsive Dashboard
- Document Management

## Tech Stack

### Frontend
- React
- Material-UI
- React Router
- Axios
- Data Grid

### Backend
- Node.js
- Express
- MongoDB
- JWT Authentication
- Express Validator

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup Instructions

1. Clone the repository:
```bash
git clone <repository-url>
cd crm-hr-payroll
```

2. Install dependencies:
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

3. Environment Setup:
Create a `.env` file in the backend directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crm-hr-payroll
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

4. Start the development servers:
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server (in a new terminal)
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## API Documentation

### Authentication
- POST /api/auth/register - Register new user
- POST /api/auth/login - Login user
- GET /api/auth/me - Get current user

### Employees
- GET /api/employees - Get all employees
- POST /api/employees - Create new employee
- GET /api/employees/:id - Get employee details
- PUT /api/employees/:id - Update employee
- DELETE /api/employees/:id - Delete employee

### Customers
- GET /api/customers - Get all customers
- POST /api/customers - Create new customer
- GET /api/customers/:id - Get customer details
- PUT /api/customers/:id - Update customer
- DELETE /api/customers/:id - Delete customer

### Payroll
- GET /api/payroll - Get all payroll entries
- POST /api/payroll - Create new payroll entry
- GET /api/payroll/employee/:employeeId - Get employee payroll
- PATCH /api/payroll/:id/status - Update payroll status
- GET /api/payroll/summary - Get payroll summary

## User Roles

1. Admin
   - Full access to all features
   - Can manage users and roles
   - Can process payroll

2. Manager
   - Can manage employees and customers
   - Can view and process payroll
   - Cannot manage user roles

3. Employee
   - Can view their own information
   - Can view their payroll
   - Limited access to other features

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
