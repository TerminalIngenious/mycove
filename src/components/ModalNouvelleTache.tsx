// src/components/ModalNouvelleTache.tsx
'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';

// Heure par défaut selon le bloc
const blockDefaultTimes: Record<string, string> = {
  matin: '9h00',
  midi: '12h00',
  aprem: '15h00',
  soir: '19h00',
};

interface TaskToEdit {
  id: string;
  title: string;
  tag: string;
  time: string;
  priority: 'haute' | 'moyenne' | 'basse';
  date: string;
}

interface ModalNouvelleTacheProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  defaultDate?: string;
  // Bloc depuis lequel on ouvre le modal (matin / midi / aprem / soir)
  defaultBlock?: 'matin' | 'midi' | 'aprem' | 'soir' | null;
  // Si fourni → mode édition
  taskToEdit?: TaskToEdit | null;
}

export function ModalNouvelleTache({
  isOpen,
  onClose,
  onSubmit,
  defaultDate,
  defaultBlock,
  taskToEdit,
}: ModalNouvelleTacheProps) {
  const isEditing = !!taskToEdit;

  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('Étude');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState<'haute' | 'moyenne' | 'basse'>('moyenne');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);

  const tags = ['Étude', 'Travail', 'Bien-être', 'Personnel', 'Projet', 'Autre'];

  // Remplir le formulaire à l'ouverture
  useEffect(() => {
    if (!isOpen) return;

    if (isEditing && taskToEdit) {
      // Mode édition : pré-remplir avec les valeurs existantes
      setTitle(taskToEdit.title);
      setTag(taskToEdit.tag);
      setTime(taskToEdit.time || '');
      setPriority(taskToEdit.priority);
      setDate(taskToEdit.date);
    } else {
      // Mode création : valeurs par défaut
      setTitle('');
      setTag('Étude');
      // Si un bloc est fourni, utiliser son heure par défaut
      setTime(defaultBlock ? blockDefaultTimes[defaultBlock] : '');
      setPriority('moyenne');
      setDate(defaultDate || new Date().toISOString().split('T')[0]);
    }
  }, [isOpen, taskToEdit, defaultDate, defaultBlock, isEditing]);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      if (isEditing && taskToEdit) {
        // Mise à jour
        const { error } = await supabase
          .from('tasks')
          .update({
            title: title.trim(),
            tag,
            time: time || null,
            priority,
            date,
          })
          .eq('id', taskToEdit.id);

        if (error) { console.error('Error updating task:', error); setLoading(false); return; }
      } else {
        // Création
        const { error } = await supabase
          .from('tasks')
          .insert({
            user_id: user.id,
            title: title.trim(),
            tag,
            time: time || null,
            priority,
            date,
            done: false,
          });

        if (error) { console.error('Error creating task:', error); setLoading(false); return; }
      }

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
      <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={onClose} />

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1E293B] rounded-t-3xl border-t border-[#334155] animate-slide-up">
        <div className="max-w-3xl mx-auto px-6">
          {/* Handle */}
          <div className="flex items-center justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-[#334155] rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between pb-6">
            <h3 className="text-xl font-bold text-[#F8FAFC]">
              {isEditing ? 'Modifier la tâche' : 'Nouvelle tâche'}
              {!isEditing && defaultBlock && (
                <span className="ml-2 text-sm font-normal text-[#64748B]">
                  — {defaultBlock === 'matin' ? 'Matin' : defaultBlock === 'midi' ? 'Midi' : defaultBlock === 'aprem' ? 'Après-midi' : 'Soir'}
                </span>
              )}
            </h3>
            <button onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center hover:border-[#22D3EE]/50 transition-colors">
              <X size={16} className="text-[#64748B]" />
            </button>
          </div>

          {/* Form */}
          <div className="pb-8 space-y-4">
            {/* Titre */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">Titre</label>
              <input type="text" placeholder="Ex: Réviser le chapitre 3" value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none transition-colors"
                autoFocus />
            </div>

            {/* Tag */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">Catégorie</label>
              <div className="relative">
                <select value={tag} onChange={(e) => setTag(e.target.value)}
                  className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] focus:border-[#22D3EE] focus:outline-none transition-colors appearance-none cursor-pointer">
                  {tags.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Heure + Date */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                  Heure {defaultBlock && !isEditing ? '' : '(optionnel)'}
                </label>
                <input type="text" placeholder="Ex: 14h00" value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none transition-colors" />
                {defaultBlock && !isEditing && (
                  <p className="text-xs text-[#64748B] mt-1">
                    Par défaut : {blockDefaultTimes[defaultBlock]}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
                  className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] focus:border-[#22D3EE] focus:outline-none transition-colors cursor-pointer [color-scheme:dark]" />
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
                  <button key={p.value} onClick={() => setPriority(p.value)}
                    className={`flex-1 h-10 rounded-xl text-xs font-semibold transition-all border ${
                      priority === p.value ? 'border-transparent' : 'border-[#334155] text-[#64748B] bg-[#0F172A]'
                    }`}
                    style={priority === p.value ? { backgroundColor: `${p.color}20`, color: p.color, borderColor: `${p.color}40` } : {}}>
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button onClick={handleSubmit} disabled={loading || !title.trim()}
              className="w-full h-12 rounded-xl bg-[#22D3EE] text-[#0F172A] text-sm font-semibold transition-all hover:bg-[#1DB8D1] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Enregistrement...' : isEditing ? 'Enregistrer les modifications' : 'Ajouter la tâche'}
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