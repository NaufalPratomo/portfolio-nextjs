"use client";

import { motion, useScroll, useTransform } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useEffect, useState } from 'react';

export default function Skills() {
  const hardSkills = [
    { name: 'Laravel', level: 90, color: '#FF2D20' },
    { name: 'PHP', level: 85, color: '#777BB4' },
    { name: 'JavaScript', level: 85, color: '#F7DF1E' },
    { name: 'React JS', level: 85, color: '#61DAFB' },
    { name: 'SQL', level: 80, color: '#4479A1' },
    { name: 'HTML & CSS', level: 90, color: '#E34F26' },
    { name: 'Java', level: 75, color: '#007396' },
    { name: 'Figma', level: 70, color: '#F24E1E' },
    { name: 'Microsoft Office', level: 85, color: '#D83B01' },
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
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    // Set initial dimensions
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Parallax effect for floating elements
  const floatingY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
  
  return (
    <section id="skills" className="relative min-h-screen flex items-center px-4 py-20 overflow-hidden">
      {/* Floating Tech Icons Background */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl opacity-5"
            initial={{
              x: Math.random() * (dimensions.width || 1000),
              y: Math.random() * (dimensions.height || 800),
            }}
            animate={{
              y: ['0%', '100%'],
              rotate: [0, 360],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              x: Math.random() * 100 + '%',
            }}
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
                    className="w-full bg-slate-200/50 rounded-full h-3 overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${skill.color}aa, ${skill.color})`,
                        width: '0%'
                      }}
                      animate={isInView ? { width: `${skill.level}%` } : {}}
                      transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    >
                      <motion.div
                        className="h-full w-full bg-gradient-to-r from-white/20 to-transparent"
                        animate={{
                          x: ['-100%', '100%'],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                    </motion.div>
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