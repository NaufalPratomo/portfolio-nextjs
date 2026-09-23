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
    fetch('/api/copyrights')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setItems(data.data.filter((item) => item.featured !== false));
        }
      })
      .catch((err) => console.error('Failed to fetch copyrights', err));
  }, []);

  const openModal = (item, page = 'cert') => {
    setActiveModalItem(item);
    setModalPage(page);
  };

  return (
    <>
      <section
        id="copyright"
        ref={sectionRef}
        className="relative min-h-[50vh] flex items-center px-4 py-16 md:py-24 overflow-hidden"
      >
        <div className="max-w-6xl mx-auto w-full relative z-10">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 text-xs md:text-sm font-medium mb-3 shadow-sm"
            >
              <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
              </svg>
              Kekayaan Intelektual Terdaftar
            </motion.div>
            <motion.h2
              className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Hak Cipta & HKI
            </motion.h2>
            <motion.p
              className="mt-3 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm md:text-base"
              initial={{ opacity: 0, y: 15 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
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
                  className="relative group rounded-3xl bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.15 }}
                >
                  <div className="grid md:grid-cols-12 gap-6 p-6 md:p-8 items-center">
                    {/* Thumbnail Certificate Preview (5 cols) */}
                    <div className="md:col-span-5 flex flex-col gap-3">
                      <div
                        onClick={() => openModal(item, 'cert')}
                        className="relative w-full h-64 md:h-72 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/80 shadow-inner group/img cursor-pointer bg-slate-100 dark:bg-slate-800"
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
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600/90 backdrop-blur-md px-3 py-1.5 rounded-full w-fit shadow-md">
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
                          className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-100/90 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/50 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors text-left"
                        >
                          <span className="flex items-center gap-2 truncate">
                            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Lihat Lampiran Pencipta
                          </span>
                          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold underline">Hal. 2</span>
                        </button>
                      )}
                    </div>

                    {/* Content Details (7 cols) */}
                    <div className="md:col-span-7 flex flex-col justify-between h-full space-y-4">
                      {/* Top Badges */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                          {item.type || 'Program Komputer'}
                        </span>
                        {item.registrationNumber && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            No. Pencatatan: <strong>{item.registrationNumber}</strong>
                          </span>
                        )}
                        {item.date && (
                          <span className="px-2.5 py-1 text-xs text-slate-500 dark:text-slate-400 ml-auto">
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
                      <div className="space-y-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-800 text-xs md:text-sm">
                        {item.holder && (
                          <div className="flex items-start gap-2">
                            <span className="text-slate-400 min-w-[110px] shrink-0 font-medium">Pemegang Hak Cipta:</span>
                            <span className="text-slate-800 dark:text-slate-200 font-semibold">{item.holder}</span>
                          </div>
                        )}
                        {creatorsList.length > 0 && (
                          <div>
                            <span className="text-slate-400 font-medium block mb-1.5">Pencipta:</span>
                            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                              {creatorsList.map((creator, cIdx) => {
                                const isUser = creator.toLowerCase().includes('naufal');
                                return (
                                  <span
                                    key={cIdx}
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${
                                      isUser
                                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 ring-1 ring-emerald-500/40 font-bold'
                                        : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300'
                                    }`}
                                  >
                                    {isUser && (
                                      <svg className="w-3 h-3 mr-1 text-emerald-600 dark:text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                    )}
                                    {creator}
                                  </span>
                                );
                              })}
                            </div>
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
            className="text-center mt-12"
            initial={{ opacity: 0, y: 15 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Link
              href="/copyright"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-semibold text-sm md:text-base text-white bg-gradient-to-r from-blue-600 to-sky-600 hover:from-blue-700 hover:to-sky-700 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>Lihat Detail Lengkap & Dokumen HKI</span>
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
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
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 md:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[92vh] w-full h-full flex flex-col rounded-2xl overflow-hidden bg-slate-900 border border-slate-700 shadow-2xl"
            >
              {/* Modal Topbar */}
              <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950/80 border-b border-slate-800 text-white z-10">
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
                    className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors ml-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Modal Body */}
              <div className="relative flex-1 w-full bg-slate-950 flex items-center justify-center overflow-hidden">
                {isPdfFile(activeModalItem.certificateImage) ? (
                  <iframe
                    src={`${activeModalItem.certificateImage}#toolbar=1&navpanes=1`}
                    className="w-full h-full border-0 bg-white"
                    title={activeModalItem.title}
                  />
                ) : (
                  <div className="relative w-full h-full min-h-[350px] p-2">
                    <Image
                      src={getImageSrc(
                        modalPage === 'attachment' && activeModalItem.attachmentImage
                          ? activeModalItem.attachmentImage
                          : activeModalItem.certificateImage
                      )}
                      alt={`${activeModalItem.title} - ${modalPage === 'attachment' ? 'Lampiran Pencipta' : 'Sertifikat'}`}
                      fill
                      className="object-contain"
                      quality={100}
                      unoptimized
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
