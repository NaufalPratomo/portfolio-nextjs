import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';
import crypto from 'crypto';

const COOKIE_NAME = 'admin_session';
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || '@271104editportoM';

export function checkAdminAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME);
  return token?.value === 'authenticated';
}

export async function verifyPassword(password) {
  if (!password || typeof password !== 'string') {
    return false;
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('admins');

    let admin = await collection.findOne({ role: 'admin' });
    if (!admin) {
      admin = await collection.findOne({});
    }
    if (!admin) {
      const altCollection = db.collection('admin');
      admin = await altCollection.findOne({ role: 'admin' }) || await altCollection.findOne({});
    }

    if (!admin || !admin.password) {
      await collection.insertOne({
        role: 'admin',
        password: DEFAULT_PASSWORD,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return password === DEFAULT_PASSWORD;
    }

    // Direct comparison with stored password
    if (admin.password === password) {
      return true;
    }

    // Hash comparison if stored as SHA-256
    const hash = crypto.createHash('sha256').update(password).digest('hex');
    if (admin.password === hash) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Failed to verify password against MongoDB:', error);
    return password === DEFAULT_PASSWORD;
  }
}

