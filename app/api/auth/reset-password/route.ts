import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/src/lib/db';
import { users, passwordResetTokens } from '@/src/lib/schema';
import { eq } from 'drizzle-orm';
import { v4 as uuidv4 } from 'uuid';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email manquant' }, { status: 400 });

    const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user[0]) return NextResponse.json({ success: true });

    const token = uuidv4();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    await db.insert(passwordResetTokens).values({
      userId: user[0].id,
      token,
      expiresAt,
    });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    await resend.emails.send({
      from: 'MyCove <noreply@matteo-dev.fr>',
      to: email,
      subject: 'Réinitialisation de ton mot de passe MyCove',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px; background: #0F172A; color: #F8FAFC; border-radius: 16px;">
          <h1 style="color: #22D3EE; font-size: 24px; margin-bottom: 16px;">MyCove</h1>
          <h2 style="font-size: 20px; margin-bottom: 12px;">Réinitialise ton mot de passe</h2>
          <p style="color: #94A3B8; margin-bottom: 24px;">Clique sur le bouton ci-dessous pour réinitialiser ton mot de passe. Ce lien expire dans 1 heure.</p>
          <a href="${resetUrl}" style="display: inline-block; background: #22D3EE; color: #0F172A; padding: 14px 28px; border-radius: 12px; font-weight: 700; text-decoration: none;">
            Réinitialiser mon mot de passe
          </a>
          <p style="color: #64748B; font-size: 12px; margin-top: 24px;">Si tu n'as pas demandé cette réinitialisation, ignore cet email.</p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
