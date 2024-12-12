import { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Alert, Box, Button, AppBar, Toolbar } from '@mui/material';
import { useRouter } from 'next/router';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0); // State to store the total cost
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // Fetch cart data
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart');
        if (!response.ok) throw new Error('Failed to fetch cart');

        const data = await response.json();
        setCart(data);

        // Calculate total cost
        const totalCost = data.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotal(totalCost);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Remove item from cart
  const handleRemove = async (itemId) => {
    try {
      const response = await fetch(`/api/cart?itemId=${itemId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to remove item');

      // Refresh cart
      setCart((prevCart) => {
        const updatedCart = prevCart.filter((item) => item._id !== itemId);
        const updatedTotal = updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotal(updatedTotal); // Update the total cost
        return updatedCart;
      });
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading cart items...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
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
          <Button color="inherit" onClick={() => router.push('/checkout')}>
            Checkout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Cart Content */}
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ color: 'orange' }}>
          Your Cart
        </Typography>
        {cart.length === 0 ? (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Your cart is empty.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => router.push('/products')}
            >
              Explore Products
            </Button>
          </Box>
        ) : (
          <Box sx={{ mt: 4 }}>
            {cart.map((item) => (
              <Box
                key={item._id}
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2,
                  p: 2,
                  border: '2px solid orange',
                  borderRadius: '8px',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography sx={{ fontWeight: 'bold', color: 'orange' }}>
                    {item.quantity} x {item.name}
                  </Typography>
                  <Typography sx={{ ml: 2 }}>${item.price.toFixed(2)}</Typography>
                </Box>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleRemove(item._id)}
                >
                  Remove
                </Button>
              </Box>
            ))}
            {/* Total Cost */}
            <Typography
              variant="h5"
              align="center"
              sx={{ mt: 4, fontWeight: 'bold', color: 'orange' }}
            >
              Total: ${total.toFixed(2)}
            </Typography>
            <Box sx={{ textAlign: 'center', mt: 4 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => router.push('/checkout')}
              >
                Proceed to Checkout
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </>
  );
}
