// app/parametres/notifications/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

export default function NotificationsPage() {
  const router = useRouter();
  const [notifTaches, setNotifTaches] = useState(true);
  const [notifBudget, setNotifBudget] = useState(true);
  const [notifObjectifs, setNotifObjectifs] = useState(false);
  const [notifQuotidien, setNotifQuotidien] = useState(true);

  return (
    <div className="min-h-screen bg-[#0F172A]">
      <div className="max-w-3xl mx-auto px-6 py-8">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-lg bg-[#1E293B] border border-[#334155] flex items-center justify-center hover:border-[#22D3EE]/50 transition-colors"
          >
            <ChevronLeft size={20} className="text-[#F8FAFC]" />
          </button>
          <h1 className="text-[32px] font-bold text-[#F8FAFC]">
            Notifications
          </h1>
        </div>

        {/* SETTINGS */}
        <div className="space-y-4">
          
          {/* Tâches */}
          <div className="bg-[#1E293B] rounded-xl p-5 border border-[#334155]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">
                  Rappels de tâches
                </h3>
                <p className="text-sm text-[#64748B]">
                  Notifications pour les tâches du jour
                </p>
              </div>
              <button
                onClick={() => setNotifTaches(!notifTaches)}
                className={`w-14 h-8 rounded-full transition-all ${
                  notifTaches ? 'bg-[#22D3EE]' : 'bg-[#334155]'
                }`}
              >
                <div className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  notifTaches ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          {/* Budget */}
          <div className="bg-[#1E293B] rounded-xl p-5 border border-[#334155]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">
                  Alertes budget
                </h3>
                <p className="text-sm text-[#64748B]">
                  Alertes quand tu dépasses ton budget
                </p>
              </div>
              <button
                onClick={() => setNotifBudget(!notifBudget)}
                className={`w-14 h-8 rounded-full transition-all ${
                  notifBudget ? 'bg-[#22D3EE]' : 'bg-[#334155]'
                }`}
              >
                <div className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  notifBudget ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          {/* Objectifs */}
          <div className="bg-[#1E293B] rounded-xl p-5 border border-[#334155]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">
                  Progression objectifs
                </h3>
                <p className="text-sm text-[#64748B]">
                  Notifications quand tu atteins un objectif
                </p>
              </div>
              <button
                onClick={() => setNotifObjectifs(!notifObjectifs)}
                className={`w-14 h-8 rounded-full transition-all ${
                  notifObjectifs ? 'bg-[#22D3EE]' : 'bg-[#334155]'
                }`}
              >
                <div className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  notifObjectifs ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>

          {/* Rappel quotidien */}
          <div className="bg-[#1E293B] rounded-xl p-5 border border-[#334155]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">
                  Rappel quotidien
                </h3>
                <p className="text-sm text-[#64748B]">
                  Notification chaque matin à 8h
                </p>
              </div>
              <button
                onClick={() => setNotifQuotidien(!notifQuotidien)}
                className={`w-14 h-8 rounded-full transition-all ${
                  notifQuotidien ? 'bg-[#22D3EE]' : 'bg-[#334155]'
                }`}
              >
                <div className={`w-6 h-6 rounded-full bg-white transition-transform ${
                  notifQuotidien ? 'translate-x-7' : 'translate-x-1'
                }`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}