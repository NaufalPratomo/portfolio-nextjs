"use client";

import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useState, useEffect } from 'react';

const initialAchievements = [
    {
        title: 'Lomba Web Development Nasional - Technofest',
        description: 'Participation in the Technofest competition.',
        image: '/images/lomba/technofest.png',
        date: '2026'
    },
    {
        title: 'Explor[AI]tion',
        description: 'Participation in the Explor[AI]tion competition.',
        image: '/images/lomba/Explor[AI]tion.png',
        date: '2025'
    },
    {
        title: '4C National Competition',
        description: 'Participation in the 4C National Competition.',
        image: '/images/lomba/4C.png',
        date: '2024'
    }
];

const getImageSrc = (src) => {
    if (!src) return '/images/lomba/technofest.png';
    if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('/')) {
        return src;
    }
    if (src.startsWith('z0/')) {
        return `https://res.cloudinary.com/dmy6ugxz0/${src.replace(/^z0\//, '')}`;
    }
    return `https://res.cloudinary.com/${src}`;
};

export default function Achievements() {
    const [achievements, setAchievements] = useState(initialAchievements);

    useEffect(() => {
        fetch('/api/achievements')
            .then(res => res.json())
            .then(data => {
                if (data.success && Array.isArray(data.data) && data.data.length > 0) {
                    setAchievements(data.data);
                }
            })
            .catch(err => console.error('Failed to fetch achievements', err));
    }, []);


    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [sectionRef, isInView] = useIntersectionObserver({ threshold: 0.1 });

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') setSelectedImage(null);
        };
        if (selectedImage) {
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
    }, [selectedImage]);

    return (
        <>
            <section
                id="achievements"
                className="relative min-h-[50vh] flex items-center px-4 py-12 md:py-20 overflow-hidden bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300"
            >
                <div className="max-w-6xl mx-auto w-full relative z-10">
                    <motion.h2
                        className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-8 md:mb-12 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        Penghargaan & Kompetisi
                    </motion.h2>

                    <div
                        ref={sectionRef}
                        className="grid md:grid-cols-2 gap-6 md:gap-8"
                    >
                        {achievements.map((item, index) => (
                            <motion.div
                                key={item.title}
                                className="relative group h-full"
                                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                onHoverStart={() => setHoveredIndex(index)}
                                onHoverEnd={() => setHoveredIndex(null)}
                            >
                                <div className="bg-white/90 dark:bg-slate-900/85 backdrop-blur-md rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-300 group-hover:shadow-md h-full flex flex-col">

                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4 gap-3">
                                        <h3 className="text-lg md:text-xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                                            {item.title}
                                        </h3>
                                        <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60 rounded-lg whitespace-nowrap">
                                            {item.date}
                                        </span>
                                    </div>

                                    {/* Certificate Image Preview */}
                                    <div
                                        className="relative overflow-hidden rounded-xl mb-4 border border-slate-200/80 dark:border-slate-800 h-64 w-full cursor-pointer bg-slate-100 dark:bg-slate-800"
                                        onClick={() => setSelectedImage(item.image)}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                e.preventDefault();
                                                setSelectedImage(item.image);
                                            }
                                        }}
                                        aria-label={`Buka sertifikat ${item.title}`}
                                    >
                                        <Image
                                            src={getImageSrc(item.image)}
                                            alt={item.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className="object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
                                            unoptimized
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <span className="text-white bg-black/60 px-3.5 py-1.5 rounded-lg text-xs font-medium backdrop-blur-sm">
                                                Lihat Sertifikat
                                            </span>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mt-auto">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lightbox Modal with Escape key accessibility (R-26, R-32) */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        onWheel={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        data-lenis-prevent
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 modal-scroll-lock overscroll-contain"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            onWheel={(e) => e.stopPropagation()}
                            data-lenis-prevent
                            className="relative max-w-5xl max-h-[90vh] w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-transparent overscroll-contain"
                        >
                            <button
                                onClick={() => setSelectedImage(null)}
                                aria-label="Tutup sertifikat"
                                className="absolute top-4 right-4 z-50 min-w-[44px] min-h-[44px] flex items-center justify-center bg-black/60 hover:bg-black/80 text-white rounded-xl transition-colors backdrop-blur-md focus-visible:ring-2 focus-visible:ring-white"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <Image
                                src={getImageSrc(selectedImage)}
                                alt="Pratinjau Sertifikat"
                                fill
                                className="object-contain"
                                quality={100}
                                unoptimized
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </>
    );
}
