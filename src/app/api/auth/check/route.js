import { NextResponse } from 'next/server';
import { checkAdminAuth } from '@/lib/auth';

export async function GET() {
  const isAuthenticated = checkAdminAuth();
  return NextResponse.json({ authenticated: isAuthenticated });
}
