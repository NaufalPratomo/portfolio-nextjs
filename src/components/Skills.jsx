export default function Skills() {
  const hardSkills = [
    { name: 'Laravel', level: 90 },
    { name: 'PHP', level: 85 },
    { name: 'JavaScript', level: 85 },
    { name: 'React JS', level: 85 },
    { name: 'SQL', level: 80 },
    { name: 'HTML & CSS', level: 90 },
    { name: 'Java', level: 75 },
    { name: 'Figma', level: 70 },
    { name: 'Microsoft Office', level: 85 },
  ];

  const softSkills = [
    'Leadership',
    'Teamwork',
    'Critical Thinking',
    'Analytical Thinking',
    'Communication',
    'Problem Solving',
    'Time Management',
  ];

  return (
    <section id="skills" className="min-h-screen flex items-center px-4 py-20">
      <div className="max-w-6xl mx-auto w-full">
        <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-12 text-center reveal" style={{ '--delay': '0.04s' }}>
          Keahlian
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Hard Skills */}
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 border border-slate-200 shadow-lg reveal" style={{ '--delay': '0.08s' }}>
            <h3 className="text-2xl font-bold text-blue-600 mb-6 reveal" style={{ '--delay': '0.12s' }}>Hard Skills</h3>
            <div className="space-y-4">
              {hardSkills.map((skill) => (
                <div key={skill.name} className="reveal" style={{ '--delay': `${hardSkills.indexOf(skill) * 0.06}s` }}>
                  <div className="flex justify-between mb-2">
                    <span className="text-slate-700">{skill.name}</span>
                    <span className="text-blue-600 font-medium">{skill.level}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-sky-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                      style={{ width: `${skill.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Soft Skills */}
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-8 border border-slate-200 shadow-lg reveal" style={{ '--delay': '0.18s' }}>
            <h3 className="text-2xl font-bold text-blue-600 mb-6 reveal" style={{ '--delay': '0.22s' }}>Soft Skills</h3>
            <div className="grid grid-cols-2 gap-4">
              {softSkills.map((skill) => (
                <div
                  key={skill}
                  className={`bg-sky-100/50 rounded-lg p-4 border border-sky-200 text-center hover:scale-105 transition-transform reveal ${
                    skill === 'Time Management' ? 'col-span-2' : ''
                  }`}
                  style={{ '--delay': `${softSkills.indexOf(skill) * 0.06}s` }}
                >
                  <span className="text-slate-700">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}