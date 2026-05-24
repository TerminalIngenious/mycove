import { NextResponse } from 'next/server';
import { auth } from '@/src/lib/auth';
import { db } from '@/src/lib/db';
import { users } from '@/src/lib/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const user = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
  if (!user[0]) return NextResponse.json({ error: 'Introuvable' }, { status: 404 });

  return NextResponse.json({
    email: user[0].email,
    prenom: user[0].prenom,
    nom: user[0].nom,
  });
}
