import React from 'react';
import { Sparkles, X, Edit3, CheckCircle2, MousePointerClick } from 'lucide-react';

interface EditModeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditModeGuideModal: React.FC<EditModeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-[#C8A49F]/50 text-center space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-[#EEE4DA] text-[#2D1517] transition-colors cursor-pointer"
          aria-label="Close guide"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full bg-[#4D0E13] text-white flex items-center justify-center mx-auto shadow-md">
          <Edit3 className="w-6 h-6 text-[#C8A49F]" />
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#4D0E13] bg-[#C8A49F]/20 px-2.5 py-1 rounded-full">
            Interactive Onboarding ✨
          </span>
          <h3 className="font-serif text-xl font-bold text-[#2D1517] mt-2">
            How to use Global Edit Mode
          </h3>
          <p className="text-xs text-[#5e5460] mt-1">
            Customize any text, title, price, or banner across the entire RENTORA website instantly!
          </p>
        </div>

        <div className="space-y-3 text-left bg-[#EEE4DA] p-4 rounded-2xl border border-[#C8A49F]/30 text-xs">
          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-full bg-[#4D0E13] text-white shrink-0 mt-0.5">
              <MousePointerClick className="w-3.5 h-3.5 text-[#C8A49F]" />
            </div>
            <div>
              <strong className="text-[#2D1517] block">1. Click or Tap Directly on Text</strong>
              <span className="text-[#5e5460]">Select any headline, price, button, or paragraph anywhere on the page.</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-full bg-[#4D0E13] text-white shrink-0 mt-0.5">
              <Edit3 className="w-3.5 h-3.5 text-[#C8A49F]" />
            </div>
            <div>
              <strong className="text-[#2D1517] block">2. Type Your Custom Text</strong>
              <span className="text-[#5e5460]">Changes apply instantly in real time right where you clicked.</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-1.5 rounded-full bg-[#4D0E13] text-white shrink-0 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div>
              <strong className="text-[#2D1517] block">3. Done Editing</strong>
              <span className="text-[#5e5460]">Click 'Done Editing' in the top banner whenever you're finished.</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 px-6 rounded-full bg-[#4D0E13] text-white font-serif font-bold text-sm hover:bg-[#3b172a] shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Start Editing Now 🎀</span>
        </button>
      </div>
    </div>
  );
};
