import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Heart, Plus } from 'lucide-react';

interface CalendarDDayProps {
  weddingDateStr: string; // YYYY-MM-DD
  weddingTimeStr: string; // HH:mm
  venueName: string;
  hallName: string;
}

export const CalendarDDay: React.FC<CalendarDDayProps> = ({
  weddingDateStr,
  weddingTimeStr,
  venueName,
  hallName,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isPast: false,
  });

  useEffect(() => {
    const targetTime = new Date(`${weddingDateStr}T${weddingTimeStr}:00`).getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isPast: false });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [weddingDateStr, weddingTimeStr]);

  // Generate calendar days for wedding month
  const weddingDate = new Date(`${weddingDateStr}T00:00:00`);
  const year = weddingDate.getFullYear();
  const month = weddingDate.getMonth(); // 0-indexed
  const weddingDayNum = weddingDate.getDate();

  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0: Sun, 1: Mon...
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  const addToGoogleCalendar = () => {
    const title = encodeURIComponent(`강민혁 ♥ 이서연 결혼식`);
    const details = encodeURIComponent(`강민혁과 이서연의 결혼식에 초대합니다.\n장소: ${venueName} ${hallName}`);
    const location = encodeURIComponent(`${venueName} ${hallName}`);
    // Start date format YYYYMMDDTHHmmSSZ
    const startIso = weddingDateStr.replace(/-/g, '') + 'T043000Z'; // rough UTC
    const endIso = weddingDateStr.replace(/-/g, '') + 'T063000Z';

    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startIso}/${endIso}&details=${details}&location=${location}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full space-y-6">
      {/* Calendar Card */}
      <div className="p-5 rounded-sm border border-[#E8E2D8] bg-white shadow-2xs">
        {/* Month Header */}
        <div className="text-center pb-3 border-b border-[#F0EBE3]">
          <span className="font-editorial-en text-xl tracking-widest text-[#2C2A29] uppercase">
            {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(weddingDate)}
          </span>
          <p className="font-editorial-kr text-xs text-[#8C847A] pt-0.5">
            {year}년 {month + 1}월
          </p>
        </div>

        {/* Days of week */}
        <div className="grid grid-cols-7 text-center pt-3 pb-1 text-[11px] font-editorial-en tracking-wider text-[#A69E92]">
          <span className="text-[#C26B6B]">SUN</span>
          <span>MON</span>
          <span>TUE</span>
          <span>WED</span>
          <span>THU</span>
          <span>FRI</span>
          <span className="text-[#6B85C2]">SAT</span>
        </div>

        {/* Dates Grid */}
        <div className="grid grid-cols-7 text-center text-xs gap-y-1 py-1 font-editorial-kr">
          {calendarDays.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="h-8" />;
            }

            const isWeddingDay = day === weddingDayNum;
            const isSunday = idx % 7 === 0;
            const isSaturday = idx % 7 === 6;

            return (
              <div
                key={`day-${day}`}
                className="h-8 flex items-center justify-center relative"
              >
                {isWeddingDay ? (
                  <div className="w-7 h-7 rounded-full bg-[#2C2A29] text-white flex flex-col items-center justify-center shadow-xs">
                    <span className="text-[11px] font-bold leading-none">{day}</span>
                    <Heart className="w-2 h-2 text-[#E8C0C0] fill-current" />
                  </div>
                ) : (
                  <span
                    className={`${
                      isSunday
                        ? 'text-[#B85C5C]'
                        : isSaturday
                        ? 'text-[#5C78B8]'
                        : 'text-[#4A453F]'
                    }`}
                  >
                    {day}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Add to Calendar Button */}
        <div className="pt-4 mt-2 border-t border-[#F2EDE5] text-center">
          <button
            id="add-to-calendar-btn"
            onClick={addToGoogleCalendar}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#D5CEC3] bg-[#FAF8F5] text-xs text-[#524B42] hover:bg-[#F2ECE2] transition-colors"
          >
            <CalendarIcon className="w-3.5 h-3.5 text-[#8A7E72]" />
            <span>구글 캘린더에 일정 등록</span>
          </button>
        </div>
      </div>

      {/* Countdown Box */}
      <div className="p-4 rounded-sm bg-[#FAF8F5] border border-[#E8E2D8] text-center space-y-3">
        <div className="flex items-center justify-center gap-1.5 text-[#7A7268]">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-editorial-kr text-xs tracking-wider">
            우리의 특별한 날까지
          </span>
        </div>

        {timeLeft.isPast ? (
          <div className="font-editorial-kr text-sm text-[#4A433B] font-medium py-1">
            두 사람의 결혼식이 아름답게 시작되었습니다 ✨
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
            <div className="bg-white p-2 rounded-xs border border-[#E8E3DB]">
              <span className="block font-editorial-en text-lg md:text-xl font-semibold text-[#2C2A29]">
                {timeLeft.days}
              </span>
              <span className="block text-[10px] text-[#8C847B] font-editorial-en tracking-wider">
                DAYS
              </span>
            </div>
            <div className="bg-white p-2 rounded-xs border border-[#E8E3DB]">
              <span className="block font-editorial-en text-lg md:text-xl font-semibold text-[#2C2A29]">
                {timeLeft.hours}
              </span>
              <span className="block text-[10px] text-[#8C847B] font-editorial-en tracking-wider">
                HOURS
              </span>
            </div>
            <div className="bg-white p-2 rounded-xs border border-[#E8E3DB]">
              <span className="block font-editorial-en text-lg md:text-xl font-semibold text-[#2C2A29]">
                {timeLeft.minutes}
              </span>
              <span className="block text-[10px] text-[#8C847B] font-editorial-en tracking-wider">
                MINS
              </span>
            </div>
            <div className="bg-white p-2 rounded-xs border border-[#E8E3DB]">
              <span className="block font-editorial-en text-lg md:text-xl font-semibold text-[#2C2A29]">
                {timeLeft.seconds}
              </span>
              <span className="block text-[10px] text-[#8C847B] font-editorial-en tracking-wider">
                SECS
              </span>
            </div>
          </div>
        )}

        <p className="font-editorial-kr text-[11px] text-[#8C847B]">
          {weddingDateStr} · {weddingTimeStr}
        </p>
      </div>
    </div>
  );
};
