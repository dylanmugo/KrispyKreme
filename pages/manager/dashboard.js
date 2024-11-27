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

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
        <CircularProgress sx={{ color: '#ff7b54' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{
          fontWeight: 'bold',
          color: '#ff7b54',
        }}
      >
        Manager Dashboard
      </Typography>
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}
      {statistics && (
        <Box>
          <Card
            sx={{
              mb: 3,
              borderRadius: '10px',
              boxShadow: '0px 4px 10px rgba(255, 123, 84, 0.3)',
              backgroundColor: '#fff8f0',
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  color: '#ff7b54',
                  fontWeight: 'bold',
                }}
              >
                Total Orders
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: '#333',
                  fontWeight: 'bold',
                }}
              >
                {statistics.totalOrders}
              </Typography>
            </CardContent>
          </Card>
          <Card
            sx={{
              borderRadius: '10px',
              boxShadow: '0px 4px 10px rgba(255, 123, 84, 0.3)',
              backgroundColor: '#fff8f0',
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{
                  color: '#ff7b54',
                  fontWeight: 'bold',
                }}
              >
                Total Revenue
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: '#333',
                  fontWeight: 'bold',
                }}
              >
                ${statistics.totalRevenue.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}
    </Container>
  );
}
