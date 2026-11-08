"use client";
import { useSmoothScroll } from '@/providers/SmoothScrollProvider';

// Real href keeps the link usable without JS and for "open in new tab"; the click handler adds the smooth scroll.
export default function ScrollLink({ id, onNavigate, children, ...props }) {
  const { scrollToId } = useSmoothScroll();
  return (
    <a
      href={`#${id}`}
      onClick={(e) => {
        e.preventDefault();
        scrollToId(id);
        onNavigate?.();
      }}
      {...props}
    >
      {children}
    </a>
  );
}
