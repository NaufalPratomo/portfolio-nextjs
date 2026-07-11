"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion';
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
    <div className="bg-white/60 md:backdrop-blur-lg rounded-2xl p-6 border border-slate-200 shadow-lg transition-all duration-300 group-hover:shadow-xl h-full flex flex-col">
      {/* Project Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-slate-900">{project.title}</h3>
        <div className="flex items-center gap-3">
          {project.tryMe && project.link && (
            <div className="transition-transform duration-200 hover:scale-105 active:scale-95">
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
            </div>
          )}
          {project.link && (
            <div className="transition-transform duration-200 hover:scale-110 hover:rotate-45 active:scale-95">
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
            </div>
          )}
        </div>
      </div>

      {/* Project Image */}
      <div className="relative h-44 w-full overflow-hidden rounded-xl mb-4 border border-slate-200">
        <Image
          src={project.image}
          alt={`Cuplikan ${project.title}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Project Period */}
      <p className="text-sm text-sky-700 mb-4">
        {project.period}
      </p>

      {/* Project Description */}
      <p className="text-slate-600 mb-4 text-sm leading-relaxed flex-grow">
        {project.description}
      </p>

      {/* Project Tags */}
      <div className="flex flex-wrap gap-2 mt-auto">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-sky-200/70 text-sky-800 rounded-full text-xs font-medium transition-transform duration-200 hover:scale-105"
          >
            {tag}
          </span>
        ))}
      </div>
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
      title: 'Dashboard HR and GA - (PT Eka Dura Indonesia)',
      period: 'Jun 2026',
      description: 'Membangun aplikasi dashboard HR & GA (Human Resources & General Affairs) full-stack terintegrasi untuk PT Eka Dura Indonesia (anak usaha PT Astra Agro Lestari Tbk yang bergerak di bidang sawit). Dashboard ini mendigitalisasi pemantauan Hari Kerja Normal Efektif (HKNE) karyawan operasional (Panen, Infield, Rawat), absensi, serta pelacakan realisasi anggaran biaya. Dilengkapi pula dengan fitur manajemen aset dan jatuh tempo pajak kendaraan operasional untuk meminimalkan denda serta mendukung efisiensi biaya perusahaan secara real-time.',
      image: '/images/projects/DashboardHRGA.jpg',
      tags: ['Next.js', 'TypeScript', 'Prisma ORM', 'MySQL'],
    },
    {
      title: 'E-Masjid Daarus Sholih Patraland (Masjid Daarus Sholih Patraland)',
      period: 'May 2026',
      description: 'Membangun sistem informasi masjid modern yang mengedepankan transparansi tata kelola keuangan dan kemudahan akses informasi jemaah. Sistem ini mengintegrasikan Dashboard Admin untuk manajemen operasional harian dengan Landing Page publik yang elegan, memastikan setiap data mulai dari laporan keuangan hingga jadwal agenda tersaji secara real-time dan akuntabel.',
      image: '/images/projects/emasjidPatra.png',
      tags: ['Next.js', 'TypeScript', 'MongoDB', 'Tailwind CSS', 'Cloudinary', 'Framer Motion'],
      link: 'https://emasjid-daarus-sholih-patraland.vercel.app/',
    },
    {
      title: 'Djoe Orchid Monitoring System (Djoe Orchid)',
      period: 'April 2026',
      description: 'Djoe Orchid Monitoring System adalah platform dashboard modern yang berfungsi sebagai pusat kendali inventaris tanaman anggrek. Sistem ini mempermudah pemilik bisnis dalam mencatat varietas, memantau kuantitas stok, dan mendokumentasikan fase penanaman secara digital. Dengan antarmuka yang bersih bertema botanical, aplikasi ini mengedepankan efisiensi operasional melalui fitur pemindaian QR Code untuk manajemen data yang akurat di lapangan.',
      image: '/images/projects/djoesOrchid.png',
      tags: ['Next.js 14', 'TypeScript', 'MongoDB', 'Tailwind CSS', 'HTML5-QRCode'],
      link: 'https://djoe-orchid.vercel.app/',
    },
    {
      title: 'Dashboard Daily Cost Production Site - (PT Sari Aditya Loka)',
      period: 'Jul 2025 - Agustus 2025',
      description: 'Berkolaborasi dengan stakeholder dari PT Sari Aditya Loka untuk memahami kebutuhan bisnis dan Key Performance Indicators (KPI) yang perlu dimonitor. Dashboard ini bertujuan untuk meningkatkan efisiensi operasional dan mendukung pengambilan keputusan strategis yang berbasis data untuk PT Sari Aditya Loka (anak usaha PT Astra Agro Lestari yang bergerak di bidang sawit).',
      image: '/images/projects/costsite.png',
      tags: ['PHP', 'MySQL'],
    },
    {
      title: 'PALMA ROOTS - (PT Palma Serasih Tbk)',
      period: 'Oct 2025 - Feb 2026',
      description: 'Membangun sistem manajemen operasional perkebunan berbasis web untuk memusatkan proses pencatatan, monitoring, dan pelaporan dalam satu platform terintegrasi. Sistem ini mencakup manajemen data master (lokasi, karyawan, kelompok kerja), transaksi harian lapangan (absensi, panen, pekerjaan, angkut, taksasi), hingga rekap dan verifikasi laporan untuk kebutuhan operasional dan manajerial. Dengan dashboard dan alur kerja yang terstruktur, PALMA ROOTS membantu tim mempercepat input data, mengurangi kesalahan manual, meningkatkan transparansi progres kerja, serta memudahkan pengambilan keputusan berbasis data.',
      image: '/images/projects/palmaroots.png',
      tags: ['MongoDB', 'Express', 'React', 'Node.js', 'TypeScript', 'Tailwind CSS'],
    },
    {
      title: 'CARUBRA Virtual Assistant - (PT Utero Kreatif Indonesia)',
      period: 'Jan 2026 - Mar 2026',
      description: 'Mengembangkan asisten virtual berbasis suara untuk PT Utero Kreatif Indonesia yang memungkinkan pengguna berinteraksi secara natural tanpa mengetik. Sistem memproses suara pengguna (speech-to-text), mengirim konteks ke model AI melalui OpenRouter, lalu mengembalikan jawaban dalam bentuk suara (text-to-speech) yang terintegrasi dengan avatar interaktif. Saya juga menerapkan guardrails agar AI tetap fokus pada informasi perusahaan seperti layanan, portofolio, budaya kerja, dan kontak, sehingga respons lebih relevan dan aman untuk kebutuhan front-facing bisnis. Solusi ini membantu menghadirkan pengalaman digital yang modern, informatif, dan engaging untuk profil perusahaan.',
      image: '/images/projects/carubra.png',
      tags: ['Next.js', 'React', 'TypeScript', 'OpenRouter API', 'Web Speech API (STT)', 'Python Flask', 'gTTS', 'Tailwind CSS', 'VAD (Silero)'],
    },
    {
      title: 'AIDA - Advertisement Intelligence & Data Analytics - (PT Utero Kreatif Indonesia)',
      period: 'Januari 2026 - Present',
      description: 'AIDA adalah sistem monitoring dan analitik billboard berbasis AI untuk deteksi serta perhitungan kendaraan secara real-time. Dalam proyek ini, saya tidak membangun sistem dari nol, tetapi berfokus pada improvement end-to-end: penyempurnaan tampilan dashboard agar lebih jelas dan usable, perbaikan logika proses data agar lebih stabil, serta retraining model YOLO untuk meningkatkan akurasi deteksi. Hasilnya, sistem memberikan insight trafik yang lebih presisi dan lebih siap digunakan untuk kebutuhan operasional serta pengambilan keputusan.',
      image: '/images/projects/aida.png',
      tags: ['React', 'TypeScript', 'Vite', 'Tailwind CSS', 'Node.js', 'Express', 'Drizzle ORM', 'MySQL', 'Python', 'YOLO', 'OpenCV', 'MQTT'],
    },
    {
      title: 'Enterprise Operations Dashboard - (PT Doa Suryo Agong)',
      period: 'Mar 2026 - Present',
      description: 'Membangun platform dashboard enterprise terintegrasi untuk mendukung operasional lintas divisi (Finance, HR, Produksi, Logistik, Sales, Management, dan Office) dalam satu ekosistem. Arsitektur backend dirancang secara hybrid, menggabungkan akses data langsung berbasis policy untuk CRUD ringan dan API server untuk business logic kompleks seperti approval workflow, payroll, reimburse, budget, serta agregasi metrik lintas modul. Solusi ini meningkatkan kecepatan proses kerja, akurasi data, dan kualitas pengambilan keputusan berbasis data real-time. Saya berfokus pada pengembangan backend end-to-end: merancang dan membangun API modular, menerapkan otorisasi berbasis role/access level, mengamankan data dengan Supabase Auth dan RLS, menyusun validasi payload serta service layer, mengembangkan workflow approval dan automasi perhitungan bisnis, serta melakukan hardening endpoint dan perbaikan bug kritikal agar sistem stabil di production.',
      image: '/images/projects/suryo_agong.png',
      tags: ['Next.js', 'TypeScript', 'Supabase', 'PostgreSQL', 'API Routes', 'RLS', 'Node.js'],
    }
  ];

  const privateProjects = [
    {
      title: 'Frugalin.aja',
      period: 'May 2026',
      description: 'Aplikasi pengelolaan keuangan pribadi (personal finance tracker) modern dengan visualisasi interaktif. Dilengkapi fitur canggih seperti Pemindai Struk otomatis berbasis OCR AI (Tesseract.js & Gemini 2.5 Flash), limit anggaran dinamis, pelacakan bunga bank bulanan, serta dukungan penuh Progressive Web App (PWA) untuk instalasi mandiri dengan animasi splash screen premium.',
      image: '/images/projects/frugalin.png',
      tags: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS v4', 'MongoDB', 'Next-Auth', 'Tesseract.js', 'OpenRouter API', 'PWA'],
      link: 'https://frugalin-aja.vercel.app/',
      tryMe: true,
    },
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
    },
    {
      title: 'SIBETA',
      period: 'Dec 2024 - Jan 2025',
      description: 'Sistem Informasi Bebas Tanggungan TA untuk membantu pengelolaan data bebas tanggungan tugas akhir di Politeknik Negeri Malang.',
      image: '/images/projects/sibeta.png',
      tags: ['Laravel', 'MySQL'],
    },
    {
      title: 'WeatherAI Classification System',
      period: 'Oct 2025 - Dec 2025',
      description: 'Mengembangkan aplikasi mobile berbasis Flutter yang mengimplementasikan sistem visi komputer untuk klasifikasi cuaca secara real-time. Aplikasi ini mampu menganalisis gambar langit untuk mengidentifikasi dan mengklasifikasikan kondisi cuaca secara otomatis, memberikan pengguna informasi meteorologi yang cepat dan akurat.',
      image: '/images/projects/weather.png',
      tags: ['Flutter', 'AI', 'Machine Learning'],
    },
  ];

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [enableInteractiveCursor, setEnableInteractiveCursor] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const [sectionRef, isInView] = useIntersectionObserver({ threshold: 0.01, triggerOnce: true });
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
    if (typeof window === 'undefined') return;

    const media = window.matchMedia('(min-width: 1024px) and (pointer: fine)');
    const updateCursorMode = () => {
      setEnableInteractiveCursor(media.matches && !shouldReduceMotion);
    };

    updateCursorMode();
    media.addEventListener('change', updateCursorMode);

    return () => media.removeEventListener('change', updateCursorMode);
  }, [shouldReduceMotion]);

  useEffect(() => {
    if (!enableInteractiveCursor) return;

    const handleMouseMove = (e) => {
      const cursorSize = 32;
      const maxX = Math.max(0, window.innerWidth - cursorSize);
      const maxY = Math.max(0, window.innerHeight - cursorSize);
      const clampedX = Math.max(0, Math.min(e.clientX - cursorSize / 2, maxX));
      const clampedY = Math.max(0, Math.min(e.clientY - cursorSize / 2, maxY));

      mouseX.set(clampedX);
      mouseY.set(clampedY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enableInteractiveCursor, mouseX, mouseY]);




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
        {enableInteractiveCursor && (
          <motion.div
            className="fixed w-8 h-8 rounded-full pointer-events-none mix-blend-difference z-50"
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
        )}
      </div>
    </section>
  );
}