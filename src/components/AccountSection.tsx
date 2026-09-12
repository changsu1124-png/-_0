import React, { useState } from 'react';
import { ChevronDown, Copy, Check, HeartHandshake, ExternalLink } from 'lucide-react';
import { WeddingData } from '../types';

interface AccountSectionProps {
  weddingData: WeddingData;
}

export const AccountSection: React.FC<AccountSectionProps> = ({ weddingData }) => {
  const [openGroom, setOpenGroom] = useState(false);
  const [openBride, setOpenBride] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const groomAccounts = [
    {
      id: 'groom-main',
      role: '신랑',
      name: weddingData.groom.name,
      bank: weddingData.groom.account.bank,
      number: weddingData.groom.account.number,
      holder: weddingData.groom.account.holder,
    },
    ...weddingData.groomParentsAccounts.map((p, idx) => ({
      id: `groom-parent-${idx}`,
      role: p.title,
      name: p.holder,
      bank: p.bank,
      number: p.number,
      holder: p.holder,
    })),
  ];

  const brideAccounts = [
    {
      id: 'bride-main',
      role: '신부',
      name: weddingData.bride.name,
      bank: weddingData.bride.account.bank,
      number: weddingData.bride.account.number,
      holder: weddingData.bride.account.holder,
    },
    ...weddingData.brideParentsAccounts.map((p, idx) => ({
      id: `bride-parent-${idx}`,
      role: p.title,
      name: p.holder,
      bank: p.bank,
      number: p.number,
      holder: p.holder,
    })),
  ];

  return (
    <div className="w-full space-y-4">
      <div className="text-center space-y-2 mb-6">
        <div className="inline-flex p-2.5 rounded-full bg-[#FAF5EE] text-[#8C7A68] mb-1">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <p className="font-editorial-kr text-xs text-[#78726A] leading-relaxed max-w-xs mx-auto">
          참석이 어려워 축하의 마음을 보내주실 분들을 위해<br />
          소중한 계좌번호를 안내해 드립니다.<br />
          보내주시는 따뜻한 마음 깊이 간직하겠습니다.
        </p>
      </div>

      {/* Groom Side Accordion */}
      <div className="border border-[#E5DFD5] rounded-sm bg-white overflow-hidden shadow-2xs">
        <button
          id="toggle-groom-accounts"
          onClick={() => setOpenGroom(!openGroom)}
          className="w-full py-3.5 px-4 flex items-center justify-between bg-[#FCFAF7] hover:bg-[#F7F3ED] transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#788896]"></span>
            <span className="font-editorial-kr text-sm font-medium text-[#2C2A29]">
              신랑측 계좌번호 보기
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[#8C847B] transition-transform duration-300 ${
              openGroom ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openGroom && (
          <div className="p-4 space-y-3 divide-y divide-[#F2ECE3] bg-white">
            {groomAccounts.map((acc) => {
              const fullAccount = `${acc.bank} ${acc.number}`;
              const isCopied = copiedId === acc.id;

              return (
                <div key={acc.id} className="pt-3 first:pt-0 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] px-1.5 py-0.5 rounded-xs bg-[#EFECE6] text-[#5C554B] font-editorial-kr">
                        {acc.role}
                      </span>
                      <span className="font-editorial-kr text-xs font-semibold text-[#2C2A29]">
                        {acc.holder}
                      </span>
                    </div>
                    <p className="font-editorial-en text-xs text-[#68625A] tracking-wider">
                      {acc.bank} <span className="font-sans font-medium">{acc.number}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      id={`copy-acc-${acc.id}`}
                      onClick={() => handleCopy(acc.id, fullAccount)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-xs border border-[#D5CEC4] bg-[#FAF8F5] text-[#524B43] hover:bg-[#EFE9E0] transition-colors"
                      title="계좌번호 복사"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-[#557A2B]" />
                          <span className="text-[#557A2B] font-medium">복사됨</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#827B72]" />
                          <span>복사</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bride Side Accordion */}
      <div className="border border-[#E5DFD5] rounded-sm bg-white overflow-hidden shadow-2xs">
        <button
          id="toggle-bride-accounts"
          onClick={() => setOpenBride(!openBride)}
          className="w-full py-3.5 px-4 flex items-center justify-between bg-[#FCFAF7] hover:bg-[#F7F3ED] transition-colors"
        >
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B28A8A]"></span>
            <span className="font-editorial-kr text-sm font-medium text-[#2C2A29]">
              신부측 계좌번호 보기
            </span>
          </div>
          <ChevronDown
            className={`w-4 h-4 text-[#8C847B] transition-transform duration-300 ${
              openBride ? 'rotate-180' : ''
            }`}
          />
        </button>

        {openBride && (
          <div className="p-4 space-y-3 divide-y divide-[#F2ECE3] bg-white">
            {brideAccounts.map((acc) => {
              const fullAccount = `${acc.bank} ${acc.number}`;
              const isCopied = copiedId === acc.id;

              return (
                <div key={acc.id} className="pt-3 first:pt-0 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] px-1.5 py-0.5 rounded-xs bg-[#F5ECEE] text-[#6E4F55] font-editorial-kr">
                        {acc.role}
                      </span>
                      <span className="font-editorial-kr text-xs font-semibold text-[#2C2A29]">
                        {acc.holder}
                      </span>
                    </div>
                    <p className="font-editorial-en text-xs text-[#68625A] tracking-wider">
                      {acc.bank} <span className="font-sans font-medium">{acc.number}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      id={`copy-acc-${acc.id}`}
                      onClick={() => handleCopy(acc.id, fullAccount)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-xs border border-[#D5CEC4] bg-[#FAF8F5] text-[#524B43] hover:bg-[#EFE9E0] transition-colors"
                      title="계좌번호 복사"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3 h-3 text-[#557A2B]" />
                          <span className="text-[#557A2B] font-medium">복사됨</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-[#827B72]" />
                          <span>복사</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* KakaoPay safe note */}
      <div className="pt-2 text-center">
        <span className="text-[11px] text-[#9A9389] font-editorial-kr">
          * 계좌번호를 복사하신 후 카카오페이 또는 이용하시는 은행 앱에 붙여넣기 하실 수 있습니다.
        </span>
      </div>
    </div>
  );
};
