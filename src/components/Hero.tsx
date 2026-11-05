import React, { useState, useEffect, useMemo } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Sparkle, RefreshCw, Gift, ChevronLeft, ChevronRight, Search, X, Eye } from 'lucide-react';
import { useImageManager } from '../context/ImageManagerContext';
import { PRODUCTS, Product } from '../data/catalog';
import { ScrollReveal } from './ScrollReveal';

interface HeroProps {
  onExploreCollections: () => void;
  onSelectCategory?: (category: 'her' | 'him' | 'accessory') => void;
  onMeetReni: () => void;
  onOpenGiftPromo: () => void;
  onTakeQuiz?: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  onOpenProductDetail?: (product: Product) => void;
}

const ROTATING_PHRASES = [
  'Rent. Wear. Repeat.',
  'Elegance Redefined.',
  'Style on Demand.',
];

const HERO_SLIDES = [
  {
    image: '/src/assets/images/hero_fashion_editorial_lehenga_1793298948653.jpg',
    collection: 'Navratri & Garba Couture',
    title: 'Gulabi Zardozi Heritage Lehenga',
    price: 'Rent from ₹1,899 / 4 days',
    tag: 'Coquette & Desi Glam',
    category: 'her',
  },
  {
    image: '/assets/aistudio/Blue_velvet_indowestern_with_gold_zardosi_embroidery_254366cd.jpg',
    collection: 'Royal Heritage Groom & Festive',
    title: 'The Nizam Imperial Velvet Sherwani',
    price: 'Rent from ₹1,799 / 4 days',
    tag: 'Desi Glam & Traditional',
    category: 'him',
  },
  {
    image: '/src/assets/images/hero_fashion_editorial_1792952792888.jpg',
    collection: 'The Velvet & Silk Collection',
    title: 'Aria Pleated Plum Satin Evening Gown',
    price: 'Rent from ₹1,499 / 4 days',
    tag: 'Old Money & Quiet Luxury',
    category: 'her',
  },
  {
    image: '/src/assets/images/coquette_accessories_gift_1792952794547.jpg',
    collection: 'Complimentary Keepsake Jewels',
    title: 'Baroque Pearl & Gold Choker Set',
    price: 'FREE Gift on Orders ₹3,000+',
    tag: 'Coquette Accessories',
    category: 'accessory',
  },
];

export const Hero: React.FC<HeroProps> = ({
  onExploreCollections,
  onSelectCategory,
  onMeetReni,
  onOpenGiftPromo,
  onTakeQuiz,
  searchQuery = '',
  setSearchQuery,
  onOpenProductDetail,
}) => {
  const { getImage } = useImageManager();
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  // Search state
  const [localSearch, setLocalSearch] = useState(searchQuery || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (searchQuery !== undefined) {
      setLocalSearch(searchQuery);
    }
  }, [searchQuery]);

  // Case-insensitive search across catalog (names, outfit types, categories, colors, gender, occasions, aesthetic tags)
  const searchResults = useMemo(() => {
    const q = localSearch.trim().toLowerCase();
    if (!q) return [];

    return PRODUCTS.filter((item) => {
      const nameMatch = item.name.toLowerCase().includes(q);
      const subCatMatch = item.subCategory.toLowerCase().includes(q);
      const catMatch = item.category.toLowerCase().includes(q);
      const brandMatch = item.brand.toLowerCase().includes(q);
      const colorMatch = item.colors.some(c => c.name.toLowerCase().includes(q));
      const genderMatch = (item.category === 'her' && (q.includes('women') || q.includes('her') || q.includes('female') || q.includes('girls'))) ||
                          (item.category === 'him' && (q.includes('men') || q.includes('him') || q.includes('male') || q.includes('groom') || q.includes('boys')));
      const occasionMatch = item.occasions.some(occ => occ.toLowerCase().includes(q));
      const aestheticMatch = item.aesthetic.some(aes => aes.toLowerCase().includes(q));
      const descMatch = item.description.toLowerCase().includes(q);

      return nameMatch || subCatMatch || catMatch || brandMatch || colorMatch || genderMatch || occasionMatch || aestheticMatch || descMatch;
    });
  }, [localSearch]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (setSearchQuery) {
      setSearchQuery(localSearch);
    }
    setIsDropdownOpen(true);
    const elem = document.getElementById('collections');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const handleClearSearch = () => {
    setLocalSearch('');
    if (setSearchQuery) setSearchQuery('');
    setIsDropdownOpen(false);
  };

  // Typewriter effect
  useEffect(() => {
    const targetPhrase = ROTATING_PHRASES[phraseIndex];
    let timeout: ReturnType<typeof setTimeout>;

    if (!isDeleting && currentText === targetPhrase) {
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && currentText === '') {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % ROTATING_PHRASES.length);
    } else {
      const nextLength = isDeleting ? currentText.length - 1 : currentText.length + 1;
      const speed = isDeleting ? 40 : 85;
      timeout = setTimeout(() => {
        setCurrentText(targetPhrase.substring(0, nextLength));
      }, speed);
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, phraseIndex]);

  // Automatic slide rotation
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4500);

    return () => clearInterval(slideInterval);
  }, []);

  const currentSlide = HERO_SLIDES[activeSlide];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#EEE4DA] via-[#fbf0e8] to-[#EEE4DA] pt-6 pb-14 border-b border-[#C8A49F]/20">
      
      {/* Subtle Editorial Background Image Layer */}
      <div
        className="absolute -top-16 inset-x-0 h-[130%] pointer-events-none -z-10 overflow-hidden select-none"
        aria-hidden="true"
      >
        <img
          src={getImage('banner-hero-bg', '/src/assets/images/hero_fashion_editorial_1792952792888.jpg')}
          alt=""
          className="w-full h-full object-cover object-center opacity-[0.05] filter blur-[0.6px] scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#EEE4DA]/90 via-[#fbf0e8]/40 to-[#EEE4DA]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,164,159,0.25),transparent_70%)]" />
      </div>

      {/* Decorative ambient subtle background glows */}
      <div className="pointer-events-none -z-10">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#C8A49F]/15 rounded-full blur-3xl" />
        <div className="absolute top-20 right-10 w-80 h-80 bg-[#C7B7D4]/20 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 animate-fadeIn">
        
        {/* Main 2-Column Split Hero */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            
            {/* Aesthetic Top Tag */}
            <div className="inline-flex items-center gap-2 mb-4 text-xs font-semibold tracking-wider uppercase text-[#4D0E13]">
              <span className="text-[#C8A49F]">✨</span>
              <span>Luxury Fashion Rental</span>
              <span className="text-[#C8A49F]">·</span>
              <span className="text-[#5e5460] font-normal">From ₹299/day</span>
            </div>

            {/* Dynamic Typewriter Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#2D1517] leading-[1.15] tracking-tight mb-4 min-h-[2.3em] sm:min-h-[2.2em]">
              <span className="block sm:inline">Your Perfect Look.</span>{' '}
              <span className="italic font-normal text-[#4D0E13] block sm:inline">
                {currentText}
                <span className="inline-block w-[3px] h-[0.82em] bg-[#4D0E13] ml-1.5 align-middle animate-pulse" />
              </span>
            </h1>

            {/* Supporting prompt copy */}
            <p className="text-base sm:text-lg text-[#5e5460] max-w-xl leading-relaxed mb-6">
              Discover your vibe, rent your dream outfit, and make every moment unforgettable. From regal Garba lehengas to sleek evening gowns and tailored suits — curated for you.
            </p>

            {/* Hero Search & Action Buttons Container - Perfectly Aligned */}
            <ScrollReveal delay={150} className="w-full max-w-lg mb-6">
              {/* Hero Search Bar with Instant Dropdown Results */}
              <div className="relative mb-3.5 w-full">
                <form onSubmit={handleSearchSubmit} className="flex items-center bg-white rounded-full border border-[#C8A49F]/70 shadow-md p-1.5 focus-within:ring-2 focus-within:ring-[#4D0E13] transition-all">
                  <div className="pl-3.5 pr-2 text-[#4D0E13]">
                    <Search className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={localSearch}
                    onChange={(e) => {
                      setLocalSearch(e.target.value);
                      if (setSearchQuery) setSearchQuery(e.target.value);
                      setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="Search lehengas, sherwanis, gowns, sarees, colors, occasions..."
                    className="w-full text-xs sm:text-sm bg-transparent text-[#2D1517] placeholder-[#5e5460]/70 focus:outline-none py-2"
                  />
                  {localSearch && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="p-1.5 text-gray-400 hover:text-gray-600 rounded-full mr-1 cursor-pointer"
                      title="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-full bg-[#4D0E13] text-white text-xs font-bold hover:bg-[#38090D] shadow-xs transition-all cursor-pointer shrink-0"
                  >
                    Search
                  </button>
                </form>

                {/* Instant Search Results Dropdown with improved scroller */}
                {isDropdownOpen && localSearch.trim() !== '' && (
                  <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-[#C8A49F]/50 p-4 z-50 max-h-[500px] overflow-y-auto animate-fadeIn overscroll-contain scrollbar-thin scrollbar-thumb-[#C8A49F] scrollbar-track-[#EEE4DA]">
                    <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#EEE4DA]">
                      <span className="text-xs font-bold text-[#4D0E13]">
                        Search Results for "{localSearch}" ({searchResults.length})
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsDropdownOpen(false)}
                        className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        Close ✕
                      </button>
                    </div>

                    {searchResults.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {searchResults.map((prod) => {
                          const img = getImage(`product-${prod.id}`, prod.images[0]);
                          return (
                            <div
                              key={prod.id}
                              onClick={() => {
                                if (onOpenProductDetail) {
                                  onOpenProductDetail(prod);
                                }
                                setIsDropdownOpen(false);
                              }}
                              className="p-2.5 rounded-xl bg-[#FAF5F0] border border-[#C8A49F]/30 hover:border-[#4D0E13] transition-all cursor-pointer flex items-center gap-3 group shadow-2xs"
                            >
                              <div className="w-12 h-14 rounded-lg overflow-hidden bg-white shrink-0 border border-gray-200">
                                <img src={img} alt={prod.name} className="w-full h-full object-contain p-0.5 group-hover:scale-105 transition-transform" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <span className="text-[9px] uppercase font-bold text-[#4D0E13]">{prod.subCategory}</span>
                                <h4 className="font-serif text-xs font-bold text-[#2D1517] truncate">{prod.name}</h4>
                                <p className="text-[10px] font-mono font-bold text-[#4D0E13] mt-0.5">₹{prod.rentalPrice4Days} / 4 days</p>
                              </div>
                              <Eye className="w-3.5 h-3.5 text-[#4D0E13] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-8 text-center px-4">
                        <p className="text-sm font-serif font-bold text-[#2D1517]">No matching outfits found. Try another search.</p>
                        <p className="text-xs text-[#5e5460] mt-1">Search for lehengas, sherwanis, velvet, black, wedding, or ghagras.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons strictly following prompt - exactly aligned with the search bar */}
              <div className="flex flex-col sm:flex-row items-stretch gap-3.5 w-full">
                <button
                  onClick={onExploreCollections}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-[#4D0E13] text-white font-medium text-sm hover:bg-[#3b172b] hover:shadow-lg transition-all duration-200 cursor-pointer group shadow-md text-center"
                >
                  <span>Explore Collections</span>
                  <ArrowRight className="w-4 h-4 text-[#C8A49F] transition-transform group-hover:translate-x-1 shrink-0" />
                </button>

                <button
                  onClick={onTakeQuiz || onMeetReni}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-full bg-white text-[#4D0E13] font-medium text-sm border border-[#C8A49F]/60 hover:bg-[#EEE4DA] hover:border-[#4D0E13] hover:shadow-md transition-all duration-200 cursor-pointer shadow-xs text-center"
                >
                  <Sparkles className="w-4 h-4 text-[#C8A49F] shrink-0" />
                  <span>Style Persona Quiz ✨</span>
                </button>
              </div>
            </ScrollReveal>

          </div>

          {/* Right Column: Editorial Hero Campaign Media Carousel */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Image Frame with elegant border */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-[#C8A49F]/40 bg-[#4D0E13] aspect-[4/3] sm:aspect-[16/11]">
                <div className="w-full h-full relative">
                  {HERO_SLIDES.map((slide, idx) => {
                    const slideImageId = idx === 0 ? 'banner-hero' : `hero-slide-${idx}`;
                    const displayImage = getImage(slideImageId, slide.image);
                    return (
                      <img
                        key={idx}
                        src={displayImage}
                        alt={slide.title}
                        className={`absolute inset-0 w-full h-full object-cover object-top transition-opacity duration-700 ease-in-out ${
                          idx === activeSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                        loading={idx === 0 ? 'eager' : 'lazy'}
                      />
                    );
                  })}
                </div>
                
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#2D1517]/85 via-black/10 to-transparent pointer-events-none z-20" />

                {/* Left / Right Slide Controls */}
                <button
                  onClick={() => setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-xs transition-all cursor-pointer z-30"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/60 text-white backdrop-blur-xs transition-all cursor-pointer z-30"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Editorial floating info badge bottom left */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white z-30">
                  <div className="max-w-[70%]">
                    <span className="text-[10px] tracking-widest uppercase font-bold text-[#C8A49F] block truncate">
                      {currentSlide.collection}
                    </span>
                    <h3 className="text-xs sm:text-sm font-serif font-bold text-white line-clamp-1">
                      {currentSlide.title}
                    </h3>
                    <p className="text-[11px] text-[#EEE4DA] font-medium">{currentSlide.price}</p>
                  </div>
                  <button
                    onClick={onExploreCollections}
                    className="text-xs bg-white text-[#4D0E13] px-3 py-1.5 rounded-full font-bold hover:bg-[#EEE4DA] transition-colors cursor-pointer shadow-xs shrink-0"
                  >
                    View
                  </button>
                </div>

                {/* Dots indicator inside banner */}
                <div className="absolute top-3 left-3 z-30 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full">
                  {HERO_SLIDES.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveSlide(idx)}
                      className={`h-1.5 rounded-full transition-all cursor-pointer ${
                        idx === activeSlide ? 'w-5 bg-[#C8A49F]' : 'w-1.5 bg-white/50'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Floating aesthetic accent tag */}
              <div
                onClick={onOpenGiftPromo}
                className="absolute -bottom-4 left-2 sm:-left-4 lg:-left-6 max-w-[85%] sm:max-w-xs bg-white/95 backdrop-blur-md border border-[#C8A49F]/60 rounded-xl p-2.5 sm:p-3 shadow-lg flex items-center gap-2.5 sm:gap-3 cursor-pointer hover:scale-105 transition-transform z-30"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#4D0E13] text-[#C8A49F] flex items-center justify-center shrink-0">
                  <Gift className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-[#4D0E13] truncate">
                    <span>FREE Gift on ₹3,000+</span>
                    <span>🎀</span>
                  </div>
                  <p className="text-[10px] text-[#5e5460] truncate sm:whitespace-normal">Luxury jewelry keepsake added at ₹0</p>
                </div>
              </div>

              {/* Floating RÉNÉ Style badge top right */}
              <div
                onClick={onMeetReni}
                className="absolute -top-3 right-2 sm:-right-3 lg:-right-5 max-w-[85%] sm:max-w-none bg-white/95 backdrop-blur-md border border-[#C8A49F]/60 rounded-full px-3 py-1.5 shadow-md flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform z-30"
              >
                <div className="w-5 h-5 rounded-full bg-[#C8A49F] flex items-center justify-center text-[10px] shrink-0">
                  ✨
                </div>
                <span className="text-xs font-semibold text-[#4D0E13] truncate">Ask RÉNÉ to style you</span>
              </div>

            </div>
          </div>

        </div>

        {/* Full-width 4-Column Trust & Value Strip below hero */}
        <div className="mt-14 pt-8 border-t border-[#C8A49F]/30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#C8A49F]/20 text-[#4D0E13] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#2D1517]">UV-Sanitized & Clean</h4>
              <p className="text-[11px] text-[#5e5460]">Eco dry-cleaning included with every piece</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#C8A49F]/20 text-[#4D0E13] shrink-0">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#2D1517]">Easy Doorstep Returns</h4>
              <p className="text-[11px] text-[#5e5460]">Free home pickup after your event</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#C8A49F]/20 text-[#4D0E13] shrink-0">
              <Sparkle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#2D1517]">Flexible 2, 4 & 7 Days</h4>
              <p className="text-[11px] text-[#5e5460]">Rentals starting from ₹299 per day</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-[#C8A49F]/20 text-[#4D0E13] shrink-0">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#2D1517]">Free Keepsake Jewelry</h4>
              <p className="text-[11px] text-[#5e5460]">Yours to keep on orders above ₹3,000</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
