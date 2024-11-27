import clientPromise from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
      const client = await clientPromise;
      const db = client.db('donuts'); // Replace with your actual database name
      const manager = await db.collection('users').findOne({ email });

      if (!manager || manager.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password.' });
      }

      // Simulate token generation (replace with real token logic if needed)
      const token = 'mocked-token-for-manager'; // Replace with JWT logic if needed

      return res.status(200).json({ token });
    } catch (error) {
      console.error('Error during manager login:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed.` });
  }
}
