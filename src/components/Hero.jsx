import Image from 'next/image';
import ScrollLink from './ScrollLink';

export default function Hero() {
  return (
    <section id="home" className="px-5 pb-16 pt-28 sm:px-8 md:pb-24 md:pt-36">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:gap-20">
        <div>
          <h1 className="rise text-[2.75rem] leading-[1.02] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl dark:text-slate-50">
            Muhammad Naufal Pratomo
          </h1>

          <p
            className="rise mt-6 max-w-xl text-lg leading-relaxed text-slate-700 md:text-xl dark:text-slate-300"
            style={{ '--d': '120ms' }}
          >
            Mahasiswa D4 Teknik Informatika di Politeknik Negeri Malang. Saya membangun aplikasi web full-stack
            dengan Next.js, React, Node.js, dan Laravel, dari antarmuka sampai API dan database.
          </p>

          <div className="rise mt-9 flex flex-wrap items-center gap-x-8 gap-y-3" style={{ '--d': '220ms' }}>
            <ScrollLink
              id="projects"
              className="inline-flex min-h-[48px] items-center rounded-md bg-accent-600 px-6 text-base font-semibold text-white hover:bg-accent-700 dark:bg-accent-400 dark:text-slate-950 dark:hover:bg-accent-300"
            >
              Lihat proyek
            </ScrollLink>
            <ScrollLink
              id="contact"
              className="inline-flex min-h-[48px] items-center text-base font-medium text-slate-900 underline underline-offset-4 decoration-slate-400 hover:decoration-accent-600 dark:text-slate-50 dark:hover:decoration-accent-400"
            >
              Hubungi saya
            </ScrollLink>
          </div>
        </div>

        <div
          className="rise relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-md border border-slate-200 bg-slate-100 lg:mx-0 lg:ml-auto lg:max-w-none dark:border-slate-800 dark:bg-slate-900"
          style={{ '--d': '180ms' }}
        >
          <Image
            src="/images/profile.jpg"
            alt="Muhammad Naufal Pratomo"
            fill
            priority
            sizes="(min-width: 1024px) 440px, (min-width: 640px) 384px, 100vw"
            className="object-cover object-[50%_60%]"
          />
        </div>
      </div>
    </section>
  );
}
