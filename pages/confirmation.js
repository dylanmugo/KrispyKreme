import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { Container, Typography, CircularProgress, Alert, Box } from '@mui/material';

export default function ConfirmationPage() {
  const router = useRouter();
  const { orderId } = router.query; // Extract orderId from the URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) return; // Wait until orderId is available from the URL

    const fetchOrderDetails = async () => {
      try {
        const response = await fetch(`/api/orders?orderId=${orderId}`, {
          method: 'GET', // Explicitly set the method to GET
        });

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.message || 'Failed to fetch order details');
        }

        const data = await response.json();
        setOrder(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return (
      <Container>
        <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
          <CircularProgress />
          <Typography style={{ marginLeft: '10px' }}>Loading order details...</Typography>
        </Box>
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

  return (
    <Container>
      <Typography variant="h4" gutterBottom align="center">
        Order Confirmation
      </Typography>
      {order ? (
        <Box>
          <Typography>Order ID: {order._id}</Typography>
          <Typography>Name: {order.customerDetails?.name}</Typography>
          <Typography>Email: {order.customerDetails?.email}</Typography>
          <Typography>Address: {order.customerDetails?.address}</Typography>
          <Typography>Status: {order.status}</Typography>
          <Typography>Total: ${order.total?.toFixed(2)}</Typography>
        </Box>
      ) : (
        <Typography>No order details available.</Typography>
      )}
    </Container>
  );
}
