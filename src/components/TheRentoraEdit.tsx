import React, { useState } from 'react';
import { EDITORIAL_ARTICLES } from '../data/catalog';
import { Sparkles, ArrowRight, BookOpen, Clock, X, ArrowLeft, Star, Quote } from 'lucide-react';

interface TheRentoraEditProps {
  onExploreProduct?: (productId: string) => void;
}

const ARTICLE_FULL_STORIES: Record<string, {
  intro: string;
  sections: { title: string; body: string }[];
  quote: string;
  recommendedTag: string;
}> = {
  'edit-1': {
    intro: 'A bespoke velvet suit is often treated as a single-wear novelty piece. But with thoughtful styling, the Sovereign Plum Velvet Suit can morph into three completely distinct aesthetics across your social calendar.',
    sections: [
      {
        title: 'Look 1: The Black-Tie Gala & Symphony',
        body: 'Button the single-breasted jacket over a crisp pleated tuxedo shirt. Pair with our Rajwada embroidered loafers and an understated pocket square in muted ivory silk. Keep jewelry minimal with a sunray minimalist watch.'
      },
      {
        title: 'Look 2: The Modern Festive Sangeet',
        body: 'Ditch the stiff tuxedo shirt and drape an unbuttoned velvet dinner jacket over a silk georgette asymmetric tunic. The contrasting plum micro-velvet against ivory silk creates cinematic depth under warm wedding chandelier lighting.'
      },
      {
        title: 'Look 3: Late-Night Speakeasy Cocktail',
        body: 'Wear the jacket semi-open over a fine-gauge knit turtleneck with tailored trousers and tinted Riviera cat-eye shades. Effortless European nightlife swagger that feels deliberate yet relaxed.'
      }
    ],
    quote: '"Never wear velvet timidly. Let its plush light-catching grain do the talking, and keep everything else razor-sharp."',
    recommendedTag: 'For Him & Androgynous Glam'
  },
  'edit-2': {
    intro: 'Navratri in Gujarat is a marathon of energy, music, and non-stop movement. Why weigh yourself down with 15kg stiff lehengas when authentic Kathiyawadi mirrorwork can feel as light as a gentle monsoon breeze?',
    sections: [
      {
        title: 'The 16-Kali Flare Geometry',
        body: 'Our Kathiyawadi Chaniya Choli uses pure cotton khadi cut in sixteen flared panels. When you hit the 3-step or 4-step Garba circle at GMDC or United Way, the skirt expands into an 8-meter panoramic twirl without catching on your ankles.'
      },
      {
        title: 'Weightless Real Mirrors',
        body: 'Traditional heavy metal foil borders are replaced with hand-set convex mirrors held by genuine Kutchi resham threadwork. You get 100% authentic Gujarati artisan flair with only a fraction of the traditional weight.'
      },
      {
        title: 'Sweat-Resistant Breathability',
        body: 'Lined with breathable organic voile that keeps you cool through humid September and October evenings. Dispatched freshly sanitized with hypo-allergenic floral extracts so you can dance till 4 AM in full comfort.'
      }
    ],
    quote: '"Garba is dance, celebration, and worship. Your outfit should give you wings, not anchor you down."',
    recommendedTag: 'Navratri & Garba Season'
  },
  'edit-3': {
    intro: 'At first glance, old-money prep and coquette romanticism appear to be polar opposites: one rooted in equestrian austerity, the other in hyper-feminine whimsical play. Here is how RENTORA besties are blending the two into high-fashion harmony.',
    sections: [
      {
        title: 'Structure Meets Softness',
        body: 'Start with an austere, razor-sharp double-breasted wool overcoat or tweed blazer. Soften the architectural shoulders by pinning an oversized plum velvet bow in your hair or layering our triple-row cultured pearl choker at the collar.'
      },
      {
        title: 'Color Palettes: Warm Ivory & Deep Wine',
        body: 'Anchor pastel dusty-rose silk coordinates with deep plum leatherette accessories. The contrast between innocence and tailored sobriety gives the ensemble editorial complexity worthy of street-style photography.'
      },
      {
        title: 'The Modern Finishing Touch',
        body: 'Finish with soft, luminous skin and ballet-inspired footwear or metallic strappy stilettos. The look exudes quiet wealth combined with uninhibited youthful charm.'
      }
    ],
    quote: '"Coquette is not about being childish; it is about reclaiming romance with the confidence of high tailoring."',
    recommendedTag: 'Aesthetic Deep Dive'
  },
  'edit-4': {
    intro: 'Gentlemen, the era of showing up to three different weddings in the same ill-fitting navy suit is officially over. This season in Gujarat, men’s occasionwear is embracing rich jewel tones, raw silk textures, and asymmetric Indo-Western cuts.',
    sections: [
      {
        title: 'The Rise of Deep Jewel Tones',
        body: 'Plum-charcoal velvet, emerald zardozi, and raw honey ivory are outshining standard blues and greys. Under golden wedding mandap chandeliers, jewel tones radiate prestige and photogenic warmth.'
      },
      {
        title: 'Indo-Western Asymmetric Crossover',
        body: 'Swap predictable Western blazers for an asymmetric crossover jacket with hand-embroidered metallic zardozi on the lapel. It pairs comfortably with tapered trousers for both cocktail nights and reception parties.'
      },
      {
        title: 'The Footwear Upgrade',
        body: 'Round out your rental look with handcrafted Rajwada velvet slippers. Memory foam insoles ensure you stay comfortable through the baraat without sacrificing a single shred of royal charm.'
      }
    ],
    quote: '"When the groomsmen look sharp, the entire celebration feels like a royal court."',
    recommendedTag: 'Men\'s Groom & Guest Guide'
  }
};

export const TheRentoraEdit: React.FC<TheRentoraEditProps> = ({ onExploreProduct }) => {
  const [selectedArticle, setSelectedArticle] = useState<typeof EDITORIAL_ARTICLES[0] | null>(null);

  const fullStory = selectedArticle ? ARTICLE_FULL_STORIES[selectedArticle.id] : null;

  return (
    <section id="edit" className="py-16 bg-[#EEE4DA] border-b border-[#C8A49F]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[#4D0E13] mb-2">
              <BookOpen className="w-3.5 h-3.5 text-[#C8A49F]" />
              <span>Editorial Journal</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#2D1517] tracking-tight">
              The RENTORA Edit 🎀
            </h2>
            <p className="text-sm text-[#5e5460] mt-1 max-w-xl">
              Curated styling essays, body-positive fit guides, seasonal edits, and bestie fashion hacks from RÉNÉ.
            </p>
          </div>
        </div>

        {/* Editorial Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {EDITORIAL_ARTICLES.map((article) => (
            <div
              key={article.id}
              onClick={() => setSelectedArticle(article)}
              className="group bg-white rounded-2xl overflow-hidden border border-[#C8A49F]/30 shadow-xs hover:shadow-lg hover:border-[#4D0E13]/40 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="relative aspect-[16/10] overflow-hidden bg-[#FAF5F0] flex items-center justify-center p-2">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-contain group-hover:scale-[1.02] transition-transform duration-500"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute top-3 left-3 text-[10px] uppercase font-bold tracking-wider text-[#4D0E13] bg-[#EEE4DA]/90 backdrop-blur-xs px-2.5 py-0.5 rounded-full border border-[#C8A49F]/40">
                    {article.category}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 text-[11px] text-[#5e5460] mb-2">
                    <Clock className="w-3 h-3 text-[#C8A49F]" />
                    <span>{article.readTime}</span>
                    <span>·</span>
                    <span className="font-semibold text-[#4D0E13]">{article.tag}</span>
                  </div>

                  <h3 className="font-serif text-base font-bold text-[#2D1517] group-hover:text-[#4D0E13] transition-colors leading-snug mb-2">
                    {article.title}
                  </h3>

                  <p className="text-xs text-[#5e5460] line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0 border-t border-[#C8A49F]/15 flex items-center justify-between text-xs font-semibold text-[#4D0E13] group-hover:underline">
                <span>Read Story</span>
                <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Article Reader Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div 
            className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#C8A49F]/40 max-h-[88vh] flex flex-col p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Navigation Bar with Back Button */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#C8A49F]/20">
              <button
                onClick={() => setSelectedArticle(null)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4D0E13] hover:text-[#3b172b] bg-[#EEE4DA] hover:bg-[#C8A49F]/30 px-3 py-1.5 rounded-full transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Back to Journal</span>
              </button>

              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-[#2D1517] transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto pr-2 space-y-4">
              <div>
                <span className="text-xs uppercase font-bold text-[#C8A49F] tracking-wider block mb-1">
                  {selectedArticle.category} · {selectedArticle.readTime} · {fullStory?.recommendedTag || selectedArticle.tag}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D1517] leading-tight">
                  {selectedArticle.title}
                </h2>
              </div>

              <div className="aspect-[16/9] rounded-2xl overflow-hidden border border-[#C8A49F]/30 shadow-xs bg-[#FAF5F0] flex items-center justify-center p-2">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="prose text-sm text-[#5e5460] space-y-4 leading-relaxed">
                <p className="font-medium text-[#2D1517] text-base leading-snug">
                  {fullStory?.intro || selectedArticle.excerpt}
                </p>

                {fullStory?.sections.map((sec, idx) => (
                  <div key={idx} className="p-4 bg-[#fbf3ec] rounded-2xl border border-[#C8A49F]/20">
                    <h4 className="font-serif text-base font-bold text-[#4D0E13] mb-1.5">
                      {sec.title}
                    </h4>
                    <p className="text-xs text-[#5e5460] leading-relaxed">
                      {sec.body}
                    </p>
                  </div>
                ))}

                {fullStory?.quote && (
                  <div className="p-4 bg-[#EEE4DA] rounded-2xl border border-[#C8A49F]/30 text-xs text-[#4D0E13]">
                    <strong className="block mb-1 font-serif text-sm">RÉNÉ's Top Golden Rule:</strong>
                    <p className="italic">{fullStory.quote}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Action Row */}
            <div className="mt-6 pt-4 border-t border-[#C8A49F]/30 flex items-center justify-between">
              <button
                onClick={() => setSelectedArticle(null)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#4D0E13] hover:underline cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Back to Journal</span>
              </button>

              <button
                onClick={() => setSelectedArticle(null)}
                className="px-6 py-2.5 rounded-full bg-[#4D0E13] text-white text-xs font-semibold hover:bg-[#3b172b] transition-all cursor-pointer shadow-sm"
              >
                Close & Explore Wardrobe 🎀
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
