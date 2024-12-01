import clientPromise from '../../lib/mongodb';
import { ObjectId } from 'mongodb';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db('donuts');

    if (req.method === 'GET') {
      const { orderId } = req.query;

      if (!orderId || !ObjectId.isValid(orderId)) {
        return res.status(400).json({ message: 'Invalid or missing order ID' });
      }

      try {
        const order = await db.collection('orders').findOne({ _id: new ObjectId(orderId) });

        if (!order) {
          return res.status(404).json({ message: 'Order not found' });
        }

        console.log('Fetched order:', order);
        return res.status(200).json(order);
      } catch (error) {
        console.error('Error fetching order:', error);
        return res.status(500).json({ message: 'Internal server error while fetching order' });
      }
    }

    if (req.method === 'POST') {
      const { customerDetails, items } = req.body;

      if (!customerDetails || !customerDetails.name || !customerDetails.email || !customerDetails.address) {
        return res.status(400).json({ message: 'Invalid or missing customer details' });
      }

      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: 'Invalid or empty items in the order' });
      }

      try {
        const order = {
          customerDetails: {
            name: customerDetails.name,
            email: customerDetails.email,
            address: customerDetails.address,
          },
          items,
          total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
          createdAt: new Date(),
          status: 'Pending',
        };

        const result = await db.collection('orders').insertOne(order);

        console.log('Order placed successfully:', result.insertedId);

        // Email Configuration
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: process.env.EMAIL_PORT,
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
          },
        });

        // Send Confirmation Email
        try {
          await transporter.sendMail({
            from: `"Krispy Kreme" <${process.env.EMAIL_USER}>`,
            to: customerDetails.email,
            subject: 'Order Confirmation',
            html: `
              <h1>Thank You for Your Order!</h1>
              <p>Hi ${customerDetails.name},</p>
              <p>Your order has been placed successfully.</p>
              <p><strong>Order ID:</strong> ${result.insertedId}</p>
              <p><strong>Total:</strong> $${order.total.toFixed(2)}</p>
              <p>We’ll notify you when your order is shipped!</p>
            `,
          });

          console.log('Confirmation email sent successfully to:', customerDetails.email);
        } catch (emailError) {
          console.error('Failed to send confirmation email:', emailError);
        }

        return res.status(201).json({ message: 'Order placed successfully', orderId: result.insertedId });
      } catch (error) {
        console.error('Error placing order:', error);
        return res.status(500).json({ message: 'Internal server error while placing order' });
      }
    }

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error('Unexpected error in API handler:', error);
    return res.status(500).json({ message: 'Unexpected internal server error' });
  }
}
