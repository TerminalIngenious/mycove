'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Check, Eye, EyeOff, Loader2 } from 'lucide-react';

type NiveauOption = 'lycee' | 'licence' | 'master' | 'bts' | 'but' | 'prepa';

const niveauxOptions = [
  { id: 'lycee' as NiveauOption, titre: 'Lycée', sousTitre: 'Seconde à Terminale' },
  { id: 'licence' as NiveauOption, titre: 'Licence', sousTitre: 'L1 - L2 - L3' },
  { id: 'master' as NiveauOption, titre: 'Master / École', sousTitre: 'M1 - M2 - Grande École' },
  { id: 'bts' as NiveauOption, titre: 'BTS', sousTitre: 'Brevet de Technicien Supérieur' },
  { id: 'but' as NiveauOption, titre: 'BUT', sousTitre: 'Bachelor Universitaire de Technologie' },
  { id: 'prepa' as NiveauOption, titre: 'Prépa', sousTitre: 'Classes Préparatoires' },
];

type Section = 'identite' | 'motdepasse' | 'etudes';

export default function ModifierProfilScreen() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<Section>('identite');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccess] = useState('');
  const [errorMsg, setError] = useState('');

  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [niveau, setNiveau] = useState<NiveauOption | null>(null);

  useEffect(() => {
    fetch('/api/user/me')
      .then(res => res.json())
      .then(data => {
        setPrenom(data.prenom || '');
        setNom(data.nom || '');
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const showFeedback = (msg: string, isError = false) => {
    if (isError) { setError(msg); setTimeout(() => setError(''), 3500); }
    else { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); }
  };

  const saveIdentite = async () => {
    if (!prenom.trim() || !nom.trim()) { showFeedback('Prénom et nom obligatoires', true); return; }
    setSaving(true);
    const res = await fetch('/api/user/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prenom: prenom.trim(), nom: nom.trim() }),
    });
    setSaving(false);
    if (!res.ok) { showFeedback('Erreur lors de la sauvegarde', true); return; }
    showFeedback('Identité mise à jour ✓');
  };

  const saveMotDePasse = async () => {
    if (!newPassword) { showFeedback('Saisis un nouveau mot de passe', true); return; }
    if (newPassword.length < 6) { showFeedback('Le mot de passe doit faire au moins 6 caractères', true); return; }
    if (newPassword !== confirmPassword) { showFeedback('Les mots de passe ne correspondent pas', true); return; }
    setSaving(true);
    const res = await fetch('/api/user/password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    setSaving(false);
    if (!res.ok) {
      const data = await res.json();
      showFeedback(data.error || 'Erreur', true);
      return;
    }
    setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    showFeedback('Mot de passe mis à jour ✓');
  };

  const tabs: { id: Section; label: string }[] = [
    { id: 'identite', label: 'Identité' },
    { id: 'motdepasse', label: 'Mot de passe' },
    { id: 'etudes', label: 'Études' },
  ];

  if (loading) return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
      <Loader2 size={32} className="text-[#22D3EE] animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F172A] pb-12">
      <div className="max-w-xl mx-auto px-6 py-8">

        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()}
            className="w-10 h-10 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-center hover:border-[#22D3EE]/50 transition-colors">
            <ChevronLeft size={20} className="text-[#F8FAFC]" />
          </button>
          <h1 className="text-[28px] font-bold text-[#F8FAFC]">Modifier mon profil</h1>
        </div>

        <div className="flex gap-2 mb-8 bg-[#1E293B] p-1 rounded-xl border border-[#334155]">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => { setActiveSection(tab.id); setError(''); setSuccess(''); }}
              className={`flex-1 h-10 rounded-lg text-sm font-semibold transition-all ${
                activeSection === tab.id ? 'bg-[#22D3EE] text-[#0F172A]' : 'text-[#64748B] hover:text-[#94A3B8]'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {successMsg && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl">
            <Check size={18} className="text-[#10B981] flex-shrink-0" />
            <p className="text-sm text-[#10B981] font-medium">{successMsg}</p>
          </div>
        )}
        {errorMsg && (
          <div className="mb-6 p-4 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl">
            <p className="text-sm text-[#EF4444] font-medium">{errorMsg}</p>
          </div>
        )}

        {activeSection === 'identite' && (
          <div className="space-y-4">
            <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155] space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Prénom</label>
                <input type="text" value={prenom} onChange={e => setPrenom(e.target.value)} placeholder="Ton prénom"
                  className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Nom</label>
                <input type="text" value={nom} onChange={e => setNom(e.target.value)} placeholder="Ton nom"
                  className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none" />
              </div>
            </div>
            <button onClick={saveIdentite} disabled={saving}
              className="w-full h-12 rounded-xl bg-[#22D3EE] text-[#0F172A] text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <><Loader2 size={16} className="animate-spin" /> Enregistrement...</> : 'Enregistrer'}
            </button>
          </div>
        )}

        {activeSection === 'motdepasse' && (
          <div className="space-y-4">
            <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155] space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Mot de passe actuel</label>
                <div className="relative">
                  <input type={showCurrent ? 'text' : 'password'} value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••"
                    className="w-full h-12 px-4 pr-12 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none" />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B]">
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Nouveau mot de passe</label>
                <div className="relative">
                  <input type={showNew ? 'text' : 'password'} value={newPassword}
                    onChange={e => setNewPassword(e.target.value)} placeholder="6 caractères minimum"
                    className="w-full h-12 px-4 pr-12 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none" />
                  <button type="button" onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B]">
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {newPassword.length > 0 && (
                  <div className="mt-2 flex gap-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`flex-1 h-1 rounded-full transition-all ${
                        newPassword.length >= i * 3
                          ? i <= 1 ? 'bg-[#EF4444]' : i <= 2 ? 'bg-[#F59E0B]' : i <= 3 ? 'bg-[#22D3EE]' : 'bg-[#10B981]'
                          : 'bg-[#334155]'
                      }`} />
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Confirmer le nouveau mot de passe</label>
                <div className="relative">
                  <input type={showConfirm ? 'text' : 'password'} value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••"
                    className={`w-full h-12 px-4 pr-12 bg-[#0F172A] border rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none ${
                      confirmPassword && confirmPassword !== newPassword ? 'border-[#EF4444]' : 'border-[#334155] focus:border-[#22D3EE]'
                    }`} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B]">
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="text-xs text-[#EF4444] mt-1">Les mots de passe ne correspondent pas</p>
                )}
              </div>
            </div>
            <button onClick={saveMotDePasse} disabled={saving || !currentPassword || !newPassword || newPassword !== confirmPassword}
              className="w-full h-12 rounded-xl bg-[#22D3EE] text-[#0F172A] text-sm font-semibold disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <><Loader2 size={16} className="animate-spin" /> Enregistrement...</> : 'Changer le mot de passe'}
            </button>
          </div>
        )}

        {activeSection === 'etudes' && (
          <div className="space-y-4">
            <div className="space-y-3">
              {niveauxOptions.map(option => (
                <button key={option.id} onClick={() => setNiveau(option.id)}
                  className={`w-full h-[72px] rounded-xl bg-[#1E293B] border-2 px-6 flex items-center gap-4 transition-all ${
                    niveau === option.id ? 'border-[#22D3EE]' : 'border-[#334155]'
                  }`}>
                  <div className="flex flex-col items-start flex-1">
                    <span className="text-base font-semibold text-[#F8FAFC]">{option.titre}</span>
                    <span className="text-sm text-[#94A3B8]">{option.sousTitre}</span>
                  </div>
                  {niveau === option.id && (
                    <div className="w-5 h-5 rounded-full bg-[#22D3EE] flex items-center justify-center">
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                        <path d="M1 5L4.5 8.5L11 1.5" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <p className="text-xs text-[#64748B] text-center">Le niveau d'études sera sauvegardé prochainement</p>
          </div>
        )}
      </div>
    </div>
  );
}
