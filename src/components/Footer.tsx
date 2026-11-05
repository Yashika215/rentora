import React, { useState } from 'react';
import { Sparkles, Heart, ShieldCheck, Mail, ArrowRight, Instagram, MessageCircle } from 'lucide-react';

import { NewsletterSignup } from './NewsletterSignup';

interface FooterProps {
  onNavClick: (tab: string) => void;
  onOpenReniChat: () => void;
  onOpenAuth?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick, onOpenReniChat, onOpenAuth }) => {
  return (
    <footer className="bg-[#2D1517] text-[#EEE4DA] pt-16 pb-12 border-t border-[#4D0E13]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Newsletter Card: Warm Ivory NewsletterSignup Component */}
        <div className="mb-14">
          <NewsletterSignup />
        </div>

        {/* 4-Column Navigation & Policies */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Manifesto */}
          <div className="space-y-4">
            <div className="inline-block bg-[#EEE4DA] px-3 py-1.5 rounded-xl border border-[#C8A49F]/30 shadow-xs">
              <img
                src="/assets/aistudio/rentora-logo_359e5dd0.png"
                alt="RENTORA — Rent • Wear • Repeat"
                className="h-10 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-[#EEE4DA]/70 leading-relaxed font-sans">
              Rent • Wear • Repeat. India's premium aesthetic fashion rental destination. Redefining celebratory luxury with sustainable circular couture and personalized AI styling from RÉNÉ.
            </p>
            <div className="flex items-center gap-2 text-xs text-[#C8A49F]">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Insured & Sanitized</span>
            </div>
          </div>

          {/* Quick Closets */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#C8A49F] mb-4">
              Explore Closets
            </h4>
            <ul className="space-y-2.5 text-xs text-[#EEE4DA]/80">
              <li>
                <button onClick={() => onNavClick('her')} className="hover:text-white transition-colors cursor-pointer">
                  For Her: Lehengas, Gowns & Sarees
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('him')} className="hover:text-white transition-colors cursor-pointer">
                  For Him: Royal Sherwanis & Tuxedos
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('occasions')} className="hover:text-white transition-colors cursor-pointer">
                  Occasions & Garba Nights
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('accessories')} className="hover:text-white transition-colors cursor-pointer">
                  Luxury Accessories & Clutches
                </button>
              </li>
              <li>
                <button onClick={() => onNavClick('builder')} className="hover:text-white transition-colors cursor-pointer">
                  Complete Look Builder
                </button>
              </li>
              {onOpenAuth && (
                <li>
                  <button onClick={onOpenAuth} className="hover:text-[#C8A49F] transition-colors cursor-pointer text-[#C8A49F]">
                    Sign In / Join VIP Club 🎀
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Policies & Hygiene */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#C8A49F] mb-4">
              Rental Guarantees
            </h4>
            <ul className="space-y-2.5 text-xs text-[#EEE4DA]/80">
              <li className="flex items-center gap-2">
                <span>✓</span>
                <span>Hospital-Grade Eco Dry Cleaning</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span>
                <span>100% Refundable Security Deposit</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span>
                <span>Free Doorstep Delivery & Return Pickup</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span>
                <span>Free Surprise Gift on Orders &gt; ₹3,000</span>
              </li>
              <li className="flex items-center gap-2">
                <span>✓</span>
                <span>Minor Wear & Tear Damage Shield</span>
              </li>
            </ul>
          </div>

          {/* Personal Stylist & Contact */}
          <div>
            <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-[#C8A49F] mb-4">
              Need Styling Help?
            </h4>
            <p className="text-xs text-[#EEE4DA]/70 mb-3">
              RÉNÉ is ready to guide your sizing, occasion dress codes, and accessory coordination.
            </p>
            <button
              onClick={onOpenReniChat}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white text-white hover:text-[#4D0E13] text-xs font-semibold border border-[#C8A49F]/40 transition-all cursor-pointer mb-4"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C8A49F]" />
              <span>Chat with RÉNÉ Now</span>
            </button>
            <div className="text-[11px] text-[#EEE4DA]/60 space-y-1">
              <p>Email: concierge@rentora.fashion</p>
              <p>WhatsApp: +91 98765 43210 (10 AM - 9 PM)</p>
            </div>
          </div>

        </div>

        {/* Bottom Legal bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#EEE4DA]/60 border-t border-white/10 mt-6">
          <p>© {new Date().getFullYear()} RENTORA Technologies Pvt Ltd. All rights reserved.</p>
          <p className="text-[11px] text-[#C8A49F] font-medium tracking-wide">
            This is an academic prototype, not an actual rental website.
          </p>
        </div>

      </div>
    </footer>
  );
};
