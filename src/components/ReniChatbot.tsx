import React, { useState, useRef, useEffect } from 'react';
import { PRODUCTS, Product } from '../data/catalog';
import { CartItem } from '../types';
import { useImageManager } from '../context/ImageManagerContext';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { processStylistQuery, UserContext, generateProductStylingNote } from '../utils/reniStylistEngine';
import { 
  Sparkles, 
  Send, 
  X, 
  Bot, 
  Heart, 
  ShoppingBag, 
  Eye, 
  ArrowRight, 
  RefreshCw, 
  Wand2,
  Check,
  Tag,
  Ruler
} from 'lucide-react';
import reniAvatar from '../assets/images/reni_avatar_new_1792982285301.jpg';

interface ChatMessage {
  id: string;
  sender: 'user' | 'reni';
  text: string;
  timestamp: string;
  recommendedProducts?: Product[];
  matchRationales?: Record<string, string>;
}

interface ReniChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onAddToCart: (item: CartItem, silent?: boolean) => void;
  onOpenProductDetail: (product: Product) => void;
  onOpenOutfitBuilder: () => void;
  userOccasion?: string | null;
  userAesthetics?: string[];
}

export const ReniChatbot: React.FC<ReniChatbotProps> = ({
  isOpen,
  onClose,
  onOpen,
  onAddToCart,
  onOpenProductDetail,
  onOpenOutfitBuilder,
  userOccasion,
  userAesthetics = [],
}) => {
  const { getImage } = useImageManager();
  const { notifyUser } = useNotifications();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'reni',
      text: "Hello! I am RÉNÉ, your personal fashion stylist at RENTORA. How may I assist with your styling or occasion requirements today?",
      timestamp: 'Just now',
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userContext, setUserContext] = useState<UserContext>({
    lastOccasion: userOccasion || undefined,
  });
  const [addedMap, setAddedMap] = useState<Record<string, boolean>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const defaultQuickActions = [
    { label: 'Style a Celebration Look ✨', query: "Help me style an outfit for an upcoming celebration." },
    { label: 'Wedding Guest Attire 💍', query: "Suggest a wedding guest look with matching accessories." },
    { label: 'Black-Tie & Evening Wear 🍸', query: "Recommend formalwear for a black-tie gala." },
    { label: 'Earrings Under ₹500 💎', query: "Show me earrings under ₹500 from the collection." },
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleQuickAdd = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(
      {
        id: `${product.id}-${Date.now()}`,
        product,
        selectedSize: product.sizes[0] || 'M',
        selectedColor: product.colors[0]?.name || 'Standard',
        rentalDurationDays: 4,
        itemTotal: product.rentalPrice4Days,
      },
      true // silent: true to prevent notifications when clicking recommendations in chatbot
    );
    setAddedMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedMap((prev) => ({ ...prev, [product.id]: false }));
    }, 1800);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text || isTyping) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    // 1. Process query with RÉNÉ Stylist Engine for exact catalog grounding & multi-turn context
    const historyPayload = messages.map((m) => ({ sender: m.sender, text: m.text }));
    const engineResult = processStylistQuery(text, historyPayload, userContext);
    
    // Update multi-turn context
    setUserContext(engineResult.updatedContext);

    let finalReply = engineResult.reply;

    // 2. If exact match was found, use engine result directly for 100% catalogue precision
    const isNoMatchOrClarification =
      engineResult.reply.includes("No matching products found") ||
      engineResult.reply.includes("I couldn't find an exact match") ||
      engineResult.reply.includes("I would be glad to style you") ||
      engineResult.reply.includes("Hello! I am RÉNÉ") ||
      engineResult.products.length > 0;

    if (!isNoMatchOrClarification) {
      try {
        const response = await fetch('/api/reni/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: text,
            history: historyPayload.slice(-6),
            userPreferences: {
              occasion: engineResult.updatedContext.lastOccasion || userOccasion,
              aesthetic: userAesthetics.join(', '),
              color: engineResult.updatedContext.lastColor,
              budget: engineResult.updatedContext.budgetCap,
              gender: engineResult.updatedContext.genderPreference,
              requestedCount: engineResult.updatedContext.requestedCount,
              matchedProductNames: engineResult.products.map((p) => p.name),
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Ensure external reply does not introduce prohibited slang or contradict catalog
          if (
            data.reply &&
            data.reply.length > 20 &&
            !data.reply.toLowerCase().includes('bestie') &&
            !data.reply.toLowerCase().includes('slay')
          ) {
            finalReply = data.reply;
          }
        }
      } catch (err) {
        console.log('[RÉNÉ Client] Using authoritative engine response:', err);
      }
    }

    const reniMsg: ChatMessage = {
      id: `reni-${Date.now()}`,
      sender: 'reni',
      text: finalReply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      recommendedProducts: engineResult.products,
      matchRationales: engineResult.matchRationale,
    };

    setMessages((prev) => [...prev, reniMsg]);
    setIsTyping(false);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2.5 sm:gap-3">
          <div className="hidden sm:flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-[#C8A49F]/60 text-[#4D0E13] px-3.5 py-1.5 rounded-full shadow-lg text-xs font-semibold animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-[#C6A77D]" />
            <span>Ask RÉNÉ Stylist ✨</span>
            <span className="text-[10px] text-[#C8A49F]">● Online</span>
          </div>

          <button
            onClick={onOpen}
            aria-label="Open RÉNÉ Personal Stylist Chat"
            className="group relative w-13 h-13 sm:w-16 sm:h-16 rounded-full overflow-hidden p-0.5 bg-[#4D0E13] shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <div className="w-full h-full rounded-full overflow-hidden relative bg-white">
              <img
                src={reniAvatar}
                alt="RÉNÉ — Your RENTORA Personal AI Stylist"
                className="w-full h-full object-cover object-top"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border border-[#C8A49F] flex items-center justify-center text-[10px] sm:text-xs shadow-md">
              🎀
            </div>
          </button>
        </div>
      )}

      {/* Floating Chat Window */}
      {isOpen && (
        <div className="fixed bottom-2.5 sm:bottom-6 right-2.5 sm:right-6 z-50 w-[calc(100vw-20px)] sm:w-[440px] h-[540px] sm:h-[620px] max-h-[88vh] bg-white rounded-3xl shadow-2xl border border-[#C8A49F]/40 flex flex-col overflow-hidden animate-scaleUp">
          
          {/* Header */}
          <div className="p-4 bg-[#4D0E13] text-white flex items-center justify-between border-b border-[#C8A49F]/20">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#C8A49F] shrink-0">
                <img
                  src={reniAvatar}
                  alt="RÉNÉ"
                  className="w-full h-full object-cover object-top"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-[#4D0E13]" />
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif text-base font-bold text-white">
                    RÉNÉ
                  </h3>
                  <span className="text-xs">💕</span>
                  <span className="text-[10px] bg-[#C8A49F]/25 text-[#C8A49F] px-2 py-0.5 rounded-full font-semibold">
                    AI Personal Stylist
                  </span>
                </div>
                <p className="text-[11px] text-[#EEE4DA]/80">
                  Your Style, Curated by RÉNÉ.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onOpenOutfitBuilder}
                title="Open AI Outfit Builder"
                className="p-1.5 rounded-full hover:bg-white/10 text-[#C8A49F] transition-colors cursor-pointer"
              >
                <Wand2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                aria-label="Close Chat"
                className="p-1.5 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Action Suggestions Chips Bar */}
          <div className="p-2.5 bg-[#EEE4DA] border-b border-[#C8A49F]/25 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            {defaultQuickActions.map((qa, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(qa.query)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white text-[#4D0E13] border border-[#C8A49F]/40 hover:bg-[#C8A49F]/20 transition-colors shrink-0 shadow-xs cursor-pointer"
              >
                {qa.label}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-4 bg-[#EEE4DA]/30">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[90%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#4D0E13] text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-[#2D1517] rounded-bl-xs border border-[#C8A49F]/30 shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  
                  {/* Exact Product Cards from RENTORA Catalog */}
                  {msg.recommendedProducts && msg.recommendedProducts.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#C8A49F]/20 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#4D0E13] uppercase tracking-wider flex items-center gap-1">
                          <Tag className="w-3 h-3 text-[#C8A49F]" />
                          Exact Matches from RENTORA Collection:
                        </span>
                        <span className="text-[9px] text-[#5e5460]">
                          {msg.recommendedProducts.length} items
                        </span>
                      </div>

                      <div className="space-y-2">
                        {msg.recommendedProducts.map((prod) => {
                          const displayImg = getImage(`product-${prod.id}`, prod.images[0]);
                          const isItemAdded = addedMap[prod.id];
                          const rationale = msg.matchRationales?.[prod.id];

                          return (
                            <div
                              key={prod.id}
                              className="p-2.5 rounded-2xl bg-[#FFF6F0] border border-[#C8A49F]/40 hover:border-[#4D0E13] transition-all flex flex-col gap-2 shadow-xs group"
                            >
                              <div className="flex items-center gap-2.5">
                                {/* Dynamic Product Image with cover fit */}
                                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden bg-white shrink-0 border border-gray-200 relative">
                                  <img
                                    src={displayImg}
                                    alt={prod.name}
                                    className="w-full h-full object-contain p-0.5 group-hover:scale-[1.02] transition-transform"
                                  />
                                </div>

                                {/* Details */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between mb-0.5">
                                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#4D0E13] bg-[#C8A49F]/20 px-1.5 py-0.5 rounded">
                                      {prod.subCategory}
                                    </span>
                                    <span className="text-[10px] font-mono font-bold text-[#4D0E13]">
                                      ₹{prod.rentalPrice4Days} / 4d
                                    </span>
                                  </div>

                                  <h5 className="text-xs font-bold text-[#2D1517] truncate font-serif" title={prod.name}>
                                    {prod.name}
                                  </h5>

                                  <div className="flex items-center gap-2 text-[10px] text-gray-500 mt-0.5">
                                    <span className="flex items-center gap-0.5">
                                      <Ruler className="w-2.5 h-2.5 text-[#C8A49F]" />
                                      {prod.sizes[0] || 'Standard'}
                                    </span>
                                    <span>·</span>
                                    <span>{prod.colors[0]?.name || 'Classic'}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Match Rationale Explanation */}
                              {rationale && (
                                <p className="text-[10px] text-[#5e5460] bg-white p-1.5 rounded-lg border border-[#C8A49F]/20 leading-tight">
                                  💡 <span className="font-semibold text-[#4D0E13]">Why RÉNÉ selected this:</span> {rationale}
                                </p>
                              )}

                              {/* Tailored Product Styling Tip */}
                              <div className="text-[10px] text-[#4D0E13] bg-white p-1.5 rounded-lg border border-[#C8A49F]/25 leading-tight flex items-start gap-1">
                                <span className="font-bold shrink-0">✨ Styling Tip:</span>
                                <span className="text-[#2D1517]">{generateProductStylingNote(prod).stylingTip}</span>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center justify-end gap-1.5 pt-1 border-t border-[#C8A49F]/15">
                                <button
                                  onClick={(e) => handleQuickAdd(prod, e)}
                                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                                    isItemAdded
                                      ? 'bg-emerald-700 text-white'
                                      : 'bg-[#4D0E13] text-white hover:bg-[#3b172b]'
                                  }`}
                                >
                                  {isItemAdded ? (
                                    <>
                                      <Check className="w-3 h-3" />
                                      <span>Reserved!</span>
                                    </>
                                  ) : (
                                    <>
                                      <ShoppingBag className="w-3 h-3 text-[#C8A49F]" />
                                      <span>Reserve</span>
                                    </>
                                  )}
                                </button>

                                <button
                                  onClick={() => {
                                    onOpenProductDetail(prod);
                                  }}
                                  className="text-[10px] font-bold text-[#4D0E13] bg-white border border-[#C8A49F] hover:bg-[#C8A49F]/20 px-2.5 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <Eye className="w-3 h-3 text-[#4D0E13]" />
                                  <span>View Product</span>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <span
                    className={`text-[9px] mt-1.5 block text-right ${
                      msg.sender === 'user' ? 'text-[#EEE4DA]/70' : 'text-[#5e5460]'
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-[#5e5460] bg-white px-3.5 py-2 rounded-2xl w-fit border border-[#C8A49F]/30 shadow-xs">
                <span className="animate-spin text-[#C8A49F]">✨</span>
                <span>RÉNÉ is checking RENTORA's closet...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Follow-up Refinement Chips Bar */}
          {userContext.lastOutfitId || userContext.lastColor || userContext.lastOccasion ? (
            <div className="px-3 py-1.5 bg-[#FFF6F0] border-t border-[#C8A49F]/30 flex items-center gap-1.5 overflow-x-auto text-[10px] scrollbar-none">
              <span className="font-bold text-[#4D0E13] shrink-0">Refine:</span>
              <button
                onClick={() => handleSendMessage("Show me another colour option")}
                className="bg-white text-[#4D0E13] px-2.5 py-0.5 rounded-full border border-[#C8A49F]/40 hover:bg-[#C8A49F]/20 cursor-pointer shrink-0 font-medium"
              >
                🎨 Another Colour
              </button>
              <button
                onClick={() => handleSendMessage("Show me more affordable options")}
                className="bg-white text-[#4D0E13] px-2.5 py-0.5 rounded-full border border-[#C8A49F]/40 hover:bg-[#C8A49F]/20 cursor-pointer shrink-0 font-medium"
              >
                💸 Lower Price
              </button>
              <button
                onClick={() => handleSendMessage("Suggest matching earrings or jewellery")}
                className="bg-white text-[#4D0E13] px-2.5 py-0.5 rounded-full border border-[#C8A49F]/40 hover:bg-[#C8A49F]/20 cursor-pointer shrink-0 font-medium"
              >
                💎 Matching Jewellery
              </button>
              <button
                onClick={() => handleSendMessage("Suggest matching footwear for this look")}
                className="bg-white text-[#4D0E13] px-2.5 py-0.5 rounded-full border border-[#C8A49F]/40 hover:bg-[#C8A49F]/20 cursor-pointer shrink-0 font-medium"
              >
                👠 Matching Shoes
              </button>
              <button
                onClick={() => handleSendMessage("Show me a matching clutch or handbag")}
                className="bg-white text-[#4D0E13] px-2.5 py-0.5 rounded-full border border-[#C8A49F]/40 hover:bg-[#C8A49F]/20 cursor-pointer shrink-0 font-medium"
              >
                👛 Matching Bag
              </button>
            </div>
          ) : null}

          {/* Chat Input Bar */}
          <div className="p-3 bg-white border-t border-[#C8A49F]/30">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask RÉNÉ: 'Earrings for pink lehenga under ₹800'..."
                className="flex-1 text-xs bg-[#EEE4DA] border border-[#C8A49F]/50 rounded-full px-4 py-2.5 text-[#2D1517] placeholder-[#5e5460]/70 focus:outline-none focus:ring-1 focus:ring-[#4D0E13]"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="w-9 h-9 rounded-full bg-[#4D0E13] text-white flex items-center justify-center hover:bg-[#3b172b] disabled:opacity-40 transition-colors cursor-pointer shrink-0 shadow-sm"
              >
                <Send className="w-4 h-4 text-[#C8A49F]" />
              </button>
            </form>
          </div>

        </div>
      )}
    </>
  );
};
