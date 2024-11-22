import clientPromise from '../../lib/mongodb';

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
  }
}
