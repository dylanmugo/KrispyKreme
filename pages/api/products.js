// pages/api/products.js

import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  console.log(`Received ${req.method} request at /api/products`);

  if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db('donuts'); // Replace with your actual database name
      const productsCollection = db.collection('products');

      // Fetch all products
      const products = await productsCollection.find().toArray();
      console.log('GET /api/products - Products fetched:', products);

      // Respond with the fetched products
      res.status(200).json(products);
    } catch (error) {
      console.error('Error in GET /api/products:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    // Method Not Allowed
    console.log(`Method ${req.method} not allowed on /api/products`);
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }
}
