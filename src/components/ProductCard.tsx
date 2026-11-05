import React, { useState } from 'react';
import { Product } from '../data/catalog';
import { Heart, Sparkles, ShoppingBag, Eye, Wand2, Check, Truck } from 'lucide-react';
import { CartItem } from '../types';
import { useLocation } from '../context/LocationContext';
import { useImageManager } from '../context/ImageManagerContext';
import { getProductColorHarmony } from '../utils/colorHarmony';

interface ProductCardProps {
  product: Product;
  onAddToCart: (item: CartItem, silent?: boolean) => void;
  onOpenDetail: (product: Product) => void;
  onCompleteMyLook: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOpenDetail,
  onCompleteMyLook,
  onToggleWishlist,
  isWishlisted,
}) => {
  const { location, cityAvailability } = useLocation();
  const { getImage } = useImageManager();
  const displayImg = getImage(`product-${product.id}`, product.images[0] || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80');
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const colorHarmony = getProductColorHarmony(product);
  const [selectedColor, setSelectedColor] = useState<string>(colorHarmony.harmonyName);
  const [isAdded, setIsAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart({
      id: `${product.id}-${Date.now()}`,
      product,
      selectedSize,
      selectedColor: colorHarmony.harmonyName,
      rentalDurationDays: 4,
      itemTotal: product.rentalPrice4Days,
    }, true); // silent: true to prevent notifications while clicking the product
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div
      onClick={() => onOpenDetail(product)}
      className="group relative bg-white rounded-2xl overflow-hidden border border-[#C8A49F]/30 shadow-xs hover:shadow-xl hover:border-[#4D0E13]/40 transition-all duration-300 flex flex-col justify-between cursor-pointer"
    >
      
      {/* Top Image Container - Portrait ratio to display full outfit */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FAF5F0] flex items-center justify-center p-2">
        <img
          src={displayImg}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-500"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Fallback overlay scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Wishlist Heart Top Right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          aria-label="Save to Wishlist"
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-[#4D0E13] hover:bg-white hover:scale-110 shadow-sm transition-all z-10 cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-[#4D0E13] text-[#4D0E13]' : 'text-[#5e5460]'
            }`}
          />
        </button>

        {/* Category or Status Tag Top Left (Luxury RENTORA Badging) */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          {product.isTrending || product.rating >= 4.8 ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white bg-[#4D0E13]/90 border border-[#C8A49F]/40 backdrop-blur-md px-2.5 py-1 rounded-full shadow-md">
              <span>🔥</span>
              <span>Trending</span>
            </span>
          ) : product.isNewArrival ? (
            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-[#4D0E13] bg-[#C8A49F]/95 border border-white/60 backdrop-blur-md px-2.5 py-1 rounded-full shadow-md font-semibold">
              <span>✨</span>
              <span>New Arrival</span>
            </span>
          ) : null}

          <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2D1517] bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-2xs border border-[#C8A49F]/30">
            {product.category === 'her' ? 'For Her' : product.category === 'him' ? 'For Him' : 'Accessory'}
          </span>
        </div>

        {/* Quick View Button Hover Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetail(product);
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/95 text-[#4D0E13] text-xs font-semibold shadow-md hover:bg-white transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCompleteMyLook(product);
            }}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#4D0E13]/95 text-white text-xs font-semibold shadow-md hover:bg-[#4D0E13] transition-colors cursor-pointer"
          >
            <Wand2 className="w-3.5 h-3.5 text-[#C8A49F]" />
            <span>Style Look</span>
          </button>
        </div>

      </div>

      {/* Card Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        
        <div>
          {/* Aesthetic metadata line (unboxed typography per guidelines) */}
          <div className="text-[11px] text-[#5e5460] flex items-center gap-1.5 mb-1">
            <span className="font-semibold text-[#4D0E13]">{product.brand}</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">{product.aesthetic[0] || 'Luxury'}</span>
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-base font-bold text-[#2D1517] group-hover:text-[#4D0E13] transition-colors line-clamp-1 mb-1.5">
            {product.name}
          </h3>

          {/* Verified Rental Badge (Rating star removed) */}
          <div className="flex items-center gap-1.5 mb-2 text-xs">
            <span className="text-[11px] font-semibold text-[#4D0E13]">
              Verified Designer Rental
            </span>
            <span className="text-[#C8A49F]" aria-hidden="true">•</span>
            <span className="text-[11px] text-[#5e5460]">
              Sanitized & Ready to Wear
            </span>
          </div>

          {/* Color Harmony Indicators */}
          <div className="flex items-center gap-2 mb-3 px-2 py-1 rounded-lg bg-[#EEE4DA]/50 border border-[#C8A49F]/20">
            <div className="flex items-center -space-x-1 shrink-0">
              {colorHarmony.isMulticolor && colorHarmony.multicolorGradient ? (
                <span
                  className="w-3.5 h-3.5 rounded-full border border-white shadow-xs inline-block"
                  style={{ background: colorHarmony.multicolorGradient }}
                  title="Multicolor Spectrum"
                />
              ) : null}
              {colorHarmony.swatches.map((s, idx) => (
                <span
                  key={`${s.name}-${s.role}-${idx}`}
                  className="w-3.5 h-3.5 rounded-full border border-white shadow-xs inline-block"
                  style={{ backgroundColor: s.hex }}
                  title={`${s.name} (${s.role})`}
                />
              ))}
            </div>
            <span className="text-[10px] font-medium text-[#4D0E13] truncate" title={colorHarmony.harmonyName}>
              {colorHarmony.harmonyName}
            </span>
          </div>

          {/* Pricing Row */}
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif text-lg font-bold text-[#4D0E13] font-mono tabular-nums">
                  ₹{product.rentalPrice4Days.toLocaleString()}
                </span>
                <span className="text-xs text-[#5e5460]">/ 4 days</span>
              </div>
              <p className="text-[10px] text-[#5e5460] line-through">
                Retail ₹{product.retailPrice.toLocaleString()}
              </p>
            </div>

            {/* Refundable deposit badge */}
            <div className="text-right">
              <span className="text-[10px] text-[#5e5460] block">Refundable Dep.</span>
              <span className="text-xs font-mono font-medium text-[#2D1517] tabular-nums">
                ₹{product.deposit}
              </span>
            </div>
          </div>

          {/* Local City Delivery Speed Indicator */}
          <div className="mb-2.5 px-2 py-1 rounded-lg bg-[#EEE4DA]/60 border border-[#C8A49F]/30 flex items-center justify-between text-[10px]">
            <span className="flex items-center gap-1 text-[#4D0E13] font-semibold truncate">
              <Truck className="w-3 h-3 text-emerald-700 shrink-0" />
              <span>{location.city}: {cityAvailability.deliverySpeed.split('(')[0]}</span>
            </span>
            <span className="text-emerald-800 font-bold shrink-0">In Stock</span>
          </div>

          {/* Sizes quick bar */}
          {product.sizes.length > 1 && (
            <div className="flex items-center gap-1 mb-3 overflow-x-auto pb-1 scrollbar-none" onClick={(e) => e.stopPropagation()}>
              <span className="text-[10px] text-[#5e5460] mr-1">Size:</span>
              {product.sizes.slice(0, 4).map((size) => (
                <button
                  key={size}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(size);
                  }}
                  className={`px-2 py-0.5 text-[10px] rounded-md font-medium border transition-colors cursor-pointer ${
                    selectedSize === size
                      ? 'bg-[#4D0E13] text-white border-[#4D0E13]'
                      : 'bg-white text-[#5e5460] border-gray-200 hover:border-[#C8A49F]'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          )}

        </div>

        {/* Action Button Row */}
        <div className="pt-3 border-t border-[#C8A49F]/20 flex items-center gap-2">
          
          <button
            onClick={handleQuickAdd}
            className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
              isAdded
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-[#4D0E13] text-white hover:bg-[#3b172b] shadow-xs hover:shadow-md'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-[#C8A49F]" />
                <span>Rent Outfit</span>
              </>
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onCompleteMyLook(product);
            }}
            title="Complete My Look with Accessories"
            className="p-2.5 rounded-xl border border-[#C8A49F]/50 text-[#4D0E13] bg-[#EEE4DA] hover:bg-[#C8A49F]/20 transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
          </button>

        </div>

      </div>

    </div>
  );
};
