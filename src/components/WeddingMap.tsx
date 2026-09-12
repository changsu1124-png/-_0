import React, { useState } from 'react';
import { Copy, Check, Navigation, Car, Bus, Train, MapPin } from 'lucide-react';
import { motion } from 'motion/react';

interface WeddingMapProps {
  venueName: string;
  hallName: string;
  address: string;
  detailedLocation: string;
  subwayInfo: string;
  busInfo: string;
  parkingInfo: string;
  tel: string;
}

export const WeddingMap: React.FC<WeddingMapProps> = ({
  venueName,
  hallName,
  address,
  detailedLocation,
  subwayInfo,
  busInfo,
  parkingInfo,
  tel,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  // Safe navigation web URLs for mobile / desktop
  const openNaverMap = () => {
    const encoded = encodeURIComponent(`${venueName}`);
    window.open(`https://map.naver.com/v5/search/${encoded}`, '_blank');
  };

  const openKakaoMap = () => {
    const encoded = encodeURIComponent(`${venueName}`);
    window.open(`https://map.kakao.com/link/search/${encoded}`, '_blank');
  };

  const openTmap = () => {
    const encoded = encodeURIComponent(`${venueName}`);
    window.open(`https://tmap.co.kr/tmap2/mobile/route.jsp?name=${encoded}`, '_blank');
  };

  return (
    <div className="w-full space-y-6">
      {/* Venue Header */}
      <div className="text-center space-y-1">
        <h4 className="font-editorial-kr text-lg font-medium text-[#2C2A29]">
          {venueName}
        </h4>
        <p className="font-editorial-kr text-sm text-[#78726A]">
          {hallName}
        </p>
        <div className="flex items-center justify-center gap-1 text-xs text-[#8A847C] pt-1">
          <MapPin className="w-3.5 h-3.5 text-[#9E8E7D]" />
          <span>{address}</span>
        </div>
        <div className="pt-2">
          <button
            id="copy-address-button"
            onClick={handleCopyAddress}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border border-[#D5CEC4] bg-[#FAF8F5] text-[#554F48] hover:bg-[#F2ECE3] transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#6B8E23]" />
                <span className="font-medium text-[#4A6317]">주소가 복사되었습니다</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#857D74]" />
                <span>주소 복사하기</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Stylized Vector Map Preview */}
      <div className="relative w-full h-56 rounded-sm overflow-hidden border border-[#E8E2D8] bg-[#F4F1EC] shadow-xs">
        {/* Vector stylized roads & terrain */}
        <svg
          viewBox="0 0 400 240"
          className="w-full h-full object-cover"
          preserveAspectRatio="none"
        >
          {/* Subtle green park area */}
          <path
            d="M 0,0 L 400,0 L 400,70 Q 280,60 210,100 T 0,110 Z"
            fill="#EAF0E8"
          />
          {/* Namsan forest indication */}
          <text
            x="20"
            y="35"
            fill="#9BAE99"
            fontSize="10"
            fontFamily="'Noto Serif KR', serif"
            letterSpacing="2"
          >
            남산 야외식물원 방면
          </text>

          {/* Roads */}
          {/* Sowol-ro Main Street */}
          <path
            d="M -10,130 Q 180,120 410,145"
            stroke="#FFFFFF"
            strokeWidth="16"
            fill="none"
          />
          <path
            d="M -10,130 Q 180,120 410,145"
            stroke="#DCD4C6"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            fill="none"
          />
          <text
            x="30"
            y="125"
            fill="#8E887E"
            fontSize="9"
            fontFamily="'Noto Serif KR', serif"
          >
            소월로
          </text>

          {/* Itaewon-ro Road */}
          <path
            d="M 120,240 L 260,135"
            stroke="#FFFFFF"
            strokeWidth="12"
            fill="none"
          />
          <text
            x="145"
            y="215"
            fill="#8E887E"
            fontSize="9"
            fontFamily="'Noto Serif KR', serif"
          >
            이태원로 방면
          </text>

          {/* Subway line 6 indication */}
          <circle cx="95" cy="225" r="10" fill="#CD7C2F" opacity="0.9" />
          <text
            x="95"
            y="228"
            fill="#FFFFFF"
            fontSize="8"
            fontWeight="bold"
            textAnchor="middle"
          >
            6
          </text>
          <text
            x="112"
            y="228"
            fill="#6B6257"
            fontSize="10"
            fontWeight="500"
            fontFamily="'Noto Serif KR', serif"
          >
            한강진역 2번 출구
          </text>

          {/* Shuttle bus route arrow */}
          <path
            d="M 115,210 Q 150,175 225,140"
            stroke="#8C7A68"
            strokeWidth="2"
            strokeDasharray="3 3"
            fill="none"
          />
          <text
            x="160"
            y="170"
            fill="#7B6957"
            fontSize="8"
            fontStyle="italic"
            fontFamily="'Noto Serif KR', serif"
          >
            셔틀버스 운행
          </text>

          {/* Venue Pin */}
          <g transform="translate(235, 120)">
            <circle cx="0" cy="0" r="18" fill="#B29D84" opacity="0.25" />
            <circle cx="0" cy="0" r="11" fill="#8C7A68" />
            <circle cx="0" cy="0" r="5" fill="#FAF8F5" />
            {/* Callout box */}
            <rect
              x="-65"
              y="-42"
              width="130"
              height="26"
              rx="4"
              fill="#2C2A29"
              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.15))"
            />
            <polygon points="-5,-16 5,-16 0,-11" fill="#2C2A29" />
            <text
              x="0"
              y="-25"
              fill="#FDFBF7"
              fontSize="10.5"
              fontWeight="500"
              textAnchor="middle"
              fontFamily="'Noto Serif KR', serif"
            >
              그랜드 하얏트 서울
            </text>
          </g>
        </svg>

        {/* Map overlay badge */}
        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-xs bg-white/80 backdrop-blur-xs border border-[#E2DBD0] text-[10px] text-[#7A7369] font-editorial-kr">
          용산구 한남동
        </div>
      </div>

      {/* Navigation Quick Links */}
      <div className="grid grid-cols-3 gap-2">
        <button
          id="naver-map-btn"
          onClick={openNaverMap}
          className="flex flex-col items-center justify-center py-2.5 px-2 rounded-sm bg-white border border-[#E5DFD5] hover:border-[#03C75A] hover:bg-[#F6FBF7] transition-all group shadow-2xs"
        >
          <span className="w-5 h-5 rounded-xs bg-[#03C75A] text-white flex items-center justify-center text-xs font-black mb-1">
            N
          </span>
          <span className="text-xs text-[#4A453F] group-hover:text-[#03C75A] font-medium font-editorial-kr">
            네이버 지도
          </span>
        </button>

        <button
          id="kakao-map-btn"
          onClick={openKakaoMap}
          className="flex flex-col items-center justify-center py-2.5 px-2 rounded-sm bg-white border border-[#E5DFD5] hover:border-[#FEE500] hover:bg-[#FFFCF0] transition-all group shadow-2xs"
        >
          <span className="w-5 h-5 rounded-xs bg-[#FEE500] text-[#191919] flex items-center justify-center text-xs font-black mb-1">
            K
          </span>
          <span className="text-xs text-[#4A453F] group-hover:text-[#3C1E1E] font-medium font-editorial-kr">
            카카오맵
          </span>
        </button>

        <button
          id="tmap-btn"
          onClick={openTmap}
          className="flex flex-col items-center justify-center py-2.5 px-2 rounded-sm bg-white border border-[#E5DFD5] hover:border-[#E81E25] hover:bg-[#FFF8F8] transition-all group shadow-2xs"
        >
          <span className="w-5 h-5 rounded-xs bg-[#E81E25] text-white flex items-center justify-center text-xs font-black mb-1">
            T
          </span>
          <span className="text-xs text-[#4A453F] group-hover:text-[#E81E25] font-medium font-editorial-kr">
            티맵
          </span>
        </button>
      </div>

      {/* Transit & Parking Details */}
      <div className="space-y-4 pt-3 border-t border-[#ECE6DD]">
        {/* Subway */}
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-full bg-[#EFECE6] text-[#7A6F62] shrink-0 mt-0.5">
            <Train className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h5 className="font-editorial-kr text-xs font-semibold text-[#3D3833]">
              지하철 안내
            </h5>
            <p className="font-editorial-kr text-xs text-[#6E675E] leading-relaxed">
              {subwayInfo}
            </p>
          </div>
        </div>

        {/* Bus */}
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-full bg-[#EFECE6] text-[#7A6F62] shrink-0 mt-0.5">
            <Bus className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h5 className="font-editorial-kr text-xs font-semibold text-[#3D3833]">
              버스 안내
            </h5>
            <p className="font-editorial-kr text-xs text-[#6E675E] leading-relaxed">
              {busInfo}
            </p>
          </div>
        </div>

        {/* Parking */}
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-full bg-[#EFECE6] text-[#7A6F62] shrink-0 mt-0.5">
            <Car className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <h5 className="font-editorial-kr text-xs font-semibold text-[#3D3833]">
              자가용 및 주차 안내
            </h5>
            <p className="font-editorial-kr text-xs text-[#6E675E] leading-relaxed">
              {parkingInfo}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
