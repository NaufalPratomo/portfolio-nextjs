"use client";

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useParallax } from '@/hooks/useParallax';
import { useMemo } from 'react';

// Generate consistent positions for geometric patterns
const generateGeometricPatterns = (count) => {
  const patterns = [];
  for (let i = 0; i < count; i++) {
    patterns.push({
      left: `${(i * 5.7 + 2.3) % 100}%`,
      top: `${(i * 4.9 + 1.7) % 100}%`,
      rotate: (i * 18) % 360,
      scale: 0.5 + ((i * 2.3) % 50) / 100,
      duration: 20 + ((i * 3.1) % 10),
    });
  }
  return patterns;
};

export default function About() {
  const stats = [
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      ),
      title: 'Pendidikan',
      subtitle: 'D4 Teknik Informatika',
      highlight: 'IPK: 3.76 / 4.00',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      ),
      title: 'Spesialisasi',
      subtitle: 'Arsitektur & API',
      highlight: 'Full-Stack Web Development',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      ),
      title: 'Pengalaman',
      subtitle: 'Proyek Industri & Magang',
      highlight: 'Kolaborasi Tim Terbukti',
    },
  ];

  const [sectionRef, isInView] = useIntersectionObserver({ threshold: 0.25 });
  const { ref: parallaxRef, y: parallaxY } = useParallax({ speed: 0.1 });

  return (
    <section id="about" className="relative min-h-screen flex items-center px-4 py-20 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
      <motion.div
        ref={sectionRef}
        className="relative max-w-4xl mx-auto z-10 w-full"
        initial={{ opacity: 0, y: 30 }}
        animate={{
          opacity: isInView ? 1 : 0,
          y: isInView ? 0 : 30
        }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.h2
          className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-8 text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Tentang Saya
        </motion.h2>

        <motion.div
          ref={parallaxRef}
          style={{ y: parallaxY }}
          className="relative bg-white/80 dark:bg-slate-900/70 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-slate-200/80 dark:border-slate-800 shadow-sm"
        >
          <motion.p
            className="text-slate-700 dark:text-slate-200 text-base md:text-lg leading-relaxed mb-5"
            initial={{ opacity: 0, x: -16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Mahasiswa D4 Teknik Informatika di Politeknik Negeri Malang dengan spesialisasi pengembangan web full-stack. Memiliki pengalaman praktis membangun aplikasi berskala produksi yang andal menggunakan ekosistem Next.js, React, Node.js, dan Laravel.
          </motion.p>

          <motion.p
            className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed mb-8"
            initial={{ opacity: 0, x: -16 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            Terbiasa menangani integrasi database, optimasi query, protokol komunikasi realtime (MQTT / REST API), serta arsitektur antarmuka yang responsif dan berpusat pada kenyamanan pengguna.
          </motion.p>

          <motion.div
            className="grid sm:grid-cols-3 gap-5"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="relative text-center p-5 bg-slate-50/80 dark:bg-slate-800/80 rounded-xl border border-slate-200/70 dark:border-slate-700/60 hover:border-blue-500/40 dark:hover:border-sky-500/40 transition-colors shadow-sm dark:shadow-none"
                initial={{ opacity: 0, y: 15 }}
                animate={isInView ? {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.4,
                    delay: 0.4 + index * 0.1,
                  }
                } : {}}
              >
                <svg className="mx-auto mb-3 text-blue-600 dark:text-sky-400" width="36" height="36" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {stat.icon}
                </svg>
                <h3 className="text-slate-900 dark:text-white font-semibold text-lg mb-1">{stat.title}</h3>
                {stat.subtitle && <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm mb-1">{stat.subtitle}</p>}
                <p className="text-blue-600 dark:text-sky-400 font-medium text-xs md:text-sm">{stat.highlight}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
