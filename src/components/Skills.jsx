"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useEffect, useState, useMemo } from 'react';

// Generate consistent positions for floating elements
const generateFloatingElements = (count) => {
  const elements = [];
  for (let i = 0; i < count; i++) {
    elements.push({
      x: `${(i * 6.1 + 3.2) % 100}%`,
      y: `${(i * 5.3 + 2.1) % 100}%`,
      duration: 20 + ((i * 2.7) % 10),
      rotate: (i * 24) % 360
    });
  }
  return elements;
};

export default function Skills() {
  const hardSkills = [
    { name: 'Laravel', level: 65 },
    { name: 'Next.js', level: 70 },
    { name: 'Basis Data (MySQL, MongoDB)', level: 65 },
    { name: 'Editing (Canva, Capcut)', level: 70 },
    { name: 'Microsoft Office (Word, Excel, PPT)', level: 70 },
    { name: 'PHP', level: 65 },
    { name: 'CSS', level: 70 },
    { name: 'HTML', level: 70 },
    { name: 'JavaScript', level: 70 },
  ];

  const softSkills = [
    'Leadership',
    'Teamwork',
    'Critical Thinking',
    'Analytical Thinking',
    'Communication',
    'Problem Solving',
    'Time Management',
  ];

  const [sectionRef, isInView] = useIntersectionObserver({ threshold: 0.3 });
  const { scrollYProgress } = useScroll();

  // Generate floating elements once
  const floatingElements = useMemo(() => generateFloatingElements(6), []);

  // Parallax effect for floating elements
  const floatingY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <section id="skills" className="relative min-h-screen flex items-center px-4 py-20 overflow-hidden">
      {/* Floating Tech Icons Background */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingElements.map((element, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl opacity-5"
            initial={{ x: element.x, y: element.y }}
            animate={{
              y: ['0%', '100%'],
              rotate: [0, 360],
            }}
            transition={{
              duration: element.duration,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{ x: element.x }}
          >
            {`</>`}
          </motion.div>
        ))}
      </div>

      <motion.div
        ref={sectionRef}
        className="relative max-w-6xl mx-auto w-full z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-slate-900 mb-12 text-center"
          initial={{ y: 20, opacity: 0 }}
          animate={isInView ? { y: 0, opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
        >
          Keahlian
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Hard Skills */}
          <motion.div
            className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300"
            initial={{ x: -50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-blue-600 mb-6">Hard Skills</h3>
            <div className="space-y-6">
              {hardSkills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ x: -20, opacity: 0 }}
                  animate={isInView ? { x: 0, opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-700 font-medium">{skill.name}</span>
                    <span className="text-blue-600 font-medium">{skill.level}%</span>
                  </div>
                  <motion.div
                    className="w-full bg-slate-200/55 rounded-full h-2.5 overflow-hidden"
                    whileHover={{ scale: 1.01 }}
                  >
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-sky-600"
                      style={{
                        width: '0%'
                      }}
                      animate={isInView ? { width: `${skill.level}%` } : {}}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Soft Skills */}
          <motion.div
            className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 border border-slate-200 shadow-lg hover:shadow-xl transition-shadow duration-300"
            initial={{ x: 50, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="text-2xl font-bold text-blue-600 mb-6">Soft Skills</h3>
            <div className="grid grid-cols-2 gap-4">
              {softSkills.map((skill, index) => (
                <motion.div
                  key={skill}
                  className={`group relative bg-sky-100/50 rounded-lg p-4 border border-sky-200 text-center overflow-hidden
                    ${skill === 'Time Management' ? 'col-span-2' : ''}`}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={isInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-sky-400/10 to-blue-500/10"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10 text-slate-700 font-medium">{skill}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}