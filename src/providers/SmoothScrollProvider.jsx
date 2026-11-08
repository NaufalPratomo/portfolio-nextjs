"use client";

import { createContext, useContext, useEffect, useMemo, useRef } from 'react';

const ScrollContext = createContext({ scrollToId: () => {} });
export const useSmoothScroll = () => useContext(ScrollContext);

// Matches the fixed navbar height so headings are not tucked under it.
const NAV_OFFSET = 72;

export const SmoothScrollProvider = ({ children }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    let rafId;
    let destroyed = false;

    import('lenis').then(({ default: Lenis }) => {
      if (destroyed) return;
      lenisRef.current = new Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });
      const loop = (time) => {
        lenisRef.current?.raf(time);
        rafId = requestAnimationFrame(loop);
      };
      rafId = requestAnimationFrame(loop);
    });

    return () => {
      destroyed = true;
      if (rafId) cancelAnimationFrame(rafId);
      lenisRef.current?.destroy();
      lenisRef.current = null;
    };
  }, []);

  const api = useMemo(
    () => ({
      scrollToId: (id) => {
        const el = document.getElementById(id);
        if (!el) return;
        if (lenisRef.current) {
          // Lenis already honors the scroll-padding-top set in globals.css, so no extra offset here.
          lenisRef.current.scrollTo(el);
        } else {
          const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
          window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
        }
        history.replaceState(null, '', `#${id}`);
      },
    }),
    []
  );

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>;
};
