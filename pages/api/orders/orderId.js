<<<<<<< HEAD
import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  try {
    // Connect to the database
    const client = await clientPromise;
    const db = client.db('donuts');
    const ordersCollection = db.collection('orders');

    if (req.method === 'GET') {
      const { orderId } = req.query;

      // Validate orderId
      if (!orderId || !ObjectId.isValid(orderId)) {
        return res.status(400).json({ message: 'Invalid or missing Order ID' });
      }

      try {
        const order = await ordersCollection.findOne({ _id: new ObjectId(orderId) });

        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }

        return res.status(200).json(order);
      } catch (error) {
        console.error('Error fetching order:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    }

    if (req.method === 'POST') {
      const { name, email, address, items, total } = req.body;

      // Validate the input data
      if (!name || !email || !address || !items || items.length === 0 || !total) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      try {
        const result = await ordersCollection.insertOne({
          customerDetails: { name, email, address },
          items,
          total,
          status: 'Pending',
          createdAt: new Date(),
        });

        return res.status(201).json({ orderId: result.insertedId });
      } catch (error) {
        console.error('Error creating order:', error);
        return res.status(500).json({ message: 'Internal server error' });
      }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ message: 'Internal server error' });
=======
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { orderId } = req.query;

    try {
      const client = await clientPromise;
      const db = client.db('donuts'); // Replace with your database name

      // Fetch the order by ID
      const order = await db.collection('orders').findOne({ _id: new ObjectId(orderId) });

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }

      res.status(200).json(order);
    } catch (error) {
      console.error('Error fetching order details:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: 'Method Not Allowed' });
>>>>>>> a71862242b767fa6510a951f83744c5e6a25188c
  }
}
