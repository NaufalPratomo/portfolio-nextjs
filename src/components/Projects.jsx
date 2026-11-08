"use client";

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import Reveal from './Reveal';
import ClampText from './ClampText';
import ProjectLightbox from './ProjectLightbox';
import { sortProjectsByEndDate } from '@/lib/dateUtils';
import { initialRealProjects, initialPrivateProjects } from '@/data/projects';

const FEATURED_COUNT = 3;

// Titles are stored as "Name - (Client)"; the client reads better as a second line.
function splitTitle(title) {
  const match = title.match(/^(.*?)\s*(?:-\s*)?\(([^()]+)\)\s*$/);
  return match ? { name: match[1].trim(), client: match[2].trim() } : { name: title, client: null };
}

// Every project shows its screenshot: the design is the main thing a visitor comes to judge.
function Thumb({ project, name, sizes, onPreview, className = '' }) {
  if (!project.image) return null;
  return (
    <button
      type="button"
      onClick={(e) => onPreview({ src: project.image, alt: `Cuplikan ${name}`, trigger: e.currentTarget })}
      aria-label={`Perbesar cuplikan ${name}`}
      className={`relative block aspect-[16/10] w-full cursor-zoom-in overflow-hidden rounded-md border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-900 ${className}`}
    >
      <Image src={project.image} alt="" fill sizes={sizes} className="object-cover object-top" />
    </button>
  );
}

function Links({ project, name }) {
  if (!project.link) return null;
  return (
    <a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex min-h-[44px] items-center font-medium text-accent-700 underline underline-offset-4 hover:text-accent-800 dark:text-accent-400 dark:hover:text-accent-300"
    >
      Buka {name}
      <span className="sr-only"> (tab baru)</span>
    </a>
  );
}

function Featured({ project, flip, onPreview }) {
  const { name, client } = splitTitle(project.title);

  return (
    <Reveal>
      <article className="grid items-start gap-6 border-t border-slate-200 py-10 md:py-14 lg:grid-cols-2 lg:gap-14 dark:border-slate-800">
        <Thumb
          project={project}
          name={name}
          sizes="(min-width: 1024px) 560px, 100vw"
          onPreview={onPreview}
          className={flip ? 'lg:order-2' : ''}
        />

        <div>
          <p className="meta">{project.period}</p>
          <h4 className="mt-2 font-display text-2xl leading-tight text-slate-900 md:text-3xl dark:text-slate-50">
            {name}
          </h4>
          {client && <p className="mt-1 text-slate-600 dark:text-slate-400">{client}</p>}

          <ClampText
            text={project.description}
            lines={4}
            className="mt-5 leading-relaxed text-slate-700 dark:text-slate-300"
          />

          <p className="meta mt-4">{project.tags.join(' / ')}</p>
          <div className="mt-2">
            <Links project={project} name={name} />
          </div>
        </div>
      </article>
    </Reveal>
  );
}

function ProjectItem({ project, onPreview }) {
  const { name, client } = splitTitle(project.title);

  return (
    <li className="grid gap-4 border-t border-slate-200 py-6 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-6 dark:border-slate-800">
      <Thumb project={project} name={name} sizes="(min-width: 1024px) 220px, (min-width: 640px) 30vw, 100vw" onPreview={onPreview} />

      <div>
        <p className="meta">{project.period}</p>
        <h4 className="mt-1 text-lg font-semibold leading-snug text-slate-900 dark:text-slate-50">{name}</h4>
        {client && <p className="text-sm text-slate-600 dark:text-slate-400">{client}</p>}

        <ClampText
          text={project.description}
          lines={3}
          className="mt-2 text-sm leading-relaxed text-slate-700 dark:text-slate-300"
        />

        <p className="meta mt-2">{project.tags.slice(0, 6).join(' / ')}</p>
        <Links project={project} name={name} />
      </div>
    </li>
  );
}

function ProjectList({ title, projects, onPreview }) {
  if (!projects.length) return null;
  return (
    <Reveal className="mt-14 md:mt-20">
      <h3 className="font-display text-2xl text-slate-900 dark:text-slate-50">{title}</h3>
      <ul className="mt-6 grid lg:grid-cols-2 lg:gap-x-12">
        {projects.map((project) => (
          <ProjectItem key={project.title} project={project} onPreview={onPreview} />
        ))}
      </ul>
    </Reveal>
  );
}

export default function Projects() {
  const [real, setReal] = useState(initialRealProjects);
  const [priv, setPriv] = useState(initialPrivateProjects);
  const [failed, setFailed] = useState(false);
  const [preview, setPreview] = useState(null);
  const closePreview = useCallback(() => setPreview(null), []);

  const load = useCallback(() => {
    setFailed(false);
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (!data.success || !Array.isArray(data.data)) throw new Error('Unexpected response');
        const client = data.data.filter((p) => p.category === 'client');
        const own = data.data.filter((p) => p.category === 'private');
        if (client.length > 0) setReal(sortProjectsByEndDate(client));
        if (own.length > 0) setPriv(sortProjectsByEndDate(own));
      })
      .catch(() => setFailed(true));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // The admin flags projects with `featured`. With nothing flagged, the newest industry projects lead.
  // A flagged project is shown large wherever its category is, so it is removed from both lists below.
  const flagged = [...real, ...priv].filter((p) => p.featured === true);
  const featured = flagged.length > 0 ? flagged : real.slice(0, FEATURED_COUNT);
  const otherIndustry = real.filter((p) => !featured.includes(p));
  const otherPrivate = priv.filter((p) => !featured.includes(p));

  return (
    <section id="projects" className="border-t border-slate-200 px-5 py-20 sm:px-8 md:py-28 dark:border-slate-800">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="section-title">Proyek</h2>
          <p className="mt-4 max-w-xl text-lg text-slate-700 dark:text-slate-300">
            Sistem yang saya bangun untuk perusahaan dan klien, ditambah aplikasi yang saya kerjakan sendiri.
            Klik cuplikan untuk melihat tampilannya lebih besar.
          </p>
        </Reveal>

        {failed && (
          <p role="status" className="mt-6 text-sm text-slate-700 dark:text-slate-300">
            Data terbaru gagal dimuat, jadi yang tampil adalah versi tersimpan.{' '}
            <button
              type="button"
              onClick={load}
              className="min-h-[44px] font-medium text-accent-700 underline underline-offset-4 dark:text-accent-400"
            >
              Muat ulang
            </button>
          </p>
        )}

        <div className="mt-10 md:mt-14">
          {featured.map((project, i) => (
            <Featured key={project.title} project={project} flip={i % 2 === 1} onPreview={setPreview} />
          ))}
        </div>

        <ProjectList title="Proyek industri" projects={otherIndustry} onPreview={setPreview} />
        <ProjectList title="Proyek mandiri" projects={otherPrivate} onPreview={setPreview} />
      </div>

      <ProjectLightbox preview={preview} onClose={closePreview} />
    </section>
  );
}
