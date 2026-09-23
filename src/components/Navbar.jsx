"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useScrollSnap } from '@/providers/SmoothScrollProvider';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const [visible, setVisible] = useState(true);
  const [activeSection, setActiveSection] = useState('home');
  const lastScrollY = useRef(0);
  const { scrollToId } = useScrollSnap();

  const navLinks = [
    { href: '#home', label: 'home' },
    { href: '#about', label: 'about' },
    { href: '#experience', label: 'experience' },
    { href: '#skills', label: 'skills' },
    { href: '#achievements', label: 'lomba' },
    { href: '#copyright', label: 'hak cipta' },
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
      // Ignore storage access errors in private/sandboxed contexts
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY.current && currentScrollY > 120) {
        setVisible(false);
      } else {
        setVisible(true);
      }
      lastScrollY.current = currentScrollY;

      const wrappers = Array.from(document.querySelectorAll('.overlap-section'));
      let cumulative = 0;
      let activeSectionId = 'home';

      for (let i = 0; i < wrappers.length; i++) {
        const section = wrappers[i].querySelector('section[id]');
        if (section && currentScrollY >= cumulative) {
          activeSectionId = section.id;
        }
        cumulative += wrappers[i].offsetHeight;
      }

      setActiveSection(activeSectionId);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavLinkClick = (e, href) => {
    e.preventDefault();
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.location.href = `/${href}`;
      return;
    }
    const id = href.substring(1);
    setActiveSection(id);
    scrollToId(id);
    setMobileMenuOpen(false);
  };

  return (
    <nav
      style={{
        transform: visible ? 'translateY(0)' : 'translateY(-100%)',
        transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-[100] border-b border-slate-200/60 dark:bg-slate-950/80 dark:border-slate-800/60 transition-colors duration-300 shadow-[0_2px_20px_-10px_rgba(0,0,0,0.05)]"
    >
      <div className="max-w-6xl mx-auto px-6 py-3.5">
        <div className="flex justify-between items-center">
          <Link
            href="/"
            className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-sky-600 dark:from-sky-400 dark:to-blue-400 focus-visible:rounded-md"
          >
            Naufal Pratomo
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex space-x-7 relative">
              {navLinks.map((link) => {
                const targetId = link.href.substring(1);
                const isActive = activeSection === targetId;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavLinkClick(e, link.href)}
                    className={`relative py-1.5 text-sm font-medium transition-colors capitalize focus-visible:rounded-md ${
                      isActive 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-500 rounded-full"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                );
              })}
            </div>

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
              className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800/60 transition-colors focus-visible:rounded-xl"
            >
              {theme === 'dark' ? (
                <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="4" />
                  <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-slate-700 dark:text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu Button (min 44x44px touch target) */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Tutup menu navigasi" : "Buka menu navigasi"}
            className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors focus-visible:rounded-xl"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="md:hidden mt-3 pb-4 space-y-1 bg-white dark:bg-slate-900 absolute left-0 right-0 px-6 border-b border-slate-200 dark:border-slate-800 shadow-xl rounded-b-2xl"
            >
              {navLinks.map((link) => {
                const targetId = link.href.substring(1);
                const isActive = activeSection === targetId;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={(e) => handleNavLinkClick(e, link.href)}
                    className={`block min-h-[44px] flex items-center px-4 py-2.5 text-sm font-medium rounded-xl transition-all capitalize focus-visible:rounded-xl ${
                      isActive 
                        ? 'text-blue-600 bg-sky-50 dark:text-blue-400 dark:bg-slate-800/70 font-semibold' 
                        : 'text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-sky-50/50 dark:hover:bg-slate-800/30'
                    }`}
                  >
                    {link.label}
                  </a>
                );
              })}

              <div className="px-4 mt-3 border-t border-slate-100 dark:border-slate-800 pt-3">
                <div className="flex items-center justify-between min-h-[44px]">
                  <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">Appearance</span>
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
                    className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-yellow-400 transition-colors focus-visible:rounded-xl"
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
