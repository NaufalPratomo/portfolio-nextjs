"use client";
import React, { useRef, useState, useEffect } from 'react';

export default function OverlapSection({ children, className, zIndex, style }) {
  const containerRef = useRef(null);
  const [stickyTop, setStickyTop] = useState('0px');

  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      const height = containerRef.current.offsetHeight;
      const viewportHeight = window.innerHeight;
      if (height > viewportHeight) {
        setStickyTop(`${viewportHeight - height}px`);
      } else {
        setStickyTop('0px');
      }
    };

    // Debounced version to avoid layout thrashing from rapid resize events
    let resizeTimer;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 150);
    };

    handleResize(); // Initial measurement (synchronous)
    window.addEventListener('resize', debouncedResize);
    
    const observer = new ResizeObserver(debouncedResize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', debouncedResize);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`overlap-section ${className || ''}`}
      style={{
        zIndex,
        position: 'sticky',
        top: stickyTop,
        ...style
      }}
    >
      {children}
    </div>
  );
}
