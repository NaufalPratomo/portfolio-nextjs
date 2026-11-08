"use client";
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Reveal from './Reveal';
import ClampText from './ClampText';
import { getExperienceDuration, sortExperiencesByDate } from '@/lib/dateUtils';
import { initialExperiences } from '@/data/experiences';

function Logo({ exp }) {
  return (
    <div className="relative h-11 w-11 flex-shrink-0 overflow-hidden rounded-md border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-800">
      {exp.initials ? (
        <span className="flex h-full w-full items-center justify-center font-mono text-xs font-medium text-slate-700 dark:text-slate-200">
          {exp.initials}
        </span>
      ) : (
        <Image src={exp.logo} alt="" fill sizes="44px" className="object-cover" />
      )}
    </div>
  );
}

export default function Experience() {
  const [experiences, setExperiences] = useState(() => sortExperiencesByDate(initialExperiences));

  useEffect(() => {
    fetch('/api/experiences')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data) && data.data.length > 0) {
          setExperiences(sortExperiencesByDate(data.data));
        }
      })
      .catch(() => {
        // The bundled list above is already on screen, so a failed refresh needs no message.
      });
  }, []);

  return (
    <section id="experience" className="border-t border-slate-200 px-5 py-20 sm:px-8 md:py-28 dark:border-slate-800">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <h2 className="section-title">Pengalaman kerja</h2>
        </Reveal>

        <ol className="mt-10 md:mt-14">
          {experiences.map((exp, i) => {
            const duration = getExperienceDuration(exp.date, exp.duration);
            return (
              <li key={`${exp.company}-${exp.date}-${i}`}>
                <Reveal>
                  <div className="grid gap-3 border-t border-slate-200 py-8 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-10 dark:border-slate-800">
                    <div className="meta">
                      <p>{exp.date}</p>
                      {duration && <p className="mt-1 text-slate-500">{duration}</p>}
                    </div>

                    <div className="max-w-3xl">
                      <div className="flex items-start gap-4">
                        <Logo exp={exp} />
                        <div>
                          <h3 className="text-xl font-semibold leading-snug text-slate-900 dark:text-slate-50">
                            {exp.title}
                          </h3>
                          <p className="text-slate-700 dark:text-slate-300">
                            {exp.company}
                            {exp.type && <span className="text-slate-500"> · {exp.type}</span>}
                          </p>
                          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                            {exp.location}
                            {exp.locationType && ` (${exp.locationType})`}
                          </p>
                        </div>
                      </div>

                      {exp.description && (
                        <ClampText
                          text={exp.description}
                          lines={3}
                          className="mt-4 leading-relaxed text-slate-700 dark:text-slate-300"
                        />
                      )}

                      {exp.skills && exp.skills.length > 0 && <p className="meta mt-3">{exp.skills.join(' / ')}</p>}
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
