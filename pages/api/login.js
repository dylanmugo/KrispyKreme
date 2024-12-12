// pages/api/login.js

import clientPromise from '../../lib/mongodb';
import bcrypt from 'bcryptjs';
import validator from 'validator';
import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // Extract email and password from the request body
  const { email, password } = req.body;

  // Server-side Validation
  if (
    !email ||
    !password ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return res.status(400).json({ message: 'Email and password are required and must be strings.' });
  }

  if (!email.trim() || !password.trim()) {
    return res.status(400).json({ message: 'Email and password cannot be empty.' });
  }

  if (!validator.isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format.' });
  }

  if (email.length > 100) {
    return res.status(400).json({ message: 'Email must not exceed 100 characters.' });
  }

  if (password.length < 6 || password.length > 100) {
    return res.status(400).json({ message: 'Password must be between 6 and 100 characters.' });
  }

  try {
    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db('donuts'); // Replace with your actual database name
    const usersCollection = db.collection('users');

    // Find user by email
    const user = await usersCollection.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET, // Accessing JWT_SECRET from environment variables
      { expiresIn: process.env.JWT_EXPIRES_IN || '1h' } // Accessing JWT_EXPIRES_IN from environment variables
    );

    // Set the JWT as an HTTP-only cookie
    res.setHeader(
      'Set-Cookie',
      cookie.serialize('token', token, {
        httpOnly: true, // Prevents JavaScript access
        secure: process.env.NODE_ENV === 'production', // Set to true in production
        maxAge: 60 * 60, // 1 hour in seconds
        sameSite: 'strict', // CSRF protection
        path: '/', // Cookie accessible across the entire site
      })
    );

    // Successful login response
    return res.status(200).json({ message: 'Login successful.', role: user.role });
  } catch (error) {
    console.error('Error logging in user:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}
