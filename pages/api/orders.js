import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { name, email, address } = req.body;

      if (!name || !email || !address) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      const client = await clientPromise;
      const db = client.db('donuts'); // Use your database name

      // Create the order
      const order = {
        customerDetails: { name, email, address },
        items: [], // Update this to pull cart items
        total: 0, // Replace with the total from the cart
        createdAt: new Date(),
        status: 'Pending',
      };

      const result = await db.collection('orders').insertOne(order);

      res.status(201).json({ message: 'Order placed successfully', orderId: result.insertedId });
    } catch (error) {
      console.error('Error placing order:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
