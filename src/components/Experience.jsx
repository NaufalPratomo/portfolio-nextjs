"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

const experiences = [
    {
        title: 'Back End Developer',
        company: 'UTERO INDONESIA',
        type: 'Internship',
        date: 'Jan 2026 - Present',
        duration: '4 mos',
        location: 'Kota Malang, East Java, Indonesia',
        locationType: 'On-site',
        logo: '/images/logopt/utero-logo.png',
        skills: ['Back-End Web Development'],
    },
    {
        title: 'Project Manager',
        company: 'WebQuest ID',
        type: 'Self-employed',
        date: 'Oct 2025 - Present',
        duration: '6 mos',
        location: 'Kota Malang, East Java, Indonesia',
        locationType: 'Hybrid',
        logo: '/images/logopt/webquest-logo.png',
        skills: ['Full-Stack Development and Project Management'],
    },
    {
        title: 'Fullstack Developer',
        company: 'PT. Palma Serasih Tbk.',
        type: 'Freelance',
        date: 'Oct 2025 - Feb 2026',
        duration: '5 mos',
        location: 'Jakarta, Indonesia',
        locationType: 'Remote',
        description: 'Membangun sistem manajemen operasional perkebunan berbasis web untuk memusatkan proses pencatatan, monitoring, dan pelaporan dalam satu platform terintegrasi. Sistem ini mencakup manajemen data master (lokasi, karyawan, kelompok kerja), transaksi harian lapangan (absensi, panen, pekerjaan, angkut, taksasi), hingga rekap dan verifikasi laporan untuk kebutuhan operasional dan manajerial. Dengan dashboard dan alur kerja yang terstruktur, PALMA ROOTS membantu tim mempercepat input data, mengurangi kesalahan manual, meningkatkan transparansi progres kerja, serta memudahkan pengambilan keputusan berbasis data.',
        logo: '/images/logopt/palma-logo.png',
        media: '/images/projects/palmaroots.png',
        skills: ['Full-Stack Development and Project Management'],
    },
    {
        title: 'Frontend Web Developer',
        company: 'PT Sari Aditya Loka',
        type: 'Freelance',
        date: 'Jul 2025 - Aug 2025',
        duration: '2 mos',
        location: 'Indonesia',
        locationType: 'Remote',
        description: 'Berkolaborasi dengan stakeholder dari PT Sari Aditya Loka untuk memahami kebutuhan bisnis dan Key Performance Indicators (KPI) yang perlu dimonitor. Dashboard ini bertujuan untuk meningkatkan efisiensi operasional dan mendukung pengambilan keputusan strategis yang berbasis data untuk PT Sari Aditya Loka (anak usaha PT Astra Agro Lestari yang bergerak di bidang sawit)',
        logo: '/images/logopt/sari-aditya-logo.png',
        skills: ['Front-End Development'],
    }
];

export default function Experience() {
    return (
        <section id="experience" className="py-20 relative overflow-hidden bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-500 to-blue-600 mb-4">
                        Pengalaman Kerja
                    </h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-sky-500 to-blue-600 mx-auto rounded-full" />
                </motion.div>

                <div className="max-w-4xl mx-auto space-y-8">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white dark:bg-slate-800 rounded-2xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow border border-slate-100 dark:border-slate-700 group relative overflow-hidden"
                        >
                            {/* Background gradient effect on hover */}
                            <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                            <div className="flex flex-col md:flex-row gap-6 relative z-10">
                                {/* Logo Section */}
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-600 shadow-sm group-hover:scale-105 transition-transform duration-300">
                                        {/* Placeholder for actual image - using initials as fallback if image fails or is placeholder */}
                                        <div className="relative w-full h-full">
                                            {/* In a real scenario, you'd handle image error to show initials. 
                             For now, we assume the user will replace valid paths. 
                             We can add a text fallback layered behind/in-place. */}
                                            <div className="absolute inset-0 flex items-center justify-center text-slate-400 font-bold text-2xl">
                                                {exp.company.charAt(0)}
                                            </div>
                                            <Image
                                                src={exp.logo}
                                                alt={exp.company}
                                                fill
                                                sizes="80px"
                                                className="object-cover"
                                            // Fallback logic could go here, but omitted for simplicity
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Content Section */}
                                <div className="flex-grow">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                                        <div>
                                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                                                {exp.title}
                                            </h3>
                                            <div className="text-lg font-medium text-slate-700 dark:text-slate-300">
                                                {exp.company}
                                                {exp.type && (
                                                    <>
                                                        <span className="mx-2 text-slate-400">•</span>
                                                        <span className="text-slate-600 dark:text-slate-400 text-base font-normal">{exp.type}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 md:mt-0 font-medium whitespace-nowrap bg-slate-100 dark:bg-slate-700 px-3 py-1 rounded-full inline-block md:block w-fit">
                                            {exp.date} {exp.duration && `· ${exp.duration}`}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
                                        <span className="flex items-center gap-1">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {exp.location}
                                        </span>
                                        <span className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide">
                                            {exp.locationType}
                                        </span>
                                    </div>

                                    {exp.description && (
                                        <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed transition-all">
                                            {exp.description}
                                        </p>
                                    )}

                                    {/* Skills */}
                                    {exp.skills && (
                                        <div className="flex items-center gap-2 mb-4">
                                            <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                            </svg>
                                            <div className="flex flex-wrap gap-2">
                                                {exp.skills.map((skill, i) => (
                                                    <span key={i} className="text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Media Attachment */}
                                    {exp.media && (
                                        <div className="mt-4 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden w-full max-w-xs hover:shadow-md transition-shadow cursor-pointer">
                                            <div className="relative h-32 w-full bg-slate-100 dark:bg-slate-900">
                                                {/* Placeholder for media */}
                                                <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-xs text-center p-2">
                                                    Image preview<br />(Add {exp.media} to public folder)
                                                </div>
                                                <Image
                                                    src={exp.media}
                                                    alt="Attachment"
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 320px"
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="p-2 bg-slate-50 dark:bg-slate-800 text-xs text-slate-500 font-medium truncate">
                                                {exp.media.split('/').pop()}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
