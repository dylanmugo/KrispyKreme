import React, { useState, useEffect } from 'react';
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

const CheckoutPage = () => {
  const [userDetails, setUserDetails] = useState({ name: '', email: '', address: '' });
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  // Fetch cart items on load
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart');
        if (!response.ok) throw new Error('Failed to fetch cart');
        const data = await response.json();

        // Set cart and total
        setCart(data);
        const totalAmount = data.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotal(totalAmount);
      } catch (err) {
        setErrorMessage('Error fetching cart. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Place order
  const handlePlaceOrder = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!userDetails.name || !userDetails.email || !userDetails.address) {
      setErrorMessage('Please fill in all customer details.');
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
          customerDetails: userDetails,
          items: cart,
          total,
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

  // Loading state
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
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#ff7b54' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Checkout Page
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
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
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              value={userDetails.email}
              onChange={handleInputChange}
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
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ textAlign: 'right' }}>
              Total: ${total.toFixed(2)}
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
};

export default CheckoutPage;
