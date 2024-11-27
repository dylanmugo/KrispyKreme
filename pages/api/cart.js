import clientPromise from '../../lib/mongodb';
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
      if (!product || !product._id || !product.name || !product.price || !product.image) {
        return res.status(400).json({ message: 'Invalid product data' });
      }

      const productId = new ObjectId(product._id);

      // Add or update product in the cart
      const existingProduct = await cartCollection.findOne({ _id: productId });

      if (existingProduct) {
        // Increment quantity if product already exists
        await cartCollection.updateOne(
          { _id: productId },
          { $inc: { quantity: 1 } }
        );
      } else {
        // Insert new product into the cart
        await cartCollection.insertOne({
          ...product,
          _id: productId,
          quantity: 1,
        });
      }

      return res.status(201).json({ message: 'Item added to cart' });
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
  }
}
