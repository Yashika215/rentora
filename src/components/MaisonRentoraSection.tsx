import React from 'react';
import { ArrowRight, Feather, Gem, ShieldCheck, Sparkles, Camera, Compass, Crown, Scissors } from 'lucide-react';

interface MaisonRentoraSectionProps {
  onExploreCollections: () => void;
}

export const MaisonRentoraSection: React.FC<MaisonRentoraSectionProps> = ({
  onExploreCollections,
}) => {
  return (
    <section id="discover" className="relative bg-gradient-to-b from-[#f7ebe1] via-[#EEE4DA] to-[#e8d5c8] text-[#2D1517] py-12 border-y border-[#C8A49F]/30 overflow-hidden">
      
      {/* Warm Vintage Ambient Glow Lighting Effects */}
      <div className="absolute top-12 left-1/4 w-[500px] h-[500px] bg-[#D8C4AC]/25 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-[#C8A49F]/20 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-[#4D0E13]/5 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header with Minimal Line-Art Icon */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-[#C8A49F]/40 shadow-xs text-[#4D0E13] text-xs font-semibold uppercase tracking-widest mb-3 backdrop-blur-md">
            <Compass className="w-3.5 h-3.5 text-[#4D0E13] stroke-[1.5]" />
            <span>Discover RENTORA Couture</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#2D1517] mb-4">
            THE ART OF RENTAL
          </h2>
          <p className="text-sm sm:text-base text-[#5e5460] max-w-xl mx-auto leading-relaxed">
            The Fashion Edit . 2026. Explore curated looks from RÉNÉ’s private styling vaults.
          </p>
        </div>

        {/* 1. Asymmetric Grid Layout with Overlapping Polaroid Frames */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-12">
          
          {/* Polaroid Card 1: Main Editorial */}
          <div className="relative group">
            <div className="bg-white p-2 pb-10 rounded-sm shadow-xl border border-stone-200/80 transform -rotate-2 hover:rotate-0 hover:scale-[1.02] transition-all duration-500">
              <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 rounded-2xs mb-2">
                <img
                  src="/src/assets/images/hero_fashion_editorial_1792952792888.jpg"
                  alt="Aria Pleated Evening Gown"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-white/90 text-[#4D0E13] text-[8px] uppercase font-bold p-1">POLAROID #01</span>
              </div>
              <h4 className="font-serif italic text-xs font-bold text-[#2D1517]">Aria Pleated Satin Gown</h4>
            </div>
          </div>

          {/* Polaroid Card 2: Centerpiece */}
          <div className="relative group">
            <div className="bg-white p-2 pb-10 rounded-sm shadow-xl border border-stone-200/80 transform rotate-1 hover:rotate-0 hover:scale-[1.02] transition-all duration-500">
              <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 rounded-2xs mb-2">
                <img
                  src="/assets/aistudio/Blue_velvet_indowestern_with_gold_zardosi_embroidery_254366cd.jpg"
                  alt="The Nizam Velvet Sherwani"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-[#4D0E13] text-white text-[8px] uppercase font-bold p-1">POLAROID #02</span>
              </div>
              <h4 className="font-serif italic text-xs font-bold text-[#2D1517]">The Nizam Velvet Sherwani</h4>
            </div>
          </div>

          {/* Polaroid Card 3: Detail Shot */}
          <div className="relative group">
            <div className="bg-white p-2 pb-10 rounded-sm shadow-xl border border-stone-200/80 transform -rotate-1 hover:rotate-0 hover:scale-[1.02] transition-all duration-500">
              <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 rounded-2xs mb-2">
                <img
                  src="/src/assets/images/coquette_accessories_gift_1792952794547.jpg"
                  alt="Baroque Pearl Choker"
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-2 left-2 bg-white/90 text-[#4D0E13] text-[8px] uppercase font-bold p-1">KEEPSAKE GIFT 🎀</span>
              </div>
              <h4 className="font-serif italic text-xs font-bold text-[#2D1517]">Baroque Pearl Choker</h4>
            </div>
          </div>

        </div>

        {/* 2. Central Editorial Callout Box with Vintage Line-Art Icons */}
        <div className="bg-gradient-to-r from-[#4D0E13] via-[#3b0b0f] to-[#2D1517] text-white rounded-3xl p-5 sm:p-8 md:p-12 shadow-2xl border border-[#C8A49F]/30 relative overflow-hidden">
          
          {/* Subtle background line pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#C8A49F_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-8 text-left">
              <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#C8A49F] block mb-2">
                THE RENTORA PROMISE
              </span>
              <h3 className="font-serif text-2xl sm:text-4xl font-bold text-[#EEE4DA] tracking-tight mb-3">
                High-Fashion Couture, Without Ownership Friction.
              </h3>
              <p className="text-xs sm:text-sm text-[#EEE4DA]/80 leading-relaxed max-w-2xl">
                Explore every detail up close with our 2.5× Fabric Zoom, revealing intricate embroidery, rich textures and fine craftsmanship in every outfit.
              </p>
            </div>

            <div className="lg:col-span-4 flex justify-start lg:justify-end">
              <button
                onClick={onExploreCollections}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#C8A49F] text-[#4D0E13] font-bold text-xs uppercase tracking-wider hover:bg-white hover:shadow-lg transition-all cursor-pointer shadow-md active:scale-95"
              >
                <span>Discover Your Next Look</span>
                <ArrowRight className="w-4 h-4 stroke-[2]" />
              </button>
            </div>

          </div>

          {/* 3 Minimal Line-Art Pillar Icons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10 pt-8 border-t border-[#C8A49F]/20 text-left">
            
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-[#C8A49F]/15 border border-[#C8A49F]/30 text-[#C8A49F]">
                <Scissors className="w-4 h-4 stroke-[1.25]" />
              </div>
              <div>
                <h5 className="font-serif text-xs font-bold text-[#EEE4DA] uppercase tracking-wider">
                  Atelier Tailored Fit
                </h5>
                <p className="text-[11px] text-[#EEE4DA]/70">Internal margin seams for perfect drape</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-[#C8A49F]/15 border border-[#C8A49F]/30 text-[#C8A49F]">
                <Feather className="w-4 h-4 stroke-[1.25]" />
              </div>
              <div>
                <h5 className="font-serif text-xs font-bold text-[#EEE4DA] uppercase tracking-wider">
                  Pure Mulberry Silks
                </h5>
                <p className="text-[11px] text-[#EEE4DA]/70">Authentic handwoven tissue & velvet</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-[#C8A49F]/15 border border-[#C8A49F]/30 text-[#C8A49F]">
                <ShieldCheck className="w-4 h-4 stroke-[1.25]" />
              </div>
              <div>
                <h5 className="font-serif text-xs font-bold text-[#EEE4DA] uppercase tracking-wider">
                  Ozone Sanitized Care
                </h5>
                <p className="text-[11px] text-[#EEE4DA]/70">Hospital grade dry cleaning included</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

