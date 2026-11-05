import React, { useState } from 'react';
import { Sparkles, Gift, X, ShieldCheck, Tag, ChevronRight } from 'lucide-react';

interface AnnouncementBarProps {
  onOpenGiftPromo?: () => void;
}

export const AnnouncementBar: React.FC<AnnouncementBarProps> = ({ onOpenGiftPromo }) => {
  const [dismissed, setDismissed] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  if (dismissed) return null;

  const promoItems = [
    {
      id: 'gift',
      icon: Gift,
      title: 'SPECIAL OFFER:',
      detail: 'FREE luxury keepsake gift on rental orders above',
      highlight: '₹3,000',
      clickable: true,
    },
    {
      id: 'discount',
      icon: Tag,
      title: 'WELCOME DISCOUNT:',
      detail: 'Use coupon code',
      code: 'RENTORA10',
      highlight: '₹500 OFF',
      clickable: true,
    },
    {
      id: 'concierge',
      icon: ShieldCheck,
      title: 'LUXURY CONCIERGE:',
      detail: 'Complimentary eco dry-cleaning & insured door-to-door delivery',
      clickable: false,
    },
    {
      id: 'rene',
      icon: Sparkles,
      title: "RÉNÉ'S STYLING:",
      detail: 'Free backup size & 24/7 personal AI styling consultation',
      clickable: false,
    },
  ];

  // Quadruple or double items list to guarantee seamless infinite scrolling loop without gaps on wide screens
  const loopItems = [...promoItems, ...promoItems, ...promoItems];

  return (
    <div className="bg-[#4D0E13] text-[#EEE4DA] text-xs py-2 relative border-b border-[#C8A49F]/25 overflow-hidden group select-none">
      {/* Subtle luxury glow accent overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#4D0E13] via-[#3d0b0f] to-[#4D0E13] opacity-80 pointer-events-none" />

      {/* Marquee ticker container */}
      <div 
        className="flex items-center overflow-hidden py-0.5"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className={`flex items-center whitespace-nowrap gap-6 ${isPaused ? '' : 'animate-marquee'}`}
          style={{ willChange: 'transform' }}
        >
          {loopItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={`${item.id}-${idx}`}
                onClick={item.clickable && onOpenGiftPromo ? onOpenGiftPromo : undefined}
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full transition-all ${
                  item.clickable ? 'hover:bg-[#C8A49F]/20 cursor-pointer text-[#EEE4DA]' : ''
                }`}
              >
                <span className="p-1 rounded-full bg-[#C8A49F]/20 text-[#C8A49F] shrink-0">
                  <Icon className="w-3.5 h-3.5" />
                </span>
                
                <span className="font-semibold tracking-wider text-[#C8A49F] font-mono text-[11px] uppercase">
                  {item.title}
                </span>

                <span className="text-[#EEE4DA]/90 font-medium text-[12px]">
                  {item.detail}
                </span>

                {item.code && (
                  <code className="bg-[#2D1517] border border-[#C8A49F]/35 px-2 py-0.5 rounded text-[#C8A49F] font-mono font-bold tracking-wider text-[11px] shadow-inner">
                    {item.code}
                  </code>
                )}

                {item.highlight && (
                  <span className="font-bold text-[#C8A49F] bg-[#C8A49F]/15 px-2 py-0.5 rounded border border-[#C8A49F]/30 text-[11px]">
                    {item.highlight}
                  </span>
                )}

                {item.clickable && (
                  <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-[#C8A49F] underline underline-offset-2 ml-1">
                    Details <ChevronRight className="w-3 h-3 ml-0.5 inline" />
                  </span>
                )}

                {/* Elegant separator diamond */}
                <span className="ml-5 text-[#C8A49F]/40 select-none text-[10px]">✦</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side Action & Close buttons overlay */}
      <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 z-10 bg-[#4D0E13]/90 backdrop-blur-md pl-3 pr-1 py-1 rounded-l-full border-l border-y border-[#C8A49F]/20 shadow-md">
        {onOpenGiftPromo && (
          <button
            onClick={onOpenGiftPromo}
            className="hidden sm:flex items-center gap-1.5 bg-[#C8A49F] hover:bg-[#b8938e] text-[#4D0E13] font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full transition-all cursor-pointer shadow-sm active:scale-95 shrink-0"
          >
            <Gift className="w-3 h-3" />
            <span>₹3,000 Gift</span>
          </button>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="text-[#EEE4DA]/70 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors shrink-0 cursor-pointer"
          aria-label="Dismiss announcement"
          title="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

