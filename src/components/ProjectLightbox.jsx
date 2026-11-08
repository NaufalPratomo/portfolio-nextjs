"use client";
import Image from 'next/image';
import { useEffect, useRef } from 'react';

// Only one focusable control lives inside, so Tab is pinned to it instead of leaking to the page behind.
export default function ProjectLightbox({ preview, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!preview) return;
    const trigger = preview.trigger;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'Tab') {
        e.preventDefault();
        closeRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
      trigger?.focus?.();
    };
  }, [preview, onClose]);

  if (!preview) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={preview.alt}
      data-lenis-prevent
      onClick={onClose}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-slate-950/90 p-4 sm:p-8"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 inline-flex min-h-[44px] items-center rounded-md bg-slate-50 px-4 text-sm font-medium text-slate-900 hover:bg-white"
      >
        Tutup
      </button>
      <div className="relative h-full w-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
        <Image src={preview.src} alt={preview.alt} fill sizes="100vw" className="object-contain" />
      </div>
    </div>
  );
}
