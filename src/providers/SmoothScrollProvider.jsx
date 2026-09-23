"use client";

import { createContext, useContext, useEffect, useRef, useCallback } from 'react';

// Throttle helper: limits function execution frequency
function throttle(fn, delay) {
  let lastCall = 0;
  let cachedResult;
  return (...args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      cachedResult = fn(...args);
    }
    return cachedResult;
  };
}

export const ScrollSnapContext = createContext(null);
export const useScrollSnap = () => useContext(ScrollSnapContext);

export const SmoothScrollProvider = ({ children, snap = true }) => {
  const rafRef = useRef();
  const lenisRef = useRef();
  const isSnappingRef = useRef(false);
  const touchStartYRef = useRef(null);
  const cleanupRef = useRef(null);
  const sectionCacheRef = useRef([]);

  const buildSectionCache = useCallback(() => {
    const wrappers = Array.from(document.querySelectorAll('.overlap-section'));
    const cache = [];
    let cumulativeHeight = 0;

    wrappers.forEach((wrapper) => {
      const section = wrapper.querySelector('section[id]');
      const id = section ? section.id : null;
      cache.push({
        id,
        scrollTarget: cumulativeHeight,
        height: wrapper.offsetHeight,
      });
      cumulativeHeight += wrapper.offsetHeight;
    });

    sectionCacheRef.current = cache;
    return cache;
  }, []);

  const getScrollTarget = useCallback((id) => {
    const cache = buildSectionCache();
    const entry = cache.find((e) => e.id === id);
    return entry ? entry.scrollTarget : 0;
  }, [buildSectionCache]);

  const getCurrentIndex = useCallback(() => {
    const cache = buildSectionCache();
    const scroll = window.scrollY || 0;
    let bestIndex = 0;
    let bestDiff = Infinity;

    cache.forEach((entry, idx) => {
      const diff = Math.abs(entry.scrollTarget - scroll);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestIndex = idx;
      }
    });

    return bestIndex;
  }, [buildSectionCache]);

  // Use native scrollTo for reliable, exact positioning
  const doScrollTo = useCallback((targetScroll, smooth = true) => {
    const clampedTarget = Math.max(0, targetScroll);
    isSnappingRef.current = true;

    if (lenisRef.current) {
      try { lenisRef.current.stop(); } catch (e) { /* ignore */ }
    }

    window.scrollTo({
      top: clampedTarget,
      behavior: smooth ? 'smooth' : 'instant',
    });

    setTimeout(() => {
      if (lenisRef.current) {
        try { lenisRef.current.start(); } catch (e) { /* ignore */ }
      }
      isSnappingRef.current = false;
    }, smooth ? 900 : 100);
  }, []);

  useEffect(() => {
    import('lenis').then(({ default: Lenis }) => {
      lenisRef.current = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smooth: true,
        smoothTouch: false,
        touchMultiplier: 1.2,
      });
    });

    // RAF loop pauses when tab is hidden to conserve resources
    let isPageVisible = true;
    const loop = (time) => {
      if (isPageVisible && lenisRef.current) lenisRef.current.raf(time);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    // Pause/resume RAF when tab visibility changes
    const onVisibilityChange = () => {
      isPageVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Build initial cache after DOM is ready
    requestAnimationFrame(() => {
      buildSectionCache();
    });

    // Rebuild cache on resize
    const onResize = () => buildSectionCache();
    window.addEventListener('resize', onResize);

    if (snap) {
      const scrollToIndex = (index) => {
        const cache = buildSectionCache();
        if (!cache.length) return;
        const clamped = Math.max(0, Math.min(index, cache.length - 1));
        doScrollTo(cache[clamped].scrollTarget);
      };

      let wheelTimeout = null;
      const isEventInsideModal = (e) => {
        if (!e) return false;
        if (typeof document !== 'undefined') {
          if (document.body.style.overflow === 'hidden' || document.documentElement.classList.contains('modal-open')) {
            return true;
          }
        }
        const target = e.target;
        if (target && target.closest) {
          return !!target.closest('[data-lenis-prevent], [role="dialog"], .modal-scroll-lock, .modal-backdrop');
        }
        return false;
      };

      const onWheel = (e) => {
        if (isEventInsideModal(e)) return;

        const delta = e.deltaY;
        if (Math.abs(delta) < 5) return;
        if (isSnappingRef.current) {
          e.preventDefault();
          return;
        }
        e.preventDefault();
        const dir = delta > 0 ? 1 : -1;
        const current = getCurrentIndex();
        scrollToIndex(current + dir);
        if (wheelTimeout) clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          wheelTimeout = null;
        }, 200);
      };

      const onTouchStart = (e) => {
        if (isEventInsideModal(e)) {
          touchStartYRef.current = null;
          return;
        }
        touchStartYRef.current = e.touches?.[0]?.clientY ?? null;
      };

      const onTouchEnd = (e) => {
        if (touchStartYRef.current == null) return;
        if (isEventInsideModal(e)) return;
        const endY = e.changedTouches?.[0]?.clientY ?? null;
        if (endY == null) return;
        const diff = touchStartYRef.current - endY;
        if (Math.abs(diff) < 30) return;
        if (isSnappingRef.current) return;
        const dir = diff > 0 ? 1 : -1;
        const current = getCurrentIndex();
        scrollToIndex(current + dir);
      };

      window.addEventListener('wheel', onWheel, { passive: false });
      window.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('touchend', onTouchEnd, { passive: true });

      cleanupRef.current = () => {
        window.removeEventListener('wheel', onWheel);
        window.removeEventListener('touchstart', onTouchStart);
        window.removeEventListener('touchend', onTouchEnd);
        window.removeEventListener('resize', onResize);
      };
    } else {
      cleanupRef.current = () => {
        window.removeEventListener('resize', onResize);
      };
    }

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (lenisRef.current) lenisRef.current.destroy();
      if (cleanupRef.current) cleanupRef.current();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [snap, buildSectionCache, getCurrentIndex, doScrollTo]);

  // Public API
  const api = {
    scrollToId: (id) => {
      if (typeof window === 'undefined') return;
      const target = getScrollTarget(id);
      doScrollTo(target);
    },
    next: () => {
      const cache = buildSectionCache();
      const current = getCurrentIndex();
      const targetIdx = Math.min(cache.length - 1, current + 1);
      if (cache[targetIdx]) doScrollTo(cache[targetIdx].scrollTarget);
    },
    prev: () => {
      const cache = buildSectionCache();
      const current = getCurrentIndex();
      const targetIdx = Math.max(0, current - 1);
      if (cache[targetIdx]) doScrollTo(cache[targetIdx].scrollTarget);
    },
    isSnapping: () => !!isSnappingRef.current,
  };

  return (
    <ScrollSnapContext.Provider value={api}>
      {children}
    </ScrollSnapContext.Provider>
  );
};