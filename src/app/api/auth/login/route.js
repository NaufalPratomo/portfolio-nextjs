import { NextResponse } from 'next/server';
import { verifyPassword } from '@/lib/auth';

export async function POST(request) {
  try {
    const { password } = await request.json();
    if (verifyPassword(password)) {
      const response = NextResponse.json({ success: true, message: 'Authenticated' });
      response.cookies.set('admin_session', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/',
      });
      return response;
    }
    return NextResponse.json({ success: false, message: 'Password salah!' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
