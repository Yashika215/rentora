import React, { useState, useRef, useMemo } from 'react';
import { PRODUCTS, Product } from '../data/catalog';
import { Sparkles, ChevronLeft, ChevronRight, ShoppingBag, Eye, Heart, Quote } from 'lucide-react';
import { CartItem } from '../types';
import { useImageManager } from '../context/ImageManagerContext';
import { useAuth } from '../context/AuthContext';
import { generateProductStylingNote } from '../utils/reniStylistEngine';

interface StylistsPicksCarouselProps {
  onAddToCart: (item: CartItem) => void;
  onOpenProductDetail: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
}

interface StylistPickItem {
  productId: string;
  badge: string;
}

// Curated picks mapped to authentic RENTORA catalog items
const STYLIST_PICKS_DATA: StylistPickItem[] = [
  { productId: 'her-1', badge: '👑 Gala Glamour' },
  { productId: 'her-2', badge: '🎀 Bridal Royalty' },
  { productId: 'him-1', badge: '🍸 Black-Tie Poise' },
  { productId: 'him-3', badge: '✨ Heritage Sherwani' },
  { productId: 'her-8', badge: '🪔 Garba Celebration' },
  { productId: 'acc-pearl-choker', badge: '💎 Keepsake Jewel' },
];

export const StylistsPicksCarousel: React.FC<StylistsPicksCarouselProps> = ({
  onAddToCart,
  onOpenProductDetail,
  onToggleWishlist,
  isWishlisted,
}) => {
  const { currentUser } = useAuth();
  const { getImage } = useImageManager();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const filteredPicks = useMemo(() => {
    return STYLIST_PICKS_DATA.filter((pick) => {
      const product = PRODUCTS.find((p) => p.id === pick.productId);
      if (!product) return false;
      if (currentUser?.gender && currentUser.gender !== 'unisex' && currentUser.gender !== 'prefer_not_to_say') {
        const genderCategory = currentUser.gender === 'female' ? 'her' : 'him';
        return product.category === 'accessory' || product.category === genderCategory;
      }
      return true;
    });
  }, [currentUser?.gender]);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -360 : 360;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScroll, 350);
    }
  };

  return (
    <section id="stylists-picks" className="py-10 bg-gradient-to-b from-[#EEE4DA] via-white to-[#EEE4DA] border-b border-[#C8A49F]/25 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 -left-20 w-80 h-80 bg-[#C8A49F]/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-[#C7B7D4]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header with RÉNÉ's voice branding */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#4D0E13] mb-2 bg-[#C8A49F]/20 px-3 py-1 rounded-full border border-[#C8A49F]/30 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-[#4D0E13]" />
              <span>Handpicked Couture by RÉNÉ</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2D1517] tracking-tight">
              Stylist’s Picks of the Season <span className="text-[#C8A49F]">💎</span>
            </h2>
            <p className="text-sm sm:text-base text-[#5e5460] mt-2 max-w-2xl">
              High-luxury outfits personally selected by RÉNÉ, complete with her styling notes on why each piece elevates your silhouette and presence.
            </p>
          </div>

          {/* Carousel Arrows */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`p-3 rounded-full border border-[#C8A49F]/40 shadow-xs transition-all cursor-pointer ${
                canScrollLeft
                  ? 'bg-white text-[#4D0E13] hover:bg-[#4D0E13] hover:text-white hover:border-[#4D0E13]'
                  : 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed'
              }`}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`p-3 rounded-full border border-[#C8A49F]/40 shadow-xs transition-all cursor-pointer ${
                canScrollRight
                  ? 'bg-white text-[#4D0E13] hover:bg-[#4D0E13] hover:text-white hover:border-[#4D0E13]'
                  : 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed'
              }`}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel Track */}
        <div
          ref={scrollContainerRef}
          onScroll={checkScroll}
          className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory py-4 -mx-4 px-4 sm:mx-0 sm:px-0"
        >
          {filteredPicks.length === 0 && (
            <div className="w-full text-center py-10 text-gray-500 text-sm">
              No matching products found in this category yet.
            </div>
          )}
          {filteredPicks.length > 0 && filteredPicks.map((pick, idx) => {
            const product = PRODUCTS.find((p) => p.id === pick.productId) || PRODUCTS[0];
            const isFavorited = isWishlisted(product.id);
            const dynamicNote = generateProductStylingNote(product);
            const noteText = dynamicNote.whyItWorks;
            const tipText = dynamicNote.stylingTip;

            return (
              <div
                key={`${product.id}-${idx}`}
                className="w-[280px] sm:w-[340px] md:w-[360px] shrink-0 snap-start bg-white rounded-2xl border border-[#C8A49F]/40 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group"
              >
                {/* Image Area with Badge — Portrait 3/4 to display full outfit */}
                <div
                  className="relative aspect-[3/4] bg-[#FAF5F0] overflow-hidden cursor-pointer flex items-center justify-center p-2"
                  onClick={() => onOpenProductDetail(product)}
                >
                  <img
                    src={getImage(`product-${product.id}`, product.images[0])}
                    alt={product.name}
                    className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle scrim overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                  {/* Stylist Pick Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-flex items-center gap-1.5 bg-[#4D0E13] text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                      {pick.badge}
                    </span>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product);
                    }}
                    className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                      isFavorited
                        ? 'bg-[#4D0E13] text-[#C8A49F]'
                        : 'bg-white/80 text-gray-700 hover:bg-white hover:text-red-500'
                    }`}
                    aria-label="Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                  </button>

                  {/* Title & Brand Overlay on Image */}
                  <div className="absolute bottom-3 left-3 right-3 text-white z-10">
                    <span className="text-[10px] uppercase font-bold text-[#C8A49F] tracking-wider block">
                      {product.brand}
                    </span>
                    <h3 className="font-serif text-base font-bold text-white line-clamp-1 drop-shadow-xs">
                      {product.name}
                    </h3>
                  </div>
                </div>

                {/* Body Content — RÉNÉ's Voice Micro-Caption */}
                <div className="p-4 flex-1 flex flex-col justify-between bg-white">
                  
                  {/* RÉNÉ's Micro Caption Box */}
                  <div className="p-3.5 rounded-xl bg-[#EEE4DA]/60 border border-[#C8A49F]/30 relative mb-4">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-5 h-5 rounded-full bg-[#4D0E13] text-white text-[10px] flex items-center justify-center shrink-0">
                        🎀
                      </div>
                      <span className="text-xs font-bold text-[#4D0E13]">
                        Why this works — RÉNÉ’s Note
                      </span>
                    </div>

                    <p className="text-xs text-[#2D1517] leading-relaxed italic relative pl-2 border-l-2 border-[#C8A49F] mb-2">
                      "{noteText}"
                    </p>

                    <div className="mt-2 pt-1.5 border-t border-[#C8A49F]/20 text-[11px] text-[#5e5460] font-medium flex flex-col gap-1">
                      <div>
                        <span className="text-[#4D0E13] font-bold">Styling Tip: </span>
                        <span>{tipText}</span>
                      </div>

                      {/* Clickable Accessory Badges */}
                      {dynamicNote.recommendedAccessories.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1 mt-1">
                          {dynamicNote.recommendedAccessories.map((acc) => (
                            <button
                              key={acc.id}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenProductDetail(acc);
                              }}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-[#C8A49F]/40 text-[10px] font-semibold text-[#4D0E13] hover:bg-[#4D0E13] hover:text-white transition-all cursor-pointer shadow-2xs"
                            >
                              <Sparkles className="w-2.5 h-2.5 text-[#C8A49F]" />
                              <span>{acc.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Pricing & Quick CTAs (Rating star removed) */}
                  <div className="pt-2 border-t border-[#EEE4DA] flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[11px] text-[#5e5460]">
                        <span className="font-semibold text-[#4D0E13]">Stylist Curated</span>
                        <span aria-hidden="true">•</span>
                        <span className="capitalize">{product.aesthetic[0] || 'Luxury'}</span>
                      </div>
                      <div className="text-xs font-bold text-[#4D0E13] mt-0.5">
                        ₹{product.rentalPrice4Days.toLocaleString('en-IN')}
                        <span className="text-[10px] text-[#5e5460] font-normal"> / 4 days</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onOpenProductDetail(product)}
                        className="px-3 py-2 bg-[#4D0E13] text-white rounded-xl text-xs font-semibold hover:bg-[#3b172b] transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                        title={`Rent ${product.name}`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5 text-[#C8A49F]" />
                        <span>Rent Fit</span>
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
