import { IronSessionOptions } from "iron-session";

export const sessionOptions = {
  password: process.env.SESSION_PASSWORD, // Add this to your .env and Vercel environment variables
  cookieName: "donut-shop-session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production", // Cookies are secure in production
  },
};

// Helper function to get the session
import { getIronSession } from "iron-session";

export const getSession = (req, res) => getIronSession(req, res, sessionOptions);
