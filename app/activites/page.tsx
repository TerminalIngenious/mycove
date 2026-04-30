// app/activites/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Home, Calendar, DollarSign, ChevronLeft, Plus, Search,
  Film, Utensils, Palette, Trophy, PartyPopper, MapPin, Check,
  MoreHorizontal, X, Loader2
} from 'lucide-react';
import { MenuPlus } from '../../src/components/MenuPlus';
import { supabase } from '@/src/lib/supabase';

type NavItem = 'dashboard' | 'planning' | 'budget';
type FilterType = 'toutes' | 'cinema' | 'resto' | 'culture' | 'sport' | 'soirees';

interface Activite {
  id: string;
  title: string;
  description: string;
  lieu: string;
  prix: string;
  category: string;
  done: boolean;
}

const categoryIconMap: Record<string, any> = {
  cinema: Film,
  resto: Utensils,
  culture: Palette,
  sport: Trophy,
  soirees: PartyPopper,
};

const categoryColorMap: Record<string, string> = {
  cinema: '#F472B6',
  resto: '#FBBF24',
  culture: '#10B981',
  sport: '#F97316',
  soirees: '#A78BFA',
};

export default function ActivitesScreen() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<NavItem | null>(null);
  const [menuPlusOpen, setMenuPlusOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('toutes');
  const [activites, setActivites] = useState<Activite[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal ajout activité
  const [modalOpen, setModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newLieu, setNewLieu] = useState('');
  const [newPrix, setNewPrix] = useState('');
  const [newCategory, setNewCategory] = useState<FilterType>('cinema');
  const [saving, setSaving] = useState(false);

  const handleNavigation = (nav: NavItem) => {
    setActiveNav(nav);
    router.push(`/${nav}`);
  };

  const loadActivites = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) { console.error('Error loading activities:', error); setLoading(false); return; }
      setActivites(data || []);
      setLoading(false);
    } catch (err) {
      console.error('Unexpected error:', err);
      setLoading(false);
    }
  };

  useEffect(() => { loadActivites(); }, []);

  const toggleDone = async (id: string, currentDone: boolean) => {
    setActivites(activites.map(a => a.id === id ? { ...a, done: !currentDone } : a));
    await supabase.from('activities').update({ done: !currentDone }).eq('id', id);
  };

  const handleAddActivity = async () => {
    if (!newTitle.trim()) return;
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setSaving(false); return; }

      const { error } = await supabase.from('activities').insert({
        user_id: user.id,
        title: newTitle.trim(),
        description: newDescription.trim(),
        lieu: newLieu.trim(),
        prix: newPrix.trim(),
        category: newCategory,
        done: false,
      });

      if (error) { console.error('Error adding activity:', error); setSaving(false); return; }

      setNewTitle(''); setNewDescription(''); setNewLieu(''); setNewPrix(''); setNewCategory('cinema');
      setSaving(false);
      setModalOpen(false);
      loadActivites();
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  };

  const filters = [
    { id: 'toutes', label: 'Toutes' },
    { id: 'cinema', label: 'Cinéma' },
    { id: 'resto', label: 'Resto' },
    { id: 'culture', label: 'Culture' },
    { id: 'sport', label: 'Sport' },
    { id: 'soirees', label: 'Soirées' },
  ];

  const filtered = activites.filter(a => activeFilter === 'toutes' || a.category === activeFilter);
  const aFaire = filtered.filter(a => !a.done);
  const faites = filtered.filter(a => a.done);

  const ActivityCard = ({ activite, opacity = false }: { activite: Activite; opacity?: boolean }) => {
    const Icon = categoryIconMap[activite.category] || MapPin;
    const color = categoryColorMap[activite.category] || '#64748B';
    return (
      <div className={`bg-[#1E293B] rounded-xl p-4 border border-[#334155] hover:border-[#22D3EE]/50 transition-colors cursor-pointer ${opacity ? 'opacity-50' : ''}`}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}15`, border: `1px solid ${color}20` }}>
            <Icon size={20} style={{ color }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`text-base font-semibold text-[#F8FAFC] mb-1 ${opacity ? 'line-through' : ''}`}>{activite.title}</h3>
            {activite.description && <p className="text-sm text-[#94A3B8] mb-2">{activite.description}</p>}
            <div className="flex items-center gap-3 text-xs text-[#64748B]">
              {activite.lieu && <div className="flex items-center gap-1"><MapPin size={12} /><span>{activite.lieu}</span></div>}
              {activite.lieu && activite.prix && <span>•</span>}
              {activite.prix && <span>{activite.prix}</span>}
            </div>
          </div>
          <button onClick={() => toggleDone(activite.id, activite.done)}
            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-all ${activite.done ? 'bg-[#22D3EE] border-[#22D3EE]' : 'border-[#334155] hover:border-[#22D3EE]'}`}>
            {activite.done && <Check size={14} className="text-white" strokeWidth={3} />}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0F172A] pb-24">
      <div className="max-w-3xl mx-auto px-6 py-8">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()}
            className="w-10 h-10 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-center hover:border-[#22D3EE]/50 transition-colors">
            <ChevronLeft size={20} className="text-[#F8FAFC]" />
          </button>
          <h1 className="flex-1 text-center text-[28px] font-bold text-[#F8FAFC] mr-10">Activités</h1>
        </div>

        {/* FILTRES */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button key={filter.id} onClick={() => setActiveFilter(filter.id as FilterType)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeFilter === filter.id
                  ? 'bg-[#22D3EE] text-[#0F172A]'
                  : 'bg-[#1E293B] text-[#94A3B8] border border-[#334155] hover:border-[#22D3EE]/50'
              }`}>
              {filter.label}
            </button>
          ))}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="text-[#22D3EE] animate-spin" />
          </div>
        )}

        {/* VIDE */}
        {!loading && activites.length === 0 && (
          <div className="text-center py-12">
            <MapPin size={48} className="text-[#334155] mx-auto mb-4" />
            <p className="text-[#64748B] mb-4">Aucune activité pour l'instant</p>
            <button onClick={() => setModalOpen(true)}
              className="px-6 py-2 bg-[#22D3EE] text-[#0F172A] rounded-xl font-semibold hover:bg-[#1DB8D1] transition-all">
              Ajouter une activité
            </button>
          </div>
        )}

        {/* À FAIRE */}
        {!loading && aFaire.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#F8FAFC]">À faire</h2>
              <span className="text-sm text-[#64748B]">{aFaire.length} activité{aFaire.length > 1 ? 's' : ''}</span>
            </div>
            <div className="space-y-3">
              {aFaire.map(a => <ActivityCard key={a.id} activite={a} />)}
            </div>
          </div>
        )}

        {/* DÉJÀ FAIT */}
        {!loading && faites.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-[#F8FAFC] mb-4">Déjà fait</h2>
            <div className="space-y-3">
              {faites.map(a => <ActivityCard key={a.id} activite={a} opacity />)}
            </div>
          </div>
        )}
      </div>

      {/* FAB */}
      <button onClick={() => setModalOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-[#22D3EE] flex items-center justify-center shadow-lg shadow-[#22D3EE]/20 hover:scale-105 active:scale-95 transition-all z-30">
        <Plus size={24} className="text-[#0F172A]" />
      </button>

      {/* MODAL AJOUT */}
      {modalOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#1E293B] rounded-t-3xl border-t border-[#334155]">
            <div className="max-w-3xl mx-auto px-6">
              <div className="flex items-center justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-[#334155] rounded-full" />
              </div>
              <div className="flex items-center justify-between pb-6">
                <h3 className="text-xl font-bold text-[#F8FAFC]">Nouvelle activité</h3>
                <button onClick={() => setModalOpen(false)}
                  className="w-8 h-8 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center">
                  <X size={16} className="text-[#64748B]" />
                </button>
              </div>
              <div className="pb-8 space-y-4">
                <input type="text" placeholder="Titre (ex: Voir Dune 3)" value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none" />
                <input type="text" placeholder="Description (optionnel)" value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none" />
                <div className="grid grid-cols-2 gap-3">
                  <input type="text" placeholder="Lieu" value={newLieu}
                    onChange={e => setNewLieu(e.target.value)}
                    className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none" />
                  <input type="text" placeholder="Prix (ex: ~12€)" value={newPrix}
                    onChange={e => setNewPrix(e.target.value)}
                    className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none" />
                </div>
                <div className="relative">
                  <select value={newCategory} onChange={e => setNewCategory(e.target.value as FilterType)}
                    className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] focus:border-[#22D3EE] focus:outline-none appearance-none cursor-pointer">
                    <option value="cinema">Cinéma</option>
                    <option value="resto">Restaurant</option>
                    <option value="culture">Culture</option>
                    <option value="sport">Sport</option>
                    <option value="soirees">Soirées</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round"><polyline points="6 9 12 15 18 9" /></svg>
                  </div>
                </div>
                <button onClick={handleAddActivity} disabled={saving || !newTitle.trim()}
                  className="w-full h-12 rounded-xl bg-[#22D3EE] text-[#0F172A] text-sm font-semibold transition-all hover:bg-[#1DB8D1] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                  {saving ? 'Enregistrement...' : 'Ajouter'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1E293B] border-t border-[#334155]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-around">
          {[
            { nav: 'dashboard' as NavItem, icon: <Home size={24} />, label: 'Dashboard' },
            { nav: 'planning' as NavItem, icon: <Calendar size={24} />, label: 'Planning' },
            { nav: 'budget' as NavItem, icon: <DollarSign size={24} />, label: 'Budget' },
          ].map(({ nav, icon, label }) => (
            <button key={nav} onClick={() => handleNavigation(nav)}
              className={`flex flex-col items-center gap-1 transition-colors ${activeNav === nav ? 'text-[#22D3EE]' : 'text-[#64748B] hover:text-[#94A3B8]'}`}>
              {icon}
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
          <button onClick={() => setMenuPlusOpen(true)} className="flex flex-col items-center gap-1 text-[#64748B] hover:text-[#94A3B8]">
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
