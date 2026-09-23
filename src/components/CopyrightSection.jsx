"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useState, useEffect } from 'react';

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
    description: 'Sistem Reklame Cerdas Terintegrasi yang dilindungi oleh Undang-Undang Nomor 28 Tahun 2014 tentang Hak Cipta dengan jangka waktu pelindungan 50 (lima puluh) tahun sejak Ciptaan pertama kali diumumkan.',
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

export default function CopyrightSection() {
  const [items, setItems] = useState(initialCopyrights);
  const [activeModalItem, setActiveModalItem] = useState(null);
  const [modalPage, setModalPage] = useState('cert'); // 'cert' or 'attachment'
  const [sectionRef, isInView] = useIntersectionObserver({ threshold: 0.1 });

  useEffect(() => {
    let isMounted = true;
    fetch('/api/copyrights')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (isMounted && data && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setItems(data.data.filter((item) => item.featured !== false));
        }
      })
      .catch((err) => {
        // Silently preserve initialCopyrights fallback if API unreachable
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
    <>
      <section
        id="copyright"
        ref={sectionRef}
        className="relative min-h-[50vh] flex items-center px-4 py-16 md:py-24 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300"
      >
        <div className="max-w-6xl mx-auto w-full relative z-10">
          {/* Header */}
          <div className="text-center mb-10 md:mb-14">
            <motion.h2
              className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              Hak Cipta & HKI
            </motion.h2>
            <motion.p
              className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm md:text-base leading-relaxed"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Surat Pencatatan Ciptaan resmi yang dikeluarkan oleh Kementerian Hukum dan HAM Republik Indonesia / Ditjen Kekayaan Intelektual.
            </motion.p>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 max-w-4xl mx-auto">
            {items.map((item, index) => {
              const creatorsList = Array.isArray(item.creators)
                ? item.creators
                : (typeof item.creators === 'string' ? item.creators.split(',').map((c) => c.trim()) : []);

              return (
                <motion.div
                  key={item._id || item.title || index}
                  className="relative group rounded-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                >
                  <div className="grid md:grid-cols-12 gap-6 p-6 md:p-8 items-center">
                    {/* Thumbnail Certificate Preview (5 cols) */}
                    <div className="md:col-span-5 flex flex-col gap-3">
                      <div
                        onClick={() => openModal(item, 'cert')}
                        className="relative w-full h-64 md:h-72 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/80 shadow-inner group/img cursor-pointer bg-slate-100 dark:bg-slate-800"
                      >
                        <Image
                          src={getImageSrc(item.certificateImage)}
                          alt={item.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="object-cover object-top transition-transform duration-500 group-hover/img:scale-105"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-black/20 to-transparent opacity-80 group-hover/img:opacity-95 transition-opacity flex flex-col justify-end p-4">
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-slate-900/80 backdrop-blur-md px-3 py-1.5 rounded-lg w-fit shadow-sm">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                            </svg>
                            Klik untuk Perbesar
                          </span>
                        </div>
                      </div>

                      {/* Small Attachment Preview pill if available */}
                      {item.attachmentImage && (
                        <button
                          type="button"
                          onClick={() => openModal(item, 'attachment')}
                          className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 border border-slate-200/80 dark:border-slate-700/80 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors text-left"
                        >
                          <span className="flex items-center gap-2 truncate">
                            <svg className="w-4 h-4 text-blue-600 dark:text-sky-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Lihat Lampiran Pencipta
                          </span>
                          <span className="text-[11px] text-blue-600 dark:text-sky-400 font-semibold underline">Hal. 2</span>
                        </button>
                      )}
                    </div>

                    {/* Content Details (7 cols) */}
                    <div className="md:col-span-7 flex flex-col justify-between h-full space-y-4">
                      {/* Top Meta */}
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2.5">
                          <span className="px-2.5 py-1 rounded-md font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-sky-300 border border-blue-200/60 dark:border-blue-800/60">
                            {item.type || 'Program Komputer'}
                          </span>
                          {item.registrationNumber && (
                            <span className="text-slate-500 dark:text-slate-400 font-mono">
                              No. <strong className="text-slate-700 dark:text-slate-200 font-semibold">{item.registrationNumber}</strong>
                            </span>
                          )}
                        </div>
                        {item.date && (
                          <span className="text-slate-500 dark:text-slate-400 font-medium">
                            {item.date}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                        {item.description}
                      </p>

                      {/* Key details */}
                      <div className="pt-3 border-t border-slate-200/70 dark:border-slate-800 space-y-2 text-xs md:text-sm">
                        {item.holder && (
                          <div className="flex flex-wrap items-baseline gap-x-2">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Pemegang Hak Cipta:</span>
                            <span className="text-slate-800 dark:text-slate-200 font-semibold">{item.holder}</span>
                          </div>
                        )}
                        {creatorsList.length > 0 && (
                          <div className="leading-relaxed text-slate-600 dark:text-slate-400">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">Pencipta: </span>
                            {creatorsList.map((creator, cIdx) => {
                              const isUser = creator.toLowerCase().includes('naufal');
                              return (
                                <span key={cIdx}>
                                  {isUser ? (
                                    <strong className="text-blue-600 dark:text-sky-400 font-semibold">
                                      {creator}
                                    </strong>
                                  ) : (
                                    <span>{creator}</span>
                                  )}
                                  {cIdx < creatorsList.length - 1 && ', '}
                                </span>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* CTA Link to full dedicated page */}
          <motion.div
            className="text-center mt-10 md:mt-12"
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              href="/copyright"
              className="inline-flex items-center justify-center min-h-[44px] px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition-colors shadow-sm hover:shadow"
            >
              Lihat Detail Lengkap Dokumen HKI
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Multi-Page Lightbox Modal */}
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
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 modal-scroll-lock overscroll-contain"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              onWheel={(e) => e.stopPropagation()}
              data-lenis-prevent
              className="relative max-w-4xl max-h-[92vh] w-full flex flex-col rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shadow-2xl overscroll-contain"
            >
              {/* Modal Topbar */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 text-white z-10 shrink-0">
                <div className="flex items-center gap-2 truncate pr-4">
                  <span className="font-semibold text-sm md:text-base truncate">
                    {activeModalItem.title}
                  </span>
                  {activeModalItem.registrationNumber && (
                    <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono">
                      No. {activeModalItem.registrationNumber}
                    </span>
                  )}
                </div>

                {/* Switchers, Actions & Close */}
                <div className="flex items-center gap-2">
                  {isPdfFile(activeModalItem.certificateImage) ? (
                    <a
                      href={activeModalItem.certificateImage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span>Buka PDF</span>
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
                        Hal 2: Pencipta
                      </button>
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => setActiveModalItem(null)}
                    aria-label="Tutup pratinjau sertifikat"
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl transition-colors ml-1 focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body - Scrollable content isolated from main page */}
              <div
                className="relative flex-1 w-full bg-slate-950 overflow-y-auto overflow-x-hidden p-3 md:p-5 overscroll-contain"
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
    </>
  );
}
