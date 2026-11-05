import { PRODUCTS, Product } from '../data/catalog';

export interface UserContext {
  lastOutfit?: string;            // e.g. "lehenga", "sherwani", "power suit"
  lastOutfitId?: string;          // e.g. "her-suit-sovereign-plum"
  lastOutfitName?: string;        // e.g. "Sovereign Plum Velvet Power Suit"
  lastColor?: string;             // e.g. "pink", "plum", "navy", "gold"
  lastOccasion?: string;          // e.g. "weddings-guest", "navratri-garba", "date-nights"
  lastCategory?: 'her' | 'him' | 'accessory';
  budgetCap?: number;             // e.g. 800, 1500
  genderPreference?: 'her' | 'him';
  requestedCount?: number;        // e.g. 1, 2, 3
  preferredSize?: string;         // e.g. "XS", "S", "M", "L", "XL", "XXL"
  lastRecommendedIds?: string[];  // ids already shown to prevent repeating
}

export interface StylingResult {
  reply: string;
  products: Product[];
  matchRationale?: Record<string, string>;
  updatedContext: UserContext;
}

/**
 * Standardizes color search tokens
 */
const COLOR_KEYWORDS = [
  'plum', 'burgundy', 'wine', 'maroon',
  'rose', 'pink', 'blush', 'peach',
  'navy', 'blue', 'sapphire',
  'emerald', 'green', 'mint', 'sage',
  'gold', 'champagne', 'yellow', 'mustard',
  'ivory', 'cream', 'white', 'ecru', 'vanilla',
  'silver', 'grey', 'gray', 'charcoal', 'black',
  'camel', 'tan', 'sand', 'beige', 'brown', 'espresso',
  'terracotta', 'rust', 'coral', 'red', 'crimson', 'ruby',
  'lavender', 'lilac', 'purple'
];

/**
 * Occasion mapping from natural language
 */
const OCCASION_MAP: Record<string, string> = {
  wedding: 'weddings-guest',
  shaadi: 'weddings-guest',
  sangeet: 'weddings-guest',
  reception: 'weddings-guest',
  barat: 'weddings-guest',
  mehendi: 'weddings-guest',
  haldi: 'festivals-diwali',
  garba: 'navratri-garba',
  navratri: 'navratri-garba',
  dandiya: 'navratri-garba',
  farewell: 'college-farewell',
  prom: 'college-farewell',
  college: 'college-farewell',
  freshers: 'college-farewell',
  date: 'date-nights',
  anniversary: 'date-nights',
  dinner: 'date-nights',
  cocktail: 'formal-galas',
  gala: 'formal-galas',
  blacktie: 'formal-galas',
  'black-tie': 'formal-galas',
  'red carpet': 'formal-galas',
  formal: 'formal-galas',
  birthday: 'birthday-parties',
  party: 'birthday-parties',
  engagement: 'engagements',
  ring: 'engagements',
  roka: 'engagements',
  diwali: 'festivals-diwali',
  festive: 'festivals-diwali',
  festival: 'festivals-diwali',
  puja: 'festivals-diwali',
  eid: 'eid-celebrations',
  vacation: 'vacation-beach',
  beach: 'vacation-beach',
  resort: 'vacation-beach',
  brunch: 'brunches-casual',
  photoshoot: 'photoshoots',
  editorial: 'photoshoots',
};

/**
 * Parses requested count (e.g. "suggest 3", "show 1 option", "two dresses")
 */
function extractRequestedCount(query: string): number | null {
  if (/\b(?:one|1|single)\b/i.test(query) && !/\b(?:10|100|1000|1800|1400|1200|1600|1900|2000)\b/.test(query)) {
    return 1;
  }
  if (/\b(?:two|2|pair)\b/i.test(query)) {
    return 2;
  }
  if (/\b(?:three|3)\b/i.test(query)) {
    return 3;
  }
  if (/\b(?:four|4)\b/i.test(query)) {
    return 4;
  }
  return null;
}

/**
 * Extracts specific size mentions (e.g., XS, S, M, L, XL, XXL, 38, 40, 42)
 */
function extractSize(query: string): string | null {
  const match = query.match(/\b(xxl|xl|xs|[sml])\b/i);
  if (match) {
    return match[1].toUpperCase();
  }
  const numMatch = query.match(/\bsize\s*(32|34|36|38|40|42|44)\b/i);
  if (numMatch) {
    return numMatch[1];
  }
  return null;
}

/**
 * Checks if user is inquiring about details of a specific product
 */
function handleProductDetailInquiry(query: string, context: UserContext): StylingResult | null {
  const lower = query.toLowerCase();

  // Find if query mentions an exact product or refers to the last viewed product
  let targetProduct: Product | undefined;

  // 1. Direct name match in query
  for (const p of PRODUCTS) {
    if (lower.includes(p.name.toLowerCase())) {
      targetProduct = p;
      break;
    }
  }

  // 2. Keyword match (e.g. "sovereign plum suit", "bridal lehenga", "classic tuxedo")
  if (!targetProduct) {
    const keyPhrases: [RegExp, string][] = [
      [/sovereign.*plum/i, 'her-suit-sovereign-plum'],
      [/bridal.*lehenga/i, 'her-2'],
      [/wedding.*guest.*lehenga/i, 'her-3'],
      [/classic.*tuxedo/i, 'him-1'],
      [/savile.*row/i, 'him-suit-tuxedo-charcoal'],
      [/seraphina/i, 'her-dress-velvet-coquette'],
      [/buttercream/i, 'her-dress-vintage-slip'],
      [/oxidized.*silver.*belt/i, 'acc-boho-silver-belt'],
      [/chaniya.*choli/i, 'her-8'],
      [/jharokha.*kurta/i, 'him-kurta-mirrorwork-rose'],
      [/emerald.*indowestern/i, 'him-indowestern-emerald-zari'],
      [/pearl.*choker/i, 'acc-pearl-choker'],
      [/kundan.*jhumka/i, 'acc-kundan-jhumkas'],
      [/velvet.*loafer/i, 'acc-velvet-embroidered-loafers'],
    ];

    for (const [pattern, id] of keyPhrases) {
      if (pattern.test(lower)) {
        targetProduct = PRODUCTS.find((p) => p.id === id);
        break;
      }
    }
  }

  // 3. Pronoun referral ("this outfit", "this dress", "the suit") using context
  if (!targetProduct && context.lastOutfitId && (lower.includes('this') || lower.includes('it') || lower.includes('the outfit') || lower.includes('the dress') || lower.includes('the suit'))) {
    targetProduct = PRODUCTS.find((p) => p.id === context.lastOutfitId);
  }

  if (!targetProduct) return null;

  // Check what aspect the user is asking about
  const isAskingPrice = lower.includes('price') || lower.includes('cost') || lower.includes('how much') || lower.includes('rental fee') || lower.includes('deposit');
  const isAskingSize = lower.includes('size') || lower.includes('measurement') || lower.includes('fit') || lower.includes('fitting');
  const isAskingFabric = lower.includes('fabric') || lower.includes('material') || lower.includes('cloth') || lower.includes('silk') || lower.includes('velvet');
  const isAskingCare = lower.includes('care') || lower.includes('dry clean') || lower.includes('clean') || lower.includes('sanitize') || lower.includes('hygiene');
  const isAskingColors = lower.includes('color') || lower.includes('colour') || lower.includes('shade');

  if (isAskingPrice) {
    return {
      reply: `The ${targetProduct.name} rents for ₹${targetProduct.rentalPrice4Days} for 4 days (deposit: ₹${targetProduct.deposit}). Professional sanitization and delivery across Gujarat are included.`,
      products: [targetProduct],
      matchRationale: {
        [targetProduct.id]: `4-day rental: ₹${targetProduct.rentalPrice4Days} · Deposit: ₹${targetProduct.deposit}`,
      },
      updatedContext: {
        ...context,
        lastOutfitId: targetProduct.id,
        lastOutfitName: targetProduct.name,
      },
    };
  }

  const isAskingStylingTip =
    lower.includes('styling tip') ||
    lower.includes('styling advice') ||
    lower.includes('how to style') ||
    lower.includes('how should i style') ||
    lower.includes('style tip') ||
    lower.includes('how to wear') ||
    lower.includes('what to pair') ||
    lower.includes('pair with') ||
    lower.includes('accessorize') ||
    lower.includes('styling');

  if (isAskingStylingTip) {
    const note = generateProductStylingNote(targetProduct);
    return {
      reply: `Here is RÉNÉ's personalized styling tip for the ${targetProduct.name}:\n\n🎀 Styling Tip: ${note.stylingTip}\n\n💡 Why it works: "${note.whyItWorks}"`,
      products: [targetProduct],
      matchRationale: {
        [targetProduct.id]: note.stylingTip,
      },
      updatedContext: {
        ...context,
        lastOutfitId: targetProduct.id,
        lastOutfitName: targetProduct.name,
      },
    };
  }

  if (isAskingSize) {
    const sizeList = targetProduct.sizes.join(', ');
    return {
      reply: `The ${targetProduct.name} is available in sizes ${sizeList} (${targetProduct.fit}). Doorstep fit assistance is included.`,
      products: [targetProduct],
      matchRationale: {
        [targetProduct.id]: `Sizes: ${sizeList} · Fit: ${targetProduct.fit}`,
      },
      updatedContext: {
        ...context,
        lastOutfitId: targetProduct.id,
        lastOutfitName: targetProduct.name,
      },
    };
  }

  if (isAskingFabric) {
    return {
      reply: `The ${targetProduct.name} is crafted from ${targetProduct.fabric}.`,
      products: [targetProduct],
      matchRationale: {
        [targetProduct.id]: `Fabric: ${targetProduct.fabric}`,
      },
      updatedContext: {
        ...context,
        lastOutfitId: targetProduct.id,
        lastOutfitName: targetProduct.name,
      },
    };
  }

  if (isAskingCare) {
    return {
      reply: `The ${targetProduct.name} is UV-sanitized and delivered sealed in garment bags. No laundering or dry-cleaning is required upon return.`,
      products: [targetProduct],
      matchRationale: {
        [targetProduct.id]: `Sanitization: ${targetProduct.care}`,
      },
      updatedContext: {
        ...context,
        lastOutfitId: targetProduct.id,
        lastOutfitName: targetProduct.name,
      },
    };
  }

  if (isAskingColors) {
    const colorNames = targetProduct.colors.map((c) => c.name).join(', ');
    return {
      reply: `Available in ${colorNames}.`,
      products: [targetProduct],
      matchRationale: {
        [targetProduct.id]: `Colors: ${colorNames}`,
      },
      updatedContext: {
        ...context,
        lastOutfitId: targetProduct.id,
        lastOutfitName: targetProduct.name,
      },
    };
  }

  return null;
}

/**
 * Primary Natural Language Processing & Catalog Recommendation Engine
 */
export function processStylistQuery(
  userQuery: string,
  historyMessages: { sender: 'user' | 'reni'; text: string }[] = [],
  currentContext: UserContext = {}
): StylingResult {
  const query = userQuery.trim().toLowerCase();
  const newContext: UserContext = { ...currentContext };

  // -------------------------------------------------------------
  // 1. SPECIFIC PRODUCT ATTRIBUTE QUERY CHECK
  // -------------------------------------------------------------
  const directDetailResult = handleProductDetailInquiry(query, newContext);
  if (directDetailResult) {
    return directDetailResult;
  }

  // -------------------------------------------------------------
  // 2. PARSE REQUESTED QUANTITY
  // -------------------------------------------------------------
  const explicitCount = extractRequestedCount(query);
  if (explicitCount) {
    newContext.requestedCount = explicitCount;
  }

  // -------------------------------------------------------------
  // 3. PARSE BUDGET & AFFORDABILITY FOLLOW-UP
  // -------------------------------------------------------------
  const isAskingCheaper =
    query.includes('affordable') ||
    query.includes('cheaper') ||
    query.includes('less expensive') ||
    query.includes('lower price') ||
    query.includes('budget option');

  const budgetMatch =
    query.match(/(?:under|below|budget|less than|max|up to|within|₹)\s*(\d{3,5})/i) ||
    query.match(/(\d{3,5})\s*(?:rupees|rs|inr|₹)?\s*(?:max|budget|under|below)/i);

  if (budgetMatch && budgetMatch[1]) {
    const num = parseInt(budgetMatch[1], 10);
    if (num >= 200) {
      newContext.budgetCap = num;
    }
  } else if (isAskingCheaper && newContext.budgetCap) {
    // Drop budget by 20-30%
    newContext.budgetCap = Math.max(400, Math.round(newContext.budgetCap * 0.75));
  } else if (isAskingCheaper && newContext.lastOutfitId) {
    const prev = PRODUCTS.find((p) => p.id === newContext.lastOutfitId);
    if (prev) {
      newContext.budgetCap = Math.max(400, prev.rentalPrice4Days - 200);
    }
  }

  // -------------------------------------------------------------
  // 4. PARSE GENDER & GENDER SWITCH FOLLOW-UP
  // -------------------------------------------------------------
  const isAskingMen =
    query.includes('man') ||
    query.includes('men') ||
    query.includes('him') ||
    query.includes('husband') ||
    query.includes('brother') ||
    query.includes('groom') ||
    query.includes('male') ||
    query.includes('guy') ||
    query.includes('boy');

  const isAskingWomen =
    query.includes('woman') ||
    query.includes('women') ||
    query.includes('her') ||
    query.includes('wife') ||
    query.includes('sister') ||
    query.includes('bride') ||
    query.includes('female') ||
    query.includes('girl') ||
    query.includes('lady');

  if (isAskingMen) {
    newContext.genderPreference = 'him';
  } else if (isAskingWomen) {
    newContext.genderPreference = 'her';
  }

  // -------------------------------------------------------------
  // 5. PARSE COLOR & COLOR CHANGE FOLLOW-UP
  // -------------------------------------------------------------
  const isAskingAnotherColor =
    query.includes('another colour') ||
    query.includes('another color') ||
    query.includes('different color') ||
    query.includes('different colour') ||
    query.includes('other colors') ||
    query.includes('other colours');

  let detectedColor: string | null = null;
  for (const c of COLOR_KEYWORDS) {
    // word boundary regex for color to avoid substrings
    const colorRegex = new RegExp(`\\b${c}\\b`, 'i');
    if (colorRegex.test(query)) {
      detectedColor = c;
      break;
    }
  }

  if (detectedColor) {
    newContext.lastColor = detectedColor;
  } else if (isAskingAnotherColor) {
    // Clear last color to allow alternatives
    newContext.lastColor = undefined;
  }

  // -------------------------------------------------------------
  // 6. PARSE SIZE PREFERENCE
  // -------------------------------------------------------------
  const detectedSize = extractSize(query);
  if (detectedSize) {
    newContext.preferredSize = detectedSize;
  }

  // -------------------------------------------------------------
  // 7. PARSE OCCASION
  // -------------------------------------------------------------
  for (const [key, occId] of Object.entries(OCCASION_MAP)) {
    if (query.includes(key)) {
      newContext.lastOccasion = occId;
      break;
    }
  }

  // -------------------------------------------------------------
  // 8. PARSE REQUESTED ITEM TYPE
  // -------------------------------------------------------------
  const isEarringReq =
    query.includes('earring') ||
    query.includes('jhumka') ||
    query.includes('huggie') ||
    query.includes('chandbali');

  const isNecklaceReq =
    query.includes('necklace') ||
    query.includes('choker') ||
    query.includes('pendant') ||
    query.includes('chain');

  const isBangleReq =
    query.includes('bangle') ||
    query.includes('bracelet') ||
    query.includes('kada');

  const isJewelryReq =
    isEarringReq ||
    isNecklaceReq ||
    isBangleReq ||
    query.includes('jewel') ||
    query.includes('bijoux') ||
    query.includes('jewellery') ||
    query.includes('jewelry');

  const isFootwearReq =
    query.includes('footwear') ||
    query.includes('shoe') ||
    query.includes('heel') ||
    query.includes('jutti') ||
    query.includes('mojari') ||
    query.includes('mule') ||
    query.includes('stiletto') ||
    query.includes('loafer') ||
    query.includes('sneaker') ||
    query.includes('oxford') ||
    query.includes('derby');

  const isBagReq =
    query.includes('bag') ||
    query.includes('handbag') ||
    query.includes('clutch') ||
    query.includes('potli') ||
    query.includes('minaudiere') ||
    query.includes('tote') ||
    query.includes('crossbody');

  const isBeltReq = query.includes('belt') || query.includes('waist');
  const isBowReq = query.includes('bow') || query.includes('barrette') || query.includes('hair');
  const isWatchReq = query.includes('watch') || query.includes('cufflink') || query.includes('tie') || query.includes('bowtie') || query.includes('stole');

  const isAnyAccessoryReq =
    isJewelryReq ||
    isFootwearReq ||
    isBagReq ||
    isBeltReq ||
    isBowReq ||
    isWatchReq ||
    query.includes('accessory') ||
    query.includes('accessories');

  // Apparel types
  const isLehengaReq = query.includes('lehenga') || query.includes('chaniya');
  const isSareeReq = query.includes('saree') || query.includes('sari');
  const isGownReq = query.includes('gown') || query.includes('evening dress');
  const isDressReq = query.includes('dress') || query.includes('mini dress') || query.includes('slip dress');
  const isSherwaniReq = query.includes('sherwani') || query.includes('achkan');
  const isTuxedoReq = query.includes('tuxedo') || query.includes('tux');
  const isSuitReq = query.includes('suit') || query.includes('three-piece') || query.includes('power suit');
  const isKurtaReq = query.includes('kurta') || query.includes('kedia') || query.includes('nehru');
  const isBandhgalaReq = query.includes('bandhgala') || query.includes('jodhpuri');
  const isBlazerReq = query.includes('blazer') || query.includes('jacket');
  const isAnarkaliReq = query.includes('anarkali') || query.includes('sharara');
  const isCoordReq = query.includes('co-ord') || query.includes('coord');

  const isApparelReq =
    isLehengaReq ||
    isSareeReq ||
    isGownReq ||
    isDressReq ||
    isSherwaniReq ||
    isTuxedoReq ||
    isSuitReq ||
    isKurtaReq ||
    isBandhgalaReq ||
    isBlazerReq ||
    isAnarkaliReq ||
    isCoordReq ||
    query.includes('outfit') ||
    query.includes('look') ||
    query.includes('attire') ||
    query.includes('wear');

  // -------------------------------------------------------------
  // 9. CHECK FOR VAGUE INPUT (CLARIFICATION REQUIRED)
  // -------------------------------------------------------------
  const isGreetingOnly =
    /^(hi|hello|hey|good morning|good afternoon|good evening|namaste)[\s!.]*$/i.test(query);

  const isGenericStyleRequest =
    /^(help me style|style me|suggest something|what should i rent|rent something|recommend an outfit|i need an outfit)[\s!.]*$/i.test(query);

  if (isGreetingOnly) {
    return {
      reply: "Hello! I am RÉNÉ, your personal fashion stylist at RENTORA. To begin, could you share the occasion you are dressing for, or whether you are looking for women's or men's attire?",
      products: [],
      matchRationale: {},
      updatedContext: newContext,
    };
  }

  if (isGenericStyleRequest && !newContext.lastOccasion && !newContext.genderPreference && !newContext.lastColor) {
    return {
      reply: "I would be glad to style you. Could you share what occasion you are attending, and whether you are looking for women's or men's attire?",
      products: [],
      matchRationale: {},
      updatedContext: newContext,
    };
  }

  // -------------------------------------------------------------
  // 10. CATALOG FILTERING LOGIC
  // -------------------------------------------------------------
  let candidatePool = [...PRODUCTS];
  const targetCount = newContext.requestedCount || 2;

  // Case 1: Accessory Specific Request (EXACT CATEGORY ISOLATION)
  if (isAnyAccessoryReq && !isApparelReq) {
    candidatePool = candidatePool.filter((p) => p.category === 'accessory');

    if (isEarringReq) {
      candidatePool = candidatePool.filter(
        (p) =>
          p.subCategory.includes('Jewellery') &&
          (p.name.toLowerCase().includes('earring') ||
            p.name.toLowerCase().includes('jhumka') ||
            p.name.toLowerCase().includes('huggie') ||
            p.name.toLowerCase().includes('chandelier'))
      );
    } else if (isNecklaceReq) {
      candidatePool = candidatePool.filter(
        (p) =>
          p.subCategory.includes('Jewellery') &&
          (p.name.toLowerCase().includes('choker') ||
            p.name.toLowerCase().includes('necklace') ||
            p.name.toLowerCase().includes('chain'))
      );
    } else if (isBangleReq) {
      candidatePool = candidatePool.filter(
        (p) =>
          p.subCategory.includes('Jewellery') &&
          (p.name.toLowerCase().includes('bangle') ||
            p.name.toLowerCase().includes('bracelet') ||
            p.name.toLowerCase().includes('kada'))
      );
    } else if (isJewelryReq) {
      candidatePool = candidatePool.filter((p) => p.subCategory.includes('Jewellery'));
    } else if (isFootwearReq) {
      candidatePool = candidatePool.filter(
        (p) =>
          p.subCategory.includes('Shoes') ||
          p.subCategory.includes('Footwear') ||
          p.name.toLowerCase().includes('heel') ||
          p.name.toLowerCase().includes('jutti') ||
          p.name.toLowerCase().includes('mojari') ||
          p.name.toLowerCase().includes('mule') ||
          p.name.toLowerCase().includes('stiletto') ||
          p.name.toLowerCase().includes('loafer') ||
          p.name.toLowerCase().includes('sneaker') ||
          p.name.toLowerCase().includes('oxford') ||
          p.name.toLowerCase().includes('derby')
      );
    } else if (isBagReq) {
      candidatePool = candidatePool.filter(
        (p) =>
          p.subCategory.includes('Bags') ||
          p.subCategory.includes('Clutches') ||
          p.name.toLowerCase().includes('bag') ||
          p.name.toLowerCase().includes('clutch') ||
          p.name.toLowerCase().includes('potli') ||
          p.name.toLowerCase().includes('minaudiere')
      );
    } else if (isBeltReq) {
      candidatePool = candidatePool.filter((p) => p.name.toLowerCase().includes('belt'));
    } else if (isBowReq) {
      candidatePool = candidatePool.filter((p) => p.name.toLowerCase().includes('bow') || p.name.toLowerCase().includes('barrette'));
    } else if (isWatchReq) {
      candidatePool = candidatePool.filter(
        (p) =>
          p.name.toLowerCase().includes('watch') ||
          p.name.toLowerCase().includes('tie') ||
          p.name.toLowerCase().includes('cufflink') ||
          p.name.toLowerCase().includes('stole')
      );
    }

    // "Lower Price" Quick Question intent filter for accessories
    if (isAskingCheaper && newContext.lastOutfitId) {
      const prev = PRODUCTS.find((p) => p.id === newContext.lastOutfitId);
      if (prev) {
        const cheaperAccs = candidatePool.filter((p) => p.rentalPrice4Days < prev.rentalPrice4Days);
        if (cheaperAccs.length > 0) candidatePool = cheaperAccs;
      }
    }

    // Color filter on accessories
    if (newContext.lastColor) {
      const colorMatches = candidatePool.filter((p) => {
        const text = (p.name + ' ' + p.description + ' ' + (p.colors[0]?.name || '')).toLowerCase();
        return text.includes(newContext.lastColor!);
      });
      if (colorMatches.length > 0) candidatePool = colorMatches;
    }

    // Budget filter
    if (newContext.budgetCap) {
      const budgetMatches = candidatePool.filter((p) => p.rentalPrice4Days <= newContext.budgetCap!);
      if (budgetMatches.length > 0) {
        candidatePool = budgetMatches;
      } else {
        return {
          reply: `No matching products found in this collection under ₹${newContext.budgetCap}. Our accessory rentals in this category begin at ₹${Math.min(...candidatePool.map((p) => p.rentalPrice4Days))} for a 4-day reservation.`,
          products: [],
          matchRationale: {},
          updatedContext: newContext,
        };
      }
    }

    if (candidatePool.length === 0) {
      return {
        reply: "No matching products found in this collection.",
        products: [],
        matchRationale: {},
        updatedContext: newContext,
      };
    }

    const selectedAccessories = candidatePool.slice(0, explicitCount || Math.min(candidatePool.length, 3));
    const matchRationale: Record<string, string> = {};
    selectedAccessories.forEach((p) => {
      matchRationale[p.id] = `${p.name}: Hand-crafted ${p.subCategory} piece matching your specifications (₹${p.rentalPrice4Days}/4 days).`;
    });

    const categoryTitle = isEarringReq
      ? 'Earrings'
      : isNecklaceReq
      ? 'Necklaces'
      : isBangleReq
      ? 'Bangles'
      : isJewelryReq
      ? 'Jewellery'
      : isFootwearReq
      ? 'Footwear'
      : isBagReq
      ? 'Bags & Clutches'
      : 'Accessories';

    return {
      reply: `Here are matching ${categoryTitle.toLowerCase()} options from our RENTORA collection:`,
      products: selectedAccessories,
      matchRationale,
      updatedContext: newContext,
    };
  }

  // Case 2: Apparel & Outfits
  if (newContext.genderPreference) {
    candidatePool = candidatePool.filter((p) => p.category === newContext.genderPreference);
  }

  // Apparel sub-type filtering
  if (isLehengaReq) {
    candidatePool = candidatePool.filter((p) => p.subCategory.includes('Lehengas') || p.name.toLowerCase().includes('lehenga') || p.name.toLowerCase().includes('choli'));
  } else if (isSareeReq) {
    candidatePool = candidatePool.filter((p) => p.subCategory.includes('Sarees') || p.name.toLowerCase().includes('saree'));
  } else if (isGownReq) {
    candidatePool = candidatePool.filter((p) => p.subCategory.includes('Gowns') || p.name.toLowerCase().includes('gown'));
  } else if (isDressReq) {
    candidatePool = candidatePool.filter((p) => p.subCategory.includes('Dresses') || p.name.toLowerCase().includes('dress'));
  } else if (isSherwaniReq) {
    candidatePool = candidatePool.filter((p) => p.name.toLowerCase().includes('sherwani') || p.subCategory.includes('Sherwanis'));
  } else if (isTuxedoReq) {
    candidatePool = candidatePool.filter((p) => p.name.toLowerCase().includes('tuxedo'));
  } else if (isSuitReq) {
    candidatePool = candidatePool.filter((p) => p.subCategory.includes('Suits') || p.name.toLowerCase().includes('suit'));
  } else if (isKurtaReq) {
    candidatePool = candidatePool.filter((p) => p.subCategory.includes('Kurtas') || p.name.toLowerCase().includes('kurta'));
  } else if (isBandhgalaReq) {
    candidatePool = candidatePool.filter((p) => p.name.toLowerCase().includes('bandhgala'));
  } else if (isBlazerReq) {
    candidatePool = candidatePool.filter((p) => p.name.toLowerCase().includes('blazer') || p.name.toLowerCase().includes('jacket'));
  } else if (isAnarkaliReq) {
    candidatePool = candidatePool.filter((p) => p.name.toLowerCase().includes('anarkali') || p.name.toLowerCase().includes('sharara'));
  } else if (isCoordReq) {
    candidatePool = candidatePool.filter((p) => p.name.toLowerCase().includes('co-ord') || p.name.toLowerCase().includes('set'));
  }

  // Occasion filtering
  if (newContext.lastOccasion) {
    const occMatches = candidatePool.filter((p) => p.occasions.includes(newContext.lastOccasion!));
    if (occMatches.length > 0) {
      candidatePool = occMatches;
    }
  }

  // Color filtering & "another colour" follow-up
  if (newContext.lastColor) {
    const colorMatches = candidatePool.filter((p) => {
      const text = (p.name + ' ' + p.description + ' ' + p.colors.map((c) => c.name).join(' ')).toLowerCase();
      return text.includes(newContext.lastColor!);
    });
    if (colorMatches.length > 0) {
      candidatePool = colorMatches;
    } else {
      // If no exact color match, do not hallucinate
      return {
        reply: "No matching products found in this collection.",
        products: [],
        matchRationale: {},
        updatedContext: newContext,
      };
    }
  } else if (isAskingAnotherColor && newContext.lastOutfitId) {
    const prevProduct = PRODUCTS.find((p) => p.id === newContext.lastOutfitId);
    if (prevProduct) {
      const prevColorNames = prevProduct.colors.map((c) => c.name.toLowerCase()).join(' ');
      const alternativeColorItems = candidatePool.filter((p) => {
        const itemColors = p.colors.map((c) => c.name.toLowerCase()).join(' ');
        return itemColors !== prevColorNames && p.id !== prevProduct.id;
      });
      if (alternativeColorItems.length > 0) {
        candidatePool = alternativeColorItems;
      }
    }
  }

  // Size filtering
  if (newContext.preferredSize) {
    const sizeMatches = candidatePool.filter((p) =>
      p.sizes.some((s) => s.toLowerCase() === newContext.preferredSize!.toLowerCase() || s.toLowerCase().includes(newContext.preferredSize!.toLowerCase()))
    );
    if (sizeMatches.length > 0) {
      candidatePool = sizeMatches;
    } else {
      return {
        reply: "No matching products found in this collection.",
        products: [],
        matchRationale: {},
        updatedContext: newContext,
      };
    }
  }

  // Budget filtering
  if (newContext.budgetCap) {
    const budgetMatches = candidatePool.filter((p) => p.rentalPrice4Days <= newContext.budgetCap!);
    if (budgetMatches.length > 0) {
      candidatePool = budgetMatches;
    } else {
      return {
        reply: "No matching products found in this collection.",
        products: [],
        matchRationale: {},
        updatedContext: newContext,
      };
    }
  }

  // Ensure candidates are available
  if (candidatePool.length === 0) {
    return {
      reply: "No matching products found in this collection.",
      products: [],
      matchRationale: {},
      updatedContext: newContext,
    };
  }

  // Select exact requested count
  const finalProducts = candidatePool.slice(0, explicitCount || Math.min(candidatePool.length, targetCount));

  // Update context with the primary outfit
  if (finalProducts.length > 0) {
    newContext.lastOutfitId = finalProducts[0].id;
    newContext.lastOutfitName = finalProducts[0].name;
    newContext.lastOutfit = finalProducts[0].subCategory;
    newContext.lastRecommendedIds = finalProducts.map((p) => p.id);
  }

  // Build specific, elegant match rationales for each product
  const matchRationale: Record<string, string> = {};
  finalProducts.forEach((p) => {
    const colorName = p.colors[0]?.name || 'Classic';
    const sizePreview = p.sizes.slice(0, 3).join(', ');
    matchRationale[p.id] = `${p.fabric} in ${colorName} (Sizes: ${sizePreview}). Rents at ₹${p.rentalPrice4Days} for 4 days.`;
  });

  // Construct direct, professional response text
  const countWord = finalProducts.length === 1 ? 'one standout recommendation' : `exactly ${finalProducts.length} curated options`;
  const genderDescriptor = newContext.genderPreference === 'him' ? "men's" : newContext.genderPreference === 'her' ? "women's" : '';
  const occasionDescriptor = newContext.lastOccasion ? ` for your celebration` : '';
  const budgetDescriptor = newContext.budgetCap ? ` under ₹${newContext.budgetCap}` : '';
  const colorDescriptor = newContext.lastColor ? ` in ${newContext.lastColor}` : '';

  let replyText = `Here is ${countWord} from the RENTORA collection${genderDescriptor ? ` for ${genderDescriptor} couture` : ''}${colorDescriptor}${occasionDescriptor}${budgetDescriptor}:`;

  return {
    reply: replyText,
    products: finalProducts,
    matchRationale,
    updatedContext: newContext,
  };
}

export interface ProductStylingNote {
  whyItWorks: string;
  stylingTip: string;
  recommendedAccessories: Product[];
}

export const PRODUCT_SPECIFIC_STYLING_TIPS: Record<string, { tip: string; why: string }> = {
  // HER
  'her-1': {
    tip: "Style with polki choker or gold jhumkas and champagne kitten heels.",
    why: "The intricate threadwork pairs effortlessly with heritage gold accents for timeless bridal radiance."
  },
  'her-2': {
    tip: "Pair with a heritage Kundan necklace and a micro potli bag.",
    why: "Rich crimson velvet commands regal presence, best complemented by antique gold jewellery."
  },
  'her-3': {
    tip: "Style with pastel rose drop earrings and sleek metallic strap heels.",
    why: "Soft blush silk drapes gracefully for summer day weddings and sangeet celebrations."
  },
  'her-4': {
    tip: "Pair with delicate chandbali earrings and embroidered mojaris.",
    why: "Flowing georgette kalis create flattering vertical lines, ideal for festive daytime gatherings."
  },
  'her-5': {
    tip: "Add statement oxidized gold jhumkas and a sleek raw silk clutch.",
    why: "The authentic silk weave holds structure beautifully, exuding quiet royal sophistication."
  },
  'her-6': {
    tip: "Style with minimal diamond studs and strappy stiletto heels.",
    why: "Liquid satin silhouette creates a sleek, contemporary line designed for high-profile evening soirees."
  },
  'her-7': {
    tip: "Pair with clean block heels and a structured minimal tote.",
    why: "Breathable crisp tailoring allows seamless day-to-evening versatility."
  },
  'her-8': {
    tip: "Wear with oxidized silver tribal bangles, mirrorwork waist belt, and juttis.",
    why: "High-volume flare and mirror accents catch dramatic light during high-energy Garba twirls."
  },
  'her-9': {
    tip: "Complete with golden jhumkas and a contrasting sheer organza dupatta.",
    why: "The tiered sharara flare balances festive vibrancy with comfortable movement."
  },
  'her-10': {
    tip: "Style with diamond drop earrings and a metallic box clutch.",
    why: "Liquid metallic satin sculpts an hourglass silhouette under gala chandeliers."
  },
  'her-11': {
    tip: "Add delicate pearl studs and kitten heels for a sweet romantic vibe.",
    why: "Playful cut and soft blush palette create an effortless celebratory charm."
  },
  'her-12': {
    tip: "Pair with pointed black ankle boots and a sculptural mini bag.",
    why: "Sharp structural seams give this mini dress an undeniable baddie edge."
  },
  'her-13': {
    tip: "Style with a silk camisole underneath and pointed-toe leather pumps.",
    why: "Neutral beige double-breasted tailoring conveys understated modern authority."
  },
  'her-14': {
    tip: "Pair with woven raffia sandals and gold hoop earrings.",
    why: "Breezy tiered cotton maximizes movement and sun-drenched resort relaxation."
  },
  'her-15': {
    tip: "Match with uncut diamond jewellery and metallic champagne block heels.",
    why: "Gilded silk embroidery create an illustrious glow for intimate engagement ceremonies."
  },
  'her-16': {
    tip: "Keep accessories sculptural and architectural with sleek wet-look hair.",
    why: "High-fashion silhouette is engineered specifically for lens depth and photographic drama."
  },
  'her-suit-sovereign-plum': {
    tip: "Style with gold vermeil earrings and a silk camisole for high-contrast evening drama.",
    why: "Deep plum micro-velvet catches low ambient light with rich, tactile depth."
  },
  'her-dress-velvet-coquette': {
    tip: "Style with patent Mary Janes, pearl drop earrings, and sheer hosiery.",
    why: "Oversized back bow and plush black velvet embody whimsical French coquette glamour."
  },
  'her-dress-vintage-slip': {
    tip: "Pair with minimal barely-there sandals and a delicate gold clavicle chain.",
    why: "Bias-cut buttercream satin skims natural contours for timeless Hollywood glamour."
  },

  // HIM
  'him-1': {
    tip: "Pair with a crisp silk bow tie, onyx studs, and polished patent leather oxfords.",
    why: "Structured wool tailoring and satin lapels define timeless black-tie sophistication."
  },
  'him-2': {
    tip: "Style with a crisp white poplin shirt, silk tie, and dark cognac oxfords.",
    why: "Sharp three-piece architecture offers commanding presence at formal galas and corporate evenings."
  },
  'him-3': {
    tip: "Match this royal sherwani with gold-toned mojari shoes and a layered pearl mala.",
    why: "Zardosi hand embroidery on royal velvet evokes authentic Maharaja heritage."
  },
  'him-4': {
    tip: "Style with blush-toned mojaris and an antique emerald safa brooch.",
    why: "Subtle tone-on-tone embroidery on pristine ivory silk radiates refined luxury."
  },
  'him-5': {
    tip: "Pair with tailored black trousers and velvet slip-on loafers.",
    why: "Asymmetrical cut merges modern runway drape with festive Indian opulence."
  },
  'him-6': {
    tip: "Pair with tan Kolhapuri chappals or soft suede mojaris.",
    why: "Fine-spun breathable cotton keeps puja and festive afternoons effortlessly comfortable."
  },
  'him-7': {
    tip: "Complete with polished black monk straps and a crisp silk pocket square.",
    why: "High-neck bandhgala silhouette stands out with clean, dignified martial tailoring."
  },
  'him-8': {
    tip: "Layer over a fine-gauge knit turtleneck or dress shirt with Chelsea boots.",
    why: "Sharp single-breasted shoulder cut transitions effortlessly between day and evening occasions."
  },
  'him-9': {
    tip: "Finish with dark leather loafers and a patterned silk pocket square.",
    why: "Deep royal blue wool captures nightclub and cocktail illumination with rich luster."
  },
  'him-10': {
    tip: "Wear with embroidered mojari shoes and a vibrant festive turban or brooch.",
    why: "Flared silhouette and bright embroidery create high visual impact on the Garba circle."
  },
  'him-11': {
    tip: "Pair with off-white churidar and braided leather juttis.",
    why: "Contemporary print work on crisp cotton maintains all-day breathability and style."
  },
  'him-12': {
    tip: "Pair with woven leather loafers or suede espadrilles for relaxed summer elegance.",
    why: "Pure European linen keeps you cool and poised in coastal and warm-weather settings."
  },
  'him-13': {
    tip: "Style with leather slip-on slides and acetate sunglasses.",
    why: "Airy relaxed cut delivers effortless luxury on vacations and yacht gatherings."
  },
  'him-14': {
    tip: "Pair with a tailored silk kurta and pointed leather mojaris.",
    why: "Structured silk waistcoat anchors traditional kurta sets with sharp definition."
  },
  'him-15': {
    tip: "Style with raw silk mojaris and a minimalist gold watch.",
    why: "Rich zari weave delivers wedding-ready grandeur without excessive weight."
  },
  'him-16': {
    tip: "Keep lines ultra-clean with polished patent derby shoes.",
    why: "Dramatic architectural silhouette is crafted specifically for cinematic editorial portraits."
  },
  'him-suit-tuxedo-charcoal': {
    tip: "Pair with patent leather oxfords, mother-of-pearl cufflinks, and silk bow tie.",
    why: "Savile Row shawl collar cut from Super 140s wool creates quintessential gentleman charm."
  },
  'him-indowestern-emerald-zari': {
    tip: "Style with black velvet loafers and an antique gold brooch.",
    why: "Deep jewel-tone emerald velvet offers regal distinction across sangeet and reception nights."
  },
  'him-kurta-mirrorwork-rose': {
    tip: "Pair with ivory silk pyjamas and gold-thread embroidered juttis.",
    why: "Dusty rose palette and micro-mirror details provide soft romantic poise for day weddings."
  },
  'him-velvet-smoking-jacket': {
    tip: "Style with tapered black dress trousers and embroidered velvet slippers.",
    why: "Satin peak lapels and micro-velvet exude decadent Old Hollywood and speakeasy elegance."
  },
  'him-street-overcoat-rosewood': {
    tip: "Layer over an oversized neutral knit sweater and chunky leather derbies.",
    why: "Double-breasted drop-shoulder structure delivers effortless contemporary runway proportion."
  },
  'her-dress-editorial-burgundy': {
    tip: "Keep hair in a sleek low bun and wear architectural silver earrings to mirror the gown's sharp lines.",
    why: "Sculpted wine-toned tailoring is designed specifically for dramatic silhouettes in professional photography."
  },
  'acc-kundan-jhumkas': {
    tip: "Wear with an elegant updo to let the intricate Jadau craftsmanship and pearl drops catch every light.",
    why: "Traditional Kundan work reflects heritage radiance, beautifully framing the face for wedding festivities."
  },
  'acc-pearl-choker': {
    tip: "Pair with a boat-neck gown or a deep-neck lehenga blouse to highlight the delicate collarbone drape.",
    why: "Timeless multi-strand pearls add a touch of Grace Kelly sophistication to modern luxury couture."
  },
  'acc-velvet-embroidered-loafers': {
    tip: "Pair with ankle-grazing trousers or traditional dhotis to showcase the intricate gold zari embroidery.",
    why: "Hand-crafted velvet construction brings artisanal detail and cushioned luxury to festive movement."
  },
  'acc-boho-silver-belt': {
    tip: "Cinch around the waist of a fluid georgette lehenga or a plain silk saree for a rhythmic, tribal-chic accent.",
    why: "Antique silver finish and tinkling ghungroos create a captivating auditory and visual festive experience."
  },
  'acc-gold-potli-bag': {
    tip: "Carry with a contrasting deep-toned lehenga to let the gold embroidery pop as a standalone statement.",
    why: "The traditional drawstring silhouette and rich Zardosi work make it an essential bridal accessory."
  },
  'acc-crystal-stiletto-heels': {
    tip: "Style with a floor-length evening gown or a chic cocktail dress for an instant elongating effect.",
    why: "Light-catching crystal embellishments add high-octane glamour to every step on the red carpet."
  }
};

/**
 * Generates an accurate, professional styling note and matching accessory recommendations for product detail page
 */
export function generateProductStylingNote(
  product: Product | null | undefined,
  selectedMoodId?: string
): ProductStylingNote {
  if (!product) {
    return {
      whyItWorks: "Curated for balanced silhouette structure, photographic depth, and sophisticated evening presence.",
      stylingTip: "Pair with balanced jewellery and refined footwear to let the core craftsmanship remain the focal point.",
      recommendedAccessories: [],
    };
  }

  // Find complementary accessories from catalog
  let recommendedAccessories: Product[] = [];
  if (product.matchingAccessories && product.matchingAccessories.length > 0) {
    recommendedAccessories = PRODUCTS.filter((p) => product.matchingAccessories!.includes(p.id));
  }

  // Filter recommended accessories strictly by product category
  if (product.category === 'him') {
    recommendedAccessories = recommendedAccessories.filter(
      (p) =>
        p.id.startsWith('acc-men-') ||
        p.id === 'acc-velvet-embroidered-loafers' ||
        p.id === 'acc-clean-sneaker' ||
        p.brand.toLowerCase().includes('men') ||
        p.name.toLowerCase().includes('men')
    );
    if (recommendedAccessories.length === 0) {
      recommendedAccessories = PRODUCTS.filter(
        (p) =>
          p.category === 'accessory' &&
          (p.id.startsWith('acc-men-') ||
            p.id === 'acc-velvet-embroidered-loafers' ||
            p.id === 'acc-clean-sneaker' ||
            p.name.toLowerCase().includes('derby') ||
            p.name.toLowerCase().includes('loafer') ||
            p.name.toLowerCase().includes('cufflink') ||
            p.name.toLowerCase().includes('watch'))
      ).slice(0, 3);
    }
  } else if (product.category === 'her') {
    recommendedAccessories = recommendedAccessories.filter(
      (p) =>
        !p.id.startsWith('acc-men-') &&
        p.id !== 'acc-velvet-embroidered-loafers' &&
        !p.brand.toLowerCase().includes('men')
    );
    if (recommendedAccessories.length === 0) {
      recommendedAccessories = PRODUCTS.filter(
        (p) =>
          p.category === 'accessory' &&
          !p.id.startsWith('acc-men-') &&
          p.id !== 'acc-velvet-embroidered-loafers' &&
          !p.brand.toLowerCase().includes('men') &&
          (p.name.toLowerCase().includes('choker') ||
            p.name.toLowerCase().includes('jhumka') ||
            p.name.toLowerCase().includes('clutch') ||
            p.name.toLowerCase().includes('heel'))
      ).slice(0, 3);
    }
  }


  const primaryColor = product.colors[0]?.name || '';
  const subCat = product.subCategory.toLowerCase();
  const fabric = product.fabric.toLowerCase();
  const name = product.name.toLowerCase();
  
  // 1. Direct product ID lookup for exact tailored match
  if (PRODUCT_SPECIFIC_STYLING_TIPS[product.id]) {
    const specific = PRODUCT_SPECIFIC_STYLING_TIPS[product.id];
    return {
      whyItWorks: specific.why,
      stylingTip: specific.tip,
      recommendedAccessories: recommendedAccessories.slice(0, 3),
    };
  }

  // 2. Intelligent dynamic fallback based on piece attributes
  let stylingTip = "";
  let whyItWorks = `This ${fabric} ${product.category === 'him' ? 'ensemble' : 'outfit'} offers an elegant drape and sophisticated silhouette.`;
  
  if (name.includes('sherwani')) {
    stylingTip = "Pair with embroidered juttis and a classic gold watch.";
    whyItWorks = "Royal silhouette structured with heritage embroidery for stately wedding celebrations.";
  } else if (name.includes('lehenga')) {
    stylingTip = "Style with gold jhumkas and elegant heels.";
    whyItWorks = "Flared hemline and artisanal border work elevate photographic presence on dance floors.";
  } else if (name.includes('gown')) {
    stylingTip = "Complete the look with minimal diamond earrings.";
    whyItWorks = "Sweeping floor-length drape creates flattering elongating lines under evening lights.";
  } else if (name.includes('kurta')) {
    stylingTip = "Pair with neutral mojaris and a subtle watch.";
    whyItWorks = "Breathable fabric tailoring combines easy movement with festive refinement.";
  } else if (name.includes('saree')) {
    stylingTip = "Add statement earrings and a sleek clutch.";
    whyItWorks = "Timeless drape and ornate pallu detailing highlight traditional craftsmanship.";
  } else if (subCat.includes('suits') || name.includes('tuxedo')) {
    stylingTip = "Finish with polished loafers and a silk pocket square for a sharp presence.";
    whyItWorks = "Precision shoulder padding and lapel roll create an authoritative tailoring profile.";
  } else if (subCat.includes('dresses')) {
    stylingTip = "Style with minimal jewelry and strappy heels for a modern evening silhouette.";
    whyItWorks = "Clean contemporary lines allow subtle accessories to shine with balanced poise.";
  } else if (fabric.includes('velvet')) {
    stylingTip = "Add statement earrings and a sleek clutch to contrast the rich velvet fabric.";
    whyItWorks = "Plush pile fabric catches dim ambient lighting for luxurious evening depth.";
  } else if (primaryColor.toLowerCase().includes('pastel')) {
    stylingTip = "Pair with neutral mojaris and a subtle watch for a soft romantic vibe.";
    whyItWorks = "Soft tonal hues flatter warm daylight ceremonies and golden hour portraits.";
  } else if (product.category === 'accessory') {
    stylingTip = `Elevates any ${subCat.includes('jewellery') ? 'ethnic silhouette' : 'formal look'} with refined craftsmanship.`;
    whyItWorks = "Architectural accent piece designed to harmonize with statement outfits.";
  } else {
    const acc = recommendedAccessories[0]?.name || 'minimal jewelry';
    stylingTip = `Pair with ${acc} to highlight the intricate ${fabric} craftsmanship.`;
  }

  return {
    whyItWorks,
    stylingTip,
    recommendedAccessories: recommendedAccessories.slice(0, 3),
  };
}

/**
 * Generates an occasion styling note for ProductDetailModal
 */
export function generateStyledForMomentNote(product: Product | null | undefined) {
  if (!product) {
    return {
      title: 'Curated Look',
      note: 'Tailored for elegant celebration moments.',
    };
  }
  const primaryOccasion = product.occasions[0] || 'Celebrations';
  const occasionFormatted = primaryOccasion.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  return {
    title: `Styled for ${occasionFormatted}`,
    note: `Crafted in ${product.fabric} for effortless style and comfort.`,
  };
}

