import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';

export default function ManagerDashboard() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      setErrorMessage('');

      const token = localStorage.getItem('managerToken'); // Get token
      if (!token) {
        router.push('/manager/login'); // Redirect if not logged in
        return;
      }

      try {
        const response = await fetch('/api/manager/statistics', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          const data = await response.json();
          setStatistics(data);
        } else {
          setErrorMessage('Failed to fetch statistics. Please try again.');
        }
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setErrorMessage('An error occurred. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [router]);

  if (loading) return <CircularProgress />;

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Manager Dashboard
      </Typography>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      {statistics && (
        <Box>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6">Total Orders</Typography>
              <Typography variant="h4">{statistics.totalOrders}</Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Typography variant="h6">Total Revenue</Typography>
              <Typography variant="h4">${statistics.totalRevenue.toFixed(2)}</Typography>
            </CardContent>
          </Card>
        </Box>
      )}
    </Container>
  );
}
