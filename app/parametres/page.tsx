// app/parametres/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Home, Calendar, DollarSign, ChevronLeft, ChevronRight,
  Bell, Palette, Globe, Database, HelpCircle, Shield, Mail,
  MoreHorizontal
} from 'lucide-react';
import { MenuPlus } from '../../src/components/MenuPlus';

type NavItem = 'dashboard' | 'planning' | 'budget';

interface SettingItem {
  id: string;
  icon: any;
  label: string;
  description?: string;
  badge?: string;
  onClick: () => void;
}

interface SettingSection {
  title: string;
  items: SettingItem[];
}

export default function ParametresScreen() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<NavItem | null>(null);
  const [menuPlusOpen, setMenuPlusOpen] = useState(false);

  const handleNavigation = (nav: NavItem) => {
    setActiveNav(nav);
    router.push(`/${nav}`);
  };

  const sections: SettingSection[] = [
    {
      title: 'Préférences',
      items: [
        {
          id: 'notifications',
          icon: Bell,
          label: 'Notifications',
          description: 'Gérer les alertes et rappels',
          onClick: () => console.log('Notifications'),
        },
        {
          id: 'theme',
          icon: Palette,
          label: 'Thème',
          description: 'Apparence de l\'application',
          badge: 'Sombre',
          onClick: () => console.log('Thème'),
        },
        {
          id: 'langue',
          icon: Globe,
          label: 'Langue',
          description: 'Langue de l\'interface',
          badge: 'Français',
          onClick: () => console.log('Langue'),
        },
      ],
    },
    {
      title: 'Données',
      items: [
        {
          id: 'donnees',
          icon: Database,
          label: 'Gestion des données',
          description: 'Exporter, sauvegarder, supprimer',
          onClick: () => console.log('Données'),
        },
        {
          id: 'confidentialite',
          icon: Shield,
          label: 'Confidentialité',
          description: 'Paramètres de vie privée',
          onClick: () => console.log('Confidentialité'),
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          id: 'aide',
          icon: HelpCircle,
          label: 'Aide & FAQ',
          description: 'Questions fréquentes',
          onClick: () => console.log('Aide'),
        },
        {
          id: 'contact',
          icon: Mail,
          label: 'Nous contacter',
          description: 'Support technique',
          onClick: () => console.log('Contact'),
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0F172A] pb-24">
      <div className="max-w-3xl mx-auto px-6 py-8">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-center hover:border-[#22D3EE]/50 transition-colors"
          >
            <ChevronLeft size={20} className="text-[#F8FAFC]" />
          </button>
          <h1 className="flex-1 text-center text-[28px] font-bold text-[#F8FAFC] mr-10">
            Paramètres
          </h1>
        </div>

        {/* SECTIONS */}
        {sections.map((section, sectionIndex) => (
          <div key={section.title} className={sectionIndex !== 0 ? 'mt-8' : ''}>
            {/* Section Title */}
            <h2 className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-4">
              {section.title}
            </h2>

            {/* Section Items */}
            <div className="bg-[#1E293B] rounded-2xl border border-[#334155] overflow-hidden">
              {section.items.map((item, index) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.onClick}
                    className={`w-full flex items-center gap-4 p-5 hover:bg-[#0F172A]/50 transition-colors ${
                      index !== section.items.length - 1 ? 'border-b border-[#334155]' : ''
                    }`}
                  >
                    {/* Icon */}
                    <div className="w-10 h-10 rounded-xl bg-[#22D3EE]/10 flex items-center justify-center flex-shrink-0">
                      <Icon size={20} className="text-[#22D3EE]" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-left min-w-0">
                      <div className="text-base font-semibold text-[#F8FAFC] mb-0.5">
                        {item.label}
                      </div>
                      {item.description && (
                        <div className="text-sm text-[#64748B]">
                          {item.description}
                        </div>
                      )}
                    </div>

                    {/* Badge (optionnel) */}
                    {item.badge && (
                      <span className="px-3 py-1 rounded-lg text-sm font-medium bg-[#0F172A] text-[#94A3B8] border border-[#334155]">
                        {item.badge}
                      </span>
                    )}

                    {/* Chevron */}
                    <ChevronRight size={20} className="text-[#64748B] flex-shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* VERSION */}
        <div className="mt-12 text-center">
          <p className="text-sm text-[#64748B] mb-1">MyCove</p>
          <p className="text-xs text-[#64748B]">Version 1.0.0 • Mars 2026</p>
        </div>

        <div className="h-8" />
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