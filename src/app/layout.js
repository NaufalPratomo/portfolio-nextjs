import { Fraunces, Figtree, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { SmoothScrollProvider } from '@/providers/SmoothScrollProvider';
import { Analytics } from "@vercel/analytics/react";

// Fraunces gives headings a voice; Figtree stays readable for long Indonesian paragraphs;
// Plex Mono is only for small metadata (dates, stacks), never for headings.
const display = Fraunces({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const body = Figtree({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });

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
        url: '/images/profile.jpg',
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
    <html lang="id" suppressHydrationWarning className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <head>
        {/* Runs before first paint so a dark-mode visitor never sees a light flash. */}
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
      <body className="min-h-screen w-full">
        <SmoothScrollProvider>
          <main>{children}</main>
        </SmoothScrollProvider>
        <Analytics />
      </body>
    </html>
  );
}
