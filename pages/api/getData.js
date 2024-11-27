import { getCustomSession } from './sessionCode';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      // Load the session
      const session = await getCustomSession(req, res);

      // Retrieve data from the session
      const role = session.role || 'No role set';
      const email = session.email || 'No email set';

      console.log("Role:", role);
      console.log("Email:", email);

      // Return the session data as a JSON response
      return res.status(200).json({ role, email });
    } catch (error) {
      console.error("Error fetching session data:", error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }

  // Handle unsupported methods
  res.setHeader('Allow', ['GET']);
  return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
}
