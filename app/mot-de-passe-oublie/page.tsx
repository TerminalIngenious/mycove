'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { MobileContainer } from '../../src/components/MobileContainer';

export default function MotDePasseOublieScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Entre ton adresse email'); return; }
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    setLoading(false);
    if (!res.ok) { setError('Une erreur est survenue'); return; }
    setSent(true);
  };

  return (
    <MobileContainer>
      <div className="flex min-h-screen flex-col px-6 py-16">
        <button onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors self-start">
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Retour</span>
        </button>

        <h1 className="mb-4 text-[32px] font-bold text-[#F8FAFC]">Mot de passe oublié ?</h1>
        <p className="mb-10 text-base text-[#94A3B8] leading-relaxed">
          Entre ton email et on t'envoie un lien de réinitialisation.
        </p>

        {sent ? (
          <div className="p-5 bg-[#10B981]/10 border border-[#10B981]/30 rounded-xl">
            <p className="text-[#10B981] font-semibold mb-1">Email envoyé 📧</p>
            <p className="text-sm text-[#94A3B8]">Vérifie ta boîte mail. Le lien expire dans 1 heure.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && (
              <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl">
                <p className="text-sm text-[#EF4444]">{error}</p>
              </div>
            )}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-[#94A3B8]">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="ton@email.fr" disabled={loading}
                className="h-14 w-full rounded-xl bg-[#1E293B] border border-[#334155] px-4 text-base text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#22D3EE] transition-colors disabled:opacity-50" />
            </div>
            <button type="submit" disabled={loading}
              className="h-14 w-full rounded-xl bg-[#22D3EE] text-[#0F172A] text-base font-semibold disabled:opacity-50">
              {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
            </button>
          </form>
        )}

        <button onClick={() => router.push('/login')} className="mt-6 text-sm text-center">
          <span className="text-[#22D3EE] font-medium">Retour à la connexion</span>
        </button>
      </div>
    </MobileContainer>
  );
}
