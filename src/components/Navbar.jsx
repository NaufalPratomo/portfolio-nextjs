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
    { href: '#skills', label: 'skills' },
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
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg z-50 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-700">
            Naufal Pratomo
          </h1>

          {/* Desktop Menu + Theme Toggle */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavLinkClick(e, link.href)}
                  className="text-slate-600 hover:text-blue-600 transition-colors capitalize"
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
                } catch (e) {}
                if (next === 'dark') document.documentElement.classList.add('dark');
                else document.documentElement.classList.remove('dark');
              }}
              aria-label="Toggle theme"
              title="Toggle theme"
              className="p-2 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-700/40 transition-colors"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 text-yellow-300" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.79 1.8 1.8-1.8zM1 13h3v-2H1v2zm10 8h2v-3h-2v3zm7.03-2.03l1.79 1.8 1.79-1.79-1.79-1.8-1.79 1.79zM20 13v-2h3v2h-3zM6.76 19.16l1.79 1.8 1.79-1.79-1.79-1.8-1.79 1.79zM12 6a6 6 0 100 12A6 6 0 0012 6z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-slate-800"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavLinkClick(e, link.href)}
                className="block px-4 py-2 text-slate-600 hover:text-blue-600 hover:bg-sky-100/50 rounded capitalize"
              >
                {link.label}
              </a>
            ))}

            {/* Mobile theme toggle */}
            <div className="px-4">
              <button
                onClick={() => {
                  const next = theme === 'dark' ? 'light' : 'dark';
                  setTheme(next);
                  try {
                    localStorage.setItem('theme', next);
                  } catch (e) {}
                  if (next === 'dark') document.documentElement.classList.add('dark');
                  else document.documentElement.classList.remove('dark');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded hover:bg-slate-200/50 dark:hover:bg-slate-700/40 transition-colors"
              >
                {theme === 'dark' ? 'Light mode' : 'Dark mode'}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}