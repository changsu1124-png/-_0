import React, { useState } from 'react';
import { X, Copy, Check, Share2, QrCode, Smartphone } from 'lucide-react';
import { WeddingData } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  weddingData: WeddingData;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  weddingData,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${weddingData.groom.name} ♥ ${weddingData.bride.name} 결혼식에 초대합니다`,
          text: `${weddingData.wedding.formattedDate} ${weddingData.wedding.venueName}에서 열리는 저희의 결혼식에 소중한 분들을 초대합니다.`,
          url: currentUrl,
        });
      } catch {
        // Ignored if cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div
      id="share-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#FAF8F5] max-w-sm w-full rounded-sm border border-[#E5DFD5] p-5 shadow-2xl space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#EDE6DC] pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-[#8C7A68]" />
            <h3 className="font-editorial-kr text-sm font-semibold text-[#2C2A29]">
              청첩장 공유하기
            </h3>
          </div>
          <button
            id="close-share-modal-btn"
            onClick={onClose}
            className="p-1 text-[#8C847B] hover:text-[#2C2A29]"
            aria-label="닫기"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* KakaoTalk Preview Card */}
        <div className="space-y-1.5">
          <label className="text-[11px] text-[#78726A] font-editorial-kr font-medium">
            카카오톡 공유 미리보기
          </label>
          <div className="border border-[#E2DBD1] rounded-xs bg-white overflow-hidden shadow-2xs">
            <div className="h-32 w-full overflow-hidden bg-[#ECE6DE] relative">
              <img
                src={weddingData.cover.mainImage}
                alt="웨딩 대표 사진"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent flex items-end p-2.5">
                <span className="font-editorial-en text-white text-xs tracking-widest uppercase">
                  {weddingData.cover.headline}
                </span>
              </div>
            </div>
            <div className="p-3 space-y-1">
              <h4 className="font-editorial-kr text-xs font-semibold text-[#2C2A29]">
                {weddingData.groom.name} & {weddingData.bride.name} 결혼합니다
              </h4>
              <p className="font-editorial-kr text-[11px] text-[#7A7369] line-clamp-2 leading-relaxed">
                {weddingData.wedding.formattedDate} | {weddingData.wedding.venueName}
              </p>
            </div>
          </div>
        </div>

        {/* Share buttons */}
        <div className="space-y-2 pt-1">
          <button
            id="modal-native-share-btn"
            onClick={handleNativeShare}
            className="w-full py-2.5 bg-[#2C2A29] text-white rounded-xs text-xs font-medium tracking-wider hover:bg-[#1A1817] transition-colors flex items-center justify-center gap-2"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>스마트폰으로 바로 전송하기</span>
          </button>

          <button
            id="modal-copy-link-btn"
            onClick={handleCopyLink}
            className="w-full py-2.5 bg-white border border-[#D5CEC4] text-[#4A433B] rounded-xs text-xs font-medium hover:bg-[#F4EFE7] transition-colors flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#557A2B]" />
                <span className="text-[#557A2B] font-semibold">링크가 복사되었습니다</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#7A7369]" />
                <span>청첩장 링크 복사하기</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
