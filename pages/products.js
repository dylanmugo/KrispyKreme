import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, Badge, Alert } from '@mui/material';

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
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}
      {successMessage && <Alert severity="success">{successMessage}</Alert>}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Badge badgeContent={cartCount} color="primary">
          <Button variant="contained" onClick={() => window.location.href = '/cart'}>
            Cart
          </Button>
        </Badge>
      </Box>

      <Box>
  {products.map((product) => (
    <Box
      key={product._id}
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2,
        p: 2,
        border: '1px solid #ddd',
        borderRadius: '8px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={product.image}
          alt={product.name}
          style={{ width: '100px', height: '100px', marginRight: '10px', borderRadius: '8px' }}
          onError={(e) => (e.target.src = '/fallback-image.jpg')} // Fallback image
        />
        <Typography>
          {product.name} - ${product.price.toFixed(2)}
        </Typography>
      </Box>
      <Button
        variant="outlined"
        onClick={() => handleAddToCart(product)}
      >
        Add to Cart
      </Button>
    </Box>
  ))}
</Box>

    </Container>
  );
};

export default ProductsPage;
