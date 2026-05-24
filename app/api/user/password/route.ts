import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/src/lib/auth';
import { db } from '@/src/lib/db';
import { users } from '@/src/lib/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { currentPassword, newPassword } = await req.json();

  const user = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
  if (!user[0]) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 });

  const passwordOk = await bcrypt.compare(currentPassword, user[0].passwordHash!);
  if (!passwordOk) return NextResponse.json({ error: 'Mot de passe actuel incorrect' }, { status: 400 });

  const newHash = await bcrypt.hash(newPassword, 12);
  await db.update(users).set({ passwordHash: newHash }).where(eq(users.email, session.user.email));

  return NextResponse.json({ success: true });
}
