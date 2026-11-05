import React, { useState } from 'react';
import { Product } from '../data/catalog';
import { X, Share2, Copy, Check, Download, Sparkles, Heart, Calendar } from 'lucide-react';
import { useImageManager } from '../context/ImageManagerContext';

export interface ShareLookData {
  title: string;
  occasion: string;
  product: Product;
  accessories?: Product[];
  size?: string;
  rentalDuration?: string;
  totalPrice?: number;
}

interface ShareLookModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ShareLookData | null;
}

export const ShareLookModal: React.FC<ShareLookModalProps> = ({ isOpen, onClose, data }) => {
  const { getImage } = useImageManager();
  const [copied, setCopied] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);

  if (!isOpen || !data) return null;

  const { title, occasion, product, accessories = [], size, rentalDuration, totalPrice } = data;
  const primaryImg = getImage(`product-${product.id}`, product.images[0]);

  // Formatted caption text for sharing
  const shareCaption = `✨ Wearing "${title}" for ${occasion} curated via RENTORA! 💎
Rent luxury designer fashion sustainably • Rent • Wear • Repeat.
Check it out on RENTORA: ${window.location.origin}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleCopyCaption = async () => {
    try {
      await navigator.clipboard.writeText(shareCaption);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2500);
    } catch {
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2500);
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `RENTORA Look — ${title}`,
          text: shareCaption,
          url: window.location.href,
        });
      } catch {
        // user cancelled or share failed
      }
    } else {
      handleCopyCaption();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#C8A49F]/40 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 bg-[#EEE4DA] border-b border-[#C8A49F]/30 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-[#4D0E13] text-[#C8A49F]">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-sm sm:text-base font-bold text-[#2D1517]">
                Share My Look
              </h3>
              <p className="text-[10px] text-[#5e5460]">
                Social-media-ready visual summary of your curated ensemble
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/80 hover:bg-[#4D0E13] hover:text-white text-[#2D1517] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-4">
          
          {/* Visual Social Card Preview */}
          <div 
            id="rentora-social-look-card"
            className="rounded-2xl p-5 border border-[#C8A49F]/40 bg-gradient-to-b from-[#FFFBF7] via-[#FFF9F3] to-[#EEE4DA] shadow-md relative overflow-hidden text-center"
          >
            {/* Top Brand Bar */}
            <div className="flex items-center justify-between border-b border-[#C8A49F]/30 pb-3 mb-3">
              <div className="flex items-center gap-2 text-left">
                <span className="font-serif font-black tracking-widest text-[#4D0E13] text-sm">
                  RENTORA
                </span>
                <span className="text-[9px] uppercase tracking-wider text-[#C8A49F] font-semibold border-l border-[#C8A49F]/40 pl-2">
                  CURATED LOOK
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#4D0E13] bg-[#EEE4DA] px-2.5 py-0.5 rounded-full border border-[#C8A49F]/40">
                ✨ {occasion}
              </span>
            </div>

            {/* Central Product Image */}
            <div className="relative aspect-[3/4] w-full max-w-[280px] mx-auto rounded-xl overflow-hidden bg-white shadow-sm border border-[#C8A49F]/30 flex items-center justify-center p-2 mb-3">
              <img
                src={primaryImg}
                alt={title}
                className="w-full h-full object-contain object-center"
                crossOrigin="anonymous"
              />
              <span className="absolute bottom-2 left-2 text-[9px] font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-xs px-2 py-0.5 rounded-full">
                {product.brand}
              </span>
            </div>

            {/* Outfit Title & Occasion */}
            <h4 className="font-serif text-base sm:text-lg font-bold text-[#2D1517] leading-snug">
              {title}
            </h4>
            <p className="text-xs text-[#5e5460] mt-0.5 font-medium">
              Styled for <span className="text-[#4D0E13] font-semibold">{occasion}</span>
              {size ? ` · Size: ${size}` : ''}
              {rentalDuration ? ` · ${rentalDuration}` : ''}
            </p>

            {/* Coordinated Accessories Strip if provided */}
            {accessories.length > 0 && (
              <div className="mt-3 pt-3 border-t border-[#C8A49F]/30 text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4D0E13] block mb-2 text-center">
                  Matched Accessories
                </span>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {accessories.map((acc) => {
                    const accImg = getImage(`product-${acc.id}`, acc.images[0]);
                    return (
                      <div
                        key={acc.id}
                        className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white border border-[#C8A49F]/40 shadow-xs max-w-[135px]"
                      >
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                          <img
                            src={accImg}
                            alt={acc.name}
                            className="w-full h-full object-contain p-0.5"
                          />
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] font-semibold text-[#2D1517] block truncate">
                            {acc.name}
                          </span>
                          <span className="text-[9px] text-[#4D0E13] font-mono font-bold block">
                            ₹{acc.rentalPrice4Days}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Estimated Total */}
            {totalPrice !== undefined && totalPrice > 0 && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#C8A49F]/50 shadow-xs text-xs font-mono font-bold text-[#4D0E13]">
                <span>Total Look: ₹{totalPrice.toLocaleString()}</span>
                <span className="text-[10px] font-sans font-normal text-[#5e5460]">• Demo Rate</span>
              </div>
            )}

            {/* Card Footer Tagline */}
            <div className="mt-4 pt-2 border-t border-[#C8A49F]/30 text-[9px] uppercase tracking-widest text-[#5e5460] font-bold">
              RENT • WEAR • REPEAT
            </div>
          </div>

          {/* Share Actions Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              onClick={handleCopyCaption}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#4D0E13] text-white text-xs font-bold hover:bg-[#38090d] transition-all cursor-pointer shadow-xs"
            >
              {copiedCaption ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedCaption ? 'Caption Copied!' : 'Copy Social Caption'}</span>
            </button>

            <button
              onClick={handleNativeShare}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-[#4D0E13] text-[#4D0E13] bg-white hover:bg-[#EEE4DA] text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <Share2 className="w-4 h-4" />
              <span>Share to Social</span>
            </button>
          </div>

          <button
            onClick={handleCopyLink}
            className="w-full py-2 px-3 rounded-xl bg-[#EEE4DA] hover:bg-[#e4d6c7] text-[#2D1517] text-[11px] font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5 border border-[#C8A49F]/30"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-[#5e5460]" />}
            <span>{copied ? 'Link Copied to Clipboard!' : 'Copy Product Link'}</span>
          </button>

        </div>
      </div>
    </div>
  );
};
