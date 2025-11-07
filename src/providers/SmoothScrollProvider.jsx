"use client";

import { createContext, useContext, useEffect, useRef } from 'react';
import Lenis from 'lenis';

const NAVBAR_HEIGHT = 64; // Approximate height of your fixed navbar in pixels

// SmoothScrollProvider with full-page snap scrolling (wheel/touch controlled)
// Usage: wrap your app with <SmoothScrollProvider snap="full" /> or <SmoothScrollProvider snap={true} />
export const ScrollSnapContext = createContext(null);

export const useScrollSnap = () => useContext(ScrollSnapContext);

export const SmoothScrollProvider = ({ children, snap = true }) => {
  const rafRef = useRef();
  const lenisRef = useRef();
  const isSnappingRef = useRef(false);
  const touchStartYRef = useRef(null);
  const cleanupRef = useRef(null);

  useEffect(() => {
    // Create Lenis instance
    lenisRef.current = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: true,
      touchMultiplier: 1,
      // lerp or wheelMultiplier can be tuned
    });

    // RAF loop for Lenis
    const loop = (time) => {
      if (lenisRef.current) lenisRef.current.raf(time);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    if (snap) {
      const getSections = () => Array.from(document.querySelectorAll('section[id]'));

      const getCurrentIndex = () => {
        const sections = getSections();
        const scroll = window.scrollY || window.pageYOffset || 0;
        let nearestIndex = 0;
        let nearestDiff = Infinity;
        sections.forEach((sec, idx) => {
          const top = sec.getBoundingClientRect().top + window.scrollY;
          const diff = Math.abs(top - scroll);
          if (diff < nearestDiff) {
            nearestDiff = diff;
            nearestIndex = idx;
          }
        });
        return nearestIndex;
      };

      const scrollToIndex = (index) => {
        const sections = getSections();
        if (!sections.length) return;
        const clamped = Math.max(0, Math.min(index, sections.length - 1));
        const target = sections[clamped];
        if (!target) return;
        isSnappingRef.current = true;
        try {
          lenisRef.current.scrollTo(target, { duration: 0.9, easing: (t) => t, offset: -NAVBAR_HEIGHT });
        } catch (e) {
          const top = target.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: top - NAVBAR_HEIGHT, behavior: 'smooth' });
        }
        // release lock after animation completes
        setTimeout(() => {
          isSnappingRef.current = false;
        }, 1000);
      };

      const scrollToId = (id) => {
        const sections = getSections();
        const idx = sections.findIndex((s) => s.id === id);
        if (idx !== -1) scrollToIndex(idx);
      };

      const next = () => scrollToIndex(getCurrentIndex() + 1);
      const prev = () => scrollToIndex(getCurrentIndex() - 1);

      let wheelTimeout = null;
      const onWheel = (e) => {
        const delta = e.deltaY;
        if (Math.abs(delta) < 5) return;
        if (isSnappingRef.current) {
          e.preventDefault();
          return;
        }
        const dir = delta > 0 ? 1 : -1;
        const current = getCurrentIndex();
        const targetIndex = current + dir;
        e.preventDefault();
        scrollToIndex(targetIndex);
        if (wheelTimeout) clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          wheelTimeout = null;
        }, 200);
      };

      const onTouchStart = (e) => {
        touchStartYRef.current = e.touches?.[0]?.clientY ?? null;
      };

      const onTouchEnd = (e) => {
        if (touchStartYRef.current == null) return;
        const endY = e.changedTouches?.[0]?.clientY ?? null;
        if (endY == null) return;
        const diff = touchStartYRef.current - endY;
        if (Math.abs(diff) < 30) return;
        const dir = diff > 0 ? 1 : -1;
        const current = getCurrentIndex();
        const targetIndex = current + dir;
        scrollToIndex(targetIndex);
      };

      window.addEventListener('wheel', onWheel, { passive: false });
      window.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('touchend', onTouchEnd, { passive: true });

      cleanupRef.current = () => {
        window.removeEventListener('wheel', onWheel);
        window.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('touchend', onTouchEnd);
      };

      // expose programmatic API via context value (set below)
      // We'll set the context value after effect runs by referencing functions via refs
      // (value will be created below using these closures)
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (lenisRef.current) lenisRef.current.destroy();
      if (cleanupRef.current) cleanupRef.current();
    };
  }, [snap]);

  // Programmatic API (kept stable across renders)
  const api = {
    scrollToId: (id) => {
      if (typeof window === 'undefined') return;
      const sections = Array.from(document.querySelectorAll('section[id]'));
      const idx = sections.findIndex((s) => s.id === id);
      if (idx !== -1) {
        try {
          lenisRef.current?.scrollTo(sections[idx], { duration: 0.9, easing: (t) => t, offset: -NAVBAR_HEIGHT });
        } catch (e) {
          const top = sections[idx].getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: top - NAVBAR_HEIGHT, behavior: 'smooth' });
        }
      }
    },
    next: () => {
      const sections = Array.from(document.querySelectorAll('section[id]'));
      const scroll = window.scrollY || window.pageYOffset || 0;
      let nearestIndex = 0;
      let nearestDiff = Infinity;
      sections.forEach((sec, idx) => {
        const top = sec.getBoundingClientRect().top + window.scrollY;
        const diff = Math.abs(top - scroll);
        if (diff < nearestDiff) {
          nearestDiff = diff;
          nearestIndex = idx;
        }
      });
      const target = Math.min(sections.length - 1, nearestIndex + 1);
      if (sections[target]) api.scrollToId(sections[target].id);
    },
    prev: () => {
      const sections = Array.from(document.querySelectorAll('section[id]'));
      const scroll = window.scrollY || window.pageYOffset || 0;
      let nearestIndex = 0;
      let nearestDiff = Infinity;
      sections.forEach((sec, idx) => {
        const top = sec.getBoundingClientRect().top + window.scrollY;
        const diff = Math.abs(top - scroll);
        if (diff < nearestDiff) {
          nearestDiff = diff;
          nearestIndex = idx;
        }
      });
      const target = Math.max(0, nearestIndex - 1);
      if (sections[target]) api.scrollToId(sections[target].id);
    },
    isSnapping: () => !!isSnappingRef.current,
  };

  return (
    <ScrollSnapContext.Provider value={api}>
      {children}
    </ScrollSnapContext.Provider>
  );
};