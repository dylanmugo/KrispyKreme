import { getIronSession } from 'iron-session';

export async function getCustomSession(req, res) {
  console.log("Loading session...");

  // Secure session configuration
  const sessionOptions = {
    password: "c2c8b82a45d4d5c36243eb56f64dd3b2b5c3a08e734de879b576267d13aa6c4b",

    cookieName: "donut-shop-session",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production", // Set to true in production
    },
  };

  // Initialize the session
  const session = await getIronSession(req, res, sessionOptions);

  return session;
}
