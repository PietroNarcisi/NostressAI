import './globals.css';
import type { ReactNode } from 'react';
import { Work_Sans, Playfair_Display } from 'next/font/google';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap'
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700']
});

export const metadata = {
  title: {
    default: 'NoStress AI',
    template: '%s | NoStress AI'
  },
  description: 'Training, tools, and research-backed routines to reduce mental load and use AI intentionally.',
  metadataBase: new URL('https://www.nostress.ai'),
  alternates: { canonical: '/' },
  openGraph: {
    title: 'NoStress AI',
    description: 'Training, tools, and research-backed routines to reduce mental load and use AI intentionally.',
    type: 'website',
    locale: 'en_US'
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  // Inline script executed before React hydration to persist the chosen theme without flicker
  const themeScript = `(()=>{try{const ls=localStorage.getItem('theme');const mql=window.matchMedia('(prefers-color-scheme: dark)');const wantDark = ls? ls==='dark' : mql.matches; if(wantDark) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); document.documentElement.dataset.theme = wantDark ? 'dark' : 'light';}catch(e){}})();`;
  return (
    <html lang="en" suppressHydrationWarning className={`${workSans.variable} ${playfair.variable} h-full`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/favicon.svg" />
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col font-sans antialiased bg-neutral-25 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-100 transition-colors duration-300">
        <Navbar />
        <main className="flex-1 py-8">
          <div className="site-container px-4">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  );
}
