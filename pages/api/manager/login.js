export default function handler(req, res) {
    if (req.method === 'POST') {
      const { username, password } = req.body;
  
      // Simple hardcoded authentication (replace with secure logic)
      if (username === 'manager' && password === 'password123') {
        const token = 'mocked-token'; // Replace with real token logic (e.g., JWT)
        return res.status(200).json({ token });
      }
  
      return res.status(401).json({ message: 'Invalid username or password.' });
    } else {
      res.setHeader('Allow', ['POST']);
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
  }
  