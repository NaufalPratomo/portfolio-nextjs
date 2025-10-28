export default function About() {
  const stats = [
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      ),
      title: 'Pendidikan',
      subtitle: 'D4 Teknik Informatika',
      highlight: 'IPK: 3.76/4.00',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      ),
      title: 'Spesialisasi',
      highlight: 'Web Development',
    },
    {
      icon: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      ),
      title: 'Pengalaman',
      subtitle: '3+ Proyek',
      highlight: 'Kolaborasi Tim',
    },
  ];

  return (
    <section id="about" className="min-h-screen flex items-center px-4 py-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-8 text-center reveal" style={{ '--delay': '0.04s' }}>
          Tentang Saya
        </h2>
        <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 border border-slate-200 shadow-lg reveal" style={{ '--delay': '0.08s' }}>
          <p className="text-slate-700 text-lg leading-relaxed mb-6 reveal" style={{ '--delay': '0.12s' }}>
            Saya adalah mahasiswa semester 5 Program Studi D4 Teknik Informatika di Politeknik Negeri Malang. 
            Memiliki ketertarikan kuat pada Web Development dan kemampuan dalam mengembangkan aplikasi full stack.
          </p>
          <p className="text-slate-700 text-lg leading-relaxed mb-6 reveal" style={{ '--delay': '0.16s' }}>
            Mahir berbahasa Inggris dengan pengalaman dalam proyek kolaborasi. Kemampuan komunikasi, 
            pemecahan masalah, dan kolaborasi tim yang baik menjadi kekuatan dalam beradaptasi dengan 
            lingkungan kerja yang dinamis.
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-sky-100/50 rounded-xl border border-sky-200 reveal" style={{ '--delay': `${index * 0.08}s` }}>
                <svg className="mx-auto mb-3 text-sky-600" width="40" height="40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {stat.icon}
                </svg>
                <h3 className="text-slate-800 font-semibold text-xl mb-2">{stat.title}</h3>
                {stat.subtitle && <p className="text-slate-600">{stat.subtitle}</p>}
                <p className="text-blue-600 font-medium">{stat.highlight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}