'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Calendar, DollarSign, MoreHorizontal, CheckSquare, TrendingUp, TrendingDown, FolderOpen } from 'lucide-react';
import { MenuPlus } from '../../src/components/MenuPlus';

export default function DashboardScreen() {
  const router = useRouter();
  const [menuPlusOpen, setMenuPlusOpen] = useState(false);
  const [user, setUser] = useState<{ prenom: string | null; email: string } | null>(null);
  const [taches, setTaches] = useState<any[]>([]);
  const [budget, setBudget] = useState({ revenus: 0, depenses: 0, solde: 0 });
  const [demarches, setDemarches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const formatTodayLabel = () => {
    const now = new Date();
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    return `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]}`;
  };

  const getDateISO = () => new Date().toISOString().split('T')[0];

  useEffect(() => {
    const loadAll = async () => {
      try {
        const [userRes, tachesRes, depensesRes, demarchesRes] = await Promise.all([
          fetch('/api/user/me'),
          fetch(`/api/taches?date=${getDateISO()}`),
          fetch('/api/depenses'),
          fetch('/api/demarches'),
        ]);

        const userData = await userRes.json();
        const tachesData = await tachesRes.json();
        const depensesData = await depensesRes.json();
        const demarchesData = await demarchesRes.json();

        setUser(userData);

        setTaches(Array.isArray(tachesData) ? tachesData : []);

        if (Array.isArray(depensesData)) {
          const revenus = depensesData.filter((d: any) => d.type === 'revenu').reduce((sum: number, d: any) => sum + parseFloat(d.montant), 0);
          const depenses = depensesData.filter((d: any) => d.type === 'depense').reduce((sum: number, d: any) => sum + parseFloat(d.montant), 0);
          setBudget({ revenus, depenses, solde: revenus - depenses });
        }

        setDemarches(Array.isArray(demarchesData) ? demarchesData : []);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    loadAll();
  }, []);

  const toggleTache = async (id: string, complete: boolean) => {
    setTaches(taches.map(t => t.id === id ? { ...t, complete: !complete } : t));
  };

  const tachesComplete = taches.filter(t => t.complete).length;
  const demarchesComplete = demarches.filter(d => d.complete).length;
  const demarchesTotal = demarches.length;
  const progressionAdmin = demarchesTotal > 0 ? Math.round((demarchesComplete / demarchesTotal) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0F172A] pb-24">
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* HEADER */}
        <div className="mb-8">
          <p className="text-base text-[#94A3B8]">{formatTodayLabel()} • Voici ton résumé</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

          {/* BUDGET */}
          <div className="bg-gradient-to-br from-[#22D3EE] to-[#1DB8D1] rounded-2xl p-6 text-[#0F172A]">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold opacity-80">Budget du mois</p>
              <button onClick={() => router.push('/budget')} className="text-xs font-bold opacity-70 hover:opacity-100">Tout voir →</button>
            </div>
            <p className="text-[40px] font-black leading-none mb-4">
              {budget.solde >= 0 ? '+' : ''}{budget.solde.toFixed(0)}€
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/20 rounded-xl p-3">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingUp size={14} />
                  <span className="text-xs font-medium">Revenus</span>
                </div>
                <p className="text-lg font-bold">{budget.revenus.toFixed(0)}€</p>
              </div>
              <div className="bg-white/20 rounded-xl p-3">
                <div className="flex items-center gap-1 mb-1">
                  <TrendingDown size={14} />
                  <span className="text-xs font-medium">Dépenses</span>
                </div>
                <p className="text-lg font-bold">{budget.depenses.toFixed(0)}€</p>
              </div>
            </div>
          </div>

          {/* TACHES DU JOUR */}
          <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155]">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckSquare size={18} className="text-[#22D3EE]" />
                <h2 className="text-base font-bold text-[#F8FAFC]">Tâches du jour</h2>
              </div>
              <button onClick={() => router.push('/planning')} className="text-xs text-[#22D3EE]">Tout voir →</button>
            </div>
            {loading ? (
              <p className="text-sm text-[#64748B] text-center py-4">Chargement...</p>
            ) : taches.length === 0 ? (
              <p className="text-sm text-[#64748B] text-center py-4">Aucune tâche aujourd'hui</p>
            ) : (
              <>
                <div className="space-y-2 mb-3">
                  {taches.slice(0, 4).map(t => (
                    <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg">
                      <button onClick={() => toggleTache(t.id, t.complete)}
                        className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${t.complete ? 'bg-[#22D3EE] border-[#22D3EE]' : 'border-[#334155]'}`}>
                        {t.complete && <svg width="8" height="6" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                      </button>
                      <p className={`text-sm flex-1 ${t.complete ? 'text-[#64748B] line-through' : 'text-[#F8FAFC]'}`}>{t.titre}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-[#64748B]">{tachesComplete}/{taches.length} complétées</p>
              </>
            )}
          </div>

          {/* ADMINISTRATIF */}
          <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155] lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FolderOpen size={18} className="text-[#22D3EE]" />
                <h2 className="text-base font-bold text-[#F8FAFC]">Démarches administratives</h2>
              </div>
              <button onClick={() => router.push('/administratif')} className="text-xs text-[#22D3EE]">Tout voir →</button>
            </div>
            {demarchesTotal === 0 ? (
              <div className="flex items-center gap-4">
                <p className="text-sm text-[#64748B]">Aucune démarche ajoutée</p>
                <button onClick={() => router.push('/administratif')}
                  className="px-4 py-2 bg-[#22D3EE]/10 border border-[#22D3EE]/30 rounded-xl text-xs text-[#22D3EE] font-semibold">
                  Commencer →
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#94A3B8]">Progression</span>
                    <span className="text-sm font-bold text-[#22D3EE]">{progressionAdmin}%</span>
                  </div>
                  <div className="h-2 bg-[#0F172A] rounded-full overflow-hidden">
                    <div className="h-full bg-[#22D3EE] rounded-full transition-all" style={{ width: `${progressionAdmin}%` }} />
                  </div>
                  <p className="text-xs text-[#64748B] mt-2">{demarchesComplete}/{demarchesTotal} démarches complétées</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1E293B] border-t border-[#334155] z-20">
        <div className="px-6 h-20 flex items-center justify-around">
          <button onClick={() => router.push('/dashboard')} className="flex flex-col items-center gap-1 text-[#22D3EE]">
            <Home size={24} /><span className="text-xs font-medium">Dashboard</span>
          </button>
          <button onClick={() => router.push('/planning')} className="flex flex-col items-center gap-1 text-[#64748B]">
            <Calendar size={24} /><span className="text-xs font-medium">Planning</span>
          </button>
          <button onClick={() => router.push('/budget')} className="flex flex-col items-center gap-1 text-[#64748B]">
            <DollarSign size={24} /><span className="text-xs font-medium">Budget</span>
          </button>
          <button onClick={() => setMenuPlusOpen(true)} className="flex flex-col items-center gap-1 text-[#64748B]">
            <div className="w-9 h-9 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center">
              <MoreHorizontal size={18} />
            </div>
            <span className="text-xs font-medium">Plus</span>
          </button>
        </div>
      </nav>

      <MenuPlus isOpen={menuPlusOpen} onClose={() => setMenuPlusOpen(false)} />
    </div>
  );
}
