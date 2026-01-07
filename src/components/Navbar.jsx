"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useScrollSnap } from '@/providers/SmoothScrollProvider';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const { scrollToId } = useScrollSnap();

  const navLinks = [
    { href: '#home', label: 'home' },
    { href: '#about', label: 'about' },
    { href: '#experience', label: 'experience' },
    { href: '#skills', label: 'skills' },
    { href: '#achievements', label: 'lomba' },
    { href: '#projects', label: 'projects' },
    { href: '#contact', label: 'contact' },
  ];

  useEffect(() => {
    try {
      const saved = localStorage.getItem('theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial = saved || (prefersDark ? 'dark' : 'light');
      setTheme(initial);
      if (initial === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
    } catch (e) {
      // ignore
    }
  }, []);

  const handleNavLinkClick = (e, href) => {
    e.preventDefault();
    const id = href.substring(1); // Remove the '#' character
    scrollToId(id);
    setMobileMenuOpen(false); // Close mobile menu after clicking a link
  };

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg z-50 border-b border-slate-200 dark:bg-slate-900/80 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-700">
            Naufal Pratomo
          </Link>

          {/* Desktop Menu + Theme Toggle */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavLinkClick(e, link.href)}
                  className="text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors capitalize"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Theme toggle button */}
            <button
              onClick={() => {
                const next = theme === 'dark' ? 'light' : 'dark';
                setTheme(next);
                try {
                  localStorage.setItem('theme', next);
                } catch (e) { }
                if (next === 'dark') document.documentElement.classList.add('dark');
                else document.documentElement.classList.remove('dark');
              }}
              aria-label="Toggle theme"
              title="Toggle theme"
              className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/40 transition-colors"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="4" />
                  <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-slate-600 dark:text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-800 dark:text-slate-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 bg-white dark:bg-slate-900 absolute left-0 right-0 px-4 border-b border-slate-200 dark:border-slate-800 shadow-lg">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavLinkClick(e, link.href)}
                className="block px-4 py-2 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-sky-100/50 dark:hover:bg-slate-800 rounded capitalize"
              >
                {link.label}
              </a>
            ))}

            {/* Mobile theme toggle */}
            <div className="px-4 mt-4 border-t border-slate-100 dark:border-slate-800 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300 font-medium">Appearance</span>
                <button
                  onClick={() => {
                    const next = theme === 'dark' ? 'light' : 'dark';
                    setTheme(next);
                    try {
                      localStorage.setItem('theme', next);
                    } catch (e) { }
                    if (next === 'dark') document.documentElement.classList.add('dark');
                    else document.documentElement.classList.remove('dark');
                  }}
                  className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-yellow-300 transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'dark' ? (
                    <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="4" />
                      <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
