// app/onboarding/niveau-etudes/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MobileContainer } from '../../../src/components/MobileContainer';

type NiveauOption = 'lycee' | 'licence' | 'master' | 'autre';

interface Option {
  id: NiveauOption;
  emoji: string;
  titre: string;
  sousTitre: string;
}

const options: Option[] = [
  { id: 'lycee', emoji: '🎓', titre: 'Lycée', sousTitre: 'Seconde à Terminale' },
  { id: 'licence', emoji: '📚', titre: 'Licence', sousTitre: 'L1 - L2 - L3' },
  { id: 'master', emoji: '🎯', titre: 'Master / École', sousTitre: 'M1 - M2 - Grande École' },
  { id: 'autre', emoji: '🏫', titre: 'Autre', sousTitre: 'BTS, BUT, Prépa...' },
];

export default function NiveauEtudesScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<NiveauOption | null>(null);

  const handleNext = () => {
    if (!selected) {
      alert('Sélectionne ton niveau d\'études');
      return;
    }

    console.log('Niveau études:', selected);
    router.push('/onboarding/notifications');
  };

  return (
    <MobileContainer>
      <div className="flex min-h-screen flex-col px-6 py-16 pb-32">
        {/* Titre */}
        <h1 className="mb-12 text-[32px] font-bold text-[#F8FAFC]">
          Niveau d'études
        </h1>

        {/* Options */}
        <div className="flex flex-col gap-4">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelected(option.id)}
              className={`
                h-[72px] w-full rounded-xl 
                bg-[#1E293B] border-2 
                ${selected === option.id ? 'border-[#22D3EE]' : 'border-[#334155]'}
                px-6 
                flex items-center gap-4
                transition-all
                hover:border-[#22D3EE]/50
                active:scale-[0.98]
              `}
            >
              {/* Emoji */}
              <span className="text-3xl">{option.emoji}</span>

              {/* Texte */}
              <div className="flex flex-col items-start">
                <span className="text-base font-semibold text-[#F8FAFC]">
                  {option.titre}
                </span>
                <span className="text-sm text-[#94A3B8]">
                  {option.sousTitre}
                </span>
              </div>

              {/* Indicateur sélection */}
              {selected === option.id && (
                <div className="ml-auto w-5 h-5 rounded-full bg-[#22D3EE] flex items-center justify-center">
                  <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                    <path 
                      d="M1 5L4.5 8.5L11 1.5" 
                      stroke="#0F172A" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Bouton Suivant */}
        <button
          onClick={handleNext}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[345px] h-14 rounded-xl bg-[#22D3EE] text-[#0F172A] text-base font-semibold transition-transform active:scale-95 hover:bg-[#1DB8D1]"
        >
          Suivant
        </button>
      </div>
    </MobileContainer>
  );
}