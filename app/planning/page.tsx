'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Calendar, DollarSign, MoreHorizontal, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { MenuPlus } from '../../src/components/MenuPlus';

type Block = 'matin' | 'midi' | 'aprem' | 'soir';

interface Task {
  id: string;
  titre: string;
  type: string;
  bloc: string;
  date: string;
  complete: boolean;
}

export default function PlanningScreen() {
  const router = useRouter();
  const [menuPlusOpen, setMenuPlusOpen] = useState(false);
  const [taches, setTaches] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [addingBlock, setAddingBlock] = useState<Block | null>(null);

  useEffect(() => { loadTasks(); }, [currentDate]);

  const getDateISO = (date: Date) => date.toISOString().split('T')[0];

  const loadTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/taches?date=${getDateISO(currentDate)}`);
      const data = await res.json();
      setTaches(Array.isArray(data) ? data : []);
    } catch (err) {
      setTaches([]);
    }
    setLoading(false);
  };

  const addTask = async (block: Block) => {
    if (!newTaskTitle.trim()) return;
    await fetch('/api/taches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        titre: newTaskTitle,
        type: 'court_terme',
        bloc: block,
        date: getDateISO(currentDate),
        complete: false,
      }),
    });
    setNewTaskTitle('');
    setAddingBlock(null);
    loadTasks();
  };

  const toggleTask = (id: string, complete: boolean) => {
    setTaches(taches.map(t => t.id === id ? { ...t, complete: !complete } : t));
  };

  const deleteTask = async (id: string) => {
    await fetch(`/api/taches?id=${id}`, { method: 'DELETE' });
    setTaches(taches.filter(t => t.id !== id));
  };

  const goToPreviousDay = () => { const d = new Date(currentDate); d.setDate(d.getDate() - 1); setCurrentDate(d); };
  const goToNextDay = () => { const d = new Date(currentDate); d.setDate(d.getDate() + 1); setCurrentDate(d); };

  const formatDate = (date: Date) => {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return `Aujourd'hui • ${date.getDate()} ${months[date.getMonth()]}`;
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
  };

  const TimeBlock = ({ title, block }: { title: string; block: Block }) => {
    const blockTasks = taches.filter(t => t.bloc === block);
    return (
      <div className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155] mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-[#F8FAFC]">{title}</h3>
          <button onClick={() => setAddingBlock(block)}
            className="w-8 h-8 rounded-lg bg-[#22D3EE]/10 border border-[#22D3EE]/30 flex items-center justify-center hover:bg-[#22D3EE]/20 transition-colors">
            <Plus size={16} className="text-[#22D3EE]" />
          </button>
        </div>

        {addingBlock === block && (
          <div className="flex gap-2 mb-3">
            <input autoFocus value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addTask(block)}
              placeholder="Nouvelle tâche..."
              className="flex-1 px-3 py-2 bg-[#0F172A] border border-[#334155] rounded-lg text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none" />
            <button onClick={() => addTask(block)} className="px-3 py-2 bg-[#22D3EE] rounded-lg text-[#0F172A] text-sm font-semibold">OK</button>
            <button onClick={() => setAddingBlock(null)} className="px-3 py-2 bg-[#334155] rounded-lg text-[#94A3B8] text-sm">✕</button>
          </div>
        )}

        <div className="space-y-2">
          {blockTasks.length === 0
            ? <p className="text-sm text-[#64748B] text-center py-4">Aucune tâche</p>
            : blockTasks.map(task => (
              <div key={task.id} className="flex items-center gap-3 p-3 bg-[#0F172A] rounded-xl group">
                <button onClick={() => toggleTask(task.id, task.complete)}
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 ${task.complete ? 'bg-[#22D3EE] border-[#22D3EE]' : 'border-[#334155]'}`}>
                  {task.complete && <svg width="12" height="10" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>}
                </button>
                <p className={`flex-1 text-sm ${task.complete ? 'text-[#64748B] line-through' : 'text-[#F8FAFC]'}`}>{task.titre}</p>
                <button onClick={() => deleteTask(task.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Trash2 size={14} className="text-[#EF4444]" />
                </button>
              </div>
            ))
          }
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0F172A] pb-24">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <h1 className="text-[32px] font-bold text-[#F8FAFC] mb-6">Planning</h1>

        <div className="flex items-center justify-between bg-[#1E293B] rounded-2xl p-4 border border-[#334155] mb-6">
          <button onClick={goToPreviousDay} className="w-10 h-10 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center">
            <ChevronLeft size={18} className="text-[#64748B]" />
          </button>
          <span className="text-lg font-semibold text-[#F8FAFC]">{formatDate(currentDate)}</span>
          <button onClick={goToNextDay} className="w-10 h-10 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center">
            <ChevronRight size={18} className="text-[#64748B]" />
          </button>
        </div>

        {loading ? (
          <p className="text-center text-[#64748B] py-12">Chargement...</p>
        ) : (
          <>
            <TimeBlock title="Matin" block="matin" />
            <TimeBlock title="Midi" block="midi" />
            <TimeBlock title="Après-midi" block="aprem" />
            <TimeBlock title="Soir" block="soir" />
          </>
        )}
      </div>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-[#1E293B] border-t border-[#334155] z-20">
        <div className="px-6 h-20 flex items-center justify-around">
          <button onClick={() => router.push('/dashboard')} className="flex flex-col items-center gap-1 text-[#64748B]">
            <Home size={24} /><span className="text-xs font-medium">Dashboard</span>
          </button>
          <button onClick={() => router.push('/planning')} className="flex flex-col items-center gap-1 text-[#22D3EE]">
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
