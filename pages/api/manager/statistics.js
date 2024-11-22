import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Connect to MongoDB
      const client = await clientPromise;
      const db = client.db('donuts'); // Replace 'donuts' with your database name

      // Fetch all orders from the 'orders' collection
      const orders = await db.collection('orders').find().toArray();

      // Calculate statistics
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

      // Return the statistics
      res.status(200).json({ totalOrders, totalRevenue });
    } catch (error) {
      console.error('Error fetching statistics:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    // Allow only GET requests
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
