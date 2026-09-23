"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, useMotionValue, AnimatePresence } from 'framer-motion';
import { useParallax } from '@/hooks/useParallax';
import { useScrollSnap } from '@/providers/SmoothScrollProvider';

// Generate consistent random positions
const generateRandomPositions = (count) => {
  const positions = [];
  for (let i = 0; i < count; i++) {
    positions.push({
      x: `${(i * 5.3 + 1.8) % 100}%`,
      y: `${(i * 4.7 + 2.3) % 100}%`,
      scale: 0.5 + ((i * 2.1) % 50) / 100,
      duration: 20 + ((i * 3.7) % 10)
    });
  }
  return positions;
};

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
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const { ref: parallaxRef, y: parallaxY } = useParallax({ speed: 0.25 });
  const { scrollToId } = useScrollSnap();

  const backgroundY = useTransform(scrollY, [0, 800], ['0%', '15%']);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % greetings.length);
    }, 2800);
    return () => clearInterval(interval);
  }, [greetings.length]);

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    scrollToId(id);
  };

  return (
    <section id="home" className="relative min-h-[100svh] flex items-start lg:items-center justify-center overflow-x-hidden pt-24 md:pt-28 lg:pt-24 pb-12 dark:bg-slate-950 transition-colors duration-300">
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-blue-50/70 via-transparent to-transparent dark:from-slate-900/30 dark:via-transparent dark:to-transparent pointer-events-none"
        style={{ y: shouldReduceMotion ? 0 : backgroundY }}
      />

      {/* Subtle calm ambient lighting without perpetual animations (R-19) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 hidden md:block">
        <div className="absolute top-1/4 left-1/4 w-[360px] h-[360px] bg-sky-400/10 dark:bg-sky-500/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[120px]" />
      </div>

      <motion.div
        ref={parallaxRef}
        style={{ y: parallaxY }}
        className="relative z-10 text-center max-w-4xl mx-auto px-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <div className="relative inline-block">
            <Image
              src="/images/profile.jpg"
              alt="Muhammad Naufal Pratomo"
              width={128}
              height={128}
              priority
              sizes="(max-width: 768px) 96px, 128px"
              className="mx-auto rounded-2xl object-cover shadow-lg w-24 h-24 md:w-32 md:h-32 border border-slate-200/80 dark:border-slate-800"
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-3"
        >
          Muhammad Naufal Pratomo
        </motion.h1>

        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="text-lg md:text-xl font-medium text-slate-600 dark:text-slate-300 max-w-2xl mx-auto mb-6"
        >
          Software Engineering Student & Full-Stack Developer fokus pada sistem web skalabel, terstruktur, dan berorientasi performa.
        </motion.p>

        {/* Multilingual greeting */}
        <div className="hero-greeting min-h-[2.75rem] md:min-h-[3.25rem] mb-8 max-w-2xl mx-auto overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="block text-2xl md:text-3xl font-bold text-blue-600 dark:text-sky-400"
            >
              {greetings[index]}
            </motion.span>
          </AnimatePresence>
        </div>

        {/* Structured Call to Action buttons with intentional radius and 44px min tap targets */}
        <motion.div
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex justify-center items-center gap-4 flex-wrap"
        >
          <Link
            href="#projects"
            onClick={(e) => handleScrollTo(e, 'projects')}
            className="inline-flex items-center justify-center min-h-[44px] px-7 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white rounded-xl font-semibold transition-all shadow-sm hover:shadow focus-visible:rounded-xl"
          >
            Lihat Portfolio
          </Link>
          <Link
            href="#contact"
            onClick={(e) => handleScrollTo(e, 'contact')}
            className="inline-flex items-center justify-center min-h-[44px] px-7 py-2.5 border border-slate-300 dark:border-slate-700 hover:border-blue-600 dark:hover:border-blue-400 text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 rounded-xl font-semibold transition-all bg-white/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 focus-visible:rounded-xl"
          >
            Hubungi Saya
          </Link>
        </motion.div>

        <div className="mt-12 text-slate-400 dark:text-slate-600">
          <svg className="mx-auto" width="28" height="28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </motion.div>
    </section>
  );
}