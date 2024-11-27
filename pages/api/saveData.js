import { getCustomSession } from './sessionCode';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      // Load the session
      const session = await getCustomSession(req, res);

      // Save data into the session
      session.role = 'customer'; // Example: Saving a user role
      session.email = 'example@mail.com'; // Example: Saving an email

      await session.save(); // Save the session data
      console.log("Data saved to session");

      return res.status(200).json({ message: 'Session data saved successfully' });
    }

    // Handle unsupported methods
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
  } catch (error) {
    console.error("Error saving session data:", error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
