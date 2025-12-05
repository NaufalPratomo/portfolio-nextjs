'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [volume, setVolume] = useState(0.3);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      // Attempt autoplay with low volume
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Autoplay prevented by browser policy');
        });
      }
    }
  }, []); // Run once on mount

  const togglePlay = (e) => {
    e.stopPropagation();
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    e.stopPropagation();
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <>
      <audio
        ref={audioRef}
        loop
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        src="/audio/jazz-background.mp3"
      />

      <motion.div
        className="fixed bottom-6 right-6 z-50 pointer-events-auto"
        initial={false}
      >
        <motion.div
          className="flex items-center gap-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-2.5 rounded-full border border-white/20 dark:border-slate-700 shadow-2xl ring-1 ring-slate-900/5 dark:ring-white/10"
          animate={{
            width: isExpanded || isPlaying ? 'auto' : '48px',
            transition: { duration: 0.4, type: "spring", stiffness: 200, damping: 20 }
          }}
          onHoverStart={() => setIsExpanded(true)}
          onHoverEnd={() => setIsExpanded(false)}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {/* Animated Equalizer Icon */}
          <div className="relative flex items-center justify-center w-6 h-6 shrink-0 cursor-pointer" onClick={togglePlay}>
            {isPlaying ? (
              <div className="flex items-center gap-[2px] h-3">
                <motion.div
                  className="w-1 bg-sky-500 rounded-full"
                  animate={{ height: [4, 12, 6, 12, 4] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="w-1 bg-blue-600 rounded-full"
                  animate={{ height: [8, 4, 12, 5, 8] }}
                  transition={{ duration: 1.1, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                  className="w-1 bg-indigo-500 rounded-full"
                  animate={{ height: [5, 10, 5, 11, 5] }}
                  transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
                />
              </div>
            ) : (
              <svg className="w-5 h-5 text-slate-500 dark:text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
              </svg>
            )}
          </div>

          <AnimatePresence>
            {(isExpanded || isPlaying) && (
              <motion.div
                initial={{ opacity: 0, width: 0, scale: 0.95 }}
                animate={{ opacity: 1, width: 'auto', scale: 1 }}
                exit={{ opacity: 0, width: 0, scale: 0.95 }}
                className="flex items-center gap-3 overflow-hidden"
              >
                <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-700 mx-1" />

                {/* Volume Slider */}
                <div className="flex items-center gap-2 pr-2" onClick={(e) => e.stopPropagation()}>
                  <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-24 h-1 bg-slate-200 dark:bg-slate-700 rounded-full appearance-none cursor-pointer accent-sky-500 hover:accent-sky-400"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </>
  );
}