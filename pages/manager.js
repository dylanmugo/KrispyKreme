import { useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, TextField, Button, Alert, Box } from '@mui/material';

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
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Manager Login
        </Typography>
      </Box>
      {errorMessage && <Alert severity="error" sx={{ mb: 3 }}>{errorMessage}</Alert>}
      <Box>
        <TextField
          label="Email"
          name="email"
          fullWidth
          margin="normal"
          value={credentials.email}
          onChange={handleInputChange}
        />
        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          value={credentials.password}
          onChange={handleInputChange}
        />
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3, backgroundColor: '#ff7b54', '&:hover': { backgroundColor: '#ff4500' } }}
          onClick={handleLogin}
        >
          Log In
        </Button>
      </Box>
    </Container>
  );
}
