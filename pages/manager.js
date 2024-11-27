import { useState } from 'react';
import { useRouter } from 'next/router';
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
    }
  };

  return (
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
        </Button>
      </Box>
    </Container>
  );
}
