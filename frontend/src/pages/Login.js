import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Alert,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { loginSchema } from '../utils/validationSchemas';
import SocialAuth from '../components/SocialAuth';

function Login() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const { login, googleLogin, githubLogin, microsoftLogin } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to login');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // Initialize Google Sign-In
      const auth2 = window.gapi.auth2.getAuthInstance();
      const googleUser = await auth2.signIn();
      const token = googleUser.getAuthResponse().id_token;
      await googleLogin(token);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to login with Google');
    }
  };

  const handleGitHubSignIn = async () => {
    try {
      // Initialize GitHub Sign-In
      const githubAuth = new window.GitHubAuth();
      const token = await githubAuth.signIn();
      await githubLogin(token);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to login with GitHub');
    }
  };

  const handleMicrosoftSignIn = async () => {
    try {
      // Initialize Microsoft Sign-In
      const msalInstance = new window.msal.PublicClientApplication({
        auth: {
          clientId: process.env.REACT_APP_MICROSOFT_CLIENT_ID,
        },
      });
      const response = await msalInstance.loginPopup();
      await microsoftLogin(response.idToken);
      navigate('/');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to login with Microsoft');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {error && (
            <Alert severity="error" sx={{ width: '100%', mt: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              autoComplete="email"
              autoFocus
              error={!!errors.email}
              helperText={errors.email?.message}
              {...register('email')}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              {...register('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
            <Box sx={{ textAlign: 'center' }}>
              <Link component={RouterLink} to="/register" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Box>
            <SocialAuth
              onGoogleSignIn={handleGoogleSignIn}
              onGitHubSignIn={handleGitHubSignIn}
              onMicrosoftSignIn={handleMicrosoftSignIn}
            />
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login; 