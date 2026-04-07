// app/mot-de-passe-oublie/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { MobileContainer } from '../../src/components/MobileContainer';

export default function MotDePasseOublieScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert('Entre ton adresse email');
      return;
    }

    setIsLoading(true);

    // TODO: Appel API Supabase pour reset password
    console.log('Reset password:', email);

    // Simuler l'envoi
    setTimeout(() => {
      setIsLoading(false);
      alert('Email envoyé ! Vérifie ta boîte mail 📧');
      router.push('/login');
    }, 1500);
  };

  const handleBack = () => {
    router.back();
  };

  const handleReturnLogin = () => {
    router.push('/login');
  };

  return (
    <MobileContainer>
      <div className="flex min-h-screen flex-col px-6 py-16">
        {/* Bouton Retour */}
        <button
          onClick={handleBack}
          className="mb-8 flex items-center gap-2 text-[#94A3B8] hover:text-[#F8FAFC] transition-colors self-start"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Retour</span>
        </button>

        {/* Titre */}
        <h1 className="mb-4 text-[32px] font-bold text-[#F8FAFC]">
          Mot de passe oublié ?
        </h1>

        {/* Description */}
        <p className="mb-10 text-base text-[#94A3B8] leading-relaxed">
          Entre ton email et on t'envoie un lien de réinitialisation.
        </p>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Input Email */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-[#94A3B8]">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ton@email.fr"
              disabled={isLoading}
              className="h-14 w-full rounded-xl bg-[#1E293B] border border-[#334155] px-4 text-base text-[#F8FAFC] placeholder:text-[#64748B] focus:outline-none focus:border-[#22D3EE] transition-colors disabled:opacity-50"
            />
          </div>

          {/* Bouton Envoyer */}
          <button
            type="submit"
            disabled={isLoading}
            className="h-14 w-full rounded-xl bg-[#22D3EE] text-[#0F172A] text-base font-semibold transition-transform active:scale-95 hover:bg-[#1DB8D1] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Envoi en cours...' : 'Envoyer le lien'}
          </button>
        </form>

        {/* Lien Retour connexion */}
        <button
          onClick={handleReturnLogin}
          className="mt-6 text-sm text-[#94A3B8]"
        >
          <span className="text-[#22D3EE] font-medium hover:text-[#1DB8D1] transition-colors">
            Retour à la connexion
          </span>
        </button>
      </div>
    </MobileContainer>
  );
}