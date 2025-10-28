import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Muhammad Naufal Pratomo - Portfolio',
  description: 'Portfolio website of Muhammad Naufal Pratomo, Web Developer',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="scroll-smooth">
      <body className={`${inter.className} bg-gradient-to-br from-white to-sky-200 text-slate-800`}>
        {children}
      </body>
    </html>
  );
}