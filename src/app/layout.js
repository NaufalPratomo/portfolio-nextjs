import { Inter } from 'next/font/google';
import './globals.css';
import { SmoothScrollProvider } from '@/providers/SmoothScrollProvider';
import { Analytics } from "@vercel/analytics/react";
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
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
    <html lang="id">
      <body className={`${inter.className} bg-gradient-to-br from-white to-sky-200 text-slate-800 min-h-screen w-full relative`}>
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