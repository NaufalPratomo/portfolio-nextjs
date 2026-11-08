"use client";
import { useId, useState } from 'react';

// Tailwind only generates classes it can see as whole strings, so the clamp classes are listed out.
const CLAMP = { 3: 'line-clamp-3', 4: 'line-clamp-4' };

export default function ClampText({ text, lines = 4, className = '' }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const long = text.length > lines * 95;

  return (
    <div>
      <p id={id} className={`${className} ${open || !long ? '' : CLAMP[lines]}`}>
        {text}
      </p>
      {long && (
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={id}
          className="mt-1 inline-flex min-h-[44px] items-center text-sm font-medium text-accent-700 underline underline-offset-4 hover:text-accent-800 dark:text-accent-400 dark:hover:text-accent-300"
        >
          {open ? 'Ringkas' : 'Baca selengkapnya'}
        </button>
      )}
    </div>
  );
}
