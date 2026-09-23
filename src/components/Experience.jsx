"use client";
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { getExperienceDuration, sortExperiencesByDate } from '@/lib/dateUtils';

const initialExperiences = [
    {
        title: 'Back End Developer',
        company: 'PT Indolakto',
        type: 'Internship',
        date: 'Jul 2026 - Present',
        duration: '2 mos',
        location: 'Pasuruan, East Java, Indonesia',
        locationType: 'On-site',
        logo: '/images/logopt/logo-indolakto.png',
        skills: ['Back-End Web Development', 'Mqtt', 'Back-end Operations', 'Server Side Programming'],
    },
    {
        title: 'Web Developer',
        company: 'PT. XYZ',
        type: 'Freelance',
        date: 'Jun 2026',
        duration: '1 mo',
        location: 'Indonesia',
        locationType: 'Remote',
        description: 'Membangun aplikasi dashboard HR & GA (Human Resources & General Affairs) full-stack terintegrasi untuk PT XYZ (perusahaan agribisnis kelapa sawit nasional). Dashboard ini mendigitalisasi pemantauan Hari Kerja Normal Efektif (HKNE) karyawan operasional (Panen, Infield, Rawat), absensi, serta pelacakan realisasi anggaran biaya. Dilengkapi fitur manajemen aset dan jatuh tempo pajak kendaraan operasional untuk meminimalkan denda serta mendukung efisiensi biaya secara real-time.',
        initials: 'XYZ',
        media: '/images/projects/DashboardHRGA.jpg',
        skills: ['Full-Stack Development'],
    },
    {
        title: 'Back End Developer',
        company: 'UTERO INDONESIA',
        type: 'Internship',
        date: 'Jan 2026 - Jun 2026',
        duration: '6 mos',
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
        company: 'PT. XYZ',
        type: 'Freelance',
        date: 'Jul 2025 - Aug 2025',
        duration: '2 mos',
        location: 'Indonesia',
        locationType: 'Remote',
        description: 'Berkolaborasi dengan stakeholder dari PT XYZ untuk memahami kebutuhan bisnis dan Key Performance Indicators (KPI) yang perlu dimonitor. Dashboard ini bertujuan untuk meningkatkan efisiensi operasional dan mendukung pengambilan keputusan strategis berbasis data untuk perusahaan agribisnis/kelapa sawit nasional.',
        initials: 'XYZ',
        skills: ['Front-End Development'],
    }
];

export default function Experience() {
    const [experiences, setExperiences] = React.useState(sortExperiencesByDate(initialExperiences));

    React.useEffect(() => {
        fetch('/api/experiences')
            .then(res => res.json())
            .then(data => {
                if (data.success && Array.isArray(data.data) && data.data.length > 0) {
                    setExperiences(sortExperiencesByDate(data.data));
                }
            })
            .catch(err => console.error('Error fetching experiences', err));
    }, []);

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
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-white mb-4">
                        Pengalaman Kerja
                    </h2>
                </motion.div>

                <div className="max-w-4xl mx-auto space-y-8">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow border border-slate-200/80 dark:border-slate-700/80 group relative overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row gap-6 relative z-10">
                                {/* Company Logo / Initials */}
                                <div className="flex-shrink-0">
                                    <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-100 dark:bg-slate-700/80 rounded-xl flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-600 shadow-sm group-hover:scale-105 transition-transform duration-300">
                                        {exp.initials ? (
                                            <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-extrabold text-xl md:text-2xl tracking-wider select-none">
                                                {exp.initials}
                                            </div>
                                        ) : (
                                            <div className="relative w-full h-full">
                                                <Image
                                                    src={exp.logo}
                                                    alt={exp.company}
                                                    fill
                                                    sizes="80px"
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Experience Detail */}
                                <div className="flex-grow">
                                    <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2">
                                        <div>
                                            <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-sky-400 transition-colors">
                                                {exp.title}
                                            </h3>
                                            <div className="text-base md:text-lg font-medium text-slate-700 dark:text-slate-300">
                                                {exp.company}
                                                {exp.type && (
                                                    <>
                                                        <span className="mx-2 text-slate-400">•</span>
                                                        <span className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-normal">{exp.type}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1 md:mt-0 font-medium whitespace-nowrap bg-slate-100 dark:bg-slate-700/80 px-3 py-1 rounded-lg inline-block md:block w-fit">
                                            {exp.date} {getExperienceDuration(exp.date, exp.duration) ? `· ${getExperienceDuration(exp.date, exp.duration)}` : ''}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-sm text-slate-600 dark:text-slate-400 mb-4">
                                        <span className="flex items-center gap-1.5">
                                            <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {exp.location}
                                        </span>
                                        <span className="inline-flex items-center bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wide">
                                            {exp.locationType}
                                        </span>
                                    </div>

                                    {exp.description && (
                                        <p className="text-slate-600 dark:text-slate-300 mb-4 text-sm md:text-base leading-relaxed">
                                            {exp.description}
                                        </p>
                                    )}

                                    {exp.skills && (
                                        <div className="flex items-start gap-2 mb-4">
                                            <svg className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                            </svg>
                                            <div className="flex flex-wrap gap-1.5">
                                                {exp.skills.map((skill, i) => (
                                                    <span key={i} className="text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700/60 border border-slate-200/60 dark:border-slate-600/60 px-2.5 py-1 rounded-md">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {exp.media && (
                                        <div className="mt-4 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden w-full max-w-xs hover:shadow-md transition-shadow">
                                            <div className="relative h-36 w-full bg-slate-100 dark:bg-slate-900">
                                                <Image
                                                    src={exp.media}
                                                    alt={`Dokumentasi ${exp.title}`}
                                                    fill
                                                    sizes="(max-width: 768px) 100vw, 320px"
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/80 text-xs text-slate-600 dark:text-slate-400 font-medium truncate">
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
