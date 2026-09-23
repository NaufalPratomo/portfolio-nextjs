"use client";

import { motion } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useEffect, useState } from 'react';

const skillCategories = [
  {
    title: 'Backend & Sistem',
    description: 'Arsitektur server, API, dan integrasi protokol',
    skills: ['Laravel', 'PHP', 'Node.js', 'Next.js API', 'RESTful API', 'MQTT Protocol', 'Microservices Basics'],
  },
  {
    title: 'Frontend & UI Engineering',
    description: 'Antarmuka responsif, performa, dan state management',
    skills: ['React', 'Next.js', 'JavaScript (ES6+)', 'Tailwind CSS', 'Framer Motion', 'HTML5 & CSS3', 'Responsive Layout'],
  },
  {
    title: 'Basis Data & Alat Pengembangan',
    description: 'Manajemen data, version control, dan tools',
    skills: ['MySQL', 'MongoDB', 'Git / GitHub', 'Postman', 'Cloudinary', 'VS Code', 'Linux CLI'],
  },
  {
    title: 'Kompetensi Profesional',
    description: 'Manajemen kerja tim dan penyelesaian masalah',
    skills: ['Project Management', 'Problem Solving', 'Team Collaboration', 'Analytical Thinking', 'Time Management', 'Critical Thinking'],
  },
];

export default function Skills() {
  const [categories, setCategories] = useState(skillCategories);
  const [sectionRef, isInView] = useIntersectionObserver({ threshold: 0.2 });

  useEffect(() => {
    fetch('/api/skills')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data) {
          // If backend provides custom categorized skills or lists, parse gracefully
          if (Array.isArray(data.data.categories) && data.data.categories.length > 0) {
            setCategories(data.data.categories);
          }
        }
      })
      .catch((err) => console.error('Failed to fetch skills', err));
  }, []);

  return (
    <section id="skills" className="relative min-h-screen flex items-center px-4 py-20 overflow-hidden bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
      <motion.div
        ref={sectionRef}
        className="relative max-w-6xl mx-auto w-full z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: isInView ? 1 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-3"
            initial={{ y: 16, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.5 }}
          >
            Keahlian & Kompetensi
          </motion.h2>
          <motion.p
            className="text-slate-600 dark:text-slate-400 max-w-xl mx-auto text-base"
            initial={{ y: 16, opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Teknologi dan perangkat yang saya gunakan secara aktif untuk merancang, membangun, dan memelihara aplikasi.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {categories.map((category, idx) => (
            <motion.div
              key={category.title}
              className="bg-white/90 dark:bg-slate-900/80 rounded-2xl p-6 md:p-7 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:border-blue-500/40 dark:hover:border-blue-500/40 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.45, delay: 0.15 + idx * 0.1 }}
            >
              <div className="mb-4">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">{category.title}</h3>
                <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">{category.description}</p>
              </div>

              <div className="flex flex-wrap gap-2.5 pt-2">
                {category.skills.map((skill) => {
                  const skillName = typeof skill === 'string' ? skill : skill.name;
                  return (
                    <span
                      key={skillName}
                      className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/60 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/30 dark:hover:text-blue-300 hover:border-blue-300 dark:hover:border-blue-700 transition-colors"
                    >
                      {skillName}
                    </span>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}