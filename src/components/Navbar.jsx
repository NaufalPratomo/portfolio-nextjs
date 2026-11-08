"use client";
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ScrollLink from './ScrollLink';

const NAV_LINKS = [
  { id: 'about', label: 'Tentang' },
  { id: 'projects', label: 'Proyek' },
  { id: 'experience', label: 'Pengalaman' },
  { id: 'skills', label: 'Keahlian' },
  { id: 'achievements', label: 'Lomba' },
  { id: 'copyright', label: 'Hak Cipta' },
  { id: 'contact', label: 'Kontak' },
];

function ThemeToggle({ className = '' }) {
  const [dark, setDark] = useState(false);

  // The desktop and mobile toggles are separate instances, so both follow the class on <html>.
  useEffect(() => {
    const sync = () => setDark(document.documentElement.classList.contains('dark'));
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const toggle = () => {
    const next = !dark;
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('theme', next ? 'dark' : 'light');
    } catch (e) {
      // Private mode: the choice just will not persist.
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Ganti ke mode terang' : 'Ganti ke mode gelap'}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-md text-slate-700 hover:bg-slate-200/60 dark:text-slate-200 dark:hover:bg-slate-800 ${className}`}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {dark ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </>
        ) : (
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        )}
      </svg>
    </button>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [active, setActive] = useState('');
  const lastY = useRef(0);
  const menuOpenRef = useRef(false);
  menuOpenRef.current = menuOpen;

  // Hide on scroll down to give reading room, show again on scroll up. Never hide while the menu is open.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(menuOpenRef.current || y < 120 || y < lastY.current);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // The active link is whichever section crosses a band near the upper third of the viewport.
  // The hero is observed too, so scrolling back to the top clears the highlight instead of keeping the last one.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id === 'home' ? '' : entry.target.id);
        });
      },
      { rootMargin: '-30% 0px -65% 0px' }
    );
    ['home', ...NAV_LINKS.map((link) => link.id)].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[60] border-b border-slate-200 bg-slate-50/95 transition-transform duration-300 dark:border-slate-800 dark:bg-slate-950/95 ${
        visible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <nav aria-label="Navigasi utama" className="mx-auto flex max-w-6xl items-center justify-between px-5 sm:px-8">
        <ScrollLink
          id="home"
          onNavigate={() => setMenuOpen(false)}
          className="inline-flex min-h-[56px] items-center font-display text-xl tracking-tight text-slate-900 dark:text-slate-50"
        >
          Naufal Pratomo
        </ScrollLink>

        <div className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <ScrollLink
              key={link.id}
              id={link.id}
              aria-current={active === link.id ? 'true' : undefined}
              className={`inline-flex min-h-[44px] items-center border-b-2 px-3 text-sm font-medium ${
                active === link.id
                  ? 'border-accent-600 text-slate-900 dark:border-accent-400 dark:text-slate-50'
                  : 'border-transparent text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-slate-50'
              }`}
            >
              {link.label}
            </ScrollLink>
          ))}
          <span aria-hidden="true" className="mx-3 h-5 w-px bg-slate-300 dark:bg-slate-700" />
          <ThemeToggle />
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="inline-flex min-h-[44px] items-center rounded-md px-3 text-sm font-medium text-slate-800 hover:bg-slate-200/60 dark:text-slate-100 dark:hover:bg-slate-800"
          >
            {menuOpen ? 'Tutup' : 'Menu'}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="border-t border-slate-200 bg-slate-50 px-5 pb-4 pt-2 sm:px-8 lg:hidden dark:border-slate-800 dark:bg-slate-950"
          >
            <ul>
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <ScrollLink
                    id={link.id}
                    onNavigate={() => setMenuOpen(false)}
                    aria-current={active === link.id ? 'true' : undefined}
                    className={`flex min-h-[48px] items-center border-b border-slate-200 text-base dark:border-slate-800 ${
                      active === link.id
                        ? 'font-semibold text-accent-700 dark:text-accent-400'
                        : 'text-slate-800 dark:text-slate-100'
                    }`}
                  >
                    {link.label}
                  </ScrollLink>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
