'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Calendar, DollarSign, Plus, TrendingUp, TrendingDown, ShoppingCart, MoreHorizontal, Trash2, Pencil } from 'lucide-react';
import { MenuPlus } from '../../src/components/MenuPlus';

interface Depense {
  id: string;
  titre: string;
  montant: string;
  categorie: string | null;
  type: string;
  date: string;
}

const CATEGORIES_DEPENSES = ['Loyer', 'Courses', 'Transport', 'Santé', 'Loisirs', 'Restaurant', 'Abonnements', 'Vêtements', 'Autre'];
const CATEGORIES_REVENUS = ['Salaire', 'Job étudiant', 'Bourse', 'APL', 'CAF', 'Virement famille', 'Freelance', 'Autre'];
const categoryColors = ['#EF4444', '#F59E0B', '#A78BFA', '#22D3EE', '#10B981', '#F472B6', '#FB923C', '#94A3B8'];

export default function BudgetScreen() {
  const router = useRouter();
  const [menuPlusOpen, setMenuPlusOpen] = useState(false);
  const [depenses, setDepenses] = useState<Depense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ titre: '', montant: '', categorie: 'Autre', type: 'depense' });

  useEffect(() => { loadDepenses(); }, []);

  const loadDepenses = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/depenses');
      const data = await res.json();
      setDepenses(Array.isArray(data) ? data : []);
    } catch (err) {
      setDepenses([]);
    }
    setLoading(false);
  };

  const handleTypeChange = (type: string) => {
    setForm({...form, type, categorie: 'Autre'});
  };

  const handleEdit = (d: Depense) => {
    setForm({ titre: d.titre, montant: d.montant, categorie: d.categorie || 'Autre', type: d.type });
    setEditingId(d.id);
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.titre || !form.montant) return;
    if (editingId) {
      await fetch(`/api/depenses?id=${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setEditingId(null);
    } else {
      await fetch('/api/depenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setForm({ titre: '', montant: '', categorie: 'Autre', type: 'depense' });
    setShowModal(false);
    loadDepenses();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/depenses?id=${id}`, { method: 'DELETE' });
    setDepenses(depenses.filter(d => d.id !== id));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({ titre: '', montant: '', categorie: 'Autre', type: 'depense' });
  };

  const totalRevenus = depenses.filter(d => d.type === 'revenu').reduce((sum, d) => sum + parseFloat(d.montant), 0);
  const totalDepenses = depenses.filter(d => d.type === 'depense').reduce((sum, d) => sum + parseFloat(d.montant), 0);
  const solde = totalRevenus - totalDepenses;

  const categoriesMap: Record<string, number> = {};
  depenses.filter(d => d.type === 'depense').forEach(d => {
    const cat = d.categorie || 'Autre';
    categoriesMap[cat] = (categoriesMap[cat] || 0) + parseFloat(d.montant);
  });
  const topCategories = Object.entries(categoriesMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const currentCategories = form.type === 'depense' ? CATEGORIES_DEPENSES : CATEGORIES_REVENUS;

  return (
    <div className="min-h-screen bg-[#0F172A] pb-24">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-[32px] font-bold text-[#F8FAFC] mb-6">Budget</h1>

        <div className="bg-gradient-to-br from-[#22D3EE] to-[#1DB8D1] rounded-2xl p-6 text-[#0F172A] mb-4">
          <p className="text-sm font-medium mb-1 opacity-80">Solde actuel</p>
          <p className="text-[48px] font-bold leading-none">{solde >= 0 ? '+' : ''}{solde.toFixed(0)}€</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-[#1E293B] rounded-2xl p-5 border-l-4 border-[#10B981]">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={20} className="text-[#10B981]" />
              <span className="text-sm text-[#94A3B8]">Revenus</span>
            </div>
            <p className="text-2xl font-bold text-[#10B981]">{totalRevenus.toFixed(0)}€</p>
          </div>
          <div className="bg-[#1E293B] rounded-2xl p-5 border-l-4 border-[#EF4444]">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown size={20} className="text-[#EF4444]" />
              <span className="text-sm text-[#94A3B8]">Dépenses</span>
            </div>
            <p className="text-2xl font-bold text-[#EF4444]">{totalDepenses.toFixed(0)}€</p>
          </div>
        </div>

        {topCategories.length > 0 && (
          <div className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155] mb-4">
            <h3 className="text-base font-semibold text-[#F8FAFC] mb-4">Par catégorie</h3>
            <div className="space-y-3">
              {topCategories.map(([cat, amount], i) => (
                <div key={cat} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryColors[i % categoryColors.length] }} />
                    <span className="text-sm text-[#F8FAFC]">{cat}</span>
                  </div>
                  <span className="text-sm font-semibold text-[#F8FAFC]">{amount.toFixed(0)}€</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <h2 className="text-lg font-bold text-[#F8FAFC] mb-3">Transactions</h2>
        {loading ? (
          <p className="text-center text-[#64748B] py-8">Chargement...</p>
        ) : depenses.length === 0 ? (
          <p className="text-center text-[#64748B] py-8">Aucune transaction</p>
        ) : (
          <div className="space-y-3">
            {depenses.map(d => (
              <div key={d.id} className="bg-[#1E293B] rounded-xl p-4 border border-[#334155] flex items-center gap-4 group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${d.type === 'revenu' ? 'bg-[#10B981]/20' : 'bg-[#EF4444]/20'}`}>
                  {d.type === 'revenu' ? <TrendingUp size={18} className="text-[#10B981]" /> : <ShoppingCart size={18} className="text-[#EF4444]" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-[#F8FAFC]">{d.titre}</p>
                  <p className="text-xs text-[#64748B]">{d.categorie || 'Autre'}</p>
                </div>
                <span className={`text-base font-bold ${d.type === 'revenu' ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                  {d.type === 'revenu' ? '+' : '-'}{parseFloat(d.montant).toFixed(2)}€
                </span>
                <button onClick={() => handleEdit(d)} className="opacity-0 group-hover:opacity-100 transition-opacity mr-1">
                  <Pencil size={14} className="text-[#22D3EE]" />
                </button>
                <button onClick={() => handleDelete(d.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={14} className="text-[#EF4444]" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#22D3EE] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all z-30">
        <Plus size={24} className="text-[#0F172A]" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-[#1E293B] rounded-3xl p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-bold text-[#F8FAFC] mb-6">
              {editingId ? 'Modifier la transaction' : 'Nouvelle transaction'}
            </h3>

            <div className="flex gap-2 mb-4">
              <button onClick={() => handleTypeChange('depense')}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${form.type === 'depense' ? 'bg-[#EF4444] text-white' : 'bg-[#0F172A] text-[#64748B]'}`}>
                Dépense
              </button>
              <button onClick={() => handleTypeChange('revenu')}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${form.type === 'revenu' ? 'bg-[#10B981] text-white' : 'bg-[#0F172A] text-[#64748B]'}`}>
                Revenu
              </button>
            </div>

            <input value={form.titre} onChange={e => setForm({...form, titre: e.target.value})}
              placeholder="Description" className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none mb-3" />

            <input type="number" value={form.montant} onChange={e => setForm({...form, montant: e.target.value})}
              placeholder="Montant (€)" className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none mb-3" />

            <select value={form.categorie} onChange={e => setForm({...form, categorie: e.target.value})}
              className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] focus:border-[#22D3EE] focus:outline-none mb-6">
              {currentCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>

            <div className="flex gap-3">
              <button onClick={handleCloseModal} className="flex-1 py-3 rounded-xl bg-[#334155] text-[#94A3B8] text-sm font-semibold">Annuler</button>
              <button onClick={handleSubmit} className="flex-1 py-3 rounded-xl bg-[#22D3EE] text-[#0F172A] text-sm font-semibold">
                {editingId ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1E293B] border-t border-[#334155] z-20">
        <div className="px-6 h-20 flex items-center justify-around">
          <button onClick={() => router.push('/dashboard')} className="flex flex-col items-center gap-1 text-[#64748B]">
            <Home size={24} /><span className="text-xs font-medium">Dashboard</span>
          </button>
          <button onClick={() => router.push('/planning')} className="flex flex-col items-center gap-1 text-[#64748B]">
            <Calendar size={24} /><span className="text-xs font-medium">Planning</span>
          </button>
          <button onClick={() => router.push('/budget')} className="flex flex-col items-center gap-1 text-[#22D3EE]">
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
