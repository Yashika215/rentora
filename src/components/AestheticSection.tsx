import React, { useState } from 'react';
import { AESTHETICS, Aesthetic, PRODUCTS, Product } from '../data/catalog';
import { Sparkles, Check, ArrowRight, ShoppingBag, Eye, Heart } from 'lucide-react';
import { useImageManager } from '../context/ImageManagerContext';

interface AestheticSectionProps {
  selectedAesthetics: string[];
  onToggleAesthetic: (id: string) => void;
  onClearAesthetics: () => void;
  onExploreMatchingOutfits?: () => void;
  onTakeQuiz?: () => void;
  onAddToCart?: (item: any) => void;
  onOpenProductDetail?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: (productId: string) => boolean;
}

export const AestheticSection: React.FC<AestheticSectionProps> = ({
  selectedAesthetics,
  onToggleAesthetic,
  onClearAesthetics,
  onExploreMatchingOutfits,
  onTakeQuiz,
  onAddToCart,
  onOpenProductDetail,
  onToggleWishlist,
  isWishlisted,
}) => {
  const { getImage } = useImageManager();
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'her' | 'him' | 'accessory'>('all');

  // Filter products matching any of the selected aesthetics (or all if none selected)
  const matchingProducts = PRODUCTS.filter((product) => {
    // Category match
    if (activeCategoryFilter !== 'all' && product.category !== activeCategoryFilter) {
      return false;
    }
    // Aesthetic match
    if (selectedAesthetics.length === 0) return true;
    return product.aesthetic.some((a) => selectedAesthetics.includes(a));
  });

  return (
    <section id="aesthetics" className="py-16 bg-[#EEE4DA] border-b border-[#C8A49F]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[#4D0E13] mb-2">
              <span>✨</span>
              <span>Style Discovery</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2D1517] tracking-tight">
              What’s Your Aesthetic? <span className="text-[#C8A49F]">✨</span>
            </h2>
            <p className="text-sm text-[#5e5460] mt-2 max-w-2xl">
              Select one or more styles below to filter the collection to your aesthetic.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">

            {onTakeQuiz && (
              <button
                onClick={onTakeQuiz}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white text-[#4D0E13] border border-[#C8A49F] hover:bg-[#EEE4DA] hover:border-[#4D0E13] text-xs font-semibold shadow-xs transition-all cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C8A49F]" />
                <span>Style Persona Quiz 🎀</span>
              </button>
            )}
            {selectedAesthetics.length > 0 && (
              <button
                onClick={onClearAesthetics}
                className="text-xs text-[#5e5460] hover:text-[#4D0E13] underline font-medium cursor-pointer"
              >
                Clear all ({selectedAesthetics.length})
              </button>
            )}
            {selectedAesthetics.length > 0 && onExploreMatchingOutfits && (
              <button
                onClick={onExploreMatchingOutfits}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#4D0E13] text-white text-xs font-semibold hover:bg-[#3b172b] transition-all cursor-pointer shadow-xs"
              >
                <span>Explore Full Catalog ({matchingProducts.length})</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#C8A49F]" />
              </button>
            )}
          </div>
        </div>

        {/* Aesthetics Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-4 mb-10">
          {AESTHETICS.map((item: Aesthetic) => {
            const isSelected = selectedAesthetics.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => onToggleAesthetic(item.id)}
                className={`relative group rounded-xl p-3.5 text-center cursor-pointer transition-all duration-200 border flex flex-col justify-between select-none ${
                  isSelected
                    ? 'bg-[#4D0E13] text-white border-[#4D0E13] shadow-md transform -translate-y-1'
                    : 'bg-white hover:bg-[#EEE4DA] text-[#2D1517] border-[#C8A49F]/40 hover:border-[#4D0E13]/50 hover:shadow-sm'
                }`}
              >
                {/* Checkbox indicator */}
                <div className="absolute top-2 right-2">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-[#C8A49F] text-[#4D0E13]'
                        : 'border border-gray-300 group-hover:border-[#C8A49F]'
                    }`}
                  >
                    {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                  </div>
                </div>

                {/* Emoji Icon */}
                <div className="text-2xl sm:text-3xl mb-1.5 transition-transform group-hover:scale-110">
                  {item.emoji}
                </div>

                {/* Name */}
                <h3
                  className={`font-serif text-xs sm:text-sm font-bold transition-colors ${
                    isSelected ? 'text-white' : 'text-[#2D1517] group-hover:text-[#4D0E13]'
                  }`}
                >
                  {item.name}
                </h3>

                {/* Tagline */}
                <p
                  className={`text-[10px] leading-tight mt-1 line-clamp-2 ${
                    isSelected ? 'text-[#C8A49F]' : 'text-[#5e5460]'
                  }`}
                >
                  {item.tagline}
                </p>
              </div>
            );
          })}
        </div>

        {/* Selected Aesthetics Header & Category Filter Tabs */}
        <div className="p-5 rounded-2xl bg-white border border-[#C8A49F]/40 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#EEE4DA]">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-base text-[#2D1517]">
                  {selectedAesthetics.length > 0
                    ? `Curated Outfits for Active Vibes (${selectedAesthetics.length})`
                    : 'Curated Outfits Across All Aesthetics'}
                </span>
                <span className="text-xs bg-[#4D0E13] text-white px-2 py-0.5 rounded-full font-bold">
                  {matchingProducts.length} Items
                </span>
              </div>

              {/* Active Aesthetic Pills */}
              {selectedAesthetics.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {selectedAesthetics.map((id) => {
                    const aes = AESTHETICS.find((a) => a.id === id);
                    if (!aes) return null;
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#C8A49F]/20 text-[#4D0E13] text-xs font-semibold border border-[#C8A49F]/40"
                      >
                        <span>{aes.emoji}</span>
                        <span>{aes.name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleAesthetic(id);
                          }}
                          className="hover:text-red-600 ml-1 font-bold cursor-pointer"
                          aria-label={`Remove ${aes.name} filter`}
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-[#5e5460] mt-1">
                  Tap any aesthetic badge above to filter specific looks tailored to your mood!
                </p>
              )}
            </div>

            {/* Category Filter Tabs inside Aesthetic Tray */}
            <div className="flex items-center gap-1.5 bg-[#EEE4DA] p-1 rounded-full text-xs font-semibold overflow-x-auto scrollbar-none max-w-full">
              <button
                onClick={() => setActiveCategoryFilter('all')}
                className={`px-3 py-1.5 rounded-full transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                  activeCategoryFilter === 'all'
                    ? 'bg-[#4D0E13] text-white shadow-xs'
                    : 'text-[#2D1517] hover:text-[#4D0E13]'
                }`}
              >
                All Categories ✨
              </button>
              <button
                onClick={() => setActiveCategoryFilter('her')}
                className={`px-3 py-1.5 rounded-full transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                  activeCategoryFilter === 'her'
                    ? 'bg-[#4D0E13] text-white shadow-xs'
                    : 'text-[#2D1517] hover:text-[#4D0E13]'
                }`}
              >
                For Her 🎀
              </button>
              <button
                onClick={() => setActiveCategoryFilter('him')}
                className={`px-3 py-1.5 rounded-full transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                  activeCategoryFilter === 'him'
                    ? 'bg-[#4D0E13] text-white shadow-xs'
                    : 'text-[#2D1517] hover:text-[#4D0E13]'
                }`}
              >
                For Him 🍸
              </button>
              <button
                onClick={() => setActiveCategoryFilter('accessory')}
                className={`px-3 py-1.5 rounded-full transition-all cursor-pointer shrink-0 whitespace-nowrap ${
                  activeCategoryFilter === 'accessory'
                    ? 'bg-[#4D0E13] text-white shadow-xs'
                    : 'text-[#2D1517] hover:text-[#4D0E13]'
                }`}
              >
                Accessories 💎
              </button>
            </div>
          </div>

          {/* Product Items Carousel / Grid */}
          {matchingProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
              {matchingProducts.map((product) => {
                const isFavorited = isWishlisted ? isWishlisted(product.id) : false;
                // Find primary matching aesthetic label
                const matchedAestheticId = product.aesthetic.find((a) =>
                  selectedAesthetics.includes(a)
                ) || product.aesthetic[0];
                const aestheticObj = AESTHETICS.find((a) => a.id === matchedAestheticId);

                return (
                  <div
                    key={product.id}
                    className="group relative bg-white rounded-xl border border-[#C8A49F]/30 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col"
                  >
                    {/* Image Area */}
                    <div
                      className="relative aspect-[3/4] bg-[#FAF5F0] overflow-hidden cursor-pointer flex items-center justify-center p-2"
                      onClick={() => onOpenProductDetail && onOpenProductDetail(product)}
                    >
                      <img
                        src={getImage(`product-${product.id}`, product.images[0])}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-500"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />

                      {/* Aesthetic Pill Badge */}
                      {aestheticObj && (
                        <div className="absolute top-2 left-2 z-10">
                          <span className="inline-flex items-center gap-1 bg-white/90 backdrop-blur-md text-[#4D0E13] px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs">
                            <span>{aestheticObj.emoji}</span>
                            <span>{aestheticObj.name}</span>
                          </span>
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className="absolute top-2 right-2 z-10">
                        <span className="bg-[#4D0E13]/80 text-white text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full">
                          {product.category === 'her'
                            ? 'Her'
                            : product.category === 'him'
                            ? 'Him'
                            : 'Accessory'}
                        </span>
                      </div>

                      {/* Wishlist Button */}
                      {onToggleWishlist && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(product);
                          }}
                          className={`absolute bottom-2 right-2 z-10 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                            isFavorited
                              ? 'bg-[#4D0E13] text-[#C8A49F]'
                              : 'bg-white/80 text-gray-700 hover:bg-white hover:text-red-500'
                          }`}
                          aria-label="Wishlist"
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
                        </button>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-[#C8A49F] tracking-wider mb-0.5">
                          {product.brand}
                        </div>
                        <h4
                          onClick={() => onOpenProductDetail && onOpenProductDetail(product)}
                          className="font-serif text-xs font-bold text-[#2D1517] hover:text-[#4D0E13] transition-colors cursor-pointer line-clamp-1"
                        >
                          {product.name}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-[#5e5460]">
                          <span className="font-semibold text-[#4D0E13]">Curated</span>
                          <span aria-hidden="true">•</span>
                          <span className="capitalize">{product.category === 'her' ? 'For Her' : product.category === 'him' ? 'For Him' : 'Accessory'}</span>
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-[#EEE4DA] flex items-center justify-between">
                        <div>
                          <div className="text-[9px] text-[#5e5460] uppercase">4-Day Rental</div>
                          <div className="text-xs font-bold text-[#4D0E13]">
                            ₹{product.rentalPrice4Days.toLocaleString('en-IN')}
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          {onOpenProductDetail && (
                            <button
                              onClick={() => onOpenProductDetail(product)}
                              className="p-1.5 rounded-lg text-[#5e5460] hover:text-[#4D0E13] hover:bg-[#EEE4DA] transition-colors cursor-pointer"
                              title="Quick View"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                          )}
                          {onAddToCart && (
                            <button
                              onClick={() =>
                                onAddToCart({
                                  id: `cart-${product.id}-${Date.now()}`,
                                  product,
                                  selectedSize: product.sizes[0] || 'M',
                                  selectedColor: product.colors[0]?.name || 'Standard',
                                  rentalDurationDays: 4,
                                  itemTotal: product.rentalPrice4Days,
                                })
                              }
                              className="px-2.5 py-1.5 bg-[#4D0E13] text-white rounded-lg text-[11px] font-semibold hover:bg-[#3b172b] transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <ShoppingBag className="w-3 h-3 text-[#C8A49F]" />
                              <span>Rent</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-[#5e5460]">
              <p className="text-sm font-semibold">
                {activeCategoryFilter === 'him'
                  ? "No matching men's styles available yet."
                  : 'No items found matching the selected filters.'}
              </p>
              <button
                onClick={onClearAesthetics}
                className="mt-2 text-xs font-semibold text-[#4D0E13] underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>

        {/* Bottom Banner callout */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#4D0E13] to-[#2D1517] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-2xl">✨</span>
            <div>
              <h4 className="font-serif font-bold text-sm text-[#EEE4DA]">
                Need RÉNÉ’s personal styling advice?
              </h4>
              <p className="text-xs text-[#C8A49F]">
                RÉNÉ can instantly assemble a head-to-toe ensemble for any of these {AESTHETICS.length} aesthetics!
              </p>
            </div>
          </div>
          {onExploreMatchingOutfits && (
            <button
              onClick={onExploreMatchingOutfits}
              className="px-4 py-2 rounded-full bg-[#C8A49F] text-[#4D0E13] font-bold text-xs hover:bg-white transition-all cursor-pointer shrink-0 shadow-xs"
            >
              View Full Collection →
            </button>
          )}
        </div>

      </div>
    </section>
  );
};
