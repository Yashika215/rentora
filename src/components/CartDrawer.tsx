import React from 'react';
import { CartItem } from '../types';
import { FREE_GIFT_PROMOTION } from '../data/catalog';
import { X, Trash2, Gift, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useImageManager } from '../context/ImageManagerContext';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateDuration: (id: string, days: number) => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onUpdateDuration,
  onProceedToCheckout,
}) => {
  const { location, cityAvailability, setIsSelectorOpen } = useLocation();
  const { getImage } = useImageManager();
  if (!isOpen) return null;

  // Merchandise subtotal
  const merchandiseSubtotal = cartItems.reduce((sum, item) => sum + item.itemTotal, 0);
  
  // Refundable security deposits total
  const refundableDepositTotal = cartItems.reduce((sum, item) => sum + item.product.deposit, 0);

  // Free gift qualification
  const qualifiesForGift = merchandiseSubtotal >= FREE_GIFT_PROMOTION.thresholdAmount;
  const remainingForGift = Math.max(0, FREE_GIFT_PROMOTION.thresholdAmount - merchandiseSubtotal);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-slideLeft border-l border-[#C8A49F]/30"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 bg-[#EEE4DA] border-b border-[#C8A49F]/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#4D0E13] text-white flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-[#C8A49F]" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#2D1517]">
                Your Rental Bag
              </h2>
              <span className="text-[11px] text-[#5e5460]">
                {cartItems.length} {cartItems.length === 1 ? 'piece' : 'pieces'} selected
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white text-[#2D1517] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Gift Promo Progress Indicator */}
        <div className="p-4 bg-gradient-to-r from-[#EEE4DA] via-[#E4D8CC] to-[#EEE4DA] border-b border-[#C8A49F]/30">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-[#4D0E13] flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-[#C8A49F]" />
              {qualifiesForGift ? (
                <span className="text-emerald-700 font-bold">
                  🎉 FREE Surprise Jewelry Gift Unlocked! 🎀
                </span>
              ) : (
                <span>
                  You're ₹{remainingForGift.toLocaleString()} away from your FREE gift!
                </span>
              )}
            </span>
            <span className="font-mono text-[10px] text-[#5e5460]">
              ₹{merchandiseSubtotal} / ₹{FREE_GIFT_PROMOTION.thresholdAmount}
            </span>
          </div>

          <div className="w-full bg-white h-2 rounded-full overflow-hidden border border-[#C8A49F]/30">
            <div
              className="bg-[#4D0E13] h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (merchandiseSubtotal / FREE_GIFT_PROMOTION.thresholdAmount) * 100)}%`,
              }}
            />
          </div>

          {/* Local City Delivery Guarantee */}
          <div className="mt-2.5 pt-2 border-t border-[#C8A49F]/20 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-[#4D0E13] font-semibold truncate">
              <Truck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>Deliver to {location?.city || 'Gujarat'}: {cityAvailability?.deliverySpeed ? cityAvailability.deliverySpeed.split('(')[0] : 'Express 24h'}</span>
            </span>
            <button
              onClick={() => setIsSelectorOpen(true)}
              className="text-[10px] text-[#4D0E13] underline font-bold shrink-0 hover:text-[#2D1517] cursor-pointer"
            >
              Change
            </button>
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {cartItems.length > 0 ? (
            <>
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-[#EEE4DA] border border-[#C8A49F]/30 flex gap-3 relative group"
                >
                  <img
                    src={getImage(`product-${item.product.id}`, item.product.images[0])}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-contain p-1 bg-white shrink-0 border border-[#C8A49F]/20"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm font-bold text-[#2D1517] truncate">
                      {item.product.name}
                    </h4>

                    <div className="text-[11px] text-[#5e5460] mt-0.5 space-x-2">
                      <span>Size: <strong>{item.selectedSize}</strong></span>
                      <span>·</span>
                      <span>Color: <strong>{item.selectedColor}</strong></span>
                    </div>

                    {/* Rental Duration Options */}
                    <div className="mt-2 flex items-center gap-1.5 text-[10px]">
                      <span className="text-[#5e5460]">Plan:</span>
                      {[3, 4, 7].map((days) => (
                        <button
                          key={days}
                          onClick={() => onUpdateDuration(item.id, days)}
                          className={`px-2 py-0.5 rounded-md font-semibold border transition-colors cursor-pointer ${
                            item.rentalDurationDays === days
                              ? 'bg-[#4D0E13] text-white border-[#4D0E13]'
                              : 'bg-white text-[#5e5460] border-gray-200'
                          }`}
                        >
                          {days}D
                        </button>
                      ))}
                    </div>

                    <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-[#C8A49F]/20">
                      <div>
                        <span className="font-serif text-sm font-bold text-[#4D0E13] font-mono tabular-nums">
                          ₹{item.itemTotal.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-[#5e5460] ml-1">
                          (+₹{item.product.deposit} dep.)
                        </span>
                      </div>

                      <button
                        onClick={() => onRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-600 transition-colors p-1"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Free Gift Line Item if Eligible */}
              {qualifiesForGift && (
                <div className="p-3.5 rounded-2xl bg-[#f7e6ee] border border-[#4D0E13]/30 flex items-center gap-3">
                  <img
                    src={FREE_GIFT_PROMOTION.giftImage}
                    alt="Free Gift"
                    className="w-14 h-14 rounded-xl object-contain p-1 bg-white shrink-0 border border-[#C8A49F]"
                  />
                  <div className="flex-1">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-[#4D0E13] bg-[#C8A49F]/40 px-2 py-0.5 rounded-full">
                      Free Surprise Gift 🎀
                    </span>
                    <h5 className="font-serif text-xs font-bold text-[#2D1517] mt-1">
                      {FREE_GIFT_PROMOTION.giftName}
                    </h5>
                    <div className="flex items-center gap-2 mt-0.5 text-xs">
                      <span className="text-emerald-700 font-bold font-mono">₹0 (FREE)</span>
                      <span className="text-[10px] text-gray-400 line-through">₹{FREE_GIFT_PROMOTION.giftValue}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <span className="text-4xl block mb-2">🎀</span>
              <h3 className="font-serif text-base font-bold text-[#2D1517]">
                Your rental bag is empty
              </h3>
              <p className="text-xs text-[#5e5460] mt-1">
                Explore our collections or ask RÉNÉ to build your dream look!
              </p>
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout Button */}
        {cartItems.length > 0 && (
          <div className="p-5 bg-[#EEE4DA] border-t border-[#C8A49F]/30 space-y-3">
            <div className="space-y-1.5 text-xs text-[#5e5460]">
              <div className="flex justify-between">
                <span>Merchandise Rental</span>
                <span className="font-mono text-[#2D1517] font-semibold tabular-nums">
                  ₹{merchandiseSubtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Refundable Security Deposit</span>
                <span className="font-mono text-[#2D1517] tabular-nums">
                  ₹{refundableDepositTotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span>Doorstep Insured Delivery</span>
                <span className="font-semibold">FREE</span>
              </div>
              {qualifiesForGift && (
                <div className="flex justify-between text-[#4D0E13] font-medium">
                  <span>Keepsake Gift</span>
                  <span className="text-emerald-700 font-semibold">₹0 (UNLOCKED 🎀)</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#C8A49F]/20 flex justify-between text-sm font-bold text-[#4D0E13]">
                <span>Total Payable Now</span>
                <span className="font-serif text-lg font-mono tabular-nums">
                  ₹{(merchandiseSubtotal + refundableDepositTotal).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-1 flex items-center gap-1.5 text-[10px] text-[#5e5460]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Full deposit refunded to original payment method within 24 hours of return.</span>
            </div>

            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 px-6 rounded-full bg-[#4D0E13] text-white font-semibold text-xs hover:bg-[#3b172b] transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <span>Proceed to Rental Checkout</span>
              <ArrowRight className="w-4 h-4 text-[#C8A49F]" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
