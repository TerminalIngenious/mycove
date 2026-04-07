// app/onboarding/signup/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import { LogoFull } from '@/src/components/Logo';
import { MobileContainer } from '@/src/components/MobileContainer';

export default function SignupScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async () => {
    // Validation
    if (!email || !password || !confirmPassword) {
      setError('Tous les champs sont requis');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Créer le compte avec Supabase
      const { data, error: signupError } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      if (signupError) {
        console.error('Signup error:', signupError);
        setError(signupError.message);
        setLoading(false);
        return;
      }

      console.log('Compte créé:', data);

      // Si succès, rediriger vers infos perso
      router.push('/onboarding/infos-perso');
      
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('Une erreur est survenue');
      setLoading(false);
    }
  };

  return (
    <MobileContainer>
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center px-6">
        
        {/* Logo */}
        <div className="mb-12">
          <LogoFull className="h-12" />
        </div>

        {/* Titre */}
        <div className="w-full max-w-sm mb-8">
          <h1 className="text-[32px] font-bold text-[#F8FAFC] mb-2">
            Créer un compte
          </h1>
          <p className="text-base text-[#94A3B8]">
            Bienvenue sur MyCove
          </p>
        </div>

        {/* Formulaire */}
        <div className="w-full max-w-sm space-y-4">
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-2">
              Email
            </label>
            <input
              type="email"
              placeholder="ton.email@exemple.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-12 px-4 bg-[#1E293B] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-2">
              Mot de passe
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 px-4 pr-12 bg-[#1E293B] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none transition-colors"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#F8FAFC]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-2">
              Confirmer le mot de passe
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 px-4 pr-12 bg-[#1E293B] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none transition-colors"
              />
              <button
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#F8FAFC]"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div className="p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl">
              <p className="text-sm text-[#EF4444]">{error}</p>
            </div>
          )}

          {/* Bouton */}
          <button
            onClick={handleSignup}
            disabled={loading}
            className="w-full h-12 rounded-xl bg-[#22D3EE] text-[#0F172A] text-base font-semibold hover:bg-[#1DB8D1] transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 mt-6"
          >
            {loading ? 'Création en cours...' : 'Continuer'}
          </button>

          {/* Lien Login */}
          <div className="text-center pt-4">
            <p className="text-sm text-[#94A3B8]">
              Déjà un compte ?{' '}
              <button
                onClick={() => router.push('/login')}
                className="text-[#22D3EE] font-semibold hover:underline"
              >
                Se connecter
              </button>
            </p>
          </div>
        </div>
      </div>
    </MobileContainer>
  );
}