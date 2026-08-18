import { cookies } from 'next/headers';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '27112004';
const COOKIE_NAME = 'admin_session';

export function checkAdminAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME);
  return token?.value === 'authenticated';
}

export function verifyPassword(password) {
  return password === ADMIN_PASSWORD;
}
