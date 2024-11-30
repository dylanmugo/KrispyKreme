import { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Alert, Box, Button } from '@mui/material';
import { useRouter } from 'next/router';

export default function CartPage() {
  const [cart, setCart] = useState([]);
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
      setCart((prevCart) => prevCart.filter((item) => item._id !== itemId));
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
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        Your Cart
      </Typography>
      {cart.length === 0 ? (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          Your cart is empty.
        </Typography>
      ) : (
        <Box sx={{ mt: 2 }}>
          {cart.map((item) => (
            <Box
              key={item._id}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
              p={2}
              border="1px solid #ddd"
              borderRadius="8px"
            >
              <Typography>
                {item.quantity} x {item.name} @ ${item.price.toFixed(2)}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleRemove(item._id)}
              >
                Remove
              </Button>
            </Box>
          ))}
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
  );
}
