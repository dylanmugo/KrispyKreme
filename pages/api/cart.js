import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('donuts');
    const cartCollection = db.collection('cart');

    if (req.method === 'POST') {
      const { product } = req.body;

      // Validate product input
      if (!product || !product._id || !product.name || !product.price) {
        return res.status(400).json({ message: 'Invalid product data' });
      }

      const productId = new ObjectId(product._id);

      // Add or update product in the cart
      const existingProduct = await cartCollection.findOne({ _id: productId });
      if (existingProduct) {
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

      return res.status(201).json({ message: 'Item added to cart' });
    }

    if (req.method === 'GET') {
      const cartItems = await cartCollection.find().toArray();
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      return res.status(200).json(cartItems);
    }

    if (req.method === 'DELETE') {
      const { itemId } = req.query;

      if (!itemId || !ObjectId.isValid(itemId)) {
        return res.status(400).json({ message: 'Invalid item ID' });
      }

      const handleAddToCart = async (product) => {
        try {
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product }),
          });
          if (!response.ok) throw new Error('Failed to add item to cart');
          console.log('Item added to cart:', product);
        } catch (err) {
          console.error(err.message);
        }
      };
      

      const productId = new ObjectId(itemId);
      const result = await cartCollection.deleteOne({ _id: productId });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Item not found in cart' });
      }

      return res.status(200).json({ message: 'Item removed from cart' });
    }

    res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error('Error handling cart API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
