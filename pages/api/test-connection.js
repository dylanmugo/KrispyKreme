import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('donuts'); // Ensure this matches your database name

    const result = await db.collection('products').findOne();
    res.status(200).json({ message: 'Connected successfully!', sampleProduct: result });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    res.status(500).json({ message: 'Database connection failed', error: error.message });
  }
}
