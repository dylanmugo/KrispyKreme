import { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { useRouter } from 'next/router';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const addToCart = async (product) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add product to cart');
      }

      alert('Product added to cart!');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Products
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
      </Box>
      {loading ? (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <CircularProgress />
          <Typography variant="h6" sx={{ mt: 2 }}>
            Loading products...
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4} sx={{ mt: 2 }}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card>
                <CardMedia component="img" height="140" image={product.image} alt={product.name} />
                <CardContent>
                  <Typography variant="h6">{product.name}</Typography>
                  <Typography>${product.price.toFixed(2)}</Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    onClick={() => addToCart(product)}
                    sx={{ textTransform: 'none' }}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {/* Navigation Buttons */}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Button
          variant="outlined"
          sx={{ mr: 2, textTransform: 'none' }}
          onClick={() => router.push('/cart')}
        >
          Go to Cart
        </Button>
        <Button
          variant="contained"
          sx={{ textTransform: 'none' }}
          onClick={() => router.push('/checkout')}
        >
          Proceed to Checkout
        </Button>
      </Box>
    </Container>
  );
}
