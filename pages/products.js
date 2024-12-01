import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Badge, Alert, AppBar, Toolbar } from '@mui/material';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch products and cart count on page load
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      }
    };

    const fetchCartCount = async () => {
      try {
        const response = await fetch('/api/cart');
        if (!response.ok) throw new Error('Failed to fetch cart');
        const cartData = await response.json();
        setCartCount(cartData.reduce((total, item) => total + item.quantity, 0));
      } catch (err) {
        console.error('Error fetching cart count:', err);
      }
    };

    fetchProducts();
    fetchCartCount();
  }, []);

  // Add item to cart and update count
  const handleAddToCart = async (product) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item to cart');
      }

      setSuccessMessage(`Added ${product.name} to cart!`);
      setCartCount((prevCount) => prevCount + 1);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: 'orange' }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: 'pointer' }}
            onClick={() => (window.location.href = '/')}
          >
            Krispy Kreme
          </Typography>
          <Button color="inherit" onClick={() => (window.location.href = '/products')}>
            Products
          </Button>
          <Badge badgeContent={cartCount} color="secondary">
            <Button color="inherit" onClick={() => (window.location.href = '/cart')}>
              Cart
            </Button>
          </Badge>
        </Toolbar>
      </AppBar>

      {/* Products Section */}
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ color: 'orange' }}>
          Our Products
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        {products.length === 0 ? (
          <Typography variant="h6" align="center" sx={{ mt: 4 }}>
            No products available at the moment. Please check back later!
          </Typography>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: 3,
              mt: 4,
            }}
          >
            {products.map((product) => (
              <Box
                key={product._id}
                sx={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.2)',
                  },
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  onError={(e) => (e.target.src = '/fallback-image.jpg')} // Fallback image
                />
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'orange' }}>
                    {product.name}
                  </Typography>
                  <Typography sx={{ mb: 2 }}>${product.price.toFixed(2)}</Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Container>
    </>
  );
};

export default ProductsPage;
