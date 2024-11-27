import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { userDetails, items, total } = req.body; // Changed to match client-side request

      // Validate incoming data
      if (!userDetails || !items || items.length === 0 || total === undefined) {
        return res.status(400).json({ message: 'Invalid order data' });
      }

      // Establish database connection
      const client = await clientPromise;
      const db = client.db('donuts'); // Replace with your database name

      // Check if customer already exists
      const existingCustomer = await db
        .collection('customers')
        .findOne({ email: userDetails.email });

      let customerId;

      if (existingCustomer) {
        // Use existing customer
        customerId = existingCustomer._id;
      } else {
        // Create new customer
        const customerResult = await db.collection('customers').insertOne({
          ...userDetails,
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

      // Respond with the order ID
      res
        .status(201)
        .json({ message: 'Order placed successfully', orderId: orderResult.insertedId });
    } catch (error) {
      console.error('Error placing order:', error);
      res.status(500).json({
        message: 'Internal server error',
        error: error.message,
      });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
