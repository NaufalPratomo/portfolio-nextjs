"use client";

import { useEffect, useRef, useState } from 'react';
import Reveal from './Reveal';

const EMAIL = 'naufalpratomo8@gmail.com';

const LINKS = [
  { label: 'GitHub', handle: 'NaufalPratomo', href: 'https://github.com/NaufalPratomo' },
  { label: 'LinkedIn', handle: 'naufalpratomo', href: 'https://www.linkedin.com/in/naufalpratomo/' },
];

function CopyEmail() {
  const [state, setState] = useState('idle');
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setState('copied');
    } catch (e) {
      setState('failed');
    }
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), 2500);
  };

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-[44px] items-center rounded-md border border-slate-500 px-4 text-sm font-medium text-slate-50 hover:border-accent-400 hover:text-accent-400"
      >
        Salin email
      </button>
      <span role="status" className="text-sm text-slate-300">
        {state === 'copied' && 'Tersalin.'}
        {state === 'failed' && 'Tidak bisa menyalin. Pilih teksnya secara manual.'}
      </span>
    </>
  );
}

export default function Contact() {
  return (
    <section
      id="contact"
      className="border-t border-slate-800 bg-slate-900 px-5 py-20 text-slate-50 sm:px-8 md:py-28 dark:bg-slate-900"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="font-display text-3xl leading-[1.1] tracking-tight sm:text-4xl md:text-5xl">
            Mari terhubung dan berdiskusi
          </h2>
          <p className="mt-4 max-w-xl text-lg text-slate-300">
            Untuk kerja sama, rekrutmen, atau diskusi teknis, kirim email.
          </p>

          <a
            href={`mailto:${EMAIL}`}
            className="mt-10 inline-block break-all font-display text-2xl text-accent-400 underline underline-offset-8 decoration-slate-600 hover:decoration-accent-400 sm:text-4xl"
          >
            {EMAIL}
          </a>

          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
            <CopyEmail />
          </div>

          <ul className="mt-12 flex flex-wrap gap-x-10 gap-y-2 border-t border-slate-700 pt-6">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center gap-3 text-slate-50 hover:text-accent-400"
                >
                  <span className="font-medium">{link.label}</span>
                  <span className="font-mono text-sm text-slate-300">{link.handle}</span>
                  <span className="sr-only"> (tab baru)</span>
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
