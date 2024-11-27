import clientPromise from '../../lib/mongodb';
<<<<<<< HEAD
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  try {
    // Connect to the database
    const client = await clientPromise;
    const db = client.db('donuts');
    const cartCollection = db.collection('cart');

    if (req.method === 'POST') {
      const { product } = req.body;

      // Validate product data
      if (!product || !product._id) {
        return res.status(400).json({ message: 'Invalid product data' });
      }

      const productId = new ObjectId(product._id);

      // Add or update product in the cart
      const existing = await cartCollection.findOne({ _id: productId });

      if (existing) {
        await cartCollection.updateOne(
          { _id: productId },
          { $inc: { quantity: 1 } }
        );
      } else {
        await cartCollection.insertOne({
          ...product,
          _id: productId,
          quantity: 1,
        });
      }

      return res.status(200).json({ message: 'Added to cart' });
    } else if (req.method === 'GET') {
      // Fetch all cart items
      const cart = await cartCollection.find().toArray();
      return res.status(200).json(cart);
    } else if (req.method === 'DELETE') {
      const { itemId } = req.query;

      if (!itemId) {
        return res.status(400).json({ message: 'Item ID is required' });
      }

      const productId = new ObjectId(itemId);

      // Remove the item from the cart
      const result = await cartCollection.deleteOne({ _id: productId });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }

      return res.status(200).json({ message: 'Item removed from cart' });
    } else {
      // Handle unsupported methods
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('Error handling request:', error);
    return res.status(500).json({ message: 'Internal server error' });
=======

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { product } = req.body;

      if (!product || !product.name || !product.price || !product.image) {
        return res.status(400).json({ message: 'Invalid product data' });
      }

      const client = await clientPromise;
      const db = client.db('donuts'); // Replace with your database name

      // Check if the product is already in the cart
      const existingProduct = await db.collection('cart').findOne({ name: product.name });

      if (existingProduct) {
        // If it exists, increase the quantity
        await db.collection('cart').updateOne(
          { name: product.name },
          { $inc: { quantity: 1 } }
        );
      } else {
        // If it doesn't exist, add it to the cart
        await db.collection('cart').insertOne(product);
      }

      res.status(201).json({ message: 'Item added to cart' });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else if (req.method === 'GET') {
    try {
      const client = await clientPromise;
      const db = client.db('donuts');

      // Fetch all cart items
      const cart = await db.collection('cart').find().toArray();

      res.status(200).json(cart);
    } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).json({ message: 'Method Not Allowed' });
>>>>>>> a71862242b767fa6510a951f83744c5e6a25188c
  }
}
