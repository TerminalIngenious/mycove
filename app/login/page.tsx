'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Eye, EyeOff } from 'lucide-react';
import { LogoFull } from '@/src/components/Logo';
import { MobileContainer } from '@/src/components/MobileContainer';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Email ou mot de passe incorrect');
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <MobileContainer>
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center px-6">
        <div className="mb-12">
          <LogoFull className="h-12" />
        </div>
        <div className="w-full max-w-sm mb-8">
          <h1 className="text-[32px] font-bold text-[#F8FAFC] mb-2">Connexion</h1>
          <p className="text-base text-[#94A3B8]">Bon retour parmi nous</p>
        </div>

        {error && (
          <div className="w-full max-w-sm mb-4 p-3 bg-[#EF4444]/10 border border-[#EF4444]/20 rounded-xl">
            <p className="text-sm text-[#EF4444]">{error}</p>
          </div>
        )}

        <div className="w-full max-w-sm space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#94A3B8] mb-2">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="ton@email.com"
              className="w-full h-12 px-4 bg-[#1E293B] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none" />
          </div>
          <div className="relative">
            <label className="block text-sm font-medium text-[#94A3B8] mb-2">Mot de passe</label>
            <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full h-12 px-4 pr-12 bg-[#1E293B] border border-[#334155] rounded-xl text-sm text-[#F8FAFC] placeholder:text-[#64748B] focus:border-[#22D3EE] focus:outline-none" />
            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-9 text-[#64748B]">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button onClick={handleSubmit} disabled={loading}
            className="w-full h-12 rounded-xl bg-[#22D3EE] text-[#0F172A] font-semibold disabled:opacity-50">
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>

          <p className="text-center text-sm text-[#94A3B8]">
            Pas encore de compte ?{' '}
            <span onClick={() => router.push('/onboarding/signup')} className="text-[#22D3EE] font-semibold cursor-pointer">
              S'inscrire
            </span>
          </p>
        </div>
      </div>
    </MobileContainer>
  );
}
