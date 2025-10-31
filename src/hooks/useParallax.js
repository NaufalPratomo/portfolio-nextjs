'use client';

import { useScroll, useTransform, useSpring, motion } from 'framer-motion';
import { useRef } from 'react';

export const useParallax = (options = {}) => {
  const {
    offset = [0, 1],
    speed = 1,
    springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 }
  } = options;
  
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: offset
  });

  const y = useSpring(
    useTransform(
      scrollYProgress,
      [0, 1],
      ['0%', `${speed * 100}%`]
    ),
    springConfig
  );

  return { ref, y };
};