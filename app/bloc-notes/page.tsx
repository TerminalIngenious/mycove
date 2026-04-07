// app/bloc-notes/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Plus, Search, FileText, Home, Calendar, DollarSign, MoreHorizontal } from 'lucide-react';
import { ModalNouvelleNote } from '../../src/components/ModalNouvelleNote';
import { supabase } from '@/src/lib/supabase';

interface Note {
  id: string;
  title: string;
  content: string;
  tag: string;
  created_at: string;
}

export default function BlocNotesScreen() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('Tous');

  // Charger les notes depuis Supabase
  const loadNotes = async () => {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('User not logged in');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading notes:', error);
        setLoading(false);
        return;
      }

      console.log('Notes chargées:', data);
      setNotes(data || []);
      setLoading(false);
      
    } catch (err) {
      console.error('Unexpected error:', err);
      setLoading(false);
    }
  };

  // Charger au montage
  useEffect(() => {
    loadNotes();
  }, []);

  // Recharger après ajout
  const handleNoteAdded = () => {
    loadNotes();
  };

  // Filtrer les notes
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'Tous' || note.tag === activeFilter;
    return matchesSearch && matchesFilter;
  });

  // Tags avec couleurs
  const tags = [
    { label: 'Tous', color: '#64748B' },
    { label: 'Idée', color: '#A78BFA' },
    { label: 'Cours', color: '#22D3EE' },
    { label: 'Projet', color: '#10B981' },
    { label: 'Perso', color: '#F59E0B' },
    { label: 'Important', color: '#EF4444' },
  ];

  const getTagColor = (tag: string) => {
    return tags.find(t => t.label === tag)?.color || '#64748B';
  };

  return (
    <div className="min-h-screen bg-[#0F172A] pb-24">
      <div className="max-w-3xl mx-auto px-6 py-8">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-[32px] font-bold text-[#F8FAFC]">
            Bloc Notes
          </h1>
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-lg bg-[#1E293B] border border-[#334155] flex items-center justify-center hover:border-[#22D3EE]/50 transition-colors"
          >
            <X size={18} className="text-[#64748B]" />
          </button>
        </div>

        {/* BARRE DE RECHERCHE */}
        <div className="relative mb-6">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            placeholder="Rechercher une note..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-[#1E293B] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none transition-colors"
          />
        </div>

        {/* FILTRES TAGS */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          {tags.map((tag) => (
            <button
              key={tag.label}
              onClick={() => setActiveFilter(tag.label)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeFilter === tag.label
                  ? 'border-2'
                  : 'bg-[#1E293B] border border-[#334155]'
              }`}
              style={{
                backgroundColor: activeFilter === tag.label ? `${tag.color}15` : undefined,
                borderColor: activeFilter === tag.label ? tag.color : undefined,
                color: activeFilter === tag.label ? tag.color : '#64748B',
              }}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-[#64748B]">Chargement...</p>
          </div>
        )}

        {/* NOTES */}
        {!loading && filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <FileText size={48} className="text-[#334155] mx-auto mb-4" />
            <p className="text-[#64748B]">
              {searchQuery || activeFilter !== 'Tous' 
                ? 'Aucune note trouvée' 
                : 'Aucune note'}
            </p>
            {!searchQuery && activeFilter === 'Tous' && (
              <button
                onClick={() => setModalOpen(true)}
                className="mt-4 px-6 py-2 bg-[#22D3EE] text-[#0F172A] rounded-xl font-semibold hover:bg-[#1DB8D1] transition-all"
              >
                Créer ma première note
              </button>
            )}
          </div>
        )}

        {!loading && filteredNotes.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredNotes.map((note) => {
              const tagColor = getTagColor(note.tag);
              
              return (
                <div 
                  key={note.id}
                  className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155] hover:border-[#22D3EE]/30 transition-all cursor-pointer"
                >
                  {/* Titre */}
                  <h3 className="text-base font-semibold text-[#F8FAFC] mb-2">
                    {note.title}
                  </h3>

                  {/* Contenu (preview) */}
                  <p className="text-sm text-[#94A3B8] mb-4 line-clamp-3">
                    {note.content}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <span 
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{ 
                        backgroundColor: `${tagColor}20`, 
                        color: tagColor 
                      }}
                    >
                      {note.tag}
                    </span>
                    <span className="text-xs text-[#64748B]">
                      {new Date(note.created_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short'
                      })}
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
      <ModalNouvelleNote 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        onSubmit={handleNoteAdded}
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

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}