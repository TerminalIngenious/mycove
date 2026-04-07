// app/budget/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Home, Calendar, DollarSign, Plus,
  TrendingUp, TrendingDown, ShoppingCart, Coffee, Film, Utensils,
  MoreHorizontal
} from 'lucide-react';
import { MenuPlus } from '../../src/components/MenuPlus';
import { ModalNouvelleDepense, ExpenseData } from '../../src/components/ModalNouvelleDepense';
import { supabase } from '@/src/lib/supabase';

type NavItem = 'dashboard' | 'planning' | 'budget';

interface Transaction {
  id: string;
  type: 'revenu' | 'depense';
  title: string;
  amount: number;
  category: string;
  icon: any;
  date: string;
}

export default function BudgetScreen() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<NavItem>('budget');
  const [menuPlusOpen, setMenuPlusOpen] = useState(false);
  const [modalDepenseOpen, setModalDepenseOpen] = useState(false);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleNavigation = (nav: NavItem) => {
    setActiveNav(nav);
    router.push(`/${nav}`);
  };

  // Charger les dépenses/revenus depuis Supabase
  const loadExpenses = async () => {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading expenses:', error);
        setLoading(false);
        return;
      }

      setExpenses(data || []);
      setLoading(false);
      
    } catch (err) {
      console.error('Unexpected error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const handleSubmitDepense = (expense: ExpenseData) => {
    console.log('Nouvelle dépense:', expense);
    // Recharger après ajout
    loadExpenses();
  };

  // Calculs
  const totalRevenus = expenses
    .filter(e => e.type === 'revenu')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalDepenses = expenses
    .filter(e => e.type === 'depense')
    .reduce((sum, e) => sum + e.amount, 0);

  const solde = totalRevenus - totalDepenses;

  // Données pour l'affichage
  const stats = {
    revenus: totalRevenus,
    depenses: totalDepenses,
    solde: solde,
  };

  // Mapper les icônes
  const iconMap: { [key: string]: any } = {
    'Nourriture': ShoppingCart,
    'Sorties': Coffee,
    'Loisirs': Film,
    'Restaurant': Utensils,
    'default': ShoppingCart,
  };

  const transactions: Transaction[] = expenses.map(exp => ({
    id: exp.id,
    type: exp.type,
    title: exp.description,
    amount: exp.type === 'revenu' ? exp.amount : -exp.amount,
    category: exp.category,
    icon: iconMap[exp.category] || (exp.type === 'revenu' ? TrendingUp : iconMap.default),
    date: exp.date,
  }));

  return (
    <div className="min-h-screen bg-[#0F172A] pb-24">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* HEADER */}
        <h1 className="text-[32px] font-bold text-[#F8FAFC] mb-8">
          Budget
        </h1>

        {/* LAYOUT 2 COLONNES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* COLONNE GAUCHE (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* STAT CARDS */}
            <div className="grid grid-cols-2 gap-4">
              {/* Revenus */}
              <div className="bg-[#1E293B] rounded-2xl p-6 border-l-4 border-[#10B981]">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingUp size={24} className="text-[#10B981]" />
                  <h3 className="text-lg font-semibold text-[#F8FAFC]">Revenus</h3>
                </div>
                <p className="text-[40px] font-bold text-[#10B981] leading-none">
                  {stats.revenus.toFixed(0)}€
                </p>
                <p className="text-sm text-[#94A3B8] mt-2">Ce mois-ci</p>
              </div>

              {/* Dépenses */}
              <div className="bg-[#1E293B] rounded-2xl p-6 border-l-4 border-[#EF4444]">
                <div className="flex items-center gap-3 mb-2">
                  <TrendingDown size={24} className="text-[#EF4444]" />
                  <h3 className="text-lg font-semibold text-[#F8FAFC]">Dépenses</h3>
                </div>
                <p className="text-[40px] font-bold text-[#EF4444] leading-none">
                  {stats.depenses.toFixed(0)}€
                </p>
                <p className="text-sm text-[#94A3B8] mt-2">Ce mois-ci</p>
              </div>
            </div>

            {/* GRAPHIQUE SIMPLE */}
            <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155]">
              <h3 className="text-lg font-semibold text-[#F8FAFC] mb-6">
                Évolution du mois
              </h3>
              
              {/* Barre de progression simple */}
              <div className="space-y-4">
                {/* Revenus bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#94A3B8]">Revenus</span>
                    <span className="text-sm font-semibold text-[#10B981]">{stats.revenus.toFixed(0)}€</span>
                  </div>
                  <div className="h-3 bg-[#0F172A] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#10B981] rounded-full transition-all"
                      style={{ width: '100%' }}
                    />
                  </div>
                </div>

                {/* Dépenses bar */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#94A3B8]">Dépenses</span>
                    <span className="text-sm font-semibold text-[#EF4444]">{stats.depenses.toFixed(0)}€</span>
                  </div>
                  <div className="h-3 bg-[#0F172A] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#EF4444] rounded-full transition-all"
                      style={{ width: `${stats.revenus > 0 ? (stats.depenses / stats.revenus) * 100 : 0}%` }}
                    />
                  </div>
                </div>

                {/* Solde */}
                <div className="pt-4 border-t border-[#334155]">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-[#F8FAFC]">Solde</span>
                    <span className={`text-2xl font-bold ${stats.solde >= 0 ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                      {stats.solde >= 0 ? '+' : ''}{stats.solde.toFixed(0)}€
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* TRANSACTIONS */}
            <div>
              <h2 className="text-xl font-bold text-[#F8FAFC] mb-4">
                Transactions récentes
              </h2>

              {loading && (
                <p className="text-sm text-[#64748B] text-center py-4">Chargement...</p>
              )}

              {!loading && transactions.length === 0 && (
                <p className="text-sm text-[#64748B] text-center py-4">Aucune transaction</p>
              )}

              <div className="space-y-3">
                {transactions.map((transaction) => {
                  const Icon = transaction.icon;
                  const isRevenu = transaction.type === 'revenu';
                  
                  return (
                    <div
                      key={transaction.id}
                      className="bg-[#1E293B] rounded-xl p-4 border border-[#334155] hover:border-[#22D3EE]/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        {/* Icon */}
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isRevenu ? 'bg-[#10B981]/20' : 'bg-[#EF4444]/20'
                        }`}>
                          <Icon size={20} className={isRevenu ? 'text-[#10B981]' : 'text-[#EF4444]'} />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <h4 className="text-base font-semibold text-[#F8FAFC] mb-1">
                            {transaction.title}
                          </h4>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-[#64748B]">{transaction.category}</span>
                            <span className="text-sm text-[#64748B]">•</span>
                            <span className="text-sm text-[#64748B]">{transaction.date}</span>
                          </div>
                        </div>

                        {/* Amount */}
                        <span className={`text-xl font-bold ${
                          isRevenu ? 'text-[#10B981]' : 'text-[#EF4444]'
                        }`}>
                          {isRevenu ? '+' : ''}{transaction.amount.toFixed(2)}€
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* COLONNE DROITE (1/3) - RÉSUMÉ */}
          <div className="space-y-6">
            
            {/* SOLDE CARD */}
            <div className="bg-gradient-to-br from-[#22D3EE] to-[#1DB8D1] rounded-2xl p-6 text-[#0F172A]">
              <p className="text-sm font-medium mb-2 opacity-80">Solde actuel</p>
              <p className="text-[48px] font-bold leading-none mb-1">
                {stats.solde >= 0 ? '+' : ''}{stats.solde.toFixed(0)}€
              </p>
              <p className="text-sm opacity-80">Ce mois-ci</p>
            </div>

            {/* OBJECTIF ÉPARGNE */}
            <div className="bg-[#1E293B] rounded-xl p-5 border border-[#334155]">
              <h3 className="text-base font-semibold text-[#F8FAFC] mb-4">
                Objectif épargne
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#94A3B8]">Économisé</span>
                  <span className="text-sm font-bold text-[#10B981]">{Math.max(0, stats.solde).toFixed(0)}€</span>
                </div>
                <div className="h-2 bg-[#0F172A] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#10B981] rounded-full"
                    style={{ width: `${Math.min(100, (Math.max(0, stats.solde) / 300) * 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#64748B]">Objectif : 300€</span>
                  <span className="text-xs font-semibold text-[#22D3EE]">
                    {Math.min(100, ((Math.max(0, stats.solde) / 300) * 100)).toFixed(0)}%
                  </span>
                </div>
              </div>
            </div>

            {/* CATÉGORIES */}
            <div className="bg-[#1E293B] rounded-xl p-5 border border-[#334155]">
              <h3 className="text-base font-semibold text-[#F8FAFC] mb-4">
                Dépenses par catégorie
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
                    <span className="text-sm text-[#F8FAFC]">Nourriture</span>
                  </div>
                  <span className="text-sm font-semibold text-[#F8FAFC]">80€</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                    <span className="text-sm text-[#F8FAFC]">Sorties</span>
                  </div>
                  <span className="text-sm font-semibold text-[#F8FAFC]">45€</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#E879F9]" />
                    <span className="text-sm text-[#F8FAFC]">Loisirs</span>
                  </div>
                  <span className="text-sm font-semibold text-[#F8FAFC]">32€</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOUTON FAB - Ouvre le modal */}
        <button 
          onClick={() => setModalDepenseOpen(true)}
          className="fixed bottom-24 right-8 w-14 h-14 rounded-full bg-[#22D3EE] text-[#0F172A] shadow-lg hover:bg-[#1DB8D1] transition-all hover:scale-110 active:scale-95 flex items-center justify-center"
        >
          <Plus size={24} strokeWidth={2.5} />
        </button>
      </div>

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1E293B] border-t border-[#334155]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-around">
          <button
            onClick={() => handleNavigation('dashboard')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeNav === 'dashboard' ? 'text-[#22D3EE]' : 'text-[#64748B] hover:text-[#94A3B8]'
            }`}
          >
            <Home size={24} />
            <span className="text-xs font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => handleNavigation('planning')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeNav === 'planning' ? 'text-[#22D3EE]' : 'text-[#64748B] hover:text-[#94A3B8]'
            }`}
          >
            <Calendar size={24} />
            <span className="text-xs font-medium">Planning</span>
          </button>

          <button
            onClick={() => handleNavigation('budget')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeNav === 'budget' ? 'text-[#22D3EE]' : 'text-[#64748B] hover:text-[#94A3B8]'
            }`}
          >
            <DollarSign size={24} />
            <span className="text-xs font-medium">Budget</span>
          </button>

          <button
            onClick={() => setMenuPlusOpen(true)}
            className="flex flex-col items-center gap-1 transition-colors text-[#64748B] hover:text-[#94A3B8]"
          >
            <div className="w-9 h-9 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center">
              <MoreHorizontal size={18} />
            </div>
            <span className="text-xs font-medium">Plus</span>
          </button>
        </div>
      </nav>

      {/* MENU PLUS */}
      <MenuPlus isOpen={menuPlusOpen} onClose={() => setMenuPlusOpen(false)} />

      {/* MODAL NOUVELLE DÉPENSE */}
      <ModalNouvelleDepense 
        isOpen={modalDepenseOpen}
        onClose={() => setModalDepenseOpen(false)}
        onSubmit={handleSubmitDepense}
      />
    </div>
  );
}