'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { MobileContainer } from '../../src/components/MobileContainer';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!password || password.length < 6) { setError('6 caractères minimum'); return; }
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas'); return; }
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/reset-password/confirm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.error || 'Lien invalide ou expiré');
      return;
    }
    setSuccess(true);
    setTimeout(() => router.push('/login'), 2000);
  };

  if (!token) return (
    <MobileContainer>
      <div className="min-h-screen flex items-center justify-center px-6">
        <p className="text-[#EF4444]">Lien invalide.</p>
      </div>
    </MobileContainer>
  );

  return (
    <MobileContainer>
      <div className="flex min-h-screen flex-col px-6 py-16">
        <h1 className="text-[32px] font-bold text-[#F8FAFC] mb-3">Nouveau mot de passe</h1>
        <p className="text-[#94A3B8] mb-10">Choisis un mot de passe sécurisé.</p>

        {success ? (
          <div className="p-4 bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl">
            <p className="text-[#10B981] font-medium">Mot de passe mis à jour ✓ Redirection...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {error && (
              <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl">
                <p className="text-sm text-[#EF4444]">{error}</p>
              </div>
            )}
            <div className="relative">
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">Nouveau mot de passe</label>
              <input type={showPassword ? 'text' : 'password'} value={password}
                onChange={e => setPassword(e.target.value)} placeholder="6 caractères minimum"
                className="w-full h-12 px-4 pr-12 bg-[#1E293B] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none" />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-9 text-[#64748B]">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#94A3B8] mb-2">Confirmer</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full h-12 px-4 bg-[#1E293B] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none" />
            </div>
            <button onClick={handleSubmit} disabled={loading}
              className="w-full h-12 rounded-xl bg-[#22D3EE] text-[#0F172A] font-semibold disabled:opacity-50">
              {loading ? 'Enregistrement...' : 'Confirmer'}
            </button>
          </div>
        )}
      </div>
    </MobileContainer>
  );
}

export default function ResetPasswordPage() {
  return <Suspense><ResetPasswordForm /></Suspense>;
}
