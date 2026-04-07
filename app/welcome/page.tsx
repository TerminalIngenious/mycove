// app/welcome/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogoCove } from '@/src/components/Logo';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/onboarding');
    }, 2500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F172A] px-6">
      {/* Logo */}
      <div className="mb-8">
        <LogoCove size={200} />
      </div>

      {/* Texte */}
      <h1 className="mb-4 text-[40px] font-bold leading-none tracking-tight text-[#F8FAFC]">
        MyCove
      </h1>

      {/* Tagline */}
      <p className="text-base text-[#94A3B8]">
        Ton refuge étudiant
      </p>
    </div>
  );
}