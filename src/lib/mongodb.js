import { MongoClient } from 'mongodb';
import dns from 'dns';

if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

try {
  dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);
} catch (e) {
  // Setting DNS servers may fail in restricted sandboxes, safely ignore
}

const options = {
  serverSelectionTimeoutMS: 8000,
};


let client;
let clientPromise;

function getClientPromise() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please add your Mongo URI (MONGODB_URI) to environment variables / .env.local');
  }

  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect().catch((err) => {
        global._mongoClientPromise = null;
        throw err;
      });
    }
    return global._mongoClientPromise;
  }

  if (!clientPromise) {
    client = new MongoClient(uri, options);
    clientPromise = client.connect().catch((err) => {
      clientPromise = null;
      throw err;
    });
  }
  return clientPromise;
}

export async function connectToDatabase() {
  const promise = getClientPromise();
  const client = await promise;
  const db = client.db('portfolio');
  return { client, db };
}

