"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useState, useRef, useEffect } from 'react';
const ProjectCard = ({ project, index, hoveredIndex, setHoveredIndex }) => (
  <motion.div
    key={project.title}
    className="relative group"
    initial={{ opacity: 1, x: 0 }}
    animate={{ opacity: 1, x: 0 }}
    onHoverStart={() => setHoveredIndex(index)}
    onHoverEnd={() => setHoveredIndex(null)}
    whileHover={{ scale: 1.02 }}
  >
    <div className="bg-white/60 md:backdrop-blur-lg backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-lg transition-all duration-300 group-hover:shadow-xl h-full flex flex-col">
      {/* Project Header */}
      <motion.div
        className="flex justify-between items-start mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-xl font-bold text-slate-900">{project.title}</h3>
        <div className="flex items-center gap-3">
          {project.tryMe && project.link && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-sky-500 to-blue-600 text-white text-xs font-bold rounded-full shadow-md hover:shadow-lg transition-all"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
                Try Me
              </Link>
            </motion.div>
          )}
          {project.link && (
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
          )}
        </div>
      </motion.div>

      {/* Project Image */}
      <motion.div
        className="relative h-44 w-full overflow-hidden rounded-xl mb-4 border border-slate-200"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src={project.image}
          alt={`Cuplikan ${project.title}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out"
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
        className="text-slate-600 mb-4 text-sm leading-relaxed flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        {project.description}
      </motion.p>

      {/* Project Tags */}
      <motion.div
        className="flex flex-wrap gap-2 mt-auto"
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      />
    )}
  </motion.div>
);

export default function Projects() {
  const realProjects = [
    {
      title: 'Dashboard Daily Cost Production Site - (PT Sari Aditya Loka)',
      period: 'Jul 2025 - Agustus 2025',
      description: 'Berkolaborasi dengan stakeholder dari PT Sari Aditya Loka untuk memahami kebutuhan bisnis dan Key Performance Indicators (KPI) yang perlu dimonitor. Dashboard ini bertujuan untuk meningkatkan efisiensi operasional dan mendukung pengambilan keputusan strategis yang berbasis data untuk PT Sari Aditya Loka (anak usaha PT Astra Agro Lestari yang bergerak di bidang sawit).',
      image: '/images/projects/costsite.png',
      tags: ['PHP', 'MySQL'],
      link: 'https://dasboardcost.com/',
    },
    {
      title: 'PALMA ROOTS - (PT Palma Serasih Tbk)',
      period: 'Oct 2025 - Feb 2026',
      description: 'Membangun sistem manajemen lapangan full-stack yang mengubah proses manual menjadi digital. PALMA ROOTS memungkinkan pemantauan aktivitas perkebunan (Panen, Angkut, Perawatan) secara real-time, memastikan transparansi data dari lapangan hingga ke manajemen. Dilengkapi fitur Taksasi Panen dan Verification Flow untuk meminimalkan kebocoran hasil produksi dan meningkatkan akurasi penggajian (Upah) karyawan.',
      image: '/images/projects/palmaroots.png',
      tags: ['MongoDB', 'Express', 'React', 'Node.js', 'TypeScript', 'Tailwind CSS'],
      link: 'https://github.com/NaufalPratomo/WebQuest_Project/tree/main/SawiTrack',
    },
    {
      title: 'CARUBRA Virtual Assistant - (PT Utero Kreatif Indonesia)',
      period: 'Jan 2026 - Mar 2026',
      description: 'Mengembangkan asisten virtual berbasis suara untuk PT Utero Kreatif Indonesia yang memungkinkan pengguna berinteraksi secara natural tanpa mengetik. Sistem memproses suara pengguna (speech-to-text), mengirim konteks ke model AI melalui OpenRouter, lalu mengembalikan jawaban dalam bentuk suara (text-to-speech) yang terintegrasi dengan avatar interaktif. Saya juga menerapkan guardrails agar AI tetap fokus pada informasi perusahaan seperti layanan, portofolio, budaya kerja, dan kontak, sehingga respons lebih relevan dan aman untuk kebutuhan front-facing bisnis. Solusi ini membantu menghadirkan pengalaman digital yang modern, informatif, dan engaging untuk profil perusahaan.',
      image: '/images/projects/carubra.png',
      tags: ['Next.js', 'React', 'TypeScript', 'OpenRouter API', 'Web Speech API (STT)', 'Python Flask', 'gTTS', 'Tailwind CSS', 'VAD (Silero)'],
      link: 'https://carubra-ai.vercel.app/',
    },
    {
      title: 'AIDA - Advertisement Intelligence & Data Analytics - (PT Utero Kreatif Indonesia)',
      period: 'Januari 2026 - Sekarang',
      description: 'AIDA adalah sistem monitoring dan analitik billboard berbasis AI untuk deteksi serta perhitungan kendaraan secara real-time. Dalam proyek ini, saya tidak membangun sistem dari nol, tetapi berfokus pada improvement end-to-end: penyempurnaan tampilan dashboard agar lebih jelas dan usable, perbaikan logika proses data agar lebih stabil, serta retraining model YOLO untuk meningkatkan akurasi deteksi. Hasilnya, sistem memberikan insight trafik yang lebih presisi dan lebih siap digunakan untuk kebutuhan operasional serta pengambilan keputusan.',
      image: '/images/projects/aida.png',
      tags: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'Drizzle ORM', 'MySQL', 'Python', 'YOLO', 'OpenCV', 'MQTT'],
    }
  ];

  const privateProjects = [
    {
      title: 'Iqro Quran',
      period: 'Feb 2026 - Mar 2026',
      description: 'Aplikasi ini adalah platform Al-Qur’an berbasis web yang membantu pengguna membaca surah dan juz secara terstruktur, menandai ayat favorit (bookmark), serta memantau progres ibadah harian. Dilengkapi fitur pencarian, pengaturan tampilan bacaan, dan asisten AI untuk menjawab pertanyaan seputar Al-Qur’an, sistem ini dirancang dengan antarmuka modern, responsif, dan nyaman digunakan di berbagai perangkat.',
      image: '/images/projects/iqroquran.png',
      tags: ['Next.js', 'React', 'Tailwind CSS', 'Local Storage'],
      link: 'https://iqro-quran-delta.vercel.app/',
      tryMe: true,
    },
    {
      title: 'Match Vibe',
      period: 'Feb 2026 - Mar 2026',
      description: 'MatchVibe adalah aplikasi web pencatat skor pertandingan multi-olahraga secara real-time, yang memudahkan pengguna memilih cabang olahraga, memasukkan nama pemain, lalu mengelola skor hingga penentuan pemenang dalam satu alur yang cepat dan intuitif. Sistem ini mendukung aturan skor berbeda untuk tiap olahraga (seperti badminton, basket, futsal, tenis, dan tenis meja), termasuk set, deuce, riwayat set, serta reset pertandingan, dengan antarmuka modern berbasis Next.js, React, Tailwind CSS, Zustand, dan Framer Motion.',
      image: '/images/projects/matchvibe.png',
      tags: ['Next.js', 'React', 'Tailwind CSS', 'Zustand', 'Framer Motion'],
      link: 'https://match-vibe-six.vercel.app/',
      tryMe: true,
    },
    {
      title: 'Moto Tracker',
      period: 'Feb 2026',
      description: 'MotoTracker adalah aplikasi web untuk manajemen perawatan motor yang membantu pengguna memantau jadwal servis berdasarkan waktu dan kilometer, mengelola banyak kendaraan dalam satu dashboard, mencatat riwayat servis, serta mengekspor laporan servis ke PDF. Sistem ini dibangun dengan Next.js, React, TypeScript, Tailwind CSS, NextAuth, dan MongoDB sehingga tampil modern, responsif, dan aman untuk penggunaan harian.',
      image: '/images/projects/mototracker.png',
      tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'NextAuth', 'MongoDB'],
      link: 'https://mototracker.vercel.app/',
      tryMe: true,
    },
    {
      title: 'Deadline Reminder',
      period: 'Nov 2025 - Dec 2025',
      description: 'Aplikasi manajemen produktivitas cerdas untuk mengelola tugas dan tenggat waktu. Fitur unggulan meliputi sistem pengingat otomatis via email, manajemen prioritas dengan tracking real-time, dan autentikasi aman. Dibangun menggunakan Next.js dan MongoDB dengan antarmuka yang estetis dan responsif.',
      image: '/images/projects/deadlinereminderapp.png',
      tags: ['Next.js', 'MongoDB', 'TailwindCSS'],
      link: 'https://deadline-reminder-app.vercel.app/',
      tryMe: true,
    },
    {
      title: 'Attendify',
      period: 'Jan 2026',
      description: 'Aplikasi pelacak waktu (time tracker) berbasis web yang dirancang untuk profesional yang mengutamakan fokus. Dilengkapi fitur check-in/check-out real-time, dashboard statistik produktivitas, dan logbook aktivitas harian. Dibangun dengan Next.js 16, React 19, dan Tailwind CSS dengan desain dark mode yang elegan dan responsif.',
      image: '/images/projects/attendify.png',
      tags: ['Next.js 16', 'React 19', 'Tailwind CSS'],
      link: 'https://attendify-three-sigma.vercel.app/',
      tryMe: true,
    },
    {
      title: 'TALENTI',
      period: 'May 2025 - Oct 2025',
      description: 'Sistem informasi berbasis web untuk manajemen dan pencatatan prestasi mahasiswa di Jurusan Teknologi Informasi. Memfasilitasi mahasiswa dan dosen dalam mendokumentasikan, memvalidasi, dan mempublikasikan pencapaian akademik maupun non-akademik.',
      image: '/images/projects/talenti.png',
      tags: ['Laravel', 'MySQL'],
      link: 'https://github.com/hikmahabdillah/sim-pencatatan-prestasi-jti',
    },
    {
      title: 'SIBETA',
      period: 'Dec 2024 - Jan 2025',
      description: 'Sistem Informasi Bebas Tanggungan TA untuk membantu pengelolaan data bebas tanggungan tugas akhir di Politeknik Negeri Malang.',
      image: '/images/projects/sibeta.png',
      tags: ['Laravel', 'MySQL'],
      link: 'https://github.com/NaufalPratomo/PBL',
    },
    {
      title: 'WeatherAI Classification System',
      period: 'Oct 2025 - Dec 2025',
      description: 'Mengembangkan aplikasi mobile berbasis Flutter yang mengimplementasikan sistem visi komputer untuk klasifikasi cuaca secara real-time. Aplikasi ini mampu menganalisis gambar langit untuk mengidentifikasi dan mengklasifikasikan kondisi cuaca secara otomatis, memberikan pengguna informasi meteorologi yang cepat dan akurat.',
      image: '/images/projects/weather.png',
      tags: ['Flutter', 'AI', 'Machine Learning'],
      link: 'https://github.com/weather-classification-kelompok6',
    },
  ];

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [sectionRef, isInView] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });
  const timelineRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"]
  });

  // Interactive cursor optimized with useMotionValue
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX - 16); // Center offset
      mouseY.set(e.clientY - 16);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);




  return (
    <section
      id="projects"
      className="relative min-h-screen flex flex-col justify-center px-4 py-12 md:py-20 overflow-hidden"
      ref={timelineRef}
    >
      {/* Background Elements */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-b from-blue-50/50 to-transparent"
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.5], [0, 0.5]),
        }}
      />

      <div className="max-w-6xl mx-auto w-full relative z-10" ref={sectionRef}>
        <motion.h2
          className="text-3xl md:text-5xl font-bold text-slate-900 mb-12 md:mb-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          Portofolio Project
        </motion.h2>

        {/* Real Projects Section */}
        <div className="mb-16">
          <motion.h3
            className="text-2xl font-bold text-slate-800 mb-8 pl-4 border-l-4 border-sky-600"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Real Projects
          </motion.h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {realProjects.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={index + 10}
                hoveredIndex={hoveredIndex}
                setHoveredIndex={setHoveredIndex}
              />
            ))}
          </div>
        </div>

        {/* Private Projects Section */}
        <div>
          <motion.h3
            className="text-2xl font-bold text-slate-800 mb-8 pl-4 border-l-4 border-blue-600"
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Private Projects
          </motion.h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {privateProjects.map((project, index) => (
              <ProjectCard
                key={project.title}
                project={project}
                index={index + 20}
                hoveredIndex={hoveredIndex}
                setHoveredIndex={setHoveredIndex}
              />
            ))}
          </div>
        </div>

        {/* Interactive Cursor */}
        <motion.div
          className="fixed w-8 h-8 rounded-full pointer-events-none mix-blend-difference z-50 hidden md:block"
          style={{
            x: cursorX,
            y: cursorY,
            background: 'white',
          }}
          animate={{
            scale: hoveredIndex !== null ? 1.5 : 1,
          }}
          transition={{ type: "spring", stiffness: 150, damping: 15 }}
        />
      </div>
    </section>
  );
}