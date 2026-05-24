import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/src/lib/db';
import { users } from '@/src/lib/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Mot de passe', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await db.select().from(users).where(eq(users.email, credentials.email as string)).limit(1);
        if (!user[0]) return null;
        const passwordOk = await bcrypt.compare(credentials.password as string, user[0].passwordHash!);
        if (!passwordOk) return null;
        return { id: user[0].id, email: user[0].email, name: user[0].prenom };
      },
    }),
  ],
  pages: { signIn: '/login' },
});
