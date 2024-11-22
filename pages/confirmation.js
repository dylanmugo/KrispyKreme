import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Confirmation() {
  const router = useRouter();
  const { orderId } = router.query; // Extract the orderId from query parameters
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`); // Fetch order details from the backend
        if (!res.ok) {
          throw new Error('Failed to fetch order details');
        }

        const data = await res.json();
        setOrder(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load order details. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Order Confirmation</h1>
      <h2>Thank you for your order!</h2>
      <p>Order ID: {orderId}</p>
      <h3>Customer Details</h3>
      <p>Name: {order.customerDetails.name}</p>
      <p>Email: {order.customerDetails.email}</p>
      <p>Address: {order.customerDetails.address}</p>
      <h3>Order Items</h3>
      <ul>
        {order.items.map((item, index) => (
          <li key={index}>
            {item.name} x {item.quantity} - ${item.price.toFixed(2)}
          </li>
        ))}
      </ul>
      <h3>Total: ${order.total.toFixed(2)}</h3>
    </div>
  );
}
