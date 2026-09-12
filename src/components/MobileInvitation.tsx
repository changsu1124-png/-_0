import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Phone,
  MessageCircle,
  ChevronDown,
  Calendar,
  MapPin,
  Heart,
  Share2,
  Gift,
  CheckCircle2,
  Sparkles,
  ArrowUp,
} from 'lucide-react';
import { WeddingData, RsvpEntry, GuestbookEntry, GalleryItem } from '../types';
import { CalendarDDay } from './CalendarDDay';
import { WeddingMap } from './WeddingMap';
import { RsvpSection } from './RsvpSection';
import { AccountSection } from './AccountSection';
import { GuestbookSection } from './GuestbookSection';
import { LightboxModal } from './LightboxModal';
import { PhotoCarouselSection } from './PhotoCarouselSection';

interface MobileInvitationProps {
  data: WeddingData;
  rsvps: RsvpEntry[];
  guestbooks: GuestbookEntry[];
  onAddRsvp: (entry: RsvpEntry) => void;
  onAddGuestbook: (entry: GuestbookEntry) => void;
  onLikeGuestbook: (id: string) => void;
  onDeleteGuestbook: (id: string) => void;
  onOpenShare: () => void;
}

export const MobileInvitation: React.FC<MobileInvitationProps> = ({
  data,
  rsvps,
  guestbooks,
  onAddRsvp,
  onAddGuestbook,
  onLikeGuestbook,
  onDeleteGuestbook,
  onOpenShare,
}) => {
  const [lightboxItems, setLightboxItems] = useState<GalleryItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [contactModalOpen, setContactModalOpen] = useState<boolean>(false);

  // Default carousel photos (갤러리 1 ~ 갤러리 5) with fallback
  const carouselPhotos: GalleryItem[] =
    data.carouselPhotos && data.carouselPhotos.length > 0
      ? data.carouselPhotos
      : [
          {
            id: 'carousel-1',
            tag: '갤러리 1',
            url: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1200&q=80',
            caption: '순백의 설렘과 영원한 약속',
          },
          {
            id: 'carousel-2',
            tag: '갤러리 2',
            url: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=80',
            caption: '마주 잡은 두 손의 온기',
          },
          {
            id: 'carousel-3',
            tag: '갤러리 3',
            url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
            caption: '따스한 빛이 머무는 정원에서',
          },
          {
            id: 'carousel-4',
            tag: '갤러리 4',
            url: 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80',
            caption: '서로를 바라보는 다정한 미소',
          },
          {
            id: 'carousel-5',
            tag: '갤러리 5',
            url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80',
            caption: '노을빛 아래 영원을 속삭이며',
          },
        ];

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-[#FDFBF7] text-[#2C2A29] shadow-2xl relative overflow-hidden transition-all duration-300 min-h-screen">
      {/* Editorial Watermark Header / Crest */}
      <div className="pt-8 pb-3 text-center">
        <span className="font-script text-2xl md:text-3xl text-[#948473] opacity-80 tracking-widest block select-none">
          Wedding Celebration
        </span>
        <div className="w-8 h-px bg-[#D9D1C7] mx-auto mt-2" />
      </div>

      {/* ============================================================
          1. 커버 (Cover)
      ============================================================ */}
      <motion.section
        id="section-cover"
        className="px-6 pb-14 pt-2 text-center relative"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Editorial Subtitle */}
        <div className="mb-4">
          <span className="font-editorial-en tracking-[0.25em] text-[11px] uppercase text-[#857B70] font-medium block">
            {data.cover.badge}
          </span>
          <h1 className="font-editorial-en text-3xl font-light text-[#22201F] tracking-wide mt-1">
            {data.cover.headline}
          </h1>
        </div>

        {/* Main Cover Portrait (<갤러리 0>) */}
        <div
          onClick={() => {
            const allPhotos: GalleryItem[] = [
              {
                id: 'cover-0',
                tag: '갤러리 0 (메인 커버)',
                url: data.cover.mainImage,
                caption: `${data.groom.name} ♥ ${data.bride.name} · ${data.cover.headline}`,
              },
              ...carouselPhotos,
            ];
            setLightboxItems(allPhotos);
            setLightboxIndex(0);
          }}
          className="relative my-6 rounded-xs overflow-hidden shadow-lg border-4 border-white aspect-[3/4] bg-[#F3EFE9] cursor-pointer group"
          title="클릭하여 크게 보기"
        >
          <img
            src={data.cover.mainImage}
            alt="웨딩 메인 사진 <갤러리 0>"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-102"
            referrerPolicy="no-referrer"
          />
          {/* Tag badge for <갤러리 0> */}
          <div className="absolute top-3 left-3 bg-black/55 backdrop-blur-xs text-white text-[10px] font-editorial-kr px-2.5 py-0.5 rounded-full border border-white/20 tracking-wider">
            갤러리 0 · 커버
          </div>

          {/* Subtle editorial film overlay */}
          <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-black/10 pointer-events-none" />

          {/* Names in English overlaid on bottom */}
          <div className="absolute bottom-4 left-0 right-0 text-center text-white space-y-0.5">
            <p className="font-editorial-en text-xl tracking-widest font-light drop-shadow-md">
              {data.groom.engName} & {data.bride.engName}
            </p>
          </div>
        </div>

        {/* Groom & Bride Names in Korean */}
        <div className="space-y-1.5 pt-2">
          <div className="flex items-center justify-center gap-3 text-lg font-editorial-kr text-[#2C2A29] font-medium">
            <span>{data.groom.name}</span>
            <span className="text-xs text-[#998F82] font-editorial-en">and</span>
            <span>{data.bride.name}</span>
          </div>
          <p className="font-editorial-kr text-xs text-[#8C8377] tracking-wider">
            {data.cover.subline}
          </p>
        </div>

        {/* Date & Venue details */}
        <div className="mt-6 pt-5 border-t border-[#EAE3D9] space-y-1">
          <p className="font-editorial-en tracking-wider text-sm font-medium text-[#38332E]">
            {data.wedding.formattedDate}
          </p>
          <p className="font-editorial-kr text-xs text-[#787066]">
            {data.wedding.venueName} · {data.wedding.hallName}
          </p>
        </div>

        {/* Gentle scroll indicator */}
        <motion.div
          className="mt-8 flex flex-col items-center justify-center gap-1 text-[#9E9589] cursor-pointer"
          onClick={() => scrollToSection('section-invitation')}
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <span className="font-editorial-en text-[10px] tracking-widest uppercase">
            Scroll
          </span>
          <ChevronDown className="w-4 h-4 opacity-70" />
        </motion.div>
      </motion.section>

      {/* ============================================================
          2. 초대글 (Invitation)
      ============================================================ */}
      <motion.section
        id="section-invitation"
        className="px-6 py-14 text-center border-t border-[#EDE6DC] bg-[#FAF8F5] relative"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="font-editorial-en tracking-[0.25em] text-[11px] text-[#8C8276] uppercase block mb-1">
          INVITATION
        </span>
        <h2 className="font-editorial-kr text-xl font-medium text-[#2C2A29] mb-8">
          {data.greeting.title}
        </h2>

        {/* Quote if exists */}
        {data.greeting.quote && (
          <div className="max-w-xs mx-auto mb-8 p-4 border-y border-[#E6DFC5]/40 italic">
            <p className="font-editorial-kr text-xs text-[#595248] leading-relaxed">
              "{data.greeting.quote}"
            </p>
            {data.greeting.author && (
              <span className="block text-[11px] text-[#8A8174] font-editorial-kr mt-2 not-italic">
                — {data.greeting.author}
              </span>
            )}
          </div>
        )}

        {/* Paragraphs */}
        <div className="space-y-3 font-editorial-kr text-xs text-[#4A443D] leading-loose max-w-sm mx-auto">
          {data.greeting.paragraphs.map((p, idx) =>
            p === '' ? (
              <div key={idx} className="h-3" />
            ) : (
              <p key={idx}>{p}</p>
            )
          )}
        </div>

        {/* Family Relations */}
        <div className="mt-12 pt-8 border-t border-[#EAE3D8] max-w-xs mx-auto space-y-2 font-editorial-kr text-xs text-[#3D3832]">
          <div className="flex items-center justify-center gap-1.5">
            <span>
              {data.groom.father} · {data.groom.mother}
            </span>
            <span className="text-[#8C8276] text-[11px]">의 {data.groom.relation}</span>
            <span className="font-semibold text-sm text-[#22201F] ml-1">{data.groom.name}</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <span>
              {data.bride.father} · {data.bride.mother}
            </span>
            <span className="text-[#8C8276] text-[11px]">의 {data.bride.relation}</span>
            <span className="font-semibold text-sm text-[#22201F] ml-1">{data.bride.name}</span>
          </div>
        </div>

        {/* Contact Bride & Groom / Parents Button */}
        <div className="mt-6">
          <button
            id="open-contact-modal-btn"
            onClick={() => setContactModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#D5CDC1] bg-white text-xs text-[#524B42] hover:bg-[#F2ECE2] transition-colors shadow-2xs"
          >
            <Phone className="w-3.5 h-3.5 text-[#8A7F72]" />
            <span>신랑·신부 및 혼주에게 연락하기</span>
          </button>
        </div>
      </motion.section>

      {/* ============================================================
          3. 포토 갤러리 (Photo Gallery - 가로 스크롤 캐러셀)
      ============================================================ */}
      <PhotoCarouselSection
        photos={carouselPhotos}
        onOpenLightbox={(idx) => {
          setLightboxItems(carouselPhotos);
          setLightboxIndex(idx);
        }}
      />

      {/* ============================================================
          4. 예식 안내 (Ceremony & D-Day)
      ============================================================ */}
      <motion.section
        id="section-ceremony"
        className="px-6 py-14 border-t border-[#EDE6DC] bg-[#FAF8F5] relative"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-center mb-8">
          <span className="font-editorial-en tracking-[0.25em] text-[11px] text-[#8C8276] uppercase block mb-1">
            CEREMONY
          </span>
          <h2 className="font-editorial-kr text-xl font-medium text-[#2C2A29]">
            예식 안내
          </h2>
          <p className="font-editorial-kr text-xs text-[#827A70] mt-1">
            {data.wedding.formattedDate}
          </p>
        </div>

        {/* Mini Calendar & Real-time D-day clock */}
        <CalendarDDay
          weddingDateStr={data.wedding.date}
          weddingTimeStr={data.wedding.time}
          venueName={data.wedding.venueName}
          hallName={data.wedding.hallName}
        />

        {/* Reception & Venue Notes */}
        <div className="mt-8 pt-6 border-t border-[#E8E2D8] space-y-4">
          <div className="bg-white p-4 rounded-xs border border-[#E8E2D8] space-y-2">
            <h4 className="font-editorial-kr text-xs font-semibold text-[#2C2A29] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8C7A68]" />
              식사 및 연회 안내
            </h4>
            <p className="font-editorial-kr text-xs text-[#6B645B] leading-relaxed">
              {data.wedding.mealInfo}
            </p>
          </div>

          <div className="bg-white p-4 rounded-xs border border-[#E8E2D8] space-y-2">
            <h4 className="font-editorial-kr text-xs font-semibold text-[#2C2A29] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#8C7A68]" />
              화환 안내
            </h4>
            <p className="font-editorial-kr text-xs text-[#6B645B] leading-relaxed">
              호텔 측의 권고와 환경을 고려하여 축하 화환은 정중히 사양하오며,
              따뜻한 축복의 마음만 감사히 받겠습니다.
            </p>
          </div>
        </div>
      </motion.section>

      {/* ============================================================
          5. 갤러리 (Gallery)
      ============================================================ */}
      <motion.section
        id="section-gallery"
        className="px-6 py-14 border-t border-[#EDE6DC] relative"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-center mb-8">
          <span className="font-editorial-en tracking-[0.25em] text-[11px] text-[#8C8276] uppercase block mb-1">
            GALLERY
          </span>
          <h2 className="font-editorial-kr text-xl font-medium text-[#2C2A29]">
            우리의 찬란한 계절
          </h2>
          <p className="font-editorial-kr text-xs text-[#827A70] mt-1">
            사진을 터치하시면 크게 보실 수 있습니다
          </p>
        </div>

        {/* Editorial Photo Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {data.gallery.map((photo, idx) => (
            <div
              key={photo.id}
              onClick={() => {
                setLightboxItems(data.gallery);
                setLightboxIndex(idx);
              }}
              className={`relative cursor-pointer overflow-hidden rounded-xs border border-[#E8E2D8] bg-[#EFECE6] group shadow-2xs ${
                idx === 0 || idx === 3 ? 'col-span-2 aspect-[16/10]' : 'aspect-[4/5]'
              }`}
            >
              <img
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors flex items-end p-2.5 opacity-0 group-hover:opacity-100">
                <span className="text-[11px] font-editorial-kr text-white truncate drop-shadow-xs">
                  {photo.caption}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* ============================================================
          6. 오시는 길 (Location & Directions)
      ============================================================ */}
      <motion.section
        id="section-location"
        className="px-6 py-14 border-t border-[#EDE6DC] bg-[#FAF8F5] relative"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-center mb-8">
          <span className="font-editorial-en tracking-[0.25em] text-[11px] text-[#8C8276] uppercase block mb-1">
            LOCATION
          </span>
          <h2 className="font-editorial-kr text-xl font-medium text-[#2C2A29]">
            오시는 길
          </h2>
          <p className="font-editorial-kr text-xs text-[#827A70] mt-1">
            {data.wedding.venueName}
          </p>
        </div>

        <WeddingMap
          venueName={data.wedding.venueName}
          hallName={data.wedding.hallName}
          address={data.wedding.address}
          detailedLocation={data.wedding.detailedLocation}
          subwayInfo={data.wedding.subwayInfo}
          busInfo={data.wedding.busInfo}
          parkingInfo={data.wedding.parkingInfo}
          tel={data.wedding.tel}
        />
      </motion.section>

      {/* ============================================================
          7. 참석 여부 RSVP (RSVP)
      ============================================================ */}
      <motion.section
        id="section-rsvp"
        className="px-6 py-14 border-t border-[#EDE6DC] relative"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-center mb-8">
          <span className="font-editorial-en tracking-[0.25em] text-[11px] text-[#8C8276] uppercase block mb-1">
            R. S. V. P.
          </span>
          <h2 className="font-editorial-kr text-xl font-medium text-[#2C2A29]">
            참석 여부 전달하기
          </h2>
          <p className="font-editorial-kr text-xs text-[#827A70] mt-1 max-w-xs mx-auto">
            축하의 자리를 더욱 정성껏 준비할 수 있도록<br />
            참석 여부를 미리 알려주시면 큰 도움이 됩니다.
          </p>
        </div>

        <RsvpSection
          onAddRsvp={onAddRsvp}
          groomName={data.groom.name}
          brideName={data.bride.name}
        />
      </motion.section>

      {/* ============================================================
          8. 마음 전하기 계좌 (Gifts & Accounts)
      ============================================================ */}
      <motion.section
        id="section-account"
        className="px-6 py-14 border-t border-[#EDE6DC] bg-[#FAF8F5] relative"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-center mb-8">
          <span className="font-editorial-en tracking-[0.25em] text-[11px] text-[#8C8276] uppercase block mb-1">
            SENDING HEARTS
          </span>
          <h2 className="font-editorial-kr text-xl font-medium text-[#2C2A29]">
            마음 전하실 곳
          </h2>
        </div>

        <AccountSection weddingData={data} />
      </motion.section>

      {/* ============================================================
          9. 방명록 (Guestbook)
      ============================================================ */}
      <motion.section
        id="section-guestbook"
        className="px-6 py-14 border-t border-[#EDE6DC] relative"
        initial={{ opacity: 0, y: 35 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="text-center mb-8">
          <span className="font-editorial-en tracking-[0.25em] text-[11px] text-[#8C8276] uppercase block mb-1">
            GUESTBOOK
          </span>
          <h2 className="font-editorial-kr text-xl font-medium text-[#2C2A29]">
            축하 메시지
          </h2>
          <p className="font-editorial-kr text-xs text-[#827A70] mt-1">
            두 사람의 앞날을 따스한 문장으로 축복해 주세요
          </p>
        </div>

        <GuestbookSection
          entries={guestbooks}
          onAddEntry={onAddGuestbook}
          onLikeEntry={onLikeGuestbook}
          onDeleteEntry={onDeleteGuestbook}
        />
      </motion.section>

      {/* Footer / Copyright */}
      <footer className="px-6 py-12 border-t border-[#EDE6DC] bg-[#F7F4EE] text-center space-y-4">
        <div className="space-y-1">
          <p className="font-editorial-en text-lg tracking-widest text-[#4A433B]">
            {data.groom.engName} & {data.bride.engName}
          </p>
          <p className="font-editorial-kr text-xs text-[#8A8175]">
            저희 두 사람의 새로운 시작을 함께 축복해 주셔서 진심으로 감사드립니다.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            id="footer-share-btn"
            onClick={onOpenShare}
            className="px-3.5 py-1.5 rounded-full border border-[#D5CDC1] bg-white text-xs text-[#524B42] hover:bg-[#EFE9DF] transition-colors flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-[#8C7E70]" />
            <span>청첩장 공유하기</span>
          </button>
          <button
            id="footer-scroll-top-btn"
            onClick={scrollToTop}
            className="p-2 rounded-full border border-[#D5CDC1] bg-white text-xs text-[#524B42] hover:bg-[#EFE9DF] transition-colors"
            title="맨 위로 가기"
          >
            <ArrowUp className="w-3.5 h-3.5 text-[#8C7E70]" />
          </button>
        </div>

        <p className="font-editorial-en text-[10px] text-[#AEA79C] tracking-widest pt-4">
          WHITE EDITORIAL WEDDING INVITATION STUDIO
        </p>
      </footer>

      {/* Quick Navigation Floating Bottom Bar */}
      <div className="sticky bottom-4 z-30 px-4 pointer-events-none">
        <div className="max-w-xs mx-auto bg-white/90 backdrop-blur-md rounded-full shadow-lg border border-[#E5DFD5] py-2 px-3 flex items-center justify-around pointer-events-auto text-[#625B52]">
          <button
            id="quick-nav-rsvp"
            onClick={() => scrollToSection('section-rsvp')}
            className="flex flex-col items-center gap-0.5 text-[10px] hover:text-[#2C2A29] transition-colors"
          >
            <CheckCircle2 className="w-4 h-4 text-[#7A6F62]" />
            <span className="font-editorial-kr">참석의사</span>
          </button>
          <div className="w-px h-4 bg-[#E5DFD5]" />
          <button
            id="quick-nav-location"
            onClick={() => scrollToSection('section-location')}
            className="flex flex-col items-center gap-0.5 text-[10px] hover:text-[#2C2A29] transition-colors"
          >
            <MapPin className="w-4 h-4 text-[#7A6F62]" />
            <span className="font-editorial-kr">오시는길</span>
          </button>
          <div className="w-px h-4 bg-[#E5DFD5]" />
          <button
            id="quick-nav-account"
            onClick={() => scrollToSection('section-account')}
            className="flex flex-col items-center gap-0.5 text-[10px] hover:text-[#2C2A29] transition-colors"
          >
            <Gift className="w-4 h-4 text-[#7A6F62]" />
            <span className="font-editorial-kr">마음전하기</span>
          </button>
          <div className="w-px h-4 bg-[#E5DFD5]" />
          <button
            id="quick-nav-share"
            onClick={onOpenShare}
            className="flex flex-col items-center gap-0.5 text-[10px] hover:text-[#2C2A29] transition-colors"
          >
            <Share2 className="w-4 h-4 text-[#7A6F62]" />
            <span className="font-editorial-kr">공유하기</span>
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {(() => {
        const activeGalleryList = lightboxItems.length > 0 ? lightboxItems : data.gallery;
        return (
          <LightboxModal
            items={activeGalleryList}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNext={() => {
              if (lightboxIndex !== null) {
                setLightboxIndex((lightboxIndex + 1) % activeGalleryList.length);
              }
            }}
            onPrev={() => {
              if (lightboxIndex !== null) {
                setLightboxIndex(
                  (lightboxIndex - 1 + activeGalleryList.length) % activeGalleryList.length
                );
              }
            }}
          />
        );
      })()}

      {/* Contact Call/SMS Modal */}
      {contactModalOpen && (
        <div
          id="contact-modal-backdrop"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setContactModalOpen(false)}
        >
          <div
            className="bg-[#FAF8F5] max-w-sm w-full rounded-sm border border-[#E5DFD5] p-5 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center border-b border-[#EDE6DC] pb-3">
              <h3 className="font-editorial-kr text-sm font-semibold text-[#2C2A29]">
                연락처 안내
              </h3>
              <p className="font-editorial-kr text-[11px] text-[#8C847B] mt-0.5">
                전화 또는 문자로 축하의 인사를 전하실 수 있습니다.
              </p>
            </div>

            {/* Groom side */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-[#5A6D80] font-editorial-kr block">
                신랑측
              </span>
              <div className="flex items-center justify-between p-2.5 rounded-xs bg-white border border-[#EAE3D9]">
                <div>
                  <span className="text-xs font-semibold text-[#2C2A29]">신랑 {data.groom.name}</span>
                  <p className="text-[10px] text-[#8C847B] font-mono">{data.groom.phone}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${data.groom.phone}`}
                    className="p-2 rounded-full bg-[#FAF7F2] text-[#6E6457] hover:bg-[#EFE9DF]"
                    title="전화 걸기"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`sms:${data.groom.phone}`}
                    className="p-2 rounded-full bg-[#FAF7F2] text-[#6E6457] hover:bg-[#EFE9DF]"
                    title="문자 보내기"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            {/* Bride side */}
            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-[#8C5A66] font-editorial-kr block">
                신부측
              </span>
              <div className="flex items-center justify-between p-2.5 rounded-xs bg-white border border-[#EAE3D9]">
                <div>
                  <span className="text-xs font-semibold text-[#2C2A29]">신부 {data.bride.name}</span>
                  <p className="text-[10px] text-[#8C847B] font-mono">{data.bride.phone}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  <a
                    href={`tel:${data.bride.phone}`}
                    className="p-2 rounded-full bg-[#FAF7F2] text-[#6E6457] hover:bg-[#EFE9DF]"
                    title="전화 걸기"
                  >
                    <Phone className="w-3.5 h-3.5" />
                  </a>
                  <a
                    href={`sms:${data.bride.phone}`}
                    className="p-2 rounded-full bg-[#FAF7F2] text-[#6E6457] hover:bg-[#EFE9DF]"
                    title="문자 보내기"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <button
              id="close-contact-modal-btn"
              onClick={() => setContactModalOpen(false)}
              className="w-full py-2 bg-[#2C2A29] text-white rounded-xs text-xs font-medium tracking-wider hover:bg-[#1A1817] transition-colors"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
