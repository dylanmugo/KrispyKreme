import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { customerDetails, items, total } = req.body;

      if (!customerDetails || !items || items.length === 0 || !total) {
        return res.status(400).json({ message: 'Invalid order data' });
      }

      const client = await clientPromise;
      const db = client.db('donuts'); // Replace with your database name

      // Check if customer already exists
      const existingCustomer = await db.collection('customers').findOne({ email: customerDetails.email });

      let customerId;

      if (existingCustomer) {
        // Use existing customer
        customerId = existingCustomer._id;

        // Update customer order history
        await db.collection('customers').updateOne(
          { _id: customerId },
          { $push: { orderHistory: orderId } }
        );
      } else {
        // Create new customer
        const customerResult = await db.collection('customers').insertOne({
          ...customerDetails,
          orderHistory: [], // Initialize order history
        });

        customerId = customerResult.insertedId;
      }

      // Save the order
      const order = {
        customerId,
        items,
        total,
        createdAt: new Date(),
        status: 'Pending',
      };

      const orderResult = await db.collection('orders').insertOne(order);

      // Update customer's order history
      await db.collection('customers').updateOne(
        { _id: customerId },
        { $push: { orderHistory: orderResult.insertedId } }
      );

      res.status(201).json({ message: 'Order placed successfully', orderId: orderResult.insertedId });
    } catch (error) {
      console.error('Error placing order:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
