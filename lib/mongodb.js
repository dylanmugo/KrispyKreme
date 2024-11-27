import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI; // Ensure this is set in .env.local
const options = {};

let client;
let clientPromise;

if (!process.env.MONGODB_URI) {
  throw new Error('MONGODB_URI=mongodb+srv://krispy_admin:pass123@cluster0.t4qoy.mongodb.net/donuts?retryWrites=true&w=majority');
}

if (process.env.NODE_ENV === 'development') {
  // Use a global variable to preserve the MongoClient instance across hot reloads in development
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create a new MongoClient instance
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

