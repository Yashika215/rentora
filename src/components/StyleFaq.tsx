import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, HelpCircle, ShieldCheck, RefreshCw, Ruler, Gift, Truck } from 'lucide-react';

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  icon: React.ReactNode;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'rental-periods',
    category: 'Rental Periods',
    question: 'How do rental periods work? Can I extend my rental duration?',
    answer: 'Rentals are available for flexible 2, 4, or 7 days. The 4-day standard rental is our most popular choice, giving you 1 day before your event for prep, event day, and easy return on day 4. Need more time? You can easily request a 3-day extension directly from your account before your return date.',
    icon: <RefreshCw className="w-4 h-4 text-[#C8A49F]" />,
  },
  {
    id: 'cleaning',
    category: 'Garment Cleaning',
    question: 'Do I need to dry-clean the garments before returning them?',
    answer: 'Never! Eco dry-cleaning and professional UV-sanitization are completely included with every RENTORA rental at no extra charge. Simply pack the outfit back into its luxury garment bag after your celebration, and our doorstep pickup courier will handle the rest.',
    icon: <ShieldCheck className="w-4 h-4 text-[#C8A49F]" />,
  },
  {
    id: 'fitting',
    category: 'Size & Fit',
    question: 'What if the outfit does not fit perfectly when it arrives?',
    answer: 'Our designer outfits are crafted with clever inner seam margins for easy custom adjustments. Furthermore, every order comes with our RÉNÉ Fit Guarantee—if you need a different size, our express Gujarat delivery hub will dispatch a replacement size immediately.',
    icon: <Ruler className="w-4 h-4 text-[#C8A49F]" />,
  },
  {
    id: 'delivery',
    category: 'Delivery & Gujarat Hubs',
    question: 'Which locations in Gujarat are covered for express delivery?',
    answer: 'We provide guaranteed express doorstep delivery and pickup across all 22 major Gujarat hubs including Ahmedabad, Surat, Vadodara, Rajkot, Gandhinagar, Bhavnagar, Jamnagar, and more. Same-day dispatch is available for orders placed before 2 PM.',
    icon: <Truck className="w-4 h-4 text-[#C8A49F]" />,
  },
  {
    id: 'free-gift',
    category: 'Promotions & Gifts',
    question: 'How do I claim the free keepsake jewelry gift on orders above ₹3,000?',
    answer: 'When your cart subtotal reaches ₹3,000 or more, RENTORA automatically includes a complimentary luxury keepsake jewelry set (such as our Baroque Pearl Choker or Kundan Drops) worth up to ₹1,299 at ₹0. It is yours to keep forever!',
    icon: <Gift className="w-4 h-4 text-[#C8A49F]" />,
  },
  {
    id: 'returns',
    category: 'Returns & Pickup',
    question: 'How does the return pickup process work?',
    answer: 'On your scheduled return date, our delivery partner will arrive at your doorstep for a contactless pickup. Just place the item back in its original RENTORA garment box or bag with all included tags and accessories.',
    icon: <Sparkles className="w-4 h-4 text-[#C8A49F]" />,
  },
];

export const StyleFaq: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('rental-periods');
  const [activeTab, setActiveTab] = useState<string>('all');

  const categories = ['all', 'Rental Periods', 'Garment Cleaning', 'Size & Fit', 'Delivery & Gujarat Hubs', 'Promotions & Gifts'];

  const filteredFaqs = activeTab === 'all' 
    ? FAQ_ITEMS 
    : FAQ_ITEMS.filter((item) => item.category === activeTab);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="style-faq" className="py-20 bg-gradient-to-b from-[#EEE4DA] via-[#FAF5F0] to-[#EEE4DA] border-t border-b border-[#C8A49F]/30 relative overflow-hidden">
      
      {/* Decorative ambient background blur */}
      <div className="absolute top-10 left-10 w-80 h-80 bg-[#C8A49F]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#C7B7D4]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8A49F]/20 text-[#4D0E13] text-xs font-semibold uppercase tracking-wider mb-3 border border-[#C8A49F]/40 shadow-2xs">
            <HelpCircle className="w-3.5 h-3.5 text-[#4D0E13]" />
            <span>RENTORA Confidence Guide</span>
          </div>
          
          <h2 className="font-serif text-3xl sm:text-4xl text-[#2D1517] tracking-tight mb-3">
            Style FAQ & Rental Guide <span className="text-[#C8A49F]">✨</span>
          </h2>
          
          <p className="text-sm text-[#5e5460] leading-relaxed">
            Everything you need to know about our luxury rental periods, eco-cleaning, size fitting, and doorstep delivery across Gujarat.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map((cat) => {
            const isActive = activeTab === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#4D0E13] text-white shadow-md'
                    : 'bg-white text-[#5e5460] hover:text-[#4D0E13] border border-[#C8A49F]/40 hover:border-[#4D0E13]'
                }`}
              >
                {cat === 'all' ? 'All Questions ✨' : cat}
              </button>
            );
          })}
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5 max-w-3xl mx-auto">
          {filteredFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl transition-all duration-300 border bg-white overflow-hidden shadow-xs ${
                  isOpen 
                    ? 'border-[#4D0E13] ring-1 ring-[#4D0E13]/20 shadow-md' 
                    : 'border-[#C8A49F]/35 hover:border-[#4D0E13]/50 hover:shadow-sm'
                }`}
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-5 sm:px-6 py-4.5 flex items-center justify-between text-left cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3.5 pr-4">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isOpen ? 'bg-[#4D0E13] text-white' : 'bg-[#EEE4DA] text-[#4D0E13]'
                    }`}>
                      {faq.icon}
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A49F] block mb-0.5">
                        {faq.category}
                      </span>
                      <h3 className="font-serif text-sm sm:text-base font-bold text-[#2D1517]">
                        {faq.question}
                      </h3>
                    </div>
                  </div>

                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                    isOpen ? 'bg-[#4D0E13] text-white rotate-180' : 'bg-[#EEE4DA] text-[#4D0E13]'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-[#5e5460] leading-relaxed border-t border-[#EEE4DA] animate-fadeIn bg-gradient-to-b from-[#FAF5F0]/50 to-white">
                    <p>{faq.answer}</p>
                    
                    <div className="mt-3.5 pt-3 border-t border-[#C8A49F]/20 flex items-center justify-between text-[11px] text-[#4D0E13] font-semibold">
                      <span className="inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-[#C8A49F]" />
                        <span>Guaranteed by RÉNÉ Concierge</span>
                      </span>
                      <span className="text-[#5e5460] font-normal">Need assistance? Chat with RÉNÉ 24/7</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom Support Callout */}
        <div className="mt-12 p-6 rounded-3xl bg-white border border-[#C8A49F]/40 shadow-md text-center max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h3 className="font-serif font-bold text-base text-[#2D1517]">Still have questions about your outfit?</h3>
            <p className="text-xs text-[#5e5460] mt-0.5">RÉNÉ is online right now to help you pick the right size and color.</p>
          </div>
          
          <button
            onClick={() => {
              const chatBtn = document.querySelector('[aria-label="Open RÉNÉ Personal Stylist Chat"]') as HTMLButtonElement;
              if (chatBtn) chatBtn.click();
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#4D0E13] text-white font-bold text-xs hover:bg-[#38090D] shadow-md hover:shadow-lg transition-all cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#C8A49F]" />
            <span>Ask RÉNÉ Now ✨</span>
          </button>
        </div>

      </div>
    </section>
  );
};
