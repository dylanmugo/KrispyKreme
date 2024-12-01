import React, { useState, useEffect } from 'react';
import { Container, TextField, Button, Typography, Box, Alert, AppBar, Toolbar } from '@mui/material';
import { useRouter } from 'next/router';

const CheckoutPage = () => {
  const [userDetails, setUserDetails] = useState({ name: '', email: '', address: '' });
  const [cart, setCart] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch cart items
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart');
        if (!response.ok) throw new Error('Failed to fetch cart');
        const data = await response.json();
        setCart(data); // Ensure API returns an array
      } catch (err) {
        setErrorMessage(err.message);
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

  // Validate user input
  const validateInput = () => {
    if (!userDetails.name.trim() || !userDetails.email.trim() || !userDetails.address.trim()) {
      setErrorMessage('All fields are required.');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(userDetails.email)) {
      setErrorMessage('Please provide a valid email address.');
      return false;
    }

    return true;
  };

  // Place order
  const handlePlaceOrder = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateInput()) return;

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
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to place the order');
      }

      const data = await response.json();
      setSuccessMessage(`Order placed successfully! Order ID: ${data.orderId}`);
      setTimeout(() => router.push(`/confirmation?orderId=${data.orderId}`), 2000);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6">Loading cart details...</Typography>
      </Box>
    );
  }

  return (
    <>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: 'orange' }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => router.push('/')}
          >
            Krispy Kreme
          </Typography>
          <Button color="inherit" onClick={() => router.push('/products')}>
            Products
          </Button>
          <Button color="inherit" onClick={() => router.push('/cart')}>
            Cart
          </Button>
        </Toolbar>
      </AppBar>

      {/* Checkout Content */}
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ color: 'orange' }}>
          Checkout
        </Typography>

        {errorMessage && <Alert severity="error" sx={{ mb: 2 }}>{errorMessage}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="normal"
            value={userDetails.name}
            onChange={handleInputChange}
          />
          <TextField
            label="Email"
            name="email"
            fullWidth
            margin="normal"
            value={userDetails.email}
            onChange={handleInputChange}
          />
          <TextField
            label="Address"
            name="address"
            fullWidth
            margin="normal"
            multiline
            rows={3}
            value={userDetails.address}
            onChange={handleInputChange}
          />

          <Typography variant="h5" sx={{ mt: 3, mb: 2 }}>
            Cart Summary
          </Typography>
          {cart.length === 0 ? (
            <Alert severity="info">Your cart is empty. Add some products to proceed!</Alert>
          ) : (
            <Box>
              {cart.map((item, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    mb: 2,
                    p: 2,
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                  }}
                >
                  <Typography>
                    {item.quantity} x {item.name} @ ${item.price.toFixed(2)}
                  </Typography>
                </Box>
              ))}
            </Box>
          )}

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default CheckoutPage;
