import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface BgmPlayerProps {
  autoPlay?: boolean;
}

export const BgmPlayer: React.FC<BgmPlayerProps> = ({ autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Soothing classical romantic piano chord sequence (Debussy / Clair de Lune vibe)
  const notes = [
    // Fmaj7
    [349.23, 440.0, 523.25, 659.25],
    // Em7
    [329.63, 392.0, 493.88, 587.33],
    // Dm7
    [293.66, 349.23, 440.0, 523.25],
    // Cmaj7
    [261.63, 329.63, 392.0, 493.88],
    // Am7
    [220.0, 261.63, 329.63, 392.0],
    // Gsus4 / G
    [196.0, 293.66, 392.0, 493.88],
  ];

  let currentChordIndex = 0;

  const playChord = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const chord = notes[currentChordIndex % notes.length];
    currentChordIndex++;

    chord.forEach((freq, idx) => {
      setTimeout(() => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Soft sine wave for warm electric piano / celesta tone
        osc.type = idx === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const startTime = ctx.currentTime;
        const duration = 3.2;

        gain.gain.setValueAtTime(0.001, startTime);
        gain.gain.exponentialRampToValueAtTime(0.05 / (idx + 1), startTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
      }, idx * 140);
    });
  };

  const togglePlay = () => {
    if (isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.suspend();
      }
      setIsPlaying(false);
    } else {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      setIsPlaying(true);
      playChord();
      intervalRef.current = window.setInterval(playChord, 3800);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <button
      id="bgm-toggle-button"
      onClick={togglePlay}
      aria-label={isPlaying ? '배경음악 음소거' : '배경음악 재생'}
      className={`fixed top-4 right-4 z-40 flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-xs border text-xs tracking-wider ${
        isPlaying
          ? 'bg-white/90 border-[#D8D2C7] text-[#2C2A29]'
          : 'bg-white/70 border-white/60 text-[#78726A] hover:bg-white/90'
      }`}
    >
      {isPlaying ? (
        <>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A89885] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8C7A68]"></span>
          </span>
          <Volume2 className="w-3.5 h-3.5 text-[#6D5D4E]" />
          <span className="font-editorial-kr text-[11px] font-medium text-[#4A433B]">BGM 재생중</span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 text-[#8E877E]" />
          <span className="font-editorial-kr text-[11px] font-medium text-[#78726A]">BGM ON</span>
        </>
      )}
    </button>
  );
};
