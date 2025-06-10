import React from 'react';
import { Box, LinearProgress, Typography } from '@mui/material';

const calculatePasswordStrength = (password) => {
  if (!password) return 0;
  
  let strength = 0;
  
  // Length check
  if (password.length >= 8) strength += 20;
  
  // Character type checks
  if (/[A-Z]/.test(password)) strength += 20;
  if (/[a-z]/.test(password)) strength += 20;
  if (/[0-9]/.test(password)) strength += 20;
  if (/[^A-Za-z0-9]/.test(password)) strength += 20;
  
  return strength;
};

const getStrengthColor = (strength) => {
  if (strength <= 20) return 'error';
  if (strength <= 40) return 'warning';
  if (strength <= 60) return 'info';
  if (strength <= 80) return 'primary';
  return 'success';
};

const getStrengthText = (strength) => {
  if (strength <= 20) return 'Very Weak';
  if (strength <= 40) return 'Weak';
  if (strength <= 60) return 'Moderate';
  if (strength <= 80) return 'Strong';
  return 'Very Strong';
};

function PasswordStrengthIndicator({ password }) {
  const strength = calculatePasswordStrength(password);
  const color = getStrengthColor(strength);
  const text = getStrengthText(strength);

  return (
    <Box sx={{ width: '100%', mt: 1 }}>
      <LinearProgress
        variant="determinate"
        value={strength}
        color={color}
        sx={{ height: 8, borderRadius: 4 }}
      />
      <Typography
        variant="caption"
        color={`${color}.main`}
        sx={{ mt: 0.5, display: 'block' }}
      >
        Password Strength: {text}
      </Typography>
    </Box>
  );
}

export default PasswordStrengthIndicator; 