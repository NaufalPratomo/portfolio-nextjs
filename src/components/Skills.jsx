"use client";

import { useEffect, useState } from 'react';
import Reveal from './Reveal';

// Soft skills (time management, critical thinking) were dropped: they are claims, not evidence.
const skillCategories = [
  {
    title: 'Backend & Sistem',
    description: 'Arsitektur server, API, dan integrasi protokol',
    skills: ['Laravel', 'PHP', 'Node.js', 'Next.js API', 'RESTful API', 'MQTT Protocol', 'Microservices Basics'],
  },
  {
    title: 'Frontend & UI Engineering',
    description: 'Antarmuka responsif, performa, dan state management',
    skills: ['React', 'Next.js', 'JavaScript (ES6+)', 'Tailwind CSS', 'Framer Motion', 'HTML5 & CSS3', 'Responsive Layout'],
  },
  {
    title: 'Basis Data & Alat Pengembangan',
    description: 'Manajemen data, version control, dan tools',
    skills: ['MySQL', 'MongoDB', 'Git / GitHub', 'Postman', 'Cloudinary', 'VS Code', 'Linux CLI'],
  },
];

export default function Skills() {
  const [categories, setCategories] = useState(skillCategories);

  useEffect(() => {
    fetch('/api/skills')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data && Array.isArray(data.data.categories) && data.data.categories.length > 0) {
          setCategories(data.data.categories);
        }
      })
      .catch(() => {
        // The bundled list is already on screen.
      });
  }, []);

  return (
    <section
      id="skills"
      className="border-t border-slate-200 bg-slate-100 px-5 py-20 sm:px-8 md:py-28 dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="section-title">Keahlian</h2>
          <p className="mt-4 max-w-xl text-lg text-slate-700 dark:text-slate-300">
            Teknologi yang saya pakai untuk merancang, membangun, dan memelihara aplikasi.
          </p>
        </Reveal>

        <dl className="mt-10 md:mt-14">
          {categories.map((category) => (
            <Reveal key={category.title}>
              <div className="grid gap-2 border-t border-slate-300 py-6 md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] md:gap-10 dark:border-slate-700">
                <dt>
                  <span className="font-display text-xl text-slate-900 dark:text-slate-50">{category.title}</span>
                  <span className="mt-1 block text-sm text-slate-600 dark:text-slate-400">{category.description}</span>
                </dt>
                <dd className="text-lg leading-relaxed text-slate-800 dark:text-slate-200">
                  {category.skills.map((s) => (typeof s === 'string' ? s : s.name)).join(', ')}
                </dd>
              </div>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
