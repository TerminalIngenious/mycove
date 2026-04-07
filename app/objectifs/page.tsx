// app/objectifs/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Plus, Target, Home, Calendar, DollarSign, MoreHorizontal } from 'lucide-react';
import { ModalNouvelObjectif } from '../../src/components/ModalNouvelObjectif';
import { supabase } from '@/src/lib/supabase';

interface Goal {
  id: string;
  title: string;
  category: string;
  target_value: number;
  current_value: number;
  unit: string;
  period: 'mois' | 'annee';
  deadline?: string;
  created_at: string;
}

export default function ObjectifsScreen() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'tous' | 'mois' | 'annee'>('tous');

  // Charger les objectifs depuis Supabase
  const loadGoals = async () => {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('User not logged in');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading goals:', error);
        setLoading(false);
        return;
      }

      console.log('Objectifs chargés:', data);
      setGoals(data || []);
      setLoading(false);
      
    } catch (err) {
      console.error('Unexpected error:', err);
      setLoading(false);
    }
  };

  // Charger au montage
  useEffect(() => {
    loadGoals();
  }, []);

  // Recharger après ajout
  const handleGoalAdded = () => {
    loadGoals();
  };

  // Filtrer les objectifs
  const filteredGoals = goals.filter(goal => {
    if (activeFilter === 'tous') return true;
    return goal.period === activeFilter;
  });

  // Progression globale
  const globalProgress = goals.length > 0
    ? goals.reduce((sum, g) => sum + (g.current_value / g.target_value * 100), 0) / goals.length
    : 0;

  // Couleurs par catégorie
  const categoryColors: { [key: string]: string } = {
    'Études': '#22D3EE',
    'Travail': '#10B981',
    'Sport': '#F97316',
    'Finances': '#FBBF24',
    'Projets': '#A78BFA',
    'Bien-être': '#F472B6',
    'Autre': '#64748B',
  };

  return (
    <div className="min-h-screen bg-[#0F172A] pb-24">
      <div className="max-w-3xl mx-auto px-6 py-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[32px] font-bold text-[#F8FAFC]">
            Objectifs
          </h1>
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-lg bg-[#1E293B] border border-[#334155] flex items-center justify-center hover:border-[#22D3EE]/50 transition-colors"
          >
            <X size={18} className="text-[#64748B]" />
          </button>
        </div>

        {/* FILTRES */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveFilter('tous')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeFilter === 'tous'
                ? 'bg-[#22D3EE]/10 border-2 border-[#22D3EE] text-[#22D3EE]'
                : 'bg-[#1E293B] border border-[#334155] text-[#64748B]'
            }`}
          >
            Tous
          </button>
          <button
            onClick={() => setActiveFilter('mois')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeFilter === 'mois'
                ? 'bg-[#22D3EE]/10 border-2 border-[#22D3EE] text-[#22D3EE]'
                : 'bg-[#1E293B] border border-[#334155] text-[#64748B]'
            }`}
          >
            Ce mois
          </button>
          <button
            onClick={() => setActiveFilter('annee')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              activeFilter === 'annee'
                ? 'bg-[#22D3EE]/10 border-2 border-[#22D3EE] text-[#22D3EE]'
                : 'bg-[#1E293B] border border-[#334155] text-[#64748B]'
            }`}
          >
            Cette année
          </button>
        </div>

        {/* PROGRESSION GLOBALE */}
        {goals.length > 0 && (
          <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155] mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-[#F8FAFC]">
                Progression globale
              </h3>
              <span className="text-2xl font-bold text-[#22D3EE]">
                {globalProgress.toFixed(0)}%
              </span>
            </div>
            <div className="h-3 bg-[#0F172A] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#22D3EE] rounded-full transition-all"
                style={{ width: `${globalProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-[#64748B]">Chargement...</p>
          </div>
        )}

        {/* OBJECTIFS */}
        {!loading && filteredGoals.length === 0 && (
          <div className="text-center py-12">
            <Target size={48} className="text-[#334155] mx-auto mb-4" />
            <p className="text-[#64748B]">Aucun objectif</p>
            <button
              onClick={() => setModalOpen(true)}
              className="mt-4 px-6 py-2 bg-[#22D3EE] text-[#0F172A] rounded-xl font-semibold hover:bg-[#1DB8D1] transition-all"
            >
              Créer mon premier objectif
            </button>
          </div>
        )}

        {!loading && filteredGoals.length > 0 && (
          <div className="space-y-4">
            {filteredGoals.map((goal) => {
              const progress = (goal.current_value / goal.target_value) * 100;
              const color = categoryColors[goal.category] || '#64748B';

              return (
                <div 
                  key={goal.id}
                  className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155]"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">
                        {goal.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span 
                          className="px-2 py-1 rounded text-xs font-medium"
                          style={{ 
                            backgroundColor: `${color}20`, 
                            color: color 
                          }}
                        >
                          {goal.category}
                        </span>
                        <span className="text-xs text-[#64748B]">
                          {goal.period === 'mois' ? 'Ce mois' : 'Cette année'}
                        </span>
                        {goal.deadline && (
                          <span className="text-xs text-[#64748B]">
                            • {goal.deadline}
                          </span>
                        )}
                      </div>
                    </div>
                    <span 
                      className="text-xl font-bold"
                      style={{ color }}
                    >
                      {progress.toFixed(0)}%
                    </span>
                  </div>

                  {/* Progression */}
                  <div className="mb-3">
                    <div className="h-2 bg-[#0F172A] rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${Math.min(progress, 100)}%`,
                          backgroundColor: color
                        }}
                      />
                    </div>
                  </div>

                  {/* Valeurs */}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#94A3B8]">
                      {goal.current_value} / {goal.target_value} {goal.unit}
                    </span>
                    <span className="text-[#64748B]">
                      Reste : {goal.target_value - goal.current_value} {goal.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* FAB */}
        <button
          onClick={() => setModalOpen(true)}
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-[#22D3EE] flex items-center justify-center shadow-lg shadow-[#22D3EE]/20 hover:scale-105 active:scale-95 transition-all z-30"
        >
          <Plus size={24} className="text-[#0F172A]" />
        </button>
      </div>

      {/* MODAL */}
      <ModalNouvelObjectif 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        onSubmit={handleGoalAdded}
      />

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1E293B] border-t border-[#334155] z-20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-around">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex flex-col items-center gap-1 transition-colors text-[#64748B] hover:text-[#94A3B8]"
          >
            <Home size={24} />
            <span className="text-xs font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => router.push('/planning')}
            className="flex flex-col items-center gap-1 transition-colors text-[#64748B] hover:text-[#94A3B8]"
          >
            <Calendar size={24} />
            <span className="text-xs font-medium">Planning</span>
          </button>

          <button
            onClick={() => router.push('/budget')}
            className="flex flex-col items-center gap-1 transition-colors text-[#64748B] hover:text-[#94A3B8]"
          >
            <DollarSign size={24} />
            <span className="text-xs font-medium">Budget</span>
          </button>

          <button
            onClick={() => router.back()}
            className="flex flex-col items-center gap-1 transition-colors text-[#64748B] hover:text-[#94A3B8]"
          >
            <div className="w-9 h-9 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center">
              <MoreHorizontal size={18} />
            </div>
            <span className="text-xs font-medium">Plus</span>
          </button>
        </div>
      </nav>
    </div>
  );
}