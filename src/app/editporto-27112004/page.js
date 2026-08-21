"use client";

import { useState, useEffect } from 'react';
import { getExperienceDuration, parseExperienceDateToForm, buildExperienceDateStr } from '@/lib/dateUtils';

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState('experience');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  // Datasets
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState({ hardSkills: [], softSkills: [] });
  const [achievements, setAchievements] = useState([]);

  // Modal / Form state for Experience
  const [expForm, setExpForm] = useState({
    _id: '',
    title: '',
    company: '',
    type: 'Internship',
    date: '',
    duration: '',
    location: '',
    locationType: 'On-site',
    description: '',
    logo: '',
    cloudinaryPublicId: '',
    skills: '',
  });

  const [expStartDate, setExpStartDate] = useState('');
  const [expEndDate, setExpEndDate] = useState('');
  const [expIsPresent, setExpIsPresent] = useState(false);

  const handleStartDateChange = (newStart) => {
    setExpStartDate(newStart);
    const newDate = buildExperienceDateStr(newStart, expEndDate, expIsPresent);
    const newDuration = getExperienceDuration(newDate);
    setExpForm((prev) => ({ ...prev, date: newDate, duration: newDuration }));
  };

  const handleEndDateChange = (newEnd) => {
    setExpEndDate(newEnd);
    const newDate = buildExperienceDateStr(expStartDate, newEnd, false);
    const newDuration = getExperienceDuration(newDate);
    setExpForm((prev) => ({ ...prev, date: newDate, duration: newDuration }));
  };

  const handlePresentChange = (checked) => {
    setExpIsPresent(checked);
    const newDate = buildExperienceDateStr(expStartDate, expEndDate, checked);
    const newDuration = getExperienceDuration(newDate);
    setExpForm((prev) => ({ ...prev, date: newDate, duration: newDuration }));
  };

  // Modal / Form state for Project
  const [projForm, setProjForm] = useState({
    _id: '',
    category: 'private',
    title: '',
    period: '',
    description: '',
    image: '',
    cloudinaryPublicId: '',
    tags: '',
    link: '',
    tryMe: false,
  });

  // Modal / Form state for Skill
  const [skillForm, setSkillForm] = useState({
    _id: '',
    type: 'hard',
    name: '',
    level: 70,
  });

  // Modal / Form state for Achievement
  const [achForm, setAchForm] = useState({
    _id: '',
    title: '',
    description: '',
    date: '',
    image: '',
    cloudinaryPublicId: '',
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/check');
      const data = await res.json();
      if (data.authenticated) {
        setIsAuthenticated(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
      } else {
        setAuthError(data.message || 'Password salah!');
      }
    } catch (err) {
      setAuthError('Terjadi kesalahan koneksi server');
    } finally {
      setLoading(false);
    }
  };

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [resExp, resProj, resSkill, resAch] = await Promise.all([
        fetch('/api/experiences').then((r) => r.json()),
        fetch('/api/projects').then((r) => r.json()),
        fetch('/api/skills').then((r) => r.json()),
        fetch('/api/achievements').then((r) => r.json()),
      ]);

      if (resExp.success) setExperiences(resExp.data);
      if (resProj.success) setProjects(resProj.data);
      if (resSkill.success) setSkills(resSkill.data);
      if (resAch.success) setAchievements(resAch.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e, setFormCallback) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setFormCallback((prev) => ({
          ...prev,
          image: data.url,
          logo: data.url,
          cloudinaryPublicId: data.public_id,
          oldCloudinaryPublicId: prev.cloudinaryPublicId || '',
        }));
        showMessage('Gambar berhasil diunggah ke Cloudinary!');
      } else {
        alert('Gagal mengunggah gambar: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Terjadi kesalahan saat unggah gambar');
    } finally {
      setUploading(false);
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 4000);
  };

  // Experience handlers
  const saveExperience = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...expForm,
      skills: typeof expForm.skills === 'string' ? expForm.skills.split(',').map((s) => s.trim()).filter(Boolean) : expForm.skills,
    };
    const { _id, ...cleanPayload } = payload;

    const method = editingId ? 'PUT' : 'POST';
    try {
      const res = await fetch('/api/experiences', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? payload : cleanPayload),
      });
      const data = await res.json();
      if (data.success) {
        showMessage(editingId ? 'Pengalaman diperbarui!' : 'Pengalaman ditambahkan!');
        setExpForm({
          _id: '',
          title: '',
          company: '',
          type: 'Internship',
          date: '',
          duration: '',
          location: '',
          locationType: 'On-site',
          description: '',
          logo: '',
          cloudinaryPublicId: '',
          skills: '',
        });
        setExpStartDate('');
        setExpEndDate('');
        setExpIsPresent(false);
        setEditingId(null);
        fetchAllData();
      }
    } catch (err) {
      alert('Gagal menyimpan pengalaman');
    } finally {
      setLoading(false);
    }
  };

  const deleteExperience = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengalaman ini? Media Cloudinary juga akan dihapus.')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/experiences?id=${id || ''}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showMessage('Pengalaman berhasil dihapus!');
        fetchAllData();
      }
    } catch (err) {
      alert('Gagal menghapus pengalaman');
    } finally {
      setLoading(false);
    }
  };

  // Project handlers
  const saveProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      ...projForm,
      tags: typeof projForm.tags === 'string' ? projForm.tags.split(',').map((t) => t.trim()).filter(Boolean) : projForm.tags,
    };
    const { _id, ...cleanPayload } = payload;

    const method = editingId ? 'PUT' : 'POST';
    try {
      const res = await fetch('/api/projects', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? payload : cleanPayload),
      });
      const data = await res.json();
      if (data.success) {
        showMessage(editingId ? 'Proyek diperbarui!' : 'Proyek ditambahkan!');
        setProjForm({
          _id: '',
          category: 'private',
          title: '',
          period: '',
          description: '',
          image: '',
          cloudinaryPublicId: '',
          tags: '',
          link: '',
          tryMe: false,
        });
        setEditingId(null);
        fetchAllData();
      }
    } catch (err) {
      alert('Gagal menyimpan proyek');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus proyek ini? Gambar Cloudinary juga akan terhapus.')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/projects?id=${id || ''}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showMessage('Proyek berhasil dihapus!');
        fetchAllData();
      }
    } catch (err) {
      alert('Gagal menghapus proyek');
    } finally {
      setLoading(false);
    }
  };

  // Skill handlers
  const saveSkill = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { _id, ...cleanPayload } = skillForm;
    const method = editingId ? 'PUT' : 'POST';
    try {
      const res = await fetch('/api/skills', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? skillForm : cleanPayload),
      });
      const data = await res.json();
      if (data.success) {
        showMessage(editingId ? 'Skill diperbarui!' : 'Skill ditambahkan!');
        setSkillForm({ _id: '', type: 'hard', name: '', level: 70 });
        setEditingId(null);
        fetchAllData();
      }
    } catch (err) {
      alert('Gagal menyimpan skill');
    } finally {
      setLoading(false);
    }
  };

  const deleteSkill = async (id) => {
    if (!confirm('Hapus skill ini?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/skills?id=${id || ''}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showMessage('Skill berhasil dihapus!');
        fetchAllData();
      }
    } catch (err) {
      alert('Gagal menghapus skill');
    } finally {
      setLoading(false);
    }
  };

  // Achievement handlers
  const saveAchievement = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { _id, ...cleanPayload } = achForm;
    const method = editingId ? 'PUT' : 'POST';
    try {
      const res = await fetch('/api/achievements', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingId ? achForm : cleanPayload),
      });
      const data = await res.json();
      if (data.success) {
        showMessage(editingId ? 'Prestasi diperbarui!' : 'Prestasi ditambahkan!');
        setAchForm({ _id: '', title: '', description: '', date: '', image: '', cloudinaryPublicId: '' });
        setEditingId(null);
        fetchAllData();
      }
    } catch (err) {
      alert('Gagal menyimpan prestasi');
    } finally {
      setLoading(false);
    }
  };


  const deleteAchievement = async (id) => {
    if (!confirm('Hapus prestasi/lomba ini? Gambar Cloudinary juga akan dihapus.')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/achievements?id=${id || ''}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showMessage('Prestasi berhasil dihapus!');
        fetchAllData();
      }
    } catch (err) {
      alert('Gagal menghapus prestasi');
    } finally {
      setLoading(false);
    }
  };


  // Render Login Modal if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl max-w-md w-full shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-sky-500/10 text-sky-400 mb-3">
              <svg width="32" height="32" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Dashboard Login</h1>
            <p className="text-sm text-slate-400 mt-1">Masukkan kata sandi admin untuk mengelola portofolio</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">Password Admin</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan PIN / Password"
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                required
              />
            </div>

            {authError && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm p-3 rounded-xl">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              {loading ? 'Verifikasi...' : 'Masuk Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Portfolio CMS Dashboard
            </h1>
            <p className="text-sm text-slate-400">Kelola data Experience, Projects, Skills, & Achievements (MongoDB + Cloudinary)</p>
          </div>

          <button
            onClick={() => {
              document.cookie = 'admin_session=; Max-Age=0; path=/;';
              setIsAuthenticated(false);
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold rounded-xl border border-slate-700 transition-all"
          >
            Logout
          </button>
        </div>

        {/* Success Alert Message */}
        {message && (
          <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 p-4 rounded-2xl text-sm font-medium flex items-center gap-2 animate-fade-in">
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <span>{message}</span>
          </div>
        )}

        {/* Tab Selector */}
        <div className="flex flex-wrap gap-2 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
          {[
            {
              id: 'experience',
              label: 'Experience',
              icon: (
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              ),
            },
            {
              id: 'projects',
              label: 'Projects',
              icon: (
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              ),
            },
            {
              id: 'skills',
              label: 'Skills',
              icon: (
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              ),
            },
            {
              id: 'achievements',
              label: 'Achievements',
              icon: (
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4m6 17v-5h-2v5m-4 0h8m-4-13a4 4 0 100-8 4 4 0 000 8z" />
                </svg>
              ),
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setEditingId(null);
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB 1: EXPERIENCE */}
        {activeTab === 'experience' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl space-y-4">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Experience' : 'Tambah Experience'}</h2>
              <form onSubmit={saveExperience} className="space-y-3">
                <input
                  type="text"
                  placeholder="Jabatan / Title (mis: Back End Developer)"
                  value={expForm.title}
                  onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-sky-500 outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Perusahaan / Company (mis: PT Indolakto)"
                  value={expForm.company}
                  onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:border-sky-500 outline-none"
                  required
                />
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={expForm.type}
                    onChange={(e) => setExpForm({ ...expForm, type: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:border-sky-500 outline-none"
                  >
                    <option value="Internship">Internship</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Self-employed">Self-employed</option>
                  </select>
                  <select
                    value={expForm.locationType}
                    onChange={(e) => setExpForm({ ...expForm, locationType: e.target.value })}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white focus:border-sky-500 outline-none"
                  >
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>

                {/* Date Picker Section */}
                <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-sky-400">Rentang Waktu / Periode</label>
                    <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg hover:border-sky-500/50 transition-colors select-none">
                      <input
                        type="checkbox"
                        checked={expIsPresent}
                        onChange={(e) => handlePresentChange(e.target.checked)}
                        className="rounded bg-slate-950 border-slate-700 text-sky-500 focus:ring-0 w-3.5 h-3.5 cursor-pointer"
                      />
                      <span>Masih Bekerja di Sini (Present)</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <span className="block text-[11px] font-medium text-slate-400 mb-1">Mulai</span>
                      <input
                        type="month"
                        value={expStartDate}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-sky-500 [color-scheme:dark]"
                        required
                      />
                    </div>

                    <div>
                      <span className="block text-[11px] font-medium text-slate-400 mb-1">Selesai</span>
                      {expIsPresent ? (
                        <div className="w-full bg-slate-900/50 border border-slate-800/80 rounded-xl px-3 py-2 text-xs text-sky-400 font-semibold flex items-center justify-between h-[34px]">
                          <span>Present (Sekarang)</span>
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
                          </span>
                        </div>
                      ) : (
                        <input
                          type="month"
                          value={expEndDate}
                          onChange={(e) => handleEndDateChange(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-sky-500 [color-scheme:dark]"
                          required={!expIsPresent}
                        />
                      )}
                    </div>
                  </div>

                  {/* Live Date and Dynamic Duration Preview */}
                  {expForm.date && (
                    <div className="flex items-center justify-between bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl text-xs">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <span className="text-slate-400 font-medium">Format:</span>
                        <span className="font-semibold text-white">{expForm.date}</span>
                      </div>
                      <div className="text-sky-400 font-semibold flex items-center gap-1">
                        <span>⏳</span>
                        <span>{getExperienceDuration(expForm.date, expForm.duration) || '1 mo'}</span>
                      </div>
                    </div>
                  )}
                </div>

                <input
                  type="text"
                  placeholder="Lokasi (mis: Pasuruan, Indonesia)"
                  value={expForm.location}
                  onChange={(e) => setExpForm({ ...expForm, location: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                />

                <textarea
                  placeholder="Deskripsi (optional)"
                  value={expForm.description || ''}
                  onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none h-20"
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Logo Perusahaan (Cloudinary Upload)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setExpForm)}
                    className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-sky-400 hover:file:bg-slate-700"
                  />
                  {expForm.logo && <img src={expForm.logo} alt="Preview" className="h-12 w-12 object-contain mt-2 rounded-lg border border-slate-800 bg-slate-950" />}
                </div>

                <input
                  type="text"
                  placeholder="Skills (pisahkan koma: React, Node.js)"
                  value={Array.isArray(expForm.skills) ? expForm.skills.join(', ') : expForm.skills}
                  onChange={(e) => setExpForm({ ...expForm, skills: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                />

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-md disabled:opacity-50"
                  >
                    {editingId ? 'Update' : 'Simpan'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setExpForm({
                          _id: '',
                          title: '',
                          company: '',
                          type: 'Internship',
                          date: '',
                          duration: '',
                          location: '',
                          locationType: 'On-site',
                          description: '',
                          logo: '',
                          cloudinaryPublicId: '',
                          skills: '',
                        });
                        setExpStartDate('');
                        setExpEndDate('');
                        setExpIsPresent(false);
                      }}
                      className="px-4 py-2.5 bg-slate-800 text-slate-300 text-sm font-semibold rounded-xl"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 space-y-3">
              <h2 className="text-xl font-bold text-white mb-4">Daftar Experience ({experiences.length})</h2>
              {experiences.map((exp) => (
                <div key={exp._id} className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {exp.logo ? (
                      <img src={exp.logo} alt={exp.company} className="h-10 w-10 object-contain rounded-lg border border-slate-800 bg-white/5 p-1" />
                    ) : (
                      <div className="h-10 w-10 bg-slate-800 rounded-lg flex items-center justify-center text-sky-400 font-bold">{exp.initials || 'XP'}</div>
                    )}
                    <div>
                      <h3 className="font-bold text-white text-base">{exp.title}</h3>
                      <p className="text-xs text-sky-400 font-medium">{exp.company} • <span className="text-slate-400">{exp.date} {getExperienceDuration(exp.date, exp.duration) ? `· ${getExperienceDuration(exp.date, exp.duration)}` : ''}</span></p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingId(exp._id);
                        setExpForm(exp);
                        const parsed = parseExperienceDateToForm(exp.date);
                        setExpStartDate(parsed.startMonth);
                        setExpEndDate(parsed.endMonth);
                        setExpIsPresent(parsed.isPresent);
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-semibold rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteExperience(exp._id)}
                      className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-semibold rounded-lg"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: PROJECTS */}
        {activeTab === 'projects' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl space-y-4">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Proyek' : 'Tambah Proyek'}</h2>
              <form onSubmit={saveProject} className="space-y-3">
                <select
                  value={projForm.category}
                  onChange={(e) => setProjForm({ ...projForm, category: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                >
                  <option value="client">Client Project (Professional)</option>
                  <option value="private">Private / Personal Project</option>
                </select>

                <input
                  type="text"
                  placeholder="Judul Proyek"
                  value={projForm.title}
                  onChange={(e) => setProjForm({ ...projForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  required
                />

                <input
                  type="text"
                  placeholder="Periode (mis: May 2026)"
                  value={projForm.period}
                  onChange={(e) => setProjForm({ ...projForm, period: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                />

                <textarea
                  placeholder="Deskripsi Proyek"
                  value={projForm.description}
                  onChange={(e) => setProjForm({ ...projForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none h-24"
                  required
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Gambar Proyek (Cloudinary Upload)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setProjForm)}
                    className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-sky-400"
                  />
                  {projForm.image && <img src={projForm.image} alt="Preview" className="h-20 w-full object-cover mt-2 rounded-xl border border-slate-800" />}
                </div>

                <input
                  type="text"
                  placeholder="Tags (pisahkan koma: Next.js, React, MongoDB)"
                  value={Array.isArray(projForm.tags) ? projForm.tags.join(', ') : projForm.tags}
                  onChange={(e) => setProjForm({ ...projForm, tags: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                />

                <input
                  type="url"
                  placeholder="Link Website (optional)"
                  value={projForm.link || ''}
                  onChange={(e) => setProjForm({ ...projForm, link: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                />

                <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={projForm.tryMe || false}
                    onChange={(e) => setProjForm({ ...projForm, tryMe: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-800 text-sky-500 focus:ring-0"
                  />
                  Tampilkan Badge "Try Me"
                </label>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-md disabled:opacity-50"
                  >
                    {editingId ? 'Update Proyek' : 'Simpan Proyek'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setProjForm({
                          _id: '',
                          category: 'private',
                          title: '',
                          period: '',
                          description: '',
                          image: '',
                          cloudinaryPublicId: '',
                          tags: '',
                          link: '',
                          tryMe: false,
                        });
                      }}
                      className="px-4 py-2.5 bg-slate-800 text-slate-300 text-sm font-semibold rounded-xl"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 space-y-3">
              <h2 className="text-xl font-bold text-white mb-4">Daftar Proyek ({projects.length})</h2>
              {projects.map((proj) => (
                <div key={proj._id} className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {proj.image && <img src={proj.image} alt={proj.title} className="h-12 w-16 object-cover rounded-lg border border-slate-800 bg-slate-950" />}
                    <div>
                      <h3 className="font-bold text-white text-sm line-clamp-1">{proj.title}</h3>
                      <p className="text-xs text-sky-400 font-semibold">{proj.category === 'client' ? 'Client Project' : 'Private Project'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingId(proj._id);
                        setProjForm(proj);
                      }}
                      className="px-3 py-1.5 bg-slate-800 text-sky-400 text-xs font-semibold rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProject(proj._id)}
                      className="px-3 py-1.5 bg-rose-500/10 text-rose-400 text-xs font-semibold rounded-lg"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: SKILLS */}
        {activeTab === 'skills' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl space-y-4">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Skill' : 'Tambah Skill'}</h2>
              <form onSubmit={saveSkill} className="space-y-3">
                <select
                  value={skillForm.type}
                  onChange={(e) => setSkillForm({ ...skillForm, type: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-sm text-white outline-none"
                >
                  <option value="hard">Hard Skill (dengan level %)</option>
                  <option value="soft">Soft Skill</option>
                </select>

                <input
                  type="text"
                  placeholder="Nama Skill (mis: Next.js)"
                  value={skillForm.name}
                  onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  required
                />

                {skillForm.type === 'hard' && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Level Kemahiran ({skillForm.level}%)</label>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={skillForm.level}
                      onChange={(e) => setSkillForm({ ...skillForm, level: Number(e.target.value) })}
                      className="w-full accent-sky-500 cursor-pointer"
                    />
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-md disabled:opacity-50"
                  >
                    {editingId ? 'Update Skill' : 'Simpan Skill'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setSkillForm({ _id: '', type: 'hard', name: '', level: 70 });
                      }}
                      className="px-4 py-2.5 bg-slate-800 text-slate-300 text-sm font-semibold rounded-xl"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-white">Daftar Hard Skills ({skills.hardSkills?.length || 0})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {skills.hardSkills?.map((s) => (
                  <div key={s._id} className="bg-slate-900/60 border border-slate-800 p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{s.name}</h4>
                      <p className="text-xs text-sky-400 font-semibold">{s.level}%</p>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => { setEditingId(s._id); setSkillForm(s); }} className="px-2 py-1 bg-slate-800 text-sky-400 text-xs rounded">Edit</button>
                      <button onClick={() => deleteSkill(s._id)} className="px-2 py-1 bg-rose-500/10 text-rose-400 text-xs rounded">Hapus</button>
                    </div>
                  </div>
                ))}
              </div>

              <h2 className="text-xl font-bold text-white pt-4">Daftar Soft Skills ({skills.softSkills?.length || 0})</h2>
              <div className="flex flex-wrap gap-2">
                {skills.softSkills?.map((s) => (
                  <div key={s._id} className="bg-slate-900/60 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2 text-sm text-slate-300">
                    <span>{s.name}</span>
                    <button onClick={() => deleteSkill(s._id)} className="text-rose-400 hover:text-rose-300 font-bold">×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ACHIEVEMENTS */}
        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form */}
            <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl space-y-4">
              <h2 className="text-xl font-bold text-white">{editingId ? 'Edit Prestasi' : 'Tambah Prestasi / Lomba'}</h2>
              <form onSubmit={saveAchievement} className="space-y-3">
                <input
                  type="text"
                  placeholder="Nama Lomba / Kompetisi"
                  value={achForm.title}
                  onChange={(e) => setAchForm({ ...achForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  required
                />

                <input
                  type="text"
                  placeholder="Tahun / Tanggal (mis: 2026)"
                  value={achForm.date}
                  onChange={(e) => setAchForm({ ...achForm, date: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  required
                />

                <textarea
                  placeholder="Deskripsi Singkat"
                  value={achForm.description}
                  onChange={(e) => setAchForm({ ...achForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white outline-none h-20"
                />

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Foto Sertifikat / Lomba (Cloudinary Upload)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, setAchForm)}
                    className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-sky-400"
                  />
                  {achForm.image && <img src={achForm.image} alt="Preview" className="h-20 w-full object-cover mt-2 rounded-xl border border-slate-800" />}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={loading || uploading}
                    className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm rounded-xl transition-all shadow-md disabled:opacity-50"
                  >
                    {editingId ? 'Update Prestasi' : 'Simpan Prestasi'}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingId(null);
                        setAchForm({ _id: '', title: '', description: '', date: '', image: '', cloudinaryPublicId: '' });
                      }}
                      className="px-4 py-2.5 bg-slate-800 text-slate-300 text-sm font-semibold rounded-xl"
                    >
                      Batal
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 space-y-3">
              <h2 className="text-xl font-bold text-white mb-4">Daftar Prestasi & Lomba ({achievements.length})</h2>
              {achievements.map((ach) => (
                <div key={ach._id} className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {ach.image && <img src={ach.image} alt={ach.title} className="h-12 w-16 object-cover rounded-lg border border-slate-800 bg-slate-950" />}
                    <div>
                      <h3 className="font-bold text-white text-sm">{ach.title}</h3>
                      <p className="text-xs text-sky-400">{ach.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingId(ach._id);
                        setAchForm(ach);
                      }}
                      className="px-3 py-1.5 bg-slate-800 text-sky-400 text-xs font-semibold rounded-lg"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteAchievement(ach._id)}
                      className="px-3 py-1.5 bg-rose-500/10 text-rose-400 text-xs font-semibold rounded-lg"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
