// app/modifier-profil/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Check, Eye, EyeOff, Loader2 } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';

type NiveauOption = 'lycee' | 'licence' | 'master' | 'autre';

const niveauxOptions = [
  { id: 'lycee'   as NiveauOption, titre: 'Lycée',          sousTitre: 'Seconde à Terminale' },
  { id: 'licence' as NiveauOption, titre: 'Licence',        sousTitre: 'L1 - L2 - L3' },
  { id: 'master'  as NiveauOption, titre: 'Master / École', sousTitre: 'M1 - M2 - Grande École' },
  { id: 'autre'   as NiveauOption, titre: 'Autre',          sousTitre: 'BTS, BUT, Prépa...' },
];

type Section = 'identite' | 'motdepasse' | 'etudes';

export default function ModifierProfilScreen() {
  const router = useRouter();

  // Section active
  const [activeSection, setActiveSection] = useState<Section>('identite');

  // Chargement
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [successMsg, setSuccess] = useState('');
  const [errorMsg, setError]     = useState('');

  // Identité
  const [prenom, setPrenom] = useState('');
  const [nom, setNom]       = useState('');

  // Mot de passe
  const [currentPassword, setCurrentPassword]   = useState('');
  const [newPassword, setNewPassword]           = useState('');
  const [confirmPassword, setConfirmPassword]   = useState('');
  const [showCurrent, setShowCurrent]           = useState(false);
  const [showNew, setShowNew]                   = useState(false);
  const [showConfirm, setShowConfirm]           = useState(false);

  // Niveau d'études
  const [niveau, setNiveau] = useState<NiveauOption | null>(null);

  // Charger les données actuelles
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) { router.push('/login'); return; }

      setPrenom(user.user_metadata?.prenom || '');
      setNom(user.user_metadata?.nom || '');
      setNiveau(user.user_metadata?.niveau_etudes || null);
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  const showFeedback = (msg: string, isError = false) => {
    if (isError) { setError(msg); setTimeout(() => setError(''), 3500); }
    else         { setSuccess(msg); setTimeout(() => setSuccess(''), 3000); }
  };

  // Sauvegarder identité
  const saveIdentite = async () => {
    if (!prenom.trim() || !nom.trim()) { showFeedback('Prénom et nom obligatoires', true); return; }
    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      data: { prenom: prenom.trim(), nom: nom.trim() },
    });

    setSaving(false);
    if (error) { showFeedback('Erreur : ' + error.message, true); return; }
    showFeedback('Identité mise à jour ✓');
  };

  // Sauvegarder mot de passe
  const saveMotDePasse = async () => {
    if (!newPassword) { showFeedback('Saisis un nouveau mot de passe', true); return; }
    if (newPassword.length < 6) { showFeedback('Le mot de passe doit faire au moins 6 caractères', true); return; }
    if (newPassword !== confirmPassword) { showFeedback('Les mots de passe ne correspondent pas', true); return; }

    setSaving(true);

    // Vérifier l'ancien mot de passe en tentant une connexion
    const { data: { user } } = await supabase.auth.getUser();
    const email = user?.email || '';

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: currentPassword,
    });

    if (signInError) { setSaving(false); showFeedback('Mot de passe actuel incorrect', true); return; }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSaving(false);

    if (error) { showFeedback('Erreur : ' + error.message, true); return; }

    setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
    showFeedback('Mot de passe mis à jour ✓');
  };

  // Sauvegarder niveau d'études
  const saveNiveau = async () => {
    if (!niveau) { showFeedback('Sélectionne un niveau', true); return; }
    setSaving(true);

    const { error } = await supabase.auth.updateUser({
      data: { niveau_etudes: niveau },
    });

    setSaving(false);
    if (error) { showFeedback('Erreur : ' + error.message, true); return; }
    showFeedback('Niveau d\'études mis à jour ✓');
  };

  const tabs: { id: Section; label: string }[] = [
    { id: 'identite',    label: 'Identité' },
    { id: 'motdepasse',  label: 'Mot de passe' },
    { id: 'etudes',      label: 'Études' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <Loader2 size={32} className="text-[#22D3EE] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] pb-12">
      <div className="max-w-xl mx-auto px-6 py-8">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => router.back()}
            className="w-10 h-10 rounded-xl bg-[#1E293B] border border-[#334155] flex items-center justify-center hover:border-[#22D3EE]/50 transition-colors">
            <ChevronLeft size={20} className="text-[#F8FAFC]" />
          </button>
          <h1 className="text-[28px] font-bold text-[#F8FAFC]">Modifier mon profil</h1>
        </div>

        {/* TABS */}
        <div className="flex gap-2 mb-8 bg-[#1E293B] p-1 rounded-xl border border-[#334155]">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => { setActiveSection(tab.id); setError(''); setSuccess(''); }}
              className={`flex-1 h-10 rounded-lg text-sm font-semibold transition-all ${
                activeSection === tab.id
                  ? 'bg-[#22D3EE] text-[#0F172A]'
                  : 'text-[#64748B] hover:text-[#94A3B8]'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* FEEDBACK */}
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

        {/* ── SECTION IDENTITÉ ── */}
        {activeSection === 'identite' && (
          <div className="space-y-4">
            <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155] space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Prénom</label>
                <input type="text" value={prenom} onChange={e => setPrenom(e.target.value)}
                  placeholder="Ton prénom"
                  className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Nom</label>
                <input type="text" value={nom} onChange={e => setNom(e.target.value)}
                  placeholder="Ton nom"
                  className="w-full h-12 px-4 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none transition-colors" />
              </div>
            </div>

            <button onClick={saveIdentite} disabled={saving}
              className="w-full h-12 rounded-xl bg-[#22D3EE] text-[#0F172A] text-sm font-semibold transition-all hover:bg-[#1DB8D1] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <><Loader2 size={16} className="animate-spin" /> Enregistrement...</> : 'Enregistrer'}
            </button>
          </div>
        )}

        {/* ── SECTION MOT DE PASSE ── */}
        {activeSection === 'motdepasse' && (
          <div className="space-y-4">
            <div className="bg-[#1E293B] rounded-2xl p-6 border border-[#334155] space-y-4">

              {/* Mot de passe actuel */}
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Mot de passe actuel</label>
                <div className="relative">
                  <input type={showCurrent ? 'text' : 'password'} value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)} placeholder="••••••••"
                    className="w-full h-12 px-4 pr-12 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none transition-colors" />
                  <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8]">
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Nouveau mot de passe */}
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Nouveau mot de passe</label>
                <div className="relative">
                  <input type={showNew ? 'text' : 'password'} value={newPassword}
                    onChange={e => setNewPassword(e.target.value)} placeholder="6 caractères minimum"
                    className="w-full h-12 px-4 pr-12 bg-[#0F172A] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none transition-colors" />
                  <button type="button" onClick={() => setShowNew(!showNew)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8]">
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {/* Barre de force */}
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

              {/* Confirmer */}
              <div>
                <label className="block text-sm font-medium text-[#94A3B8] mb-2">Confirmer le nouveau mot de passe</label>
                <div className="relative">
                  <input type={showConfirm ? 'text' : 'password'} value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••"
                    className={`w-full h-12 px-4 pr-12 bg-[#0F172A] border rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none transition-colors ${
                      confirmPassword && confirmPassword !== newPassword ? 'border-[#EF4444]' : 'border-[#334155] focus:border-[#22D3EE]'
                    }`} />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#94A3B8]">
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="text-xs text-[#EF4444] mt-1">Les mots de passe ne correspondent pas</p>
                )}
              </div>
            </div>

            <button onClick={saveMotDePasse} disabled={saving || !currentPassword || !newPassword || newPassword !== confirmPassword}
              className="w-full h-12 rounded-xl bg-[#22D3EE] text-[#0F172A] text-sm font-semibold transition-all hover:bg-[#1DB8D1] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <><Loader2 size={16} className="animate-spin" /> Enregistrement...</> : 'Changer le mot de passe'}
            </button>
          </div>
        )}

        {/* ── SECTION NIVEAU D'ÉTUDES ── */}
        {activeSection === 'etudes' && (
          <div className="space-y-4">
            <div className="space-y-3">
              {niveauxOptions.map(option => (
                <button key={option.id} onClick={() => setNiveau(option.id)}
                  className={`w-full h-[72px] rounded-xl bg-[#1E293B] border-2 px-6 flex items-center gap-4 transition-all hover:border-[#22D3EE]/50 active:scale-[0.98] ${
                    niveau === option.id ? 'border-[#22D3EE]' : 'border-[#334155]'
                  }`}>
                  <div className="flex flex-col items-start flex-1">
                    <span className="text-base font-semibold text-[#F8FAFC]">{option.titre}</span>
                    <span className="text-sm text-[#94A3B8]">{option.sousTitre}</span>
                  </div>
                  {niveau === option.id && (
                    <div className="w-5 h-5 rounded-full bg-[#22D3EE] flex items-center justify-center flex-shrink-0">
                      <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                        <path d="M1 5L4.5 8.5L11 1.5" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button onClick={saveNiveau} disabled={saving || !niveau}
              className="w-full h-12 rounded-xl bg-[#22D3EE] text-[#0F172A] text-sm font-semibold transition-all hover:bg-[#1DB8D1] active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <><Loader2 size={16} className="animate-spin" /> Enregistrement...</> : 'Enregistrer'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}