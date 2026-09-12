import React, { useState } from 'react';
import { Heart, Send, Trash2, MessageSquareHeart, Smile } from 'lucide-react';
import { GuestbookEntry } from '../types';

interface GuestbookSectionProps {
  entries: GuestbookEntry[];
  onAddEntry: (entry: GuestbookEntry) => void;
  onLikeEntry: (id: string) => void;
  onDeleteEntry: (id: string) => void;
}

const EMOJIS = ['💍', '🌸', '🥂', '🕊️', '✨', '💐', '🤍', '🎉'];

export const GuestbookSection: React.FC<GuestbookSectionProps> = ({
  entries,
  onAddEntry,
  onLikeEntry,
  onDeleteEntry,
}) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('💍');
  const [isOpenForm, setIsOpenForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    const newEntry: GuestbookEntry = {
      id: 'gb-' + Date.now(),
      name: name.trim(),
      message: message.trim(),
      likes: 0,
      emoji: selectedEmoji,
      createdAt: new Date().toLocaleDateString('ko-KR').replace(/\.$/, ''),
    };

    onAddEntry(newEntry);
    setName('');
    setMessage('');
    setIsOpenForm(false);
  };

  return (
    <div className="w-full space-y-5">
      {/* Header & Write Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <MessageSquareHeart className="w-4 h-4 text-[#8C7A68]" />
          <span className="font-editorial-kr text-xs text-[#7A7268]">
            총 {entries.length}개의 축하 메시지
          </span>
        </div>

        <button
          id="toggle-write-guestbook-btn"
          onClick={() => setIsOpenForm(!isOpenForm)}
          className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#2C2A29] text-[#FAF8F5] hover:bg-[#1C1A19] transition-all shadow-2xs"
        >
          {isOpenForm ? '작성 취소' : '축하글 남기기'}
        </button>
      </div>

      {/* Write Form Drawer */}
      {isOpenForm && (
        <form
          onSubmit={handleSubmit}
          className="p-4 rounded-sm border border-[#E4DDD2] bg-[#FAF8F5] space-y-3 transition-all"
        >
          <div className="flex items-center gap-2">
            <input
              id="guestbook-input-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="작성자 성함"
              className="flex-1 px-3 py-2 text-xs bg-white rounded-xs border border-[#D9D3C9] focus:outline-none focus:border-[#8C7A68] text-[#2C2A29]"
            />

            {/* Emoji selector */}
            <div className="flex items-center gap-1 overflow-x-auto py-1 px-2 bg-white rounded-xs border border-[#D9D3C9]">
              {EMOJIS.slice(0, 5).map((emo) => (
                <button
                  key={emo}
                  type="button"
                  onClick={() => setSelectedEmoji(emo)}
                  className={`text-sm p-1 rounded-xs transition-transform ${
                    selectedEmoji === emo ? 'scale-125 bg-[#F2ECE3]' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  {emo}
                </button>
              ))}
            </div>
          </div>

          <textarea
            id="guestbook-input-message"
            required
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="신랑, 신부에게 따뜻한 축하의 한마디를 남겨주세요."
            className="w-full px-3 py-2 text-xs bg-white rounded-xs border border-[#D9D3C9] focus:outline-none focus:border-[#8C7A68] text-[#2C2A29] resize-none"
          />

          <button
            id="guestbook-submit-btn"
            type="submit"
            className="w-full py-2.5 bg-[#423C35] hover:bg-[#2C2A29] text-white rounded-xs text-xs font-medium tracking-wider flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>방명록 등록하기</span>
            <Send className="w-3 h-3 opacity-80" />
          </button>
        </form>
      )}

      {/* Guestbook Entries Cards */}
      <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
        {entries.length === 0 ? (
          <div className="py-10 text-center text-xs text-[#999288] font-editorial-kr">
            첫 번째 축하 글의 주인공이 되어주세요 ✨
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="p-4 rounded-xs border border-[#EFE9DF] bg-white shadow-2xs space-y-2 hover:border-[#DFD6C9] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-base">{entry.emoji || '🌸'}</span>
                  <span className="font-editorial-kr text-xs font-semibold text-[#2C2A29]">
                    {entry.name}
                  </span>
                </div>
                <span className="font-editorial-en text-[11px] text-[#A69E92]">
                  {entry.createdAt}
                </span>
              </div>

              <p className="font-editorial-kr text-xs text-[#524B43] leading-relaxed whitespace-pre-wrap">
                {entry.message}
              </p>

              <div className="flex items-center justify-between pt-1 border-t border-[#F7F3ED]">
                <button
                  id={`like-btn-${entry.id}`}
                  onClick={() => onLikeEntry(entry.id)}
                  className="flex items-center gap-1 text-[11px] text-[#8C7A68] hover:text-[#C55050] transition-colors"
                >
                  <Heart className="w-3 h-3 fill-current opacity-70" />
                  <span>공감 {entry.likes > 0 ? entry.likes : ''}</span>
                </button>

                <button
                  id={`delete-btn-${entry.id}`}
                  onClick={() => onDeleteEntry(entry.id)}
                  className="p-1 text-[#C0B7AB] hover:text-[#A84B4B] transition-colors"
                  title="삭제"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
