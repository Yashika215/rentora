import React from 'react';
import { MessageCircleHeart, Sparkles, Wand2, Heart, Gift, ArrowRight } from 'lucide-react';
import reniAvatar from '../assets/images/reni_avatar_new_1792982285301.jpg';

interface MeetReniSectionProps {
  onOpenChat: () => void;
  onOpenOutfitBuilder: () => void;
  onTakeQuiz?: () => void;
}

export const MeetReniSection: React.FC<MeetReniSectionProps> = ({
  onOpenChat,
  onOpenOutfitBuilder,
  onTakeQuiz,
}) => {
  return (
    <section id="reni" className="py-20 bg-gradient-to-br from-[#EEE4DA] via-[#EEE4DA] to-[#D8C4AC] border-b border-[#C8A49F]/30 relative overflow-hidden">
      
      {/* Decorative ambient background rings */}
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-[#C8A49F]/20 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#C7B7D4]/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Column 1: Reni's Editorial Portrait & Identity */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm sm:max-w-md">
              
              {/* Outer decorative frame */}
              <div className="relative rounded-3xl p-3 bg-gradient-to-b from-[#C8A49F]/50 via-white to-[#4D0E13]/20 shadow-2xl border border-white flex flex-col gap-3">
                
                {/* Image container */}
                <div className="relative rounded-2xl overflow-hidden aspect-square bg-[#fbf0e8] shadow-inner">
                  <img
                    src={reniAvatar}
                    alt="RÉNÉ — Your RENTORA Style Bestie"
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />

                  {/* Scrim overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#4D0E13]/85 via-transparent to-transparent pointer-events-none" />

                  {/* Name and role badge on portrait */}
                  <div className="absolute bottom-3 left-3 right-3 text-white z-10">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8A49F] text-[#4D0E13] text-xs font-bold mb-1 shadow-xs">
                      <span>✨</span>
                      <span>Your AI Style Bestie</span>
                    </div>
                    <h3 className="font-serif text-2xl font-bold tracking-tight text-white drop-shadow-md">
                      RÉNÉ
                    </h3>
                    <p className="text-xs text-[#EEE4DA] font-sans">
                      Personal Stylist & Fashion Curator
                    </p>
                  </div>

                  {/* Floating cute bow decoration top-right */}
                  <div className="absolute top-3 right-3 bg-white/95 border border-[#C8A49F] rounded-full p-2 shadow-md z-20">
                    <span className="text-lg">🎀</span>
                  </div>
                </div>

                {/* Always By Your Side Quote Badge (Cleanly positioned below image without overlay collision) */}
                <div className="bg-white/95 backdrop-blur-md border border-[#C8A49F]/60 rounded-2xl p-3 shadow-md flex items-center gap-3 z-20">
                  <div className="w-9 h-9 rounded-full bg-[#C8A49F]/30 text-[#4D0E13] flex items-center justify-center shrink-0">
                    <Heart className="w-4.5 h-4.5 fill-[#4D0E13] text-[#4D0E13]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#4D0E13] block">Always by your side! 💗</span>
                    <p className="text-[11px] text-[#5e5460] leading-snug">
                      "No boring fits allowed. Let's find your main character look."
                    </p>
                  </div>
                </div>

              </div>

            </div>
          </div>

          {/* Column 2: Content strictly matching prompt */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            
            {/* Tagline / Subtitle */}
            <div className="inline-flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-[#4D0E13]">
              <span className="text-sm">💗</span>
              <span>Meet RÉNÉ — Your RENTORA Style Bestie</span>
            </div>

            {/* Heading strictly following prompt */}
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2D1517] leading-[1.15] tracking-tight mb-5">
              Meet RÉNÉ <span className="text-[#C8A49F]">💕</span>{' '}
              <span className="italic font-normal text-[#4D0E13] block sm:inline">
                Your Personal Style Bestie
              </span>
            </h2>

            {/* Description strictly following prompt */}
            <p className="text-base sm:text-lg text-[#5e5460] leading-relaxed mb-8 max-w-xl">
              Not sure what to wear? RÉNÉ is here to help! Tell her your vibe, occasion, budget, and favourite colours, and she'll help you build a look that's totally you.
            </p>

            {/* Four Feature Highlights strictly following prompt */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              
              <div 
                onClick={onTakeQuiz}
                className={`p-3.5 rounded-xl bg-white/90 border border-[#C8A49F]/40 shadow-xs flex items-center gap-3 transition-all ${
                  onTakeQuiz ? 'cursor-pointer hover:border-[#4D0E13] hover:shadow-sm hover:-translate-y-0.5' : ''
                }`}
              >
                <span className="text-xl shrink-0">✨</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[#2D1517]">Discover your aesthetic</h4>
                    {onTakeQuiz && <span className="text-[10px] font-semibold text-[#4D0E13] underline">Take Quiz</span>}
                  </div>
                  <p className="text-[11px] text-[#5e5460]">Find whether you're Coquette, Desi Glam, or Old Money</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/90 border border-[#C8A49F]/40 shadow-xs flex items-center gap-3">
                <span className="text-xl shrink-0">👗</span>
                <div>
                  <h4 className="text-xs font-bold text-[#2D1517]">Build your perfect outfit</h4>
                  <p className="text-[11px] text-[#5e5460]">Coordinate garments tailored to your shape and dress code</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/90 border border-[#C8A49F]/40 shadow-xs flex items-center gap-3">
                <span className="text-xl shrink-0">🎀</span>
                <div>
                  <h4 className="text-xs font-bold text-[#2D1517]">Find matching accessories</h4>
                  <p className="text-[11px] text-[#5e5460]">Pair clutches, jewelry, and footwear effortlessly</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-white/90 border border-[#C8A49F]/40 shadow-xs flex items-center gap-3">
                <span className="text-xl shrink-0">💸</span>
                <div>
                  <h4 className="text-xs font-bold text-[#2D1517]">Style yourself within budget</h4>
                  <p className="text-[11px] text-[#5e5460]">Get high-fashion looks starting from ₹299/day</p>
                </div>
              </div>

            </div>

            {/* Prominent Action Buttons strictly following prompt */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3.5 mb-6">
              
              <button
                onClick={onOpenChat}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-[#4D0E13] text-white font-medium text-sm hover:bg-[#3b172b] hover:shadow-xl transition-all cursor-pointer group shadow-md"
              >
                <MessageCircleHeart className="w-4 h-4 text-[#C8A49F] group-hover:scale-110 transition-transform" />
                <span>Chat With RÉNÉ</span>
                <span className="text-xs bg-[#C8A49F]/30 text-[#EEE4DA] px-2 py-0.5 rounded-full font-semibold ml-1">
                  Online
                </span>
              </button>

              <button
                onClick={onOpenOutfitBuilder}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-white text-[#4D0E13] font-medium text-sm border border-[#C8A49F]/70 hover:bg-[#EEE4DA] hover:border-[#4D0E13] hover:shadow-md transition-all cursor-pointer shadow-xs"
              >
                <Wand2 className="w-4 h-4 text-[#C8A49F]" />
                <span>Build My Look</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#4D0E13]" />
              </button>

              {onTakeQuiz && (
                <button
                  onClick={onTakeQuiz}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-full bg-[#C8A49F]/20 text-[#4D0E13] font-semibold text-xs border border-[#C8A49F]/50 hover:bg-[#C8A49F]/30 hover:shadow-xs transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#4D0E13]" />
                  <span>Style Quiz 🎀</span>
                </button>
              )}

            </div>

            {/* Small Friendly Quote strictly following prompt */}
            <p className="font-serif italic text-base sm:text-lg text-[#4D0E13] font-medium">
              “Your vibe, your rules, bestie. Let’s find your look! 💗”
            </p>

          </div>

        </div>

      </div>
    </section>
  );
};
