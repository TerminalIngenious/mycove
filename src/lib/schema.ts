import { pgTable, uuid, text, numeric, timestamp, boolean, date } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  nom: text('nom'),
  prenom: text('prenom'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const passwordResetTokens = pgTable('password_reset_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  used: boolean('used').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const depenses = pgTable('depenses', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  titre: text('titre').notNull(),
  montant: numeric('montant').notNull(),
  categorie: text('categorie'),
  type: text('type').default('depense'),
  date: timestamp('date').defaultNow(),
});

export const charges = pgTable('charges', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  titre: text('titre').notNull(),
  montant: numeric('montant').notNull(),
  categorie: text('categorie'),
  actif: boolean('actif').default(true),
});

export const taches = pgTable('taches', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  titre: text('titre').notNull(),
  type: text('type'),
  bloc: text('bloc'),
  date: date('date'),
  complete: boolean('complete').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

export const notes = pgTable('notes', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  titre: text('titre').notNull(),
  contenu: text('contenu'),
  tag: text('tag'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const demarches = pgTable('demarches', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  titre: text('titre').notNull(),
  categorie: text('categorie'),
  complete: boolean('complete').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});
