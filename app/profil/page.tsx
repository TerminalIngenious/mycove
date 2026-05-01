// app/profil/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Home, Calendar, DollarSign, 
  ChevronRight, UserCircle, Bell, Palette, Info, LogOut, MoreHorizontal,
  Settings
} from 'lucide-react';
import { MenuPlus } from '../../src/components/MenuPlus';
import { supabase } from '@/src/lib/supabase';

type NavItem = 'dashboard' | 'planning' | 'budget';

export default function ProfilScreen() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<NavItem | null>(null);
  const [menuPlusOpen, setMenuPlusOpen] = useState(false);

  // Données réelles de l'utilisateur
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userInitial, setUserInitial] = useState<string>('?');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) { router.push('/login'); return; }

      const prenom = user.user_metadata?.prenom || user.user_metadata?.first_name || '';
      const nom = user.user_metadata?.nom || user.user_metadata?.last_name || '';
      const fullName = prenom && nom ? `${prenom} ${nom}` : prenom || user.email?.split('@')[0] || '';

      setUserName(fullName);
      setUserEmail(user.email || '');
      setUserInitial((prenom || fullName || '?')[0].toUpperCase());
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  const handleNavigation = (nav: NavItem) => {
    setActiveNav(nav);
    router.push(`/${nav}`);
  };

  const handleLogout = async () => {
    if (confirm('Es-tu sûr de vouloir te déconnecter ?')) {
      await supabase.auth.signOut();
      router.push('/login');
    }
  };

  const settingsItems = [
    { id: 'profil', icon: UserCircle, label: 'Modifier mon profil', onClick: () => router.push('/modifier-profil') },
    { id: 'parametres', icon: Settings, label: 'Paramètres', onClick: () => router.push('/parametres') },
    { id: 'notifications', icon: Bell, label: 'Notifications', onClick: () => console.log('/parametres/notifications') },
    { id: 'theme', icon: Palette, label: 'Thème', badge: 'Sombre', onClick: () => console.log('Thème') },
    { id: 'about', icon: Info, label: 'À propos', onClick: () => console.log('À propos') },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] pb-24">
      <div className="max-w-3xl mx-auto px-6 py-8">
        
        <h1 className="text-[32px] font-bold text-[#F8FAFC] mb-12">Profil</h1>

        {/* AVATAR + NOM */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#22D3EE] to-[#1DB8D1] flex items-center justify-center mb-4">
            <span className="text-4xl font-bold text-[#0F172A]">
              {loading ? '?' : userInitial}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-[#F8FAFC] mb-1">
            {loading ? '...' : userName || 'Utilisateur'}
          </h2>
          <p className="text-base text-[#94A3B8]">
            {loading ? '' : userEmail}
          </p>
        </div>

        {/* SETTINGS */}
        <div className="bg-[#1E293B] rounded-2xl border border-[#334155] overflow-hidden mb-6">
          {settingsItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button key={item.id} onClick={item.onClick}
                className={`w-full flex items-center gap-4 p-5 hover:bg-[#0F172A]/50 transition-colors ${index !== settingsItems.length - 1 ? 'border-b border-[#334155]' : ''}`}>
                <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-[#22D3EE]" />
                </div>
                <span className="flex-1 text-left text-base font-medium text-[#F8FAFC]">{item.label}</span>
                {item.badge && (
                  <span className="px-3 py-1 rounded-lg text-sm font-medium bg-[#334155] text-[#94A3B8]">{item.badge}</span>
                )}
                <ChevronRight size={20} className="text-[#64748B]" />
              </button>
            );
          })}
        </div>

        {/* DÉCONNEXION */}
        <button onClick={handleLogout}
          className="w-full h-14 rounded-xl bg-transparent border-2 border-[#EF4444] text-[#EF4444] font-semibold hover:bg-[#EF4444]/10 transition-all flex items-center justify-center gap-3 mb-8">
          <LogOut size={20} />
          <span>Se déconnecter</span>
        </button>

        <p className="text-center text-sm text-[#64748B]">MyCove v1.0.0</p>
      </div>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1E293B] border-t border-[#334155]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-around">
          {[
            { nav: 'dashboard' as NavItem, icon: <Home size={24} />, label: 'Dashboard' },
            { nav: 'planning' as NavItem, icon: <Calendar size={24} />, label: 'Planning' },
            { nav: 'budget' as NavItem, icon: <DollarSign size={24} />, label: 'Budget' },
          ].map(({ nav, icon, label }) => (
            <button key={nav} onClick={() => handleNavigation(nav)}
              className={`flex flex-col items-center gap-1 transition-colors ${activeNav === nav ? 'text-[#22D3EE]' : 'text-[#64748B] hover:text-[#94A3B8]'}`}>
              {icon}
              <span className="text-xs font-medium">{label}</span>
            </button>
          ))}
          <button onClick={() => setMenuPlusOpen(true)} className="flex flex-col items-center gap-1 text-[#64748B] hover:text-[#94A3B8]">
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
