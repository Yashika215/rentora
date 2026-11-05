import React, { useState, useMemo, useEffect } from 'react';
import { PRODUCTS, Product } from '../data/catalog';
import { CartItem } from '../types';
import { useImageManager } from '../context/ImageManagerContext';
import { getProductColorHarmony } from '../utils/colorHarmony';
import { ShareLookModal } from './ShareLookModal';
import {
  Sparkles,
  ShoppingBag,
  RotateCcw,
  Check,
  Plus,
  Trash2,
  Share2,
  ChevronRight,
  Layers,
  ArrowRight,
  Repeat
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface OutfitBuilderSectionProps {
  products?: Product[];
  onAddToCart?: (item: CartItem) => void;
  onAddBundleToCart?: (items: CartItem[]) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: (id: string) => boolean;
  onOpenProductDetail?: (product: Product) => void;
  onOpenCart?: () => void;
}

const OCCASION_TAG_MAP: Record<string, string[]> = {
  Wedding: ['weddings-guest', 'engagements'],
  Party: ['party', 'birthday-parties', 'photoshoots', 'formal-galas'],
  Festive: ['festive', 'navratri-garba', 'festivals-diwali', 'eid-celebrations'],
  Casual: ['casual', 'brunches-casual', 'vacation-beach', 'college-farewell'],
  Traditional: ['traditional', 'weddings-guest', 'navratri-garba', 'festivals-diwali'],
};

const DURATION_FACTORS: Record<string, number> = {
  '2 Days': 0.7,
  '4 Days': 1.0,
  '7 Days': 1.5,
};

export const OutfitBuilderSection: React.FC<OutfitBuilderSectionProps> = ({
  products = PRODUCTS,
  onAddToCart,
  onAddBundleToCart,
}) => {
  const { currentUser } = useAuth();
  const { getImage } = useImageManager();

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (currentUser?.gender && currentUser.gender !== 'unisex' && currentUser.gender !== 'prefer_not_to_say') {
        const genderCategory = currentUser.gender === 'female' ? 'her' : 'him';
        return p.category === 'accessory' || p.category === genderCategory;
      }
      return true;
    });
  }, [products, currentUser?.gender]);

  // 1. Selection Options State
  const [selectedFor, setSelectedFor] = useState<'her' | 'him' | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<string>('');
  const [rentalDuration, setRentalDuration] = useState<'2 Days' | '4 Days' | '7 Days' | ''>('');

  // Available Outfits Catalogue Filtered by "For" and "Occasion"
  const availableOutfits = useMemo(() => {
    if (!selectedFor) return []; // Require gender selection to show outfits
    
    return products.filter((p) => {
      if (p.category === 'accessory') return false;

      // Filter by For
      if (selectedFor === 'her' && p.category !== 'her') return false;
      if (selectedFor === 'him' && p.category !== 'him') return false;

      // Filter by Occasion if chosen
      if (selectedOccasion) {
        const allowedTags = OCCASION_TAG_MAP[selectedOccasion] || [];
        const matchesOccasion = p.occasions.some((occ) => allowedTags.includes(occ));
        const matchesAesthetic = p.aesthetic.some((a) => a.toLowerCase() === selectedOccasion.toLowerCase());
        if (!matchesOccasion && !matchesAesthetic) return false;
      }

      return true;
    });
  }, [products, selectedFor, selectedOccasion]);

  // Active outfit selection (Strict manual selection: defaults to null until chosen by user)
  const [selectedOutfit, setSelectedOutfit] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');

  // Chosen accessories in the live preview
  const [selectedAccessories, setSelectedAccessories] = useState<Product[]>([]);

  // Share & Toast States
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // If selected outfit is no longer in availableOutfits (e.g., filtered out), clear selection without auto-selecting
  useEffect(() => {
    if (selectedOutfit && !availableOutfits.some((o) => o.id === selectedOutfit.id)) {
      setSelectedOutfit(null);
      setSelectedSize('');
      setSelectedAccessories([]);
    }
  }, [availableOutfits, selectedOutfit]);

  // Handle selecting an outfit
  const handleSelectOutfit = (outfit: Product) => {
    setSelectedOutfit(outfit);
    setSelectedSize(outfit.sizes[0] || 'M');
    // Clear previously chosen accessories so recommendations can be tailored to this outfit
    setSelectedAccessories([]);
  };

  // Quick swap to next outfit in the active catalogue
  const handleSwapOutfit = () => {
    if (availableOutfits.length <= 1 || !selectedOutfit) return;
    const currentIndex = availableOutfits.findIndex((o) => o.id === selectedOutfit.id);
    const nextIndex = (currentIndex + 1) % availableOutfits.length;
    handleSelectOutfit(availableOutfits[nextIndex]);
  };

  // 2. Matching Recommendations Computation
  // Suggest ONLY matching: Earrings, Footwear, Bags, Watches, Other relevant accessories
  const recommendationsByCategory = useMemo(() => {
    if (!selectedOutfit) {
      return {
        earrings: [],
        footwear: [],
        bags: [],
        watches: [],
        other: [],
      };
    }

    const isMen = selectedFor === 'him' || selectedOutfit.category === 'him';
    const outfitHarmony = getProductColorHarmony(selectedOutfit);
    const outfitHarmonyName = outfitHarmony.harmonyName.toLowerCase();
    const outfitAesthetics = selectedOutfit.aesthetic || [];

    // Filter all accessories
    const candidateAccessories = products.filter((p) => {
      if (p.category !== 'accessory') return false;
      if (p.id === selectedOutfit.id) return false;
      if (selectedAccessories.some((sa) => sa.id === p.id)) return false;

      // Gender compatibility
      if (isMen) {
        const isMenAcc =
          p.id.startsWith('acc-men-') ||
          p.id === 'acc-velvet-embroidered-loafers' ||
          p.id === 'acc-clean-sneaker' ||
          p.brand.toLowerCase().includes('men') ||
          p.name.toLowerCase().includes('men') ||
          p.name.toLowerCase().includes('derby') ||
          p.name.toLowerCase().includes('oxford') ||
          p.name.toLowerCase().includes('cufflink') ||
          p.name.toLowerCase().includes('bowtie') ||
          p.name.toLowerCase().includes('pocket tie') ||
          p.name.toLowerCase().includes('mojari');
        if (!isMenAcc) return false;
      } else {
        // For women: exclude men specific
        if (
          p.id.startsWith('acc-men-') ||
          p.id === 'acc-velvet-embroidered-loafers' ||
          p.name.toLowerCase().includes('oxford') ||
          p.name.toLowerCase().includes('derby') ||
          p.name.toLowerCase().includes('cufflink')
        ) {
          return false;
        }
      }

      return true;
    });

    // Score candidates by aesthetic & color harmony
    const scored = candidateAccessories.map((item) => {
      let score = 0;
      const itemHarmony = getProductColorHarmony(item);
      if (itemHarmony.harmonyName.toLowerCase() === outfitHarmonyName) score += 3;
      if (item.aesthetic.some((a) => outfitAesthetics.includes(a))) score += 2;
      return { item, score };
    });

    scored.sort((a, b) => b.score - a.score);
    const pool = scored.map((s) => s.item);

    // Group by requested categories
    const earrings: Product[] = [];
    const footwear: Product[] = [];
    const bags: Product[] = [];
    const watches: Product[] = [];
    const other: Product[] = [];

    pool.forEach((item) => {
      const name = item.name.toLowerCase();
      const sub = item.subCategory.toLowerCase();

      if (name.includes('earring') || name.includes('jhumka') || name.includes('stud') || name.includes('chandbali')) {
        earrings.push(item);
      } else if (name.includes('shoe') || name.includes('heel') || name.includes('sandal') || name.includes('derby') || name.includes('loafer') || name.includes('jutti') || sub.includes('shoes')) {
        footwear.push(item);
      } else if (name.includes('bag') || name.includes('clutch') || name.includes('potli') || sub.includes('bags')) {
        bags.push(item);
      } else if (name.includes('watch') || name.includes('timepiece')) {
        watches.push(item);
      } else {
        other.push(item);
      }
    });

    return {
      earrings: earrings.slice(0, 3),
      footwear: footwear.slice(0, 3),
      bags: bags.slice(0, 3),
      watches: watches.slice(0, 3),
      other: other.slice(0, 3),
    };
  }, [selectedOutfit, products, selectedFor, selectedAccessories]);

  // Main Actions: Add / Remove accessory
  const handleAddAccessory = (accessory: Product) => {
    if (!selectedAccessories.some((a) => a.id === accessory.id)) {
      setSelectedAccessories([...selectedAccessories, accessory]);
    }
  };

  const handleRemoveAccessory = (accessoryId: string) => {
    setSelectedAccessories(selectedAccessories.filter((a) => a.id !== accessoryId));
  };

  // Main Action: Reset Outfit
  const handleResetOutfit = () => {
    setSelectedOutfit(null);
    setSelectedSize('');
    setSelectedAccessories([]);
    setSelectedOccasion('');
    setSelectedFor(null);
    setRentalDuration('');
  };

  // Compute Total Estimated Rental Price based on duration factor
  const durationFactor = DURATION_FACTORS[rentalDuration] || 1.0;
  const baseOutfitPrice = selectedOutfit
    ? Math.round(selectedOutfit.rentalPrice4Days * durationFactor)
    : 0;
  const accessoriesTotal = selectedAccessories.reduce((sum, item) => {
    return sum + Math.round(item.rentalPrice4Days * durationFactor);
  }, 0);
  const totalEstimatedPrice = baseOutfitPrice + accessoriesTotal;

  // Save My Look Action
  const handleSaveMyLook = () => {
    if (!selectedOutfit) return;
    setIsShareModalOpen(true);
  };

  // Add Complete Look to Bag
  const handleAddLookToBag = () => {
    if (!selectedOutfit) return;

    const items: CartItem[] = [
      {
        id: `builder-${selectedOutfit.id}-${Date.now()}-main`,
        product: selectedOutfit,
        selectedSize: selectedSize || selectedOutfit.sizes[0] || 'M',
        selectedColor: selectedOutfit.colors[0]?.name || 'Standard',
        rentalDurationDays: rentalDuration === '2 Days' ? 2 : rentalDuration === '7 Days' ? 7 : 4,
        itemTotal: baseOutfitPrice,
      },
    ];

    selectedAccessories.forEach((acc) => {
      items.push({
        id: `builder-${acc.id}-${Date.now()}-${Math.random()}`,
        product: acc,
        selectedSize: acc.sizes[0] || 'One Size',
        selectedColor: acc.colors[0]?.name || 'Standard',
        rentalDurationDays: rentalDuration === '2 Days' ? 2 : rentalDuration === '7 Days' ? 7 : 4,
        itemTotal: Math.round(acc.rentalPrice4Days * durationFactor),
      });
    });

    if (onAddBundleToCart) {
      onAddBundleToCart(items);
    } else if (onAddToCart) {
      items.forEach((item) => onAddToCart(item));
    }

    setToastMessage(`🎉 Saved and added complete ensemble (${items.length} items) to your rental bag!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <section id="builder" className="py-16 bg-[#FFFDFB] border-b border-[#C8A49F]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 pb-4 border-b border-[#C8A49F]/30 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEE4DA] border border-[#C8A49F]/40 text-[#4D0E13] text-xs font-semibold tracking-wider uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#C8A49F]" />
              <span>Interactive Wardrobe Styling</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2D1517] tracking-tight">
              RENTORA – Smart Outfit Builder
            </h2>
            <p className="text-xs sm:text-sm text-[#5e5460] mt-1 max-w-xl">
              Select an outfit to get matching accessories and rent the complete look.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSwapOutfit}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#C8A49F]/60 text-xs font-bold text-[#4D0E13] bg-white hover:bg-[#EEE4DA] transition-all cursor-pointer shadow-xs"
              title="Cycle to next outfit in catalogue"
            >
              <Repeat className="w-3.5 h-3.5 text-[#C8A49F]" />
              <span>Swap Outfit</span>
            </button>
            <button
              onClick={handleResetOutfit}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#C8A49F]/60 text-xs font-bold text-[#4D0E13] bg-white hover:bg-[#EEE4DA] transition-all cursor-pointer shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Outfit</span>
            </button>
          </div>
        </div>

        {/* 1. SELECTION OPTIONS BAR */}
        <div className="bg-[#FAF5F0] rounded-3xl p-5 sm:p-6 border border-[#C8A49F]/40 mb-10 shadow-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            
            {/* For Selection: Her / Him / Unisex with Smooth Animated Transition */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4D0E13] mb-2">
                1. For Preference
              </label>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-white rounded-2xl border border-[#C8A49F]/30 relative overflow-hidden">
                {(['her', 'him'] as const).map((gender) => (
                  <button
                    key={gender}
                    onClick={() => {
                      if (selectedFor !== gender) {
                        setSelectedFor(gender);
                      }
                    }}
                    className={`relative py-2 text-xs font-bold rounded-xl capitalize transition-all duration-300 ease-out cursor-pointer ${
                      selectedFor === gender
                        ? 'bg-[#4D0E13] text-white shadow-md scale-[1.02]'
                        : 'text-[#5e5460] hover:text-[#2D1517] hover:bg-[#EEE4DA]/50'
                    }`}
                  >
                    <span>{gender === 'her' ? 'Her 🎀' : 'Him 👔'}</span>
                  </button>
                ))}
              </div>
              {!selectedFor && (
                <p className="text-[9px] text-[#4D0E13] mt-1 font-semibold">Choose your preference to continue.</p>
              )}
            </div>

            {/* Occasion Selection */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4D0E13] mb-2">
                2. Occasion
              </label>
              <select
                value={selectedOccasion}
                onChange={(e) => setSelectedOccasion(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-2xl bg-white border border-[#C8A49F]/40 text-xs font-semibold text-[#2D1517] focus:outline-none focus:ring-1 focus:ring-[#4D0E13] cursor-pointer shadow-xs"
              >
                <option value="">All Occasions</option>
                <option value="Wedding">Wedding (Sangeet & Reception)</option>
                <option value="Party">Party (Galas & Birthdays)</option>
                <option value="Festive">Festive (Garba & Diwali)</option>
                <option value="Casual">Casual (Resorts & Brunches)</option>
                <option value="Traditional">Traditional (Royal Silk & Zari)</option>
              </select>
            </div>

            {/* Size (Only available in selected product data) */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4D0E13] mb-2">
                3. Size Available
              </label>
              <select
                disabled={!selectedOutfit}
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full py-2.5 px-3.5 rounded-2xl bg-white border border-[#C8A49F]/40 text-xs font-semibold text-[#2D1517] focus:outline-none focus:ring-1 focus:ring-[#4D0E13] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
              >
                {!selectedOutfit ? (
                  <option value="">Select an outfit first</option>
                ) : (
                  selectedOutfit.sizes.map((s) => (
                    <option key={s} value={s}>
                      Size {s} (In Stock)
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Rental Duration: 2 Days / 4 Days / 7 Days */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#4D0E13] mb-2">
                4. Rental Duration
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-white rounded-2xl border border-[#C8A49F]/30">
                {(['2 Days', '4 Days', '7 Days'] as const).map((duration) => (
                  <button
                    key={duration}
                    onClick={() => setRentalDuration(duration)}
                    className={`py-2 text-[11px] font-bold rounded-xl transition-all cursor-pointer ${
                      rentalDuration === duration
                        ? 'bg-[#4D0E13] text-white shadow-xs'
                        : 'text-[#5e5460] hover:text-[#2D1517] hover:bg-[#EEE4DA]/50'
                    }`}
                  >
                    {duration}
                  </button>
                ))}
              </div>
              {rentalDuration === '' && (
                <p className="text-[9px] text-[#4D0E13] mt-1 font-semibold">Choose duration to continue.</p>
              )}
            </div>

          </div>
        </div>

        {/* 2-COLUMN STYLING CANVAS: LIVE PREVIEW & MATCHING RECOMMENDATIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* LEFT: 3. LIVE OUTFIT PREVIEW & 4. FINAL SELECTION SUMMARY (5 cols) */}
          <div className="lg:col-span-5 bg-[#FAF5F0] rounded-3xl p-5 sm:p-6 border border-[#C8A49F]/40 shadow-md lg:sticky lg:top-24">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#C8A49F]/30">
              <span className="text-xs font-bold uppercase tracking-wider text-[#4D0E13] flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#C8A49F]" />
                <span>See Your Style Come Together</span>
              </span>
              <button
                onClick={handleSwapOutfit}
                className="text-[11px] font-bold text-[#4D0E13] underline hover:text-[#2D1517] cursor-pointer flex items-center gap-1"
              >
                <span>Swap Outfit</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            {/* Main Outfit Display with strictly fixed aspect ratio to eliminate layout shift */}
            <div className="relative aspect-[3/4] w-full max-w-sm mx-auto rounded-2xl overflow-hidden bg-white shadow-sm border border-[#C8A49F]/30 flex flex-col items-center justify-center p-3 mb-4 shrink-0 contain-paint">
              {selectedOutfit ? (
                <div key={selectedOutfit.id} className="relative w-full h-full flex flex-col items-center justify-center animate-fadeIn transition-opacity duration-300">
                  <img
                    src={getImage(`product-${selectedOutfit.id}`, selectedOutfit.images[0])}
                    alt={selectedOutfit.name}
                    className="w-full h-full object-contain"
                  />
                  <span className="absolute bottom-2.5 left-2.5 bg-[#4D0E13]/85 text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-full backdrop-blur-xs">
                    Main Outfit
                  </span>
                </div>
              ) : (
                <div key="no-outfit-placeholder" className="text-center p-6 flex flex-col items-center justify-center h-full text-[#5e5460]">
                  <div className="w-12 h-12 rounded-full bg-[#EEE4DA] flex items-center justify-center mb-2.5 text-[#4D0E13] border border-[#C8A49F]/30 shadow-xs">
                    <Layers className="w-5 h-5 text-[#C8A49F]" />
                  </div>
                  <h5 className="font-serif text-sm font-bold text-[#2D1517] mb-1">
                    No Outfit Selected
                  </h5>
                  <p className="text-[11px] text-[#5e5460] max-w-[190px] leading-relaxed">
                    Select an outfit to preview your look and accessories.
                  </p>
                </div>
              )}
            </div>

            {selectedOutfit && (
              <div className="text-center mb-4">
                <h4 className="font-serif text-base sm:text-lg font-bold text-[#2D1517]">
                  {selectedOutfit.name}
                </h4>
                <div className="flex items-center justify-center gap-2 mt-1 text-xs text-[#5e5460]">
                  <span>Size: <strong className="text-[#2D1517]">{selectedSize || selectedOutfit.sizes[0] || 'M'}</strong></span>
                  <span>•</span>
                  <span>{rentalDuration}</span>
                  <span>•</span>
                  <span className="text-[#4D0E13] font-bold font-mono">₹{baseOutfitPrice}</span>
                </div>
              </div>
            )}

            {/* Chosen Accessories in the Preview with stable layout height */}
            <div className="border-t border-[#C8A49F]/30 pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#4D0E13]">
                  Matched Suite ({selectedAccessories.length} items)
                </span>
                {selectedAccessories.length > 0 && (
                  <button
                    onClick={() => setSelectedAccessories([])}
                    className="text-[10px] text-[#5e5460] hover:text-[#4D0E13] underline cursor-pointer"
                  >
                    Clear Accessories
                  </button>
                )}
              </div>

              {selectedAccessories.length === 0 ? (
                <p className="text-[11px] text-[#5e5460] italic text-center py-3 bg-white/70 rounded-xl border border-dashed border-[#C8A49F]/40">
                  {selectedOutfit
                    ? 'No accessories added yet. Choose from recommendations below.'
                    : 'Select an outfit to view matching accessories.'}
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedAccessories.map((acc) => (
                    <div
                      key={acc.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-white border border-[#C8A49F]/30 shadow-2xs gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 shrink-0 p-1 flex items-center justify-center">
                          <img
                            src={getImage(`product-${acc.id}`, acc.images[0])}
                            alt={acc.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <div className="min-w-0">
                          <h5 className="text-xs font-semibold text-[#2D1517] truncate">
                            {acc.name}
                          </h5>
                          <span className="text-[10px] text-[#4D0E13] font-mono font-bold">
                            ₹{Math.round(acc.rentalPrice4Days * durationFactor)}
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemoveAccessory(acc.id)}
                        className="p-1.5 text-stone-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 4. FINAL SELECTION SUMMARY (Displayed Strictly Per Requirements) */}
            {selectedOutfit ? (
              <div className="mt-5 pt-4 border-t border-[#C8A49F]/40 bg-white rounded-2xl p-4 shadow-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4D0E13] block mb-2">
                  4. Final Selection Summary
                </span>
                
                <div className="space-y-1.5 text-xs text-[#2D1517]">
                  <div className="flex justify-between">
                    <span className="text-[#5e5460]">Selected Outfit:</span>
                    <strong className="text-right truncate ml-2 max-w-[180px]">{selectedOutfit.name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5e5460]">Selected Accessories:</span>
                    <span>{selectedAccessories.length} items</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5e5460]">Size:</span>
                    <strong>{selectedSize || selectedOutfit.sizes[0] || 'M'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5e5460]">Occasion:</span>
                    <strong>{selectedOccasion || 'Celebration & Festive'}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#5e5460]">Rental Duration:</span>
                    <strong>{rentalDuration}</strong>
                  </div>
                  <div className="pt-2 border-t border-[#C8A49F]/30 flex justify-between items-baseline font-bold">
                    <span className="text-[#4D0E13]">Total Estimated Price:</span>
                    <span className="font-serif text-lg text-[#4D0E13] font-mono">
                      ₹{totalEstimatedPrice.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Main Action Buttons */}
                <div className="mt-4 pt-3 border-t border-[#C8A49F]/20 flex flex-col gap-2">
                  <button
                    onClick={handleAddLookToBag}
                    className="w-full py-2.5 rounded-xl bg-[#4D0E13] text-white text-xs font-bold hover:bg-[#38090d] transition-all cursor-pointer shadow-md flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#C8A49F]" />
                    <span>Rent This Complete Look</span>
                  </button>

                  <button
                    onClick={handleSaveMyLook}
                    className="w-full py-2.5 rounded-xl border border-[#4D0E13] text-[#4D0E13] bg-white hover:bg-[#EEE4DA] text-xs font-bold transition-all cursor-pointer shadow-2xs flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-3.5 h-3.5 text-[#C8A49F]" />
                    <span>Save My Look</span>
                  </button>
                </div>

                <p className="text-[10px] text-[#5e5460]/70 text-center mt-2.5">
                  Academic prototype • Demo catalogue prices only.
                </p>
              </div>
            ) : (
              <div className="mt-5 pt-4 border-t border-[#C8A49F]/40 bg-white/70 rounded-2xl p-4 text-center border border-dashed border-[#C8A49F]/40">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#4D0E13] block mb-1">
                  4. Final Selection Summary
                </span>
                <p className="text-xs text-[#5e5460]">
                  Select an outfit from the catalogue to view your complete look summary and estimated rental price.
                </p>
              </div>
            )}

          </div>

          {/* RIGHT: OUTFIT SWITCHER & 2. MATCHING RECOMMENDATIONS (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Quick Outfit Selector Carousel */}
            <div className="bg-[#FAF5F0] rounded-3xl p-5 sm:p-6 border border-[#C8A49F]/40 shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[#C8A49F]/30">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4D0E13]">
                  Select & Change Outfit ({availableOutfits.length} Options)
                </span>
                <span className="text-[10px] text-[#5e5460]">Tap to preview</span>
              </div>

              <div
                key={selectedFor}
                className="flex gap-3 overflow-x-auto pb-2 scrollbar-none animate-fadeIn transition-opacity duration-300"
              >
                {availableOutfits.map((outfit) => {
                  const isCurSelected = selectedOutfit?.id === outfit.id;
                  const displayImg = getImage(`product-${outfit.id}`, outfit.images[0]);
                  return (
                    <div
                      key={outfit.id}
                      onClick={() => handleSelectOutfit(outfit)}
                      className={`w-28 sm:w-32 shrink-0 rounded-2xl overflow-hidden border p-2 bg-white cursor-pointer transition-all ${
                        isCurSelected
                          ? 'border-[#4D0E13] ring-2 ring-[#4D0E13] shadow-md scale-105'
                          : 'border-[#C8A49F]/40 hover:border-[#4D0E13]/50'
                      }`}
                    >
                      <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-neutral-100 flex items-center justify-center mb-1.5 p-1">
                        <img
                          src={displayImg}
                          alt={outfit.name}
                          className="w-full h-full object-contain"
                        />
                        {isCurSelected && (
                          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#4D0E13] text-white flex items-center justify-center text-[9px] font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                      <h5 className="font-serif text-[11px] font-bold text-[#2D1517] truncate">
                        {outfit.name}
                      </h5>
                      <span className="text-[10px] font-mono text-[#4D0E13] font-bold">
                        ₹{Math.round(outfit.rentalPrice4Days * durationFactor)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. MATCHING RECOMMENDATIONS */}
            {selectedOutfit ? (
              <div className="bg-[#FAF5F0] rounded-3xl p-5 sm:p-6 border border-[#C8A49F]/40 shadow-xs animate-fadeIn">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#C8A49F]/30">
                  <div>
                    <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2D1517]">
                      2. Matching Recommendations
                    </h3>
                    <p className="text-xs text-[#5e5460] mt-0.5">
                      Curated to match "{selectedOutfit.name}".
                    </p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#4D0E13] bg-white px-2.5 py-1 rounded-full border border-[#C8A49F]/40">
                    RÉNÉ Stylist Match
                  </span>
                </div>

                {/* Subcategory 1: Earrings (if not Men only) */}
                {selectedFor !== 'him' && (
                  <div className="mb-6">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#4D0E13] mb-3 flex items-center gap-1.5">
                      <span>✨ Matching Earrings</span>
                    </h4>
                    {recommendationsByCategory.earrings.length === 0 ? (
                      <p className="text-xs text-[#5e5460] italic py-2">No matching items found.</p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {recommendationsByCategory.earrings.map((item) => (
                          <AccessoryCard
                            key={item.id}
                            item={item}
                            durationFactor={durationFactor}
                            onAdd={() => handleAddAccessory(item)}
                            getImage={getImage}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Subcategory 2: Footwear */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#4D0E13] mb-3 flex items-center gap-1.5">
                    <span>👞 Matching Footwear</span>
                  </h4>
                  {recommendationsByCategory.footwear.length === 0 ? (
                    <p className="text-xs text-[#5e5460] italic py-2">No matching items found.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {recommendationsByCategory.footwear.map((item) => (
                        <AccessoryCard
                          key={item.id}
                          item={item}
                          durationFactor={durationFactor}
                          onAdd={() => handleAddAccessory(item)}
                          getImage={getImage}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Subcategory 3: Bags */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#4D0E13] mb-3 flex items-center gap-1.5">
                    <span>👜 Matching Bags</span>
                  </h4>
                  {recommendationsByCategory.bags.length === 0 ? (
                    <p className="text-xs text-[#5e5460] italic py-2">No matching items found.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {recommendationsByCategory.bags.map((item) => (
                        <AccessoryCard
                          key={item.id}
                          item={item}
                          durationFactor={durationFactor}
                          onAdd={() => handleAddAccessory(item)}
                          getImage={getImage}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Subcategory 4: Watches */}
                <div className="mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#4D0E13] mb-3 flex items-center gap-1.5">
                    <span>⌚ Matching Watches</span>
                  </h4>
                  {recommendationsByCategory.watches.length === 0 ? (
                    <p className="text-xs text-[#5e5460] italic py-2">No matching items found.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {recommendationsByCategory.watches.map((item) => (
                        <AccessoryCard
                          key={item.id}
                          item={item}
                          durationFactor={durationFactor}
                          onAdd={() => handleAddAccessory(item)}
                          getImage={getImage}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Subcategory 5: Other Relevant Accessories */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#4D0E13] mb-3 flex items-center gap-1.5">
                    <span>🎀 Other Relevant Accessories</span>
                  </h4>
                  {recommendationsByCategory.other.length === 0 ? (
                    <p className="text-xs text-[#5e5460] italic py-2">No matching items found.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {recommendationsByCategory.other.map((item) => (
                        <AccessoryCard
                          key={item.id}
                          item={item}
                          durationFactor={durationFactor}
                          onAdd={() => handleAddAccessory(item)}
                          getImage={getImage}
                        />
                      ))}
                    </div>
                  )}
                </div>

              </div>
            ) : (
              <div className="bg-[#FAF5F0] rounded-3xl p-8 sm:p-10 border border-[#C8A49F]/40 shadow-xs text-center">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center mx-auto mb-3.5 border border-[#C8A49F]/30 shadow-xs">
                  <Sparkles className="w-6 h-6 text-[#C8A49F]" />
                </div>
                <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2D1517] mb-1.5">
                  2. Matching Recommendations
                </h3>
                <p className="text-xs sm:text-sm text-[#5e5460] max-w-md mx-auto leading-relaxed">
                  {selectedFor 
                    ? 'Select an outfit above to unlock matching accessories.'
                    : 'Choose your preference and select an outfit to unlock matching accessories.'}
                </p>
              </div>
            )}

          </div>

        </div>

        {/* Share My Look Modal */}
        {selectedOutfit && (
          <ShareLookModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            data={{
              title: selectedOutfit.name,
              occasion: selectedOccasion || 'Celebration & Festive',
              product: selectedOutfit,
              accessories: selectedAccessories,
              size: selectedSize,
              rentalDuration,
              totalPrice: totalEstimatedPrice,
            }}
          />
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

interface AccessoryCardProps {
  item: Product;
  durationFactor: number;
  onAdd: () => void;
  getImage: (key: string, fallback: string) => string;
}

const AccessoryCard: React.FC<AccessoryCardProps> = ({ item, durationFactor, onAdd, getImage }) => {
  const displayImg = getImage(`product-${item.id}`, item.images[0]);
  const price = Math.round(item.rentalPrice4Days * durationFactor);

  return (
    <div className="bg-white rounded-2xl p-3 border border-[#C8A49F]/35 shadow-2xs hover:shadow-md hover:border-[#4D0E13]/50 transition-all flex flex-col justify-between">
      <div>
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-neutral-100 mb-2 flex items-center justify-center p-1.5">
          <img
            src={displayImg}
            alt={item.name}
            className="w-full h-full object-contain"
          />
        </div>
        <h5 className="font-serif text-xs font-bold text-[#2D1517] line-clamp-1">
          {item.name}
        </h5>
        <span className="text-[10px] text-[#5e5460] block truncate">
          {item.subCategory}
        </span>
      </div>

      <div className="pt-2 mt-2 border-t border-[#C8A49F]/20 flex items-center justify-between">
        <span className="font-mono text-xs font-bold text-[#4D0E13]">
          ₹{price}
        </span>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#4D0E13] text-white text-[10px] font-bold hover:bg-[#38090d] transition-all cursor-pointer shadow-xs"
        >
          <Plus className="w-3 h-3 text-[#C8A49F]" />
          <span>Add</span>
        </button>
      </div>
    </div>
  );
};
