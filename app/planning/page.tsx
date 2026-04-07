// app/planning/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Calendar, DollarSign, MoreHorizontal, ChevronLeft, ChevronRight, Plus, Trash2 } from 'lucide-react';
import { MenuPlus } from '../../src/components/MenuPlus';
import { ModalNouvelleTache } from '../../src/components/ModalNouvelleTache';
import { supabase } from '@/src/lib/supabase';

type NavItem = 'dashboard' | 'planning' | 'budget';

interface Task {
  id: string;
  title: string;
  tag: string;
  time: string;
  priority: string;
  done: boolean;
}

export default function PlanningScreen() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<NavItem>('planning');
  const [menuPlusOpen, setMenuPlusOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleNavigation = (nav: NavItem) => {
    setActiveNav(nav);
    router.push(`/${nav}`);
  };

  // Charger les tâches depuis Supabase
  const loadTasks = async () => {
    setLoading(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('User not logged in');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading tasks:', error);
        setLoading(false);
        return;
      }

      console.log('Tâches chargées:', data);
      setTasks(data || []);
      setLoading(false);
      
    } catch (err) {
      console.error('Unexpected error:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleTaskAdded = () => {
    loadTasks();
  };

  // Toggle done/undone
  const toggleTask = async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, done: !t.done } : t
    ));

    const { error } = await supabase
      .from('tasks')
      .update({ done: !task.done })
      .eq('id', taskId);

    if (error) {
      console.error('Error updating task:', error);
      setTasks(tasks.map(t => 
        t.id === taskId ? { ...t, done: task.done } : t
      ));
    }
  };

  // Supprimer une tâche
  const deleteTask = async (taskId: string) => {
    if (!confirm('Supprimer cette tâche ?')) return;

    // Update optimiste
    setTasks(tasks.filter(t => t.id !== taskId));

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
      loadTasks(); // Rollback
    }
  };

  // Grouper les tâches par bloc horaire
  const morningTasks = tasks.filter(t => {
    const hour = parseInt(t.time?.split('h')[0] || '0');
    return hour >= 6 && hour < 12;
  });

  const afternoonTasks = tasks.filter(t => {
    const hour = parseInt(t.time?.split('h')[0] || '0');
    return hour >= 12 && hour < 18;
  });

  const eveningTasks = tasks.filter(t => {
    const hour = parseInt(t.time?.split('h')[0] || '0');
    return hour >= 18 && hour < 23;
  });

  const otherTasks = tasks.filter(t => !t.time);

  // Couleurs de priorité
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'haute': return '#EF4444'; // Rouge
      case 'moyenne': return '#F59E0B'; // Orange
      case 'basse': return '#10B981'; // Vert
      default: return '#64748B'; // Gris
    }
  };

  // Navigation calendrier
  const goToPreviousDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goToNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const formatDate = (date: Date) => {
    const days = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
    const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
  };

  // Composant TaskItem
  const TaskItem = ({ task }: { task: Task }) => {
    const priorityColor = getPriorityColor(task.priority);
    
    return (
      <div className="flex items-center gap-3 p-3 bg-[#0F172A] rounded-xl group">
        <button
          onClick={() => toggleTask(task.id)}
          className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer hover:scale-110 flex-shrink-0 ${
            task.done ? 'bg-[#22D3EE] border-[#22D3EE]' : 'border-[#334155] hover:border-[#22D3EE]/50'
          }`}
        >
          {task.done && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>

        {/* Barre de priorité */}
        <div 
          className="w-1 h-8 rounded-full flex-shrink-0"
          style={{ backgroundColor: priorityColor }}
        />

        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium transition-all truncate ${task.done ? 'text-[#64748B] line-through' : 'text-[#F8FAFC]'}`}>
            {task.title}
          </p>
          <div className="flex items-center gap-2">
            <p className="text-xs text-[#64748B]">{task.time} • {task.tag}</p>
            <span 
              className="px-2 py-0.5 rounded text-[10px] font-semibold"
              style={{ 
                backgroundColor: `${priorityColor}20`,
                color: priorityColor
              }}
            >
              {task.priority === 'haute' ? 'Haute' : task.priority === 'moyenne' ? 'Moyenne' : 'Basse'}
            </span>
          </div>
        </div>

        {/* Bouton supprimer */}
        <button
          onClick={() => deleteTask(task.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-[#EF4444]/10 rounded-lg"
        >
          <Trash2 size={16} className="text-[#EF4444]" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0F172A] pb-24">
      <div className="max-w-3xl mx-auto px-6 py-8">
        
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-[#F8FAFC] mb-6">
            Planning
          </h1>

          {/* Date Selector */}
          <div className="flex items-center justify-between bg-[#1E293B] rounded-2xl p-4 border border-[#334155]">
            <button 
              onClick={goToPreviousDay}
              className="w-10 h-10 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center hover:border-[#22D3EE]/50 transition-colors"
            >
              <ChevronLeft size={18} className="text-[#64748B]" />
            </button>
            <span className="text-lg font-semibold text-[#F8FAFC]">
              {formatDate(currentDate)}
            </span>
            <button 
              onClick={goToNextDay}
              className="w-10 h-10 rounded-lg bg-[#0F172A] border border-[#334155] flex items-center justify-center hover:border-[#22D3EE]/50 transition-colors"
            >
              <ChevronRight size={18} className="text-[#64748B]" />
            </button>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-[#64748B]">Chargement...</p>
          </div>
        )}

        {/* BLOCS HORAIRES */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* MATIN */}
            <div className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[#F8FAFC]">Matin</h3>
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-8 h-8 rounded-lg bg-[#22D3EE]/10 border border-[#22D3EE]/30 flex items-center justify-center hover:bg-[#22D3EE]/20 transition-colors"
                >
                  <Plus size={16} className="text-[#22D3EE]" />
                </button>
              </div>

              <div className="space-y-2">
                {morningTasks.length === 0 ? (
                  <p className="text-sm text-[#64748B] text-center py-4">Aucune tâche</p>
                ) : (
                  morningTasks.map((task) => <TaskItem key={task.id} task={task} />)
                )}
              </div>
            </div>

            {/* MIDI */}
            <div className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[#F8FAFC]">Midi</h3>
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-8 h-8 rounded-lg bg-[#22D3EE]/10 border border-[#22D3EE]/30 flex items-center justify-center hover:bg-[#22D3EE]/20 transition-colors"
                >
                  <Plus size={16} className="text-[#22D3EE]" />
                </button>
              </div>

              <div className="space-y-2">
                {afternoonTasks.length === 0 ? (
                  <p className="text-sm text-[#64748B] text-center py-4">Aucune tâche</p>
                ) : (
                  afternoonTasks.map((task) => <TaskItem key={task.id} task={task} />)
                )}
              </div>
            </div>

            {/* APRÈS-MIDI */}
            <div className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[#F8FAFC]">Après-midi</h3>
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-8 h-8 rounded-lg bg-[#22D3EE]/10 border border-[#22D3EE]/30 flex items-center justify-center hover:bg-[#22D3EE]/20 transition-colors"
                >
                  <Plus size={16} className="text-[#22D3EE]" />
                </button>
              </div>

              <div className="space-y-2">
                {eveningTasks.length === 0 ? (
                  <p className="text-sm text-[#64748B] text-center py-4">Aucune tâche</p>
                ) : (
                  eveningTasks.map((task) => <TaskItem key={task.id} task={task} />)
                )}
              </div>
            </div>

            {/* SOIR */}
            <div className="bg-[#1E293B] rounded-2xl p-5 border border-[#334155]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-[#F8FAFC]">Soir</h3>
                <button
                  onClick={() => setModalOpen(true)}
                  className="w-8 h-8 rounded-lg bg-[#22D3EE]/10 border border-[#22D3EE]/30 flex items-center justify-center hover:bg-[#22D3EE]/20 transition-colors"
                >
                  <Plus size={16} className="text-[#22D3EE]" />
                </button>
              </div>

              <div className="space-y-2">
                {otherTasks.length === 0 ? (
                  <p className="text-sm text-[#64748B] text-center py-4">Aucune tâche</p>
                ) : (
                  otherTasks.map((task) => <TaskItem key={task.id} task={task} />)
                )}
              </div>
            </div>
          </div>
        )}

        {/* FAB */}
        <button
          onClick={() => setModalOpen(true)}
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-[#22D3EE] flex items-center justify-center shadow-lg shadow-[#22D3EE]/20 hover:scale-105 active:scale-95 transition-all z-30"
        >
          <Plus size={24} className="text-[#0F172A]" />
        </button>
      </div>

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1E293B] border-t border-[#334155] z-20">
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

      {/* MODALS */}
      <MenuPlus isOpen={menuPlusOpen} onClose={() => setMenuPlusOpen(false)} />
      <ModalNouvelleTache 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)}
        onSubmit={handleTaskAdded}
      />
    </div>
  );
}