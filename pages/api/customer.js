import clientPromise from '../../../lib/mongodb';


export default async function handler(req, res) {
  const { action } = req.query;

  try {
    const client = await clientPromise;
    const db = client.db('donuts'); // Replace with your database name

    if (req.method === 'GET' && action === 'get') {
      // Fetch customer details
      const { email } = req.query;
      const customer = await db.collection('users').findOne({ email });

      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }

      res.status(200).json(customer);
    } else if (req.method === 'POST' && action === 'update') {
      // Update customer details
      const { email, name, address } = req.body;

      const result = await db.collection('users').updateOne(
        { email }, // Find customer by email
        { $set: { name, address } } // Update fields
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: 'Customer not found' });
      }

      res.status(200).json({ message: 'Customer updated successfully' });
    } else {
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error handling customer API:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
