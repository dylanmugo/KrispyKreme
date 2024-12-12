import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  Paper,
  Avatar,
} from '@mui/material';


export default function ManagerLoginPage() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setErrorMessage('');
    try {
      const response = await fetch('/api/manager/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem('managerToken', token); // Save token for session management
        router.push('/manager/dashboard'); // Redirect to dashboard
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Invalid login credentials.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 3,
          textAlign: 'center',
          backgroundColor: '#fff8f0',
          boxShadow: '0px 4px 20px rgba(255, 123, 84, 0.2)',
        }}
      >
        <Avatar
          sx={{
            mx: 'auto',
            mb: 2,
            bgcolor: '#ff7b54',
          }}
        >
          <LockOutlinedIcon />
        </Avatar>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#ff7b54',
          }}
        >
          Manager Login
        </Typography>
        {errorMessage && <Alert severity="error" sx={{ mb: 3 }}>{errorMessage}</Alert>}
        <Box>
          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            variant="outlined"
            value={credentials.email}
            onChange={handleInputChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#ff7b54' },
                '&:hover fieldset': { borderColor: '#ff4500' },
              },
            }}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            margin="normal"
            variant="outlined"
            value={credentials.password}
            onChange={handleInputChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#ff7b54' },
                '&:hover fieldset': { borderColor: '#ff4500' },
              },
            }}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={handleLogin}
            sx={{
              mt: 3,
              py: 1.5,
              fontWeight: 'bold',
              backgroundColor: '#ff7b54',
              '&:hover': { backgroundColor: '#ff4500' },
              boxShadow: '0px 4px 10px rgba(255, 123, 84, 0.3)',
            }}
          >
            Log In
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
