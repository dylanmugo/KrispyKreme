// pages/api/cart.js

import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';
import validator from 'validator';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('donuts');
    const cartCollection = db.collection('cart');

    if (req.method === 'POST') {
      const { product } = req.body;

      // Validate product data
      if (
        !product ||
        !product._id ||
        !product.name ||
        !product.price ||
        !product.image ||
        typeof product.name !== 'string' ||
        typeof product.image !== 'string'
      ) {
        return res.status(400).json({ message: 'Invalid product data' });
      }

      // Further validation
      if (product.name.length > 100 || product.image.length > 200) {
        return res.status(400).json({ message: 'Input exceeds maximum allowed length.' });
      }

      if (!validator.isURL(product.image)) {
        return res.status(400).json({ message: 'Invalid image URL.' });
      }

      const productId = new ObjectId(product._id);

      // Escape inputs
      const sanitizedProduct = {
        ...product,
        name: validator.escape(product.name),
        image: validator.escape(product.image),
      };

      // Add or update product in the cart
      const existingProduct = await cartCollection.findOne({ _id: productId });

      if (existingProduct) {
        const updateResult = await cartCollection.updateOne(
          { _id: productId },
          { $inc: { quantity: 1 } }
        );

        if (updateResult.modifiedCount === 0) {
          return res.status(500).json({ message: 'Failed to update product in cart' });
        }
      } else {
        const insertResult = await cartCollection.insertOne({
          ...sanitizedProduct,
          _id: productId,
          quantity: 1,
        });

        if (!insertResult.acknowledged) {
          return res.status(500).json({ message: 'Failed to add product to cart' });
        }
      }

      return res.status(201).json({ message: 'Item added to cart' });
    }

    if (req.method === 'GET') {
      const cart = await cartCollection.find().toArray();
      return res.status(200).json(cart);
    }

    if (req.method === 'DELETE') {
      const { itemId } = req.query;

      if (!itemId || !ObjectId.isValid(itemId)) {
        return res.status(400).json({ message: 'Invalid item ID' });
      }

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
