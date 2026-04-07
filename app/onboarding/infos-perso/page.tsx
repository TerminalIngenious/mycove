// app/onboarding/infos-perso/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Calendar } from 'lucide-react';
import { MobileContainer } from '../../../src/components/MobileContainer';

export default function InfosPersoScreen() {
  const router = useRouter();
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();

    if (!prenom || !nom || !dateNaissance) {
      alert('Tous les champs sont obligatoires');
      return;
    }

    console.log('Infos perso:', { prenom, nom, dateNaissance });
    router.push('/onboarding/niveau-etudes');
  };

  return (
    <MobileContainer>
      <div className="flex min-h-screen flex-col px-6 py-16 pb-32">
        {/* Titre */}
        <h1 className="mb-3 text-[32px] font-bold text-[#F8FAFC]">
          Fais connaissance !
        </h1>

        {/* Sous-titre */}
        <p className="mb-12 text-base text-[#94A3B8]">
          On va fêter ton anniversaire 🎉
        </p>

        {/* Formulaire */}
        <form onSubmit={handleNext} className="flex flex-col gap-4">
          {/* Input Prénom */}
          <div className="flex flex-col gap-2">
            <label htmlFor="prenom" className="text-sm font-medium text-[#94A3B8]">
              Prénom
            </label>
            <input
              id="prenom"
              type="text"
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
              placeholder="Ton prénom"
              className="h-14 w-full rounded-xl bg-[#1E293B] border border-[#334155] px-4 text-base text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#22D3EE] transition-colors"
            />
          </div>

          {/* Input Nom */}
          <div className="flex flex-col gap-2">
            <label htmlFor="nom" className="text-sm font-medium text-[#94A3B8]">
              Nom
            </label>
            <input
              id="nom"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Ton nom"
              className="h-14 w-full rounded-xl bg-[#1E293B] border border-[#334155] px-4 text-base text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#22D3EE] transition-colors"
            />
          </div>

          {/* Input Date de naissance */}
          <div className="flex flex-col gap-2">
            <label htmlFor="dateNaissance" className="text-sm font-medium text-[#94A3B8]">
              Date de naissance
            </label>
            <div className="relative w-full">
              <input
                id="dateNaissance"
                type="date"
                value={dateNaissance}
                onChange={(e) => setDateNaissance(e.target.value)}
                className="h-14 w-full rounded-xl bg-[#1E293B] border border-[#334155] px-4 pr-12 text-base text-[#F8FAFC] focus:outline-none focus:border-[#22D3EE] transition-colors"
              />
              <Calendar 
                size={20} 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none"
              />
            </div>
          </div>

          {/* Bouton Suivant */}
          <button
            type="submit"
            className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[345px] h-14 rounded-xl bg-[#22D3EE] text-[#0F172A] text-base font-semibold transition-transform active:scale-95 hover:bg-[#1DB8D1]"
          >
            Suivant
          </button>
        </form>
      </div>
    </MobileContainer>
  );
}