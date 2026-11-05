import React, { useState, useMemo } from 'react';
import { OCCASIONS, Occasion, PRODUCTS, Product } from '../data/catalog';
import { ArrowRight, Sparkles, Eye, ShoppingBag, Heart, Check, RefreshCw } from 'lucide-react';
import { useImageManager } from '../context/ImageManagerContext';
import { CartItem } from '../types';
import { getProductColorHarmony } from '../utils/colorHarmony';

interface OccasionSectionProps {
  selectedOccasion: string | null;
  onSelectOccasion: (id: string | null) => void;
  onViewOccasionCollection?: (id: string) => void;
  onAddToCart?: (item: CartItem) => void;
  onOpenProductDetail?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: (productId: string) => boolean;
}

const CATEGORY_TABS = [
  { id: 'all', label: 'All Occasions' },
  { id: 'wedding', label: 'Wedding' },
  { id: 'party', label: 'Party' },
  { id: 'festive', label: 'Festive' },
  { id: 'casual', label: 'Casual' },
  { id: 'traditional', label: 'Traditional' },
];

export const OccasionSection: React.FC<OccasionSectionProps> = ({
  selectedOccasion,
  onSelectOccasion,
  onViewOccasionCollection,
  onAddToCart,
  onOpenProductDetail,
  onToggleWishlist,
  isWishlisted,
}) => {
  const { getImage } = useImageManager();
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter the occasions list based on the category tab (Wedding, Party, Festive, Casual, Traditional)
  const filteredOccasions = useMemo(() => {
    if (activeCategoryFilter === 'all') return OCCASIONS;
    if (activeCategoryFilter === 'traditional') {
      return OCCASIONS.filter(
        (o) => o.category === 'festive' || o.id === 'weddings-guest' || o.id === 'festivals-diwali'
      );
    }
    return OCCASIONS.filter((o) => o.category === activeCategoryFilter);
  }, [activeCategoryFilter]);

  // Active occasion object if one is selected by the user
  const activeOccasionObj = useMemo(() => {
    if (!selectedOccasion) return null;
    return OCCASIONS.find((o) => o.id === selectedOccasion) || null;
  }, [selectedOccasion]);

  // Outfits matching the selected occasion ONLY when selected
  const matchingOutfits = useMemo(() => {
    if (!selectedOccasion) return [];
    return PRODUCTS.filter((p) => {
      if (p.category === 'accessory') return false;
      return (
        p.occasions.includes(selectedOccasion) ||
        (activeOccasionObj && p.occasions.includes(activeOccasionObj.id)) ||
        (activeOccasionObj && p.aesthetic.some((a) => a.toLowerCase() === activeOccasionObj.category.toLowerCase()))
      );
    });
  }, [selectedOccasion, activeOccasionObj]);

  const handleCardClick = (occasionId: string) => {
    if (selectedOccasion === occasionId) {
      // Allow deselecting
      onSelectOccasion(null);
    } else {
      onSelectOccasion(occasionId);
    }
  };

  const handleCategoryTabClick = (catId: string) => {
    setActiveCategoryFilter(catId);
    // If user clicks a specific category tab, and no occasion selected, let them choose from the cards
  };

  const handleQuickAdd = (product: Product) => {
    if (!onAddToCart) return;
    const colorHarmony = getProductColorHarmony(product);
    const cartItem: CartItem = {
      id: `occasion-${product.id}-${Date.now()}`,
      product,
      selectedSize: product.sizes[0] || 'M',
      selectedColor: colorHarmony.harmonyName,
      rentalDurationDays: 4,
      itemTotal: product.rentalPrice4Days,
    };
    onAddToCart(cartItem);
    setToastMessage(`✨ Added "${product.name}" to your rental bag!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <section id="occasions" className="py-16 bg-[#fcf5f0] border-b border-[#C8A49F]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[#4D0E13] mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C8A49F]" />
              <span>Event & Celebration Wardrobe</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2D1517] tracking-tight">
              Occasions — Find a Look for Every Moment
            </h2>
            <p className="text-sm sm:text-base text-[#5e5460] mt-1.5 max-w-2xl">
              From high-octane Garba twirls to royal wedding guest luxury, college farewells, and dreamy vacation brunches.
            </p>
          </div>

          {selectedOccasion && (
            <button
              onClick={() => onSelectOccasion(null)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#4D0E13] hover:text-[#2D1517] bg-white px-3.5 py-1.5 rounded-full border border-[#C8A49F]/40 shadow-xs cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset Occasion Filter</span>
            </button>
          )}
        </div>

        {/* Category Filter Pills: Wedding, Party, Festive, Casual, Traditional */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
          {CATEGORY_TABS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryTabClick(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategoryFilter === cat.id
                  ? 'bg-[#4D0E13] text-white shadow-sm'
                  : 'bg-white text-[#5e5460] border border-[#C8A49F]/40 hover:bg-[#EEE4DA]/50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Occasions Card Grid with Portrait Ratio so Outfits Display Properly */}
        {/* Requirement: All options unselected by default, user manually clicks */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-12">
          {filteredOccasions.map((occasion: Occasion) => {
            const isSelected = selectedOccasion === occasion.id;
            const displayImg = getImage(`occasion-${occasion.id}`, occasion.image);

            return (
              <div
                key={occasion.id}
                onClick={() => handleCardClick(occasion.id)}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 border bg-white flex flex-col ${
                  isSelected
                    ? 'ring-3 ring-[#4D0E13] shadow-xl border-[#4D0E13] transform -translate-y-1.5 scale-[1.01]'
                    : 'border-[#C8A49F]/40 hover:border-[#4D0E13]/50 hover:shadow-md'
                }`}
              >
                {/* Portrait Image Container (3:4 ratio) */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAF5F0] flex items-center justify-center p-2">
                  <img
                    src={displayImg}
                    alt={occasion.name}
                    className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-500"
                    loading="lazy"
                  />
                  <div
                    className={`absolute inset-0 transition-opacity ${
                      isSelected
                        ? 'bg-gradient-to-t from-[#4D0E13]/90 via-[#4D0E13]/30 to-transparent'
                        : 'bg-gradient-to-t from-black/80 via-black/20 to-transparent'
                    }`}
                  />
                  
                  {/* Category Pill Tag top left */}
                  <span className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 text-[9px] sm:text-[10px] uppercase tracking-wider font-bold text-white bg-[#4D0E13]/85 backdrop-blur-xs px-2.5 py-1 rounded-full border border-white/20">
                    {occasion.category}
                  </span>

                  {/* Active selection badge */}
                  {isSelected && (
                    <span className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 text-[10px] sm:text-[11px] font-bold text-[#4D0E13] bg-[#C8A49F] px-2.5 py-1 rounded-full shadow-md flex items-center gap-1 animate-fadeIn">
                      <Check className="w-3 h-3" />
                      <span>Selected</span>
                    </span>
                  )}

                  {/* Title overlay at base of image */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 text-white">
                    <h3 className="font-serif text-sm sm:text-base font-bold leading-tight drop-shadow-sm group-hover:text-[#C8A49F] transition-colors">
                      {occasion.name}
                    </h3>
                  </div>
                </div>

                {/* Card Body */}
                <div className={`p-3 sm:p-4 flex-1 flex flex-col justify-between transition-colors ${
                  isSelected ? 'bg-[#4D0E13] text-white' : 'bg-white text-[#5e5460]'
                }`}>
                  <p className={`text-[11px] sm:text-xs leading-relaxed mb-2.5 line-clamp-2 ${
                    isSelected ? 'text-[#EEE4DA]' : 'text-[#5e5460]'
                  }`}>
                    {occasion.tagline}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-current/20 text-[11px] sm:text-xs font-semibold">
                    <span>
                      {isSelected ? 'Viewing Outfits' : 'View Outfits'}
                    </span>
                    <ArrowRight className={`w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform ${
                      isSelected ? 'text-[#C8A49F]' : 'text-[#4D0E13]'
                    }`} />
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Dedicated Outfits Showcase for the Selected Occasion */}
        {selectedOccasion && (
          <div className="bg-white rounded-3xl p-5 sm:p-8 border border-[#C8A49F]/40 shadow-md animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-[#C8A49F]/20 gap-3">
              <div>
                <div className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#4D0E13] mb-1">
                  <span>✨ Featured Outfits Showcase</span>
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2D1517]">
                  Curated Looks for {activeOccasionObj?.name || 'Selected Occasion'}
                </h3>
                <p className="text-xs text-[#5e5460] mt-0.5">
                  {activeOccasionObj?.tagline || 'Designer outfits ready for your event.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectOccasion(null)}
                  className="px-3.5 py-1.5 rounded-full border border-[#C8A49F]/50 text-xs font-semibold text-[#5e5460] hover:bg-[#EEE4DA] transition-colors cursor-pointer"
                >
                  Clear Selection
                </button>
                {onViewOccasionCollection && (
                  <button
                    onClick={() => {
                      const elem = document.getElementById('collections');
                      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#4D0E13] text-white text-xs font-bold hover:bg-[#38090d] transition-colors cursor-pointer shadow-xs"
                  >
                    <span>View in Catalogue</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#C8A49F]" />
                  </button>
                )}
              </div>
            </div>

            {matchingOutfits.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {matchingOutfits.map((product) => {
                  const displayImg = getImage(`product-${product.id}`, product.images[0]);
                  const colorHarmony = getProductColorHarmony(product);
                  const liked = isWishlisted ? isWishlisted(product.id) : false;

                  return (
                    <div
                      key={product.id}
                      onClick={() => onOpenProductDetail && onOpenProductDetail(product)}
                      className="group bg-[#FFFDFB] rounded-2xl overflow-hidden border border-[#C8A49F]/35 shadow-xs hover:shadow-xl hover:border-[#4D0E13]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                    >
                      <div>
                        {/* Portrait Image (3:4 ratio) displaying full outfit */}
                        <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100 flex items-center justify-center p-2">
                          <img
                            src={displayImg}
                            alt={product.name}
                            className="w-full h-full object-contain object-center drop-shadow-xs group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />

                          <div className="absolute top-2.5 left-2.5">
                            <span className="bg-black/60 backdrop-blur-md text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {product.category === 'him' ? 'For Him' : 'For Her'}
                            </span>
                          </div>

                          {onToggleWishlist && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onToggleWishlist(product);
                              }}
                              className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center bg-white/90 text-[#2D1517] hover:bg-white shadow-xs cursor-pointer"
                              aria-label="Wishlist"
                            >
                              <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-[#4D0E13] text-[#4D0E13]' : 'text-[#5e5460]'}`} />
                            </button>
                          )}

                          <div className="absolute inset-x-0 bottom-0 p-2.5 bg-gradient-to-t from-black/75 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="text-[11px] font-bold text-white bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/40 flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5 text-[#C8A49F]" />
                              <span>View Outfit</span>
                            </span>
                          </div>
                        </div>

                        <div className="p-3.5">
                          <div className="flex items-center justify-between text-[10px] text-[#5e5460] font-semibold uppercase tracking-wider mb-1">
                            <span className="truncate">{product.brand}</span>
                            <span>{colorHarmony.harmonyName.split(' ')[0]}</span>
                          </div>
                          <h4 className="font-serif text-sm font-bold text-[#2D1517] line-clamp-1 group-hover:text-[#4D0E13] transition-colors">
                            {product.name}
                          </h4>
                          <p className="text-[11px] text-[#5e5460] line-clamp-1 mt-0.5">
                            {product.fabric} · {product.fit}
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 pt-2 border-t border-[#C8A49F]/20 flex items-center justify-between gap-2">
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="font-serif text-sm font-bold text-[#4D0E13] font-mono">
                              ₹{product.rentalPrice4Days.toLocaleString()}
                            </span>
                            <span className="text-[10px] text-[#5e5460]">/ 4 days</span>
                          </div>
                          <span className="text-[9px] text-[#5e5460] line-through block">
                            Retail ₹{product.retailPrice.toLocaleString()}
                          </span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickAdd(product);
                          }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#4D0E13] text-white text-[11px] font-semibold hover:bg-[#38090d] transition-colors cursor-pointer shadow-xs"
                        >
                          <ShoppingBag className="w-3 h-3 text-[#C8A49F]" />
                          <span>Rent</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center text-[#5e5460]">
                <p className="text-sm font-semibold">No outfits found matching this occasion.</p>
                <button
                  onClick={() => onSelectOccasion(null)}
                  className="mt-2 text-xs font-bold text-[#4D0E13] underline cursor-pointer"
                >
                  Choose another occasion
                </button>
              </div>
            )}
          </div>
        )}

        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#4D0E13] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-fadeIn border border-[#C8A49F]/40 text-xs">
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

      </div>
    </section>
  );
};
