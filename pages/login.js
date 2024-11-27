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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        if (data.role === 'manager') {
          router.push('/manager');
        } else if (data.role === 'customer') {
          router.push('/customer');
        }
      } else {
        setErrorMessage(data.message || 'Invalid login credentials');
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
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
          Login to Krispy Kreme Portal! 🍩
        </Typography>
        {errorMessage && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Alert>
        )}
        <form onSubmit={handleLogin}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            variant="outlined"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
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
              '&:hover': { backgroundColor: '#ff5722' },
            }}
          >
            Login
          </Button>
        </form>
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
