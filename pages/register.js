// pages/register.js

import { useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
} from '@mui/material';
import { useRouter } from 'next/router';
import validator from 'validator';

export default function RegisterPage() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Limit input lengths
    let newValue = value;
    if (name === 'email' && value.length > 100) newValue = value.slice(0, 100);
    if (name === 'password' && value.length > 100) newValue = value.slice(0, 100);

    setCredentials((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleRegister = async () => {
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
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }), // Only email and password
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong.');
      }

      setSuccessMessage(data.message);
      setTimeout(() => router.push('/login'), 2000); // Redirect after 2 seconds
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Register
      </Typography>

      {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
      {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

      <Box component="form" noValidate autoComplete="off">
        <TextField
          label="Email"
          name="email"
          type="email"
          fullWidth
          margin="normal"
          value={credentials.email}
          onChange={handleInputChange}
          inputProps={{ maxLength: 100 }}
          required
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          value={credentials.password}
          onChange={handleInputChange}
          inputProps={{ maxLength: 100 }}
          required
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleRegister}
        >
          Register
        </Button>
      </Box>
    </Container>
  );
}
