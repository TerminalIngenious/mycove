// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Home, Calendar, DollarSign, MoreHorizontal,
  Smile, Flame, CheckSquare, ChevronRight,
} from "lucide-react";
import { MenuPlus } from "../../src/components/MenuPlus";
import { supabase } from "../../src/lib/supabase";

type NavItem = "dashboard" | "planning" | "budget";

interface Task { id: string; title: string; time: string; tag: string; done: boolean; date: string; }
interface Goal { id: string; title: string; current_value: number; target_value: number; }
interface Note { id: string; title: string; tag: string; }
interface Activity { id: string; title: string; lieu: string; }
interface BudgetStats { revenus: number; depenses: number; solde: number; }

export default function DashboardScreen() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<NavItem>("dashboard");
  const [menuPlusOpen, setMenuPlusOpen] = useState(false);
  const [moodValue, setMoodValue] = useState(5);
  const [savedMood, setSavedMood] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [budget, setBudget] = useState<BudgetStats>({ revenus: 0, depenses: 0, solde: 0 });
  const [streak, setStreak] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) { router.push("/login"); return; }

      setUserId(user.id);
      const prenom = user.user_metadata?.prenom || user.user_metadata?.first_name || user.email?.split("@")[0] || "";
      setUserName(prenom);

      const today = new Date().toISOString().split("T")[0];
      const firstOfMonth = today.slice(0, 7) + "-01";

      const [moodRes, tasksRes, goalsRes, notesRes, activitiesRes, expensesRes, moodsRes] =
        await Promise.all([
          supabase.from("moods").select("*").eq("user_id", user.id).eq("date", today).single(),
          supabase.from("tasks").select("*").eq("user_id", user.id).eq("date", today).order("time", { ascending: true }),
          supabase.from("goals").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3),
          supabase.from("notes").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3),
          supabase.from("activities").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3),
          supabase.from("expenses").select("*").eq("user_id", user.id).gte("date", firstOfMonth),
          supabase.from("moods").select("date").eq("user_id", user.id).order("date", { ascending: false }),
        ]);

      if (moodRes.data && !moodRes.error) {
        setMoodValue(moodRes.data.mood_value);
        setSavedMood(moodRes.data.mood_value);
      }

      if (tasksRes.data) setTasks(tasksRes.data);
      if (goalsRes.data) setGoals(goalsRes.data);
      if (notesRes.data) setNotes(notesRes.data);
      if (activitiesRes.data) setActivities(activitiesRes.data);

      if (expensesRes.data) {
        const revenus = expensesRes.data.filter((e: any) => e.type === "revenu").reduce((s: number, e: any) => s + e.amount, 0);
        const depenses = expensesRes.data.filter((e: any) => e.type === "depense").reduce((s: number, e: any) => s + e.amount, 0);
        setBudget({ revenus, depenses, solde: revenus - depenses });
      }

      if (moodsRes.data && moodsRes.data.length > 0) {
        let count = 0;
        const checkDate = new Date();
        for (const mood of moodsRes.data) {
          if (mood.date === checkDate.toISOString().split("T")[0]) {
            count++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else break;
        }
        setStreak(count);
      }

      setLoading(false);
    };

    fetchAll();
  }, [router]);

  const toggleTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;
    setTasks(tasks.map((t) => t.id === taskId ? { ...t, done: !t.done } : t));
    await supabase.from("tasks").update({ done: !task.done }).eq("id", taskId);
  };

  const handleSaveMood = async () => {
    if (!userId) return;
    const today = new Date().toISOString().split("T")[0];
    const { data: existing } = await supabase.from("moods").select("*").eq("user_id", userId).eq("date", today).single();
    if (existing) {
      await supabase.from("moods").update({ mood_value: moodValue }).eq("id", existing.id);
    } else {
      await supabase.from("moods").insert({ user_id: userId, mood_value: moodValue, date: today });
    }
    setSavedMood(moodValue);
    setTimeout(() => setSavedMood(null), 2000);
  };

  const formatTodayLabel = () => {
    const now = new Date();
    const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
    const months = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
    return `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]}`;
  };

  const goalColors = ["#22D3EE", "#10B981", "#F97316", "#A78BFA", "#F472B6"];
  const noteColors: Record<string, string> = { Idée: "#A78BFA", Cours: "#22D3EE", Projet: "#10B981", Personnel: "#F97316", Autre: "#94A3B8" };
  const moodEmojis = ["😢", "😕", "😐", "🙂", "😊", "😄", "🤩", "🥳", "🔥", "✨"];
  const completedTasks = tasks.filter((t) => t.done).length;

  return (
    <div className="min-h-screen bg-[#0F172A] pb-24">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-[#F8FAFC] mb-2">
            {userName ? `Salut ${userName}` : "Bonjour "}
          </h1>
          <p className="text-base text-[#94A3B8]">{formatTodayLabel()} • Voici ton résumé</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">

            {/* HUMEUR */}
            <div className="bg-gradient-to-br from-[#22D3EE]/10 to-[#1DB8D1]/10 rounded-2xl p-6 border border-[#22D3EE]/20">
              <div className="flex items-center gap-3 mb-4">
                <Smile size={24} className="text-[#22D3EE]" />
                <h2 className="text-lg font-semibold text-[#F8FAFC]">Comment tu te sens aujourd'hui ?</h2>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{moodEmojis[moodValue]}</span>
                <input type="range" min="0" max="9" value={moodValue}
                  onChange={(e) => setMoodValue(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-[#0F172A] rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#22D3EE] [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#22D3EE] [&::-moz-range-thumb]:border-0"
                />
              </div>
              <button onClick={handleSaveMood} disabled={!userId}
                className={`w-full h-10 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 ${
                  savedMood !== null ? "bg-[#10B981] text-white" : "bg-[#22D3EE] text-[#0F172A] hover:bg-[#1DB8D1] active:scale-95"
                }`}>
                {savedMood !== null ? "✓ Enregistré" : "Enregistrer"}
              </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1E293B] rounded-xl p-5 border border-[#334155]">
                <div className="flex items-center gap-2 mb-3">
                  <Flame size={20} className="text-[#F97316]" />
                  <h3 className="text-sm font-medium text-[#94A3B8]">Streak</h3>
                </div>
                <p className="text-3xl font-bold text-[#F8FAFC]">
                  {streak > 0 ? `${streak} jour${streak > 1 ? "s" : ""}` : "—"}
                </p>
              </div>
              <div className="bg-[#1E293B] rounded-xl p-5 border border-[#334155]">
                <div className="flex items-center gap-2 mb-3">
                  <CheckSquare size={20} className="text-[#10B981]" />
                  <h3 className="text-sm font-medium text-[#94A3B8]">Tâches</h3>
                </div>
                <p className="text-3xl font-bold text-[#F8FAFC]">
                  {tasks.length > 0 ? `${completedTasks}/${tasks.length}` : "—"}
                </p>
              </div>
            </div>

            {/* BUDGET */}
            <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#F8FAFC]">Budget</h2>
                <button onClick={() => router.push("/budget")} className="text-sm font-medium text-[#22D3EE] hover:text-[#1DB8D1] transition-colors flex items-center gap-1">
                  Tout voir <ChevronRight size={16} />
                </button>
              </div>
              {budget.revenus === 0 && budget.depenses === 0 ? (
                <p className="text-sm text-[#64748B] text-center py-4">Aucune transaction ce mois-ci</p>
              ) : (
                <>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-xs text-[#64748B] mb-1">Solde</p>
                      <p className={`text-2xl font-bold ${budget.solde >= 0 ? "text-[#22D3EE]" : "text-[#EF4444]"}`}>
                        {budget.solde >= 0 ? "+" : ""}{budget.solde.toFixed(0)}€
                      </p>
                    </div>
                    <div className="text-center border-l border-r border-[#334155]">
                      <p className="text-xs text-[#64748B] mb-1">Revenus</p>
                      <p className="text-2xl font-bold text-[#10B981]">{budget.revenus.toFixed(0)}€</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-[#64748B] mb-1">Dépenses</p>
                      <p className="text-2xl font-bold text-[#EF4444]">{budget.depenses.toFixed(0)}€</p>
                    </div>
                  </div>
                  <div className="h-2 bg-[#0F172A] rounded-full overflow-hidden">
                    <div className="h-full bg-[#10B981] rounded-full"
                      style={{ width: `${budget.revenus > 0 ? Math.min(100, ((budget.revenus - budget.depenses) / budget.revenus) * 100) : 0}%` }} />
                  </div>
                </>
              )}
            </div>

            {/* TÂCHES */}
            <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#F8FAFC]">Tâches aujourd'hui</h2>
                <button onClick={() => router.push("/planning")} className="text-sm font-medium text-[#22D3EE] hover:text-[#1DB8D1] transition-colors flex items-center gap-1">
                  Tout voir <ChevronRight size={16} />
                </button>
              </div>
              {loading ? (
                <p className="text-sm text-[#64748B] text-center py-4">Chargement...</p>
              ) : tasks.length === 0 ? (
                <p className="text-sm text-[#64748B] text-center py-4">Aucune tâche aujourd'hui</p>
              ) : (
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div key={task.id} className="flex items-center gap-3 p-3 bg-[#0F172A] rounded-xl">
                      <button onClick={() => toggleTask(task.id)}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer hover:scale-110 flex-shrink-0 ${
                          task.done ? "bg-[#22D3EE] border-[#22D3EE]" : "border-[#334155] hover:border-[#22D3EE]/50"
                        }`}>
                        {task.done && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0F172A" strokeWidth="3" strokeLinecap="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${task.done ? "text-[#64748B] line-through" : "text-[#F8FAFC]"}`}>
                          {task.title}
                        </p>
                        <p className="text-xs text-[#64748B]">{task.time ? `${task.time} • ` : ""}{task.tag}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* COLONNE DROITE */}
          <div className="space-y-6">

            {/* OBJECTIFS */}
            <div className="bg-[#1E293B] rounded-xl p-5 border border-[#334155]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-[#F8FAFC]">Objectifs</h3>
                <button onClick={() => router.push("/objectifs")} className="text-sm font-medium text-[#22D3EE] hover:text-[#1DB8D1] flex items-center gap-1">
                  Tout voir <ChevronRight size={14} />
                </button>
              </div>
              {goals.length === 0 ? (
                <p className="text-sm text-[#64748B] text-center py-4">Aucun objectif</p>
              ) : (
                <div className="space-y-4">
                  {goals.map((goal, i) => {
                    const progress = goal.target_value > 0 ? Math.min(100, Math.round((goal.current_value / goal.target_value) * 100)) : 0;
                    const color = goalColors[i % goalColors.length];
                    return (
                      <div key={goal.id}>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-[#F8FAFC] truncate flex-1 mr-2">{goal.title}</p>
                          <span className="text-sm font-bold flex-shrink-0" style={{ color }}>{progress}%</span>
                        </div>
                        <div className="h-2 bg-[#0F172A] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: color }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* NOTES */}
            <div className="bg-[#1E293B] rounded-xl p-5 border border-[#334155]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-[#F8FAFC]">Dernières notes</h3>
                <button onClick={() => router.push("/bloc-notes")} className="text-sm font-medium text-[#22D3EE] hover:text-[#1DB8D1] flex items-center gap-1">
                  Tout voir <ChevronRight size={14} />
                </button>
              </div>
              {notes.length === 0 ? (
                <p className="text-sm text-[#64748B] text-center py-4">Aucune note</p>
              ) : (
                <div className="space-y-3">
                  {notes.map((note) => {
                    const color = noteColors[note.tag] || "#94A3B8";
                    return (
                      <div key={note.id} className="p-3 bg-[#0F172A] rounded-xl">
                        <p className="text-sm font-medium text-[#F8FAFC] mb-2 truncate">{note.title}</p>
                        <span className="px-2 py-1 rounded text-xs font-medium" style={{ backgroundColor: `${color}20`, color }}>
                          {note.tag}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ACTIVITÉS */}
            <div className="bg-[#1E293B] rounded-xl p-5 border border-[#334155]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-[#F8FAFC]">Activités</h3>
                <button onClick={() => router.push("/activites")} className="text-sm font-medium text-[#22D3EE] hover:text-[#1DB8D1] flex items-center gap-1">
                  Tout voir <ChevronRight size={14} />
                </button>
              </div>
              {activities.length === 0 ? (
                <p className="text-sm text-[#64748B] text-center py-4">Aucune activité</p>
              ) : (
                <div className="space-y-3">
                  {activities.map((activity) => (
                    <div key={activity.id} className="p-3 bg-[#0F172A] rounded-xl flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#22D3EE]/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg">📍</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#F8FAFC] truncate">{activity.title}</p>
                        <p className="text-xs text-[#64748B]">{activity.lieu}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1E293B] border-t border-[#334155]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-around">
          {[
            { nav: "dashboard" as NavItem, icon: <Home size={24} />, label: "Dashboard" },
            { nav: "planning" as NavItem, icon: <Calendar size={24} />, label: "Planning" },
            { nav: "budget" as NavItem, icon: <DollarSign size={24} />, label: "Budget" },
          ].map(({ nav, icon, label }) => (
            <button key={nav} onClick={() => { setActiveNav(nav); router.push(`/${nav}`); }}
              className={`flex flex-col items-center gap-1 transition-colors ${activeNav === nav ? "text-[#22D3EE]" : "text-[#64748B] hover:text-[#94A3B8]"}`}>
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
