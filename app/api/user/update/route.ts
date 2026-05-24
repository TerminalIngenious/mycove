import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { db } from '@/src/lib/db';
import { users } from '@/src/lib/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!token?.email) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { prenom, nom } = await req.json();

  await db.update(users)
    .set({ prenom, nom })
    .where(eq(users.email, token.email as string));

  return NextResponse.json({ success: true });
}
