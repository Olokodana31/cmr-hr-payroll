import React from 'react';
import {
  Box,
  Button,
  Divider,
  Typography,
} from '@mui/material';
import {
  Google as GoogleIcon,
  GitHub as GitHubIcon,
  Microsoft as MicrosoftIcon,
} from '@mui/icons-material';

function SocialAuth({ onGoogleSignIn, onGitHubSignIn, onMicrosoftSignIn }) {
  return (
    <Box sx={{ width: '100%', mt: 2 }}>
      <Divider sx={{ my: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Or continue with
        </Typography>
      </Divider>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GoogleIcon />}
          onClick={onGoogleSignIn}
          sx={{
            textTransform: 'none',
            borderColor: 'rgba(0, 0, 0, 0.23)',
            '&:hover': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          Continue with Google
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<GitHubIcon />}
          onClick={onGitHubSignIn}
          sx={{
            textTransform: 'none',
            borderColor: 'rgba(0, 0, 0, 0.23)',
            '&:hover': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          Continue with GitHub
        </Button>
        <Button
          fullWidth
          variant="outlined"
          startIcon={<MicrosoftIcon />}
          onClick={onMicrosoftSignIn}
          sx={{
            textTransform: 'none',
            borderColor: 'rgba(0, 0, 0, 0.23)',
            '&:hover': {
              borderColor: 'rgba(0, 0, 0, 0.23)',
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          Continue with Microsoft
        </Button>
      </Box>
    </Box>
  );
}

export default SocialAuth; 