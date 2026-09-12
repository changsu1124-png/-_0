import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Sliders,
  Share2,
  Eye,
  Check,
  Heart,
  Flower2,
} from 'lucide-react';
import { initialWeddingData, initialGuestbookEntries } from './data/initialWeddingData';
import { WeddingData, RsvpEntry, GuestbookEntry } from './types';
import { PetalCanvas } from './components/PetalCanvas';
import { BgmPlayer } from './components/BgmPlayer';
import { MobileInvitation } from './components/MobileInvitation';
import { StudioEditor } from './components/StudioEditor';
import { ShareModal } from './components/ShareModal';

export default function App() {
  // Local storage persistence
  const [weddingData, setWeddingData] = useState<WeddingData>(() => {
    try {
      const saved = localStorage.getItem('wedding_studio_data_v1');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.carouselPhotos || parsed.carouselPhotos.length === 0) {
          parsed.carouselPhotos = initialWeddingData.carouselPhotos;
        }
        return parsed;
      }
    } catch {
      // fallback
    }
    return initialWeddingData;
  });

  const [rsvps, setRsvps] = useState<RsvpEntry[]>(() => {
    try {
      const saved = localStorage.getItem('wedding_studio_rsvps_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      {
        id: 'rsvp-seed-1',
        name: '정우성',
        side: 'groom',
        attendance: 'attend',
        guestCount: 2,
        meal: 'yes',
        bus: 'no',
        phone: '010-3333-5555',
        message: '결혼 너무 축하한다 민혁아! 꼭 갈게.',
        createdAt: '2026. 9. 10.',
      },
    ];
  });

  const [guestbooks, setGuestbooks] = useState<GuestbookEntry[]>(() => {
    try {
      const saved = localStorage.getItem('wedding_studio_guestbook_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return initialGuestbookEntries;
  });

  // Mode: 'split' (desktop side-by-side) vs 'preview-only' vs 'editor-only' (on mobile)
  const [viewMode, setViewMode] = useState<'split' | 'preview' | 'editor'>('split');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const isMobile = window.innerWidth < 1024;
      setIsMobileDevice(isMobile);
      if (isMobile && viewMode === 'split') {
        setViewMode('preview');
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [viewMode]);

  // Persist state updates
  useEffect(() => {
    try {
      localStorage.setItem('wedding_studio_data_v1', JSON.stringify(weddingData));
    } catch {
      // ignore quota
    }
  }, [weddingData]);

  useEffect(() => {
    try {
      localStorage.setItem('wedding_studio_rsvps_v1', JSON.stringify(rsvps));
    } catch {
      // ignore
    }
  }, [rsvps]);

  useEffect(() => {
    try {
      localStorage.setItem('wedding_studio_guestbook_v1', JSON.stringify(guestbooks));
    } catch {
      // ignore
    }
  }, [guestbooks]);

  const handleAddRsvp = (entry: RsvpEntry) => {
    setRsvps((prev) => [entry, ...prev]);
  };

  const handleAddGuestbook = (entry: GuestbookEntry) => {
    setGuestbooks((prev) => [entry, ...prev]);
  };

  const handleLikeGuestbook = (id: string) => {
    setGuestbooks((prev) =>
      prev.map((g) => (g.id === id ? { ...g, likes: g.likes + 1 } : g))
    );
  };

  const handleDeleteGuestbook = (id: string) => {
    setGuestbooks((prev) => prev.filter((g) => g.id !== id));
  };

  const handleResetToDefault = () => {
    if (window.confirm('청첩장 데이터를 기본 샘플 상태로 복원하시겠습니까?')) {
      setWeddingData(initialWeddingData);
      setGuestbooks(initialGuestbookEntries);
      localStorage.removeItem('wedding_studio_data_v1');
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F2ED] text-[#2C2A29] flex flex-col relative selection:bg-[#E2DAD0] selection:text-[#1F1D1C]">
      {/* Falling Flower Petals Canvas */}
      <PetalCanvas
        enabled={weddingData.settings.showPetals}
        style={weddingData.settings.petalStyle}
        speed={weddingData.settings.petalSpeed}
      />

      {/* Background Music Player */}
      <BgmPlayer autoPlay={weddingData.settings.bgmAutoPlay} />

      {/* Top Application Bar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E8E2D8] px-4 py-2.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#2C2A29] text-white flex items-center justify-center shadow-xs">
            <Flower2 className="w-4 h-4 text-[#FAF8F5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-editorial-kr text-sm font-semibold text-[#2C2A29]">
                디지털 청첩장 스튜디오
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-editorial-kr bg-[#F0EBE3] text-[#6B6358] border border-[#DDD6CC]">
                화이트 에디토리얼
              </span>
            </div>
            <p className="font-editorial-kr text-[11px] text-[#8C847B] hidden sm:block">
              {weddingData.groom.name} ♥ {weddingData.bride.name} 모바일 청첩장
            </p>
          </div>
        </div>

        {/* View mode switcher */}
        <div className="flex items-center gap-2">
          {/* Mobile view switch buttons */}
          <div className="flex items-center bg-[#EFECE6] p-0.5 rounded-full border border-[#DDD6CC]">
            <button
              id="view-mode-preview"
              onClick={() => setViewMode('preview')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-editorial-kr transition-all ${
                viewMode === 'preview'
                  ? 'bg-white text-[#2C2A29] font-semibold shadow-2xs'
                  : 'text-[#7A7369] hover:text-[#2C2A29]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>청첩장 보기</span>
            </button>

            {/* Desktop split view toggle */}
            <button
              id="view-mode-split"
              onClick={() => setViewMode('split')}
              className={`hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-editorial-kr transition-all ${
                viewMode === 'split'
                  ? 'bg-white text-[#2C2A29] font-semibold shadow-2xs'
                  : 'text-[#7A7369] hover:text-[#2C2A29]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>스튜디오 분할</span>
            </button>

            {/* Mobile editor toggle */}
            <button
              id="view-mode-editor"
              onClick={() => setViewMode('editor')}
              className={`flex lg:hidden items-center gap-1.5 px-3 py-1 rounded-full text-xs font-editorial-kr transition-all ${
                viewMode === 'editor'
                  ? 'bg-white text-[#2C2A29] font-semibold shadow-2xs'
                  : 'text-[#7A7369] hover:text-[#2C2A29]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>편집</span>
            </button>
          </div>

          <button
            id="top-share-btn"
            onClick={() => setIsShareModalOpen(true)}
            className="p-1.5 rounded-full border border-[#D9D3C9] bg-white text-[#524B43] hover:bg-[#F2EDE5] transition-colors"
            title="청첩장 공유"
          >
            <Share2 className="w-4 h-4 text-[#7A7268]" />
          </button>
        </div>
      </header>

      {/* Main Studio Workspace */}
      <main className="flex-1 flex justify-center p-3 md:p-6 overflow-hidden">
        {/* Scenario 1: Desktop Split Mode (Mobile Invitation in smartphone chassis on left, Studio controls on right) */}
        {viewMode === 'split' && (
          <div className="w-full max-w-6xl grid grid-cols-12 gap-6 h-[calc(100vh-80px)] items-start">
            {/* Left: Realistic Mobile Phone Container */}
            <div className="col-span-5 h-full flex items-center justify-center">
              <div className="w-[400px] h-full max-h-[840px] bg-[#1E1D1C] rounded-[42px] p-3 shadow-2xl border-4 border-[#3D3A36] relative flex flex-col">
                {/* Phone Speaker & Dynamic Island */}
                <div className="w-full flex items-center justify-center pt-1.5 pb-2 relative z-20">
                  <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#1C2030]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#111]" />
                  </div>
                </div>

                {/* Inner Screen Scrollable Container */}
                <div className="w-full flex-1 rounded-[32px] overflow-y-auto overflow-x-hidden bg-[#FDFBF7] relative">
                  <MobileInvitation
                    data={weddingData}
                    rsvps={rsvps}
                    guestbooks={guestbooks}
                    onAddRsvp={handleAddRsvp}
                    onAddGuestbook={handleAddGuestbook}
                    onLikeGuestbook={handleLikeGuestbook}
                    onDeleteGuestbook={handleDeleteGuestbook}
                    onOpenShare={() => setIsShareModalOpen(true)}
                  />
                </div>

                {/* Bottom Home Indicator */}
                <div className="w-full flex justify-center pt-2 pb-0.5">
                  <div className="w-32 h-1 bg-white/30 rounded-full" />
                </div>
              </div>
            </div>

            {/* Right: Studio Customizer & Management Panel */}
            <div className="col-span-7 h-full flex flex-col max-h-[840px]">
              <StudioEditor
                weddingData={weddingData}
                onUpdateWeddingData={setWeddingData}
                rsvps={rsvps}
                guestbooks={guestbooks}
                onResetToDefault={handleResetToDefault}
              />
            </div>
          </div>
        )}

        {/* Scenario 2: Preview Mode (Full centered mobile wedding invitation) */}
        {viewMode === 'preview' && (
          <div className="w-full max-w-md mx-auto py-2">
            <MobileInvitation
              data={weddingData}
              rsvps={rsvps}
              guestbooks={guestbooks}
              onAddRsvp={handleAddRsvp}
              onAddGuestbook={handleAddGuestbook}
              onLikeGuestbook={handleLikeGuestbook}
              onDeleteGuestbook={handleDeleteGuestbook}
              onOpenShare={() => setIsShareModalOpen(true)}
            />
          </div>
        )}

        {/* Scenario 3: Mobile Editor Mode (Full screen studio settings on mobile) */}
        {viewMode === 'editor' && (
          <div className="w-full max-w-xl mx-auto h-[calc(100vh-80px)]">
            <StudioEditor
              weddingData={weddingData}
              onUpdateWeddingData={setWeddingData}
              rsvps={rsvps}
              guestbooks={guestbooks}
              onResetToDefault={handleResetToDefault}
            />
          </div>
        )}
      </main>

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        weddingData={weddingData}
      />
    </div>
  );
}
