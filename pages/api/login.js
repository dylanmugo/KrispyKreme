import clientPromise from '../../lib/mongodb';

export default async function handler(req, res) {
<<<<<<< HEAD
  if (req.method === 'POST') {
    const { email, password } = req.body;

    // Validate input
=======
  console.log('HTTP Method:', req.method); // Log the HTTP method for debugging

  if (req.method === 'POST') {
    const { email, password } = req.body;

>>>>>>> a71862242b767fa6510a951f83744c5e6a25188c
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

<<<<<<< HEAD
      // Directly compare plaintext passwords (not secure)
=======
      // Directly compare plain-text passwords (insecure)
>>>>>>> a71862242b767fa6510a951f83744c5e6a25188c
      if (password !== user.password) {
        console.error('Password mismatch.');
        return res.status(400).json({ message: 'Invalid credentials' });
      }

<<<<<<< HEAD
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
=======
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

>>>>>>> a71862242b767fa6510a951f83744c5e6a25188c
