import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useRouter } from 'next/router';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart');
        if (!response.ok) throw new Error('Failed to fetch cart');
        const data = await response.json();
        setCart(data);

        // Calculate total
        const totalCost = data.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        setTotal(totalCost);
      } catch (err) {
        setError('Failed to load cart items. Please try again later.');
        console.error('Error fetching cart:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // Remove an item from the cart
  const removeFromCart = async (itemId) => {
    try {
      const response = await fetch(`/api/cart?itemId=${itemId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to remove item from cart');
      }
      // Update cart state after removing an item
      setCart((prevCart) => prevCart.filter((item) => item._id !== itemId));

      // Recalculate total
      const updatedCart = cart.filter((item) => item._id !== itemId);
      const updatedTotal = updatedCart.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setTotal(updatedTotal);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        Your Cart
      </Typography>
      {loading && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading cart items...
          </Typography>
        </Box>
      )}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && cart.length === 0 && (
        <Typography variant="h6" align="center" sx={{ mt: 4 }}>
          Your cart is empty.
        </Typography>
      )}
      {!loading && !error && cart.length > 0 && (
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
              <Box display="flex" alignItems="center">
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: '80px',
                    height: '80px',
                    objectFit: 'cover',
                    marginRight: '16px',
                  }}
                />
                <Typography>
                  {item.name} x {item.quantity}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ display: 'inline', mr: 2 }}>
                  ${item.price.toFixed(2)}
                </Typography>
                <Button
                  variant="outlined"
                  sx={{
                    color: 'white',
                    borderColor: '#ff7b54',
                    backgroundColor: '#ff7b54',
                    '&:hover': { backgroundColor: '#ff4500' },
                  }}
                  onClick={() => removeFromCart(item._id)}
                >
                  Remove
                </Button>
              </Box>
            </Box>
          ))}
          <Typography variant="h6" align="right" sx={{ mt: 2 }}>
            Total: ${total.toFixed(2)}
          </Typography>
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              variant="outlined"
              sx={{
                mr: 2,
                textTransform: 'none',
                color: 'white',
                borderColor: '#ff7b54',
                backgroundColor: '#ff7b54',
                '&:hover': { backgroundColor: '#ff4500' },
              }}
              onClick={() => router.push('/products')}
            >
              Continue Shopping
            </Button>
            <Button
              variant="contained"
              sx={{
                textTransform: 'none',
                backgroundColor: '#ff7b54',
                '&:hover': { backgroundColor: '#ff4500' },
              }}
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
