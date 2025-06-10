import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  IconButton,
  Paper,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const initialPayrollState = {
  employeeId: '',
  month: new Date().toISOString().slice(0, 7),
  basicSalary: 0,
  allowances: 0,
  deductions: 0,
  tax: 0,
  netSalary: 0,
  status: 'pending',
  paymentDate: new Date().toISOString().split('T')[0],
  notes: '',
};

function Payroll() {
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState(null);
  const [formData, setFormData] = useState(initialPayrollState);
  const { user } = useAuth();

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'employeeName',
      headerName: 'Employee',
      width: 200,
      valueGetter: (params) => {
        const employee = employees.find(emp => emp.id === params.row.employeeId);
        return employee ? `${employee.firstName} ${employee.lastName}` : '';
      },
    },
    { field: 'month', headerName: 'Month', width: 130 },
    {
      field: 'basicSalary',
      headerName: 'Basic Salary',
      width: 130,
      valueFormatter: (params) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(params.value);
      },
    },
    {
      field: 'allowances',
      headerName: 'Allowances',
      width: 130,
      valueFormatter: (params) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(params.value);
      },
    },
    {
      field: 'deductions',
      headerName: 'Deductions',
      width: 130,
      valueFormatter: (params) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(params.value);
      },
    },
    {
      field: 'tax',
      headerName: 'Tax',
      width: 130,
      valueFormatter: (params) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(params.value);
      },
    },
    {
      field: 'netSalary',
      headerName: 'Net Salary',
      width: 130,
      valueFormatter: (params) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(params.value);
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 130,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor:
              params.value === 'paid'
                ? 'success.light'
                : params.value === 'pending'
                ? 'warning.light'
                : 'error.light',
            color:
              params.value === 'paid'
                ? 'success.dark'
                : params.value === 'pending'
                ? 'warning.dark'
                : 'error.dark',
            padding: '4px 8px',
            borderRadius: '4px',
            textTransform: 'capitalize',
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: 'paymentDate',
      headerName: 'Payment Date',
      width: 130,
      valueFormatter: (params) => {
        return new Date(params.value).toLocaleDateString();
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 200,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleEdit(params.row)}
            size="small"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDelete(params.row.id)}
            size="small"
          >
            <DeleteIcon />
          </IconButton>
          <IconButton
            color="info"
            onClick={() => handlePrint(params.row)}
            size="small"
          >
            <PrintIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    fetchPayrolls();
    fetchEmployees();
  }, []);

  const fetchPayrolls = async () => {
    try {
      const response = await axios.get('/api/payroll', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setPayrolls(response.data);
    } catch (error) {
      console.error('Error fetching payrolls:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get('/api/employees', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedPayroll(null);
    setFormData(initialPayrollState);
  };

  const handleEdit = (payroll) => {
    setSelectedPayroll(payroll);
    setFormData(payroll);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this payroll record?')) {
      try {
        await axios.delete(`/api/payroll/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        fetchPayrolls();
      } catch (error) {
        console.error('Error deleting payroll:', error);
      }
    }
  };

  const handlePrint = (payroll) => {
    // Implement print functionality
    console.log('Printing payroll:', payroll);
  };

  const calculateNetSalary = (basicSalary, allowances, deductions, tax) => {
    return basicSalary + allowances - deductions - tax;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const netSalary = calculateNetSalary(
        formData.basicSalary,
        formData.allowances,
        formData.deductions,
        formData.tax
      );

      const payrollData = {
        ...formData,
        netSalary,
      };

      if (selectedPayroll) {
        await axios.put(
          `/api/payroll/${selectedPayroll.id}`,
          payrollData,
          {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          }
        );
      } else {
        await axios.post('/api/payroll', payrollData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
      }
      handleClose();
      fetchPayrolls();
    } catch (error) {
      console.error('Error saving payroll:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Recalculate net salary when relevant fields change
    if (['basicSalary', 'allowances', 'deductions', 'tax'].includes(name)) {
      const newNetSalary = calculateNetSalary(
        name === 'basicSalary' ? value : formData.basicSalary,
        name === 'allowances' ? value : formData.allowances,
        name === 'deductions' ? value : formData.deductions,
        name === 'tax' ? value : formData.tax
      );
      setFormData((prev) => ({
        ...prev,
        netSalary: newNetSalary,
      }));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Payroll Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add Payroll Record
        </Button>
      </Box>

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={payrolls}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
          disableSelectionOnClick
        />
      </Paper>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedPayroll ? 'Edit Payroll Record' : 'Add Payroll Record'}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Employee</InputLabel>
                  <Select
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleChange}
                    required
                  >
                    {employees.map((employee) => (
                      <MenuItem key={employee.id} value={employee.id}>
                        {`${employee.firstName} ${employee.lastName}`}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Month"
                  name="month"
                  type="month"
                  value={formData.month}
                  onChange={handleChange}
                  margin="normal"
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Basic Salary"
                  name="basicSalary"
                  type="number"
                  value={formData.basicSalary}
                  onChange={handleChange}
                  margin="normal"
                  required
                  InputProps={{
                    startAdornment: '$',
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Allowances"
                  name="allowances"
                  type="number"
                  value={formData.allowances}
                  onChange={handleChange}
                  margin="normal"
                  InputProps={{
                    startAdornment: '$',
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Deductions"
                  name="deductions"
                  type="number"
                  value={formData.deductions}
                  onChange={handleChange}
                  margin="normal"
                  InputProps={{
                    startAdornment: '$',
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Tax"
                  name="tax"
                  type="number"
                  value={formData.tax}
                  onChange={handleChange}
                  margin="normal"
                  InputProps={{
                    startAdornment: '$',
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Net Salary"
                  name="netSalary"
                  type="number"
                  value={formData.netSalary}
                  margin="normal"
                  InputProps={{
                    startAdornment: '$',
                    readOnly: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="paid">Paid</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Payment Date"
                  name="paymentDate"
                  type="date"
                  value={formData.paymentDate}
                  onChange={handleChange}
                  margin="normal"
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes"
                  name="notes"
                  multiline
                  rows={4}
                  value={formData.notes}
                  onChange={handleChange}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedPayroll ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Payroll; 