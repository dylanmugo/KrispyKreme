// pages/login.js

import { useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
} from '@mui/material';
import validator from 'validator';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  // Handle input changes with input length restrictions
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Limit input lengths to 100 characters
    let newValue = value;
    if (name === 'email' && value.length > 100) newValue = value.slice(0, 100);
    if (name === 'password' && value.length > 100) newValue = value.slice(0, 100);

    setCredentials((prev) => ({ ...prev, [name]: newValue }));
  };

  // Handle form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    const { email, password } = credentials;

    // Client-side Validation
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Email and password are required.');
      return;
    }

    if (!validator.isEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (password.length < 6 || password.length > 100) {
      setErrorMessage('Password must be between 6 and 100 characters.');
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        // Redirect based on user role after a short delay
        setTimeout(() => {
          if (data.role === 'manager') {
            router.push('/manager');
          } else if (data.role === 'customer') {
            router.push('/customer');
          } else {
            router.push('/dashboard'); // Default redirect
          }
        }, 2000); // 2-second delay
      } else {
        setErrorMessage(data.message || 'Invalid login credentials.');
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          backgroundColor: '#ffffff',
          borderRadius: '15px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          p: 4,
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ color: '#ff7b54', fontWeight: 'bold' }}
        >
          Login to Krispy Kreme Portal! 🍩
        </Typography>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {successMessage}
          </Alert>
        )}
        <TextField
          fullWidth
          label="Email"
          name="email"
          type="email"
          value={credentials.email}
          onChange={handleInputChange}
          margin="normal"
          required
          variant="outlined"
          inputProps={{ maxLength: 100 }}
        />
        <TextField
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={credentials.password}
          onChange={handleInputChange}
          margin="normal"
          required
          variant="outlined"
          inputProps={{ maxLength: 100 }}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            backgroundColor: '#ff7b54',
            color: '#ffffff',
            mt: 3,
            py: 1.5,
            '&:hover': { backgroundColor: '#ff5722' },
          }}
        >
          Login
        </Button>
        <Typography variant="body2" sx={{ mt: 3 }}>
          Don't have an account?{' '}
          <Link href="/register" sx={{ color: '#ff7b54', fontWeight: 'bold' }}>
            Sign Up
          </Link>
        </Typography>
      </Box>
    </Container>
  );
}
