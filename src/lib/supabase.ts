// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types pour les tables
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  education_level: string;
  created_at: string;
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  tag: string;
  date: string;
  time: string;
  priority: 'basse' | 'moyenne' | 'haute';
  done: boolean;
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'depense' | 'revenu';
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  category: string;
  target_value: number;
  current_value: number;
  unit: string;
  period: 'mois' | 'annee';
  deadline?: string;
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  tag: string;
  created_at: string;
}

export interface Activity {
  id: string;
  user_id: string;
  title: string;
  description: string;
  lieu: string;
  prix: string;
  category: string;
  done: boolean;
  created_at: string;
}

export interface Mood {
  id: string;
  user_id: string;
  mood_value: number;
  date: string;
  created_at: string;
}