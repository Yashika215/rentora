import React, { useState } from 'react';
import { Product, PRODUCTS, FREE_GIFT_PROMOTION } from '../data/catalog';
import { CartItem } from '../types';
import { X, Heart, ShieldCheck, RefreshCw, Sparkles, ShoppingBag, Check, Gift, Calendar, Ruler, Truck, MapPin, Share2 } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useImageManager } from '../context/ImageManagerContext';
import { getProductColorHarmony } from '../utils/colorHarmony';
import { generateStyledForMomentNote } from '../utils/reniStylistEngine';
import { ShareLookModal } from './ShareLookModal';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (item: CartItem, silent?: boolean) => void;
  onCompleteMyLook: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onOpenProductDetail?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onCompleteMyLook,
  onToggleWishlist,
  isWishlisted,
  onOpenProductDetail,
}) => {
  const { getImage } = useImageManager();
  const { location, cityAvailability, setIsSelectorOpen } = useLocation();

  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedDays, setSelectedDays] = useState<number>(0);
  const [showSizeGuide, setShowSizeGuide] = useState<boolean>(false);
  const [isAdded, setIsAdded] = useState<boolean>(false);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  // Zoom Lens State
  const [isZooming, setIsZooming] = useState<boolean>(false);
  const [zoomPos, setZoomPos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [selectedColor, setSelectedColor] = useState<string>('');

  // Sync state whenever product changes
  React.useEffect(() => {
    if (product) {
      const harmony = getProductColorHarmony(product);
      setActiveImageIndex(0);
      setSelectedSize('');
      setSelectedColor(harmony.harmonyName);
      setSelectedDays(0);
      setShowSizeGuide(false);
      setIsAdded(false);
      setIsZooming(false);
      setZoomPos({ x: 50, y: 50 });
    }
  }, [product?.id]);

  if (!product) return null;

  const colorHarmony = getProductColorHarmony(product);

  // Track cursor position inside image bounding box for zoom lens
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomPos({ x, y });
  };

  // Calculate rental cost based on days
  const rentalCost = selectedDays === 3 
    ? Math.round(product.rentalPrice4Days * 0.85)
    : selectedDays === 7 
    ? Math.round(product.rentalPrice4Days * 1.5)
    : selectedDays === 4
    ? product.rentalPrice4Days
    : product.rentalPrice4Days; // Default to 4-day price for display even when not selected

  const handleAdd = () => {
    onAddToCart({
      id: `${product.id}-${Date.now()}`,
      product,
      selectedSize,
      selectedColor,
      rentalDurationDays: selectedDays,
      itemTotal: rentalCost,
    }, true); // silent: true to prevent notifications while clicking the product
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      onClose();
    }, 1200);
  };

  const momentData = generateStyledForMomentNote(product);
  const rawImage = product.images[activeImageIndex] || product.images[0] || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80';
  const activeImage = activeImageIndex === 0 
    ? getImage(`product-${product.id}`, rawImage) 
    : (product.images[activeImageIndex] || rawImage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-[#C8A49F]/40 max-h-[94vh] sm:max-h-[92vh] flex flex-col md:flex-row overflow-y-auto md:overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-2 rounded-full bg-white/95 text-[#2D1517] hover:bg-[#4D0E13] hover:text-white transition-colors cursor-pointer shadow-md"
          aria-label="Close product view"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Interactive Zoom Lens Product Gallery & Editorial Edit */}
        <div className="w-full md:w-1/2 relative bg-[#EEE4DA] p-4 sm:p-5 flex flex-col justify-between items-center shrink-0">
          
          {/* Upper Section — Fashion Header */}
          <div className="text-center w-full mb-2.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#4D0E13] bg-[#C8A49F]/25 px-2.5 py-0.5 rounded-full border border-[#C8A49F]/40 shadow-2xs">
              RENTORA EDIT
            </span>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2D1517] tracking-tight mt-1">
              “Your Next Iconic Look.”
            </h3>
            <p className="text-[11px] text-[#5e5460] mt-0.5 leading-tight">
              Discover the details that make every occasion unforgettable.
            </p>
          </div>

          {/* Main Image Container with Interactive Zoom Reticle Lens */}
          <div 
            className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-md border border-[#C8A49F]/20 bg-white cursor-crosshair group select-none flex items-center justify-center p-1"
            onMouseEnter={() => setIsZooming(true)}
            onMouseLeave={() => setIsZooming(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={activeImage}
              alt={product.name}
              className={`w-full h-full object-contain transition-transform duration-200 ${
                isZooming ? 'scale-250' : 'scale-100'
              }`}
              style={
                isZooming
                  ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                  : undefined
              }
              loading="eager"
              referrerPolicy="no-referrer"
            />

            {/* Floating Glass Magnifier Reticle Lens Overlay */}
            {isZooming && (
              <div
                className="absolute w-28 h-28 rounded-full border-2 border-white shadow-2xl pointer-events-none ring-2 ring-[#4D0E13]/60 bg-white/10 backdrop-contrast-125 backdrop-saturate-150 transition-opacity duration-150 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-20"
                style={{
                  left: `${zoomPos.x}%`,
                  top: `${zoomPos.y}%`,
                }}
              >
                <span className="text-[9px] font-bold text-white bg-[#4D0E13]/90 px-2 py-0.5 rounded-full backdrop-blur-xs shadow-xs font-mono">
                  2.5x Fabric Zoom
                </span>
              </div>
            )}

            {product.isTrending && (
              <span className="absolute top-3 left-3 bg-[#4D0E13] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full z-10 shadow-xs">
                🔥 Trending Look
              </span>
            )}

            {/* Interactive Zoom Hint Badge Bottom Right */}
            <div className="absolute bottom-3 right-3 z-10">
              <button
                type="button"
                onClick={() => setIsZooming(!isZooming)}
                className="inline-flex items-center gap-1.5 bg-black/70 hover:bg-[#4D0E13] text-white text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full backdrop-blur-md transition-colors cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3 h-3 text-[#C8A49F]" />
                <span>{isZooming ? 'Fabric Zoom Active ✨' : 'Fabric Zoom Available ✨'}</span>
              </button>
            </div>
          </div>

          {/* Gallery Thumbnails if multiple images exist */}
          {product.images.length > 1 && (
            <div className="flex items-center justify-center gap-2 mt-2.5 overflow-x-auto pb-0.5 max-w-full">
              {product.images.map((imgUrl, idx) => {
                const thumbSrc = idx === 0 
                  ? getImage(`product-${product.id}`, imgUrl) 
                  : (getImage(`product-${product.id}-gallery-${idx}`, imgUrl) || imgUrl);
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-11 h-11 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                      activeImageIndex === idx
                        ? 'border-[#4D0E13] scale-105 shadow-xs'
                        : 'border-white/60 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={thumbSrc} alt={`${product.name} view ${idx + 1}`} className="w-full h-full object-contain p-0.5 bg-[#FAF5F0]" />
                  </button>
                );
              })}
            </div>
          )}



          {/* Decorative Element — Champagne Gold Line & Brand Tag */}
          <div className="w-full mt-2.5 pt-2 border-t border-[#C8A49F]/40 flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest text-[#4D0E13]">
            <span>RENT</span>
            <span className="text-[#C8A49F]">•</span>
            <span>WEAR</span>
            <span className="text-[#C8A49F]">•</span>
            <span>REPEAT</span>
          </div>

        </div>

        {/* Right Side: Product Details & Purchase Module */}
        <div className="w-full md:w-1/2 p-4 sm:p-6 md:p-8 md:overflow-y-auto md:max-h-[92vh] flex flex-col justify-between">
          
          <div>
            {/* Header info */}
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-bold text-[#4D0E13]">
                {product.brand}
              </span>
              <button
                onClick={() => onToggleWishlist(product)}
                className="p-1.5 rounded-full hover:bg-[#EEE4DA] text-[#4D0E13] transition-colors"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-[#4D0E13]' : ''}`} />
              </button>
            </div>

            <h2 className="font-serif text-2xl font-bold text-[#2D1517] leading-tight mb-2">
              {product.name}
            </h2>



            {/* Price & Deposit Strip */}
            <div className="p-3.5 bg-[#EEE4DA] rounded-2xl border border-[#C8A49F]/30 mb-5 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-[#5e5460] uppercase tracking-wider block">
                  Rental Charge ({selectedDays} Days)
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-serif text-2xl font-bold text-[#4D0E13] font-mono tabular-nums">
                    {selectedDays === 0 && <span className="text-xs font-sans font-medium mr-1">Rent from</span>}
                    ₹{rentalCost.toLocaleString()}
                  </span>
                  <span className="text-xs text-[#5e5460] line-through">
                    Retail ₹{product.retailPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-[#5e5460] uppercase tracking-wider block">
                  Refundable Security
                </span>
                <span className="text-xs font-mono font-bold text-[#2D1517] tabular-nums">
                  ₹{product.deposit}
                </span>
                <span className="text-[9px] text-[#5e5460] block">(100% returned)</span>
              </div>
            </div>

            {/* Local Hub Delivery & Availability Status */}
            <div className="mb-4 p-3 rounded-2xl bg-[#EEE4DA]/70 border border-[#C8A49F]/40 flex items-center justify-between gap-2 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-bold text-[#4D0E13]">
                      Deliver to {location?.city || 'Gujarat'}:
                    </span>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
                      {cityAvailability?.deliverySpeed ? cityAvailability.deliverySpeed.split('(')[0] : 'Express 24h'}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#5e5460] mt-0.5">
                    Est. Arrival: <strong className="text-[#2D1517]">{cityAvailability?.estimatedDeliveryDate || 'Tomorrow'}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsSelectorOpen(true)}
                className="text-[10px] font-bold text-[#4D0E13] underline hover:text-[#2D1517] shrink-0 cursor-pointer"
              >
                Change
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-[#5e5460] leading-relaxed mb-5">
              {product.description}
            </p>

            {/* Rental Duration Selector */}
            <div className="mb-4">
              <label className="text-xs font-bold uppercase tracking-wider text-[#4D0E13] block mb-2 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C8A49F]" />
                <span>Select Rental Duration</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { days: 3, label: '3 Days', desc: 'Weekend Party' },
                  { days: 4, label: '4 Days', desc: 'Most Popular ✨' },
                  { days: 7, label: '7 Days', desc: 'Wedding / Trip' },
                ].map((plan) => (
                  <button
                    key={plan.days}
                    onClick={() => setSelectedDays(plan.days)}
                    className={`py-2 px-2 rounded-xl text-center border transition-all cursor-pointer ${
                      selectedDays === plan.days
                        ? 'bg-[#4D0E13] text-white border-[#4D0E13] shadow-xs'
                        : 'bg-[#EEE4DA] text-[#2D1517] border-[#C8A49F]/30 hover:border-[#4D0E13]'
                    }`}
                  >
                    <span className="block text-xs font-bold">{plan.label}</span>
                    <span className={`text-[9px] block ${selectedDays === plan.days ? 'text-[#C8A49F]' : 'text-[#5e5460]'}`}>
                      {plan.desc}
                    </span>
                  </button>
                ))}
              </div>
              {selectedDays === 0 && (
                <p className="text-[9px] text-[#4D0E13] mt-1 font-semibold">Choose rental duration to see pricing.</p>
              )}
            </div>

            {/* Size Selector */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#4D0E13]">
                  Select Size
                </label>
                <button
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="text-[11px] text-[#4D0E13] underline flex items-center gap-1 hover:text-[#3b172b]"
                >
                  <Ruler className="w-3 h-3 text-[#C8A49F]" />
                  <span>Size Guide</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'bg-[#4D0E13] text-white border-[#4D0E13] shadow-xs'
                        : 'bg-white text-[#5e5460] border-gray-200 hover:border-[#C8A49F]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {selectedSize === '' && (
                <p className="text-[9px] text-[#4D0E13] mt-1 font-semibold">Choose your size to continue.</p>
              )}

              {showSizeGuide && (
                <div className="mt-2 p-3 bg-[#EEE4DA] rounded-xl border border-[#C8A49F]/30 text-[11px] text-[#5e5460]">
                  <p className="font-semibold text-[#4D0E13] mb-1">Standard Fit Metrics:</p>
                  <p>XS (Bust 32", Waist 26") · S (Bust 34", Waist 28") · M (Bust 36", Waist 30") · L (Bust 38", Waist 32") · XL (Bust 40", Waist 34")</p>
                  <p className="mt-1 text-[10px] italic">Our outfits include internal margin seam allowances for minor adjustability.</p>
                </div>
              )}
            </div>

            {/* Color Swatches */}
            {colorHarmony && (
              <div className="mb-6 p-3.5 bg-[#EEE4DA]/50 rounded-2xl border border-[#C8A49F]/30">
                <div className="flex items-center justify-between mb-2.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#4D0E13] flex items-center gap-1.5">
                    <span>Color Harmony:</span>
                    <span className="font-semibold text-[#2D1517] normal-case tracking-normal">{colorHarmony.harmonyName}</span>
                  </label>
                  {colorHarmony.isMulticolor && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500 via-amber-400 to-indigo-500 text-white shadow-xs">
                      Multicolor
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2.5 flex-wrap">
                  {colorHarmony.isMulticolor && colorHarmony.multicolorGradient && (
                    <div 
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white border border-[#C8A49F]/40 shadow-xs"
                      title="Multicolor Festive Palette"
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-black/10 shadow-inner shrink-0"
                        style={{ background: colorHarmony.multicolorGradient }}
                      />
                      <span className="text-[11px] font-semibold text-[#4D0E13]">
                        Spectrum
                      </span>
                    </div>
                  )}

                  {colorHarmony.swatches.map((swatch) => (
                    <div
                      key={swatch.name}
                      className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-white border border-[#C8A49F]/30 shadow-xs"
                      title={`${swatch.name} — ${swatch.role} shade`}
                    >
                      <span
                        className="w-5 h-5 rounded-full border border-black/15 shadow-inner shrink-0"
                        style={{ backgroundColor: swatch.hex }}
                      />
                      <div className="flex flex-col">
                        <span className="text-[11px] font-semibold text-[#2D1517] leading-tight">
                          {swatch.name}
                        </span>
                        <span className="text-[9px] uppercase tracking-wider font-bold text-[#C8A49F]">
                          {swatch.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Care and Trust info */}
            <div className="space-y-1.5 text-[11px] text-[#5e5460] pt-3 border-t border-[#C8A49F]/25">
              <div className="flex items-center gap-2 text-[#4D0E13] font-medium">
                <Sparkles className="w-3.5 h-3.5 text-[#C8A49F] shrink-0" />
                <span>Fabric Zoom Available for Every Outfit — For Her & For Him ✨</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Dry-cleaned and UV-sanitized before delivery.</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-[#4D0E13] shrink-0" />
                <span>Zero laundry required — simply return in prepaid bag.</span>
              </div>
            </div>

          </div>

          {/* Action Row */}
          <div className="mt-6 pt-4 border-t border-[#C8A49F]/30 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={handleAdd}
              disabled={selectedSize === '' || selectedDays === 0}
              className={`w-full sm:flex-1 py-3 px-5 rounded-full text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isAdded
                  ? 'bg-emerald-700 text-white'
                  : selectedSize === '' || selectedDays === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed border border-gray-300'
                  : 'bg-[#4D0E13] text-white hover:bg-[#3b172b] shadow-md'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Bag!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 text-[#C8A49F]" />
                  <span>{selectedSize === '' || selectedDays === 0 ? 'Complete selection above' : `Rent This Piece (₹${rentalCost})`}</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                onClose();
                onCompleteMyLook(product);
              }}
              className="w-full sm:w-auto py-3 px-5 rounded-full text-xs font-semibold border border-[#4D0E13] text-[#4D0E13] hover:bg-[#EEE4DA] flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#C8A49F]" />
              <span>Complete My Look 🎀</span>
            </button>

            <button
              type="button"
              onClick={() => setIsShareOpen(true)}
              className="w-full sm:w-auto py-3 px-4 rounded-full text-xs font-semibold border border-[#C8A49F] text-[#4D0E13] hover:bg-[#EEE4DA] flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              title="Share My Look on social media"
            >
              <Share2 className="w-3.5 h-3.5 text-[#C8A49F]" />
              <span>Share Look</span>
            </button>
          </div>

        </div>

      </div>

      <ShareLookModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        data={{
          title: product.name,
          occasion: product.occasions && product.occasions[0] 
            ? product.occasions[0].replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) 
            : 'Celebrations & Gala',
          product,
          size: selectedSize,
          rentalDuration: `${selectedDays} Days Rental`,
          totalPrice: rentalCost,
        }}
      />
    </div>
  );
};
