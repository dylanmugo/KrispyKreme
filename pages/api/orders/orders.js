import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { sendEmail } from '../../../lib/email'; // Ensure the email utility is correctly set up

export default async function handler(req, res) {
  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('donuts');
    const ordersCollection = db.collection('orders');

    if (req.method === 'GET') {
      // Get Order by ID
      const { orderId } = req.query;

      if (!orderId || !ObjectId.isValid(orderId)) {
        console.warn('Invalid or missing Order ID:', orderId);
        return res.status(400).json({ message: 'Invalid or missing Order ID' });
      }

      console.log('Fetching order with ID:', orderId);
      const order = await ordersCollection.findOne({ _id: new ObjectId(orderId) });

      if (!order) {
        console.warn('Order not found:', orderId);
        return res.status(404).json({ message: 'Order not found' });
      }

      console.log('Order fetched successfully:', order);
      return res.status(200).json(order);
    }

    if (req.method === 'POST') {
      // Create a New Order
      const { customerDetails, items, total } = req.body;

      console.log('Received order data:', { customerDetails, items, total });

      // Validate input
      if (
        !customerDetails ||
        !customerDetails.name ||
        !customerDetails.email ||
        !customerDetails.address
      ) {
        console.warn('Missing customer details:', customerDetails);
        return res.status(400).json({ message: 'Customer details are required.' });
      }

      if (!items || items.length === 0) {
        console.warn('Order must include at least one item:', items);
        return res.status(400).json({ message: 'Order must include at least one item.' });
      }

      if (!total || total <= 0) {
        console.warn('Invalid order total:', total);
        return res.status(400).json({ message: 'Order total must be greater than zero.' });
      }

      // Insert the new order
      const newOrder = {
        customerDetails: {
          name: customerDetails.name,
          email: customerDetails.email,
          address: customerDetails.address,
        },
        items: items.map(item => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        total: parseFloat(total).toFixed(2), // Ensure total is a fixed decimal number
        status: 'Pending',
        createdAt: new Date(),
      };

      console.log('Inserting new order into database:', newOrder);
      const result = await ordersCollection.insertOne(newOrder);

      console.log('Order created successfully with ID:', result.insertedId);

      // Send confirmation email
      try {
        console.log('Attempting to send confirmation email...');
        await sendEmail({
          to: customerDetails.email,
          subject: 'Your Krispy Kreme Order Confirmation',
          text: `Thank you for your order, ${customerDetails.name}! Your order ID is ${result.insertedId}.`,
          html: `
            <h1>Order Confirmation</h1>
            <p>Thank you for your order, ${customerDetails.name}!</p>
            <p><strong>Order ID:</strong> ${result.insertedId}</p>
            <h2>Order Summary:</h2>
            <ul>
              ${items.map(item => `<li>${item.quantity} x ${item.name} - $${item.price.toFixed(2)}</li>`).join('')}
            </ul>
            <p><strong>Total: $${newOrder.total}</strong></p>
            <p>We’ll notify you when your order is on its way!</p>
          `,
        });
        console.log('Email sent successfully to:', customerDetails.email);
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }

      return res.status(201).json({ orderId: result.insertedId });
    }

    // Handle unsupported methods
    res.setHeader('Allow', ['GET', 'POST']);
    console.warn('Unsupported HTTP method:', req.method);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error('Error in /api/orders:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
