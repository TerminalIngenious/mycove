// app/focus/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Home, Calendar, DollarSign, 
  Play, Pause, RotateCcw, Flame, Clock, MoreHorizontal
} from 'lucide-react';
import { MenuPlus } from '../../src/components/MenuPlus';
import { supabase } from '@/src/lib/supabase';

type NavItem = 'dashboard' | 'planning' | 'budget';
type TimerState = 'idle' | 'running' | 'paused';

export default function FocusScreen() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<NavItem | null>(null);
  const [menuPlusOpen, setMenuPlusOpen] = useState(false);
  
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [totalTime] = useState(25 * 60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Stats depuis Supabase
  const [focusSessions, setFocusSessions] = useState<number | null>(null);
  const [focusMinutesToday, setFocusMinutesToday] = useState<number | null>(null);
  const [streak, setStreak] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const handleNavigation = (nav: NavItem) => {
    setActiveNav(nav);
    router.push(`/${nav}`);
  };

  // Charger les stats focus depuis Supabase
  useEffect(() => {
    const loadStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const today = new Date().toISOString().split('T')[0];
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
      const weekISO = startOfWeek.toISOString().split('T')[0];

      // Sessions cette semaine
      const { data: weekSessions } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', weekISO);

      if (weekSessions) setFocusSessions(weekSessions.length);

      // Minutes aujourd'hui
      const { data: todaySessions } = await supabase
        .from('focus_sessions')
        .select('duration_minutes')
        .eq('user_id', user.id)
        .eq('date', today);

      if (todaySessions) {
        const total = todaySessions.reduce((sum, s) => sum + (s.duration_minutes || 25), 0);
        setFocusMinutesToday(total);
      }

      // Streak (jours consécutifs avec au moins 1 session)
      const { data: allSessions } = await supabase
        .from('focus_sessions')
        .select('date')
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (allSessions && allSessions.length > 0) {
        const uniqueDates = [...new Set(allSessions.map(s => s.date))];
        let count = 0;
        const checkDate = new Date();
        for (const date of uniqueDates) {
          if (date === checkDate.toISOString().split('T')[0]) {
            count++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else break;
        }
        setStreak(count);
      } else {
        setStreak(0);
      }
    };

    loadStats();
  }, []);

  // Sauvegarder une session terminée
  const saveSession = async () => {
    if (!userId) return;
    const today = new Date().toISOString().split('T')[0];
    await supabase.from('focus_sessions').insert({
      user_id: userId,
      date: today,
      duration_minutes: 25,
    });
    // Recharger les stats
    setFocusSessions(prev => (prev !== null ? prev + 1 : 1));
    setFocusMinutesToday(prev => (prev !== null ? prev + 25 : 25));
  };

  useEffect(() => {
    if (timerState === 'running' && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerState('idle');
            saveSession();
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Session terminée ! 🎉', { body: 'Bravo ! Prends une pause de 5 minutes.' });
            }
            return totalTime;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [timerState, timeLeft, totalTime]);

  const handleStartPause = () => {
    setTimerState(s => s === 'running' ? 'paused' : 'running');
  };

  const handleReset = () => {
    setTimerState('idle');
    setTimeLeft(totalTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatMinutes = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return m > 0 ? `${h}h ${m}min` : `${h}h`;
  };

  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="min-h-screen bg-[#0F172A] pb-24">
      <div className="max-w-7xl mx-auto px-6 py-8">
        
        <h1 className="text-[32px] font-bold text-[#F8FAFC] mb-8">Focus</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* TIMER */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#1E293B] rounded-2xl p-12 border border-[#334155] flex flex-col items-center justify-center">
              <div className="relative w-80 h-80 mb-8">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="160" cy="160" r="140" stroke="#334155" strokeWidth="12" fill="none" />
                  <circle cx="160" cy="160" r="140" stroke="#22D3EE" strokeWidth="12" fill="none"
                    strokeDasharray={`${2 * Math.PI * 140}`}
                    strokeDashoffset={`${2 * Math.PI * 140 * (1 - progress / 100)}`}
                    strokeLinecap="round" className="transition-all duration-1000" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-[72px] font-bold text-[#F8FAFC] leading-none mb-2">{formatTime(timeLeft)}</p>
                    <p className="text-base text-[#94A3B8]">
                      {timerState === 'running' ? 'En cours...' : timerState === 'paused' ? 'En pause' : 'Prêt à commencer'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={handleStartPause}
                  className="w-16 h-16 rounded-full bg-[#22D3EE] hover:bg-[#1DB8D1] flex items-center justify-center transition-all hover:scale-105 active:scale-95">
                  {timerState === 'running'
                    ? <Pause size={28} className="text-[#0F172A]" fill="#0F172A" />
                    : <Play size={28} className="text-[#0F172A]" fill="#0F172A" />}
                </button>
                {(timerState === 'running' || timerState === 'paused') && (
                  <button onClick={handleReset}
                    className="w-12 h-12 rounded-full bg-[#1E293B] border border-[#334155] hover:border-[#22D3EE]/50 flex items-center justify-center transition-all">
                    <RotateCcw size={20} className="text-[#F8FAFC]" />
                  </button>
                )}
              </div>
            </div>

            <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155]">
              <h3 className="text-lg font-semibold text-[#F8FAFC] mb-4">🍅 Technique Pomodoro</h3>
              <div className="space-y-3 text-sm text-[#94A3B8] leading-relaxed">
                <p><span className="font-semibold text-[#22D3EE]">25 minutes</span> de concentration intense</p>
                <p><span className="font-semibold text-[#10B981]">5 minutes</span> de pause</p>
                <p>Répète 4 fois, puis prends une pause de <span className="font-semibold text-[#F97316]">15-30 minutes</span></p>
              </div>
            </div>
          </div>

          {/* STATS */}
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="bg-[#1E293B] rounded-2xl p-6 border-l-4 border-[#22D3EE]">
                <div className="flex items-center gap-3 mb-2">
                  <Clock size={24} className="text-[#22D3EE]" />
                  <h3 className="text-base font-semibold text-[#F8FAFC]">Sessions</h3>
                </div>
                <p className="text-[40px] font-bold text-[#22D3EE] leading-none mb-1">
                  {focusSessions !== null ? focusSessions : '—'}
                </p>
                <p className="text-sm text-[#94A3B8]">cette semaine</p>
              </div>

              <div className="bg-[#1E293B] rounded-2xl p-6 border-l-4 border-[#F97316]">
                <div className="flex items-center gap-3 mb-2">
                  <Flame size={24} className="text-[#F97316]" />
                  <h3 className="text-base font-semibold text-[#F8FAFC]">Streak</h3>
                </div>
                <p className="text-[40px] font-bold text-[#F97316] leading-none mb-1">
                  {streak !== null ? streak : '—'}
                </p>
                <p className="text-sm text-[#94A3B8]">jours consécutifs</p>
              </div>
            </div>

            <div className="bg-[#1E293B] rounded-xl p-5 border border-[#334155]">
              <h3 className="text-base font-semibold text-[#F8FAFC] mb-3">💡 Conseils</h3>
              <ul className="space-y-2 text-sm text-[#94A3B8]">
                {['Éteins les notifications', 'Définis une tâche claire', 'Prends vraiment tes pauses', 'Hydrate-toi régulièrement'].map(tip => (
                  <li key={tip} className="flex items-start gap-2">
                    <span className="text-[#22D3EE] mt-0.5">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-[#22D3EE]/10 to-[#1DB8D1]/10 rounded-xl p-5 border border-[#22D3EE]/20">
              <p className="text-sm text-[#94A3B8] mb-1">Temps focus aujourd'hui</p>
              <p className="text-3xl font-bold text-[#22D3EE]">
                {focusMinutesToday !== null && focusMinutesToday > 0 ? formatMinutes(focusMinutesToday) : '—'}
              </p>
            </div>
          </div>
        </div>
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
