import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, CircularProgress, Alert, AppBar, Toolbar, Button, Box } from '@mui/material';

const ConfirmationPage = () => {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!router.isReady || !orderId) return;

    const fetchOrder = async () => {
      try {
        console.log('Fetching order with ID:', orderId); // Debugging log

        const response = await fetch(`/api/orders?orderId=${orderId}`);
        if (!response.ok) {
          const { message } = await response.json();
          throw new Error(message || 'Failed to fetch order details');
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err.message || 'We couldn’t retrieve your order. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [router.isReady, orderId]);

  if (loading) {
    return (
      <Container sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading order details...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
        <Typography sx={{ mt: 2 }}>
          If the problem persists, please contact our support team.
        </Typography>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container>
        <Typography>No order found.</Typography>
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
          <Button color="inherit" onClick={() => router.push('/cart')}>
            Cart
          </Button>
        </Toolbar>
      </AppBar>

      {/* Confirmation Content */}
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ color: 'orange' }}>
          Order Confirmation
        </Typography>
        <Box sx={{ mt: 3, mb: 3, p: 2, border: '1px solid orange', borderRadius: '8px' }}>
          <Typography variant="body1">
            <strong>Order ID:</strong> {order._id}
          </Typography>
          <Typography variant="body1">
            <strong>Status:</strong> {order.status}
          </Typography>
          <Typography variant="body1">
            <strong>Total:</strong> ${order.total.toFixed(2)}
          </Typography>
        </Box>
        <Typography variant="h5" sx={{ mt: 3, color: 'orange' }}>
          Items in Your Order:
        </Typography>
        <Box
          component="ul"
          sx={{
            listStyle: 'none',
            p: 0,
            mt: 2,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'center',
          }}
        >
          {order.items.map((item, index) => (
            <Box
              key={index}
              component="li"
              sx={{
                border: '2px solid orange',
                borderRadius: '8px',
                padding: '8px 16px',
                width: '100%',
                maxWidth: '400px',
              }}
            >
              <Typography>
                {item.quantity} x {item.name} @ ${item.price.toFixed(2)}
              </Typography>
            </Box>
          ))}
        </Box>
        <Typography sx={{ mt: 4 }}>
          A confirmation email has been sent to your inbox. If you have any questions, contact us at{' '}
          <strong>support@krispykreme.com</strong>.
        </Typography>
      </Container>
    </>
  );
};

export default ConfirmationPage;
