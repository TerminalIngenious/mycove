// src/components/ModalNouvelleTache.tsx
'use client';

import { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';

interface ModalNouvelleTacheProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (task: TaskData) => void;
}

export interface TaskData {
  name: string;
  tag: string;
  date: string;
  priority: 'basse' | 'moyenne' | 'haute';
}

export function ModalNouvelleTache({ isOpen, onClose, onSubmit }: ModalNouvelleTacheProps) {
  const [taskName, setTaskName] = useState('');
  const [tag, setTag] = useState('Étude');
  const [date, setDate] = useState('Aujourd\'hui');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState<'basse' | 'moyenne' | 'haute'>('moyenne');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!taskName.trim()) return;

    setLoading(true);

    try {
      // Récupérer l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('User not logged in');
        setLoading(false);
        return;
      }

      // Insérer la tâche dans Supabase
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: user.id,
          title: taskName,
          tag: tag,
          date: date,
          time: time, // Ajout de l'heure
          priority: priority,
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

      // Callback optionnel
      if (onSubmit) {
        onSubmit({
          name: taskName,
          tag,
          date,
          priority,
        });
      }

      // Reset form
      setTaskName('');
      setTag('Étude');
      setDate('Aujourd\'hui');
      setTime('');
      setPriority('moyenne');
      
      setLoading(false);
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
            {/* Nom de la tâche */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                Nom de la tâche
              </label>
              <input
                type="text"
                placeholder="Ex: Réviser le chapitre 3"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none transition-colors"
              />
            </div>

            {/* Tag */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                Tag
              </label>
              <div className="relative">
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] focus:border-[#22D3EE] focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option>Étude</option>
                  <option>Perso</option>
                  <option>Travail</option>
                  <option>Sport</option>
                  <option>Bien-être</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Date et Heure */}
            <div className="grid grid-cols-2 gap-3">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                  Date
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full h-12 px-4 pr-12 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] focus:border-[#22D3EE] focus:outline-none transition-colors"
                  />
                  <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
                </div>
              </div>

              {/* Heure */}
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                  Heure
                </label>
                <input
                  type="text"
                  placeholder="Ex: 9h00"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Priorité */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                Priorité
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setPriority('basse')}
                  className={`flex-1 h-11 rounded-xl text-sm font-semibold transition-all ${
                    priority === 'basse'
                      ? 'bg-[#22D3EE]/10 border-2 border-[#22D3EE] text-[#22D3EE]'
                      : 'bg-[#0F172A] border border-[#334155] text-[#64748B]'
                  }`}
                >
                  Basse
                </button>
                <button
                  onClick={() => setPriority('moyenne')}
                  className={`flex-1 h-11 rounded-xl text-sm font-semibold transition-all ${
                    priority === 'moyenne'
                      ? 'bg-[#22D3EE]/10 border-2 border-[#22D3EE] text-[#22D3EE]'
                      : 'bg-[#0F172A] border border-[#334155] text-[#64748B]'
                  }`}
                >
                  Moyenne
                </button>
                <button
                  onClick={() => setPriority('haute')}
                  className={`flex-1 h-11 rounded-xl text-sm font-semibold transition-all ${
                    priority === 'haute'
                      ? 'bg-[#22D3EE]/10 border-2 border-[#22D3EE] text-[#22D3EE]'
                      : 'bg-[#0F172A] border border-[#334155] text-[#64748B]'
                  }`}
                >
                  Haute
                </button>
              </div>
            </div>

            {/* Bouton Ajouter */}
            <button
              onClick={handleSubmit}
              disabled={!taskName.trim() || loading}
              className="w-full h-12 rounded-xl bg-[#22D3EE] text-[#0F172A] text-base font-semibold hover:bg-[#1DB8D1] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {loading ? 'Ajout en cours...' : 'Ajouter'}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </>
  );
}