import Reveal from './Reveal';

const FACTS = [
  { label: 'Pendidikan', value: 'D4 Teknik Informatika, Politeknik Negeri Malang' },
  { label: 'Fokus', value: 'Pengembangan web full-stack: Next.js, React, Node.js, Laravel' },
  {
    label: 'Pengalaman',
    value: 'Magang dan freelance di PT Indolakto, PT Utero Kreatif Indonesia, dan PT Palma Serasih Tbk',
  },
];

export default function About() {
  return (
    <section id="about" className="border-t border-slate-200 px-5 py-20 sm:px-8 md:py-28 dark:border-slate-800">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
        <Reveal>
          <h2 className="section-title">Tentang saya</h2>
        </Reveal>

        <Reveal delay={0.08}>
          <div className="max-w-2xl space-y-5 text-lg leading-relaxed text-slate-800 dark:text-slate-200">
            <p>
              Saya mengerjakan sistem untuk perkebunan sawit, analitik billboard, dan dashboard operasional
              perusahaan, dengan Next.js, React, Node.js, dan Laravel.
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              Saya terbiasa menangani integrasi database, optimasi query, komunikasi realtime (MQTT dan REST
              API), serta antarmuka yang responsif.
            </p>
          </div>

          <dl className="mt-10 max-w-2xl border-t border-slate-200 dark:border-slate-800">
            {FACTS.map((fact) => (
              <div
                key={fact.label}
                className="grid gap-1 border-b border-slate-200 py-4 sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6 dark:border-slate-800"
              >
                <dt className="meta pt-0.5">{fact.label}</dt>
                <dd className="text-slate-900 dark:text-slate-100">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
