"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useParallax } from '@/hooks/useParallax';

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
  const { scrollY } = useScroll();
  const { ref: parallaxRef, y: parallaxY } = useParallax({ speed: 0.4 });
  
  // Background parallax effects
  const backgroundY = useTransform(scrollY, [0, 1000], ['0%', '20%']);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  // Generate random positions once
  const floatingElements = useMemo(() => generateRandomPositions(20), []);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % greetings.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background Layers */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-b from-blue-100 to-transparent"
        style={{ y: backgroundY }}
      />
      <motion.div 
        className="absolute inset-0 animated-gradient opacity-10"
        style={{ y: useTransform(scrollY, [0, 1000], ['0%', '30%']) }}
      />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {floatingElements.map((position, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-blue-500/10 rounded-full"
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

      {/* Main Content */}
      <motion.div 
        ref={parallaxRef}
        style={{ y: parallaxY }}
        className="relative z-10 text-center max-w-4xl mx-auto px-4"
      >
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <Image
              src="https://media.licdn.com/dms/image/v2/D5603AQFmv3ystx3rLA/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1715648361515?e=1763596800&v=beta&t=fkduAo5_JrZDP3TDuJ0bEzXxMFFS4t2CgophfUmmIuM"
              alt="Profile Picture"
              width={128}
              height={128}
              className="mx-auto rounded-full object-cover shadow-2xl shadow-sky-500/50"
            />
            <motion.div
              className="absolute -inset-4 rounded-full bg-gradient-to-r from-sky-500/20 to-blue-600/20 -z-10"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-5xl md:text-7xl font-bold text-slate-900 mb-4"
        >
          Muhammad Naufal Pratomo
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xl md:text-2xl text-blue-600 mb-8"
        >
          Web Developer
        </motion.p>

        <div className="h-[48px] text-slate-600 text-lg mb-8 max-w-2xl mx-auto overflow-hidden">
          <motion.span
            key={index}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="block text-2xl md:text-3xl font-semibold"
          >
            {greetings[index]}
          </motion.span>
        </div>

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-center space-x-4 flex-wrap gap-4"
        >
          <Link
            href="#projects"
            className="group relative px-8 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-sky-500/50 overflow-hidden"
          >
            <span className="relative z-10">Lihat Proyek</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-blue-600 to-sky-500"
              initial={{ x: "100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </Link>
          <Link
            href="#contact"
            className="group px-8 py-3 border-2 border-sky-500 text-sky-600 rounded-full font-semibold hover:bg-sky-500 hover:text-white transition-all"
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
          <svg className="mx-auto text-sky-600" width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}