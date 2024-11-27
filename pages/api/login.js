import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.error('Email or password missing in request.');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
      const client = await clientPromise;
      const db = client.db('donuts'); // Use your database name

      // Find the user by email
      const user = await db.collection('users').findOne({ email });
      if (!user) {
        console.error('User not found.');
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Directly compare plaintext passwords (not secure)
      if (password !== user.password) {
        console.error('Password mismatch.');
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Return user information (role) on successful login
      console.log('Login successful.');
      return res.status(200).json({ role: user.role });
    } catch (error) {
      console.error('Error during login:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Handle unsupported methods
  res.setHeader('Allow', ['POST']);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
