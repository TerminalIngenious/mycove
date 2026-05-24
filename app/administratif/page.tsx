'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Calendar, DollarSign, MoreHorizontal, Plus, Trash2, CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { MenuPlus } from '../../src/components/MenuPlus';

interface Demarche {
  id: string;
  titre: string;
  categorie: string | null;
  complete: boolean;
}

const CATEGORIES = [
  {
    id: 'logement',
    label: 'Logement',
    color: '#22D3EE',
    demarches: [
      'Souscrire une assurance habitation',
      'Faire une demande APL sur CAF.fr',
      'Envoyer une attestation d\'assurance au propriétaire',
      'Faire un état des lieux d\'entrée',
    ],
  },
  {
    id: 'sante',
    label: 'Santé',
    color: '#10B981',
    demarches: [
      'Choisir sa mutuelle étudiante',
      'Mettre à jour sa carte vitale',
      'Trouver un médecin traitant',
      'S\'inscrire sur Ameli.fr',
    ],
  },
  {
    id: 'administratif',
    label: 'Administratif',
    color: '#F97316',
    demarches: [
      'Faire sa première déclaration d\'impôts',
      'Mettre à jour son adresse sur les papiers officiels',
      'Ouvrir un compte bancaire étudiant',
      'Obtenir une carte étudiant',
    ],
  },
  {
    id: 'aides',
    label: 'Aides & Bourses',
    color: '#A78BFA',
    demarches: [
      'Faire une demande de bourse CROUS',
      'S\'inscrire au CROUS pour le logement',
      'Vérifier les aides de la région',
      'Demander la prime d\'activité si éligible',
    ],
  },
  {
    id: 'transport',
    label: 'Transport',
    color: '#FBBF24',
    demarches: [
      'Obtenir une carte de transport étudiant',
      'S\'inscrire aux vélos en libre service',
      'Vérifier les réductions SNCF étudiant',
    ],
  },
];

export default function AdministratifScreen() {
  const router = useRouter();
  const [menuPlusOpen, setMenuPlusOpen] = useState(false);
  const [demarches, setDemarches] = useState<Demarche[]>([]);
  const [loading, setLoading] = useState(true);
  const [openCategories, setOpenCategories] = useState<string[]>(['logement']);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ titre: '', categorie: 'logement' });

  useEffect(() => { loadDemarches(); }, []);

  const loadDemarches = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/demarches');
      const data = await res.json();
      setDemarches(Array.isArray(data) ? data : []);
    } catch (err) {
      setDemarches([]);
    }
    setLoading(false);
  };

  const toggleCategorie = (id: string) => {
    setOpenCategories(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const addSuggestedDemarche = async (titre: string, categorieId: string) => {
    await fetch('/api/demarches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ titre, categorie: categorieId }),
    });
    loadDemarches();
  };

  const toggleComplete = async (d: Demarche) => {
    await fetch(`/api/demarches?id=${d.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...d, complete: !d.complete }),
    });
    setDemarches(demarches.map(item => item.id === d.id ? { ...item, complete: !item.complete } : item));
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/demarches?id=${id}`, { method: 'DELETE' });
    setDemarches(demarches.filter(d => d.id !== id));
  };

  const handleSubmit = async () => {
    if (!form.titre.trim()) return;
    await fetch('/api/demarches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setForm({ titre: '', categorie: 'logement' });
    setShowModal(false);
    loadDemarches();
  };

  const totalDemarches = demarches.length;
  const completedDemarches = demarches.filter(d => d.complete).length;
  const progression = totalDemarches > 0 ? Math.round((completedDemarches / totalDemarches) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#0F172A] pb-24">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-[32px] font-bold text-[#F8FAFC] mb-2">Administratif</h1>
        <p className="text-sm text-[#94A3B8] mb-6">Tes démarches de première autonomie</p>

        {/* PROGRESSION */}
        {totalDemarches > 0 && (
          <div className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155] mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-[#F8FAFC]">Progression globale</span>
              <span className="text-2xl font-bold text-[#22D3EE]">{progression}%</span>
            </div>
            <div className="h-3 bg-[#0F172A] rounded-full overflow-hidden">
              <div className="h-full bg-[#22D3EE] rounded-full transition-all duration-500"
                style={{ width: `${progression}%` }} />
            </div>
            <p className="text-xs text-[#64748B] mt-2">{completedDemarches} / {totalDemarches} démarches complétées</p>
          </div>
        )}

        {/* CATEGORIES */}
        <div className="space-y-3">
          {CATEGORIES.map(cat => {
            const catDemarches = demarches.filter(d => d.categorie === cat.id);
            const catCompleted = catDemarches.filter(d => d.complete).length;
            const isOpen = openCategories.includes(cat.id);

            return (
              <div key={cat.id} className="bg-[#1E293B] rounded-2xl border border-[#334155] overflow-hidden">
                {/* Header catégorie */}
                <button onClick={() => toggleCategorie(cat.id)}
                  className="w-full flex items-center gap-3 p-5 hover:bg-[#334155]/30 transition-colors">
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold text-[#F8FAFC]">{cat.label}</p>
                    <p className="text-xs text-[#64748B]">{catCompleted}/{catDemarches.length} complétées</p>
                  </div>
                  {catDemarches.length > 0 && (
                    <div className="w-16 h-1.5 bg-[#0F172A] rounded-full overflow-hidden mr-2">
                      <div className="h-full rounded-full transition-all"
                        style={{ width: `${catDemarches.length > 0 ? (catCompleted / catDemarches.length) * 100 : 0}%`, backgroundColor: cat.color }} />
                    </div>
                  )}
                  {isOpen ? <ChevronUp size={16} className="text-[#64748B]" /> : <ChevronDown size={16} className="text-[#64748B]" />}
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 border-t border-[#334155]">
                    {/* Démarches de l'utilisateur dans cette catégorie */}
                    {catDemarches.length > 0 && (
                      <div className="mt-4 space-y-2 mb-4">
                        {catDemarches.map(d => (
                          <div key={d.id} className="flex items-center gap-3 p-3 bg-[#0F172A] rounded-xl group">
                            <button onClick={() => toggleComplete(d)}>
                              {d.complete
                                ? <CheckCircle2 size={20} style={{ color: cat.color }} />
                                : <Circle size={20} className="text-[#334155]" />
                              }
                            </button>
                            <p className={`flex-1 text-sm ${d.complete ? 'text-[#64748B] line-through' : 'text-[#F8FAFC]'}`}>
                              {d.titre}
                            </p>
                            <button onClick={() => handleDelete(d.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <Trash2 size={14} className="text-[#EF4444]" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Suggestions */}
                    <p className="text-xs font-semibold text-[#64748B] mb-2 mt-4">Suggestions :</p>
                    <div className="space-y-1">
                      {cat.demarches.map(suggestion => {
                        const alreadyAdded = demarches.some(d => d.titre === suggestion && d.categorie === cat.id);
                        return (
                          <button key={suggestion} onClick={() => !alreadyAdded && addSuggestedDemarche(suggestion, cat.id)}
                            disabled={alreadyAdded}
                            className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                              alreadyAdded
                                ? 'text-[#334155] cursor-default'
                                : 'text-[#94A3B8] hover:bg-[#334155]/50 hover:text-[#F8FAFC]'
                            }`}>
                            <Plus size={14} className={alreadyAdded ? 'text-[#334155]' : 'text-[#22D3EE]'} />
                            {suggestion}
                            {alreadyAdded && <span className="ml-auto text-xs text-[#334155]">✓ Ajoutée</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* FAB */}
      <button onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-[#22D3EE] flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all z-30">
        <Plus size={24} className="text-[#0F172A]" />
      </button>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
          <div className="bg-[#1E293B] rounded-3xl p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-bold text-[#F8FAFC] mb-6">Nouvelle démarche</h3>

            <input value={form.titre} onChange={e => setForm({...form, titre: e.target.value})}
              placeholder="Ex: Faire ma demande CAF"
              className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none mb-3" />

            <select value={form.categorie} onChange={e => setForm({...form, categorie: e.target.value})}
              className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] focus:border-[#22D3EE] focus:outline-none mb-6">
              {CATEGORIES.map(cat => <option key={cat.id} value={cat.id}>{cat.label}</option>)}
            </select>

            <div className="flex gap-3">
              <button onClick={() => setShowModal(false)} className="flex-1 py-3 rounded-xl bg-[#334155] text-[#94A3B8] text-sm font-semibold">Annuler</button>
              <button onClick={handleSubmit} className="flex-1 py-3 rounded-xl bg-[#22D3EE] text-[#0F172A] text-sm font-semibold">Ajouter</button>
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
