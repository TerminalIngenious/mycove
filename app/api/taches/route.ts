import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/src/lib/auth';
import { db } from '@/src/lib/db';
import { taches, users } from '@/src/lib/schema';
import { eq, and } from 'drizzle-orm';

async function getUser() {
  const session = await auth();
  if (!session?.user?.email) return null;
  const user = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
  return user[0] || null;
}

export async function GET(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');

  try {
    let data;
    if (date) {
      data = await db.select().from(taches).where(
        and(eq(taches.userId, user.id), eq(taches.date, date))
      );
    } else {
      data = await db.select().from(taches).where(eq(taches.userId, user.id));
    }
    return NextResponse.json(data);
  } catch (error) {
    console.error('GET taches error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  try {
    const body = await req.json();
    const newTache = await db.insert(taches).values({
      userId: user.id,
      titre: body.titre,
      type: body.type || 'court_terme',
      bloc: body.bloc || null,
      date: body.date || null,
      complete: false,
    }).returning();
    return NextResponse.json(newTache[0]);
  } catch (error) {
    console.error('POST taches error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    await db.delete(taches).where(eq(taches.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE taches error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
