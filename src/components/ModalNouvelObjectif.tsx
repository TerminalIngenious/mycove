// src/components/ModalNouvelObjectif.tsx
'use client';

import { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';

interface ModalNouvelObjectifProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (objectif: ObjectifData) => void;
}

export interface ObjectifData {
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  period: 'mois' | 'annee';
  category: string;
  deadline: string;
}

export function ModalNouvelObjectif({ isOpen, onClose, onSubmit }: ModalNouvelObjectifProps) {
  const [title, setTitle] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [currentValue, setCurrentValue] = useState('0');
  const [unit, setUnit] = useState('');
  const [period, setPeriod] = useState<'mois' | 'annee'>('mois');
  const [category, setCategory] = useState('Études');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    'Études',
    'Travail',
    'Sport',
    'Finances',
    'Projets',
    'Bien-être',
    'Autre'
  ];

  const handleSubmit = async () => {
    if (!title.trim() || !targetValue || parseFloat(targetValue) <= 0) return;

    setLoading(true);

    try {
      // Récupérer l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('User not logged in');
        setLoading(false);
        return;
      }

      // Insérer l'objectif dans Supabase
      const { data, error } = await supabase
        .from('goals')
        .insert({
          user_id: user.id,
          title: title,
          category: category,
          target_value: parseFloat(targetValue),
          current_value: parseFloat(currentValue) || 0,
          unit: unit,
          period: period,
          deadline: deadline || null,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating goal:', error);
        setLoading(false);
        return;
      }

      console.log('Objectif créé:', data);

      // Callback optionnel
      if (onSubmit) {
        onSubmit({
          title,
          targetValue: parseFloat(targetValue),
          currentValue: parseFloat(currentValue) || 0,
          unit,
          period,
          category,
          deadline,
        });
      }

      // Reset form
      setTitle('');
      setTargetValue('');
      setCurrentValue('0');
      setUnit('');
      setPeriod('mois');
      setCategory('Études');
      setDeadline('');
      
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
            <h3 className="text-xl font-bold text-[#F8FAFC]">Nouvel objectif</h3>
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
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                Titre de l'objectif
              </label>
              <input
                type="text"
                placeholder="Ex: Finir 3 chapitres maths"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none transition-colors"
              />
            </div>

            {/* Catégorie */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                Catégorie
              </label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] focus:border-[#22D3EE] focus:outline-none transition-colors appearance-none cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Valeur cible + Unité */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                  Objectif
                </label>
                <input
                  type="number"
                  placeholder="Ex: 3"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                  Unité
                </label>
                <input
                  type="text"
                  placeholder="Ex: chapitres"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Progression actuelle */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                Progression actuelle
              </label>
              <input
                type="number"
                placeholder="0"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none transition-colors"
              />
            </div>

            {/* Période */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                Période
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setPeriod('mois')}
                  className={`flex-1 h-11 rounded-xl text-sm font-semibold transition-all ${
                    period === 'mois'
                      ? 'bg-[#22D3EE]/10 border-2 border-[#22D3EE] text-[#22D3EE]'
                      : 'bg-[#0F172A] border border-[#334155] text-[#64748B]'
                  }`}
                >
                  Ce mois
                </button>
                <button
                  onClick={() => setPeriod('annee')}
                  className={`flex-1 h-11 rounded-xl text-sm font-semibold transition-all ${
                    period === 'annee'
                      ? 'bg-[#22D3EE]/10 border-2 border-[#22D3EE] text-[#22D3EE]'
                      : 'bg-[#0F172A] border border-[#334155] text-[#64748B]'
                  }`}
                >
                  Cette année
                </button>
              </div>
            </div>

            {/* Date limite (optionnel) */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                Date limite (optionnel)
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ex: 31 Mars"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full h-12 px-4 pr-12 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none transition-colors"
                />
                <Calendar size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
              </div>
            </div>

            {/* Bouton Ajouter */}
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !targetValue || parseFloat(targetValue) <= 0 || loading}
              className="w-full h-12 rounded-xl bg-[#22D3EE] text-[#0F172A] text-base font-semibold hover:bg-[#1DB8D1] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {loading ? 'Création en cours...' : 'Créer l\'objectif'}
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