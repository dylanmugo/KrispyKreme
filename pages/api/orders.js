import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db('donuts');

  if (req.method === 'GET') {
    const { orderId } = req.query;

    // Validate the orderId
    if (!orderId || !ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: 'Invalid order ID' });
    }

    try {
      // Fetch the order from the database
      const order = await db.collection('orders').findOne({ _id: new ObjectId(orderId) });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      console.log('Fetched order:', order);
      return res.status(200).json(order);
    } catch (error) {
      console.error('Error fetching order:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { customerDetails, items } = req.body;

      if (!customerDetails || !items || items.length === 0) {
        return res.status(400).json({ message: 'Invalid order data' });
      }

      const order = {
        customerDetails,
        items,
        total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        createdAt: new Date(),
        status: 'Pending',
      };

      const result = await db.collection('orders').insertOne(order);

      return res.status(201).json({ message: 'Order placed successfully', orderId: result.insertedId });
    } catch (error) {
      console.error('Error placing order:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
