// src/components/MenuPlus.tsx
'use client';

import { useRouter } from 'next/navigation';
import { 
  Target, FileText, Trophy, MapPin, User, Settings,
  X
} from 'lucide-react';

interface MenuPlusProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MenuPlus({ isOpen, onClose }: MenuPlusProps) {
  const router = useRouter();

  const menuItems = [
    {
      id: 'focus',
      label: 'Focus',
      description: 'Pomodoro & concentration',
      icon: Target,
      color: '#22D3EE',
      route: '/focus',
    },
    {
      id: 'bloc-notes',
      label: 'Bloc Notes',
      description: 'Idées & notes rapides',
      icon: FileText,
      color: '#A78BFA',
      route: '/bloc-notes',
    },
    {
      id: 'objectifs',
      label: 'Objectifs',
      description: 'Mois & année',
      icon: Trophy,
      color: '#FBBF24',
      route: '/objectifs',
    },
    {
      id: 'activites',
      label: 'Activités',
      description: 'Sorties & bons plans',
      icon: MapPin,
      color: '#F472B6',
      route: '/activites',
    },
    {
      id: 'profil',
      label: 'Profil',
      description: 'Ton compte',
      icon: User,
      color: '#F8FAFC',
      route: '/profil',
    },
    {
      id: 'parametres',
      label: 'Paramètres',
      description: 'Notifs, thème, langue',
      icon: Settings,
      color: '#94A3B8',
      route: '/parametres',
    },
  ];

  const handleNavigate = (route: string) => {
    router.push(route);
    onClose();
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
        <div className="max-w-7xl mx-auto">
          {/* Handle */}
          <div className="flex items-center justify-center pt-3 pb-2">
            <div className="w-10 h-1 bg-[#334155] rounded-full" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4">
            <h3 className="text-lg font-bold text-[#F8FAFC]">Plus</h3>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center hover:border-[#22D3EE]/50 transition-colors"
            >
              <X size={16} className="text-[#64748B]" />
            </button>
          </div>

          {/* Grid 2×3 */}
          <div className="grid grid-cols-2 gap-3 px-6 pb-8">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.route)}
                  className="flex items-start gap-3 p-4 bg-[#0F172A] rounded-xl border border-[#334155] hover:border-[#22D3EE]/50 transition-all active:scale-95"
                >
                  {/* Icon */}
                  <div 
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ 
                      backgroundColor: `${item.color}08`,
                      border: `1px solid ${item.color}15`
                    }}
                  >
                    <Icon size={20} style={{ color: item.color }} />
                  </div>

                  {/* Text */}
                  <div className="flex-1 text-left">
                    <div className="text-sm font-semibold text-[#F8FAFC] mb-0.5">
                      {item.label}
                    </div>
                    <div className="text-xs text-[#64748B] leading-snug">
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
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