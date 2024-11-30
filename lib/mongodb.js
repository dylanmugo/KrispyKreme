import { MongoClient } from 'mongodb';

// Load the MongoDB URI from environment variables
const uri = process.env.MONGODB_URI; // Ensure this is set in .env.local and Vercel
const options = {};

let client;
let clientPromise;

// Validate the presence of the MongoDB URI
if (!uri) {
  throw new Error(
    'MONGODB_URI=mongodb+srv://krispy_admin:pass123@cluster0.t4qoy.mongodb.net/donuts?retryWrites=true&w=majority'
  );
}

// Use global._mongoClientPromise to reuse the MongoClient instance in development
if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, always create a new client instance
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
