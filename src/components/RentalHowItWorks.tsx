import React from 'react';
import { Sparkles, Calendar, CheckCircle, Truck, HeartHandshake, RotateCcw } from 'lucide-react';

export const RentalHowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Discover Your Look',
      desc: 'Browse by occasion, aesthetic, or let RÉNÉ curate your custom head-to-toe look.',
      icon: Sparkles,
    },
    {
      num: '02',
      title: 'Choose Size & Dates',
      desc: 'Pick your size (XS-XL) and 3, 4, or 7 rental days. Arrives 1-2 days before your event.',
      icon: Calendar,
    },
    {
      num: '03',
      title: 'Pristine Delivery',
      desc: 'Dispatched dry-cleaned, steam-pressed, and sanitized in luxury garment bags.',
      icon: Truck,
    },
    {
      num: '04',
      title: 'Slay & Wear',
      desc: 'Make unforgettable memories, snap endless photos, and enjoy your main character moment.',
      icon: HeartHandshake,
    },
    {
      num: '05',
      title: 'Hassle-Free Return',
      desc: 'No laundry needed! Pack it into the prepaid courier bag. Pickup at your doorstep.',
      icon: RotateCcw,
    },
  ];

  return (
    <section className="py-16 bg-[#fbf3ec] border-b border-[#C8A49F]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8A49F]/25 text-[#4D0E13] text-xs font-bold uppercase tracking-wider mb-2">
            <span>✨</span>
            <span>Simple, Sustainable & Seamless</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-[#2D1517] tracking-tight">
            How Renting With RENTORA Works
          </h2>
          <p className="text-sm text-[#5e5460] mt-2">
            Wear bespoke designer pieces for 10% of retail price. No dry cleaning, no commitment, zero buyer remorse.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="bg-white rounded-2xl p-5 border border-[#C8A49F]/30 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-serif text-2xl font-bold text-[#C8A49F]">
                      {step.num}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-[#EEE4DA] border border-[#C8A49F]/40 flex items-center justify-center text-[#4D0E13]">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h3 className="font-serif text-base font-bold text-[#2D1517] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#5e5460] leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#C8A49F]/20 text-[10px] text-[#4D0E13] font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span>Verified 100% Guaranteed</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* RENTORA Promise & Guarantees Banner */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-[#C8A49F]/40 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EEE4DA] text-[#4D0E13] text-xs font-bold uppercase tracking-wider">
              <span>✨ The RENTORA Promise</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2D1517]">
              Fabric Zoom Available for Every Outfit — For Her & For Him ✨
            </h3>
            <p className="text-xs sm:text-sm text-[#5e5460] max-w-2xl leading-relaxed">
              Explore every detail up close with our 2.5× Fabric Zoom, revealing intricate embroidery, rich textures and fine craftsmanship in every outfit.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0 w-full sm:w-auto">
            <div className="px-4 py-2.5 rounded-2xl bg-[#EEE4DA] border border-[#C8A49F]/30 text-xs font-bold text-[#4D0E13] flex items-center justify-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C8A49F]" />
              <span>Fabric Zoom Active ✨</span>
            </div>
            <div className="px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>100% Quality & Hygiene Guaranteed</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
