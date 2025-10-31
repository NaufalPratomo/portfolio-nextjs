'use client';

import { ReactLenis } from '@studio-freight/react-lenis';

export const SmoothScrollProvider = ({ children }) => {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        wheelMultiplier: 1,
        gestureOrientation: "vertical",
        orientation: "vertical",
        smoothWheel: true,
        smoothTouch: false,
        touchInertiaMultiplier: 35,
        infinite: false
      }}
    >
      {children}
    </ReactLenis>
  );
};