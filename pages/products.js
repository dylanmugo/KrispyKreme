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
  const [cart, setCart] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    // Load products
    fetchProducts();

    // Load cart from local storage
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const addToCart = (product) => {
    const updatedCart = [...cart, product];
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert(`${product.name} added to cart!`);
  };

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            color: '#ff7b54',
          }}
        >
          Products
        </Typography>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 3,
              borderRadius: 2,
              boxShadow: '0px 4px 10px rgba(255, 123, 84, 0.3)',
            }}
          >
            {error}
          </Alert>
        )}
      </Box>
      {loading ? (
        <Box
          sx={{
            textAlign: 'center',
            mt: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <CircularProgress sx={{ color: '#ff7b54' }} />
          <Typography
            variant="h6"
            sx={{
              mt: 2,
              color: '#555',
            }}
          >
            Loading products...
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: '0px 4px 10px rgba(255, 123, 84, 0.2)',
                  '&:hover': { boxShadow: '0px 6px 15px rgba(255, 123, 84, 0.3)' },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                  sx={{
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                />
                <CardContent
                  sx={{
                    textAlign: 'center',
                    backgroundColor: '#fff8f0',
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      color: '#333',
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Typography
                    sx={{
                      color: '#ff7b54',
                      fontWeight: 'bold',
                      mt: 1,
                    }}
                  >
                    ${product.price.toFixed(2)}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', p: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => addToCart(product)}
                    sx={{
                      textTransform: 'none',
                      backgroundColor: '#ff7b54',
                      '&:hover': { backgroundColor: '#ff4500' },
                      boxShadow: '0px 4px 8px rgba(255, 123, 84, 0.3)',
                    }}
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        {cart.length > 0 && (
          <Button
            variant="outlined"
            sx={{
              mr: 2,
              textTransform: 'none',
              color: '#ff7b54',
              borderColor: '#ff7b54',
              '&:hover': { backgroundColor: '#fff8f0', borderColor: '#ff4500' },
            }}
            onClick={() => router.push('/cart')}
          >
            Go to Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
          </Button>
        )}
        <Button
          variant="contained"
          sx={{
            textTransform: 'none',
            backgroundColor: '#ff7b54',
            '&:hover': { backgroundColor: '#ff4500' },
            boxShadow: '0px 4px 8px rgba(255, 123, 84, 0.3)',
          }}
          onClick={() => router.push('/checkout')}
        >
          Proceed to Checkout
        </Button>
      </Box>
    </Container>
  );
}
