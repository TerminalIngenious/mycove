// app/profil/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Home, Calendar, DollarSign, 
  ChevronRight, UserCircle, Bell, Palette, Info, LogOut,
  MoreHorizontal
} from 'lucide-react';
import { MenuPlus } from '../../src/components/MenuPlus';

type NavItem = 'dashboard' | 'planning' | 'budget';

export default function ProfilScreen() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<NavItem | null>(null);
  const [menuPlusOpen, setMenuPlusOpen] = useState(false);

  const handleNavigation = (nav: NavItem) => {
    setActiveNav(nav);
    router.push(`/${nav}`);
  };

  const handleLogout = () => {
    if (confirm('Es-tu sûr de vouloir te déconnecter ?')) {
      // TODO: Logout Supabase
      console.log('Logout');
      router.push('/login');
    }
  };

  const settingsItems = [
    {
      id: 'profil',
      icon: UserCircle,
      label: 'Modifier mon profil',
      onClick: () => console.log('Modifier profil'),
    },
    {
      id: 'notifications',
      icon: Bell,
      label: 'Notifications',
      onClick: () => console.log('Notifications'),
    },
    {
      id: 'theme',
      icon: Palette,
      label: 'Thème',
      badge: 'Sombre',
      onClick: () => console.log('Thème'),
    },
    {
      id: 'about',
      icon: Info,
      label: 'À propos',
      onClick: () => console.log('À propos'),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] pb-24">
      <div className="max-w-3xl mx-auto px-6 py-8">
        
        {/* HEADER */}
        <h1 className="text-[32px] font-bold text-[#F8FAFC] mb-12">
          Profil
        </h1>

        {/* AVATAR + NOM */}
        <div className="flex flex-col items-center mb-12">
          {/* Avatar */}
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#22D3EE] to-[#1DB8D1] flex items-center justify-center mb-4">
            <span className="text-4xl font-bold text-[#0F172A]">M</span>
          </div>

          {/* Nom */}
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-1">
            Mattéo
          </h2>
          <p className="text-base text-[#94A3B8]">
            matteodevweb@gmail.com
          </p>
        </div>

        {/* SETTINGS LIST */}
        <div className="bg-[#1E293B] rounded-2xl border border-[#334155] overflow-hidden mb-6">
          {settingsItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={item.onClick}
                className={`w-full flex items-center gap-4 p-5 hover:bg-[#0F172A]/50 transition-colors ${
                  index !== settingsItems.length - 1 ? 'border-b border-[#334155]' : ''
                }`}
              >
                {/* Icon */}
                <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-[#22D3EE]" />
                </div>

                {/* Label */}
                <span className="flex-1 text-left text-base font-medium text-[#F8FAFC]">
                  {item.label}
                </span>

                {/* Badge (optionnel) */}
                {item.badge && (
                  <span className="px-3 py-1 rounded-lg text-sm font-medium bg-[#334155] text-[#94A3B8]">
                    {item.badge}
                  </span>
                )}

                {/* Chevron */}
                <ChevronRight size={20} className="text-[#64748B]" />
              </button>
            );
          })}
        </div>

        {/* BOUTON DÉCONNEXION */}
        <button
          onClick={handleLogout}
          className="w-full h-14 rounded-xl bg-transparent border-2 border-[#EF4444] text-[#EF4444] font-semibold hover:bg-[#EF4444]/10 transition-all flex items-center justify-center gap-3 mb-8"
        >
          <LogOut size={20} />
          <span>Se déconnecter</span>
        </button>

        {/* VERSION */}
        <p className="text-center text-sm text-[#64748B]">
          MyCove v1.0.0 • Mars 2026
        </p>
      </div>

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1E293B] border-t border-[#334155]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-around">
          <button
            onClick={() => handleNavigation('dashboard')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeNav === 'dashboard' ? 'text-[#22D3EE]' : 'text-[#64748B] hover:text-[#94A3B8]'
            }`}
          >
            <Home size={24} />
            <span className="text-xs font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => handleNavigation('planning')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeNav === 'planning' ? 'text-[#22D3EE]' : 'text-[#64748B] hover:text-[#94A3B8]'
            }`}
          >
            <Calendar size={24} />
            <span className="text-xs font-medium">Planning</span>
          </button>

          <button
            onClick={() => handleNavigation('budget')}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeNav === 'budget' ? 'text-[#22D3EE]' : 'text-[#64748B] hover:text-[#94A3B8]'
            }`}
          >
            <DollarSign size={24} />
            <span className="text-xs font-medium">Budget</span>
          </button>

          <button
            onClick={() => setMenuPlusOpen(true)}
            className="flex flex-col items-center gap-1 transition-colors text-[#64748B] hover:text-[#94A3B8]"
          >
            <div className="w-9 h-9 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center">
              <MoreHorizontal size={18} />
            </div>
            <span className="text-xs font-medium">Plus</span>
          </button>
        </div>
      </nav>

      {/* MENU PLUS */}
      <MenuPlus isOpen={menuPlusOpen} onClose={() => setMenuPlusOpen(false)} />
    </div>
  );
}