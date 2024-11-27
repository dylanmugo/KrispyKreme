import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
  console.log('HTTP Method:', req.method); // Log the HTTP method for debugging

  if (req.method === 'POST') {
    const { email, password } = req.body;

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

      // Directly compare plain-text passwords (insecure)
      if (password !== user.password) {
        console.error('Password mismatch.');
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      console.log('Login successful.');
      res.status(200).json({ role: user.role });
    } catch (error) {
      console.error('Error during login:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
