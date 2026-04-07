// app/onboarding/notifications/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { Bell } from 'lucide-react';
import { MobileContainer } from '../../../src/components/MobileContainer';

export default function NotificationsScreen() {
  const router = useRouter();

  const handleActivate = async () => {
    try {
      if ('Notification' in window) {
        const permission = await Notification.requestPermission();
        console.log('Permission notifications:', permission);
      }
    } catch (error) {
      console.error('Erreur notifications:', error);
    }

    router.push('/dashboard');
  };

  const handleSkip = () => {
    router.push('/dashboard');
  };

  return (
    <MobileContainer>
      <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16">
        {/* Icône Bell */}
        <div className="mb-12 flex items-center justify-center w-20 h-20 rounded-full bg-[#22D3EE]/10">
          <Bell size={40} className="text-[#22D3EE]" />
        </div>

        {/* Titre */}
        <h1 className="mb-6 text-center text-[32px] font-bold text-[#F8FAFC]">
          Active les notifications
        </h1>

        {/* Texte descriptif */}
        <p className="mb-16 text-center text-base leading-relaxed text-[#94A3B8] max-w-[345px]">
          Reçois des rappels pour tes tâches, ton budget et ton bien-être.
          <br />
          <br />
          On te souhaite même ton anniversaire 🎉
        </p>

        {/* Bouton Activer */}
        <button
          onClick={handleActivate}
          className="w-full max-w-[345px] h-14 rounded-xl bg-[#22D3EE] text-[#0F172A] text-base font-semibold transition-transform active:scale-95 hover:bg-[#1DB8D1] mb-4"
        >
          Activer les notifications
        </button>

        {/* Lien Plus tard */}
        <button
          onClick={handleSkip}
          className="text-sm text-[#64748B] hover:text-[#94A3B8] transition-colors"
        >
          Plus tard
        </button>
      </div>
    </MobileContainer>
  );
}