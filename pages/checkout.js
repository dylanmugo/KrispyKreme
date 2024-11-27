import { useState, useEffect } from 'react';
<<<<<<< HEAD
import { AppBar, Toolbar, Typography, Container, TextField, Button, Alert, Grid } from '@mui/material';
import { useRouter } from 'next/router';

export default function CheckoutPage() {
  const [userDetails, setUserDetails] = useState({ name: '', email: '', address: '' });
  const [cart, setCart] = useState([]); // Cart items
  const [total, setTotal] = useState(0); // Total price
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const router = useRouter();

  // Fetch the cart when the component loads
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart');
        if (!response.ok) throw new Error('Failed to fetch cart');
        const data = await response.json();
        setCart(data);

        // Calculate total
        const totalAmount = data.reduce((sum, item) => sum + item.price * item.quantity, 0);
        setTotal(totalAmount);
      } catch (err) {
        setErrorMessage(err.message);
      }
    };
=======
import { useRouter } from 'next/router';

export default function Checkout() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [customerDetails, setCustomerDetails] = useState({
    name: '',
    email: '',
    address: '',
  });
  const router = useRouter();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch('/api/cart');
        if (!res.ok) {
          throw new Error('Failed to fetch cart items');
        }
        const data = await res.json();
        setCart(data);
      } catch (err) {
        console.error(err);
        setErrorMessage('Failed to load cart items. Please try again.');
      } finally {
        setLoading(false);
      }
    };

>>>>>>> a71862242b767fa6510a951f83744c5e6a25188c
    fetchCart();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
<<<<<<< HEAD
    setUserDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    // Validate user details
    if (!userDetails.name || !userDetails.email || !userDetails.address) {
      setErrorMessage('All fields are required.');
=======
    setCustomerDetails((prevDetails) => ({ ...prevDetails, [name]: value }));
  };

  const handleOrder = async () => {
    setErrorMessage('');
    setSuccessMessage('');

    // Validate customer details
    if (!customerDetails.name || !customerDetails.email || !customerDetails.address) {
      setErrorMessage('Please fill in all customer details.');
      return;
    }

    // Validate cart
    if (cart.length === 0) {
      setErrorMessage('Your cart is empty!');
>>>>>>> a71862242b767fa6510a951f83744c5e6a25188c
      return;
    }

    try {
<<<<<<< HEAD
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userDetails,
          items: cart, // Include cart items
=======
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerDetails,
          items: cart,
>>>>>>> a71862242b767fa6510a951f83744c5e6a25188c
          total,
        }),
      });

<<<<<<< HEAD
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to place order');
      }

      const data = await response.json();
      setSuccessMessage(`Order placed successfully! Your order ID is ${data.orderId}`);
      setTimeout(() => router.push(`/confirmation?orderId=${data.orderId}`), 2000);
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <>
      {/* Orange Navigation Bar */}
      <AppBar position="static" sx={{ backgroundColor: 'orange' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
            Checkout Page
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Checkout
        </Typography>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12}>
            <TextField
              label="Name"
              name="name"
              fullWidth
              value={userDetails.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Email"
              name="email"
              fullWidth
              value={userDetails.email}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Address"
              name="address"
              fullWidth
              multiline
              rows={3}
              value={userDetails.address}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h6">Total: ${total.toFixed(2)}</Typography>
          </Grid>
          <Grid item xs={12}>
            {/* Orange Button */}
            <Button
              variant="contained"
              fullWidth
              onClick={handlePlaceOrder}
              sx={{ backgroundColor: 'orange', '&:hover': { backgroundColor: '#e68a00' } }}
            >
              Place Order
            </Button>
          </Grid>
        </Grid>
      </Container>
    </>
=======
      if (!res.ok) {
        throw new Error('Order submission failed');
      }

      const { orderId } = await res.json();

      // Redirect to the confirmation page
      router.push(`/confirmation?orderId=${orderId}`);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to place the order. Please try again.');
    }
  };

  if (loading) return <p>Loading checkout...</p>;
  if (errorMessage) return <p style={{ color: 'red' }}>{errorMessage}</p>;

  return (
    <div>
      <h1>Checkout</h1>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      <div>
        <h2>Customer Details</h2>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={customerDetails.name}
          onChange={handleInputChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={customerDetails.email}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={customerDetails.address}
          onChange={handleInputChange}
        />
      </div>
      <div>
        <h2>Cart Summary</h2>
        {cart.map((item, index) => (
          <div key={index}>
            <p>
              {item.name} x {item.quantity}
            </p>
            <p>${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <h3>Total: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</h3>
      </div>
      <button onClick={handleOrder}>Place Order</button>
    </div>
>>>>>>> a71862242b767fa6510a951f83744c5e6a25188c
  );
}
