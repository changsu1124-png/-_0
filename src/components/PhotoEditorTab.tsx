import React, { useState, useRef } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Check,
  RefreshCw,
  Sparkles,
  Layers,
  Trash2,
  ExternalLink,
  Plus,
  AlertCircle,
} from 'lucide-react';
import { WeddingData, GalleryItem } from '../types';
import { processImageFile } from '../lib/imageUtils';

interface PhotoEditorTabProps {
  weddingData: WeddingData;
  onUpdateWeddingData: (newData: WeddingData) => void;
  triggerSaveToast: () => void;
}

const PRESET_COVERS = [
  {
    name: '클래식 웨딩 홀',
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: '야외 정원 부케',
    url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80',
  },
  {
    name: '로맨틱 흑백 포트레이트',
    url: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
  },
];

const DEFAULT_CAROUSEL_FALLBACK: GalleryItem[] = [
  {
    id: 'carousel-1',
    tag: '갤러리 1',
    url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80',
    caption: '순백의 설렘과 영원한 약속',
    widthRatio: 'tall',
  },
  {
    id: 'carousel-2',
    tag: '갤러리 2',
    url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
    caption: '마주 잡은 두 손의 온기',
    widthRatio: 'tall',
  },
  {
    id: 'carousel-3',
    tag: '갤러리 3',
    url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
    caption: '따스한 빛이 머무는 정원에서',
    widthRatio: 'tall',
  },
  {
    id: 'carousel-4',
    tag: '갤러리 4',
    url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80',
    caption: '서로를 바라보는 다정한 미소',
    widthRatio: 'tall',
  },
  {
    id: 'carousel-5',
    tag: '갤러리 5',
    url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
    caption: '노을빛 아래 영원을 속삭이며',
    widthRatio: 'tall',
  },
];

export const PhotoEditorTab: React.FC<PhotoEditorTabProps> = ({
  weddingData,
  onUpdateWeddingData,
  triggerSaveToast,
}) => {
  const [isProcessing, setIsProcessing] = useState<string | null>(null);
  const [dragOverSlot, setDragOverSlot] = useState<string | null>(null);

  const coverFileInputRef = useRef<HTMLInputElement>(null);
  const multiFileInputRef = useRef<HTMLInputElement>(null);

  const carouselPhotos: GalleryItem[] =
    weddingData.carouselPhotos && weddingData.carouselPhotos.length > 0
      ? weddingData.carouselPhotos
      : DEFAULT_CAROUSEL_FALLBACK;

  // Handle Cover Photo (<갤러리 0>) Upload
  const handleCoverUpload = async (file: File) => {
    try {
      setIsProcessing('cover');
      const dataUrl = await processImageFile(file);
      onUpdateWeddingData({
        ...weddingData,
        cover: {
          ...weddingData.cover,
          mainImage: dataUrl,
        },
      });
      triggerSaveToast();
    } catch (err) {
      alert('이미지 처리 중 오류가 발생했습니다. 다른 사진을 선택해 주세요.');
    } finally {
      setIsProcessing(null);
    }
  };

  // Handle Single Carousel Slot Upload (<갤러리 1~5>)
  const handleCarouselSlotUpload = async (file: File, index: number) => {
    try {
      setIsProcessing(`carousel-${index}`);
      const dataUrl = await processImageFile(file);

      const updated = [...carouselPhotos];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          url: dataUrl,
        };
      } else {
        updated.push({
          id: `carousel-${index + 1}`,
          tag: `갤러리 ${index + 1}`,
          url: dataUrl,
          caption: `소중한 순간 ${index + 1}`,
          widthRatio: 'tall',
        });
      }

      onUpdateWeddingData({
        ...weddingData,
        carouselPhotos: updated,
      });
      triggerSaveToast();
    } catch (err) {
      alert('이미지 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(null);
    }
  };

  // Handle Multi-file Upload for Carousel (<갤러리 1> ~ <갤러리 5>)
  const handleMultiUpload = async (files: FileList | File[]) => {
    try {
      setIsProcessing('multi');
      const fileArray = Array.from(files).slice(0, 5);
      const updated = [...carouselPhotos];

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const dataUrl = await processImageFile(file);
        if (updated[i]) {
          updated[i] = {
            ...updated[i],
            url: dataUrl,
          };
        } else {
          updated.push({
            id: `carousel-${i + 1}`,
            tag: `갤러리 ${i + 1}`,
            url: dataUrl,
            caption: `갤러리 ${i + 1}의 순간`,
            widthRatio: 'tall',
          });
        }
      }

      onUpdateWeddingData({
        ...weddingData,
        carouselPhotos: updated,
      });
      triggerSaveToast();
    } catch (err) {
      alert('일괄 이미지 처리 중 오류가 발생했습니다.');
    } finally {
      setIsProcessing(null);
    }
  };

  // Update caption or tag for a carousel slot
  const updateCarouselSlot = (index: number, fields: Partial<GalleryItem>) => {
    const updated = [...carouselPhotos];
    if (updated[index]) {
      updated[index] = {
        ...updated[index],
        ...fields,
      };
      onUpdateWeddingData({
        ...weddingData,
        carouselPhotos: updated,
      });
      triggerSaveToast();
    }
  };

  // Add a new slide to carousel
  const addCarouselSlot = () => {
    const nextIdx = carouselPhotos.length + 1;
    const newSlot: GalleryItem = {
      id: `carousel-${Date.now()}`,
      tag: `갤러리 ${nextIdx}`,
      url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
      caption: `새로운 순간 ${nextIdx}`,
      widthRatio: 'tall',
    };
    onUpdateWeddingData({
      ...weddingData,
      carouselPhotos: [...carouselPhotos, newSlot],
    });
    triggerSaveToast();
  };

  // Reset carousel to sample photos
  const resetCarouselToSample = () => {
    if (window.confirm('포토 갤러리 캐러셀을 기본 샘플 사진으로 되돌리시겠습니까?')) {
      onUpdateWeddingData({
        ...weddingData,
        carouselPhotos: DEFAULT_CAROUSEL_FALLBACK,
      });
      triggerSaveToast();
    }
  };

  return (
    <div className="space-y-8">
      {/* Editorial Guide Banner */}
      <div className="p-4 rounded-xs border border-[#E0D7CB] bg-white shadow-2xs space-y-2">
        <div className="flex items-center gap-2 text-[#2C2A29]">
          <Sparkles className="w-4 h-4 text-[#8C7A68]" />
          <h3 className="font-editorial-kr text-xs font-semibold">
            사진 직접 넣기 및 갤러리 스튜디오
          </h3>
        </div>
        <p className="font-editorial-kr text-[11px] text-[#70685E] leading-relaxed">
          내 컴퓨터나 스마트폰에 있는 사진을 직접 업로드하여 모바일 청첩장에 즉시 적용할 수 있습니다.
          첫 번째 사진은 <strong className="text-[#2C2A29] font-medium">&lt;갤러리 0&gt;</strong> 메인 커버에,
          나머지 사진들은 <strong className="text-[#2C2A29] font-medium">&lt;갤러리 1 ~ 5&gt;</strong> 가로 스크롤 캐러셀에 실시간 반영됩니다.
        </p>
      </div>

      {/* ========================================================
          1. 첫 번째 사진: <갤러리 0> 메인 커버
      ======================================================== */}
      <div className="p-5 rounded-xs border-2 border-[#D9D1C5] bg-white shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#EFEBE4] pb-3">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-[#2C2A29] text-white font-editorial-kr text-[11px] font-semibold">
              갤러리 0
            </span>
            <h4 className="font-editorial-kr text-sm font-semibold text-[#2C2A29]">
              첫 번째 사진 · 메인 커버 이미지
            </h4>
          </div>
          <span className="font-editorial-en text-[11px] text-[#8C847B]">
            COVER MAIN PHOTO
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
          {/* Cover Preview */}
          <div className="md:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[220px] aspect-[3/4] rounded-xs overflow-hidden border-2 border-[#E5DFD5] bg-[#F5F2ED] shadow-md group">
              <img
                src={weddingData.cover.mainImage}
                alt="메인 커버 <갤러리 0>"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/10 pointer-events-none" />
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[9px] px-2 py-0.5 rounded-full">
                현재 적용된 &lt;갤러리 0&gt;
              </div>
              <div className="absolute bottom-3 inset-x-0 text-center text-white px-2 pointer-events-none">
                <p className="font-editorial-en text-xs tracking-wider font-light">
                  {weddingData.groom.engName} & {weddingData.bride.engName}
                </p>
                <p className="font-editorial-kr text-[10px] opacity-80 truncate">
                  {weddingData.cover.headline}
                </p>
              </div>
            </div>
          </div>

          {/* Upload Controls for <갤러리 0> */}
          <div className="md:col-span-7 space-y-4">
            {/* Drag & Drop Box */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOverSlot('cover');
              }}
              onDragLeave={() => setDragOverSlot(null)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOverSlot(null);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleCoverUpload(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => coverFileInputRef.current?.click()}
              className={`p-5 rounded-xs border-2 border-dashed cursor-pointer text-center transition-all ${
                dragOverSlot === 'cover'
                  ? 'border-[#2C2A29] bg-[#F3EFE9]'
                  : 'border-[#D9D3C9] bg-[#FAF8F5] hover:bg-[#F3EFE9] hover:border-[#8C7A68]'
              }`}
            >
              <input
                ref={coverFileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleCoverUpload(e.target.files[0]);
                  }
                }}
              />
              <div className="w-10 h-10 rounded-full bg-white border border-[#DDD6CC] flex items-center justify-center mx-auto mb-2 text-[#635A4F] shadow-2xs">
                {isProcessing === 'cover' ? (
                  <RefreshCw className="w-5 h-5 animate-spin text-[#8C7A68]" />
                ) : (
                  <Upload className="w-5 h-5" />
                )}
              </div>
              <p className="font-editorial-kr text-xs font-semibold text-[#2C2A29]">
                {isProcessing === 'cover'
                  ? '사진 최적화 처리 중...'
                  : '내 기기에서 첫 번째 사진(<갤러리 0>) 업로드'}
              </p>
              <p className="font-editorial-kr text-[11px] text-[#8C847B] mt-1">
                컴퓨터 또는 휴대폰 사진을 클릭하여 선택하거나 여기로 드래그하세요
              </p>
            </div>

            {/* Direct URL input */}
            <div className="space-y-1">
              <label className="text-[11px] font-editorial-kr text-[#7A7369] font-medium flex items-center gap-1">
                <span>이미지 링크(URL) 직접 입력:</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={weddingData.cover.mainImage}
                  onChange={(e) => {
                    onUpdateWeddingData({
                      ...weddingData,
                      cover: { ...weddingData.cover, mainImage: e.target.value },
                    });
                    triggerSaveToast();
                  }}
                  placeholder="https://..."
                  className="flex-1 px-3 py-1.5 text-xs rounded-xs border border-[#D9D3C9] bg-[#FAF8F5] font-mono text-[#3D3A37]"
                />
              </div>
            </div>

            {/* Presets */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[11px] font-editorial-kr text-[#7A7369]">
                추천 웨딩 커버 프리셋:
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_COVERS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      onUpdateWeddingData({
                        ...weddingData,
                        cover: { ...weddingData.cover, mainImage: preset.url },
                      });
                      triggerSaveToast();
                    }}
                    className="text-[11px] font-editorial-kr px-2.5 py-1 rounded-xs border border-[#D9D3C9] bg-white hover:bg-[#F2ECE2] text-[#554E46] transition-colors"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Headline and Subline */}
            <div className="pt-2 border-t border-[#EDE8E1] grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-editorial-kr text-[#7A7369]">커버 영문 헤드라인</label>
                <input
                  type="text"
                  value={weddingData.cover.headline}
                  onChange={(e) => {
                    onUpdateWeddingData({
                      ...weddingData,
                      cover: { ...weddingData.cover, headline: e.target.value },
                    });
                    triggerSaveToast();
                  }}
                  className="w-full px-2.5 py-1 text-xs rounded-xs border border-[#D9D3C9] bg-[#FAF8F5]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-editorial-kr text-[#7A7369]">커버 한글 서브카피</label>
                <input
                  type="text"
                  value={weddingData.cover.subline}
                  onChange={(e) => {
                    onUpdateWeddingData({
                      ...weddingData,
                      cover: { ...weddingData.cover, subline: e.target.value },
                    });
                    triggerSaveToast();
                  }}
                  className="w-full px-2.5 py-1 text-xs rounded-xs border border-[#D9D3C9] bg-[#FAF8F5]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. 포토 갤러리 캐러셀: <갤러리 1> ~ <갤러리 5>
      ======================================================== */}
      <div className="p-5 rounded-xs border-2 border-[#D9D1C5] bg-white shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#EFEBE4] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#8C7A68] text-white font-editorial-kr text-[11px] font-semibold">
                가로 스크롤 캐러셀
              </span>
              <h4 className="font-editorial-kr text-sm font-semibold text-[#2C2A29]">
                포토 갤러리 (&lt;갤러리 1&gt; ~ &lt;갤러리 5&gt;)
              </h4>
            </div>
            <p className="font-editorial-kr text-[11px] text-[#7A7368] mt-1">
              '함께 걸어온 시간들' 자리에 실시간 표시되는 가로 스크롤 캐러셀 사진들입니다.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Multi-file batch upload button */}
            <input
              ref={multiFileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  handleMultiUpload(e.target.files);
                }
              }}
            />
            <button
              id="multi-upload-btn"
              type="button"
              onClick={() => multiFileInputRef.current?.click()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs bg-[#2C2A29] text-white text-xs font-editorial-kr font-medium hover:bg-[#1A1817] transition-colors shadow-2xs"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>여러 장 한 번에 올리기</span>
            </button>

            <button
              type="button"
              onClick={resetCarouselToSample}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xs border border-[#D9D3C9] bg-white text-[#7A7369] text-xs font-editorial-kr hover:text-[#2C2A29] transition-colors"
              title="캐러셀 샘플 사진으로 되돌리기"
            >
              <RefreshCw className="w-3 h-3" />
              <span>샘플 복원</span>
            </button>
          </div>
        </div>

        {/* 5 Slots Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {carouselPhotos.map((photo, idx) => {
            const slotTag = photo.tag || `갤러리 ${idx + 1}`;
            const fileInputId = `carousel-file-${idx}`;

            return (
              <div
                key={photo.id || idx}
                className="p-3.5 rounded-xs border border-[#E5DFD5] bg-[#FAF8F5] space-y-3 relative group"
              >
                {/* Slot Header */}
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 font-editorial-kr text-xs font-semibold text-[#2C2A29]">
                    <span className="w-5 h-5 rounded-full bg-[#3D3730] text-white text-[10px] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    &lt;{slotTag}&gt;
                  </span>
                  <span className="text-[10px] font-editorial-en text-[#8C847B]">
                    PHOTO 0{idx + 1}
                  </span>
                </div>

                {/* Slot Thumbnail & Upload Zone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverSlot(`slot-${idx}`);
                  }}
                  onDragLeave={() => setDragOverSlot(null)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDragOverSlot(null);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleCarouselSlotUpload(e.dataTransfer.files[0], idx);
                    }
                  }}
                  className={`relative aspect-[3/4] rounded-xs overflow-hidden border transition-all ${
                    dragOverSlot === `slot-${idx}`
                      ? 'border-[#2C2A29] ring-2 ring-[#2C2A29]/20'
                      : 'border-[#D9D3C9] bg-[#EFECE6]'
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.caption}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />

                  {/* Overlay button on hover */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3 text-center">
                    <label
                      htmlFor={fileInputId}
                      className="cursor-pointer px-3 py-1.5 rounded-full bg-white text-xs font-editorial-kr font-medium text-[#2C2A29] hover:bg-[#F3EFE9] transition-colors shadow-xs"
                    >
                      사진 변경하기
                    </label>
                    <span className="text-[10px] text-white/90">
                      또는 사진을 드래그하세요
                    </span>
                  </div>

                  <input
                    id={fileInputId}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleCarouselSlotUpload(e.target.files[0], idx);
                      }
                    }}
                  />

                  {/* Processing indicator */}
                  {isProcessing === `carousel-${idx}` && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs font-editorial-kr gap-1.5">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>처리 중...</span>
                    </div>
                  )}
                </div>

                {/* Inputs for this slot */}
                <div className="space-y-2 pt-1">
                  <div>
                    <label className="text-[10px] text-[#7A7369] font-editorial-kr block mb-0.5">
                      사진 설명 (캡션)
                    </label>
                    <input
                      type="text"
                      value={photo.caption}
                      onChange={(e) => updateCarouselSlot(idx, { caption: e.target.value })}
                      placeholder="사진 설명 입력"
                      className="w-full px-2.5 py-1 text-xs rounded-xs border border-[#D9D3C9] bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#7A7369] font-editorial-kr block mb-0.5">
                      사진 URL 직접 수정
                    </label>
                    <input
                      type="text"
                      value={photo.url}
                      onChange={(e) => updateCarouselSlot(idx, { url: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-2 py-1 text-[11px] font-mono rounded-xs border border-[#D9D3C9] bg-white text-[#3D3A37]"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add more button */}
        <div className="pt-2 flex items-center justify-between border-t border-[#EDE8E1]">
          <button
            type="button"
            onClick={addCarouselSlot}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs border border-[#D5CDC1] bg-white text-xs font-editorial-kr text-[#524B42] hover:bg-[#F2ECE2] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>사진 슬롯 추가하기 (&lt;갤러리 {carouselPhotos.length + 1}&gt;)</span>
          </button>
          <span className="text-[11px] font-editorial-kr text-[#8C847B]">
            현재 총 {carouselPhotos.length}장의 캐러셀 사진 등록됨
          </span>
        </div>
      </div>
    </div>
  );
};
