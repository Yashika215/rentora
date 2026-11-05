import React, { useState } from 'react';
import { Product, PRODUCTS } from '../data/catalog';
import { Sparkles, ShoppingBag, Eye, Check, ArrowRight, Heart } from 'lucide-react';
import { CartItem } from '../types';
import { useImageManager } from '../context/ImageManagerContext';
import { getProductColorHarmony } from '../utils/colorHarmony';

interface SeasonalLookbookProps {
  onAddToCart: (item: CartItem, silent?: boolean) => void;
  onOpenProductDetail: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
}

interface LookbookOutfit {
  id: string;
  title: string;
  tagline: string;
  productId: string;
  category: 'couture' | 'coquette' | 'noir' | 'resort';
  reniTip: string;
}

const LOOKBOOK_CATEGORIES = [
  { id: 'couture', name: 'Royal Couture & Velvet', emoji: '👑' },
  { id: 'coquette', name: 'Coquette & Organza Soiree', emoji: '🎀' },
  { id: 'noir', name: 'Midnight Noir & Galas', emoji: '🍸' },
  { id: 'resort', name: 'Resort & Sunset Celebration', emoji: '🌅' },
];

const LOOKBOOK_OUTFITS: LookbookOutfit[] = [
  // Couture
  {
    id: 'lb-1',
    title: 'Gulabi Zardozi Bridal Lehenga',
    tagline: 'Regal crimson silk with dense antique gold zardozi work',
    productId: 'her-2',
    category: 'couture',
    reniTip: 'Pair with our triple-strand baroque pearl choker for ultimate maharani poise.',
  },
  {
    id: 'lb-2',
    title: 'The Nizam Royal Gold Sherwani',
    tagline: 'Hand-embroidered pure silk with royal Kundan buttons',
    productId: 'him-3',
    category: 'couture',
    reniTip: 'Coordinate pocket square with your partner’s lehenga for breathtaking couple aesthetics.',
  },
  {
    id: 'lb-3',
    title: 'Maharani Emerald Banarasi Silk Saree',
    tagline: 'Authentic handwoven gold zari motifs and royal pallu border',
    productId: 'her-5',
    category: 'couture',
    reniTip: 'Keep hair in a sleek low bun with fresh mogra flowers for timeless grace.',
  },
  {
    id: 'lb-4',
    title: 'Imperial Jet Black Bandhgala Suit',
    tagline: 'Structured wool-silk with antiqued brass buttons and sharp collar',
    productId: 'him-7',
    category: 'couture',
    reniTip: 'The epitome of quiet luxury for formal Indian winter wedding receptions.',
  },

  // Coquette
  {
    id: 'lb-5',
    title: 'Blush Pink Wedding Guest Lehenga',
    tagline: 'Dreamy pastel blush silk with delicate champagne zari flare',
    productId: 'her-3',
    category: 'coquette',
    reniTip: 'Soft pastel silk makes daytime wedding receptions feel poetic, whimsical, and airy.',
  },
  {
    id: 'lb-6',
    title: 'Seraphina Velvet Bow Mini Dress',
    tagline: 'Off-the-shoulder ruby velvet with contrasting blush bow detail',
    productId: 'her-dress-velvet-coquette',
    category: 'coquette',
    reniTip: 'Style with patent Mary Janes and pearl drop earrings for romantic dinner dates.',
  },
  {
    id: 'lb-7',
    title: 'Blossom Pink Party Mini Dress',
    tagline: 'Structured bodice with feminine soft-girl silhouette',
    productId: 'her-11',
    category: 'coquette',
    reniTip: 'Pure princess energy for birthday parties, brunch soirees, and college farewells.',
  },
  {
    id: 'lb-8',
    title: 'Buttercream Satin Bias-Cut Slip Dress',
    tagline: 'Fluid cowl neck slip dress cut from butter-soft lustrous satin',
    productId: 'her-dress-vintage-slip',
    category: 'coquette',
    reniTip: 'Effortless cocktail elegance when you want to sparkle with quiet, graceful charm.',
  },

  // Noir
  {
    id: 'lb-9',
    title: 'Sovereign Plum Velvet Power Suit',
    tagline: 'Double-breasted tailored blazer with fluid puddle-hem trousers',
    productId: 'her-suit-sovereign-plum',
    category: 'noir',
    reniTip: 'Wear draped over shoulders with gold vermeil earrings for high-contrast evening drama.',
  },
  {
    id: 'lb-10',
    title: 'Midnight Onyx & Gold Designer Evening Gown',
    tagline: 'Sculptural black satin gown with dramatic metallic gold bow sash',
    productId: 'her-1',
    category: 'noir',
    reniTip: 'Moves like liquid mercury under candlelight. An absolute red-carpet head-turner.',
  },
  {
    id: 'lb-11',
    title: 'Midnight Onyx Designer Cocktail Dress',
    tagline: 'Precision-tailored black satin dress with sculptural platinum accent',
    productId: 'her-6',
    category: 'noir',
    reniTip: 'Pair with our crystal mosaic clutch for maximum radiance at evening galas.',
  },
  {
    id: 'lb-12',
    title: 'Savile Row Classic Black Tuxedo',
    tagline: 'Italian super-wool tuxedo with lustrous duchesse satin shawl lapels',
    productId: 'him-1',
    category: 'noir',
    reniTip: 'Black-tie perfection. Coordinate with handcrafted Italian oxfords and silk bowtie.',
  },

  // Resort
  {
    id: 'lb-13',
    title: 'Portofino Pure Linen Overshirt & Trousers',
    tagline: 'Airy natural linen tailoring for sun-drenched coastal celebrations',
    productId: 'him-12',
    category: 'resort',
    reniTip: 'Breathable relaxed luxury for destination beach weddings and sunset dinners.',
  },
  {
    id: 'lb-14',
    title: 'Breeze Pure White Resort Maxi Dress',
    tagline: 'Fluid cotton-silk maxi dress with tiered breezy movement',
    productId: 'her-14',
    category: 'resort',
    reniTip: 'Effortless resort chic. Style with saddle tan leather crossbody and minimal sandals.',
  },
  {
    id: 'lb-15',
    title: 'Indo-Western Ivory & Sand Co-Ord Set',
    tagline: 'Tailored neutral separates with brushed brass button accents',
    productId: 'her-7',
    category: 'resort',
    reniTip: 'Versatile contemporary silhouette for rooftop sunset parties and destination brunches.',
  },
  {
    id: 'lb-16',
    title: 'Coastal Azure Blue Resort Wear Set',
    tagline: 'Crisp azure blue tailoring with crisp white piping details',
    productId: 'him-13',
    category: 'resort',
    reniTip: 'Modern vacation chic. Pair with clean white sneakers and retro cat-eye shades.',
  },
];

export const SeasonalLookbook: React.FC<SeasonalLookbookProps> = ({
  onAddToCart,
  onOpenProductDetail,
  onToggleWishlist,
  isWishlisted,
}) => {
  const { getImage } = useImageManager();
  const [activeCategory, setActiveCategory] = useState<string>('couture');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredOutfits = LOOKBOOK_OUTFITS.filter((o) => o.category === activeCategory);

  const handleQuickAdd = (outfit: LookbookOutfit) => {
    const prod = PRODUCTS.find((p) => p.id === outfit.productId) || PRODUCTS[0];
    const colorHarmony = getProductColorHarmony(prod);
    const cartItem: CartItem = {
      id: `lookbook-${prod.id}-${Date.now()}`,
      product: prod,
      selectedSize: prod.sizes[0] || 'M',
      selectedColor: colorHarmony.harmonyName,
      rentalDurationDays: 4,
      itemTotal: prod.rentalPrice4Days,
    };
    onAddToCart(cartItem, true); // silent: true to prevent notifications while clicking the product
    setToastMessage(`✨ Added "${prod.name}" to your rental bag!`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleViewDetail = (outfit: LookbookOutfit) => {
    const prod = PRODUCTS.find((p) => p.id === outfit.productId) || PRODUCTS[0];
    onOpenProductDetail(prod);
  };

  return (
    <section id="lookbook" className="py-16 bg-[#EEE4DA] text-[#2D1517] border-b border-[#C8A49F]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8A49F]/20 border border-[#C8A49F]/40 text-[#4D0E13] text-xs font-semibold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#4D0E13]" />
            <span>Curated Trend Lookbook</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D1517] tracking-tight mb-3">
            Seasonal Runway & Editorial Edits 🎀
          </h2>
          <p className="text-xs sm:text-sm text-[#5e5460] leading-relaxed">
            Discover compact, high-end luxury editorial spreads curated by RÉNÉ. Tap any look to explore the full outfit and rent instantly.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-2 sm:gap-3 overflow-x-auto pb-4 mb-10 scrollbar-none max-w-full">
          {LOOKBOOK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-[#4D0E13] text-white shadow-md scale-105'
                  : 'bg-white/80 text-[#2D1517] border border-[#C8A49F]/40 hover:bg-[#C8A49F]/25'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Compact Outfit Cards Grid with Portrait Ratio to Display Full Outfits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredOutfits.map((outfit) => {
            const prod = PRODUCTS.find((p) => p.id === outfit.productId) || PRODUCTS[0];
            const displayImg = getImage(`product-${prod.id}`, prod.images[0]);
            const colorHarmony = getProductColorHarmony(prod);
            const price = prod.rentalPrice4Days;
            const retail = prod.retailPrice;
            const liked = isWishlisted(prod.id);

            return (
              <div
                key={outfit.id}
                onClick={() => handleViewDetail(outfit)}
                className="group bg-white rounded-2xl overflow-hidden border border-[#C8A49F]/40 shadow-xs hover:shadow-xl hover:border-[#4D0E13]/50 transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Portrait Image Container - Displays full outfit without horizontal cropping */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-neutral-100/90 flex items-center justify-center p-2">
                    <img
                      src={displayImg}
                      alt={prod.name}
                      className="w-full h-full object-contain object-center drop-shadow-xs group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                      <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
                        {prod.category === 'him' ? 'For Him' : 'For Her'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleWishlist(prod);
                        }}
                        className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/90 backdrop-blur-md text-[#2D1517] hover:bg-white transition-all pointer-events-auto cursor-pointer shadow-xs ${
                          liked ? 'text-[#4D0E13]' : ''
                        }`}
                        aria-label="Wishlist"
                      >
                        <Heart className={`w-4 h-4 ${liked ? 'fill-[#4D0E13] text-[#4D0E13]' : 'text-[#5e5460]'}`} />
                      </button>
                    </div>

                    {/* Quick View overlay button on hover */}
                    <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/75 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetail(outfit);
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-white text-[#2D1517] text-xs font-semibold hover:bg-[#EEE4DA] transition-colors cursor-pointer inline-flex items-center gap-1.5 shadow-md"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#4D0E13]" />
                        <span>View Details</span>
                      </button>
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="p-4">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] uppercase tracking-wider text-[#5e5460] font-semibold truncate">
                        {prod.brand} · {prod.subCategory}
                      </span>
                      <div className="flex items-center gap-1 shrink-0">
                        <span
                          className="w-2.5 h-2.5 rounded-full border border-black/10 inline-block shadow-2xs"
                          style={{ backgroundColor: colorHarmony.primaryColor.hex }}
                          title={colorHarmony.harmonyName}
                        />
                        <span className="text-[10px] text-[#5e5460]">
                          {colorHarmony.primaryColor.name.split(' ')[0]}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-serif text-base font-bold text-[#2D1517] mb-1 line-clamp-1 group-hover:text-[#4D0E13] transition-colors">
                      {outfit.title}
                    </h3>
                    <p className="text-[11px] text-[#5e5460] line-clamp-1 mb-3">
                      {outfit.tagline}
                    </p>

                    {/* RÉNÉ tip box */}
                    <div className="p-2.5 rounded-xl bg-[#EEE4DA]/60 border border-[#C8A49F]/30 mb-3">
                      <div className="flex items-center gap-1 text-[10px] font-bold text-[#4D0E13] mb-0.5">
                        <Sparkles className="w-3 h-3 text-[#C8A49F]" />
                        <span>RÉNÉ's Styling Tip</span>
                      </div>
                      <p className="text-[11px] text-[#2D1517] italic leading-tight line-clamp-2">
                        "{outfit.reniTip}"
                      </p>
                    </div>
                  </div>
                </div>

                {/* Pricing & Quick Add Row */}
                <div className="px-4 pb-4 pt-2 border-t border-[#C8A49F]/20 flex items-center justify-between gap-2">
                  <div>
                    <div className="flex items-baseline gap-1">
                      <span className="font-serif text-base font-bold text-[#4D0E13] font-mono tabular-nums">
                        ₹{(price || prod?.rentalPrice4Days || 299).toLocaleString()}
                      </span>
                      <span className="text-[10px] text-[#5e5460]">/ 4 days</span>
                    </div>
                    <span className="text-[10px] text-[#5e5460] line-through block">
                      Retail ₹{retail.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickAdd(outfit);
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#4D0E13] text-white text-xs font-semibold hover:bg-[#38090d] transition-colors cursor-pointer shadow-xs shrink-0"
                    title="Rent this outfit"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#C8A49F]" />
                    <span>Rent Now</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

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
