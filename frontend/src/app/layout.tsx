import type { Metadata } from 'next';
import { Chakra_Petch, Noto_Sans_Thai } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import { tryGet } from '@/lib/api';
import { Identity } from '@/lib/types';

const chakra = Chakra_Petch({
  subsets: ['latin', 'thai'],
  weight: ['500', '600', '700'],
  variable: '--font-chakra',
});

const notoThai = Noto_Sans_Thai({
  subsets: ['latin', 'thai'],
  weight: ['400', '500', '600'],
  variable: '--font-noto-thai',
});

export const metadata: Metadata = {
  title: 'SkillForge — CSMJU2030',
  description: 'AI Career Skill Analyzer & Portfolio Builder',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const identity = await tryGet<Identity>('/identity');

  return (
    <html lang="th" className={`${chakra.variable} ${notoThai.variable}`}>
      <body className="min-h-screen bg-tertiary">
        <div className="flex min-h-screen">
          <Sidebar role={identity?.layer1_role} />
          <main className="flex-1 px-6 py-8 md:px-10 md:py-10 max-w-5xl">{children}</main>
        </div>
      </body>
    </html>
  );
}
