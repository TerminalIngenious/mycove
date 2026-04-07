// app/onboarding/bienvenue/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { MobileContainer } from '../../../src/components/MobileContainer';
import { LogoCove } from '../../../src/components/Logo';

export default function BienvenueScreen() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/onboarding/signup');
  };

  return (
    <MobileContainer>
      <div className="flex min-h-screen flex-col items-center px-6 py-16">
        {/* Illustration avec Logo */}
        <div className="mt-16 w-full max-w-[345px] h-[240px] rounded-[20px] bg-[#1E293B] flex items-center justify-center">
          <LogoCove size={160} />
        </div>

        {/* Titre */}
        <h1 className="mt-10 text-center text-[32px] font-bold leading-tight text-[#F8FAFC]">
          Bienvenue sur MyCove
        </h1>

        {/* Description */}
        <p className="mt-6 text-center text-base leading-relaxed text-[#94A3B8]">
          Gère ton planning, budget, focus et bien-être en un seul endroit.
        </p>

        {/* Bouton Commencer */}
        <button
          onClick={handleStart}
          className="mt-16 w-full max-w-[345px] h-14 rounded-xl bg-[#22D3EE] text-[#0F172A] text-base font-semibold transition-transform active:scale-95 hover:bg-[#1DB8D1]"
        >
          Commencer
        </button>
      </div>
    </MobileContainer>
  );
}