import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/lib/db';
import { users, passwordResetTokens } from '@/src/lib/schema';
import { eq, and, gt } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) return NextResponse.json({ error: 'Données manquantes' }, { status: 400 });

    const resetToken = await db.select().from(passwordResetTokens)
      .where(and(
        eq(passwordResetTokens.token, token),
        eq(passwordResetTokens.used, false),
        gt(passwordResetTokens.expiresAt, new Date())
      )).limit(1);

    if (!resetToken[0]) return NextResponse.json({ error: 'Lien invalide ou expiré' }, { status: 400 });

    const passwordHash = await bcrypt.hash(password, 12);
    await db.update(users).set({ passwordHash }).where(eq(users.id, resetToken[0].userId!));
    await db.update(passwordResetTokens).set({ used: true }).where(eq(passwordResetTokens.id, resetToken[0].id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
