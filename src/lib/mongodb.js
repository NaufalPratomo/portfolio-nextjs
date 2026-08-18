import { MongoClient } from 'mongodb';

const options = {};

let client;
let clientPromise;

function getClientPromise() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please add your Mongo URI (MONGODB_URI) to environment variables / .env.local');
  }

  if (clientPromise) return clientPromise;

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
  return clientPromise;
}

export async function connectToDatabase() {
  const promise = getClientPromise();
  const client = await promise;
  const db = client.db('portfolio');
  return { client, db };
}

