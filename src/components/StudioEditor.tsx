import React, { useState } from 'react';
import {
  Sparkles,
  Users,
  Settings,
  Heart,
  Calendar,
  Image as ImageIcon,
  BookOpen,
  FileText,
  Download,
  RotateCcw,
  Check,
} from 'lucide-react';
import { WeddingData, RsvpEntry, GuestbookEntry } from '../types';
import { PhotoEditorTab } from './PhotoEditorTab';

interface StudioEditorProps {
  weddingData: WeddingData;
  onUpdateWeddingData: (newData: WeddingData) => void;
  rsvps: RsvpEntry[];
  guestbooks: GuestbookEntry[];
  onResetToDefault: () => void;
}

const GREETING_PRESETS = [
  {
    name: '클래식 감성',
    title: '소중한 분들을 초대합니다',
    quote: '서로를 바라보던 눈빛으로 이제는 같은 곳을 함께 바라보며 걸어가고자 합니다.',
    author: '이해인 · 사랑의 기도 중',
    paragraphs: [
      '봄날의 햇살처럼 따뜻하게 스며든 인연이',
      '어느덧 깊은 신뢰와 사랑으로 자라나',
      '평생을 함께할 약속의 자리를 마련하게 되었습니다.',
      '',
      '곁에서 아낌없는 사랑과 따뜻한 격려로',
      '저희 두 사람을 지켜봐 주신 소중한 분들을 모시고',
      '진실한 마음으로 첫걸음을 내딛고자 합니다.',
      '',
      '귀한 걸음으로 함께해 주시어',
      '저희의 새로운 시작을 축복해 주시면',
      '더없는 기쁨과 감사함으로 간직하겠습니다.',
    ],
  },
  {
    name: '서정적 계절',
    title: '저희 두 사람 결혼합니다',
    quote: '우리의 만남이 우연이 아니었듯, 우리가 함께할 날들도 아름다운 필연이기를.',
    author: '',
    paragraphs: [
      '살랑이는 바람결에 가을이 물들어가는 날,',
      '서로의 손을 잡고 같은 계절을 걸어가려 합니다.',
      '',
      '서로의 부족함을 채워주고',
      '기쁨은 나누어 배가 되게 하며',
      '작은 일에도 늘 감사하는 예쁜 가정을 이루겠습니다.',
      '',
      '바쁘시더라도 부디 참석해 주시어',
      '저희의 약속을 따뜻한 눈빛으로 축복해 주십시오.',
    ],
  },
  {
    name: '간결하고 정중한 인사',
    title: '결혼식에 초대합니다',
    quote: '',
    author: '',
    paragraphs: [
      '평소 저희를 아껴주시고 격려해 주신',
      '소중한 은혜에 깊이 감사드립니다.',
      '',
      '저희 두 사람이 믿음과 사랑으로 하나 되어',
      '인생의 새로운 출발선에 서게 되었습니다.',
      '',
      '새로운 삶을 시작하는 저희에게 오셔서',
      '따뜻한 격려와 축복의 말씀을 남겨주시면',
      '큰 힘과 기쁨이 되겠습니다.',
    ],
  },
];

export const StudioEditor: React.FC<StudioEditorProps> = ({
  weddingData,
  onUpdateWeddingData,
  rsvps,
  guestbooks,
  onResetToDefault,
}) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'info' | 'greeting' | 'petals' | 'rsvps'>('photos');
  const [saveToast, setSaveToast] = useState(false);

  const triggerSaveToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleApplyPreset = (presetIndex: number) => {
    const preset = GREETING_PRESETS[presetIndex];
    onUpdateWeddingData({
      ...weddingData,
      greeting: {
        title: preset.title,
        quote: preset.quote,
        author: preset.author,
        paragraphs: preset.paragraphs,
      },
    });
    triggerSaveToast();
  };

  // Export RSVPs to CSV
  const exportRsvpsCsv = () => {
    const headers = ['이름', '구분', '참석여부', '동반인원', '식사여부', '버스탑승', '연락처', '남긴말씀', '일자'];
    const rows = rsvps.map((r) => [
      r.name,
      r.side === 'groom' ? '신랑측' : '신부측',
      r.attendance === 'attend' ? '참석' : '불참',
      r.guestCount,
      r.meal === 'yes' ? '식사예정' : r.meal === 'no' ? '안함' : '미정',
      r.bus === 'yes' ? '탑승' : '미탑승',
      r.phone,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      r.createdAt,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `RSVP_명단_${weddingData.groom.name}_${weddingData.bride.name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalAttending = rsvps
    .filter((r) => r.attendance === 'attend')
    .reduce((acc, curr) => acc + curr.guestCount, 0);

  const totalMeals = rsvps
    .filter((r) => r.attendance === 'attend' && r.meal === 'yes')
    .reduce((acc, curr) => acc + curr.guestCount, 0);

  return (
    <div className="w-full bg-[#FAF8F5] border border-[#E5DFD5] rounded-sm shadow-xs flex flex-col h-full overflow-hidden text-[#2C2A29]">
      {/* Studio Header */}
      <div className="px-5 py-4 border-b border-[#EAE4DC] flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#2C2A29] text-white flex items-center justify-center text-xs">
            ✦
          </div>
          <div>
            <h2 className="font-editorial-kr text-sm font-semibold text-[#2C2A29]">
              디지털 청첩장 스튜디오
            </h2>
            <p className="font-editorial-kr text-[11px] text-[#8C847B]">
              실시간 편집 및 참석자 관리
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {saveToast && (
            <span className="text-[11px] font-editorial-kr text-[#557A2B] font-medium flex items-center gap-1 bg-[#F1F6EA] px-2 py-0.5 rounded-full border border-[#D5E5C2]">
              <Check className="w-3 h-3" /> 저장됨
            </span>
          )}
          <button
            id="reset-default-btn"
            onClick={onResetToDefault}
            className="text-[11px] font-editorial-kr text-[#8C847B] hover:text-[#2C2A29] flex items-center gap-1 px-2.5 py-1 rounded-xs border border-[#D9D3C9] bg-white transition-colors"
            title="기본 샘플 데이터로 복원"
          >
            <RotateCcw className="w-3 h-3" />
            <span>초기화</span>
          </button>
        </div>
      </div>

      {/* Studio Navigation Tabs */}
      <div className="flex border-b border-[#EAE4DC] bg-[#F4EFE7]/50 text-xs overflow-x-auto">
        <button
          id="studio-tab-photos"
          onClick={() => setActiveTab('photos')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 font-editorial-kr font-medium transition-all text-center border-b-2 flex items-center justify-center gap-1.5 ${
            activeTab === 'photos'
              ? 'border-[#2C2A29] text-[#2C2A29] bg-white font-semibold shadow-2xs'
              : 'border-transparent text-[#78726A] hover:text-[#2C2A29]'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5 text-[#8C7A68]" />
          <span>사진 넣기 (갤러리)</span>
        </button>

        <button
          id="studio-tab-info"
          onClick={() => setActiveTab('info')}
          className={`flex-1 min-w-[90px] py-2.5 px-3 font-editorial-kr font-medium transition-all text-center border-b-2 flex items-center justify-center gap-1.5 ${
            activeTab === 'info'
              ? 'border-[#2C2A29] text-[#2C2A29] bg-white font-semibold'
              : 'border-transparent text-[#78726A] hover:text-[#2C2A29]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>예식·인적 정보</span>
        </button>

        <button
          id="studio-tab-greeting"
          onClick={() => setActiveTab('greeting')}
          className={`flex-1 min-w-[90px] py-2.5 px-3 font-editorial-kr font-medium transition-all text-center border-b-2 flex items-center justify-center gap-1.5 ${
            activeTab === 'greeting'
              ? 'border-[#2C2A29] text-[#2C2A29] bg-white font-semibold'
              : 'border-transparent text-[#78726A] hover:text-[#2C2A29]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>초대글 문구</span>
        </button>

        <button
          id="studio-tab-petals"
          onClick={() => setActiveTab('petals')}
          className={`flex-1 min-w-[90px] py-2.5 px-3 font-editorial-kr font-medium transition-all text-center border-b-2 flex items-center justify-center gap-1.5 ${
            activeTab === 'petals'
              ? 'border-[#2C2A29] text-[#2C2A29] bg-white font-semibold'
              : 'border-transparent text-[#78726A] hover:text-[#2C2A29]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>꽃잎·효과 설정</span>
        </button>

        <button
          id="studio-tab-rsvps"
          onClick={() => setActiveTab('rsvps')}
          className={`flex-1 min-w-[90px] py-2.5 px-3 font-editorial-kr font-medium transition-all text-center border-b-2 flex items-center justify-center gap-1.5 ${
            activeTab === 'rsvps'
              ? 'border-[#2C2A29] text-[#2C2A29] bg-white font-semibold'
              : 'border-transparent text-[#78726A] hover:text-[#2C2A29]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>RSVP 관리 ({rsvps.length})</span>
        </button>
      </div>

      {/* Tab Content Panels */}
      <div className="p-5 flex-1 overflow-y-auto space-y-6">
        {/* ========================================================
            TAB 0: 사진·갤러리 관리 (<갤러리 0> 및 <갤러리 1~5>)
        ======================================================== */}
        {activeTab === 'photos' && (
          <PhotoEditorTab
            weddingData={weddingData}
            onUpdateWeddingData={onUpdateWeddingData}
            triggerSaveToast={triggerSaveToast}
          />
        )}

        {/* ========================================================
            TAB 1: 예식 & 인적 정보
        ======================================================== */}
        {activeTab === 'info' && (
          <div className="space-y-6">
            {/* 신랑 & 신부 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Groom */}
              <div className="p-4 rounded-xs border border-[#E5DFD5] bg-white space-y-3">
                <span className="text-xs font-semibold text-[#57728B] font-editorial-kr flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#57728B]" />
                  신랑측 정보
                </span>

                <div className="space-y-1">
                  <label className="text-[11px] text-[#7A7369]">신랑 성함 (한글/영문)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={weddingData.groom.name}
                      onChange={(e) => {
                        onUpdateWeddingData({
                          ...weddingData,
                          groom: { ...weddingData.groom, name: e.target.value },
                        });
                        triggerSaveToast();
                      }}
                      className="px-2.5 py-1.5 text-xs rounded-xs border border-[#D9D3C9] bg-[#FAF8F5]"
                    />
                    <input
                      type="text"
                      value={weddingData.groom.engName}
                      onChange={(e) => {
                        onUpdateWeddingData({
                          ...weddingData,
                          groom: { ...weddingData.groom, engName: e.target.value },
                        });
                        triggerSaveToast();
                      }}
                      placeholder="English Name"
                      className="px-2.5 py-1.5 text-xs rounded-xs border border-[#D9D3C9] bg-[#FAF8F5]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-[#7A7369]">혼주 성함 (부 / 모 / 관계)</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <input
                      type="text"
                      placeholder="부 성함"
                      value={weddingData.groom.father}
                      onChange={(e) => {
                        onUpdateWeddingData({
                          ...weddingData,
                          groom: { ...weddingData.groom, father: e.target.value },
                        });
                        triggerSaveToast();
                      }}
                      className="px-2 py-1.5 text-xs rounded-xs border border-[#D9D3C9] bg-[#FAF8F5]"
                    />
                    <input
                      type="text"
                      placeholder="모 성함"
                      value={weddingData.groom.mother}
                      onChange={(e) => {
                        onUpdateWeddingData({
                          ...weddingData,
                          groom: { ...weddingData.groom, mother: e.target.value },
                        });
                        triggerSaveToast();
                      }}
                      className="px-2 py-1.5 text-xs rounded-xs border border-[#D9D3C9] bg-[#FAF8F5]"
                    />
                    <input
                      type="text"
                      placeholder="관계 (장남)"
                      value={weddingData.groom.relation}
                      onChange={(e) => {
                        onUpdateWeddingData({
                          ...weddingData,
                          groom: { ...weddingData.groom, relation: e.target.value },
                        });
                        triggerSaveToast();
                      }}
                      className="px-2 py-1.5 text-xs rounded-xs border border-[#D9D3C9] bg-[#FAF8F5]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-[#7A7369]">신랑 연락처</label>
                  <input
                    type="text"
                    value={weddingData.groom.phone}
                    onChange={(e) => {
                      onUpdateWeddingData({
                        ...weddingData,
                        groom: { ...weddingData.groom, phone: e.target.value },
                      });
                      triggerSaveToast();
                    }}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xs border border-[#D9D3C9] bg-[#FAF8F5]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-[#7A7369]">신랑 계좌 (은행명 / 계좌번호)</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <input
                      type="text"
                      value={weddingData.groom.account.bank}
                      onChange={(e) => {
                        onUpdateWeddingData({
                          ...weddingData,
                          groom: {
                            ...weddingData.groom,
                            account: { ...weddingData.groom.account, bank: e.target.value },
                          },
                        });
                        triggerSaveToast();
                      }}
                      className="px-2 py-1.5 text-xs rounded-xs border border-[#D9D3C9] bg-[#FAF8F5]"
                    />
                    <input
                      type="text"
                      value={weddingData.groom.account.number}
                      onChange={(e) => {
                        onUpdateWeddingData({
                          ...weddingData,
                          groom: {
                            ...weddingData.groom,
                            account: { ...weddingData.groom.account, number: e.target.value },
                          },
                        });
                        triggerSaveToast();
                      }}
                      className="col-span-2 px-2 py-1.5 text-xs rounded-xs border border-[#D9D3C9] bg-[#FAF8F5]"
                    />
                  </div>
                </div>
              </div>

              {/* Bride */}
              <div className="p-4 rounded-xs border border-[#E5DFD5] bg-white space-y-3">
                <span className="text-xs font-semibold text-[#8B5767] font-editorial-kr flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#8B5767]" />
                  신부측 정보
                </span>

                <div className="space-y-1">
                  <label className="text-[11px] text-[#7A7369]">신부 성함 (한글/영문)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={weddingData.bride.name}
                      onChange={(e) => {
                        onUpdateWeddingData({
                          ...weddingData,
                          bride: { ...weddingData.bride, name: e.target.value },
                        });
                        triggerSaveToast();
                      }}
                      className="px-2.5 py-1.5 text-xs rounded-xs border border-[#D9D3C9] bg-[#FAF8F5]"
                    />
                    <input
                      type="text"
                      value={weddingData.bride.engName}
                      onChange={(e) => {
                        onUpdateWeddingData({
                          ...weddingData,
                          bride: { ...weddingData.bride, engName: e.target.value },
                        });
                        triggerSaveToast();
                      }}
                      placeholder="English Name"
                      className="px-2.5 py-1.5 text-xs rounded-xs border border-[#D9D3C9] bg-[#FAF8F5]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-[#7A7369]">혼주 성함 (부 / 모 / 관계)</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <input
                      type="text"
                      placeholder="부 성함"
                      value={weddingData.bride.father}
                      onChange={(e) => {
                        onUpdateWeddingData({
                          ...weddingData,
                          bride: { ...weddingData.bride, father: e.target.value },
                        });
                        triggerSaveToast();
                      }}
                      className="px-2 py-1.5 text-xs rounded-xs border border-[#D9D3C9] bg-[#FAF8F5]"
                    />
                    <input
                      type="text"
                      placeholder="모 성함"
                      value={weddingData.bride.mother}
                      onChange={(e) => {
                        onUpdateWeddingData({
                          ...weddingData,
                          bride: { ...weddingData.bride, mother: e.target.value },
                        });
                        triggerSaveToast();
                      }}
                      className="px-2 py-1.5 text-xs rounded-xs border border-[#D9D3C9] bg-[#FAF8F5]"
                    />
                    <input
                      type="text"
                      placeholder="관계 (차녀)"
                      value={weddingData.bride.relation}
                      onChange={(e) => {
                        onUpdateWeddingData({
                          ...weddingData,
                          bride: { ...weddingData.bride, relation: e.target.value },
                        });
                        triggerSaveToast();
                      }}
                      className="px-2 py-1.5 text-xs rounded-xs border border-[#D9D3C9] bg-[#FAF8F5]"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-[#7A7369]">신부 연락처</label>
                  <input
                    type="text"
                    value={weddingData.bride.phone}
                    onChange={(e) => {
                      onUpdateWeddingData({
                        ...weddingData,
                        bride: { ...weddingData.bride, phone: e.target.value },
                      });
                      triggerSaveToast();
                    }}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xs border border-[#D9D3C9] bg-[#FAF8F5]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-[#7A7369]">신부 계좌 (은행명 / 계좌번호)</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <input
                      type="text"
                      value={weddingData.bride.account.bank}
                      onChange={(e) => {
                        onUpdateWeddingData({
                          ...weddingData,
                          bride: {
                            ...weddingData.bride,
                            account: { ...weddingData.bride.account, bank: e.target.value },
                          },
                        });
                        triggerSaveToast();
                      }}
                      className="px-2 py-1.5 text-xs rounded-xs border border-[#D9D3C9] bg-[#FAF8F5]"
                    />
                    <input
                      type="text"
                      value={weddingData.bride.account.number}
                      onChange={(e) => {
                        onUpdateWeddingData({
                          ...weddingData,
                          bride: {
                            ...weddingData.bride,
                            account: { ...weddingData.bride.account, number: e.target.value },
                          },
                        });
                        triggerSaveToast();
                      }}
                      className="col-span-2 px-2 py-1.5 text-xs rounded-xs border border-[#D9D3C9] bg-[#FAF8F5]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 예식 일시 및 장소 */}
            <div className="p-4 rounded-xs border border-[#E5DFD5] bg-white space-y-3">
              <span className="text-xs font-semibold text-[#2C2A29] font-editorial-kr block">
                예식 일시 및 장소 안내
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-[#7A7369]">예식일 (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    value={weddingData.wedding.date}
                    onChange={(e) => {
                      const newDate = e.target.value;
                      onUpdateWeddingData({
                        ...weddingData,
                        wedding: {
                          ...weddingData.wedding,
                          date: newDate,
                        },
                      });
                      triggerSaveToast();
                    }}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xs border border-[#D9D3C9] bg-[#FAF8F5]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] text-[#7A7369]">예식 시간 (HH:mm)</label>
                  <input
                    type="time"
                    value={weddingData.wedding.time}
                    onChange={(e) => {
                      onUpdateWeddingData({
                        ...weddingData,
                        wedding: { ...weddingData.wedding, time: e.target.value },
                      });
                      triggerSaveToast();
                    }}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xs border border-[#D9D3C9] bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] text-[#7A7369]">예식장 이름</label>
                  <input
                    type="text"
                    value={weddingData.wedding.venueName}
                    onChange={(e) => {
                      onUpdateWeddingData({
                        ...weddingData,
                        wedding: { ...weddingData.wedding, venueName: e.target.value },
                      });
                      triggerSaveToast();
                    }}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xs border border-[#D9D3C9] bg-[#FAF8F5]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] text-[#7A7369]">홀 및 층수</label>
                  <input
                    type="text"
                    value={weddingData.wedding.hallName}
                    onChange={(e) => {
                      onUpdateWeddingData({
                        ...weddingData,
                        wedding: { ...weddingData.wedding, hallName: e.target.value },
                      });
                      triggerSaveToast();
                    }}
                    className="w-full px-2.5 py-1.5 text-xs rounded-xs border border-[#D9D3C9] bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-[#7A7369]">예식장 도로명 주소</label>
                <input
                  type="text"
                  value={weddingData.wedding.address}
                  onChange={(e) => {
                    onUpdateWeddingData({
                      ...weddingData,
                      wedding: { ...weddingData.wedding, address: e.target.value },
                    });
                    triggerSaveToast();
                  }}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xs border border-[#D9D3C9] bg-[#FAF8F5]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: 초대글 문구 프리셋 & 편집
        ======================================================== */}
        {activeTab === 'greeting' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-[#2C2A29] font-editorial-kr block">
                에디토리얼 문구 프리셋 적용하기
              </label>
              <div className="grid grid-cols-3 gap-2">
                {GREETING_PRESETS.map((preset, idx) => (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => handleApplyPreset(idx)}
                    className="p-3 text-left rounded-xs border border-[#E2DBD0] bg-white hover:bg-[#F6F2EC] hover:border-[#8C7A68] transition-all group"
                  >
                    <span className="block font-editorial-kr text-xs font-semibold text-[#2C2A29] group-hover:text-[#8C7A68]">
                      {preset.name}
                    </span>
                    <span className="block font-editorial-kr text-[11px] text-[#8C847B] truncate mt-1">
                      {preset.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xs border border-[#E5DFD5] bg-white space-y-3">
              <span className="text-xs font-semibold text-[#2C2A29] font-editorial-kr block">
                초대글 직접 편집
              </span>

              <div className="space-y-1">
                <label className="text-[11px] text-[#7A7369]">초대글 제목</label>
                <input
                  type="text"
                  value={weddingData.greeting.title}
                  onChange={(e) => {
                    onUpdateWeddingData({
                      ...weddingData,
                      greeting: { ...weddingData.greeting, title: e.target.value },
                    });
                    triggerSaveToast();
                  }}
                  className="w-full px-2.5 py-1.5 text-xs rounded-xs border border-[#D9D3C9] bg-[#FAF8F5]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-[#7A7369]">서두 인용구 또는 시 구절</label>
                <input
                  type="text"
                  value={weddingData.greeting.quote || ''}
                  onChange={(e) => {
                    onUpdateWeddingData({
                      ...weddingData,
                      greeting: { ...weddingData.greeting, quote: e.target.value },
                    });
                    triggerSaveToast();
                  }}
                  placeholder="인용구 (비워두셔도 됩니다)"
                  className="w-full px-2.5 py-1.5 text-xs rounded-xs border border-[#D9D3C9] bg-[#FAF8F5]"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-[#7A7369]">초대 본문 (줄바꿈 가능)</label>
                <textarea
                  rows={8}
                  value={weddingData.greeting.paragraphs.join('\n')}
                  onChange={(e) => {
                    onUpdateWeddingData({
                      ...weddingData,
                      greeting: {
                        ...weddingData.greeting,
                        paragraphs: e.target.value.split('\n'),
                      },
                    });
                    triggerSaveToast();
                  }}
                  className="w-full px-2.5 py-2 text-xs rounded-xs border border-[#D9D3C9] bg-[#FAF8F5] leading-relaxed resize-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: 꽃잎 & 효과 설정
        ======================================================== */}
        {activeTab === 'petals' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xs border border-[#E5DFD5] bg-white space-y-4">
              <span className="text-xs font-semibold text-[#2C2A29] font-editorial-kr block">
                배경 꽃잎 애니메이션
              </span>

              {/* Toggle switch */}
              <div className="flex items-center justify-between py-2 border-b border-[#F0EBE3]">
                <div>
                  <span className="font-editorial-kr text-xs font-medium text-[#2C2A29] block">
                    꽃잎 효과 활성화
                  </span>
                  <p className="font-editorial-kr text-[11px] text-[#8C847B]">
                    배경에 은은하게 흩날리는 꽃잎 효과를 켭니다.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onUpdateWeddingData({
                      ...weddingData,
                      settings: {
                        ...weddingData.settings,
                        showPetals: !weddingData.settings.showPetals,
                      },
                    });
                    triggerSaveToast();
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative ${
                    weddingData.settings.showPetals ? 'bg-[#2C2A29]' : 'bg-[#D5CEC4]'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white shadow-xs transition-transform transform ${
                      weddingData.settings.showPetals ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Petal Style Selection */}
              <div className="space-y-2">
                <label className="text-[11px] text-[#7A7369] font-editorial-kr font-medium">
                  꽃잎 종류 선택
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onUpdateWeddingData({
                        ...weddingData,
                        settings: { ...weddingData.settings, petalStyle: 'sakura' },
                      });
                      triggerSaveToast();
                    }}
                    className={`p-3 rounded-xs border text-center transition-all ${
                      weddingData.settings.petalStyle === 'sakura'
                        ? 'border-[#2C2A29] bg-[#FFF5F8] text-[#2C2A29] font-medium'
                        : 'border-[#E2DBD0] bg-[#FAF8F5] text-[#7A7369]'
                    }`}
                  >
                    <span className="text-lg block mb-1">🌸</span>
                    <span className="text-xs font-editorial-kr">핑크 벚꽃</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onUpdateWeddingData({
                        ...weddingData,
                        settings: { ...weddingData.settings, petalStyle: 'white-rose' },
                      });
                      triggerSaveToast();
                    }}
                    className={`p-3 rounded-xs border text-center transition-all ${
                      weddingData.settings.petalStyle === 'white-rose'
                        ? 'border-[#2C2A29] bg-[#FDFCFB] text-[#2C2A29] font-medium'
                        : 'border-[#E2DBD0] bg-[#FAF8F5] text-[#7A7369]'
                    }`}
                  >
                    <span className="text-lg block mb-1">🤍</span>
                    <span className="text-xs font-editorial-kr">순백 장미</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      onUpdateWeddingData({
                        ...weddingData,
                        settings: { ...weddingData.settings, petalStyle: 'golden' },
                      });
                      triggerSaveToast();
                    }}
                    className={`p-3 rounded-xs border text-center transition-all ${
                      weddingData.settings.petalStyle === 'golden'
                        ? 'border-[#2C2A29] bg-[#FFFBF0] text-[#2C2A29] font-medium'
                        : 'border-[#E2DBD0] bg-[#FAF8F5] text-[#7A7369]'
                    }`}
                  >
                    <span className="text-lg block mb-1">✨</span>
                    <span className="text-xs font-editorial-kr">샴페인 골드</span>
                  </button>
                </div>
              </div>

              {/* Speed Slider */}
              <div className="space-y-1 pt-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-editorial-kr text-[#7A7369]">낙하 속도</span>
                  <span className="font-editorial-en font-medium text-[#2C2A29]">
                    {weddingData.settings.petalSpeed}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.25"
                  value={weddingData.settings.petalSpeed}
                  onChange={(e) => {
                    onUpdateWeddingData({
                      ...weddingData,
                      settings: {
                        ...weddingData.settings,
                        petalSpeed: parseFloat(e.target.value),
                      },
                    });
                  }}
                  className="w-full accent-[#2C2A29]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: RSVP 관리 (참석자 응답 리스트)
        ======================================================== */}
        {activeTab === 'rsvps' && (
          <div className="space-y-4">
            {/* Quick stats summary */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-white border border-[#E5DFD5] rounded-xs text-center">
                <span className="block font-editorial-kr text-[11px] text-[#7A7369]">총 응답자</span>
                <span className="font-editorial-en text-lg font-bold text-[#2C2A29]">
                  {rsvps.length}명
                </span>
              </div>
              <div className="p-3 bg-white border border-[#E5DFD5] rounded-xs text-center">
                <span className="block font-editorial-kr text-[11px] text-[#7A7369]">총 참석 인원</span>
                <span className="font-editorial-en text-lg font-bold text-[#3B662C]">
                  {totalAttending}명
                </span>
              </div>
              <div className="p-3 bg-white border border-[#E5DFD5] rounded-xs text-center">
                <span className="block font-editorial-kr text-[11px] text-[#7A7369]">식사 예정</span>
                <span className="font-editorial-en text-lg font-bold text-[#7A612C]">
                  {totalMeals}명
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-1">
              <span className="font-editorial-kr text-xs text-[#7A7369]">
                최근 응답 순서대로 정렬됩니다
              </span>
              <button
                id="export-rsvp-csv-btn"
                onClick={exportRsvpsCsv}
                disabled={rsvps.length === 0}
                className="px-3 py-1.5 rounded-xs border border-[#D5CEC4] bg-white text-xs text-[#524B43] hover:bg-[#F2ECE3] transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-[#827B72]" />
                <span>CSV 엑셀 다운로드</span>
              </button>
            </div>

            {/* List */}
            {rsvps.length === 0 ? (
              <div className="py-12 text-center text-xs text-[#999288] bg-white rounded-xs border border-[#EAE4DC]">
                아직 제출된 RSVP 참석 응답이 없습니다.
              </div>
            ) : (
              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {rsvps.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 rounded-xs border border-[#E8E2D8] bg-white space-y-1.5 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-xs font-semibold ${
                            entry.side === 'groom'
                              ? 'bg-[#EBF2F7] text-[#3D6688]'
                              : 'bg-[#F9ECEF] text-[#8C4659]'
                          }`}
                        >
                          {entry.side === 'groom' ? '신랑측' : '신부측'}
                        </span>
                        <span className="font-editorial-kr text-xs font-bold text-[#2C2A29]">
                          {entry.name}
                        </span>
                        {entry.attendance === 'attend' ? (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-[#EAF5E5] text-[#387024] font-medium">
                            참석 ({entry.guestCount}명)
                          </span>
                        ) : (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-xs bg-[#F4F1EC] text-[#7A7268]">
                            마음으로 축하
                          </span>
                        )}
                      </div>

                      <span className="font-editorial-en text-[11px] text-[#A39B90]">
                        {entry.createdAt}
                      </span>
                    </div>

                    {entry.attendance === 'attend' && (
                      <div className="flex items-center gap-3 text-[11px] text-[#78726A] font-editorial-kr">
                        <span>
                          식사:{' '}
                          <strong className="text-[#38332E]">
                            {entry.meal === 'yes' ? '예정' : entry.meal === 'no' ? '안함' : '미정'}
                          </strong>
                        </span>
                        <span>
                          버스:{' '}
                          <strong className="text-[#38332E]">
                            {entry.bus === 'yes' ? '탑승' : '미탑승'}
                          </strong>
                        </span>
                        {entry.phone && (
                          <span className="text-[#8C847B] font-mono">{entry.phone}</span>
                        )}
                      </div>
                    )}

                    {entry.message && (
                      <p className="text-[11px] text-[#635C53] bg-[#FAF8F5] p-2 rounded-xs border border-[#F0EBE3] whitespace-pre-wrap">
                        {entry.message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
