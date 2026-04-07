// src/components/ModalNouvelleNote.tsx
'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';

interface ModalNouvelleNoteProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (note: NoteData) => void;
}

export interface NoteData {
  title: string;
  content: string;
  tag: string;
}

export function ModalNouvelleNote({ isOpen, onClose, onSubmit }: ModalNouvelleNoteProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('Idée');
  const [loading, setLoading] = useState(false);

  const tags = [
    { id: 'idee', label: 'Idée', color: '#A78BFA' },
    { id: 'cours', label: 'Cours', color: '#22D3EE' },
    { id: 'projet', label: 'Projet', color: '#10B981' },
    { id: 'perso', label: 'Perso', color: '#F59E0B' },
    { id: 'important', label: 'Important', color: '#EF4444' },
  ];

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;

    setLoading(true);

    try {
      // Récupérer l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('User not logged in');
        setLoading(false);
        return;
      }

      // Insérer la note dans Supabase
      const { data, error } = await supabase
        .from('notes')
        .insert({
          user_id: user.id,
          title: title,
          content: content,
          tag: tag,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating note:', error);
        setLoading(false);
        return;
      }

      console.log('Note créée:', data);

      // Callback optionnel
      if (onSubmit) {
        onSubmit({
          title,
          content,
          tag,
        });
      }

      // Reset form
      setTitle('');
      setContent('');
      setTag('Idée');
      
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
            <h3 className="text-xl font-bold text-[#F8FAFC]">Nouvelle note</h3>
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
                Titre
              </label>
              <input
                type="text"
                placeholder="Ex: Idées features MyCove"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none transition-colors"
              />
            </div>

            {/* Contenu */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                Contenu
              </label>
              <textarea
                placeholder="Écris ta note ici..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none transition-colors resize-none"
              />
            </div>

            {/* Tag */}
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">
                Tag
              </label>
              <div className="flex flex-wrap gap-2">
                {tags.map((tagOption) => (
                  <button
                    key={tagOption.id}
                    onClick={() => setTag(tagOption.label)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                      tag === tagOption.label
                        ? 'border-2'
                        : 'bg-[#0F172A] border border-[#334155]'
                    }`}
                    style={{
                      backgroundColor: tag === tagOption.label ? `${tagOption.color}15` : undefined,
                      borderColor: tag === tagOption.label ? tagOption.color : undefined,
                      color: tag === tagOption.label ? tagOption.color : '#64748B',
                    }}
                  >
                    {tagOption.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Bouton Ajouter */}
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !content.trim() || loading}
              className="w-full h-12 rounded-xl bg-[#22D3EE] text-[#0F172A] text-base font-semibold hover:bg-[#1DB8D1] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
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