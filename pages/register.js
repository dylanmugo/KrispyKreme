import { useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, TextField, Button, Alert, Box } from '@mui/material';

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
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      setSuccessMessage('Registration successful! Redirecting to login...');
      setTimeout(() => router.push('/login'), 2000);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        <form onSubmit={handleRegister}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button variant="contained" fullWidth type="submit" sx={{ mt: 3 }}>
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
}
