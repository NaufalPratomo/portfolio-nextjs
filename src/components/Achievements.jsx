"use client";

import Image from 'next/image';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useState, useRef } from 'react';

export default function Achievements() {
    const achievements = [
        {
            title: 'Explor[AI]tion',
            description: 'Participation in the Explor[AI]tion competition.',
            image: '/images/lomba/Explor[AI]tion.png',
            date: '2025' // Placeholder
        },
        {
            title: '4C National Competition',
            description: 'Participation in the 4C National Competition.',
            image: '/images/lomba/4C.png',
            date: '2024' // Placeholder
        }
    ];

    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [sectionRef, isInView] = useIntersectionObserver({ threshold: 0.1 });
    const timelineRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ["start end", "end start"]
    });

    return (
        <>
            <section
                id="achievements"
                className="relative min-h-[50vh] flex items-center px-4 py-12 md:py-20 overflow-hidden"
                ref={timelineRef}
            >
                {/* Background Elements */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-50/50"
                    style={{
                        opacity: useTransform(scrollYProgress, [0, 0.5], [0, 0.5]),
                    }}
                />

                <div className="max-w-6xl mx-auto w-full relative z-10">
                    <motion.h2
                        className="text-3xl md:text-5xl font-bold text-slate-900 mb-8 md:mb-12 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.6 }}
                    >
                        Lomba & Achievements
                    </motion.h2>

                    <div
                        ref={sectionRef}
                        className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 md:gap-8"
                    >
                        {achievements.map((item, index) => (
                            <motion.div
                                key={item.title}
                                className="relative group"
                                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ duration: 0.6, delay: index * 0.2 }}
                                onHoverStart={() => setHoveredIndex(index)}
                                onHoverEnd={() => setHoveredIndex(null)}
                                whileHover={{ scale: 1.02 }}
                            >
                                <div className="bg-white/60 md:backdrop-blur-lg backdrop-blur-sm rounded-2xl p-6 border border-slate-200 shadow-lg transition-all duration-300 group-hover:shadow-xl h-full flex flex-col">

                                    {/* Header */}
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {item.title}
                                        </h3>
                                        <span className="text-sm font-medium px-3 py-1 bg-blue-100/50 text-blue-600 rounded-full">
                                            {item.date}
                                        </span>
                                    </div>

                                    {/* Image */}
                                    <motion.div
                                        className="relative overflow-hidden rounded-xl mb-4 border border-slate-200 h-64 w-full cursor-pointer"
                                        whileHover={{ scale: 1.05 }}
                                        transition={{ duration: 0.3 }}
                                        onClick={() => setSelectedImage(item.image)}
                                    >
                                        <Image
                                            src={item.image}
                                            alt={item.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 50vw"
                                            className="object-cover object-center transition-transform duration-700 ease-out"
                                        />
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        >
                                            <span className="text-white bg-black/50 px-4 py-2 rounded-full backdrop-blur-sm text-sm font-medium">
                                                View Certificate
                                            </span>
                                        </motion.div>
                                    </motion.div>

                                    {/* Description */}
                                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mt-auto">
                                        {item.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Lightbox Modal */}
            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-5xl max-h-[90vh] w-full h-full rounded-2xl overflow-hidden shadow-2xl bg-transparent"
                        >
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-md"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <Image
                                src={selectedImage}
                                alt="Certificate Full View"
                                fill
                                className="object-contain"
                                quality={100}
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
