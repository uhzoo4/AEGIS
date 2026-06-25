import './globals.css';
import SmoothScroll from '@/components/Global/SmoothScroll';
import CinematicCursor from '@/components/Global/CinematicCursor';
import { Cormorant_Garamond, Space_Mono, Noto_Sans_JP } from 'next/font/google';

const cormorant = Cormorant_Garamond({ 
  subsets: ['latin'], 
  weight: ['300', '400', '600'],
  variable: '--font-cormorant'
});

const spaceMono = Space_Mono({ 
  subsets: ['latin'], 
  weight: ['400', '700'],
  variable: '--font-space'
});

const notoSansJP = Noto_Sans_JP({ 
  subsets: ['latin'], 
  weight: ['300', '400'],
  variable: '--font-jp'
});

export const metadata = {
  title: 'Creative Developer | Portfolio',
  description: 'I don’t build websites. I build worlds.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${spaceMono.variable} ${notoSansJP.variable}`}>
      <body>
        <div className="film-noise"></div>
        <CinematicCursor />
        <SmoothScroll>
          <main className="min-h-screen relative">
            {children}
          </main>
        </SmoothScroll>
      </body>
    </html>
  );
}