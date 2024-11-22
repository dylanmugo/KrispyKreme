import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cart, setCart] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

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

  
}
