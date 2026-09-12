import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, Maximize2, Sparkles } from 'lucide-react';
import { GalleryItem } from '../types';

interface PhotoCarouselSectionProps {
  photos: GalleryItem[];
  onOpenLightbox: (index: number) => void;
}

export const PhotoCarouselSection: React.FC<PhotoCarouselSectionProps> = ({
  photos,
  onOpenLightbox,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Check scroll position to update active dot and arrow state
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

    // Calculate active slide index based on scroll position
    const cardWidth = 260 + 16; // width + gap
    const index = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(Math.max(0, index), photos.length - 1));
  };

  useEffect(() => {
    handleScroll();
  }, [photos]);

  const scrollToSlide = (index: number) => {
    if (!scrollRef.current) return;
    const cardWidth = 260 + 16;
    scrollRef.current.scrollTo({
      left: index * cardWidth,
      behavior: 'smooth',
    });
    setActiveIndex(index);
  };

  const scrollByDirection = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const cardWidth = 260 + 16;
    const currentLeft = scrollRef.current.scrollLeft;
    const targetLeft = direction === 'left' ? currentLeft - cardWidth : currentLeft + cardWidth;
    scrollRef.current.scrollTo({
      left: targetLeft,
      behavior: 'smooth',
    });
  };

  if (!photos || photos.length === 0) return null;

  return (
    <motion.section
      id="section-photo-gallery"
      className="py-14 border-t border-[#EDE6DC] bg-[#FAF8F5] relative overflow-hidden"
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Editorial Header */}
      <div className="text-center px-6 mb-8">
        <span className="font-editorial-en tracking-[0.25em] text-[11px] text-[#8C8276] uppercase block mb-1.5">
          PHOTO GALLERY
        </span>
        <h2 className="font-editorial-kr text-xl font-medium text-[#2C2A29]">
          포토 갤러리
        </h2>
        <p className="font-editorial-kr text-xs text-[#827A70] mt-1">
          서로를 마주본 찬란한 계절의 기록
        </p>

        {/* Counter Badge */}
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white border border-[#E5DFD5] text-[11px] font-editorial-en text-[#787066] shadow-2xs">
          <span className="font-medium text-[#2C2A29]">
            {String(activeIndex + 1).padStart(2, '0')}
          </span>
          <span className="opacity-40">/</span>
          <span>{String(photos.length).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Carousel Container */}
      <div className="relative group px-4">
        {/* Navigation Arrow Left */}
        {canScrollLeft && (
          <button
            id="carousel-prev-btn"
            onClick={() => scrollByDirection('left')}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs border border-[#E5DFD5] shadow-md flex items-center justify-center text-[#4A433A] hover:bg-white hover:text-black transition-all"
            aria-label="이전 사진"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Navigation Arrow Right */}
        {canScrollRight && (
          <button
            id="carousel-next-btn"
            onClick={() => scrollByDirection('right')}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/90 backdrop-blur-xs border border-[#E5DFD5] shadow-md flex items-center justify-center text-[#4A433A] hover:bg-white hover:text-black transition-all"
            aria-label="다음 사진"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Horizontal Scroll Track */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory py-3 px-2 no-scrollbar scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {photos.map((photo, idx) => (
            <div
              key={photo.id || idx}
              onClick={() => onOpenLightbox(idx)}
              className="flex-none w-[260px] snap-center cursor-pointer transition-transform duration-300 hover:scale-[1.015]"
            >
              {/* Photo Frame */}
              <div className="relative rounded-xs overflow-hidden border border-[#E5DFD5] bg-white shadow-md aspect-[3/4] flex flex-col justify-between p-2">
                {/* Photo Image */}
                <div className="relative w-full h-full overflow-hidden rounded-2xs bg-[#EDE8E1]">
                  <img
                    src={photo.url}
                    alt={photo.caption || `웨딩 갤러리 사진 ${idx + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />

                  {/* Photo Tag Badge (갤러리 1, 갤러리 2 등) */}
                  <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-editorial-kr px-2.5 py-0.5 rounded-full tracking-wider border border-white/20 shadow-xs">
                    {photo.tag || `갤러리 ${idx + 1}`}
                  </div>

                  {/* Expand icon on hover */}
                  <div className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/70 backdrop-blur-xs flex items-center justify-center text-[#2C2A29] opacity-80 hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>

                  {/* Subtle bottom vignette */}
                  <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/40 to-transparent pointer-events-none" />
                </div>

                {/* Editorial Caption under photo inside frame */}
                <div className="pt-2.5 pb-1 px-1 text-center">
                  <p className="font-editorial-kr text-xs text-[#3D3833] font-medium truncate">
                    {photo.caption || `소중한 순간 ${idx + 1}`}
                  </p>
                  <span className="font-editorial-en text-[10px] text-[#8C8377] tracking-widest block mt-0.5">
                    MOMENT 0{idx + 1}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Indicators (Dots & Tap to Slide) */}
      <div className="flex items-center justify-center gap-2 mt-5">
        {photos.map((photo, idx) => (
          <button
            key={photo.id || idx}
            onClick={() => scrollToSlide(idx)}
            className={`transition-all duration-300 rounded-full ${
              activeIndex === idx
                ? 'w-6 h-1.5 bg-[#2C2A29]'
                : 'w-1.5 h-1.5 bg-[#D5CEC2] hover:bg-[#A89E90]'
            }`}
            aria-label={`슬라이드 ${idx + 1}로 이동`}
          />
        ))}
      </div>

      {/* Touch / Scroll Hint */}
      <p className="text-center font-editorial-kr text-[11px] text-[#9E9589] mt-3">
        좌우로 밀어서 넘겨보거나 터치하여 크게 감상하세요
      </p>
    </motion.section>
  );
};
