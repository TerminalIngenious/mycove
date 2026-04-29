// src/components/ModalNouvelleTache.tsx
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';

interface ModalNouvelleTacheProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  // ✅ FIX 2 : Prop pour pré-remplir la date depuis le planning
  defaultDate?: string;
}

export function ModalNouvelleTache({ isOpen, onClose, onSubmit, defaultDate }: ModalNouvelleTacheProps) {
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('Étude');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState<'haute' | 'moyenne' | 'basse'>('moyenne');
  // ✅ FIX 2 : La date utilise defaultDate si fournie, sinon aujourd'hui
  const [date, setDate] = useState(() => defaultDate || new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const tags = ['Étude', 'Travail', 'Bien-être', 'Personnel', 'Projet', 'Autre'];

  const handleSubmit = async () => {
    if (!title.trim()) return;

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.error('User not logged in');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title: title.trim(),
          tag,
          time: time || null,
          priority,
          // ✅ FIX 2 : Sauvegarder la date en BDD
          date: date,
          done: false,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', error);
        setLoading(false);
        return;
      }

      console.log('Tâche créée:', data);

      // Reset
      setTitle('');
      setTag('Étude');
      setTime('');
      setPriority('moyenne');
      setDate(defaultDate || new Date().toISOString().split('T')[0]);

      setLoading(false);
      onSubmit?.();
      onClose();
    } catch (err) {
      console.error('Unexpected error:', err);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1E293B] rounded-t-3xl border-t border-[#334155] animate-slide-up">
        <div className="max-w-3xl mx-auto px-6">
          {/* Handle */}
          <div className="flex items-center justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-[#334155] rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between pb-6">
            <h3 className="text-xl font-bold text-[#F8FAFC]">Nouvelle tâche</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center hover:border-[#22D3EE]/50 transition-colors"
            >
              <X size={16} className="text-[#64748B]" />
            </button>
          </div>

          {/* Form */}
          <div className="pb-8 space-y-4">
            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">Titre</label>
              <input
                type="text"
                placeholder="Ex: Réviser le chapitre 3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none transition-colors"
                autoFocus
              />
            </div>

            {/* Tag */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">Catégorie</label>
              <div className="relative">
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] focus:border-[#22D3EE] focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  {tags.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Heure + Date en ligne */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Heure (optionnel)</label>
                <input
                  type="text"
                  placeholder="Ex: 14h00"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none transition-colors"
                />
              </div>

              {/* ✅ FIX 2 : Champ date pré-rempli avec la date du planning */}
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] focus:border-[#22D3EE] focus:outline-none transition-colors cursor-pointer [color-scheme:dark]"
                />
              </div>
            </div>

            {/* Priorité */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">Priorité</label>
              <div className="flex gap-2">
                {([
                  { value: 'basse', label: 'Basse', color: '#10B981' },
                  { value: 'moyenne', label: 'Moyenne', color: '#F59E0B' },
                  { value: 'haute', label: 'Haute', color: '#EF4444' },
                ] as const).map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setPriority(p.value)}
                    className={`flex-1 h-10 rounded-xl text-xs font-semibold transition-all border ${
                      priority === p.value
                        ? 'border-transparent'
                        : 'border-[#334155] text-[#64748B] bg-[#0F172A]'
                    }`}
                    style={
                      priority === p.value
                        ? { backgroundColor: `${p.color}20`, color: p.color, borderColor: `${p.color}40` }
                        : {}
                    }
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={loading || !title.trim()}
              className="w-full h-12 rounded-xl bg-[#22D3EE] text-[#0F172A] text-sm font-semibold transition-all hover:bg-[#1DB8D1] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enregistrement...' : 'Ajouter la tâche'}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
