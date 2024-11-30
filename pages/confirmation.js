import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, CircularProgress, Alert } from '@mui/material';

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
        const response = await fetch(`/api/orders?orderId=${orderId}`);
        if (!response.ok) {
          const { message } = await response.json();
          throw new Error(message || 'Failed to fetch order details');
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [router.isReady, orderId]);

  if (loading) {
    return (
      <Container>
        <CircularProgress />
        <Typography>Loading order details...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
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
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Order Confirmation
      </Typography>
      <Typography variant="body1">
        <strong>Order ID:</strong> {order._id}
      </Typography>
      <Typography variant="body1">
        <strong>Status:</strong> {order.status}
      </Typography>
      <Typography variant="body1">
        <strong>Total:</strong> ${order.total.toFixed(2)}
      </Typography>
      <Typography variant="h5" sx={{ mt: 3 }}>
        Items:
      </Typography>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>
            {item.quantity} x {item.name} @ ${item.price.toFixed(2)}
          </li>
        ))}
      </ul>
    </Container>
  );
};

export default ConfirmationPage;
