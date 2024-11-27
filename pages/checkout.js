import { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Container, TextField, Button, Alert, Grid } from '@mui/material';
import { useRouter } from 'next/router';

export default function CheckoutPage() {
  const [userDetails, setUserDetails] = useState({ name: '', email: '', address: '' });
  const [cart, setCart] = useState([]); // Cart items
  const [total, setTotal] = useState(0); // Total price
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  // Fetch the cart when the component loads
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart');
        if (!response.ok) throw new Error('Failed to fetch cart');
        const data = await response.json();
        setCart(data);

        // Calculate total
        const totalAmount = data.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotal(totalAmount);
      } catch (err) {
        setErrorMessage(err.message);
      }
    };
    fetchCart();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    // Validate user details
    if (!userDetails.name || !userDetails.email || !userDetails.address) {
      setErrorMessage('All fields are required.');
      return;
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userDetails,
          items: cart, // Include cart items
          total,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to place order');
      }

      const data = await response.json();
      setSuccessMessage(`Order placed successfully! Your order ID is ${data.orderId}`);
      setTimeout(() => router.push(`/confirmation?orderId=${data.orderId}`), 2000);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <>
      {/* Orange Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: 'orange' }}>
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
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
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
            <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={12}>
            {/* Orange Button */}
            <Button
              variant="contained"
              fullWidth
              onClick={handlePlaceOrder}
              sx={{ backgroundColor: 'orange', '&:hover': { backgroundColor: '#e68a00' } }}
            >
              Place Order
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
