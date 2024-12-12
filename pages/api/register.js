// pages/api/register.js

import clientPromise from '../../lib/mongodb'; // Ensure this path is correct
import bcrypt from 'bcryptjs';
import validator from 'validator';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  }

  // Extract email and password from the request body
  const { email, password } = req.body;

  // Log incoming data for debugging (Remove in production)
  console.log('Received registration data:', req.body);

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

    // Check if the user already exists
    const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists with this email.' });
    }

    // Hash the password using bcrypt
    const salt = await bcrypt.genSalt(10); // 10 salt rounds
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the user object
    const user = {
      email: validator.normalizeEmail(email), // Normalize the email
      password: hashedPassword, // Store the hashed password
      role: 'customer', // Assign a default role
      createdAt: new Date(),
    };

    // Insert the user into the database
    const result = await usersCollection.insertOne(user);

    if (result.acknowledged) {
      console.log('Registration Successful:', user);
      return res.status(201).json({ message: 'User registered successfully.' });
    } else {
      throw new Error('Failed to register user.');
    }
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
}
