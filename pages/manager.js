import { useState } from 'react';
import { useRouter } from 'next/router';
<<<<<<< HEAD
import { Container, Typography, TextField, Button, Alert, Box } from '@mui/material';

export default function ManagerLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleLogin = async () => {
    setErrorMessage('');

    try {
      const response = await fetch('/api/manager', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Invalid login credentials');

      router.push('/manager/dashboard');
    } catch (error) {
      setErrorMessage(error.message);
=======
import {
  Container,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
} from '@mui/material';

export default function ManagerLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
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
        localStorage.setItem('managerToken', token); // Save token (mocked for now)
        router.push('/manager/dashboard'); // Redirect to dashboard
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'Login failed.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setErrorMessage('Something went wrong. Please try again.');
>>>>>>> a71862242b767fa6510a951f83744c5e6a25188c
    }
  };

  return (
<<<<<<< HEAD
    <Container maxWidth="sm">
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Manager Login
        </Typography>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" fullWidth onClick={handleLogin} sx={{ mt: 3 }}>
          Login
=======
    <Container maxWidth="sm" sx={{ py: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Manager Login
      </Typography>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <Box sx={{ mt: 3 }}>
        <TextField
          label="Username"
          name="username"
          fullWidth
          margin="normal"
          value={credentials.username}
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
          color="primary"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleLogin}
        >
          Log In
>>>>>>> a71862242b767fa6510a951f83744c5e6a25188c
        </Button>
      </Box>
    </Container>
  );
}
