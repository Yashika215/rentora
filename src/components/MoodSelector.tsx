import React, { useState, useMemo } from 'react';
import { Product, PRODUCTS, TODAY_MOODS, MoodOption } from '../data/catalog';
import { CartItem } from '../types';
import { useLocation } from '../context/LocationContext';
import { useImageManager } from '../context/ImageManagerContext';
import { 
  Sparkles, 
  RotateCcw, 
  ArrowDown, 
  Eye, 
  ShoppingBag, 
  Bot, 
  Heart, 
  Check, 
  Truck, 
  ArrowRight,
  Gem,
  Footprints,
  Briefcase
} from 'lucide-react';
import reniAvatar from '../assets/images/reni_avatar_new_1792982285301.jpg';

interface MoodSelectorProps {
  selectedMood: string | null;
  onSelectMood: (moodId: string | null) => void;
  onAddToCart: (item: CartItem, silent?: boolean) => void;
  onOpenProductDetail: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: (id: string) => boolean;
  onOpenReniChatForMood?: (moodId: string) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onSelectMood,
  onAddToCart,
  onOpenProductDetail,
  onToggleWishlist,
  isWishlisted,
  onOpenReniChatForMood,
}) => {
  const { location, cityAvailability } = useLocation();
  const { getImage } = useImageManager();
  const [activeTab, setActiveTab] = useState<'all' | 'her' | 'him' | 'accessory'>('all');
  const [durationMap, setDurationMap] = useState<Record<string, number>>({});
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  const activeMoodObj = useMemo(() => {
    return TODAY_MOODS.find((m) => m.id === selectedMood) || null;
  }, [selectedMood]);

  // Filter products strictly matching the selected mood
  const moodProducts = useMemo(() => {
    if (!selectedMood) return [];
    return PRODUCTS.filter((item) => {
      // Must have item.moods containing selectedMood
      const matchesMood = item.moods && item.moods.includes(selectedMood);
      if (!matchesMood) return false;

      // Category tab filter
      if (activeTab === 'her') return item.category === 'her';
      if (activeTab === 'him') return item.category === 'him';
      if (activeTab === 'accessory') return item.category === 'accessory';
      return true;
    });
  }, [selectedMood, activeTab]);

  // Matching curated accessories categorized into Jewellery, Footwear, and Bags
  const moodAccessories = useMemo(() => {
    if (!selectedMood) return { jewellery: [], footwear: [], bags: [] };
    const matching = PRODUCTS.filter(
      (item) => item.category === 'accessory' && item.moods && item.moods.includes(selectedMood)
    );

    const jewellery = matching.filter(
      (a) => a.subCategory.includes('Jewellery') || a.subCategory.includes('Necklace') || a.subCategory.includes('Hair')
    );
    const footwear = matching.filter((a) => a.subCategory.includes('Shoes') || a.subCategory.includes('Footwear'));
    const bags = matching.filter(
      (a) => a.subCategory.includes('Bags') || a.subCategory.includes('Clutches') || a.subCategory.includes('Sunglasses')
    );

    return { jewellery, footwear, bags };
  }, [selectedMood]);

  const handleDurationChange = (productId: string, days: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setDurationMap((prev) => ({ ...prev, [productId]: days }));
  };

  const getProductPriceForDuration = (product: Product, days: number) => {
    if (days === 2) return Math.round(product.rentalPrice4Days * 0.7);
    if (days === 7) return Math.round(product.rentalPrice4Days * 1.5);
    return product.rentalPrice4Days;
  };

  const handleQuickReserve = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    const days = durationMap[product.id] || 4;
    const finalPrice = getProductPriceForDuration(product, days);

    onAddToCart({
      id: `${product.id}-${Date.now()}`,
      product,
      selectedSize: product.sizes[0] || 'One Size',
      selectedColor: product.colors[0]?.name || 'Standard',
      rentalDurationDays: days,
      itemTotal: finalPrice,
    }, true); // silent: true to prevent notifications while clicking the product

    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  const scrollToRecommendations = () => {
    const el = document.getElementById('mood-recommendations');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="todays-mood-section" className="bg-[#F5EFE7] border-b border-[#C6A77D]/30 transition-all duration-300">
      
      {/* 1. Header & Mood Selection Options Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Section Top Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#6D3546]/10 border border-[#6D3546]/20 text-[#6D3546] text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C6A77D]" />
              <span>Today’s Mood · Personalized Styling</span>
            </div>
            
            <h2 className="font-serif text-3xl sm:text-4xl text-[#292727] tracking-tight">
              {activeMoodObj ? activeMoodObj.headline : 'Dress How You Feel Today'}
            </h2>
            
            <p className="text-sm text-[#5e5460] mt-1 max-w-2xl">
              {activeMoodObj 
                ? activeMoodObj.tagline
                : 'Select your mood below to view curated outfits, footwear, and coordinated jewellery.'}
            </p>
          </div>

          {/* Action buttons (Discover Your Look & Reset Mood) */}
          <div className="flex items-center gap-3 shrink-0">
            {activeMoodObj && (
              <>
                <button
                  onClick={scrollToRecommendations}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6D3546] text-white text-xs font-semibold shadow-sm hover:bg-[#522533] transition-all cursor-pointer"
                >
                  <span>Discover Your Look</span>
                  <ArrowDown className="w-3.5 h-3.5 text-[#C6A77D]" />
                </button>

                <button
                  onClick={() => onSelectMood(null)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-[#C6A77D]/40 text-[#292727] hover:text-[#6D3546] text-xs font-semibold transition-all shadow-xs cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#6D3546]" />
                  <span>Reset Mood</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* 6 Mood Selection Options */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {TODAY_MOODS.map((mood) => {
            const isSelected = selectedMood === mood.id;
            return (
              <button
                key={mood.id}
                onClick={() => {
                  if (isSelected) {
                    onSelectMood(null);
                  } else {
                    onSelectMood(mood.id);
                  }
                }}
                className={`relative group p-3.5 rounded-2xl text-left border transition-all duration-300 flex flex-col justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#6D3546] text-white border-[#6D3546] shadow-lg ring-2 ring-[#C6A77D]/60 scale-[1.02]'
                    : 'bg-white text-[#292727] border-[#C6A77D]/35 hover:border-[#6D3546]/60 hover:shadow-md hover:-translate-y-0.5'
                }`}
              >
                {/* Mood Icon & Active Tag */}
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-2xl" role="img" aria-label={mood.label}>
                    {mood.emoji}
                  </span>
                  {isSelected && (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-[#C6A77D] text-[#292727] px-2 py-0.5 rounded-full shadow-xs">
                      <Check className="w-2.5 h-2.5 stroke-[3]" />
                      <span>Active</span>
                    </span>
                  )}
                </div>

                {/* Mood Label */}
                <h3 className={`font-serif text-sm font-bold leading-snug line-clamp-1 ${
                  isSelected ? 'text-white' : 'text-[#292727] group-hover:text-[#6D3546]'
                }`}>
                  {mood.label.replace(/ [^\s]+$/, '')}
                </h3>

                {/* Subtitle / Quote hint */}
                <p className={`text-[11px] line-clamp-2 mt-1 leading-relaxed ${
                  isSelected ? 'text-[#F5EFE7]/80' : 'text-[#5e5460]'
                }`}>
                  {mood.quote}
                </p>

                {/* Palette indicator dots */}
                <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-black/5">
                  {mood.palette.map((color, idx) => (
                    <span
                      key={idx}
                      className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <span className={`text-[9px] ml-auto font-medium ${
                    isSelected ? 'text-[#C6A77D]' : 'text-[#5e5460]'
                  }`}>
                    Curated
                  </span>
                </div>
              </button>
            );
          })}
        </div>

      </div>

      {/* 2. Personalized Mood Recommendations Section (When Mood Selected) */}
      {activeMoodObj && (
        <div id="mood-recommendations" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-6">
          
          {/* Dynamic Editorial Headline Bar */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C6A77D]/40 shadow-md mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{activeMoodObj.emoji}</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-[#6D3546]">
                    Curated Luxury Capsule
                  </span>
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#292727]">
                  {activeMoodObj.headline}
                </h3>
                <p className="text-sm text-[#5e5460] mt-1.5 leading-relaxed">
                  {activeMoodObj.outfitAdvice}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[#6D3546]">
                  <span className="font-semibold">Style Palette:</span>
                  {activeMoodObj.palette.map((color, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-mono border border-black/10"
                      style={{ backgroundColor: color, color: color === '#FFFFFF' || color === '#F5F5DC' ? '#292727' : '#FFFFFF' }}
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>

              {/* RÉNÉ AI Stylist Card */}
              <div className="lg:w-96 bg-[#F5EFE7] rounded-2xl p-4 sm:p-5 border border-[#C6A77D]/40 shrink-0">
                <div className="flex items-center gap-3 mb-2.5">
                  <img
                    src={reniAvatar}
                    alt="RÉNÉ Stylist"
                    className="w-11 h-11 rounded-full object-cover border-2 border-[#6D3546] shadow-xs"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#6D3546] uppercase tracking-wider flex items-center gap-1.5">
                      <Bot className="w-3.5 h-3.5 text-[#C6A77D]" />
                      <span>RÉNÉ’s Mood Verdict</span>
                    </h4>
                    <p className="text-[11px] text-[#5e5460]">Personalized ensemble curation</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-[#292727] mb-3">
                  <div className="line-clamp-1">
                    <span className="font-semibold text-[#6D3546]">Outfit: </span>
                    <span>{activeMoodObj.reneRecommendation.outfitName} ({activeMoodObj.reneRecommendation.outfitPrice})</span>
                  </div>
                  <div className="line-clamp-1">
                    <span className="font-semibold text-[#6D3546]">Jewellery: </span>
                    <span>{activeMoodObj.reneRecommendation.jewellery}</span>
                  </div>
                  <div className="line-clamp-1">
                    <span className="font-semibold text-[#6D3546]">Footwear: </span>
                    <span>{activeMoodObj.reneRecommendation.footwear}</span>
                  </div>
                  <div className="line-clamp-1">
                    <span className="font-semibold text-[#6D3546]">Handbag: </span>
                    <span>{activeMoodObj.reneRecommendation.bag}</span>
                  </div>
                </div>

                <p className="text-[11px] text-[#5e5460] italic border-t border-[#C6A77D]/20 pt-2 mb-3">
                  "{activeMoodObj.reneRecommendation.explanation}"
                </p>

                {onOpenReniChatForMood && (
                  <button
                    onClick={() => onOpenReniChatForMood(activeMoodObj.id)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#6D3546] hover:bg-[#522533] text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#C6A77D]" />
                    <span>Ask RÉNÉ to Style This Mood 💬</span>
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* Sub-Category Filter Tabs (All, For Her, For Him, Accessories) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 p-1 bg-white rounded-2xl border border-[#C6A77D]/40 shadow-xs overflow-x-auto scrollbar-none">
              {[
                { id: 'all', label: 'All Mood Looks' },
                { id: 'her', label: 'For Her 🎀' },
                { id: 'him', label: 'For Him 👔' },
                { id: 'accessory', label: 'Matching Accessories ✨' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-[#6D3546] text-white shadow-xs'
                      : 'text-[#5e5460] hover:text-[#6D3546] hover:bg-[#F5EFE7]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="text-xs text-[#5e5460]">
              Showing <span className="font-bold text-[#6D3546]">{moodProducts.length}</span> pieces for{' '}
              <span className="font-semibold text-[#292727]">{activeMoodObj.label}</span>
            </div>
          </div>

          {/* 3. Products Grid: 4 cols desktop, 2 cols tablet, 2 cols mobile */}
          {moodProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {moodProducts.map((product) => {
                const currentDuration = durationMap[product.id] || 4;
                const dynamicPrice = getProductPriceForDuration(product, currentDuration);
                const isQuickAdded = addedMap[product.id] || false;
                const wish = isWishlisted(product.id);

                return (
                  <div
                    key={product.id}
                    onClick={() => onOpenProductDetail(product)}
                    className="group relative bg-white rounded-2xl overflow-hidden border border-[#C6A77D]/35 shadow-xs hover:shadow-xl hover:border-[#6D3546]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer"
                  >
                    
                    {/* Top Image Container */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F5EFE7] flex items-center justify-center p-2">
                      <img
                        src={getImage(`product-${product.id}`, product.images[0])}
                        alt={product.name}
                        className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-500"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />

                      {/* Wishlist Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(product);
                        }}
                        aria-label="Save to Wishlist"
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-[#6D3546] hover:bg-white hover:scale-110 shadow-sm transition-all z-10 cursor-pointer"
                      >
                        <Heart
                          className={`w-4 h-4 transition-colors ${
                            wish ? 'fill-[#6D3546] text-[#6D3546]' : 'text-[#5e5460]'
                          }`}
                        />
                      </button>

                      {/* Category Badge & Mood Tag */}
                      <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#292727] bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs">
                          {product.category === 'her' ? 'For Her' : product.category === 'him' ? 'For Him' : 'Accessory'}
                        </span>
                        <span className="text-[10px] font-semibold text-white bg-[#6D3546]/95 backdrop-blur-xs px-2 py-0.5 rounded-full shadow-xs">
                          {activeMoodObj.emoji}
                        </span>
                      </div>

                      {/* Quick View Button Hover Overlay */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenProductDetail(product);
                          }}
                          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/95 text-[#6D3546] text-xs font-semibold shadow-md hover:bg-white transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      </div>
                    </div>

                    {/* Card Content Details */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        
                        {/* Occasion / Brand Tag */}
                        <div className="text-[11px] text-[#5e5460] flex items-center gap-1.5 mb-1">
                          <span className="font-semibold text-[#6D3546]">{product.brand}</span>
                          <span aria-hidden="true">·</span>
                          <span className="capitalize">{product.occasions[0]?.replace('-', ' ') || 'Occasion'}</span>
                        </div>

                        {/* Product Title */}
                        <h4 className="font-serif text-base font-bold text-[#292727] group-hover:text-[#6D3546] transition-colors line-clamp-1 mb-1">
                          {product.name}
                        </h4>

                        {/* Demo Sizes */}
                        <div className="flex items-center gap-1 mb-3 text-[11px] text-[#5e5460]">
                          <span className="font-semibold text-[#292727]">Demo Sizes:</span>
                          <span className="line-clamp-1">
                            {product.sizes.length > 0 ? product.sizes.slice(0, 3).join(', ') : 'Free Size'}
                          </span>
                        </div>

                        {/* Rental Duration Selector: 2 days, 4 days, or 7 days */}
                        <div className="mb-3" onClick={(e) => e.stopPropagation()}>
                          <div className="text-[10px] text-[#5e5460] font-semibold uppercase tracking-wider mb-1.5">
                            Rental Duration:
                          </div>
                          <div className="grid grid-cols-3 gap-1 bg-[#F5EFE7] p-1 rounded-xl border border-[#C6A77D]/30">
                            {[2, 4, 7].map((days) => (
                              <button
                                key={days}
                                onClick={(e) => handleDurationChange(product.id, days, e)}
                                className={`py-1 text-[11px] font-semibold rounded-lg transition-all cursor-pointer ${
                                  currentDuration === days
                                    ? 'bg-[#6D3546] text-white shadow-xs'
                                    : 'text-[#5e5460] hover:text-[#292727] hover:bg-white/60'
                                }`}
                              >
                                {days} Days
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Price Row */}
                        <div className="flex items-baseline justify-between mb-2">
                          <div>
                            <div className="flex items-baseline gap-1">
                              <span className="font-serif text-lg font-bold text-[#6D3546] font-mono tabular-nums">
                                ₹{dynamicPrice.toLocaleString()}
                              </span>
                              <span className="text-[11px] text-[#5e5460]">
                                / {currentDuration} days
                              </span>
                            </div>
                            <span className="text-[10px] text-[#5e5460] line-through block">
                              Retail ₹{product.retailPrice.toLocaleString()}
                            </span>
                          </div>

                          <span className="text-[10px] font-medium text-[#292727] bg-[#F5EFE7] px-2 py-0.5 rounded-md border border-[#C6A77D]/30">
                            Deposit: ₹{product.deposit}
                          </span>
                        </div>

                        {/* College Project Disclaimer */}
                        <p className="text-[9px] text-[#8c828d] italic mb-3">
                          College project demo · Sample prices only
                        </p>

                      </div>

                      {/* Action Buttons: View Details & Reserve for Demo */}
                      <div className="pt-2 border-t border-[#C6A77D]/20 flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenProductDetail(product);
                          }}
                          className="px-3 py-2 rounded-xl border border-[#C6A77D]/50 text-[#6D3546] hover:bg-[#F5EFE7] text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Details
                        </button>

                        <button
                          onClick={(e) => handleQuickReserve(product, e)}
                          className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                            isQuickAdded
                              ? 'bg-emerald-700 text-white'
                              : 'bg-[#6D3546] text-white hover:bg-[#522533] shadow-xs'
                          }`}
                        >
                          {isQuickAdded ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Reserved!</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5 text-[#C6A77D]" />
                              <span>Reserve for Demo</span>
                            </>
                          )}
                        </button>
                      </div>

                    </div>

                  </div>
                );
              })}
            </div>
          ) : (
            /* Clear Empty State */
            <div className="bg-white rounded-3xl p-12 text-center border border-[#C6A77D]/40 shadow-xs max-w-xl mx-auto">
              <span className="text-4xl block mb-3">✨</span>
              <h4 className="font-serif text-xl font-bold text-[#292727] mb-2">
                No matching pieces in this sub-category
              </h4>
              <p className="text-sm text-[#5e5460] mb-5">
                We couldn't find pieces under "{activeTab === 'her' ? 'For Her' : activeTab === 'him' ? 'For Him' : 'Accessories'}" for the {activeMoodObj.label} mood.
              </p>
              <button
                onClick={() => setActiveTab('all')}
                className="px-5 py-2.5 rounded-xl bg-[#6D3546] text-white text-xs font-semibold shadow-xs hover:bg-[#522533] transition-colors cursor-pointer"
              >
                View All {activeMoodObj.label} Outfits
              </button>
            </div>
          )}

          {/* 4. Curated Coordinated Accessories Showcase */}
          <div className="mt-14 pt-10 border-t border-[#C6A77D]/30">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#6D3546] mb-1">
                  <Gem className="w-3.5 h-3.5 text-[#C6A77D]" />
                  <span>Coordinated Accessories for {activeMoodObj.label}</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#292727]">
                  Complete Your Look With Matching Pieces
                </h3>
                <p className="text-xs text-[#5e5460] mt-1">
                  {activeMoodObj.accessoryAdvice}
                </p>
              </div>
            </div>

            {/* 3 Accessory Columns: Jewellery, Footwear, Bags */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Category 1: Earrings & Jewellery */}
              <div className="bg-white rounded-2xl p-4 border border-[#C6A77D]/35 shadow-xs">
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-[#C6A77D]/20">
                  <Gem className="w-4 h-4 text-[#6D3546]" />
                  <h4 className="font-serif text-sm font-bold text-[#292727]">
                    Matching Jewellery & Earrings
                  </h4>
                </div>

                <div className="space-y-3">
                  {moodAccessories.jewellery.length > 0 ? (
                    moodAccessories.jewellery.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onOpenProductDetail(item)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F5EFE7] transition-colors cursor-pointer group"
                      >
                        <img
                          src={getImage(`product-${item.id}`, item.images[0])}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-contain p-1 bg-white border border-[#C6A77D]/30 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-[#292727] group-hover:text-[#6D3546] line-clamp-1">
                            {item.name}
                          </h5>
                          <p className="text-[11px] text-[#5e5460] line-clamp-1">{item.subCategory}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs font-mono font-bold text-[#6D3546]">
                              ₹{item.rentalPrice4Days} / 4 days
                            </span>
                            <span className="text-[10px] text-[#6D3546] font-semibold group-hover:underline">
                              View →
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#5e5460] py-4 text-center">No matching jewellery</p>
                  )}
                </div>
              </div>

              {/* Category 2: Designer Footwear */}
              <div className="bg-white rounded-2xl p-4 border border-[#C6A77D]/35 shadow-xs">
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-[#C6A77D]/20">
                  <Footprints className="w-4 h-4 text-[#6D3546]" />
                  <h4 className="font-serif text-sm font-bold text-[#292727]">
                    Suitable Footwear
                  </h4>
                </div>

                <div className="space-y-3">
                  {moodAccessories.footwear.length > 0 ? (
                    moodAccessories.footwear.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onOpenProductDetail(item)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F5EFE7] transition-colors cursor-pointer group"
                      >
                        <img
                          src={getImage(`product-${item.id}`, item.images[0])}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-contain p-1 bg-white border border-[#C6A77D]/30 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-[#292727] group-hover:text-[#6D3546] line-clamp-1">
                            {item.name}
                          </h5>
                          <p className="text-[11px] text-[#5e5460] line-clamp-1">{item.subCategory}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs font-mono font-bold text-[#6D3546]">
                              ₹{item.rentalPrice4Days} / 4 days
                            </span>
                            <span className="text-[10px] text-[#6D3546] font-semibold group-hover:underline">
                              View →
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#5e5460] py-4 text-center">No matching footwear</p>
                  )}
                </div>
              </div>

              {/* Category 3: Handbags & Clutches */}
              <div className="bg-white rounded-2xl p-4 border border-[#C6A77D]/35 shadow-xs">
                <div className="flex items-center gap-2 pb-3 mb-3 border-b border-[#C6A77D]/20">
                  <Briefcase className="w-4 h-4 text-[#6D3546]" />
                  <h4 className="font-serif text-sm font-bold text-[#292727]">
                    Coordinating Handbags & Clutches
                  </h4>
                </div>

                <div className="space-y-3">
                  {moodAccessories.bags.length > 0 ? (
                    moodAccessories.bags.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onOpenProductDetail(item)}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#F5EFE7] transition-colors cursor-pointer group"
                      >
                        <img
                          src={getImage(`product-${item.id}`, item.images[0])}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-contain p-1 bg-white border border-[#C6A77D]/30 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="text-xs font-bold text-[#292727] group-hover:text-[#6D3546] line-clamp-1">
                            {item.name}
                          </h5>
                          <p className="text-[11px] text-[#5e5460] line-clamp-1">{item.subCategory}</p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs font-mono font-bold text-[#6D3546]">
                              ₹{item.rentalPrice4Days} / 4 days
                            </span>
                            <span className="text-[10px] text-[#6D3546] font-semibold group-hover:underline">
                              View →
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-[#5e5460] py-4 text-center">No matching handbags</p>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

    </section>
  );
};
