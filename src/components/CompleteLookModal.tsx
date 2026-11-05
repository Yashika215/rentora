import React, { useState, useEffect, useMemo } from 'react';
import { Product, PRODUCTS, FREE_GIFT_PROMOTION } from '../data/catalog';
import { CartItem } from '../types';
import { useImageManager } from '../context/ImageManagerContext';
import { getProductColorHarmony } from '../utils/colorHarmony';
import { X, Check, Plus, ShoppingBag, Sparkles, Gift, ArrowRight, Share2 } from 'lucide-react';
import { ShareLookModal } from './ShareLookModal';

interface CompleteLookModalProps {
  product: Product | null;
  onClose: () => void;
  onAddBundleToCart: (items: CartItem[]) => void;
  onOpenProductDetail?: (product: Product) => void;
}

export const CompleteLookModal: React.FC<CompleteLookModalProps> = ({
  product,
  onClose,
  onAddBundleToCart,
  onOpenProductDetail,
}) => {
  const { getImage } = useImageManager();

  // Color Harmony of base product
  const baseColorHarmony = useMemo(() => {
    return product ? getProductColorHarmony(product) : null;
  }, [product]);

  // Compute complementary accessories strictly matched to the selected product
  const complementaryAccessories = useMemo(() => {
    if (!product) return [];

    const isMen = product.category === 'him';
    const isWomen = product.category === 'her';
    const pName = product.name.toLowerCase();
    const pSub = product.subCategory.toLowerCase();
    const pDesc = (product.description || '').toLowerCase();
    const pOccasions = product.occasions || [];

    // Is ethnic (lehenga, saree, anarkali, sharara, sherwani, kurta, bandhgala, garba)
    const isEthnic =
      pSub.includes('ethnic') ||
      pName.includes('lehenga') ||
      pName.includes('saree') ||
      pName.includes('anarkali') ||
      pName.includes('sharara') ||
      pName.includes('sherwani') ||
      pName.includes('kurta') ||
      pName.includes('garba') ||
      pName.includes('chaniya') ||
      pName.includes('bandhgala') ||
      pName.includes('waistcoat') ||
      pOccasions.includes('navratri-garba') ||
      pOccasions.includes('weddings-guest') ||
      pOccasions.includes('festivals-diwali');

    // Is formal black-tie / tuxedo / gala gown
    const isTuxedoOrBlackTie =
      pName.includes('tuxedo') ||
      pDesc.includes('tuxedo') ||
      pName.includes('black-tie') ||
      (isMen && pName.includes('suit') && pOccasions.includes('formal-galas'));

    // Is Western formal gown / cocktail dress / power suit
    const isFormalWesternGown =
      isWomen &&
      (pName.includes('gown') ||
        pName.includes('cocktail') ||
        pName.includes('blazer') ||
        pName.includes('reception') ||
        pOccasions.includes('formal-galas'));

    // Is Casual / Beach / Resort / Daytime
    const isCasualOrResort =
      pName.includes('linen') ||
      pName.includes('resort') ||
      pName.includes('maxi') ||
      pName.includes('co-ord') ||
      pOccasions.includes('vacation-beach') ||
      pOccasions.includes('brunches-casual');

    // Filter candidate accessories strictly from category 'accessory'
    // Exclude the product itself and any non-accessory garments
    const candidateAccessories = PRODUCTS.filter((p) => {
      if (p.id === product.id) return false;
      if (p.category !== 'accessory') return false;
      return true;
    });

    const scoredItems: { item: Product; score: number; rationale: string }[] = [];

    candidateAccessories.forEach((acc) => {
      let score = 0;
      let rationale = 'Complementary styling accent';
      const accName = acc.name.toLowerCase();
      const accSub = acc.subCategory.toLowerCase();
      const accHarmony = getProductColorHarmony(acc);

      // Gender filter
      if (isMen) {
        // Strictly allow only men's or unisex accessories
        const isMensAccessory =
          acc.id.startsWith('acc-men-') ||
          acc.id === 'acc-velvet-embroidered-loafers' ||
          acc.id === 'acc-clean-sneaker' ||
          acc.brand.toLowerCase().includes('men') ||
          accName.includes('men') ||
          accName.includes('derby') ||
          accName.includes('oxford') ||
          accName.includes('cufflink') ||
          accName.includes('bowtie') ||
          accName.includes('pocket tie') ||
          accName.includes('mojari');

        if (!isMensAccessory) return;

        // Score based on men's outfit type
        if (isTuxedoOrBlackTie) {
          if (acc.id === 'acc-men-classic-derby') {
            score += 50;
            rationale = 'Handcrafted Italian Oxfords provide clean closed-lacing for black-tie formality.';
          } else if (acc.id === 'acc-men-silk-pocket-tie') {
            score += 48;
            rationale = 'Mulberry silk bowtie and hand-rolled pocket square complete the collar and chest pocket.';
          } else if (acc.id === 'acc-men-leather-belt-cufflinks') {
            score += 45;
            rationale = 'Onyx cufflinks add subtle black-tie jewelry detailing to French cuffs.';
          } else if (acc.id === 'acc-men-heritage-watch') {
            score += 35;
            rationale = 'Classic chronograph adds quiet-luxury wrist presence.';
          }
        } else if (isEthnic && isMen) {
          // Sherwani / Kurta / Bandhgala
          if (acc.id === 'acc-men-mojari-juttis' || acc.id === 'acc-velvet-embroidered-loafers') {
            score += 50;
            rationale = 'Royal footwear with gold dabka embroidery matches traditional regal silhouettes.';
          } else if (acc.id === 'acc-men-banarasi-stole') {
            score += 48;
            rationale = 'Banarasi silk zari wedding stole drapes gracefully over the shoulder.';
          } else if (acc.id === 'acc-men-heritage-watch') {
            score += 40;
            rationale = 'Gold bezel timepiece harmonizes with zari embroidery.';
          } else if (acc.id === 'acc-men-leather-belt-cufflinks') {
            score += 30;
            rationale = 'Polished leather belt ensures sharp waist tailoring.';
          }
        } else if (isCasualOrResort) {
          // Linen / Resort men
          if (acc.id === 'acc-clean-sneaker') {
            score += 50;
            rationale = 'Minimalist Italian white leather court sneakers keep the look relaxed yet elevated.';
          } else if (acc.id === 'acc-men-heritage-watch') {
            score += 45;
            rationale = 'Saddle leather strap complements casual linen textures.';
          } else if (acc.id === 'acc-velvet-embroidered-loafers') {
            score += 35;
            rationale = 'Supple handcrafted loafers offer comfortable slip-on resort luxury.';
          }
        } else {
          // Standard Men's Suit / Blazer
          if (acc.id === 'acc-men-classic-derby') {
            score += 45;
            rationale = 'Italian calfskin dress shoes anchor the tailored silhouette.';
          } else if (acc.id === 'acc-men-leather-belt-cufflinks') {
            score += 42;
            rationale = 'Reversible leather belt ensures flawless waistline tailoring.';
          } else if (acc.id === 'acc-men-silk-pocket-tie') {
            score += 38;
            rationale = 'Silk pocket square injects polished contrast to the jacket lapel.';
          } else if (acc.id === 'acc-men-heritage-watch') {
            score += 35;
            rationale = 'Heritage chronograph adds polished wrist presence.';
          }
        }
      } else if (isWomen) {
        // Disallow men's specific accessories
        const isMensOnly =
          acc.id.startsWith('acc-men-') ||
          acc.id === 'acc-velvet-embroidered-loafers' ||
          accName.includes('men') ||
          accName.includes('derby') ||
          accName.includes('oxford') ||
          accName.includes('cufflink') ||
          accName.includes('bowtie') ||
          accSub.includes('him');

        if (isMensOnly) return;

        // Score based on women's outfit type
        if (isEthnic && isWomen) {
          // Lehenga, Saree, Anarkali, Garba
          if (acc.id === 'acc-kundan-jhumkas' || acc.id === 'acc-jewelled-necklace') {
            score += 50;
            rationale = 'Hand-cut Kundan and seed pearls frame the neckline with royal heritage glamour.';
          } else if (acc.id === 'acc-kundan-bangles') {
            score += 48;
            rationale = 'Kundan and emerald kada bangles add mesmerizing hand movement when dancing.';
          } else if (acc.id === 'acc-potli-embroidered-gold') {
            score += 45;
            rationale = 'Zardozi velvet drawstring potli keeps essentials close with ornate elegance.';
          } else if (acc.id === 'acc-zari-juttis') {
            score += 42;
            rationale = 'Cushioned leather juttis with pure gold wire zari offer pain-free twirls.';
          } else if (acc.id === 'acc-boho-silver-belt' && (pName.includes('garba') || pOccasions.includes('navratri-garba'))) {
            score += 55;
            rationale = 'Oxidized silver ghungroo coin belt accentuates the waistline during Navratri spins.';
          } else if (acc.id === 'acc-crystal-clutch') {
            score += 35;
            rationale = 'Champagne crystal clutch adds sparkling night glamour.';
          }
        } else if (isFormalWesternGown) {
          // Evening Gowns, Cocktail dresses
          if (acc.id === 'acc-crystal-chandelier-earrings') {
            score += 50;
            rationale = 'Prismatic crystal chandelier earrings capture event spotlights with dramatic brilliance.';
          } else if (acc.id === 'acc-metallic-stiletto') {
            score += 48;
            rationale = 'Strappy metallic heels elongate the silhouette under floor-sweeping hems.';
          } else if (acc.id === 'acc-crystal-clutch' || acc.id === 'acc-bold-crimson-clutch') {
            score += 45;
            rationale = 'Architectural geometric minaudière serves as an exquisite jewelry clutch.';
          } else if (acc.id === 'acc-pearl-choker') {
            score += 35;
            rationale = 'Baroque pearl choker frames open décolletage with timeless poise.';
          }
        } else if (isCasualOrResort) {
          // Casual / Beach / Daywear
          if (acc.id === 'acc-canvas-crossbody' || acc.id === 'acc-minimal-leather-tote') {
            score += 50;
            rationale = 'Organic canvas and saddle leather carry essentials with relaxed sun-drenched chic.';
          } else if (acc.id === 'acc-minimal-mule' || acc.id === 'acc-clean-sneaker') {
            score += 48;
            rationale = 'Clean-lined leather footwear keeps daytime styling breezy and comfortable.';
          } else if (acc.id === 'acc-minimal-gold-huggie') {
            score += 40;
            rationale = '18K gold vermeil huggies offer effortless understated everyday shine.';
          } else if (acc.id === 'acc-velvet-bow-barrette') {
            score += 35;
            rationale = 'Whimsical velvet hair bow adds feminine charm to half-up styles.';
          }
        } else {
          // General women's pieces
          if (acc.id === 'acc-pearl-mini-tote') {
            score += 40;
            rationale = 'Woven pearl top-handle bag complements evening and daytime outfits.';
          } else if (acc.id === 'acc-minimal-gold-huggie') {
            score += 38;
            rationale = 'Minimalist huggies add polished finish without clashing.';
          } else if (acc.id === 'acc-metallic-stiletto') {
            score += 36;
            rationale = 'Metallic strappy heels lift and elevate the overall posture.';
          }
        }
      }

      // Bonus for Color Compatibility
      if (baseColorHarmony && score > 0) {
        const matchingHue = baseColorHarmony.compatibleHues.some((hue) =>
          accHarmony.harmonyName.toLowerCase().includes(hue.toLowerCase()) ||
          accHarmony.primaryColor.name.toLowerCase().includes(hue.toLowerCase()) ||
          accName.includes(hue.toLowerCase())
        );
        if (matchingHue) {
          score += 15;
        }
      }

      if (score > 0) {
        scoredItems.push({ item: acc, score, rationale });
      }
    });

    // Sort descending by score and pick top 3-4 complementary accessories
    scoredItems.sort((a, b) => b.score - a.score);
    return scoredItems.slice(0, 4);
  }, [product, baseColorHarmony]);

  // Dynamic selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [includeBaseOutfit, setIncludeBaseOutfit] = useState<boolean>(true);
  const [isShareOpen, setIsShareOpen] = useState<boolean>(false);

  // Sync selections when product or complementary accessories change
  useEffect(() => {
    if (complementaryAccessories.length > 0) {
      setSelectedIds(complementaryAccessories.map((c) => c.item.id));
      setIncludeBaseOutfit(true);
    } else {
      setSelectedIds([]);
    }
  }, [product?.id, complementaryAccessories]);

  if (!product) return null;

  const basePrice = includeBaseOutfit ? product.rentalPrice4Days : 0;
  const accessoriesTotal = selectedIds.reduce((sum, id) => {
    const acc = PRODUCTS.find((p) => p.id === id);
    return sum + (acc ? acc.rentalPrice4Days : 0);
  }, 0);

  const combinedTotal = basePrice + accessoriesTotal;
  const qualifiesForGift = combinedTotal >= FREE_GIFT_PROMOTION.thresholdAmount;
  const amountRemaining = Math.max(0, FREE_GIFT_PROMOTION.thresholdAmount - combinedTotal);

  const toggleAccessory = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleAddBundle = () => {
    const itemsToAdd: CartItem[] = [];

    if (includeBaseOutfit) {
      itemsToAdd.push({
        id: `${product.id}-${Date.now()}-base`,
        product,
        selectedSize: product.sizes[0] || 'M',
        selectedColor: baseColorHarmony?.harmonyName || 'Standard',
        rentalDurationDays: 4,
        itemTotal: product.rentalPrice4Days,
      });
    }

    selectedIds.forEach((id) => {
      const acc = PRODUCTS.find((p) => p.id === id);
      if (acc) {
        const accHarmony = getProductColorHarmony(acc);
        itemsToAdd.push({
          id: `${acc.id}-${Date.now()}-${Math.random()}`,
          product: acc,
          selectedSize: acc.sizes[0] || 'One Size',
          selectedColor: accHarmony.harmonyName || 'Standard',
          rentalDurationDays: 4,
          itemTotal: acc.rentalPrice4Days,
        });
      }
    });

    onAddBundleToCart(itemsToAdd);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div
        className="relative w-full max-w-3xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#C8A49F]/40 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-[#EEE4DA] via-[#FDFBF7] to-[#EEE4DA] border-b border-[#C8A49F]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#4D0E13] text-[#C8A49F] flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#4D0E13] block">
                RENTORA Coordinated Suite
              </span>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2D1517]">
                Complete Your Look
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/80 text-[#2D1517] transition-colors cursor-pointer shrink-0"
            aria-label="Close Complete Look Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 sm:space-y-6">
          {/* Base Outfit Review Box */}
          <div className="p-3.5 sm:p-4 rounded-2xl bg-[#EEE4DA]/70 border border-[#C8A49F]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={getImage(`product-${product.id}`, product.images[0])}
                alt={product.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-contain p-1 border border-[#C8A49F]/30 bg-white shrink-0 shadow-xs"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[9px] uppercase font-bold text-[#C8A49F] tracking-wider block">
                    Anchor Piece ({product.category === 'him' ? 'For Him' : 'For Her'})
                  </span>
                  {baseColorHarmony && (
                    <span className="text-[10px] font-semibold text-[#4D0E13] px-2 py-0.2 rounded-full bg-white/80 border border-[#C8A49F]/20">
                      {baseColorHarmony.harmonyName}
                    </span>
                  )}
                </div>
                <h4 className="font-serif text-sm sm:text-base font-bold text-[#2D1517] truncate">
                  {product.name}
                </h4>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xs font-mono font-bold text-[#4D0E13]">
                    ₹{product.rentalPrice4Days.toLocaleString()} / 4 days
                  </span>
                  <span className="text-[10px] text-[#5e5460]">
                    (Retail: ₹{product.retailPrice.toLocaleString()})
                  </span>
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-[#4D0E13] shrink-0 bg-white px-3 py-1.5 rounded-xl border border-[#C8A49F]/30">
              <input
                type="checkbox"
                checked={includeBaseOutfit}
                onChange={(e) => setIncludeBaseOutfit(e.target.checked)}
                className="rounded accent-[#4D0E13] w-4 h-4 cursor-pointer"
              />
              <span>Include in Bundle</span>
            </label>
          </div>

          {/* Coordinated Accessories Section */}
          <div>
            <div className="mb-3">
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#2D1517]">
                Curated Complementary Pieces ({product.category === 'him' ? 'For Him' : 'For Her'})
              </h3>
              <p className="text-xs text-[#5e5460] mt-0.5">
                Harmonized with {product.name}'s {baseColorHarmony?.harmonyName || 'palette'} and occasion silhouette.
              </p>
            </div>

            {complementaryAccessories.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {complementaryAccessories.map(({ item: acc, rationale }) => {
                  const isChecked = selectedIds.includes(acc.id);
                  const accImg = getImage(`product-${acc.id}`, acc.images[0]);
                  const accHarmony = getProductColorHarmony(acc);

                  return (
                    <div
                      key={acc.id}
                      onClick={() => toggleAccessory(acc.id)}
                      className={`p-3.5 rounded-2xl border flex flex-col justify-between gap-2.5 cursor-pointer transition-all duration-200 ${
                        isChecked
                          ? 'bg-[#EEE4DA]/60 border-[#4D0E13] shadow-sm'
                          : 'bg-white border-[#C8A49F]/30 hover:border-[#4D0E13]/40'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={accImg}
                          alt={acc.name}
                          className="w-14 h-14 rounded-xl object-contain p-1 bg-white shrink-0 border border-[#C8A49F]/30 shadow-xs"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <span className="text-[9px] uppercase tracking-wider text-[#5e5460] font-bold block truncate">
                              {acc.subCategory}
                            </span>
                            <div className="flex items-center gap-1 shrink-0">
                              <span
                                className="w-2.5 h-2.5 rounded-full border border-black/15 shadow-inner inline-block"
                                style={{ backgroundColor: accHarmony.primaryColor.hex }}
                                title={accHarmony.harmonyName}
                              />
                              <span className="text-[10px] text-[#5e5460] font-medium">
                                {accHarmony.primaryColor.name}
                              </span>
                            </div>
                          </div>

                          <h5 className="text-xs font-bold text-[#2D1517] line-clamp-1">
                            {acc.name}
                          </h5>

                          <div className="flex items-baseline gap-1.5 mt-0.5">
                            <span className="text-xs font-mono font-bold text-[#4D0E13]">
                              ₹{acc.rentalPrice4Days}
                            </span>
                            <span className="text-[10px] text-[#5e5460]">/ 4 days</span>
                          </div>
                        </div>
                      </div>

                      {/* Styling explanation for why this item complements the outfit */}
                      <p className="text-[11px] text-[#5e5460] leading-snug italic bg-white/70 p-2 rounded-lg border border-[#C8A49F]/20">
                        "{rationale}"
                      </p>

                      {/* Card Footer: Checkbox & View Product Button */}
                      <div className="flex items-center justify-between pt-1 border-t border-[#C8A49F]/20">
                        <label
                          className="flex items-center gap-1.5 text-[11px] font-semibold text-[#4D0E13] cursor-pointer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleAccessory(acc.id)}
                            className="rounded accent-[#4D0E13] w-3.5 h-3.5 cursor-pointer"
                          />
                          <span>{isChecked ? 'Added to Look' : 'Add Piece'}</span>
                        </label>

                        {onOpenProductDetail && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onClose();
                              onOpenProductDetail(acc);
                            }}
                            className="px-2.5 py-1 text-[11px] font-semibold text-[#4D0E13] bg-[#EEE4DA] hover:bg-[#C8A49F]/40 rounded-lg border border-[#C8A49F]/40 transition-colors cursor-pointer"
                          >
                            View Product
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center bg-[#EEE4DA]/30 rounded-2xl border border-dashed border-[#C8A49F]/50">
                <p className="text-sm text-[#5e5460] font-medium">
                  We couldn’t find matching pieces for this look yet.
                </p>
                <p className="text-xs text-[#5e5460]/70 mt-1">
                  Our stylists are continuously curating new companion accessories for this edit.
                </p>
              </div>
            )}
          </div>

          {/* Free Gift Promo Banner */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#4D0E13] to-[#36080B] text-white flex items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-2.5">
              <Gift className="w-5 h-5 text-[#C8A49F] shrink-0" />
              <div className="text-xs">
                <span className="font-bold block">
                  {qualifiesForGift ? '🎉 FREE Luxury Keepsake Unlocked!' : 'RENTORA Keepsake Gift at ₹3,000+'}
                </span>
                <span className="text-[11px] text-[#EEE4DA]/80">
                  {qualifiesForGift
                    ? 'Signature Pearl Bow Keepsake Box included at ₹0!'
                    : `Add ₹${amountRemaining.toLocaleString()} more to unlock your complimentary gift.`}
                </span>
              </div>
            </div>
            {qualifiesForGift && (
              <span className="px-2.5 py-1 rounded-full bg-[#C8A49F] text-[#4D0E13] text-[10px] font-bold uppercase tracking-wider shrink-0">
                Unlocked
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-[#EEE4DA] border-t border-[#C8A49F]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#5e5460] block">
              Coordinated Suite Total ({selectedIds.length + (includeBaseOutfit ? 1 : 0)} items)
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="font-serif text-xl sm:text-2xl font-bold text-[#4D0E13] font-mono">
                ₹{combinedTotal.toLocaleString()}
              </span>
              <span className="text-xs text-[#5e5460]">/ 4 days rental</span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <button
              type="button"
              onClick={() => setIsShareOpen(true)}
              className="px-3.5 py-2.5 rounded-xl border border-[#C8A49F]/60 bg-white text-[#4D0E13] text-xs font-bold hover:bg-[#EEE4DA] transition-all cursor-pointer shadow-xs inline-flex items-center gap-1.5"
              title="Generate a social-media-ready visual summary of this curated look"
            >
              <Share2 className="w-3.5 h-3.5 text-[#C8A49F]" />
              <span>Share My Look</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#C8A49F]/50 text-xs font-semibold text-[#5e5460] hover:bg-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAddBundle}
              disabled={combinedTotal === 0}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#4D0E13] text-white text-xs font-bold shadow-md hover:bg-[#38090d] transition-all disabled:opacity-50 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-[#C8A49F]" />
              <span>Add Complete Suite to Bag</span>
            </button>
          </div>
        </div>
      </div>

      {product && (
        <ShareLookModal
          isOpen={isShareOpen}
          onClose={() => setIsShareOpen(false)}
          data={{
            title: product.name,
            occasion: product.occasions && product.occasions[0] 
              ? product.occasions[0].replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) 
              : 'Celebrations & Gala',
            product,
            accessories: PRODUCTS.filter((p) => selectedIds.includes(p.id)),
            totalPrice: combinedTotal,
            rentalDuration: '4 Days Rental',
          }}
        />
      )}
    </div>
  );
};
