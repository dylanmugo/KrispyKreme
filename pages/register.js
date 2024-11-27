import { useState } from 'react';
import { useRouter } from 'next/router';
<<<<<<< HEAD
import { Container, Typography, TextField, Button, Alert, Box } from '@mui/material';
=======
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
} from '@mui/material';
>>>>>>> a71862242b767fa6510a951f83744c5e6a25188c

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer'); // Default role
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await response.json();
<<<<<<< HEAD
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      setErrorMessage(error.message);
=======

      if (response.ok) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setErrorMessage(data.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again.');
>>>>>>> a71862242b767fa6510a951f83744c5e6a25188c
    }
  };

  return (
<<<<<<< HEAD
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
=======
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Box
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
          Create Your Account 🍩
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
>>>>>>> a71862242b767fa6510a951f83744c5e6a25188c
        <form onSubmit={handleRegister}>
          <TextField
            fullWidth
            label="Email"
            type="email"
<<<<<<< HEAD
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
=======
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            variant="outlined"
>>>>>>> a71862242b767fa6510a951f83744c5e6a25188c
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
<<<<<<< HEAD
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button variant="contained" fullWidth type="submit" sx={{ mt: 3 }}>
            Register
          </Button>
        </form>
=======
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            variant="outlined"
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
              fontSize: '16px',
              '&:hover': { backgroundColor: '#ff5722' },
            }}
          >
            Register
          </Button>
        </form>
        <Typography variant="body2" sx={{ mt: 3 }}>
          Already have an account?{' '}
          <Link href="/login" sx={{ color: '#ff7b54', fontWeight: 'bold' }}>
            Login
          </Link>
        </Typography>
>>>>>>> a71862242b767fa6510a951f83744c5e6a25188c
      </Box>
    </Container>
  );
}
