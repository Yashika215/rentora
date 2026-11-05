import React from 'react';
import { Product } from '../data/catalog';
import { CartItem } from '../types';
import { X, Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useImageManager } from '../context/ImageManagerContext';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistItems: Product[];
  onRemoveWishlist: (product: Product) => void;
  onAddToCart: (item: CartItem) => void;
  onOpenProductDetail: (product: Product) => void;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  wishlistItems,
  onRemoveWishlist,
  onAddToCart,
  onOpenProductDetail,
}) => {
  const { getImage } = useImageManager();
  if (!isOpen) return null;

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
              <Heart className="w-4 h-4 fill-[#C8A49F] text-[#C8A49F]" />
            </div>
            <div>
              <h2 className="font-serif text-lg font-bold text-[#2D1517]">
                Saved Favorites
              </h2>
              <span className="text-[11px] text-[#5e5460]">
                {wishlistItems.length} {wishlistItems.length === 1 ? 'outfit' : 'outfits'} saved
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

        {/* Content list */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4">
          {wishlistItems.length > 0 ? (
            wishlistItems.map((product) => (
              <div
                key={product.id}
                className="p-3.5 rounded-2xl bg-[#EEE4DA] border border-[#C8A49F]/30 flex gap-3 relative group"
              >
                <img
                  src={getImage(`product-${product.id}`, product.images[0])}
                  alt={product.name}
                  onClick={() => {
                    onClose();
                    onOpenProductDetail(product);
                  }}
                  className="w-20 h-20 rounded-xl object-contain p-1 bg-white shrink-0 border border-[#C8A49F]/20 cursor-pointer"
                />

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] text-[#5e5460] uppercase tracking-wider block">
                      {product.brand}
                    </span>
                    <h4
                      onClick={() => {
                        onClose();
                        onOpenProductDetail(product);
                      }}
                      className="font-serif text-sm font-bold text-[#2D1517] truncate cursor-pointer hover:text-[#4D0E13]"
                    >
                      {product.name}
                    </h4>
                    <span className="font-serif text-xs font-bold text-[#4D0E13] font-mono tabular-nums block mt-0.5">
                      ₹{product.rentalPrice4Days.toLocaleString()} / 4 days
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#C8A49F]/20">
                    <button
                      onClick={() => {
                        onAddToCart({
                          id: `${product.id}-${Date.now()}`,
                          product,
                          selectedSize: product.sizes[0] || 'M',
                          selectedColor: product.colors[0]?.name || 'Standard',
                          rentalDurationDays: 4,
                          itemTotal: product.rentalPrice4Days,
                        });
                        onRemoveWishlist(product);
                      }}
                      className="flex-1 py-1.5 px-3 rounded-lg bg-[#4D0E13] text-white text-[11px] font-semibold hover:bg-[#3b172b] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-3 h-3 text-[#C8A49F]" />
                      <span>Move to Bag</span>
                    </button>

                    <button
                      onClick={() => onRemoveWishlist(product)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <span className="text-4xl block mb-2">💗</span>
              <h3 className="font-serif text-base font-bold text-[#2D1517]">
                Your wishlist is waiting
              </h3>
              <p className="text-xs text-[#5e5460] mt-1 max-w-xs mx-auto">
                Tap the heart on any lehenga, suit, or accessory to save it for your next event!
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 bg-[#EEE4DA] border-t border-[#C8A49F]/30">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full border border-[#4D0E13] text-[#4D0E13] text-xs font-semibold hover:bg-white transition-colors cursor-pointer"
          >
            Continue Browsing
          </button>
        </div>

      </div>
    </div>
  );
};
