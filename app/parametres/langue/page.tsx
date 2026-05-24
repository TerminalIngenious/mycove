// app/parametres/langue/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function LanguePage() {
  const router = useRouter();
  const [langue, setLangue] = useState<'francais' | 'english'>('francais');

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <div className="max-w-3xl mx-auto px-6 py-8">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-lg bg-[#1E293B] border border-[#334155] flex items-center justify-center hover:border-[#22D3EE]/50 transition-colors"
          >
            <ChevronLeft size={20} className="text-[#F8FAFC]" />
          </button>
          <h1 className="text-[32px] font-bold text-[#F8FAFC]">
            Langue
          </h1>
        </div>

        {/* OPTIONS */}
        <div className="space-y-3">
          
          {/* Français */}
          <button
            onClick={() => setLangue('francais')}
            className={`w-full p-5 rounded-xl border-2 transition-all ${
              langue === 'francais'
                ? 'bg-[#22D3EE]/10 border-[#22D3EE]'
                : 'bg-[#1E293B] border-[#334155] hover:border-[#22D3EE]/50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#334155] flex items-center justify-center text-2xl">
                🇫🇷
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-base font-semibold text-[#F8FAFC]">
                  Français
                </h3>
                <p className="text-sm text-[#64748B]">
                  Langue actuelle
                </p>
              </div>
              {langue === 'francais' && (
                <div className="w-6 h-6 rounded-full bg-[#22D3EE] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </div>
          </button>

          {/* English */}
          <button
            onClick={() => setLangue('english')}
            className={`w-full p-5 rounded-xl border-2 transition-all ${
              langue === 'english'
                ? 'bg-[#22D3EE]/10 border-[#22D3EE]'
                : 'bg-[#1E293B] border-[#334155] hover:border-[#22D3EE]/50'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#334155] flex items-center justify-center text-2xl">
                🇬🇧
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-base font-semibold text-[#F8FAFC]">
                  English
                </h3>
                <p className="text-sm text-[#64748B]">
                  Coming soon
                </p>
              </div>
              {langue === 'english' && (
                <div className="w-6 h-6 rounded-full bg-[#22D3EE] flex items-center justify-center">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              )}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}