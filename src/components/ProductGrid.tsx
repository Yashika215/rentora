import React, { useState, useMemo, useEffect } from 'react';
import { Product, PRODUCTS, OCCASIONS, AESTHETICS } from '../data/catalog';
import { ProductCard } from './ProductCard';
import { CartItem } from '../types';
import { Filter, SlidersHorizontal, Sparkles, ArrowUpDown, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProductGridProps {
  activeCategory?: 'all' | 'her' | 'him' | 'accessory';
  onCategoryChange?: (category: 'all' | 'her' | 'him' | 'accessory') => void;
  initialCategory?: 'all' | 'her' | 'him' | 'accessory';
  selectedOccasionFilter?: string | null;
  selectedAestheticFilter?: string[];
  searchQuery?: string;
  onAddToCart: (item: CartItem) => void;
  onOpenDetail: (product: Product) => void;
  onCompleteMyLook: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: (id: string) => boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  activeCategory: propActiveCategory,
  onCategoryChange,
  initialCategory = 'all',
  selectedOccasionFilter = null,
  selectedAestheticFilter = [],
  searchQuery = '',
  onAddToCart,
  onOpenDetail,
  onCompleteMyLook,
  onToggleWishlist,
  isWishlisted,
}) => {
  const { currentUser } = useAuth();
  
  const [internalCategory, setInternalCategory] = useState<'all' | 'her' | 'him' | 'accessory'>(
    propActiveCategory || initialCategory || 'all'
  );
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc'>('recommended');
  const [occasionFilter, setOccasionFilter] = useState<string>(selectedOccasionFilter || 'all');
  const [priceMax, setPriceMax] = useState<number>(3000);

  // Synchronize category with parent prop or initial category
  useEffect(() => {
    if (propActiveCategory !== undefined) {
      setInternalCategory(propActiveCategory);
    } else if (initialCategory !== undefined) {
      setInternalCategory(initialCategory);
    }
  }, [propActiveCategory, initialCategory]);

  useEffect(() => {
    setOccasionFilter(selectedOccasionFilter || 'all');
  }, [selectedOccasionFilter]);

  const activeCategory = propActiveCategory !== undefined ? propActiveCategory : internalCategory;

  const handleCategorySelect = (cat: 'all' | 'her' | 'him' | 'accessory') => {
    setInternalCategory(cat);
    if (onCategoryChange) {
      onCategoryChange(cat);
    }
  };

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((item) => {
      // Category filter (For Her, For Him, Accessories, or All)
      if (activeCategory !== 'all' && item.category !== activeCategory) {
        return false;
      }

      // Occasion filter
      if (occasionFilter !== 'all' && !item.occasions.includes(occasionFilter)) {
        return false;
      }

      // Aesthetic filter (if user selected in AestheticSection)
      if (selectedAestheticFilter && selectedAestheticFilter.length > 0) {
        const hasAestheticMatch = item.aesthetic.some((a) => selectedAestheticFilter.includes(a));
        if (!hasAestheticMatch) return false;
      }

      // Price filter
      if (item.rentalPrice4Days > priceMax) {
        return false;
      }

      // Search query
      if (searchQuery && searchQuery.trim() !== '') {
        const q = searchQuery.trim().toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesBrand = item.brand.toLowerCase().includes(q);
        const matchesSub = item.subCategory.toLowerCase().includes(q);
        const matchesAesthetic = item.aesthetic.some((a) => a.toLowerCase().includes(q));
        const matchesOccasion = item.occasions.some((o) => o.toLowerCase().includes(q));
        if (!matchesName && !matchesBrand && !matchesSub && !matchesAesthetic && !matchesOccasion) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') {
        const diff = a.rentalPrice4Days - b.rentalPrice4Days;
        return diff !== 0 ? diff : a.id.localeCompare(b.id);
      }
      if (sortBy === 'price-desc') {
        const diff = b.rentalPrice4Days - a.rentalPrice4Days;
        return diff !== 0 ? diff : a.id.localeCompare(b.id);
      }
      // Recommended sort with deterministic tie-breaker across JS engines and screen sizes
      const trendingDiff = (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0);
      if (trendingDiff !== 0) return trendingDiff;
      return a.id.localeCompare(b.id);
    });
  }, [activeCategory, occasionFilter, selectedAestheticFilter, priceMax, searchQuery, sortBy]);

  return (
    <section id="collections" className="py-16 bg-[#EEE4DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[#4D0E13] mb-2">
              <span>👗</span>
              <span>The RENTORA Closet</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-[#2D1517] tracking-tight">
              Curated Designer Rentals
            </h2>
            <p className="text-sm text-[#5e5460] mt-1">
              Explore authentic luxury lehengas, gowns, regal sherwanis, and matching accessories.
            </p>
          </div>

          {/* Quick Category Segmented Buttons */}
          <div className="flex items-center gap-1.5 p-1 bg-white rounded-full border border-[#C8A49F]/40 shadow-xs overflow-x-auto scrollbar-none max-w-full">
            {[
              { id: 'all', label: 'All Collections' },
              { id: 'her', label: 'For Her 🎀' },
              { id: 'him', label: 'For Him 👔' },
              { id: 'accessory', label: 'Accessories ✨' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleCategorySelect(tab.id as any)}
                className={`px-3.5 sm:px-4 py-2 text-xs font-semibold rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 ${
                  activeCategory === tab.id
                    ? 'bg-[#4D0E13] text-white shadow-xs'
                    : 'text-[#5e5460] hover:text-[#4D0E13] hover:bg-[#EEE4DA]/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filter & Sorting Bar */}
        <div className="bg-white rounded-2xl p-4 mb-8 border border-[#C8A49F]/30 shadow-xs flex flex-wrap items-center justify-between gap-4">
          
          {/* Left filters: Occasion, Price Slider */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Occasion dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#5e5460] font-medium">Occasion:</span>
              <select
                value={occasionFilter}
                onChange={(e) => setOccasionFilter(e.target.value)}
                className="text-xs bg-[#EEE4DA] border border-[#C8A49F]/40 rounded-lg px-2.5 py-1.5 text-[#2D1517] focus:outline-none"
              >
                <option value="all">All Occasions</option>
                {OCCASIONS.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Cap */}
            <div className="flex items-center gap-2 pl-2 border-l border-gray-200">
              <span className="text-xs text-[#5e5460] font-medium">Max 4-Day Rent:</span>
              <span className="text-xs font-bold font-mono text-[#4D0E13]">₹{priceMax}</span>
              <input
                type="range"
                min="500"
                max="3000"
                step="250"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-24 sm:w-32 accent-[#4D0E13] cursor-pointer"
              />
            </div>

          </div>

          {/* Right filters: Sort By & Reset */}
          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-1.5 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#5e5460]" />
              <span className="text-[#5e5460]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs bg-[#EEE4DA] border border-[#C8A49F]/40 rounded-lg px-2.5 py-1.5 text-[#2D1517] focus:outline-none font-medium cursor-pointer"
              >
                <option value="recommended">Featured / Trending</option>
                <option value="price-asc">Rental: Low to High</option>
                <option value="price-desc">Rental: High to Low</option>
              </select>
            </div>

            {(occasionFilter !== 'all' || activeCategory !== 'all' || priceMax < 3000 || searchQuery) && (
              <button
                onClick={() => {
                  setOccasionFilter('all');
                  handleCategorySelect('all');
                  setPriceMax(3000);
                }}
                className="text-xs text-[#4D0E13] underline font-semibold cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>

        </div>

        {/* Active search banner if search query is active */}
        {searchQuery && (
          <div className="mb-6 p-3 bg-white rounded-xl border border-[#C8A49F]/30 flex items-center justify-between text-xs">
            <span>
              Searching for: <strong className="text-[#4D0E13]">"{searchQuery}"</strong> ({filteredProducts.length} results found)
            </span>
          </div>
        )}

        {/* Product Cards Grid - Identical product list and order across mobile, tablet, desktop */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onOpenDetail={onOpenDetail}
                onCompleteMyLook={onCompleteMyLook}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={isWishlisted(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-[#C8A49F]/50 p-8">
            <span className="text-4xl mb-3 block">🎀</span>
            <h3 className="font-serif text-xl font-bold text-[#2D1517]">
              No matching products found in this category yet.
            </h3>
            <p className="text-sm text-[#5e5460] mt-1 max-w-md mx-auto">
              Try adjusting your price slider or occasion filter. You can also ask RÉNÉ to source an alternative piece!
            </p>
            <button
              onClick={() => {
                handleCategorySelect('all');
                setOccasionFilter('all');
                setPriceMax(3000);
              }}
              className="mt-4 px-5 py-2.5 rounded-full bg-[#4D0E13] text-white text-xs font-semibold hover:bg-[#3b172b] transition-all cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
