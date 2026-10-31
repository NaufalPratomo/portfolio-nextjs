import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/mongodb';
import crypto from 'crypto';

const COOKIE_NAME = 'admin_session';
const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || '@271104editportoM';

// Secret key for cryptographic HMAC signing of sessions
const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  (process.env.MONGODB_PASSWORD
    ? `portfolio_secret_${process.env.MONGODB_PASSWORD}`
    : 'portfolio_super_secure_admin_session_key_271104');

/**
 * Creates a cryptographically signed session token (HMAC-SHA256).
 * Contains payload with expiration and a signature that cannot be forged.
 */
export function createSessionToken() {
  const issuedAt = Date.now();
  const expiresAt = issuedAt + 7 * 24 * 60 * 60 * 1000; // 7 days
  const payloadStr = JSON.stringify({ role: 'admin', iat: issuedAt, exp: expiresAt });
  const payloadBase64 = Buffer.from(payloadStr).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  return `${payloadBase64}.${signature}`;
}

/**
 * Verifies that a session token was signed by our server and has not expired.
 * Any forged string (e.g. "authenticated") or expired token will fail.
 */
export function verifySessionToken(token) {
  if (!token || typeof token !== 'string') return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [payloadBase64, providedSignature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(payloadBase64)
    .digest('base64url');

  const sigBuffer = Buffer.from(providedSignature);
  const expBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expBuffer.length) {
    return false;
  }

  if (!crypto.timingSafeEqual(sigBuffer, expBuffer)) {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(payloadBase64, 'base64url').toString('utf8'));
    if (payload.role !== 'admin') return false;
    if (payload.exp && Date.now() > payload.exp) return false;
    return true;
  } catch {
    return false;
  }
}

export function checkAdminAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME);
  if (!token?.value) return false;
  return verifySessionToken(token.value);
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

