'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Home, Calendar, FileText, FolderOpen, User, Settings } from 'lucide-react';
import { LogoCove } from './Logo';

const navItems = [
  { icon: 'home', label: 'Dashboard', route: '/dashboard' },
  { icon: 'calendar', label: 'Planning', route: '/planning' },
  { icon: 'euro', label: 'Budget', route: '/budget' },
  { icon: 'file', label: 'Bloc Notes', route: '/bloc-notes' },
  { icon: 'folder', label: 'Administratif', route: '/administratif' },
  { icon: 'user', label: 'Profil', route: '/profil' },
  { icon: 'settings', label: 'Paramètres', route: '/parametres' },
];

function NavIcon({ icon, size = 20 }: { icon: string; size?: number }) {
  if (icon === 'euro') {
    return (
      <span style={{ fontSize: size, fontWeight: 700, lineHeight: 1, fontFamily: 'sans-serif' }}>€</span>
    );
  }
  const icons: Record<string, any> = {
    home: Home,
    calendar: Calendar,
    file: FileText,
    folder: FolderOpen,
    user: User,
    settings: Settings,
  };
  const Icon = icons[icon];
  return Icon ? <Icon size={size} /> : null;
}

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const isAuth = pathname === '/login' ||
    pathname?.startsWith('/onboarding') ||
    pathname === '/welcome' ||
    pathname === '/mot-de-passe-oublie';

  if (isAuth) return null;

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full bg-[#1E293B] border-r border-[#334155] z-40 group transition-all duration-300 w-16 hover:w-56 overflow-hidden">
      
      <div className="flex items-center h-16 px-3 border-b border-[#334155] flex-shrink-0 overflow-hidden">
        <div className="flex-shrink-0">
          <LogoCove size={32} />
        </div>
        <div className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
          <span className="text-[#F8FAFC] font-extrabold text-lg">My Cove</span>
        </div>
      </div>

      <nav className="flex flex-col gap-1 p-2 flex-1 mt-2">
        {navItems.map(({ icon, label, route }) => {
          const isActive = pathname === route;
          return (
            <button
              key={route}
              onClick={() => router.push(route)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 w-full text-left ${
                isActive
                  ? 'bg-[#22D3EE]/10 text-[#22D3EE]'
                  : 'text-[#64748B] hover:bg-[#334155]/50 hover:text-[#F8FAFC]'
              }`}
            >
              <div className="flex-shrink-0 w-5 flex items-center justify-center">
                <NavIcon icon={icon} size={20} />
              </div>
              <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
