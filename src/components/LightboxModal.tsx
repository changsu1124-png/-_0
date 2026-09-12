import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { GalleryItem } from '../types';

interface LightboxModalProps {
  items: GalleryItem[];
  currentIndex: number | null;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  items,
  currentIndex,
  onClose,
  onNext,
  onPrev,
}) => {
  if (currentIndex === null || !items[currentIndex]) return null;
  const currentItem = items[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNext();
      if (e.key === 'ArrowLeft') onPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onNext, onPrev]);

  return (
    <div
      id="gallery-lightbox-modal"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none"
      onClick={onClose}
    >
      {/* Top action bar */}
      <div
        className="absolute top-4 left-0 right-0 px-6 flex items-center justify-between text-white/80 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="font-editorial-en tracking-widest text-sm text-white/70">
          {currentIndex + 1} / {items.length}
        </span>
        <button
          id="lightbox-close-btn"
          onClick={onClose}
          className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          aria-label="닫기"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main photo container */}
      <div
        className="relative max-w-4xl max-h-[80vh] w-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentItem.url}
          alt={currentItem.caption}
          className="max-h-[75vh] max-w-full object-contain rounded-xs shadow-2xl transition-all duration-300"
          referrerPolicy="no-referrer"
        />

        {/* Previous button */}
        {items.length > 1 && (
          <button
            id="lightbox-prev-btn"
            onClick={onPrev}
            className="absolute left-2 md:-left-12 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white/90 border border-white/20 transition-all backdrop-blur-xs"
            aria-label="이전 사진"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Next button */}
        {items.length > 1 && (
          <button
            id="lightbox-next-btn"
            onClick={onNext}
            className="absolute right-2 md:-right-12 p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-white/90 border border-white/20 transition-all backdrop-blur-xs"
            aria-label="다음 사진"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Caption footer */}
      {currentItem.caption && (
        <div
          className="mt-4 text-center text-white/75 font-editorial-kr text-sm tracking-wide max-w-md px-4"
          onClick={(e) => e.stopPropagation()}
        >
          {currentItem.caption}
        </div>
      )}
    </div>
  );
};
