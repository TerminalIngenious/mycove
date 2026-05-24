'use client';

import { useRouter } from 'next/navigation';
import { User, Settings, Bell, Palette, Info, LogOut, Home, Calendar, DollarSign, MoreHorizontal } from 'lucide-react';
import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { MenuPlus } from '../../src/components/MenuPlus';

export default function ProfilScreen() {
  const router = useRouter();
  const [menuPlusOpen, setMenuPlusOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; prenom: string | null; nom: string | null } | null>(null);

  useEffect(() => {
    fetch('/api/user/me')
      .then(res => res.json())
      .then(data => setUser(data))
      .catch(console.error);
  }, []);

  const handleLogout = async () => {
    if (confirm('Es-tu sûr de vouloir te déconnecter ?')) {
      await signOut({ callbackUrl: '/login' });
    }
  };

  const menuItems = [
    { icon: User, label: 'Modifier mon profil', route: '/modifier-profil' },
    { icon: Settings, label: 'Paramètres', route: '/parametres' },
    { icon: Bell, label: 'Notifications', route: '/parametres/notifications' },
    { icon: Palette, label: 'Thème', route: '/parametres/theme', badge: 'Sombre' },
    { icon: Info, label: 'À propos', route: '/a-propos' },
  ];

  const initiale = user?.prenom?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || '?';
  const nomComplet = user?.prenom && user?.nom ? `${user.prenom} ${user.nom}` : user?.prenom || '—';

  return (
    <div className="min-h-screen bg-[#0F172A] pb-24">
      <div className="max-w-lg mx-auto px-6 py-8">
        <h1 className="text-[32px] font-bold text-[#F8FAFC] mb-8">Profil</h1>

        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full bg-[#22D3EE] flex items-center justify-center mb-3">
            <span className="text-2xl font-bold text-[#0F172A]">{initiale}</span>
          </div>
          <p className="text-lg font-bold text-[#F8FAFC]">{nomComplet}</p>
          <p className="text-sm text-[#64748B]">{user?.email || '—'}</p>
        </div>

        <div className="bg-[#1E293B] rounded-2xl border border-[#334155] overflow-hidden mb-6">
          {menuItems.map((item, i) => {
            const Icon = item.icon;
            return (
              <button key={i} onClick={() => router.push(item.route)}
                className="w-full flex items-center gap-4 px-5 py-4 hover:bg-[#334155]/50 transition-colors border-b border-[#334155] last:border-0">
                <div className="w-9 h-9 rounded-xl bg-[#22D3EE]/10 flex items-center justify-center">
                  <Icon size={18} className="text-[#22D3EE]" />
                </div>
                <span className="flex-1 text-left text-sm font-medium text-[#F8FAFC]">{item.label}</span>
                {item.badge && <span className="text-xs text-[#64748B] bg-[#334155] px-2 py-1 rounded">{item.badge}</span>}
                <span className="text-[#64748B]">›</span>
              </button>
            );
          })}
        </div>

        <button onClick={handleLogout}
          className="w-full h-14 rounded-2xl border-2 border-[#EF4444] text-[#EF4444] font-semibold flex items-center justify-center gap-2 hover:bg-[#EF4444]/10 transition-colors">
          <LogOut size={18} />
          Se déconnecter
        </button>

        <p className="text-center text-xs text-[#334155] mt-6">MyCove v1.0.0</p>
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1E293B] border-t border-[#334155] z-20">
        <div className="px-6 h-20 flex items-center justify-around">
          <button onClick={() => router.push('/dashboard')} className="flex flex-col items-center gap-1 text-[#64748B]">
            <Home size={24} /><span className="text-xs font-medium">Dashboard</span>
          </button>
          <button onClick={() => router.push('/planning')} className="flex flex-col items-center gap-1 text-[#64748B]">
            <Calendar size={24} /><span className="text-xs font-medium">Planning</span>
          </button>
          <button onClick={() => router.push('/budget')} className="flex flex-col items-center gap-1 text-[#64748B]">
            <DollarSign size={24} /><span className="text-xs font-medium">Budget</span>
          </button>
          <button onClick={() => setMenuPlusOpen(true)} className="flex flex-col items-center gap-1 text-[#64748B]">
            <div className="w-9 h-9 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center">
              <MoreHorizontal size={18} />
            </div>
            <span className="text-xs font-medium">Plus</span>
          </button>
        </div>
      </nav>

      <MenuPlus isOpen={menuPlusOpen} onClose={() => setMenuPlusOpen(false)} />
    </div>
  );
}
