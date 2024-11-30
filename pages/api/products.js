import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Connect to the database
      const client = await clientPromise;
      const db = client.db('donuts'); // Replace with your database name
      const productsCollection = db.collection('products');

      // Fetch all products from the collection
      const products = await productsCollection.find().toArray();

      // Respond with the fetched products
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');

      return res.status(200).json(products);
    }

    // Handle unsupported methods
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  } catch (error) {
    // Handle server errors
    console.error('Error handling products API:', error.message || error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
