"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useState, useRef } from 'react';

export default function Projects() {
  const projects = [
    {
      title: 'TALENTI',
      period: 'May 2025 - Oct 2025',
      description: 'Sistem informasi berbasis web untuk manajemen dan pencatatan prestasi mahasiswa di Jurusan Teknologi Informasi. Memfasilitasi mahasiswa dan dosen dalam mendokumentasikan, memvalidasi, dan mempublikasikan pencapaian akademik maupun non-akademik.',
      image: '/Porto_Web/talenti.png',
      tags: ['Laravel', 'MySQL'],
      link: 'https://github.com/hikmahabdillah/sim-pencatatan-prestasi-jti',
    },
    {
      title: 'Dashboard Daily Cost Production Site',
      period: 'Jul 2025 - sekarang',
      description: 'Web dashboard interaktif untuk memonitor biaya produksi harian di PT Sari Aditya Loka (anak usaha PT Astra Agro Lestari yang bergerak di bidang sawit), salah satu perusahaan perkebunan kelapa sawit terbesar di Indonesia. Meningkatkan efisiensi operasional dan mendukung pengambilan keputusan strategis berbasis data.',
      image: '/Porto_Web/costsite.png',
      tags: ['PHP', 'MySQL'],
      link: 'https://dasboardcost.com/',
    },
    {
      title: 'SIBETA',
      period: 'Dec 2024 - Jan 2025',
      description: 'Sistem Informasi Bebas Tanggungan TA untuk membantu pengelolaan data bebas tanggungan tugas akhir di Politeknik Negeri Malang.',
      image: '/Porto_Web/sibeta.png',
      tags: ['Laravel', 'MySQL'],
      link: 'https://github.com/NaufalPratomo/PBL',
    },
  ];

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [sectionRef, isInView] = useIntersectionObserver({ threshold: 0.1 });
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"]
  });

  // Interactive cursor
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  return (
    <section
      id="projects"
      className="relative min-h-screen flex items-center px-4 py-20 overflow-hidden"
      onMouseMove={handleMouseMove}
      ref={timelineRef}
    >
      {/* Background Elements */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent"
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.5], [0, 0.5]),
        }}
      />

      <div className="max-w-6xl mx-auto w-full relative z-10">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-slate-900 mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Proyek
        </motion.h2>

        <div
          ref={sectionRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              className="relative group"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-slate-200 shadow-lg transition-all duration-300 group-hover:shadow-xl">
                {/* Project Header */}
                <motion.div
                  className="flex justify-between items-start mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-xl font-bold text-slate-900">{project.title}</h3>
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 45 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Link
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-600 hover:text-blue-600 transition-colors"
                    >
                      <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </Link>
                  </motion.div>
                </motion.div>

                {/* Project Image */}
                <motion.div
                  className="relative overflow-hidden rounded-xl mb-4 border border-slate-200"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src={project.image}
                    alt={`Cuplikan ${project.title}`}
                    width={400}
                    height={176}
                    className="w-full h-44 object-cover transition-transform duration-700 ease-out"
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>

                {/* Project Period */}
                <motion.p
                  className="text-sm text-sky-700 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  {project.period}
                </motion.p>

                {/* Project Description */}
                <motion.p
                  className="text-slate-600 mb-4 text-sm leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  {project.description}
                </motion.p>

                {/* Project Tags */}
                <motion.div
                  className="flex flex-wrap gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  {project.tags.map((tag) => (
                    <motion.span
                      key={tag}
                      className="px-3 py-1 bg-sky-200/70 text-sky-800 rounded-full text-xs font-medium"
                      whileHover={{ scale: 1.1, backgroundColor: 'rgba(186, 230, 253, 0.9)' }}
                    >
                      {tag}
                    </motion.span>
                  ))}
                </motion.div>
              </div>

              {/* Interactive Hover Effect */}
              {hoveredIndex === index && (
                <motion.div
                  className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 to-sky-500/10 rounded-3xl -z-10"
                  layoutId="projectHover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.div>
          ))}
        </div>

        {/* Interactive Cursor */}
        <motion.div
          className="fixed w-8 h-8 rounded-full pointer-events-none mix-blend-difference z-50 hidden md:block"
          animate={{
            x: mousePosition.x - 16,
            y: mousePosition.y - 16,
            scale: hoveredIndex !== null ? 1.5 : 1,
          }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
          style={{
            background: 'white',
          }}
        />
      </div>
    </section>
  );
}