import Image from 'next/image';
import Link from 'next/link';

export default function Projects() {
  const projects = [
    {
      title: 'TALENTI',
      period: 'May 2025 - Oct 2025',
      description: 'Sistem informasi berbasis web untuk manajemen dan pencatatan prestasi mahasiswa di Jurusan Teknologi Informasi. Memfasilitasi mahasiswa dan dosen dalam mendokumentasikan, memvalidasi, dan mempublikasikan pencapaian akademik maupun non-akademik.',
      image: '/Porto_Web/talenti.png',
      tags: ['Laravel', 'MySQL'],
      link: 'https://github.com/hikmahabdillah/sim-pencatatan-prestasi-jti',
    },
    {
      title: 'Dashboard Daily Cost Production Site',
      period: 'Jul 2025 - sekarang',
      description: 'Web dashboard interaktif untuk memonitor biaya produksi harian di PT Sari Aditya Loka (anak usaha PT Astra Agro Lestari yang bergerak di bidang sawit), salah satu perusahaan perkebunan kelapa sawit terbesar di Indonesia. Meningkatkan efisiensi operasional dan mendukung pengambilan keputusan strategis berbasis data.',
      image: '/Porto_Web/costsite.png',
      tags: ['PHP', 'MySQL'],
      link: 'https://dasboardcost.com/',
    },
    {
      title: 'SIBETA',
      period: 'Dec 2024 - Jan 2025',
      description: 'Sistem Informasi Bebas Tanggungan TA untuk membantu pengelolaan data bebas tanggungan tugas akhir di Politeknik Negeri Malang.',
      image: '/Porto_Web/sibeta.png',
      tags: ['Laravel', 'MySQL'],
      link: 'https://github.com/NaufalPratomo/PBL',
    },
  ];

  return (
    <section id="projects" className="min-h-screen flex items-center px-4 py-20">
      <div className="max-w-6xl mx-auto w-full">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-12 text-center reveal" style={{ '--delay': '0.04s' }}>
          Proyek
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.title}
              className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-slate-200 hover:border-sky-400 transition-all hover:scale-105 shadow-lg reveal"
              style={{ '--delay': `${projects.indexOf(project) * 0.08}s` }}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-slate-900 reveal" style={{ '--delay': `${projects.indexOf(project) * 0.08 + 0.02}s` }}>{project.title}</h3>
                <Link
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sky-600 hover:text-blue-600 transition-colors"
                >
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </Link>
              </div>
              <div className="overflow-hidden rounded-xl mb-4 border border-slate-200">
                <Image
                  src={project.image}
                  alt={`Cuplikan ${project.title}`}
                  width={400}
                  height={176}
                  className="w-full h-44 object-cover reveal-img"
                  style={{ '--delay': `${projects.indexOf(project) * 0.08 + 0.04}s` }}
                />
              </div>
              <p className="text-sm text-sky-700 mb-4">{project.period}</p>
              <p className="text-slate-600 mb-4 text-sm leading-relaxed reveal" style={{ '--delay': `${projects.indexOf(project) * 0.08 + 0.06}s` }}>
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-sky-200/70 text-sky-800 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}