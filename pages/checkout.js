// pages/checkout.js

import { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Button,
  Alert,
  Grid,
  CircularProgress,
  Box,
} from '@mui/material';
import { useRouter } from 'next/router';
import validator from 'validator';

export default function CheckoutPage() {
  const [userDetails, setUserDetails] = useState({ name: '', email: '', address: '' });
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart');
        if (!response.ok) throw new Error('Failed to fetch cart');
        const data = await response.json();
        setCart(data || []); // Assuming the API returns an array
      } catch (err) {
        setErrorMessage(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Client-side validation: limit input lengths
    let newValue = value;
    if (name === 'name' && value.length > 50) newValue = value.slice(0, 50);
    if (name === 'email' && value.length > 100) newValue = value.slice(0, 100);
    if (name === 'address' && value.length > 200) newValue = value.slice(0, 200);

    setUserDetails((prev) => ({ ...prev, [name]: newValue }));
  };

  const handlePlaceOrder = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    const { name, email, address } = userDetails;

    // Client-side Validation
    if (!name.trim() || !email.trim() || !address.trim()) {
      setErrorMessage('All fields are required.');
      return;
    }

    // Email format validation
    if (!validator.isEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    if (cart.length === 0) {
      setErrorMessage('Your cart is empty!');
      return;
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerDetails: {
            name: validator.escape(name),
            email: validator.normalizeEmail(email),
            address: validator.escape(address),
          },
          items: cart.map((item) => ({
            _id: item._id,
            name: item.name, // Already sanitized in API
            price: item.price,
            quantity: item.quantity,
          })),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to place the order');
      }

      const data = await response.json();
      setSuccessMessage(`Order placed successfully! Your order ID is ${data.orderId}`);
      setTimeout(() => router.push(`/confirmation?orderId=${data.orderId}`), 2000);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading checkout details...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: '#ff7b54' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Checkout Page
          </Typography>
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Checkout
        </Typography>
        {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={userDetails.name}
              onChange={handleInputChange}
              inputProps={{ maxLength: 50 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              type="email"
              fullWidth
              value={userDetails.email}
              onChange={handleInputChange}
              inputProps={{ maxLength: 100 }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              fullWidth
              multiline
              rows={3}
              value={userDetails.address}
              onChange={handleInputChange}
              inputProps={{ maxLength: 200 }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ textAlign: 'right' }}>
              Total: $
              {cart
                .reduce((sum, item) => sum + item.price * item.quantity, 0)
                .toFixed(2)}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Button
              variant="contained"
              fullWidth
              onClick={handlePlaceOrder}
              sx={{
                backgroundColor: '#ff7b54',
                '&:hover': { backgroundColor: '#ff4500' },
              }}
            >
              Place Order
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
