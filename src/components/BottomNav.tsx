'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Home, Calendar, DollarSign, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import { MenuPlus } from './MenuPlus';

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuPlusOpen, setMenuPlusOpen] = useState(false);

  const isAuth = pathname === '/login' ||
    pathname?.startsWith('/onboarding') ||
    pathname === '/welcome' ||
    pathname === '/mot-de-passe-oublie';

  if (isAuth) return null;

  return (
    <>
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1E293B] border-t border-[#334155] z-20">
        <div className="px-6 h-20 flex items-center justify-around">
          <button onClick={() => router.push('/dashboard')} className={`flex flex-col items-center gap-1 ${pathname === '/dashboard' ? 'text-[#22D3EE]' : 'text-[#64748B]'}`}>
            <Home size={24} /><span className="text-xs font-medium">Dashboard</span>
          </button>
          <button onClick={() => router.push('/planning')} className={`flex flex-col items-center gap-1 ${pathname === '/planning' ? 'text-[#22D3EE]' : 'text-[#64748B]'}`}>
            <Calendar size={24} /><span className="text-xs font-medium">Planning</span>
          </button>
          <button onClick={() => router.push('/budget')} className={`flex flex-col items-center gap-1 ${pathname === '/budget' ? 'text-[#22D3EE]' : 'text-[#64748B]'}`}>
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
    </>
  );
}
