// app/activites/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Home, Calendar, DollarSign, ChevronLeft, Plus, Search,
  Film, Utensils, Palette, Trophy, PartyPopper, MapPin, Check,
  MoreHorizontal, X
} from 'lucide-react';
import { MenuPlus } from '../../src/components/MenuPlus';

type NavItem = 'dashboard' | 'planning' | 'budget';
type FilterType = 'toutes' | 'cinema' | 'resto' | 'culture' | 'sport' | 'soirees';

interface Activite {
  id: string;
  title: string;
  description: string;
  lieu: string;
  prix: string;
  icon: any;
  iconColor: string;
  iconBg: string;
  category: FilterType;
  done: boolean;
}

interface SearchResult {
  id: string;
  name: string;
  address: string;
  distance: string;
  priceRange: string;
  category: FilterType;
  icon: any;
  iconColor: string;
  iconBg: string;
}

export default function ActivitesScreen() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<NavItem | null>(null);
  const [menuPlusOpen, setMenuPlusOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterType>('toutes');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleNavigation = (nav: NavItem) => {
    setActiveNav(nav);
    router.push(`/${nav}`);
  };

  // Mock data - À REMPLACER par Google Places API plus tard
  const mockSearchData: { [key: string]: SearchResult[] } = {
    'cinema': [
      {
        id: 'r1',
        name: 'CGR Castres',
        address: '2 Rue Victor Hugo, Castres',
        distance: '15 km',
        priceRange: '~12€',
        category: 'cinema',
        icon: Film,
        iconColor: '#F472B6',
        iconBg: '#F472B608',
      },
      {
        id: 'r2',
        name: 'Cinéma Le Paris',
        address: 'Place du Théâtre, Mazamet',
        distance: '8 km',
        priceRange: '~9€',
        category: 'cinema',
        icon: Film,
        iconColor: '#F472B6',
        iconBg: '#F472B608',
      },
    ],
    'restaurant': [
      {
        id: 'r3',
        name: 'La Table du Marché',
        address: 'Rue Gambetta, Castres',
        distance: '15 km',
        priceRange: '~25€',
        category: 'resto',
        icon: Utensils,
        iconColor: '#FBBF24',
        iconBg: '#FBBF2408',
      },
      {
        id: 'r4',
        name: 'Pizzeria Bella Vista',
        address: 'Avenue Charles de Gaulle, Mazamet',
        distance: '8 km',
        priceRange: '~15€',
        category: 'resto',
        icon: Utensils,
        iconColor: '#FBBF24',
        iconBg: '#FBBF2408',
      },
    ],
    'sport': [
      {
        id: 'r5',
        name: 'Keep Cool Castres',
        address: 'Zone Mélou, Castres',
        distance: '16 km',
        priceRange: '~30€/mois',
        category: 'sport',
        icon: Trophy,
        iconColor: '#F97316',
        iconBg: '#F9731608',
      },
      {
        id: 'r6',
        name: 'Complexe Sportif Municipal',
        address: 'Rue du Stade, Mazamet',
        distance: '7 km',
        priceRange: 'Gratuit',
        category: 'sport',
        icon: Trophy,
        iconColor: '#F97316',
        iconBg: '#F9731608',
      },
    ],
    'culture': [
      {
        id: 'r7',
        name: 'Musée Goya',
        address: 'Rue de l\'Hôtel de Ville, Castres',
        distance: '15 km',
        priceRange: '~8€',
        category: 'culture',
        icon: Palette,
        iconColor: '#10B981',
        iconBg: '#10B98108',
      },
    ],
  };

  // Fonction de recherche (MOCK - à remplacer par API Google Places)
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    // Simuler un délai API
    setTimeout(() => {
      const query = searchQuery.toLowerCase();
      let results: SearchResult[] = [];

      // Recherche dans les mock data
      Object.keys(mockSearchData).forEach((category) => {
        if (query.includes(category) || category.includes(query)) {
          results = [...results, ...mockSearchData[category]];
        }
      });

      // Recherche par nom
      Object.values(mockSearchData).flat().forEach((item) => {
        if (item.name.toLowerCase().includes(query) && !results.find(r => r.id === item.id)) {
          results.push(item);
        }
      });

      setSearchResults(results);
      setIsSearching(false);
    }, 500);

    // TODO: Remplacer par vrai call API Google Places
    // const response = await fetch(`/api/places/search?query=${searchQuery}&location=Tarbes`);
    // const data = await response.json();
    // setSearchResults(data.results);
  };

  const handleAddActivity = (result: SearchResult) => {
    console.log('Ajouter activité:', result);
    // TODO: Ajouter à Supabase
    // Reset search
    setSearchQuery('');
    setSearchResults([]);
  };

  const activites: Activite[] = [
    {
      id: '1',
      title: 'Aller voir le nouveau Marvel',
      description: 'Avec Matéo, au cinéma de Castres',
      lieu: 'Castres',
      prix: '~12€',
      icon: Film,
      iconColor: '#F472B6',
      iconBg: '#F472B608',
      category: 'cinema',
      done: false,
    },
    {
      id: '2',
      title: 'Tester la pizzeria du centre',
      description: 'Recommandée par un pote',
      lieu: 'Mazamet',
      prix: '~15€',
      icon: Utensils,
      iconColor: '#FBBF24',
      iconBg: '#FBBF2408',
      category: 'resto',
      done: false,
    },
    {
      id: '3',
      title: 'Match de basket IUT',
      description: 'Tournoi inter-IUT ce weekend',
      lieu: 'Tarbes',
      prix: 'Gratuit',
      icon: Trophy,
      iconColor: '#F97316',
      iconBg: '#F9731608',
      category: 'sport',
      done: false,
    },
    {
      id: '4',
      title: 'Expo photo médiathèque',
      description: 'Expo street art — c\'était cool',
      lieu: 'Castres',
      prix: 'Gratuit',
      icon: Palette,
      iconColor: '#10B981',
      iconBg: '#10B98108',
      category: 'culture',
      done: true,
    },
    {
      id: '5',
      title: 'Soirée anniversaire Paul',
      description: 'Soirée chez lui samedi soir',
      lieu: 'Mazamet',
      prix: '~10€',
      icon: PartyPopper,
      iconColor: '#A78BFA',
      iconBg: '#A78BFA08',
      category: 'soirees',
      done: true,
    },
  ];

  const filters = [
    { id: 'toutes', label: 'Toutes' },
    { id: 'cinema', label: 'Cinéma' },
    { id: 'resto', label: 'Resto' },
    { id: 'culture', label: 'Culture' },
    { id: 'sport', label: 'Sport' },
    { id: 'soirees', label: 'Soirées' },
  ];

  const filteredActivites = activites.filter((activite) => {
    return activeFilter === 'toutes' || activite.category === activeFilter;
  });

  const activitesAFaire = filteredActivites.filter((a) => !a.done);
  const activitesFaites = filteredActivites.filter((a) => a.done);

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
            Activités
          </h1>
        </div>

        {/* BARRE DE RECHERCHE */}
        <div className="relative mb-4">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748B]" />
          <input
            type="text"
            placeholder="Rechercher une activité près de chez toi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="w-full h-12 pl-12 pr-24 bg-[#1E293B] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}
              className="absolute right-16 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#F8FAFC]"
            >
              <X size={16} />
            </button>
          )}
          <button
            onClick={handleSearch}
            disabled={!searchQuery.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-[#22D3EE] text-[#0F172A] rounded-lg text-sm font-semibold hover:bg-[#1DB8D1] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Go
          </button>
        </div>

        {/* INFO BULLE */}
        <p className="text-xs text-[#64748B] mb-6 text-center">
          💡 Recherche des cinémas, restaurants, salles de sport près de toi
        </p>

        {/* RÉSULTATS DE RECHERCHE */}
        {searchResults.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#F8FAFC]">Résultats</h2>
              <span className="text-sm text-[#64748B]">{searchResults.length} trouvés</span>
            </div>

            <div className="space-y-3">
              {searchResults.map((result) => {
                const Icon = result.icon;
                return (
                  <div
                    key={result.id}
                    className="bg-[#1E293B] rounded-xl p-4 border border-[#334155] hover:border-[#22D3EE]/50 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: result.iconBg,
                          border: `1px solid ${result.iconColor}15`,
                        }}
                      >
                        <Icon size={20} style={{ color: result.iconColor }} />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">
                          {result.name}
                        </h3>
                        <p className="text-sm text-[#94A3B8] mb-2">
                          {result.address}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-[#64748B]">
                          <div className="flex items-center gap-1">
                            <MapPin size={12} />
                            <span>{result.distance}</span>
                          </div>
                          <span>•</span>
                          <span>{result.priceRange}</span>
                        </div>
                      </div>

                      {/* Bouton Ajouter */}
                      <button
                        onClick={() => handleAddActivity(result)}
                        className="px-4 py-2 rounded-lg bg-[#22D3EE]/10 text-[#22D3EE] text-sm font-semibold hover:bg-[#22D3EE]/20 transition-colors flex-shrink-0"
                      >
                        Ajouter
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-[#334155]" />
          </div>
        )}

        {/* FILTRES */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id as FilterType)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all ${
                activeFilter === filter.id
                  ? 'bg-[#22D3EE] text-[#0F172A]'
                  : 'bg-[#1E293B] text-[#94A3B8] border border-[#334155] hover:border-[#22D3EE]/50'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* SECTION À FAIRE */}
        {activitesAFaire.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#F8FAFC]">À faire</h2>
              <span className="text-sm text-[#64748B]">{activitesAFaire.length} activités</span>
            </div>

            <div className="space-y-3">
              {activitesAFaire.map((activite) => {
                const Icon = activite.icon;
                return (
                  <div
                    key={activite.id}
                    className="bg-[#1E293B] rounded-xl p-4 border border-[#334155] hover:border-[#22D3EE]/50 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: activite.iconBg,
                          border: `1px solid ${activite.iconColor}15`,
                        }}
                      >
                        <Icon size={20} style={{ color: activite.iconColor }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">
                          {activite.title}
                        </h3>
                        <p className="text-sm text-[#94A3B8] mb-2">
                          {activite.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-[#64748B]">
                          <div className="flex items-center gap-1">
                            <MapPin size={12} />
                            <span>{activite.lieu}</span>
                          </div>
                          <span>•</span>
                          <span>{activite.prix}</span>
                        </div>
                      </div>

                      <div className="w-6 h-6 rounded-md border-2 border-[#334155] hover:border-[#22D3EE] transition-colors flex-shrink-0 mt-1" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SECTION DÉJÀ FAIT */}
        {activitesFaites.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-[#F8FAFC] mb-4">Déjà fait</h2>

            <div className="space-y-3">
              {activitesFaites.map((activite) => {
                const Icon = activite.icon;
                return (
                  <div
                    key={activite.id}
                    className="bg-[#1E293B] rounded-xl p-4 border border-[#334155] opacity-50 cursor-pointer"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{
                          backgroundColor: activite.iconBg,
                          border: `1px solid ${activite.iconColor}15`,
                        }}
                      >
                        <Icon size={20} style={{ color: activite.iconColor }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-base font-semibold text-[#F8FAFC] mb-1 line-through">
                          {activite.title}
                        </h3>
                        <p className="text-sm text-[#94A3B8]">
                          {activite.description}
                        </p>
                      </div>

                      <div className="w-6 h-6 rounded-md bg-[#22D3EE] border-2 border-[#22D3EE] flex items-center justify-center flex-shrink-0 mt-1">
                        <Check size={14} className="text-white" strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="h-20" />
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