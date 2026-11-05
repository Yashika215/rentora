import React, { useState } from 'react';
import { Mail, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface NewsletterSignupProps {
  className?: string;
  onSuccess?: (email: string) => void;
}

export const NewsletterSignup: React.FC<NewsletterSignupProps> = ({ className = '', onSuccess }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setIsSubscribed(true);
      if (onSuccess) onSuccess(email);
      setEmail('');
    }
  };

  return (
    <div className={`p-8 sm:p-10 rounded-3xl bg-[#EEE4DA] text-[#2D1517] border border-[#C8A49F]/40 shadow-xl relative overflow-hidden ${className}`}>
      
      {/* Decorative ambient subtle dusty rose background glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-[#C8A49F]/15 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C7B7D4]/15 rounded-full blur-2xl pointer-events-none -ml-16 -mb-16" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
        
        {/* Left: Heading & Value Proposition */}
        <div className="max-w-xl text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8A49F]/25 text-[#4D0E13] text-xs font-bold uppercase tracking-wider mb-3 border border-[#C8A49F]/30">
            <span>🎀</span>
            <span>The RENTORA Insider Club</span>
          </div>
          
          <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#4D0E13] leading-tight mb-2">
            Get ₹500 off your first rental order
          </h3>
          
          <p className="text-xs sm:text-sm text-[#5e5460] leading-relaxed">
            Be the first to access new archival drops, festive lehenga edits, secret VIP flash rentals, and personal styling tips from RÉNÉ.
          </p>
        </div>

        {/* Right: Input & 'Join the Club' Action Form */}
        <div className="w-full lg:w-auto flex-1 max-w-md">
          {isSubscribed ? (
            <div className="p-4 bg-white/90 border border-emerald-500/40 rounded-2xl shadow-sm text-center">
              <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold text-sm mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>You're on the VIP list, bestie! 🎀</span>
              </div>
              <p className="text-xs text-[#5e5460]">
                Use voucher code <strong className="font-mono text-[#4D0E13] bg-[#C8A49F]/30 px-2 py-0.5 rounded font-bold">RENTORA10</strong> at checkout for ₹500 off your first booking.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative w-full">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5e5460]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address..."
                  className="w-full bg-white text-xs sm:text-sm text-[#2D1517] placeholder-[#5e5460]/70 pl-11 pr-4 py-3.5 rounded-full border border-[#C8A49F]/50 focus:outline-none focus:ring-2 focus:ring-[#4D0E13]/40 focus:border-[#4D0E13] transition-all shadow-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-[#4D0E13] text-white text-xs sm:text-sm font-semibold hover:bg-[#3b172a] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 ease-out cursor-pointer whitespace-nowrap shrink-0 shadow-md flex items-center justify-center gap-2 group"
              >
                <span>Join the Club</span>
                <ArrowRight className="w-4 h-4 text-[#C8A49F] transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </form>
          )}

          <p className="text-[10px] text-[#5e5460] mt-2.5 text-center sm:text-left">
            *Instant ₹500 voucher automatically applied to orders above ₹2,000. No spam ever.
          </p>
        </div>

      </div>

    </div>
  );
};
