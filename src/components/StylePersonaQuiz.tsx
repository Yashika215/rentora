import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Check, 
  X, 
  RefreshCw, 
  ArrowLeft, 
  ArrowRight, 
  Eye, 
  Crown, 
  Wand2, 
  MessageCircleHeart, 
  ShoppingBag, 
  Palette, 
  Compass, 
  Layers, 
  Flame, 
  Star 
} from 'lucide-react';
import reniAvatar from '../assets/images/reni_avatar_new_1792982285301.jpg';
import { PRODUCTS, Product } from '../data/catalog';
import { useImageManager } from '../context/ImageManagerContext';
import { getProductColorHarmony } from '../utils/colorHarmony';

interface StylePersonaQuizProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (assignedAesthetics: string[], personaTitle: string) => void;
  onOpenProductDetail?: (product: Product) => void;
  onOpenReniChat?: (initialPrompt?: string) => void;
  onOpenOutfitBuilder?: () => void;
}

interface QuizOption {
  id: string;
  label: string;
  vibe: string;
  tagline: string;
  emoji: string;
  image: string;
  aesthetics: string[];
}

interface QuizQuestion {
  id: number;
  chapter: string;
  question: string;
  subtitle: string;
  options: QuizOption[];
}

// 5 Curated Editorial Chapters using RENTORA's authentic fashion assets
const EDITORIAL_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    chapter: "Chapter 01 • The Era",
    question: "What style era defines your energy when you enter a room?",
    subtitle: "Select the aesthetic atmosphere you naturally embody.",
    options: [
      {
        id: 'q1-coquette',
        label: "The Coquette Muse",
        tagline: "Romantic Bows & Soft Organza",
        vibe: "Delicate hair ribbons, sculpted sweetheart bodices, blush velvet, and baroque pearl grace.",
        emoji: "🎀",
        image: "/assets/aistudio/OFF_THE_SHOULDER_CONTRAST_BOW_DETAIL_VELVET_MINI_DRESS_-_Faire__1__788f26f0.jpg",
        aesthetics: ['coquette', 'soft-girl'],
      },
      {
        id: 'q1-desi',
        label: "Desi Diva Main Character",
        tagline: "Antique Zardozi & 360° Twirls",
        vibe: "Grand kathiyawadi mirrorwork, heirloom gold weaves, and high-voltage celebratory presence.",
        emoji: "✨",
        image: "/assets/aistudio/Bridesmaids_Style_cfccb78c.jpg",
        aesthetics: ['desi-glam', 'traditional'],
      },
      {
        id: 'q1-oldmoney',
        label: "Old Money Royalty",
        tagline: "Regal Heritage & Sharp Tailoring",
        vibe: "Hand-embroidered silk sherwanis, structured bandhgalas, raw silk, and quiet generational prestige.",
        emoji: "👑",
        image: "/assets/aistudio/download__44__030bc2a4.jpg",
        aesthetics: ['old-money', 'quiet-luxury'],
      },
      {
        id: 'q1-satin',
        label: "Modern Minimal Glamour",
        tagline: "Liquid Drape & Architectural Lines",
        vibe: "Fluid bias-cut cowl silks, clean-girl tailoring, sculpted silhouettes, and effortless polish.",
        emoji: "🍸",
        image: "/assets/aistudio/Classy_Dresses_for_Women___Elegant_Outfit_Ideas_for_Every_Occasion__1__a9c72458.jpg",
        aesthetics: ['clean-girl', 'minimalist'],
      },
    ],
  },
  {
    id: 2,
    chapter: "Chapter 02 • The Palette",
    question: "Which signature color world captivates your imagination?",
    subtitle: "The hue that makes your look unforgettable under gala chandeliers.",
    options: [
      {
        id: 'q2-plum',
        label: "Imperial Plum & Jewel Velvet",
        tagline: "Deep Wine, Mulberry & Gold",
        vibe: "Regal micro-velvet steeped in timeless royal opulence that commands evening drama.",
        emoji: "🍷",
        image: "/assets/aistudio/Velvet_Elegance__Three_Women_in_Traditional_Fashion_cdd4b543.png",
        aesthetics: ['desi-glam', 'traditional'],
      },
      {
        id: 'q2-pastels',
        label: "Blush Rose & Warm Ivory",
        tagline: "Champagne Glow & Soft Pastels",
        vibe: "Poetic soft-girl luminescence with delicate metallic undertones and ethereal daylight charm.",
        emoji: "🩰",
        image: "/src/assets/images/hero_fashion_editorial_lehenga_1793298948653.jpg",
        aesthetics: ['soft-girl', 'coquette'],
      },
      {
        id: 'q2-sapphire',
        label: "Sapphire Midnight & Zari",
        tagline: "Royal Navy, Gold Zardozi & Silver",
        vibe: "Sharp Indo-Western elegance that pairs midnight blues with hand-embroidered antique bullion.",
        emoji: "💎",
        image: "/assets/aistudio/Blue_velvet_indowestern_with_gold_zardosi_embroidery_254366cd.jpg",
        aesthetics: ['old-money', 'quiet-luxury'],
      },
      {
        id: 'q2-buttercream',
        label: "Buttercream & Liquid Vanilla",
        tagline: "Monochrome Champagne & Pearl",
        vibe: "Ultra-clean champagne radiance, fluid reflective sheen, and quiet high-fashion luxury.",
        emoji: "🤍",
        image: "/assets/aistudio/Classy_Dresses_for_Women___Elegant_Outfit_Ideas_for_Every_Occasion__1__a9c72458.jpg",
        aesthetics: ['clean-girl', 'minimalist'],
      },
    ],
  },
  {
    id: 3,
    chapter: "Chapter 03 • The Signature Accent",
    question: "Choose your non-negotiable styling masterpiece",
    subtitle: "The statement accessory that transforms an outfit into a work of art.",
    options: [
      {
        id: 'q3-waistbelt',
        label: "Artisan Oxidized Silver Coin Belt",
        tagline: "Heritage Kamardhani Waist Accent",
        vibe: "Handcrafted silver floral coin belt with ruby stones, cinching pure khadi and sarees with artisanal poise.",
        emoji: "🪙",
        image: "/assets/aistudio/White_creamy_34bef213.jpg",
        aesthetics: ['traditional', 'desi-glam'],
      },
      {
        id: 'q3-bows',
        label: "Baroque Pearl Keepsake & Velvet Bow",
        tagline: "Romantic Coquette Bijoux",
        vibe: "Multi-strand freshwater pearls and plush silk bows creating fairycore sweetness with high polish.",
        emoji: "🎀",
        image: "/src/assets/images/coquette_accessories_gift_1792952794547.jpg",
        aesthetics: ['coquette', 'soft-girl'],
      },
      {
        id: 'q3-turban',
        label: "Royal Kundan Kalgi & Embroidered Juttis",
        tagline: "Aristocratic Ceremonial Regalia",
        vibe: "Ancestral brooches, emerald malas, and velvet Rajwada footwear designed for royal courts.",
        emoji: "👑",
        image: "/assets/aistudio/download__44__030bc2a4.jpg",
        aesthetics: ['old-money', 'traditional'],
      },
      {
        id: 'q3-clutch',
        label: "Statement Minaudière & Gold Jhumkas",
        tagline: "Gala Ready Shimmer",
        vibe: "Light-catching mosaic clutch with filigree earrings that dance in step with every celebration.",
        emoji: "✨",
        image: "/assets/aistudio/Bridesmaids_Style_cfccb78c.jpg",
        aesthetics: ['desi-glam', 'diva'],
      },
    ],
  },
  {
    id: 4,
    chapter: "Chapter 04 • The Silhouette",
    question: "How do you prefer your couture to move?",
    subtitle: "The architectural cut that provides maximum poise, comfort and camera allure.",
    options: [
      {
        id: 'q4-twirl',
        label: "16-Kali Panoramic Flare",
        tagline: "Weightless 8-Meter Voluminous Skirt",
        vibe: "Authentic Gujarati flare geometry engineered to float gracefully without pulling or weighing you down.",
        emoji: "💃",
        image: "/src/assets/images/festive_lehenga_garba_1792952794231.jpg",
        aesthetics: ['desi-glam', 'traditional'],
      },
      {
        id: 'q4-corset',
        label: "Sculpted Sweetheart Bodice",
        tagline: "Off-the-Shoulder Contrast Architecture",
        vibe: "Structured boning that flatters the waist, paired with feminine draping and playful proportions.",
        emoji: "🎀",
        image: "/assets/aistudio/OFF_THE_SHOULDER_CONTRAST_BOW_DETAIL_VELVET_MINI_DRESS_-_Faire__1__788f26f0.jpg",
        aesthetics: ['coquette', 'soft-girl'],
      },
      {
        id: 'q4-sherwani',
        label: "Ancestral Structured Coat",
        tagline: "Impeccable Padded Shoulders & Mandarin Collar",
        vibe: "Sharp, masculine tailoring that commands instant dignity, reverence, and timeless distinction.",
        emoji: "👔",
        image: "/assets/aistudio/download__44__030bc2a4.jpg",
        aesthetics: ['old-money', 'quiet-luxury'],
      },
      {
        id: 'q4-bias',
        label: "Bias-Cut Liquid Column",
        tagline: "Effortless Cowl Neck & High Slit",
        vibe: "French-seamed silk satin that hugs the contours naturally and moves like liquid under candlelight.",
        emoji: "💋",
        image: "/assets/aistudio/Classy_Dresses_for_Women___Elegant_Outfit_Ideas_for_Every_Occasion__1__a9c72458.jpg",
        aesthetics: ['clean-girl', 'minimalist'],
      },
    ],
  },
  {
    id: 5,
    chapter: "Chapter 05 • The Moment",
    question: "Where does your dream fashion moment unfold?",
    subtitle: "The destination where your style makes its most memorable entrance.",
    options: [
      {
        id: 'q5-sangeet',
        label: "Midnight Sangeet & Navratri Circle",
        tagline: "Dhol Beats & Euphoric Twirls",
        vibe: "Surrounded by loved ones, dazzling chandeliers, and high-energy celebrations in vibrant color.",
        emoji: "🪔",
        image: "/assets/aistudio/Bridesmaids_Style_cfccb78c.jpg",
        aesthetics: ['desi-glam', 'traditional'],
      },
      {
        id: 'q5-reception',
        label: "Royal Palace Wedding Reception",
        tagline: "Candlelit Courtyards & Velvet Royalty",
        vibe: "Stately arches, heritage mandaps, and imperial luxury with friends who dress to the nines.",
        emoji: "🏛️",
        image: "/assets/aistudio/Velvet_Elegance__Three_Women_in_Traditional_Fashion_cdd4b543.png",
        aesthetics: ['desi-glam', 'old-money'],
      },
      {
        id: 'q5-garden',
        label: "Golden Hour High Tea & Romance",
        tagline: "Sunlit Lawns, Soft Florals & Pastels",
        vibe: "Daytime ceremonies, intimate garden parties, floral perfumes, and serene celebration poise.",
        emoji: "🌸",
        image: "/src/assets/images/hero_fashion_editorial_lehenga_1793298948653.jpg",
        aesthetics: ['soft-girl', 'coquette'],
      },
      {
        id: 'q5-speakeasy',
        label: "Cosmopolitan Gala & Rooftop Soirée",
        tagline: "Champagne Flutes, Jazz & City Lights",
        vibe: "Sleek European nightlife glamour, discreet five-star lounges, and modern cocktail sophistication.",
        emoji: "🍸",
        image: "/assets/aistudio/Blue_velvet_indowestern_with_gold_zardosi_embroidery_254366cd.jpg",
        aesthetics: ['clean-girl', 'quiet-luxury'],
      },
    ],
  },
];

export const StylePersonaQuiz: React.FC<StylePersonaQuizProps> = ({
  isOpen,
  onClose,
  onComplete,
  onOpenProductDetail,
  onOpenReniChat,
  onOpenOutfitBuilder,
}) => {
  const { getImage } = useImageManager();
  
  // Phase management: 'intro' -> 'quiz' -> 'analyzing' -> 'result'
  const [phase, setPhase] = useState<'intro' | 'quiz' | 'analyzing' | 'result'>('intro');
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [analyzingTextIndex, setAnalyzingTextIndex] = useState(0);

  const [calculatedPersona, setCalculatedPersona] = useState<{
    title: string;
    subtitle: string;
    badge: string;
    auraPoints: string;
    description: string;
    matchedAesthetics: string[];
    emoji: string;
    coverImage: string;
    stylePillars: { title: string; desc: string }[];
    recommendedProducts: Product[];
  } | null>(null);

  const calibrationPhrases = [
    "RÉNÉ is weaving your silhouette preferences into couture codes...",
    "Harmonizing heritage zardozi weaves with modern drape aesthetics...",
    "Scanning Gujarat's curated bridal, velvet & festive wardrobe vaults...",
    "Formulating your bespoke RENTORA Style Persona & color aura..."
  ];

  // Reset quiz when opened
  useEffect(() => {
    if (isOpen) {
      setPhase('intro');
      setCurrentStep(0);
      setSelectedAnswers([]);
      setCalculatedPersona(null);
    }
  }, [isOpen]);

  // Rotate analyzing text
  useEffect(() => {
    if (phase === 'analyzing') {
      const interval = setInterval(() => {
        setAnalyzingTextIndex((prev) => (prev + 1) % calibrationPhrases.length);
      }, 700);
      return () => clearInterval(interval);
    }
  }, [phase]);

  if (!isOpen) return null;

  const currentQ = EDITORIAL_QUIZ_QUESTIONS[currentStep];

  const handleStartQuiz = () => {
    setPhase('quiz');
    setCurrentStep(0);
  };

  const handleSelectOption = (optionIndex: number) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentStep] = optionIndex;
    setSelectedAnswers(updatedAnswers);

    if (currentStep < EDITORIAL_QUIZ_QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 220);
    } else {
      setPhase('analyzing');
      setTimeout(() => {
        calculatePersona(updatedAnswers);
        setPhase('result');
      }, 2400);
    }
  };

  const calculatePersona = (answers: number[]) => {
    const aestheticScores: Record<string, number> = {};

    answers.forEach((optIdx, qIdx) => {
      const q = EDITORIAL_QUIZ_QUESTIONS[qIdx];
      const opt = q.options[optIdx];
      if (opt) {
        opt.aesthetics.forEach((aes) => {
          aestheticScores[aes] = (aestheticScores[aes] || 0) + 1;
        });
      }
    });

    const topAesthetics = Object.keys(aestheticScores).sort(
      (a, b) => (aestheticScores[b] || 0) - (aestheticScores[a] || 0)
    );

    const primary = topAesthetics[0] || 'desi-glam';
    const secondary = topAesthetics[1] || 'coquette';

    let title = 'The Desi Diva Main Character';
    let badge = 'MAIN CHARACTER ERA • ZERO SKIPS';
    let auraPoints = '15,000 AURA';
    let subtitle = 'Antique zardozi, spinning mirrorwork flares, and cinema-grade spotlight elegance.';
    let description = 'You bring unapologetic glamour wherever you step. Your style DNA is deeply tied to royal Indian heritage—rich silk brocades, hand-embroidered bullion work, and twirl-ready ghagras designed to steal the spotlight under golden mandap chandeliers.';
    let emoji = '✨';
    let coverImage = '/assets/aistudio/Velvet_Elegance__Three_Women_in_Traditional_Fashion_cdd4b543.png';
    let stylePillars = [
      { title: 'Signature Cut', desc: '16-Kali panoramic flare with boned artisanal choli' },
      { title: 'Color Spectrum', desc: 'Imperial Plum, Antique Zari Gold, Ruby Crimson & Emerald' },
      { title: 'Craft Details', desc: 'Authentic Kathiyawadi mirrorwork, resham thread & zardozi' },
      { title: 'RÉNÉ Recommendation', desc: 'Pair with our Artisan Silver Coin Waist Belt & Kundan drops' },
    ];

    if (primary === 'coquette' || primary === 'soft-girl') {
      title = 'The Coquette Muse';
      badge = 'AURA +12,000 • SOFT POETRY';
      auraPoints = '12,000 AURA';
      subtitle = 'Dreamy pastel organza, delicate bows, and effortless whimsical radiance.';
      description = 'Your fashion philosophy is an exquisite love letter to romantic whimsy. You live for breathable tissue organza, blush micro-velvets, sweetheart corsetry, and baroque pearl heirlooms that feel straight out of an editorial fairytale.';
      emoji = '🎀';
      coverImage = '/assets/aistudio/OFF_THE_SHOULDER_CONTRAST_BOW_DETAIL_VELVET_MINI_DRESS_-_Faire__1__788f26f0.jpg';
      stylePillars = [
        { title: 'Signature Cut', desc: 'Off-the-shoulder contrast bow bodice with fluid skirt' },
        { title: 'Color Spectrum', desc: 'Blush Rose, Champagne Cream, Dusty Mauve & Pearl' },
        { title: 'Craft Details', desc: 'Mulberry silk micro-velvet, organza drape & pearl embroidery' },
        { title: 'RÉNÉ Recommendation', desc: 'Coordinate with multi-strand baroque pearl chokers' },
      ];
    } else if (primary === 'old-money' || primary === 'quiet-luxury') {
      title = 'The Old Money Aristocrat';
      badge = 'QUIET LUXURY • GENERATIONAL DISTINCTION';
      auraPoints = '14,500 AURA';
      subtitle = 'Architectural double-breasted tailoring, sharp lapels, and timeless prestige.';
      description = 'Your aesthetic whispers true luxury without ever needing loud branding. You gravitate toward impeccable tailoring, sculpted shoulders, velvet bandhgalas, raw silk sherwanis, and understated heritage jewelry with timeless dignity.';
      emoji = '👑';
      coverImage = '/assets/aistudio/download__44__030bc2a4.jpg';
      stylePillars = [
        { title: 'Signature Cut', desc: 'Structured Indo-Western bandhgala & asymmetric crossover' },
        { title: 'Color Spectrum', desc: 'Sapphire Midnight, Raw Honey Ivory, Sovereign Charcoal' },
        { title: 'Craft Details', desc: 'Handwoven pure silk, antiqued Kundan buttons & bullion' },
        { title: 'RÉNÉ Recommendation', desc: 'Anchor with handcrafted Rajwada velvet loafers' },
      ];
    } else if (primary === 'clean-girl' || primary === 'minimalist') {
      title = 'The Modern Atelier Purist';
      badge = 'EFFORTLESS EXPENSIVE • CLEAN LUXURY';
      auraPoints = '13,000 AURA';
      subtitle = 'Fluid bias-cut satin drape, cowl necklines, and modern architectural elegance.';
      description = 'You believe elegance lies in restraint and flawless construction. French-seamed silk slip dresses, sculpted column gowns, and warm monochrome palettes that catch candlelight with breathtaking, effortless poise.';
      emoji = '🤍';
      coverImage = '/assets/aistudio/Classy_Dresses_for_Women___Elegant_Outfit_Ideas_for_Every_Occasion__1__a9c72458.jpg';
      stylePillars = [
        { title: 'Signature Cut', desc: 'Fluid cowl neck bias-cut slip with clean side slit' },
        { title: 'Color Spectrum', desc: 'Buttercream Ivory, Vanilla Satin, Platinum & Soft Cashmere' },
        { title: 'Craft Details', desc: 'Heavyweight silk satin, concealed French seams & minimal trim' },
        { title: 'RÉNÉ Recommendation', desc: 'Pair with delicate gold vermeil studs and sleek sandals' },
      ];
    }

    // Curate top matching products from catalog
    const matchedProducts = PRODUCTS.filter((p) =>
      p.aesthetic.some((a) => topAesthetics.includes(a)) || p.moods?.some((m) => topAesthetics.includes(m))
    ).slice(0, 3);

    const fallbackProducts = matchedProducts.length >= 3 ? matchedProducts : PRODUCTS.slice(0, 3);

    setCalculatedPersona({
      title,
      subtitle,
      badge,
      auraPoints,
      description,
      matchedAesthetics: [primary, secondary],
      emoji,
      coverImage,
      stylePillars,
      recommendedProducts: fallbackProducts,
    });
  };

  const handleApplyPersona = () => {
    if (calculatedPersona) {
      onComplete(calculatedPersona.matchedAesthetics, calculatedPersona.title);
    }
    onClose();
  };

  const handleChatWithRene = () => {
    if (calculatedPersona) {
      onComplete(calculatedPersona.matchedAesthetics, calculatedPersona.title);
      if (onOpenReniChat) {
        onOpenReniChat(`I just discovered my style persona is "${calculatedPersona.title}"! Help me curate a complete head-to-toe ensemble with matching accessories for an upcoming celebration.`);
      }
    }
    onClose();
  };

  const progressPercentage = ((currentStep + 1) / EDITORIAL_QUIZ_QUESTIONS.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl bg-[#FAF5F0] rounded-3xl overflow-hidden shadow-2xl border border-[#C8A49F]/40 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header Bar */}
        <div className="p-4 sm:p-5 bg-[#4D0E13] text-[#EEE4DA] flex items-center justify-between shrink-0 border-b border-[#C8A49F]/30 relative z-10">
          <div className="flex items-center gap-3">
            <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#C8A49F] shrink-0 bg-[#292727] shadow-sm">
              <img
                src={reniAvatar}
                alt="RÉNÉ Personal Stylist"
                className="w-full h-full object-cover object-top"
                loading="eager"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#4D0E13]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold text-[#C8A49F] tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#C8A49F]" />
                <span>RÉNÉ Personal Stylist Engine</span>
              </div>
              <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                Discover Your Couture Persona
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Progress Bar (Only during question steps) */}
        {phase === 'quiz' && (
          <div className="w-full bg-[#EEE4DA]/80 h-1.5 overflow-hidden shrink-0">
            <div 
              className="bg-[#4D0E13] h-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        )}

        {/* Scrollable Main Experience Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          
          {/* ========================================================================= */}
          {/* PHASE 0: EDITORIAL INTRODUCTION SCREEN                                    */}
          {/* ========================================================================= */}
          {phase === 'intro' && (
            <div className="space-y-6 py-2 animate-fadeIn text-center">
              
              {/* Luxury Editorial Hero Card */}
              <div className="relative rounded-3xl overflow-hidden border border-[#C8A49F]/40 bg-[#4D0E13] text-white shadow-xl min-h-[300px] flex flex-col justify-end p-6 sm:p-8">
                <img
                  src="/assets/aistudio/Velvet_Elegance__Three_Women_in_Traditional_Fashion_cdd4b543.png"
                  alt="RENTORA Fashion Editorial"
                  className="absolute inset-0 w-full h-full object-cover object-top opacity-35"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#4D0E13] via-[#4D0E13]/60 to-transparent" />

                <div className="relative z-10 text-left max-w-xl">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C8A49F] text-[#4D0E13] text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-2.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Haute Couture Personal Discovery</span>
                  </span>
                  
                  <h3 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight mb-2">
                    Unlock Your Signature Fashion Identity
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-[#EEE4DA] leading-relaxed">
                    Answer 5 quick visual questions to reveal your signature aesthetic and get personalized recommendations from RÉNÉ.
                  </p>
                </div>
              </div>

              {/* 3 Pillar Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
                <div className="bg-white rounded-2xl p-4 border border-[#C8A49F]/35 shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-[#EEE4DA] text-[#4D0E13] flex items-center justify-center font-bold text-sm mb-2">
                    01
                  </div>
                  <h4 className="font-serif text-xs font-bold text-[#2D1517]">5 Visual Questions</h4>
                  <p className="text-[11px] text-[#5e5460] mt-0.5">Choose the aesthetics that define your presence.</p>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-[#C8A49F]/35 shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-[#EEE4DA] text-[#4D0E13] flex items-center justify-center font-bold text-sm mb-2">
                    02
                  </div>
                  <h4 className="font-serif text-xs font-bold text-[#2D1517]">Curated Palette</h4>
                  <p className="text-[11px] text-[#5e5460] mt-0.5">Discover colors tailored to your vibe.</p>
                </div>

                <div className="bg-white rounded-2xl p-4 border border-[#C8A49F]/35 shadow-xs">
                  <div className="w-8 h-8 rounded-full bg-[#EEE4DA] text-[#4D0E13] flex items-center justify-center font-bold text-sm mb-2">
                    03
                  </div>
                  <h4 className="font-serif text-xs font-bold text-[#2D1517]">RÉNÉ Stylist Match</h4>
                  <p className="text-[11px] text-[#5e5460] mt-0.5">Get exact catalog pieces that match your persona.</p>
                </div>
              </div>

              {/* Start Button */}
              <div className="pt-2">
                <button
                  onClick={handleStartQuiz}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#4D0E13] text-white text-sm font-bold hover:bg-[#38090D] shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                >
                  <Wand2 className="w-4 h-4 text-[#C8A49F] group-hover:scale-110 transition-transform" />
                  <span>Begin Your Style Discovery ✨</span>
                  <ArrowRight className="w-4 h-4 text-[#C8A49F] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* PHASE 1: FIVE EDITORIAL QUESTIONS                                         */}
          {/* ========================================================================= */}
          {phase === 'quiz' && currentQ && (
            <div className="animate-fadeIn">
              
              {/* Chapter indicator */}
              <div className="flex items-center justify-between text-xs text-[#5e5460] mb-2 font-medium">
                <span className="uppercase tracking-wider font-bold text-[#4D0E13] flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-[#C8A49F]" />
                  {currentQ.chapter}
                </span>
                <span className="font-bold font-mono text-[#4D0E13] bg-[#EEE4DA] px-3 py-0.5 rounded-full text-xs">
                  {currentStep + 1} of {EDITORIAL_QUIZ_QUESTIONS.length}
                </span>
              </div>

              {/* Question Heading */}
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2D1517] leading-snug mb-1">
                {currentQ.question}
              </h3>
              <p className="text-xs sm:text-sm text-[#5e5460] mb-6 leading-relaxed">
                {currentQ.subtitle}
              </p>

              {/* Visual 2x2 Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQ.options.map((option, idx) => {
                  const isSelected = selectedAnswers[currentStep] === idx;
                  const displayImg = getImage(`quiz-${option.id}`, option.image);

                  return (
                    <div
                      key={option.id}
                      onClick={() => handleSelectOption(idx)}
                      className={`group relative bg-white rounded-2xl p-3 sm:p-3.5 border cursor-pointer transition-all duration-300 flex flex-col justify-between overflow-hidden ${
                        isSelected
                          ? 'border-[#4D0E13] ring-2 ring-[#4D0E13] shadow-lg transform -translate-y-1 scale-[1.01]'
                          : 'border-[#C8A49F]/35 hover:border-[#4D0E13]/60 hover:shadow-md'
                      }`}
                    >
                      {/* Image Banner Container with fixed aspect ratio to eliminate cropping */}
                      <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden mb-3 bg-[#FAF5F0] flex items-center justify-center p-2 border border-[#C8A49F]/20">
                        <img
                          src={displayImg}
                          alt={option.label}
                          className="w-full h-full object-contain group-hover:scale-[1.03] transition-transform duration-500"
                          loading="lazy"
                        />
                        
                        {/* Top Left Emoji Badge */}
                        <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-sm shadow-xs border border-[#C8A49F]/30">
                          {option.emoji}
                        </div>

                        {/* Top Right Selection Indicator */}
                        <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                          isSelected 
                            ? 'bg-[#4D0E13] text-white scale-110 shadow-md' 
                            : 'bg-black/35 border border-white/80 text-transparent'
                        }`}>
                          <Check className="w-3.5 h-3.5" />
                        </div>

                        {/* Subtle bottom tag */}
                        <div className="absolute bottom-2 left-2 right-2 text-left pointer-events-none">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-white bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full inline-block truncate max-w-full">
                            {option.tagline}
                          </span>
                        </div>
                      </div>

                      {/* Content Details */}
                      <div>
                        <h4 className="font-serif text-sm font-bold text-[#2D1517] group-hover:text-[#4D0E13] transition-colors mb-1">
                          {option.label}
                        </h4>
                        <p className="text-[11px] text-[#5e5460] leading-relaxed line-clamp-2">
                          {option.vibe}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* PHASE 2: CALIBRATION / ANALYZING TRANSITION SCREEN                        */}
          {/* ========================================================================= */}
          {phase === 'analyzing' && (
            <div className="py-12 px-4 text-center space-y-6 animate-fadeIn flex flex-col items-center justify-center min-h-[380px]">
              
              {/* Pulsing Avatar Frame */}
              <div className="relative w-28 h-28 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-[#C8A49F]/30 border-t-[#4D0E13] animate-spin" />
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-[#C8A49F] absolute inset-2 bg-[#2D1517] shadow-xl">
                  <img src={reniAvatar} alt="RÉNÉ Stylist" className="w-full h-full object-cover object-top" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white border border-[#C8A49F] flex items-center justify-center shadow-md text-sm">
                  ✨
                </div>
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <span className="text-[11px] uppercase font-bold text-[#4D0E13] tracking-widest bg-[#EEE4DA] px-3.5 py-1 rounded-full inline-block border border-[#C8A49F]/40 shadow-2xs">
                  Couture Identity Calibration
                </span>
                
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2D1517] animate-pulse">
                  {calibrationPhrases[analyzingTextIndex]}
                </h3>
                
                <p className="text-xs text-[#5e5460]">
                  RÉNÉ is harmonizing your aesthetic preferences into a personalized runway edit with exact catalog items.
                </p>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* PHASE 3: THE GRAND REVEAL PRESENTATION                                    */}
          {/* ========================================================================= */}
          {phase === 'result' && calculatedPersona && (
            <div className="space-y-6 animate-scaleUp py-1">
              
              {/* Editorial Persona Magazine Cover Card */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#C8A49F]/40 shadow-sm relative overflow-hidden">
                <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                  
                  {/* Persona Feature Portrait / Emoji Avatar */}
                  <div className="relative w-28 h-36 rounded-2xl overflow-hidden bg-[#FAF5F0] border-2 border-[#C8A49F] shrink-0 p-1 flex items-center justify-center shadow-md">
                    <img
                      src={calculatedPersona.coverImage}
                      alt={calculatedPersona.title}
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/95 border border-[#C8A49F] flex items-center justify-center text-xs shadow-xs">
                      {calculatedPersona.emoji}
                    </div>
                  </div>

                  {/* Persona Title & Narrative */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-[#4D0E13] px-3 py-1 rounded-full shadow-xs">
                        {calculatedPersona.badge}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#4D0E13] bg-[#EEE4DA] px-2.5 py-1 rounded-full border border-[#C8A49F]/40 font-mono">
                        ⚡ {calculatedPersona.auraPoints}
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1517] tracking-tight">
                      {calculatedPersona.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#4D0E13] mt-1.5 font-medium italic">
                      "{calculatedPersona.subtitle}"
                    </p>

                    <p className="text-xs text-[#5e5460] mt-3 leading-relaxed">
                      {calculatedPersona.description}
                    </p>
                  </div>

                </div>

                {/* 4 Style DNA Dimensions Strip */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 mt-6 pt-6 border-t border-[#C8A49F]/30 text-left">
                  {calculatedPersona.stylePillars.map((pillar, pIdx) => (
                    <div key={pIdx} className="bg-[#FAF5F0] rounded-xl p-3 border border-[#C8A49F]/25">
                      <span className="text-[10px] uppercase font-bold text-[#4D0E13] block mb-1">
                        {pillar.title}
                      </span>
                      <p className="text-[11px] text-[#5e5460] leading-snug">
                        {pillar.desc}
                      </p>
                    </div>
                  ))}
                </div>

              </div>

              {/* Curated Fits Matching This Persona */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-serif text-base sm:text-lg font-bold text-[#2D1517] flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#C8A49F]" />
                    <span>Curated Outfits for Your Persona</span>
                  </h4>
                  <span className="text-[10px] text-[#4D0E13] font-bold bg-[#EEE4DA] px-2.5 py-1 rounded-full border border-[#C8A49F]/30">
                    Ready to Rent in Gujarat
                  </span>
                </div>

                {/* 3 Outfits in portrait aspect-[3/4] with full visibility */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {calculatedPersona.recommendedProducts.map((prod) => {
                    const displayImg = getImage(`product-${prod.id}`, prod.images[0]);
                    const harmony = getProductColorHarmony(prod);
                    return (
                      <div
                        key={prod.id}
                        onClick={() => {
                          if (onOpenProductDetail) {
                            onOpenProductDetail(prod);
                          }
                        }}
                        className="bg-white rounded-2xl p-3 border border-[#C8A49F]/30 hover:border-[#4D0E13] shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group"
                      >
                        <div>
                          {/* Portrait container ensuring full outfit visibility without cropping */}
                          <div className="aspect-[3/4] rounded-xl overflow-hidden bg-[#FAF5F0] mb-2 relative p-2 flex items-center justify-center border border-[#C8A49F]/20">
                            <img
                              src={displayImg}
                              alt={prod.name}
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="absolute top-2 left-2 text-[9px] font-bold uppercase tracking-wider text-white bg-[#4D0E13] px-2 py-0.5 rounded-full shadow-xs">
                              {prod.category === 'him' ? 'For Him' : 'For Her'}
                            </span>
                          </div>

                          <h5 className="font-serif text-xs font-bold text-[#2D1517] group-hover:text-[#4D0E13] truncate">
                            {prod.name}
                          </h5>
                          
                          {/* Color Harmony indicator */}
                          <p className="text-[10px] text-[#5e5460] mt-0.5 truncate flex items-center gap-1.5">
                            <span
                              className="w-2.5 h-2.5 rounded-full inline-block shrink-0 border border-black/10"
                              style={{ backgroundColor: harmony.primaryColor.hex }}
                            />
                            <span>{harmony.harmonyName}</span>
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-[#EEE4DA]">
                          <span className="text-xs font-mono font-bold text-[#4D0E13]">
                            ₹{prod.rentalPrice4Days.toLocaleString('en-IN')} / 4d
                          </span>
                          <span className="text-[11px] font-semibold text-[#4D0E13] group-hover:underline flex items-center gap-1">
                            View <Eye className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Primary Interaction Actions connecting with RÉNÉ AI and Closet */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={handleChatWithRene}
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-[#4D0E13] text-white text-xs sm:text-sm font-bold hover:bg-[#38090D] shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <MessageCircleHeart className="w-4 h-4 text-[#C8A49F]" />
                  <span>Chat with RÉNÉ About This Persona ✨</span>
                </button>

                <button
                  onClick={handleApplyPersona}
                  className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-white text-[#4D0E13] text-xs sm:text-sm font-bold border border-[#4D0E13] hover:bg-[#EEE4DA] shadow-xs transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4 text-[#4D0E13]" />
                  <span>Explore Persona In Closet</span>
                </button>

                <button
                  onClick={() => {
                    setPhase('intro');
                    setCurrentStep(0);
                    setSelectedAnswers([]);
                  }}
                  className="w-full sm:w-auto px-4 py-3.5 rounded-full bg-[#FAF5F0] hover:bg-[#EEE4DA] text-[#5e5460] text-xs font-semibold border border-[#C8A49F]/40 transition-colors cursor-pointer inline-flex items-center justify-center gap-1.5"
                  title="Retake Journey"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake</span>
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Footer Navigation Bar */}
        <div className="p-3.5 sm:px-6 bg-white border-t border-[#C8A49F]/30 flex items-center justify-between text-xs shrink-0">
          {phase === 'quiz' && currentStep > 0 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="text-[#4D0E13] hover:underline font-semibold cursor-pointer inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous Chapter</span>
            </button>
          ) : phase === 'quiz' ? (
            <button
              onClick={() => setPhase('intro')}
              className="text-[#5e5460] hover:text-[#4D0E13] font-semibold cursor-pointer inline-flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Cover</span>
            </button>
          ) : (
            <span className="text-[#5e5460] text-[11px] flex items-center gap-1">
              <span>✨</span>
              <span>Curated by RÉNÉ Atelier</span>
            </span>
          )}

          <button
            onClick={onClose}
            className="text-[#5e5460] hover:text-[#4D0E13] underline cursor-pointer"
          >
            {phase === 'result' ? 'Close' : 'Skip journey'}
          </button>
        </div>

      </div>
    </div>
  );
};
