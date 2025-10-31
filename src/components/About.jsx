"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useParallax } from '@/hooks/useParallax';

export default function About() {
  const stats = [
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      ),
      title: 'Pendidikan',
      subtitle: 'D4 Teknik Informatika',
      highlight: 'IPK: 3.76/4.00',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      ),
      title: 'Spesialisasi',
      highlight: 'Web Development',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      ),
      title: 'Pengalaman',
      subtitle: '3+ Proyek',
      highlight: 'Kolaborasi Tim',
    },
  ];

  const [sectionRef, isInView] = useIntersectionObserver({ threshold: 0.3 });
  const { scrollY } = useScroll();
  const { ref: parallaxRef, y: parallaxY } = useParallax({ speed: 0.1 });

  // Geometric pattern animation
  const patternTranslateY = useTransform(scrollY, [0, 1000], ['0%', '20%']);
  const patternOpacity = useTransform(scrollY, [0, 300], [0.1, 0.05]);

  return (
    <section id="about" className="relative min-h-screen flex items-center px-4 py-20 overflow-hidden">
      {/* Geometric Patterns Background */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ y: patternTranslateY, opacity: patternOpacity }}
      >
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-20 h-20 bg-sky-500/5"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              rotate: Math.random() * 360,
              scale: Math.random() * 0.5 + 0.5,
            }}
            initial={false}
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: Math.random() * 20 + 20,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </motion.div>

      <motion.div
        ref={sectionRef}
        className="relative max-w-4xl mx-auto z-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ 
          opacity: isInView ? 1 : 0,
          y: isInView ? 0 : 50
        }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.h2 
          className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Tentang Saya
        </motion.h2>

        <motion.div 
          ref={parallaxRef}
          style={{ y: parallaxY }}
          className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 border border-slate-200 shadow-lg"
        >
          <motion.p 
            className="text-slate-700 text-lg leading-relaxed mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Saya adalah mahasiswa semester 5 Program Studi D4 Teknik Informatika di Politeknik Negeri Malang. 
            Memiliki ketertarikan kuat pada Web Development dan kemampuan dalam mengembangkan aplikasi full stack.
          </motion.p>

          <motion.p 
            className="text-slate-700 text-lg leading-relaxed mb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Mahir berbahasa Inggris dengan pengalaman dalam proyek kolaborasi. Kemampuan komunikasi, 
            pemecahan masalah, dan kolaborasi tim yang baik menjadi kekuatan dalam beradaptasi dengan 
            lingkungan kerja yang dinamis.
          </motion.p>

          <motion.div 
            className="grid md:grid-cols-3 gap-6 mt-8"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="relative text-center p-6 bg-sky-100/50 rounded-xl border border-sky-200 hover:shadow-lg transition-shadow duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { 
                  opacity: 1,
                  scale: 1,
                  transition: {
                    duration: 0.4,
                    delay: 0.6 + index * 0.1,
                  }
                } : {}}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-sky-400/10 to-blue-500/10 rounded-xl opacity-0"
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
                
                <svg className="mx-auto mb-3 text-sky-600" width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {stat.icon}
                </svg>
                <h3 className="text-slate-800 font-semibold text-xl mb-2">{stat.title}</h3>
                {stat.subtitle && <p className="text-slate-600">{stat.subtitle}</p>}
                <p className="text-blue-600 font-medium">{stat.highlight}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
