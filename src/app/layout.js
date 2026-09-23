import { Inter } from 'next/font/google';
import './globals.css';
import { SmoothScrollProvider } from '@/providers/SmoothScrollProvider';
import { Analytics } from "@vercel/analytics/react";
const inter = Inter({ subsets: ['latin'] });

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Muhammad Naufal Pratomo - Portfolio',
  description: 'Portfolio website of Muhammad Naufal Pratomo, Web Developer',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    title: 'Muhammad Naufal Pratomo - Portfolio',
    description: 'Portfolio website of Muhammad Naufal Pratomo, Web Developer',
    siteName: 'Muhammad Naufal Pratomo',
    images: [
      {
        url: '/images/profile.jpg', // Menggunakan foto profil sebagai gambar preview
        width: 800,
        height: 600,
        alt: 'Muhammad Naufal Pratomo - Portfolio',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Muhammad Naufal Pratomo - Portfolio',
    description: 'Portfolio website of Muhammad Naufal Pratomo, Web Developer',
    images: ['/images/profile.jpg'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var saved = localStorage.getItem('theme');
                  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (saved === 'dark' || (!saved && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-gradient-to-br from-white to-sky-200 dark:from-slate-950 dark:to-slate-900 text-slate-800 dark:text-slate-100 min-h-screen w-full relative`}>
        <SmoothScrollProvider snap={false}>
          <main className="relative">
            {children}
          </main>
        </SmoothScrollProvider>
        <Analytics />
      </body>
    </html>
  );
}