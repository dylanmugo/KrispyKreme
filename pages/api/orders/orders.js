import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

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
        return res.status(400).json({ message: 'Invalid or missing Order ID' });
      }

      const order = await ordersCollection.findOne({ _id: new ObjectId(orderId) });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      return res.status(200).json(order);
    }

    if (req.method === 'POST') {
      // Create a New Order
      const { customerDetails, items, total } = req.body;

      // Validate input
      if (
        !customerDetails ||
        !customerDetails.name ||
        !customerDetails.email ||
        !customerDetails.address
      ) {
        return res.status(400).json({ message: 'Customer details are required.' });
      }

      if (!items || items.length === 0) {
        return res.status(400).json({ message: 'Order must include at least one item.' });
      }

      if (!total || total <= 0) {
        return res.status(400).json({ message: 'Order total must be greater than zero.' });
      }

      // Insert the new order
      const newOrder = {
        customerDetails,
        items,
        total,
        status: 'Pending',
        createdAt: new Date(),
      };

      const result = await ordersCollection.insertOne(newOrder);

      return res.status(201).json({ orderId: result.insertedId });
    }

    // Handle unsupported methods
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error('Error in /api/orders:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
