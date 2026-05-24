import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/src/lib/auth';
import { db } from '@/src/lib/db';
import { demarches, users } from '@/src/lib/schema';
import { eq } from 'drizzle-orm';

async function getUser() {
  const session = await auth();
  if (!session?.user?.email) return null;
  const user = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
  return user[0] || null;
}

export async function GET() {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  try {
    const data = await db.select().from(demarches).where(eq(demarches.userId, user.id));
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  try {
    const body = await req.json();
    const newDemarche = await db.insert(demarches).values({
      userId: user.id,
      titre: body.titre,
      categorie: body.categorie || null,
      complete: false,
    }).returning();
    return NextResponse.json(newDemarche[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = await getUser();
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    const body = await req.json();
    const updated = await db.update(demarches)
      .set({ titre: body.titre, categorie: body.categorie, complete: body.complete })
      .where(eq(demarches.id, id))
      .returning();
    return NextResponse.json(updated[0]);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID manquant' }, { status: 400 });
    await db.delete(demarches).where(eq(demarches.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
