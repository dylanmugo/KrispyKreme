<<<<<<< HEAD
import { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, AppBar, Toolbar } from '@mui/material';

export default function CustomerPage() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const handleBrowseProducts = () => {
    window.location.href = '/products'; // Navigate to products page
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const lat = 53.3498; // Latitude for Dublin
        const lon = -6.2603; // Longitude for Dublin
        const apiKey = '3d094cd688ed8a9eb505fed7d3ac3d82'; // Replace with your OpenWeatherMap API key
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        setWeather({
          temperature: data.main.temp,
          description: data.weather[0].description,
          icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
        });
      } catch (err) {
        console.error('Error fetching weather:', err);
        setError('Failed to load weather data');
      }
    };

    fetchWeather();
  }, []);

  return (
    <div>
      {/* Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: '#ff7b54' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Donut Shop
          </Typography>
          <Button
            color="inherit"
            onClick={() => (window.location.href = '/cart')}
            sx={{ textTransform: 'none' }}
          >
            Cart
          </Button>
        </Toolbar>
      </AppBar>

      {/* Weather Widget */}
      {weather && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: 2,
            mb: 4,
          }}
        >
          <img
            src={weather.icon}
            alt={weather.description}
            style={{ width: '50px', height: '50px', marginRight: '10px' }}
          />
          <Typography>
            {weather.temperature}°C - {weather.description}
          </Typography>
        </Box>
      )}
      {error && (
        <Typography color="error" sx={{ textAlign: 'center', mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Main Content */}
      <Container
        maxWidth="md"
        sx={{
          textAlign: 'center',
          mt: 8,
          p: 4,
          backgroundColor: '#fff8f6',
          borderRadius: '15px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography
          variant="h3"
          gutterBottom
          sx={{
            color: '#ff7b54',
            fontWeight: 'bold',
          }}
        >
          Welcome, Customer!
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: '#555',
            mb: 4,
          }}
        >
          Browse and order your favorite donuts 🍩
        </Typography>
        <Box>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleBrowseProducts}
            sx={{
              backgroundColor: '#ff7b54',
              py: 1.5,
              px: 4,
              fontSize: '16px',
              '&:hover': {
                backgroundColor: '#ff5722',
              },
            }}
          >
            Browse Products
          </Button>
        </Box>
      </Container>
    </div>
=======
import { Container, Typography, Box, Button } from '@mui/material';

export default function CustomerPage() {
  const handleBrowseProducts = () => {
    // Add navigation logic, e.g., redirect to the products page
    window.location.href = '/products';
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        textAlign: 'center',
        mt: 8,
        p: 4,
        backgroundColor: '#fff8f6',
        borderRadius: '15px',
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography
        variant="h3"
        gutterBottom
        sx={{
          color: '#ff7b54',
          fontWeight: 'bold',
        }}
      >
        Welcome, Customer!
      </Typography>
      <Typography
        variant="h5"
        sx={{
          color: '#555',
          mb: 4,
        }}
      >
        Browse and order your favorite donuts 🍩
      </Typography>
      <Box>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleBrowseProducts}
          sx={{
            backgroundColor: '#ff7b54',
            py: 1.5,
            px: 4,
            fontSize: '16px',
            '&:hover': {
              backgroundColor: '#ff5722',
            },
          }}
        >
          Browse Products
        </Button>
      </Box>
    </Container>
>>>>>>> a71862242b767fa6510a951f83744c5e6a25188c
  );
}
