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
  );
}
