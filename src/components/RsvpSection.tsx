import React, { useState } from 'react';
import { Check, Heart, Users, Utensils, Send, CheckCircle2 } from 'lucide-react';
import { RsvpEntry } from '../types';

interface RsvpSectionProps {
  onAddRsvp: (entry: RsvpEntry) => void;
  groomName: string;
  brideName: string;
}

export const RsvpSection: React.FC<RsvpSectionProps> = ({
  onAddRsvp,
  groomName,
  brideName,
}) => {
  const [side, setSide] = useState<'groom' | 'bride'>('groom');
  const [attendance, setAttendance] = useState<'attend' | 'absent'>('attend');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [guestCount, setGuestCount] = useState(1);
  const [meal, setMeal] = useState<'yes' | 'no' | 'undecided'>('yes');
  const [bus, setBus] = useState<'yes' | 'no'>('no');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newEntry: RsvpEntry = {
      id: 'rsvp-' + Date.now(),
      name: name.trim(),
      side,
      attendance,
      guestCount: attendance === 'attend' ? guestCount : 0,
      meal: attendance === 'attend' ? meal : 'no',
      bus: attendance === 'attend' ? bus : 'no',
      phone: phone.trim(),
      message: message.trim(),
      createdAt: new Date().toLocaleDateString('ko-KR'),
    };

    onAddRsvp(newEntry);
    setIsSubmitted(true);
  };

  return (
    <div className="w-full bg-[#FAF8F5] p-6 rounded-sm border border-[#E8E2D8] text-[#2C2A29]">
      {isSubmitted ? (
        <div className="py-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#EAE4DC] flex items-center justify-center mx-auto text-[#7D6E5D]">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="font-editorial-kr text-base font-semibold text-[#2C2A29]">
            참석 여부가 전달되었습니다
          </h4>
          <p className="font-editorial-kr text-xs text-[#7A7369] leading-relaxed max-w-xs mx-auto">
            소중한 시간을 내어 응답해 주셔서 진심으로 감사드립니다. 두 사람의 기쁜 날에 뵙겠습니다.
          </p>
          <button
            id="rsvp-resubmit-btn"
            onClick={() => setIsSubmitted(false)}
            className="mt-4 text-xs underline text-[#9C8F80] hover:text-[#524B43]"
          >
            내용 수정하여 다시 제출하기
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Side selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#655F57] tracking-wider">
              구분
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSide('groom')}
                className={`py-2 px-3 text-xs rounded-xs border text-center transition-all ${
                  side === 'groom'
                    ? 'bg-[#2C2A29] text-white border-[#2C2A29] font-medium shadow-2xs'
                    : 'bg-white text-[#686158] border-[#DCD6CC] hover:bg-[#F3EFE9]'
                }`}
              >
                신랑측 ({groomName})
              </button>
              <button
                type="button"
                onClick={() => setSide('bride')}
                className={`py-2 px-3 text-xs rounded-xs border text-center transition-all ${
                  side === 'bride'
                    ? 'bg-[#2C2A29] text-white border-[#2C2A29] font-medium shadow-2xs'
                    : 'bg-white text-[#686158] border-[#DCD6CC] hover:bg-[#F3EFE9]'
                }`}
              >
                신부측 ({brideName})
              </button>
            </div>
          </div>

          {/* Attendance Choice */}
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-[#655F57] tracking-wider">
              참석 여부
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAttendance('attend')}
                className={`py-2.5 px-3 text-xs rounded-xs border text-center transition-all flex items-center justify-center gap-1.5 ${
                  attendance === 'attend'
                    ? 'bg-[#2C2A29] text-white border-[#2C2A29] font-medium'
                    : 'bg-white text-[#686158] border-[#DCD6CC] hover:bg-[#F3EFE9]'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                참석합니다
              </button>
              <button
                type="button"
                onClick={() => setAttendance('absent')}
                className={`py-2.5 px-3 text-xs rounded-xs border text-center transition-all flex items-center justify-center gap-1.5 ${
                  attendance === 'absent'
                    ? 'bg-[#2C2A29] text-white border-[#2C2A29] font-medium'
                    : 'bg-white text-[#686158] border-[#DCD6CC] hover:bg-[#F3EFE9]'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                마음으로 축하합니다
              </button>
            </div>
          </div>

          {/* Name & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs text-[#6E6860]">
                성함 <span className="text-[#A45050]">*</span>
              </label>
              <input
                id="rsvp-input-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="참석자 성함"
                className="w-full px-3 py-2 text-xs bg-white rounded-xs border border-[#D9D3C9] focus:outline-none focus:border-[#7D6E5D] text-[#2C2A29]"
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs text-[#6E6860]">
                연락처 <span className="text-[#999] text-[10px]">(선택)</span>
              </label>
              <input
                id="rsvp-input-phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                className="w-full px-3 py-2 text-xs bg-white rounded-xs border border-[#D9D3C9] focus:outline-none focus:border-[#7D6E5D] text-[#2C2A29]"
              />
            </div>
          </div>

          {/* Conditional questions if attending */}
          {attendance === 'attend' && (
            <>
              {/* Guest Count */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-[#6E6860]">
                    동반 인원 (본인 포함)
                  </label>
                  <span className="text-xs font-medium text-[#2C2A29]">
                    총 {guestCount}명
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setGuestCount(count)}
                      className={`flex-1 py-1.5 text-xs rounded-xs border transition-all ${
                        guestCount === count
                          ? 'bg-[#4A433B] text-white border-[#4A433B] font-semibold'
                          : 'bg-white text-[#686158] border-[#DDD7CD] hover:bg-[#F3EFE9]'
                      }`}
                    >
                      {count}명
                    </button>
                  ))}
                </div>
              </div>

              {/* Meal Choice */}
              <div className="space-y-1.5">
                <label className="block text-xs text-[#6E6860]">
                  식사 여부
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setMeal('yes')}
                    className={`py-1.5 px-2 text-xs rounded-xs border text-center transition-all ${
                      meal === 'yes'
                        ? 'bg-[#4A433B] text-white border-[#4A433B] font-medium'
                        : 'bg-white text-[#686158] border-[#DDD7CD]'
                    }`}
                  >
                    예정
                  </button>
                  <button
                    type="button"
                    onClick={() => setMeal('no')}
                    className={`py-1.5 px-2 text-xs rounded-xs border text-center transition-all ${
                      meal === 'no'
                        ? 'bg-[#4A433B] text-white border-[#4A433B] font-medium'
                        : 'bg-white text-[#686158] border-[#DDD7CD]'
                    }`}
                  >
                    안함
                  </button>
                  <button
                    type="button"
                    onClick={() => setMeal('undecided')}
                    className={`py-1.5 px-2 text-xs rounded-xs border text-center transition-all ${
                      meal === 'undecided'
                        ? 'bg-[#4A433B] text-white border-[#4A433B] font-medium'
                        : 'bg-white text-[#686158] border-[#DDD7CD]'
                    }`}
                  >
                    미정
                  </button>
                </div>
              </div>

              {/* Shuttle / Bus */}
              <div className="space-y-1.5">
                <label className="block text-xs text-[#6E6860]">
                  대절 버스 탑승 여부
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBus('yes')}
                    className={`py-1.5 px-2 text-xs rounded-xs border text-center transition-all ${
                      bus === 'yes'
                        ? 'bg-[#4A433B] text-white border-[#4A433B] font-medium'
                        : 'bg-white text-[#686158] border-[#DDD7CD]'
                    }`}
                  >
                    탑승 희망
                  </button>
                  <button
                    type="button"
                    onClick={() => setBus('no')}
                    className={`py-1.5 px-2 text-xs rounded-xs border text-center transition-all ${
                      bus === 'no'
                        ? 'bg-[#4A433B] text-white border-[#4A433B] font-medium'
                        : 'bg-white text-[#686158] border-[#DDD7CD]'
                    }`}
                  >
                    탑승 안함 (개별 이동)
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Message to couple */}
          <div className="space-y-1">
            <label className="block text-xs text-[#6E6860]">
              신랑·신부에게 전할 말씀 <span className="text-[#999] text-[10px]">(선택)</span>
            </label>
            <textarea
              id="rsvp-input-message"
              rows={2}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="동행인 이름이나 축하 메모를 남겨주세요."
              className="w-full px-3 py-2 text-xs bg-white rounded-xs border border-[#D9D3C9] focus:outline-none focus:border-[#7D6E5D] text-[#2C2A29] resize-none"
            />
          </div>

          {/* Submit button */}
          <button
            id="rsvp-submit-btn"
            type="submit"
            className="w-full py-3 px-4 bg-[#2C2A29] hover:bg-[#1A1817] text-[#FAF8F5] rounded-xs text-xs font-medium tracking-widest transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <span>참석 정보 전달하기</span>
            <Send className="w-3.5 h-3.5 opacity-80" />
          </button>
        </form>
      )}
    </div>
  );
};
