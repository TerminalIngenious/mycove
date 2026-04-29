// app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Home,
  Calendar,
  DollarSign,
  MoreHorizontal,
  Smile,
  Flame,
  CheckSquare,
  ChevronRight,
  Film,
  Utensils,
  Trophy,
} from "lucide-react";
import { MenuPlus } from "../../src/components/MenuPlus";
import { supabase } from "../../src/lib/supabase";

type NavItem = "dashboard" | "planning" | "budget";

interface Task {
  id: string;
  title: string;
  time: string;
  tag: string;
  done: boolean;
}

export default function DashboardScreen() {
  const router = useRouter();
  const [activeNav, setActiveNav] = useState<NavItem>("dashboard");
  const [menuPlusOpen, setMenuPlusOpen] = useState(false);
  const [moodValue, setMoodValue] = useState(7);
  const [savedMood, setSavedMood] = useState<number | null>(null);
  // ✅ FIX 1 : userId récupéré depuis Supabase auth, plus hardcodé
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>("toi");

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Réviser cours de maths",
      time: "9h00",
      tag: "Étude",
      done: true,
    },
    {
      id: "2",
      title: "Réunion client Zoom",
      time: "11h00",
      tag: "Travail",
      done: true,
    },
    {
      id: "3",
      title: "TP informatique",
      time: "14h00",
      tag: "Étude",
      done: false,
    },
    {
      id: "4",
      title: "Sport salle",
      time: "19h00",
      tag: "Bien-être",
      done: false,
    },
  ]);

  // ✅ FIX 1 : Récupérer le vrai utilisateur connecté via Supabase
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        // Pas connecté → rediriger vers login
        router.push("/login");
        return;
      }

      setUserId(user.id);

      // Récupérer le prénom depuis les métadonnées ou le profil
      const prenom =
        user.user_metadata?.prenom ||
        user.user_metadata?.first_name ||
        user.email?.split("@")[0] ||
        "toi";
      setUserName(prenom);

      loadTodayMood(user.id);
    };

    fetchUser();
  }, [router]);

  // Charger l'humeur du jour
  const loadTodayMood = async (uid: string) => {
    const today = new Date().toISOString().split("T")[0];

    const { data, error } = await supabase
      .from("moods")
      .select("*")
      .eq("user_id", uid)
      .eq("date", today)
      .single();

    if (data && !error) {
      setMoodValue(data.mood_value);
      setSavedMood(data.mood_value);
    }
  };

  const handleNavigation = (nav: NavItem) => {
    setActiveNav(nav);
    router.push(`/${nav}`);
  };

  const toggleTask = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, done: !task.done } : task
      )
    );
  };

  const handleSaveMood = async () => {
    if (!userId) {
      console.error("User not logged in");
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    const { data: existing } = await supabase
      .from("moods")
      .select("*")
      .eq("user_id", userId)
      .eq("date", today)
      .single();

    if (existing) {
      const { error } = await supabase
        .from("moods")
        .update({ mood_value: moodValue })
        .eq("id", existing.id);

      if (error) {
        console.error("Error updating mood:", error);
        return;
      }
    } else {
      const { error } = await supabase.from("moods").insert({
        user_id: userId,
        mood_value: moodValue,
        date: today,
      });

      if (error) {
        console.error("Error saving mood:", error);
        return;
      }
    }

    setSavedMood(moodValue);
    setTimeout(() => setSavedMood(null), 2000);
  };

  // ✅ Date du jour affichée dynamiquement
  const formatTodayLabel = () => {
    const now = new Date();
    const days = [
      "Dimanche",
      "Lundi",
      "Mardi",
      "Mercredi",
      "Jeudi",
      "Vendredi",
      "Samedi",
    ];
    const months = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];
    return `${days[now.getDay()]} ${now.getDate()} ${months[now.getMonth()]}`;
  };

  const moodEmojis = [
    "😢",
    "😕",
    "😐",
    "🙂",
    "😊",
    "😄",
    "🤩",
    "🥳",
    "🔥",
    "✨",
  ];
  const completedTasks = tasks.filter((t) => t.done).length;
  const totalTasks = tasks.length;

  return (
    <div className="min-h-screen bg-[#0F172A] pb-24">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* HEADER */}
        <div className="mb-8">
          {/* ✅ FIX 1 : Prénom dynamique */}
          <h1 className="text-[32px] font-bold text-[#F8FAFC] mb-2">
            Salut {userName} 👋
          </h1>
          {/* ✅ Date dynamique */}
          <p className="text-base text-[#94A3B8]">
            {formatTodayLabel()} • Voici ton résumé
          </p>
        </div>

        {/* LAYOUT 2 COLONNES */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* COLONNE GAUCHE (2/3) */}
          <div className="lg:col-span-2 space-y-6">
            {/* WIDGET BIEN-ÊTRE */}
            <div className="bg-gradient-to-br from-[#22D3EE]/10 to-[#1DB8D1]/10 rounded-2xl p-6 border border-[#22D3EE]/20">
              <div className="flex items-center gap-3 mb-4">
                <Smile size={24} className="text-[#22D3EE]" />
                <h2 className="text-lg font-semibold text-[#F8FAFC]">
                  Comment tu te sens aujourd'hui ?
                </h2>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{moodEmojis[moodValue]}</span>
                <input
                  type="range"
                  min="0"
                  max="9"
                  value={moodValue}
                  onChange={(e) => setMoodValue(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-[#0F172A] rounded-full appearance-none cursor-pointer
                    [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#22D3EE] [&::-webkit-slider-thumb]:cursor-pointer
                    [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#22D3EE] [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
                />
              </div>

              <button
                onClick={handleSaveMood}
                disabled={!userId}
                className={`w-full h-10 rounded-xl text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  savedMood !== null
                    ? "bg-[#10B981] text-white"
                    : "bg-[#22D3EE] text-[#0F172A] hover:bg-[#1DB8D1] active:scale-95"
                }`}
              >
                {savedMood !== null ? "✓ Enregistré" : "Enregistrer"}
              </button>
            </div>

            {/* STAT CARDS */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#1E293B] rounded-xl p-5 border border-[#334155]">
                <div className="flex items-center gap-2 mb-3">
                  <Flame size={20} className="text-[#F97316]" />
                  <h3 className="text-sm font-medium text-[#94A3B8]">Streak</h3>
                </div>
                <p className="text-3xl font-bold text-[#F8FAFC]">7 jours</p>
              </div>

              <div className="bg-[#1E293B] rounded-xl p-5 border border-[#334155]">
                <div className="flex items-center gap-2 mb-3">
                  <CheckSquare size={20} className="text-[#10B981]" />
                  <h3 className="text-sm font-medium text-[#94A3B8]">Tâches</h3>
                </div>
                <p className="text-3xl font-bold text-[#F8FAFC]">
                  {completedTasks}/{totalTasks}
                </p>
              </div>
            </div>

            {/* BUDGET */}
            <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#F8FAFC]">Budget</h2>
                <button
                  onClick={() => router.push("/budget")}
                  className="text-sm font-medium text-[#22D3EE] hover:text-[#1DB8D1] transition-colors flex items-center gap-1"
                >
                  Tout voir
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-xs text-[#64748B] mb-1">Solde</p>
                  <p className="text-2xl font-bold text-[#22D3EE]">+130€</p>
                </div>
                <div className="text-center border-l border-r border-[#334155]">
                  <p className="text-xs text-[#64748B] mb-1">Revenus</p>
                  <p className="text-2xl font-bold text-[#10B981]">450€</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-[#64748B] mb-1">Dépenses</p>
                  <p className="text-2xl font-bold text-[#EF4444]">320€</p>
                </div>
              </div>

              <div className="h-2 bg-[#0F172A] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#10B981] rounded-full"
                  style={{ width: "71%" }}
                />
              </div>
            </div>

            {/* TÂCHES AUJOURD'HUI */}
            <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155]">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#F8FAFC]">
                  Tâches aujourd'hui
                </h2>
                <button
                  onClick={() => router.push("/planning")}
                  className="text-sm font-medium text-[#22D3EE] hover:text-[#1DB8D1] transition-colors flex items-center gap-1"
                >
                  Tout voir
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 bg-[#0F172A] rounded-xl"
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all cursor-pointer hover:scale-110 ${
                        task.done
                          ? "bg-[#22D3EE] border-[#22D3EE]"
                          : "border-[#334155] hover:border-[#22D3EE]/50"
                      }`}
                    >
                      {task.done && (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#0F172A"
                          strokeWidth="3"
                          strokeLinecap="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium transition-all ${task.done ? "text-[#64748B] line-through" : "text-[#F8FAFC]"}`}
                      >
                        {task.title}
                      </p>
                      <p className="text-xs text-[#64748B]">
                        {task.time} • {task.tag}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLONNE DROITE (1/3) */}
          <div className="space-y-6">
            {/* OBJECTIFS */}
            <div className="bg-[#1E293B] rounded-xl p-5 border border-[#334155]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-[#F8FAFC]">
                  Objectifs
                </h3>
                <button
                  onClick={() => router.push("/objectifs")}
                  className="text-sm font-medium text-[#22D3EE] hover:text-[#1DB8D1] transition-colors flex items-center gap-1"
                >
                  Tout voir
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="space-y-4">
                {[
                  {
                    title: "Finir 3 chapitres maths",
                    progress: 66,
                    color: "#22D3EE",
                  },
                  { title: "Économiser 200€", progress: 40, color: "#10B981" },
                  { title: "Lancer MyCove", progress: 55, color: "#F97316" },
                ].map((goal, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm text-[#F8FAFC]">{goal.title}</p>
                      <span
                        className="text-sm font-bold"
                        style={{ color: goal.color }}
                      >
                        {goal.progress}%
                      </span>
                    </div>
                    <div className="h-2 bg-[#0F172A] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${goal.progress}%`,
                          backgroundColor: goal.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DERNIÈRES NOTES */}
            <div className="bg-[#1E293B] rounded-xl p-5 border border-[#334155]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-[#F8FAFC]">
                  Dernières notes
                </h3>
                <button
                  onClick={() => router.push("/bloc-notes")}
                  className="text-sm font-medium text-[#22D3EE] hover:text-[#1DB8D1] transition-colors flex items-center gap-1"
                >
                  Tout voir
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: "Idées features MyCove",
                    tag: "Idée",
                    color: "#A78BFA",
                  },
                  {
                    title: "Résumé cours React",
                    tag: "Cours",
                    color: "#22D3EE",
                  },
                  {
                    title: "Devis client Malt",
                    tag: "Projet",
                    color: "#10B981",
                  },
                ].map((note, i) => (
                  <div key={i} className="p-3 bg-[#0F172A] rounded-xl">
                    <p className="text-sm font-medium text-[#F8FAFC] mb-2">
                      {note.title}
                    </p>
                    <span
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: `${note.color}20`,
                        color: note.color,
                      }}
                    >
                      {note.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ACTIVITÉS */}
            <div className="bg-[#1E293B] rounded-xl p-5 border border-[#334155]">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-base font-semibold text-[#F8FAFC]">
                  Activités
                </h3>
                <button
                  onClick={() => router.push("/activites")}
                  className="text-sm font-medium text-[#22D3EE] hover:text-[#1DB8D1] transition-colors flex items-center gap-1"
                >
                  Tout voir
                  <ChevronRight size={14} />
                </button>
              </div>

              <div className="space-y-3">
                {[
                  {
                    title: "Nouveau Marvel",
                    icon: Film,
                    lieu: "Castres",
                    color: "#F472B6",
                  },
                  {
                    title: "Pizzeria du centre",
                    icon: Utensils,
                    lieu: "Mazamet",
                    color: "#FBBF24",
                  },
                  {
                    title: "Match basket IUT",
                    icon: Trophy,
                    lieu: "Tarbes",
                    color: "#F97316",
                  },
                ].map((activity, i) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={i}
                      className="p-3 bg-[#0F172A] rounded-xl flex items-center gap-3"
                    >
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${activity.color}15` }}
                      >
                        <Icon size={18} style={{ color: activity.color }} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-[#F8FAFC]">
                          {activity.title}
                        </p>
                        <p className="text-xs text-[#64748B]">{activity.lieu}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM NAVIGATION */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1E293B] border-t border-[#334155]">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-around">
          <button
            onClick={() => handleNavigation("dashboard")}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeNav === "dashboard"
                ? "text-[#22D3EE]"
                : "text-[#64748B] hover:text-[#94A3B8]"
            }`}
          >
            <Home size={24} />
            <span className="text-xs font-medium">Dashboard</span>
          </button>

          <button
            onClick={() => handleNavigation("planning")}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeNav === "planning"
                ? "text-[#22D3EE]"
                : "text-[#64748B] hover:text-[#94A3B8]"
            }`}
          >
            <Calendar size={24} />
            <span className="text-xs font-medium">Planning</span>
          </button>

          <button
            onClick={() => handleNavigation("budget")}
            className={`flex flex-col items-center gap-1 transition-colors ${
              activeNav === "budget"
                ? "text-[#22D3EE]"
                : "text-[#64748B] hover:text-[#94A3B8]"
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