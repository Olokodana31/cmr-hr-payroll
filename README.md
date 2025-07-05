# CRM, HR & Payroll System

A comprehensive system for managing customer relationships, human resources, and payroll operations.

## Features

- **User Authentication and Authorization** - Secure login/logout with JWT tokens
- **Employee Management** - Add, edit, and manage employee information
- **Customer Relationship Management** - Track and manage customer data
- **Payroll Processing** - Handle payroll calculations and processing
- **Role-based Access Control** - Admin, Manager, and Employee roles
- **Responsive Dashboard** - Real-time statistics and charts
- **Modern UI** - Material-UI based interface with responsive design

## Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Material-UI (MUI)** - Component library for consistent design
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Recharts** - Data visualization and charts
- **React Hook Form** - Form handling with validation
- **Yup** - Schema validation

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database with Mongoose ODM
- **JWT** - JSON Web Token authentication
- **Express Validator** - Input validation
- **bcryptjs** - Password hashing
- **Morgan** - HTTP request logger

### Infrastructure
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **MongoDB 6** - Database container

## Prerequisites

- **Docker Desktop** - For running containers
- **Node.js** (v14 or higher) - For local development
- **npm or yarn** - Package managers

## Quick Start with Docker

1. **Clone the repository:**
```bash
git clone <repository-url>
cd "CRM, HR & Payroll"
```

2. **Start the application:**
```bash
docker-compose up --build
```

3. **Access the application:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5001
- **MongoDB**: localhost:27017

## Local Development Setup

1. **Install dependencies:**
```bash
# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install
```

2. **Environment Setup:**
Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/crm-hr-payroll
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

3. **Start MongoDB:**
```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:6

# Or install MongoDB locally
```

4. **Start the development servers:**
```bash
# Start backend server
cd backend
npm run dev

# Start frontend server (in a new terminal)
cd frontend
npm start
```

## API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile

### Employee Management
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create new employee
- `GET /api/employees/:id` - Get employee details
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

### Customer Management
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create new customer
- `GET /api/customers/:id` - Get customer details
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Payroll Management
- `GET /api/payroll` - Get all payroll entries
- `POST /api/payroll` - Create new payroll entry
- `GET /api/payroll/employee/:employeeId` - Get employee payroll
- `PATCH /api/payroll/:id/status` - Update payroll status
- `GET /api/payroll/summary` - Get payroll summary

## User Roles and Permissions

### Admin Role
- Full access to all features
- Can manage users and roles
- Can process payroll
- Can view all system data

### Manager Role
- Can manage employees and customers
- Can view and process payroll
- Cannot manage user roles
- Limited administrative access

### Employee Role
- Can view their own information
- Can view their payroll
- Limited access to other features
- Cannot modify system data

## Project Structure

```
CRM, HR & Payroll/
├── backend/
│   ├── src/
│   │   ├── models/          # MongoDB schemas
│   │   ├── routes/          # API endpoints
│   │   ├── middleware/      # Authentication & validation
│   │   └── index.js         # Server entry point
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── contexts/        # React contexts
│   │   ├── utils/           # Utility functions
│   │   └── App.js           # Main app component
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml       # Container orchestration
└── README.md
```

## Troubleshooting

### Common Issues

1. **Docker containers not starting:**
   ```bash
   # Stop all containers
   docker-compose down
   
   # Remove orphaned containers
   docker-compose down --remove-orphans
   
   # Rebuild and start
   docker-compose up --build
   ```

2. **MongoDB connection issues:**
   - Ensure MongoDB container is running: `docker-compose ps`
   - Check MongoDB logs: `docker-compose logs mongo`

3. **Frontend not loading:**
   - Check if frontend container is running: `docker-compose ps`
   - View frontend logs: `docker-compose logs frontend`

4. **Backend API errors:**
   - Check backend logs: `docker-compose logs backend`
   - Verify MongoDB connection in backend logs

### Development Commands

```bash
# View all container logs
docker-compose logs

# View specific service logs
docker-compose logs backend
docker-compose logs frontend
docker-compose logs mongo

# Restart specific service
docker-compose restart backend

# Access MongoDB shell
docker-compose exec mongo mongosh

# Access backend container
docker-compose exec backend sh

# Access frontend container
docker-compose exec frontend sh
```

## Security Considerations

- **JWT Secret**: Change the default JWT secret in production
- **Database**: Use strong passwords for MongoDB in production
- **Environment Variables**: Never commit sensitive data to version control
- **HTTPS**: Use HTTPS in production environments
- **Input Validation**: All user inputs are validated on both frontend and backend

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the troubleshooting section above
- Review the API documentation
- Open an issue on the repository

---

**Note**: This is a development version. For production deployment, ensure proper security measures, environment configuration, and database backups are in place.
