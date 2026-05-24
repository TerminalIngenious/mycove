import { NextResponse } from 'next/server';
import { auth } from '@/src/lib/auth';

export async function GET() {
  const session = await auth();
  console.log('SESSION DEBUG:', session);
  return NextResponse.json({ session });
}
