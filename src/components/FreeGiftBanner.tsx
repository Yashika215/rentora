import React from 'react';
import { FREE_GIFT_PROMOTION } from '../data/catalog';
import { Gift, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface FreeGiftBannerProps {
  onExploreGiftEligibleOutfits: () => void;
  currentCartTotal?: number;
}

export const FreeGiftBanner: React.FC<FreeGiftBannerProps> = ({
  onExploreGiftEligibleOutfits,
  currentCartTotal = 0,
}) => {
  const isUnlocked = currentCartTotal >= FREE_GIFT_PROMOTION.thresholdAmount;
  const needed = Math.max(0, FREE_GIFT_PROMOTION.thresholdAmount - currentCartTotal);

  return (
    <section className="py-14 bg-[#EEE4DA] border-b border-[#C8A49F]/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl overflow-hidden bg-[#4D0E13] text-white p-6 sm:p-10 shadow-2xl border border-[#C8A49F]/30">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C8A49F]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8A49F]/20 text-[#C8A49F] text-xs font-bold uppercase tracking-wider mb-3 w-fit border border-[#C8A49F]/30">
                <Gift className="w-3.5 h-3.5" />
                <span>Complimentary Luxury Promotion</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl text-white tracking-tight leading-tight mb-3">
                Free Surprise Gift on Orders Above ₹3,000 <span className="text-[#C8A49F]">🎁</span>
              </h2>

              <p className="text-sm text-[#EEE4DA]/80 leading-relaxed mb-6 max-w-xl">
                Upgrade your rental experience with our signature keepsakes! When your net rental merchandise subtotal reaches <strong>₹3,000</strong>, we automatically gift you the <em>{FREE_GIFT_PROMOTION.giftName}</em> valued at ₹{FREE_GIFT_PROMOTION.giftValue.toLocaleString()} — yours to keep forever at <strong>₹0</strong>!
              </p>

              {/* Progress Bar in Banner */}
              <div className="bg-black/25 rounded-2xl p-4 border border-[#C8A49F]/20 mb-6 max-w-lg">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[#C8A49F] font-semibold flex items-center gap-1.5">
                    {isUnlocked ? (
                      <span className="text-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" />
                        Unlocked in your bag! 🎀
                      </span>
                    ) : (
                      <span>You're ₹{needed.toLocaleString()} away from your FREE surprise gift! 🎀</span>
                    )}
                  </span>
                  <span className="font-mono text-[11px] text-[#EEE4DA]/70">
                    ₹{currentCartTotal.toLocaleString()} / ₹{FREE_GIFT_PROMOTION.thresholdAmount.toLocaleString()}
                  </span>
                </div>
                
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#C8A49F] h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (currentCartTotal / FREE_GIFT_PROMOTION.thresholdAmount) * 100)}%`,
                    }}
                  />
                </div>
              </div>

              {/* Terms text & CTA */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <button
                  onClick={onExploreGiftEligibleOutfits}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C8A49F] text-[#4D0E13] text-xs font-bold hover:bg-white hover:shadow-lg transition-all cursor-pointer"
                >
                  <span>Explore Qualifying Looks</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <p className="text-[10px] text-[#EEE4DA]/60 max-w-xs">
                  *Based on rental subtotal before refundable deposits and delivery fees. Keepsake item is yours to keep.
                </p>
              </div>

            </div>

            {/* Right Media: Flatlay Gift Box Photography */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#C8A49F]/40 aspect-[4/3] w-full max-w-md group">
                <img
                  src={FREE_GIFT_PROMOTION.giftImage}
                  alt="RENTORA Free Keepsake Gift Set"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                
                <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#C8A49F] tracking-wider block">
                      Valued at ₹1,299
                    </span>
                    <p className="text-xs font-medium">Free Surprise Keepsake Jewelry Box</p>
                  </div>
                  <span className="text-xs font-bold bg-[#C8A49F] text-[#4D0E13] px-2.5 py-1 rounded-full font-mono">
                    ₹0 ON ELIGIBLE ORDERS
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
