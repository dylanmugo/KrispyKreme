import { useState, useEffect } from 'react';
<<<<<<< HEAD
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
=======
import { useRouter } from 'next/router';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]);
>>>>>>> a71862242b767fa6510a951f83744c5e6a25188c
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
<<<<<<< HEAD
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch products');
        const data = await response.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
=======
        const res = await fetch('/api/products');
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
>>>>>>> a71862242b767fa6510a951f83744c5e6a25188c
      } finally {
        setLoading(false);
      }
    };
<<<<<<< HEAD
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
=======

    const addToCart = async (product) => {
      try {
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product }), // Send product data to the cart API
        });
    
        if (!res.ok) {
          throw new Error('Failed to add item to cart');
        }
    
        alert(`${product.name} added to cart!`);
      } catch (err) {
        console.error(err);
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

  const goToCart = () => {
    router.push('/cart'); // Redirect to the cart page
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;


  

  return (
    <div>
      <h1>Products</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {products.map((product) => (
          <li key={product._id} style={{ marginBottom: '20px' }}>
            <h2>{product.name}</h2>
            <img
              src={product.image}
              alt={product.name}
              style={{ maxWidth: '200px', borderRadius: '10px' }}
            />
            <p>{product.description}</p>
            <p>${product.price}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </li>
        ))}
      </ul>

      {cart.length > 0 && (
        <button onClick={goToCart}>
          Go to Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
        </button>
      )}
    </div>
  );

  
>>>>>>> a71862242b767fa6510a951f83744c5e6a25188c
}
