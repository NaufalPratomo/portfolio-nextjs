"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const initialCopyrights = [
  {
    _id: 'default-aida',
    title: 'AIDA V2: Sistem Reklame Cerdas Terintegrasi',
    type: 'Program Komputer',
    registrationNumber: '001417127',
    applicationNumber: 'EC002026143438',
    date: '14 Agustus 2026',
    holder: 'Politeknik Negeri Malang',
    creators: [
      'Muhammad Afif Hendrawan',
      'Pramana Yoga Saputra',
      'Triana Fatmawati',
      'Sofyan Noor Arief',
      'Armand Maulana Andika Putra',
      'Innama Maesa Putri',
      'Muhammad Naufal Pratomo',
      'Aril Ibbet Ardana Putra'
    ],
    description: 'Sistem Reklame Cerdas Terintegrasi yang dilindungi oleh Undang-Undang Nomor 28 Tahun 2014 tentang Hak Cipta dengan jangka waktu pelindungan 50 (lima puluh) tahun sejak Ciptaan pertama kali dilakukan Pengumuman.',
    certificateImage: '/images/copyright/aida-v2-cert.png',
    attachmentImage: '/images/copyright/aida-v2-creators.png',
    featured: true,
  }
];

const getImageSrc = (src, page = 1) => {
  if (!src) return '/images/copyright/aida-v2-cert.png';
  if (typeof src === 'string' && src.toLowerCase().endsWith('.pdf') && src.includes('res.cloudinary.com')) {
    return src.replace(/\/upload\/(?:v\d+\/)?/, (match) => `${match}pg_${page}/`).replace(/\.pdf$/, '.png');
  }
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) {
    return src;
  }
  if (src.startsWith('z0/')) {
    return `https://res.cloudinary.com/dmy6ugxz0/${src.replace(/^z0\//, '')}`;
  }
  return `https://res.cloudinary.com/${src}`;
};

const isPdfFile = (url) => {
  return typeof url === 'string' && url.toLowerCase().includes('.pdf');
};

export default function CopyrightClient() {
  const [items, setItems] = useState(initialCopyrights);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [modalPage, setModalPage] = useState('cert'); // 'cert' | 'attachment'
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    try {
      const isDark = document.documentElement.classList.contains('dark');
      setTheme(isDark ? 'dark' : 'light');
    } catch (e) {}
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    try {
      localStorage.setItem('theme', next);
    } catch (e) {}
    if (next === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetch('/api/copyrights')
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (isMounted && data && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setItems(data.data);
        }
      })
      .catch((err) => {
        // Silently preserve initialCopyrights fallback if API unreachable
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = ['Semua', ...Array.from(new Set(items.map((item) => item.type).filter(Boolean)))];

  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'Semua' || item.type === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.registrationNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(item.creators) && item.creators.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))) ||
      (typeof item.creators === 'string' && item.creators.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setActiveModalItem(null);
    };
    if (activeModalItem) {
      window.addEventListener('keydown', handleKeyDown);
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.classList.add('modal-open');
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = originalOverflow;
        document.documentElement.classList.remove('modal-open');
      };
    }
  }, [activeModalItem]);

  const openModal = (item, page = 'cert') => {
    setActiveModalItem(item);
    setModalPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-sky-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      {/* Top Floating Navigation */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200/60 dark:border-slate-800/60 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/#copyright"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group focus-visible:rounded-md"
          >
            <span className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/50 transition-colors">
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </span>
            <span>Kembali ke Beranda</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/" className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-sky-500 dark:from-blue-400 dark:to-sky-300 focus-visible:rounded-md">
              Naufal Pratomo
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
              title={theme === 'dark' ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 transition-colors focus-visible:rounded-xl"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="4" />
                  <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-slate-700 dark:text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-16">
        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight"
          >
            Hak Kekayaan Intelektual (HKI)
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-base md:text-lg text-slate-600 dark:text-slate-300 leading-relaxed"
          >
            Daftar resmi Surat Pencatatan Ciptaan yang diterbitkan oleh Direktorat Jenderal Kekayaan Intelektual (DJKI), dilindungi oleh Undang-Undang Nomor 28 Tahun 2014 tentang Hak Cipta.
          </motion.p>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200/70 dark:border-slate-800/70">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/80 border border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Cari judul, no. pencatatan, nama..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs md:text-sm bg-white/80 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="w-4 h-4 text-slate-400 absolute left-3 top-2.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Certificate Cards Gallery */}
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white/40 dark:bg-slate-900/40 rounded-3xl border border-slate-200/60 dark:border-slate-800/60">
            <svg className="w-12 h-12 text-slate-400 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Tidak ada data ditemukan</h3>
            <p className="text-sm text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau filter kategori Anda.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {filteredItems.map((item, index) => {
              const creatorsList = Array.isArray(item.creators)
                ? item.creators
                : (typeof item.creators === 'string' ? item.creators.split(',').map((c) => c.trim()) : []);

              return (
                <motion.div
                  key={item._id || item.title || index}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="rounded-3xl bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/90 shadow-xl overflow-hidden"
                >
                  <div className="grid lg:grid-cols-12 gap-8 p-6 sm:p-8 md:p-10">
                    {/* Left: Certificate Previews (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col gap-4">
                      {/* Main Certificate Preview */}
                      <div className="flex flex-col gap-2">
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Dokumen Utama: Surat Pencatatan Ciptaan
                        </span>
                        <div
                          onClick={() => openModal(item, 'cert')}
                          className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md group cursor-pointer bg-slate-100 dark:bg-slate-800"
                        >
                          <Image
                            src={getImageSrc(item.certificateImage)}
                            alt={item.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 450px"
                            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                            unoptimized
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent opacity-75 group-hover:opacity-95 transition-opacity flex flex-col justify-end p-5">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600/90 backdrop-blur-md px-3.5 py-1.5 rounded-full w-fit shadow-md">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                              </svg>
                              Perbesar Sertifikat (Hal. 1)
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Attachment Preview (Lampiran Pencipta) */}
                      {item.attachmentImage && (
                        <div className="flex flex-col gap-2">
                          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                            Dokumen Lampiran: Daftar Pencipta
                          </span>
                          <div
                            onClick={() => openModal(item, 'attachment')}
                            className="relative w-full h-44 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm group cursor-pointer bg-slate-100 dark:bg-slate-800"
                          >
                            <Image
                              src={getImageSrc(item.attachmentImage)}
                              alt={`${item.title} - Lampiran Pencipta`}
                              fill
                              sizes="(max-width: 1024px) 100vw, 450px"
                              className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-black/20 to-transparent opacity-75 group-hover:opacity-95 transition-opacity flex flex-col justify-end p-4">
                              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-slate-800/90 backdrop-blur-md px-3 py-1.5 rounded-full w-fit shadow-md">
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                                Perbesar Lampiran Pencipta (Hal. 2)
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right: Detailed Metadata & Information (7 cols) */}
                    <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                      <div>
                        {/* Top Meta */}
                        <div className="flex flex-wrap items-center gap-3 mb-3 text-xs">
                          <span className="px-2.5 py-1 rounded-md font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 border border-blue-200/60 dark:border-blue-800/60">
                            {item.type || 'Program Komputer'}
                          </span>
                          {item.registrationNumber && (
                            <span className="text-slate-500 dark:text-slate-400 font-mono">
                              No. <strong className="text-slate-700 dark:text-slate-200 font-semibold">{item.registrationNumber}</strong>
                            </span>
                          )}
                          {item.applicationNumber && (
                            <span className="text-slate-500 dark:text-slate-400 font-mono">
                              Permohonan: {item.applicationNumber}
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                          {item.title}
                        </h2>

                        {/* Description */}
                        <p className="mt-4 text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed">
                          {item.description}
                        </p>
                      </div>

                      {/* Detailed Meta Grid */}
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-5 border border-slate-200/80 dark:border-slate-700/80 space-y-3.5 text-xs sm:text-sm">
                        {item.holder && (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-200 dark:border-slate-700/60">
                            <span className="text-slate-400 font-medium">Pemegang Hak Cipta:</span>
                            <span className="text-slate-900 dark:text-slate-100 font-semibold">{item.holder}</span>
                          </div>
                        )}

                        {item.date && (
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-200 dark:border-slate-700/60">
                            <span className="text-slate-400 font-medium">Tanggal Pertama Kali Diumumkan:</span>
                            <span className="text-slate-900 dark:text-slate-100 font-semibold">{item.date}</span>
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-slate-200 dark:border-slate-700/60">
                          <span className="text-slate-400 font-medium">Masa Perlindungan:</span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">50 Tahun Sejak Pertama Diumumkan</span>
                        </div>

                        {/* Creators */}
                        {creatorsList.length > 0 && (
                          <div className="pt-1">
                            <span className="text-slate-400 font-medium block mb-1.5">Daftar Pencipta:</span>
                            <div className="leading-relaxed text-slate-600 dark:text-slate-300 text-xs sm:text-sm">
                              {creatorsList.map((creator, cIdx) => {
                                const isUser = creator.toLowerCase().includes('naufal');
                                return (
                                  <span key={cIdx}>
                                    {isUser ? (
                                      <strong className="text-blue-600 dark:text-sky-400 font-semibold">
                                        {creator}
                                      </strong>
                                    ) : (
                                      creator
                                    )}
                                    {cIdx < creatorsList.length - 1 ? ', ' : ''}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => openModal(item, 'cert')}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-md shadow-blue-500/20"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Lihat Sertifikat Resolusi Penuh
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Back Button Bottom */}
        <div className="mt-16 text-center">
          <Link
            href="/#copyright"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Halaman Beranda Portofolio
          </Link>
        </div>
      </main>

      {/* High-Resolution Multi-Page Lightbox Modal */}
      <AnimatePresence>
        {activeModalItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveModalItem(null)}
            onWheel={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            data-lenis-prevent
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-md p-3 sm:p-6 modal-scroll-lock overscroll-contain"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
              data-lenis-prevent
              className="relative max-w-5xl max-h-[94vh] w-full flex flex-col rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shadow-2xl overscroll-contain"
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-slate-950/90 border-b border-slate-800 text-white z-10 shrink-0">
                <div className="flex items-center gap-2 truncate pr-4">
                  <span className="font-bold text-sm sm:text-base truncate">
                    {activeModalItem.title}
                  </span>
                  {activeModalItem.registrationNumber && (
                    <span className="hidden sm:inline-block text-xs px-2.5 py-0.5 rounded-full bg-blue-900/60 text-blue-300 font-mono">
                      No. {activeModalItem.registrationNumber}
                    </span>
                  )}
                </div>

                {/* Switcher & Close */}
                <div className="flex items-center gap-3 shrink-0">
                  {isPdfFile(activeModalItem.certificateImage) ? (
                    <a
                      href={activeModalItem.certificateImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span>Buka PDF Asli</span>
                    </a>
                  ) : activeModalItem.attachmentImage ? (
                    <div className="inline-flex rounded-lg bg-slate-800 p-0.5 border border-slate-700 text-xs">
                      <button
                        type="button"
                        onClick={() => setModalPage('cert')}
                        className={`px-3 py-1 rounded-md transition-colors ${
                          modalPage === 'cert'
                            ? 'bg-blue-600 text-white font-medium shadow-sm'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        Hal 1: Sertifikat
                      </button>
                      <button
                        type="button"
                        onClick={() => setModalPage('attachment')}
                        className={`px-3 py-1 rounded-md transition-colors ${
                          modalPage === 'attachment'
                            ? 'bg-blue-600 text-white font-medium shadow-sm'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        Hal 2: Lampiran
                      </button>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => setActiveModalItem(null)}
                    aria-label="Tutup pratinjau sertifikat"
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Canvas / Iframe Body - Scrollable content isolated from main page */}
              <div
                className="relative flex-1 w-full bg-slate-950 overflow-y-auto overflow-x-hidden p-3 sm:p-5 overscroll-contain"
                data-lenis-prevent
                onWheel={(e) => e.stopPropagation()}
              >
                {isPdfFile(activeModalItem.certificateImage) ? (
                  <iframe
                    src={`${activeModalItem.certificateImage}#toolbar=1&navpanes=1`}
                    className="w-full min-h-[75vh] border-0 bg-white rounded-lg shadow"
                    title={activeModalItem.title}
                  />
                ) : (
                  <div className="w-full flex justify-center py-2">
                    <img
                      src={getImageSrc(
                        modalPage === 'attachment' && activeModalItem.attachmentImage
                          ? activeModalItem.attachmentImage
                          : activeModalItem.certificateImage
                      )}
                      alt={`${activeModalItem.title} - ${modalPage === 'attachment' ? 'Lampiran Pencipta' : 'Sertifikat'}`}
                      className="max-w-full w-auto h-auto rounded-lg shadow-2xl object-contain mx-auto"
                      loading="eager"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
