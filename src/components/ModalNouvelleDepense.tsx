// src/components/ModalNouvelleDepense.tsx
'use client';

import { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';

interface ModalNouvelleDepenseProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (expense: ExpenseData) => void;
}

export interface ExpenseData {
  amount: number;
  description: string;
  category: string;
  date: string;
  type: 'depense' | 'revenu';
}

export function ModalNouvelleDepense({ isOpen, onClose, onSubmit }: ModalNouvelleDepenseProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Nourriture');
  const [date, setDate] = useState('Aujourd\'hui');
  const [type, setType] = useState<'depense' | 'revenu'>('depense');
  const [loading, setLoading] = useState(false);

  // Catégories selon le type
  const categoriesDepense = [
    'Nourriture',
    'Transport',
    'Sorties',
    'Études',
    'Logement',
    'Shopping',
    'Santé',
    'Abonnements',
    'Autre'
  ];

  const categoriesRevenu = [
    'Travail',
    'Freelance',
    'Bourse',
    'Famille',
    'Vente',
    'Investissement',
    'Allocation',
    'Autre'
  ];

  const categories = type === 'depense' ? categoriesDepense : categoriesRevenu;

  // Mettre à jour la catégorie quand on change de type
  const handleTypeChange = (newType: 'depense' | 'revenu') => {
    setType(newType);
    setCategory(newType === 'depense' ? 'Nourriture' : 'Travail');
  };

  const handleSubmit = async () => {
    if (!amount || parseFloat(amount) <= 0 || !description.trim()) return;

    setLoading(true);

    try {
      // Récupérer l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('User not logged in');
        setLoading(false);
        return;
      }

      // Insérer la dépense/revenu dans Supabase
      const { data, error } = await supabase
        .from('expenses')
        .insert({
          user_id: user.id,
          amount: parseFloat(amount),
          description: description,
          category: category,
          date: date,
          type: type,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating expense:', error);
        setLoading(false);
        return;
      }

      console.log('Dépense/Revenu créé:', data);

      // Callback optionnel
      if (onSubmit) {
        onSubmit({
          amount: parseFloat(amount),
          description,
          category,
          date,
          type,
        });
      }

      // Reset form
      setAmount('');
      setDescription('');
      setCategory('Nourriture');
      setDate('Aujourd\'hui');
      setType('depense');
      
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

          {/* Header - Titre dynamique */}
          <div className="flex items-center justify-between pb-6">
            <h3 className="text-xl font-bold text-[#F8FAFC]">
              {type === 'depense' ? 'Nouvelle dépense' : 'Nouveau revenu'}
            </h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center hover:border-[#22D3EE]/50 transition-colors"
            >
              <X size={16} className="text-[#64748B]" />
            </button>
          </div>

          {/* Form */}
          <div className="pb-8 space-y-4">
            {/* Type - EN PREMIER */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                Type
              </label>
              <div className="flex rounded-xl overflow-hidden border border-[#334155]">
                <button
                  onClick={() => handleTypeChange('depense')}
                  className={`flex-1 h-12 text-sm font-semibold transition-all ${
                    type === 'depense'
                      ? 'bg-[#EF4444]/10 text-[#EF4444]'
                      : 'bg-[#0F172A] text-[#64748B]'
                  } border-r border-[#334155]`}
                >
                  Dépense
                </button>
                <button
                  onClick={() => handleTypeChange('revenu')}
                  className={`flex-1 h-12 text-sm font-semibold transition-all ${
                    type === 'revenu'
                      ? 'bg-[#10B981]/10 text-[#10B981]'
                      : 'bg-[#0F172A] text-[#64748B]'
                  }`}
                >
                  Revenu
                </button>
              </div>
            </div>

            {/* Montant */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                Montant
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full h-12 px-4 pr-12 bg-[#0F172A] border border-[#334155] rounded-xl text-lg font-bold text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none transition-colors"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-base font-bold text-[#94A3B8]">
                  €
                </span>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                Description
              </label>
              <input
                type="text"
                placeholder={type === 'depense' ? 'Ex: Courses Carrefour' : 'Ex: Mission Malt'}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none transition-colors"
              />
            </div>

            {/* Catégorie / Source - Label dynamique */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                {type === 'depense' ? 'Catégorie' : 'Source'}
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

            {/* Bouton Ajouter */}
            <button
              onClick={handleSubmit}
              disabled={!amount || parseFloat(amount) <= 0 || !description.trim() || loading}
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