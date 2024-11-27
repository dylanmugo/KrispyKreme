<<<<<<< HEAD
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
=======
import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db('donuts'); // Replace with your database name

      const products = await db.collection('products').find().toArray();

      res.status(200).json(products); // Include image in the response
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).json({ message: 'Method Not Allowed' });
>>>>>>> a71862242b767fa6510a951f83744c5e6a25188c
  }
}
