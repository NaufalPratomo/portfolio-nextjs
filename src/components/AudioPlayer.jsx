'use client';

import { useEffect, useRef, useState } from 'react';

export default function AudioPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3); // Volume default 30%

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      // Autoplay dengan volume rendah
      audioRef.current.play().catch(error => {
        console.log('Autoplay blocked:', error);
        // Jika autoplay diblokir, user perlu klik tombol play
      });
    }
  }, [volume]);

  const togglePlay = () => {
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
    const newVolume = e.target.value;
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
      >
        <source src="/audio/jazz-background.mp3" type="audio/mpeg" />
        Browser Anda tidak mendukung elemen audio.
      </audio>
      
      {/* Kontrol Audio - Desain Minimalis */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex items-center space-x-2">
          {/* Tombol Play/Pause */}
          <button
            onClick={togglePlay}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2 transition-all duration-200 hover:scale-110"
          >
            {isPlaying ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
              </svg>
            )}
          </button>
          
          {/* Volume Control Minimalis */}
          <div className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full px-2 py-1 transition-all duration-200">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-12 h-1 bg-white/40 rounded-lg appearance-none cursor-pointer slider-minimal"
            />
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .slider-minimal::-webkit-slider-thumb {
          appearance: none;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          box-shadow: 0 0 2px rgba(0,0,0,0.2);
        }
        
        .slider-minimal::-moz-range-thumb {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
          box-shadow: 0 0 2px rgba(0,0,0,0.2);
        }
      `}</style>
    </>
  );
}