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

    handleResize();
    window.addEventListener('resize', handleResize);
    
    const observer = new ResizeObserver(handleResize);
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
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
