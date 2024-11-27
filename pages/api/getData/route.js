import { getCustomSession } from '../sessionCode';

export async function GET(req, res) {
  // Load the session
  const session = await getCustomSession();

  // Retrieve data from the session
  const role = session.role; // Example: Retrieving the role
  const email = session.email; // Example: Retrieving the email

  console.log("Role:", role);
  console.log("Email:", email);

  return new Response(JSON.stringify({ role, email }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
