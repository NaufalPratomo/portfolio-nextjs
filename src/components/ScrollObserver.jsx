"use client";
import { useEffect } from 'react';

export default function ScrollObserver() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll('section'));
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
          } else {
            entry.target.classList.remove('in-view');
          }
        });
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.35, // section considered visible when ~35% is in viewport
      }
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return null;
}
