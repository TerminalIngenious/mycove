// app/parametres/donnees/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { ChevronLeft, Download, Upload, Trash2 } from 'lucide-react';

export default function DonneesPage() {
  const router = useRouter();

  const handleExport = () => {
    alert('Export des données en cours...');
    // TODO: Implémenter l'export
  };

  const handleImport = () => {
    alert('Import des données...');
    // TODO: Implémenter l'import
  };

  const handleDelete = () => {
    if (confirm('⚠️ ATTENTION !\n\nCette action est irréversible.\nToutes tes données seront supprimées définitivement.\n\nVeux-tu vraiment continuer ?')) {
      alert('Suppression annulée pour cette démo');
      // TODO: Implémenter la suppression
    }
  };

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
            Gestion des données
          </h1>
        </div>

        {/* OPTIONS */}
        <div className="space-y-3">
          
          {/* Exporter */}
          <button
            onClick={handleExport}
            className="w-full p-5 rounded-xl bg-[#1E293B] border border-[#334155] hover:border-[#22D3EE]/50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#22D3EE]/10 flex items-center justify-center">
                <Download size={24} className="text-[#22D3EE]" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">
                  Exporter mes données
                </h3>
                <p className="text-sm text-[#64748B]">
                  Télécharger toutes tes données en JSON
                </p>
              </div>
            </div>
          </button>

          {/* Importer */}
          <button
            onClick={handleImport}
            className="w-full p-5 rounded-xl bg-[#1E293B] border border-[#334155] hover:border-[#22D3EE]/50 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[#10B981]/10 flex items-center justify-center">
                <Upload size={24} className="text-[#10B981]" />
              </div>
              <div className="flex-1 text-left">
                <h3 className="text-base font-semibold text-[#F8FAFC] mb-1">
                  Importer des données
                </h3>
                <p className="text-sm text-[#64748B]">
                  Restaurer une sauvegarde précédente
                </p>
              </div>
            </div>
          </button>

          {/* Supprimer */}
          <div className="pt-4">
            <button
              onClick={handleDelete}
              className="w-full p-5 rounded-xl bg-[#EF4444]/10 border-2 border-[#EF4444]/30 hover:border-[#EF4444] transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-[#EF4444]/20 flex items-center justify-center">
                  <Trash2 size={24} className="text-[#EF4444]" />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="text-base font-semibold text-[#EF4444] mb-1">
                    Supprimer toutes mes données
                  </h3>
                  <p className="text-sm text-[#EF4444]/70">
                    Action irréversible - Sois prudent !
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* INFO */}
        <div className="mt-8 p-4 bg-[#1E293B] rounded-xl border border-[#334155]">
          <p className="text-sm text-[#64748B] text-center">
            💡 Exporte régulièrement tes données pour ne rien perdre
          </p>
        </div>
      </div>
    </div>
  );
}