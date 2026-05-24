'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Search, FileText, Home, Calendar, DollarSign, MoreHorizontal, Trash2, Pencil } from 'lucide-react';
import { MenuPlus } from '../../src/components/MenuPlus';

interface Note {
  id: string;
  titre: string;
  contenu: string | null;
  tag: string | null;
  createdAt: string;
}

const TAGS = [
  { label: 'Tous', color: '#64748B' },
  { label: 'Idée', color: '#A78BFA' },
  { label: 'Cours', color: '#22D3EE' },
  { label: 'Projet', color: '#10B981' },
  { label: 'Perso', color: '#F59E0B' },
  { label: 'Important', color: '#EF4444' },
];

export default function BlocNotesScreen() {
  const router = useRouter();
  const [menuPlusOpen, setMenuPlusOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ titre: '', contenu: '', tag: 'Idée' });

  useEffect(() => { loadNotes(); }, []);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notes');
      const data = await res.json();
      setNotes(Array.isArray(data) ? data : []);
    } catch (err) {
      setNotes([]);
    }
    setLoading(false);
  };

  const handleSubmit = async () => {
    if (!form.titre.trim()) return;
    if (editingId) {
      await fetch(`/api/notes?id=${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setEditingId(null);
    } else {
      await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }
    setForm({ titre: '', contenu: '', tag: 'Idée' });
    setShowModal(false);
    loadNotes();
  };

  const handleEdit = (note: Note) => {
    setForm({ titre: note.titre, contenu: note.contenu || '', tag: note.tag || 'Idée' });
    setEditingId(note.id);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/notes?id=${id}`, { method: 'DELETE' });
    setNotes(notes.filter(n => n.id !== id));
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({ titre: '', contenu: '', tag: 'Idée' });
  };

  const getTagColor = (tag: string) => TAGS.find(t => t.label === tag)?.color || '#64748B';

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.titre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (note.contenu || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'Tous' || note.tag === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#0F172A] pb-24">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-[32px] font-bold text-[#F8FAFC] mb-6">Bloc Notes</h1>

        <div className="relative mb-4">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input type="text" placeholder="Rechercher une note..." value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-[#1E293B] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none" />
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {TAGS.map(tag => (
            <button key={tag.label} onClick={() => setActiveFilter(tag.label)}
              className="px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all"
              style={{
                backgroundColor: activeFilter === tag.label ? `${tag.color}15` : '#1E293B',
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: activeFilter === tag.label ? tag.color : '#334155',
                color: activeFilter === tag.label ? tag.color : '#64748B',
              }}>
              {tag.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-[#64748B] py-12">Chargement...</p>
        ) : filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <FileText size={48} className="text-[#334155] mx-auto mb-4" />
            <p className="text-[#64748B]">{searchQuery || activeFilter !== 'Tous' ? 'Aucune note trouvée' : 'Aucune note'}</p>
            {!searchQuery && activeFilter === 'Tous' && (
              <button onClick={() => setShowModal(true)}
                className="mt-4 px-6 py-2 bg-[#22D3EE] text-[#0F172A] rounded-xl font-semibold">
                Créer ma première note
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNotes.map(note => {
              const tagColor = getTagColor(note.tag || '');
              return (
                <div key={note.id} className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155] hover:border-[#22D3EE]/30 transition-all group">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-semibold text-[#F8FAFC] flex-1">{note.titre}</h3>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(note)} className="p-1">
                        <Pencil size={14} className="text-[#22D3EE]" />
                      </button>
                      <button onClick={() => handleDelete(note.id)} className="p-1">
                        <Trash2 size={14} className="text-[#EF4444]" />
                      </button>
                    </div>
                  </div>
                  {note.contenu && <p className="text-sm text-[#94A3B8] mb-4 line-clamp-3">{note.contenu}</p>}
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-1 rounded text-xs font-medium"
                      style={{ backgroundColor: `${tagColor}20`, color: tagColor }}>
                      {note.tag}
                    </span>
                    <span className="text-xs text-[#64748B]">
                      {new Date(note.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                </div>
              );
            })}
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
              {editingId ? 'Modifier la note' : 'Nouvelle note'}
            </h3>

            <input value={form.titre} onChange={e => setForm({...form, titre: e.target.value})}
              placeholder="Titre de la note"
              className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none mb-3" />

            <textarea value={form.contenu} onChange={e => setForm({...form, contenu: e.target.value})}
              placeholder="Contenu (optionnel)" rows={4}
              className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none mb-3 resize-none" />

            <div className="flex gap-2 mb-6 flex-wrap">
              {TAGS.filter(t => t.label !== 'Tous').map(tag => (
                <button key={tag.label} onClick={() => setForm({...form, tag: tag.label})}
                  className="px-3 py-1 rounded-lg text-xs font-semibold transition-all"
                  style={{
                    backgroundColor: form.tag === tag.label ? `${tag.color}20` : '#0F172A',
                    borderWidth: 1.5,
                    borderStyle: 'solid',
                    borderColor: form.tag === tag.label ? tag.color : '#334155',
                    color: form.tag === tag.label ? tag.color : '#64748B',
                  }}>
                  {tag.label}
                </button>
              ))}
            </div>

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
