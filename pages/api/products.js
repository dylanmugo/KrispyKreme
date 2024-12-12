// pages/api/products.js

import clientPromise from '../../lib/mongodb';
import validator from 'validator';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Connect to the database
      const client = await clientPromise;
      const db = client.db('donuts'); // Replace with your database name
      const productsCollection = db.collection('products');

      // Fetch all products from the collection
      const products = await productsCollection.find().toArray();

      // Sanitize product data before sending
      const sanitizedProducts = products.map((product) => ({
        _id: product._id,
        name: validator.escape(product.name),
        price: product.price,
        image: validator.escape(product.image),
      }));

      // Set cache control headers to ensure fresh data for every request
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');

      // Respond with the sanitized products
      return res.status(200).json(sanitizedProducts);
    }

    // Handle unsupported methods
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error('Error handling products API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
