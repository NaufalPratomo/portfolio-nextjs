import { Inter } from 'next/font/google';
import './globals.css';
import { SmoothScrollProvider } from '@/providers/SmoothScrollProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Muhammad Naufal Pratomo - Portfolio',
  description: 'Portfolio website of Muhammad Naufal Pratomo, Web Developer',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className={`${inter.className} bg-gradient-to-br from-white to-sky-200 text-slate-800 min-h-screen w-full overflow-x-hidden relative`}>
        <SmoothScrollProvider>
          <main className="relative">
            {children}
          </main>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}