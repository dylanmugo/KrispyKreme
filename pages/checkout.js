import { useState, useEffect } from 'react';
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

    fetchCart();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
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
      return;
    }

    try {
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerDetails,
          items: cart,
          total,
        }),
      });

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
  );
}
