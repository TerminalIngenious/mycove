// app/planning/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Calendar, DollarSign, MoreHorizontal, ChevronLeft, ChevronRight, Plus, Trash2, Pencil } from 'lucide-react';
import { MenuPlus } from '../../src/components/MenuPlus';
import { ModalNouvelleTache } from '../../src/components/ModalNouvelleTache';
import { supabase } from '@/src/lib/supabase';

type NavItem = 'dashboard' | 'planning' | 'budget';
type Block = 'matin' | 'midi' | 'aprem' | 'soir';

interface Task {
  id: string;
  title: string;
  tag: string;
  time: string;
  priority: string;
  done: boolean;
  date?: string;
}

export default function PlanningScreen() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<NavItem>('planning');
  const [menuPlusOpen, setMenuPlusOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Modal state — gère création ET édition
  const [modalOpen, setModalOpen] = useState(false);
  const [modalBlock, setModalBlock] = useState<Block | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const handleNavigation = (nav: NavItem) => {
    setActiveNav(nav);
    router.push(`/${nav}`);
  };

  const getDateISO = (date: Date) => date.toISOString().split('T')[0];

  const loadTasks = async (forDate: Date) => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', getDateISO(forDate))
        .order('time', { ascending: true });

      if (error) { console.error('Error loading tasks:', error); setLoading(false); return; }
      setTasks(data || []);
      setLoading(false);
    } catch (err) {
      console.error('Unexpected error:', err);
      setLoading(false);
    }
  };

  useEffect(() => { loadTasks(currentDate); }, [currentDate]);

  // Ouvrir le modal pour CRÉER dans un bloc spécifique
  const openCreateModal = (block: Block) => {
    setTaskToEdit(null);
    setModalBlock(block);
    setModalOpen(true);
  };

  // Ouvrir le modal pour MODIFIER une tâche existante
  const openEditModal = (task: Task) => {
    setTaskToEdit(task as any);
    setModalBlock(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTaskToEdit(null);
    setModalBlock(null);
  };

  const handleTaskSaved = () => {
    loadTasks(currentDate);
  };

  const toggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    setTasks(tasks.map(t => t.id === taskId ? { ...t, done: !t.done } : t));
    const { error } = await supabase.from('tasks').update({ done: !task.done }).eq('id', taskId);
    if (error) {
      console.error('Error updating task:', error);
      setTasks(tasks.map(t => t.id === taskId ? { ...t, done: task.done } : t));
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!confirm('Supprimer cette tâche ?')) return;
    setTasks(tasks.filter(t => t.id !== taskId));
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);
    if (error) { console.error('Error deleting task:', error); loadTasks(currentDate); }
  };

  // Blocs horaires
  const morningTasks   = tasks.filter(t => t.time && parseInt(t.time.split('h')[0]) >= 6  && parseInt(t.time.split('h')[0]) < 12);
  const noonTasks      = tasks.filter(t => t.time && parseInt(t.time.split('h')[0]) >= 12 && parseInt(t.time.split('h')[0]) < 14);
  const afternoonTasks = tasks.filter(t => t.time && parseInt(t.time.split('h')[0]) >= 14 && parseInt(t.time.split('h')[0]) < 18);
  const eveningTasks   = tasks.filter(t => t.time && parseInt(t.time.split('h')[0]) >= 18 && parseInt(t.time.split('h')[0]) <= 23);
  // Tâches sans heure ou heure hors plages connues (0h–5h59)
  const unscheduledTasks = tasks.filter(t => {
    if (!t.time || t.time.trim() === '') return true;
    const h = parseInt(t.time.split('h')[0]);
    return isNaN(h) || h < 6;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'haute':   return '#EF4444';
      case 'moyenne': return '#F59E0B';
      case 'basse':   return '#10B981';
      default:        return '#64748B';
    }
  };

  const goToPreviousDay = () => { const d = new Date(currentDate); d.setDate(d.getDate() - 1); setCurrentDate(d); };
  const goToNextDay     = () => { const d = new Date(currentDate); d.setDate(d.getDate() + 1); setCurrentDate(d); };

  const formatDate = (date: Date) => {
    const days   = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    const today  = new Date();
    const tom    = new Date(today); tom.setDate(today.getDate() + 1);
    const yest   = new Date(today); yest.setDate(today.getDate() - 1);
    if (date.toDateString() === today.toDateString()) return `Aujourd'hui • ${date.getDate()} ${months[date.getMonth()]}`;
    if (date.toDateString() === tom.toDateString())   return `Demain • ${date.getDate()} ${months[date.getMonth()]}`;
    if (date.toDateString() === yest.toDateString())  return `Hier • ${date.getDate()} ${months[date.getMonth()]}`;
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
  };

  // Composant tâche — clic sur le texte = édition
  const TaskItem = ({ task }: { task: Task }) => {
    const priorityColor = getPriorityColor(task.priority);
    return (
      <div className="flex items-center gap-3 p-3 bg-[#0F172A] rounded-xl group">
        {/* Checkbox */}
        <button onClick={() => toggleTask(task.id)}
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer hover:scale-110 flex-shrink-0 ${
            task.done ? 'bg-[#22D3EE] border-[#22D3EE]' : 'border-[#334155] hover:border-[#22D3EE]/50'
          }`}>
          {task.done && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>

        {/* Barre priorité */}
        <div className="w-1 h-8 rounded-full flex-shrink-0" style={{ backgroundColor: priorityColor }} />

        {/* Texte — clic = édition */}
        <button className="flex-1 min-w-0 text-left" onClick={() => openEditModal(task)}>
          <p className={`text-sm font-medium truncate transition-all ${task.done ? 'text-[#64748B] line-through' : 'text-[#F8FAFC]'}`}>
            {task.title}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-xs text-[#64748B]">{task.time ? `${task.time} • ` : ''}{task.tag}</p>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold"
              style={{ backgroundColor: `${priorityColor}20`, color: priorityColor }}>
              {task.priority === 'haute' ? 'Haute' : task.priority === 'moyenne' ? 'Moyenne' : 'Basse'}
            </span>
          </div>
        </button>

        {/* Bouton édition (hover) */}
        <button onClick={() => openEditModal(task)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[#22D3EE]/10 rounded-lg flex-shrink-0">
          <Pencil size={14} className="text-[#22D3EE]" />
        </button>

        {/* Bouton suppression (hover) */}
        <button onClick={() => deleteTask(task.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[#EF4444]/10 rounded-lg flex-shrink-0">
          <Trash2 size={16} className="text-[#EF4444]" />
        </button>
      </div>
    );
  };

  // Bloc horaire — le + passe le bloc au modal
  const TimeBlock = ({ title, block, blockTasks }: { title: string; block: Block; blockTasks: Task[] }) => (
    <div className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-[#F8FAFC]">{title}</h3>
        <button onClick={() => openCreateModal(block)}
          className="w-8 h-8 rounded-lg bg-[#22D3EE]/10 border border-[#22D3EE]/30 flex items-center justify-center hover:bg-[#22D3EE]/20 transition-colors">
          <Plus size={16} className="text-[#22D3EE]" />
        </button>
      </div>
      <div className="space-y-2">
        {blockTasks.length === 0
          ? <p className="text-sm text-[#64748B] text-center py-4">Aucune tâche</p>
          : blockTasks.map(task => <TaskItem key={task.id} task={task} />)
        }
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F172A] pb-24">
      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-[#F8FAFC] mb-6">Planning</h1>

          {/* Sélecteur de date */}
          <div className="flex items-center justify-between bg-[#1E293B] rounded-2xl p-4 border border-[#334155]">
            <button onClick={goToPreviousDay}
              className="w-10 h-10 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center hover:border-[#22D3EE]/50 transition-colors">
              <ChevronLeft size={18} className="text-[#64748B]" />
            </button>
            <span className="text-lg font-semibold text-[#F8FAFC]">{formatDate(currentDate)}</span>
            <button onClick={goToNextDay}
              className="w-10 h-10 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center hover:border-[#22D3EE]/50 transition-colors">
              <ChevronRight size={18} className="text-[#64748B]" />
            </button>
          </div>
        </div>

        {/* LOADING */}
        {loading && <div className="text-center py-12"><p className="text-[#64748B]">Chargement...</p></div>}

        {/* BLOCS */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TimeBlock title="Matin"       block="matin" blockTasks={morningTasks} />
            <TimeBlock title="Midi"        block="midi"  blockTasks={noonTasks} />
            <TimeBlock title="Après-midi"  block="aprem" blockTasks={afternoonTasks} />
            <TimeBlock title="Soir"        block="soir"  blockTasks={eveningTasks} />
            {/* Tâches sans heure reconnue — bloc discret */}
            {unscheduledTasks.length > 0 && (
              <div className="md:col-span-2">
                <div className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155]">
                  <h3 className="text-base font-semibold text-[#94A3B8] mb-4">Sans horaire</h3>
                  <div className="space-y-2">
                    {unscheduledTasks.map(task => <TaskItem key={task.id} task={task} />)}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* FAB — ouvre sans bloc spécifique */}
        <button onClick={() => { setTaskToEdit(null); setModalBlock(null); setModalOpen(true); }}
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-[#22D3EE] flex items-center justify-center shadow-lg shadow-[#22D3EE]/20 hover:scale-105 active:scale-95 transition-all z-30">
          <Plus size={24} className="text-[#0F172A]" />
        </button>
      </div>

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1E293B] border-t border-[#334155] z-20">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-around">
          {[
            { nav: 'dashboard' as NavItem, icon: <Home size={24} />, label: 'Dashboard' },
            { nav: 'planning' as NavItem,  icon: <Calendar size={24} />, label: 'Planning' },
            { nav: 'budget' as NavItem,    icon: <DollarSign size={24} />, label: 'Budget' },
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

      {/* MODALS */}
      <MenuPlus isOpen={menuPlusOpen} onClose={() => setMenuPlusOpen(false)} />
      <ModalNouvelleTache
        isOpen={modalOpen}
        onClose={closeModal}
        onSubmit={handleTaskSaved}
        defaultDate={getDateISO(currentDate)}
        defaultBlock={modalBlock}
        taskToEdit={taskToEdit as any}
      />
    </div>
  );
}