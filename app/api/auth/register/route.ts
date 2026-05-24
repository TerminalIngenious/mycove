import { NextResponse } from 'next/server';
import { db } from '@/src/lib/db';
import { users } from '@/src/lib/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { email, password, prenom, nom } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Champs manquants' }, { status: 400 });
    }

    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existing[0]) {
      return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const newUser = await db
      .insert(users)
      .values({ email, passwordHash, prenom: prenom || null, nom: nom || null })
      .returning();

    return NextResponse.json({ success: true, user: { id: newUser[0].id, email: newUser[0].email } });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
