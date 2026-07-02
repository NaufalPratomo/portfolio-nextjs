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
  const { ref: parallaxRef, y: parallaxY } = useParallax({ speed: 0.4 });
  const { scrollToId } = useScrollSnap();

  // Background parallax effects
  const backgroundY = useTransform(scrollY, [0, 1000], ['0%', '20%']);

  // Generate random positions once
  const floatingElements = useMemo(() => generateRandomPositions(8), []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % greetings.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    scrollToId(id);
  };

  return (
    <section id="home" className="relative min-h-[100svh] flex items-start lg:items-center justify-center overflow-x-hidden pt-24 md:pt-28 lg:pt-24 pb-12 dark:bg-slate-950 transition-colors duration-300">
      {/* Parallax Background Layers */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent dark:from-slate-900/40 dark:to-transparent"
        style={{ y: shouldReduceMotion ? 0 : backgroundY }}
      />
      {!shouldReduceMotion && (
        <motion.div
          className="absolute inset-0 animated-gradient opacity-[0.06] dark:opacity-[0.03]"
          style={{ y: useTransform(scrollY, [0, 1000], ['0%', '30%']) }}
        />
      )}

      {/* Background Animated Mesh Blobs */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div
            className="absolute top-1/4 left-1/4 w-[280px] h-[280px] bg-sky-400/20 dark:bg-sky-500/10 rounded-full filter blur-[70px] md:blur-[100px]"
            animate={{
              x: [0, 60, -30, 0],
              y: [0, -50, 40, 0],
              scale: [1, 1.15, 0.9, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-[320px] h-[320px] bg-blue-500/20 dark:bg-blue-600/10 rounded-full filter blur-[75px] md:blur-[110px]"
            animate={{
              x: [0, -80, 50, 0],
              y: [0, 60, -40, 0],
              scale: [1, 0.95, 1.1, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      )}

      {/* Floating Circles */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
          {floatingElements.map((position, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 md:w-4 md:h-4 bg-blue-500/10 rounded-full"
              style={{
                x: position.x,
                y: position.y,
                scale: position.scale,
              }}
              animate={{
                y: ['0%', '100%'],
                transition: {
                  duration: position.duration,
                  repeat: Infinity,
                  ease: 'linear',
                },
              }}
            />
          ))}
        </div>
      )}

      {/* Main Content */}
      <motion.div
        ref={parallaxRef}
        style={{ y: parallaxY }}
        className="relative z-10 text-center max-w-4xl mx-auto px-4"
      >
        {/* Profile Picture */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <Image
              src="/images/profile.jpg"
              alt="Profile Picture"
              width={128}
              height={128}
              priority
              sizes="(max-width: 768px) 96px, 128px"
              className="mx-auto rounded-full object-cover shadow-xl w-24 h-24 md:w-32 md:h-32 border border-slate-200/50 dark:border-slate-800/50"
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight font-bold text-slate-900 dark:text-white mb-4"
        >
          Muhammad Naufal Pratomo
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl md:text-2xl font-medium text-sky-600 dark:text-sky-400 mb-8"
        >
          Software Engineering Student
        </motion.p>

        {/* Dynamic Multilingual Greeting */}
        <div className="hero-greeting min-h-[3rem] md:min-h-[3.5rem] mb-8 max-w-2xl mx-auto overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.span
              key={index}
              initial={{ y: 15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -15, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="block text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-500 dark:from-blue-400 dark:to-sky-400"
            >
              {greetings[index]}
            </motion.span>
          </AnimatePresence>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-center space-x-4 flex-wrap gap-4"
        >
          <Link
            href="#projects"
            onClick={(e) => handleScrollTo(e, 'projects')}
            className="group relative px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full font-semibold transition-all hover:shadow-md overflow-hidden"
          >
            <span className="relative z-10">Lihat Portfolio</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-sky-500"
              initial={{ x: "100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </Link>
          <Link
            href="#contact"
            onClick={(e) => handleScrollTo(e, 'contact')}
            className="group px-8 py-3 border-2 border-sky-500 dark:border-sky-400 text-sky-600 dark:text-sky-400 rounded-full font-semibold hover:bg-sky-500 dark:hover:bg-sky-400 hover:text-white dark:hover:text-slate-950 transition-all"
          >
            Hubungi Saya
          </Link>
        </motion.div>

        <motion.div
          className="mt-12"
          animate={{
            y: [0, 10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <svg className="mx-auto text-sky-600 dark:text-sky-400" width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}