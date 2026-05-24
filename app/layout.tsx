import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Providers from '@/src/components/Providers';
import Sidebar from '@/src/components/Sidebar';
import BottomNav from '@/src/components/BottomNav';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: 'MyCove — Ton refuge étudiant',
  description: 'Gère ton planning, budget et démarches admin en un seul endroit.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={plusJakarta.variable}>
      <body className="font-sans antialiased bg-[#0F172A] text-[#F8FAFC]">
        <Providers>
          <Sidebar />
          <BottomNav />
          <div className="md:pl-16">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
