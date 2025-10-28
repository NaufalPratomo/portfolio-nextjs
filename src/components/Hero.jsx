"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Hero() {
  const greetings = [
    'Hello',
    'Halo',
    'こんにちは',
    '你好',
    '안녕하세요',
    'Bonjour',
    'Hola',
    'مرحبا',
    'Olá',
    'Ciao',
    'नमस्ते',
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % greetings.length);
    }, 2500); // change every ~2.5 seconds
    return () => clearInterval(interval);
  }, []);
  return (
    <section id="home" className="min-h-screen flex items-center justify-center px-4 pt-20">
      <div className="text-center max-w-4xl mx-auto">
        <div className="mb-8 animate-fade-in reveal-img" style={{ '--delay': '0s' }}>
          <Image
            src="https://media.licdn.com/dms/image/v2/D5603AQFmv3ystx3rLA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1715648361515?e=1763596800&v=beta&t=fkduAo5_JrZDP3TDuJ0bEzXxMFFS4t2CgophfUmmIuM"
            alt="Profile Picture"
            width={128}
            height={128}
            className="mx-auto mb-6 rounded-full object-cover shadow-2xl shadow-sky-500/50 reveal-img"
            style={{ '--delay': '0s' }}
          />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 mb-4 reveal" style={{ '--delay': '0.08s' }}>
          Muhammad Naufal Pratomo
        </h1>
        <p className="text-xl md:text-2xl text-blue-600 mb-8 reveal" style={{ '--delay': '0.12s' }}>
          Web Developer
        </p>
        <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto" aria-live="polite">
          <span key={index} className="animate-fade-in text-2xl md:text-3xl font-semibold reveal rainbow-text" style={{ '--delay': '0.18s' }}>
            {greetings[index]}
          </span>
        </p>
        <div className="flex justify-center space-x-4 flex-wrap gap-4">
          <Link
            href="#projects"
            className="px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-sky-500/50 transition-all reveal"
            style={{ '--delay': '0.22s' }}
          >
            Lihat Proyek
          </Link>
          <Link
            href="#contact"
            className="px-8 py-3 border-2 border-sky-500 text-sky-600 rounded-full font-semibold hover:bg-sky-500 hover:text-white transition-all reveal"
            style={{ '--delay': '0.26s' }}
          >
            Hubungi Saya
          </Link>
        </div>
        <div className="mt-12 animate-bounce">
          <svg className="mx-auto text-sky-600" width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </section>
  );
}