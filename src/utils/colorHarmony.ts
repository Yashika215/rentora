import { Product } from '../data/catalog';

export interface ColorSwatchItem {
  name: string;
  hex: string;
  role: 'primary' | 'secondary' | 'accent';
}

export interface ProductColorHarmony {
  harmonyName: string;
  primaryColor: { name: string; hex: string };
  secondaryColor?: { name: string; hex: string };
  accentColor?: { name: string; hex: string };
  isMulticolor?: boolean;
  multicolorGradient?: string;
  swatches: ColorSwatchItem[];
  compatibleHues: string[];
}

export const COLOR_OVERRIDES_KEY = 'rentora_color_overrides_v1';

/**
 * Master catalog color harmony database for all RENTORA products (For Her, For Him, Accessories)
 * Formulated with precise fashion color palettes, metallic accents, and embroidery tones.
 */
export const CATALOG_COLOR_HARMONY: Record<string, ProductColorHarmony> = {
  // ==================== FOR HER ====================
  'her-1': {
    harmonyName: 'Onyx Black & Liquid Gold',
    primaryColor: { name: 'Midnight Onyx Black', hex: '#0A0A0A' },
    secondaryColor: { name: 'Metallic Lamé Gold', hex: '#D4AF37' },
    accentColor: { name: 'Champagne Shimmer', hex: '#F7E7CE' },
    swatches: [
      { name: 'Midnight Onyx Black', hex: '#0A0A0A', role: 'primary' },
      { name: 'Metallic Lamé Gold', hex: '#D4AF37', role: 'secondary' },
      { name: 'Champagne Shimmer', hex: '#F7E7CE', role: 'accent' },
    ],
    compatibleHues: ['Gold', 'Champagne', 'Onyx', 'Diamond', 'Emerald'],
  },
  'her-2': {
    harmonyName: 'Bridal Crimson & Antique Gold',
    primaryColor: { name: 'Royal Crimson Red', hex: '#8B0000' },
    secondaryColor: { name: 'Antique Zari Gold', hex: '#D4AF37' },
    accentColor: { name: 'Emerald Velvet', hex: '#1B4D3E' },
    swatches: [
      { name: 'Royal Crimson Red', hex: '#8B0000', role: 'primary' },
      { name: 'Antique Zari Gold', hex: '#D4AF37', role: 'secondary' },
      { name: 'Emerald Velvet', hex: '#1B4D3E', role: 'accent' },
    ],
    compatibleHues: ['Antique Gold', 'Kundan', 'Emerald', 'Pearl', 'Gold'],
  },
  'her-3': {
    harmonyName: 'Blush Pink & Champagne Gold',
    primaryColor: { name: 'Pastel Blush Pink', hex: '#F4C2C2' },
    secondaryColor: { name: 'Dusty Rose', hex: '#DCAE96' },
    accentColor: { name: 'Champagne Gold Zari', hex: '#D4AF37' },
    swatches: [
      { name: 'Pastel Blush Pink', hex: '#F4C2C2', role: 'primary' },
      { name: 'Dusty Rose', hex: '#DCAE96', role: 'secondary' },
      { name: 'Champagne Gold Zari', hex: '#D4AF37', role: 'accent' },
    ],
    compatibleHues: ['Champagne', 'Blush Pink', 'Pearl', 'Rose Gold', 'Gold'],
  },
  'her-4': {
    harmonyName: 'Royal Cobalt Blue & Silver',
    primaryColor: { name: 'Royal Cobalt Blue', hex: '#0047AB' },
    secondaryColor: { name: 'Midnight Navy', hex: '#001F3F' },
    accentColor: { name: 'Silver Tilla Zari', hex: '#C0C0C0' },
    swatches: [
      { name: 'Royal Cobalt Blue', hex: '#0047AB', role: 'primary' },
      { name: 'Midnight Navy', hex: '#001F3F', role: 'secondary' },
      { name: 'Silver Tilla Zari', hex: '#C0C0C0', role: 'accent' },
    ],
    compatibleHues: ['Silver', 'Crystal', 'Rhodium', 'Pearl', 'Blue'],
  },
  'her-5': {
    harmonyName: 'Emerald Green & Antique Gold',
    primaryColor: { name: 'Royal Emerald Green', hex: '#1B4D3E' },
    secondaryColor: { name: 'Forest Green Silk', hex: '#2E7D32' },
    accentColor: { name: 'Antique Gold Zari', hex: '#D4AF37' },
    swatches: [
      { name: 'Royal Emerald Green', hex: '#1B4D3E', role: 'primary' },
      { name: 'Forest Green Silk', hex: '#2E7D32', role: 'secondary' },
      { name: 'Antique Gold Zari', hex: '#D4AF37', role: 'accent' },
    ],
    compatibleHues: ['Gold', 'Antique Gold', 'Kundan', 'Emerald', 'Pearl'],
  },
  'her-6': {
    harmonyName: 'Onyx Black & Platinum',
    primaryColor: { name: 'Midnight Onyx Black', hex: '#111111' },
    accentColor: { name: 'Platinum Silver Trim', hex: '#E5E4E2' },
    swatches: [
      { name: 'Midnight Onyx Black', hex: '#111111', role: 'primary' },
      { name: 'Platinum Silver Trim', hex: '#E5E4E2', role: 'accent' },
    ],
    compatibleHues: ['Silver', 'Crystal', 'Diamond', 'Black', 'Platinum'],
  },
  'her-7': {
    harmonyName: 'Ivory Cream & Warm Sand',
    primaryColor: { name: 'Pristine Ivory Cream', hex: '#FFFFF0' },
    secondaryColor: { name: 'Warm Desert Sand', hex: '#E8DCC4' },
    accentColor: { name: 'Brushed Brass', hex: '#B5A642' },
    swatches: [
      { name: 'Pristine Ivory Cream', hex: '#FFFFF0', role: 'primary' },
      { name: 'Warm Desert Sand', hex: '#E8DCC4', role: 'secondary' },
      { name: 'Brushed Brass', hex: '#B5A642', role: 'accent' },
    ],
    compatibleHues: ['Ivory', 'Gold', 'Tan', 'Pearl', 'Champagne'],
  },
  'her-8': {
    harmonyName: 'Multicolor Festive & Mirrorwork',
    primaryColor: { name: 'Festive Rani Pink', hex: '#D9138A' },
    secondaryColor: { name: 'Marigold Tangerine', hex: '#FF7F00' },
    accentColor: { name: 'Silver Mirrorwork', hex: '#E0E0E0' },
    isMulticolor: true,
    multicolorGradient: 'linear-gradient(135deg, #D9138A 0%, #FF7F00 35%, #00B4D8 70%, #FFD700 100%)',
    swatches: [
      { name: 'Festive Rani Pink', hex: '#D9138A', role: 'primary' },
      { name: 'Marigold Tangerine', hex: '#FF7F00', role: 'secondary' },
      { name: 'Silver Mirrorwork', hex: '#E0E0E0', role: 'accent' },
    ],
    compatibleHues: ['Oxidized Silver', 'Mirrorwork', 'Antique Gold', 'Multi', 'Pink'],
  },
  'her-9': {
    harmonyName: 'Mustard Gold & Antique Zari',
    primaryColor: { name: 'Royal Mustard Yellow', hex: '#E1AD01' },
    secondaryColor: { name: 'Marigold Ochre', hex: '#FF9900' },
    accentColor: { name: 'Antique Gold Zari', hex: '#D4AF37' },
    swatches: [
      { name: 'Royal Mustard Yellow', hex: '#E1AD01', role: 'primary' },
      { name: 'Marigold Ochre', hex: '#FF9900', role: 'secondary' },
      { name: 'Antique Gold Zari', hex: '#D4AF37', role: 'accent' },
    ],
    compatibleHues: ['Antique Gold', 'Kundan', 'Pearl', 'Gold', 'Mustard'],
  },
  'her-10': {
    harmonyName: 'Liquid Metallic Silver & Crystal',
    primaryColor: { name: 'Liquid Metallic Silver', hex: '#C0C0C0' },
    secondaryColor: { name: 'Platinum Sheen', hex: '#E5E4E2' },
    accentColor: { name: 'Crystal Ice', hex: '#E0FFFF' },
    swatches: [
      { name: 'Liquid Metallic Silver', hex: '#C0C0C0', role: 'primary' },
      { name: 'Platinum Sheen', hex: '#E5E4E2', role: 'secondary' },
      { name: 'Crystal Ice', hex: '#E0FFFF', role: 'accent' },
    ],
    compatibleHues: ['Silver', 'Crystal', 'Platinum', 'Rhodium', 'Ice'],
  },
  'her-11': {
    harmonyName: 'Blush Rose & Pearl',
    primaryColor: { name: 'Pastel Blush Pink', hex: '#F8B9D4' },
    secondaryColor: { name: 'Soft Rose Quartz', hex: '#F4C2C2' },
    accentColor: { name: 'Lustrous Pearl', hex: '#FFFFF0' },
    swatches: [
      { name: 'Pastel Blush Pink', hex: '#F8B9D4', role: 'primary' },
      { name: 'Soft Rose Quartz', hex: '#F4C2C2', role: 'secondary' },
      { name: 'Lustrous Pearl', hex: '#FFFFF0', role: 'accent' },
    ],
    compatibleHues: ['Pearl', 'Rose Gold', 'Blush Pink', 'Champagne'],
  },
  'her-12': {
    harmonyName: 'Midnight Black & Gunmetal',
    primaryColor: { name: 'Pitch Midnight Black', hex: '#0A0A0A' },
    accentColor: { name: 'Metallic Gunmetal', hex: '#4A4E69' },
    swatches: [
      { name: 'Pitch Midnight Black', hex: '#0A0A0A', role: 'primary' },
      { name: 'Metallic Gunmetal', hex: '#4A4E69', role: 'accent' },
    ],
    compatibleHues: ['Gunmetal', 'Silver', 'Crystal', 'Black'],
  },
  'her-13': {
    harmonyName: 'Neutral Beige & Warm Camel',
    primaryColor: { name: 'Tailored Neutral Beige', hex: '#D8C4AC' },
    secondaryColor: { name: 'Warm Camel', hex: '#C19A6B' },
    accentColor: { name: 'Brushed Brass', hex: '#B5A642' },
    swatches: [
      { name: 'Tailored Neutral Beige', hex: '#D8C4AC', role: 'primary' },
      { name: 'Warm Camel', hex: '#C19A6B', role: 'secondary' },
      { name: 'Brushed Brass', hex: '#B5A642', role: 'accent' },
    ],
    compatibleHues: ['Gold', 'Camel', 'Ivory', 'Pearl', 'Tan'],
  },
  'her-14': {
    harmonyName: 'Breeze Pure White & Tan',
    primaryColor: { name: 'Breeze Pure White', hex: '#FFFFFF' },
    secondaryColor: { name: 'Oyster Pearl', hex: '#FDFBF7' },
    accentColor: { name: 'Natural Saddle Tan', hex: '#D2B48C' },
    swatches: [
      { name: 'Breeze Pure White', hex: '#FFFFFF', role: 'primary' },
      { name: 'Oyster Pearl', hex: '#FDFBF7', role: 'secondary' },
      { name: 'Natural Saddle Tan', hex: '#D2B48C', role: 'accent' },
    ],
    compatibleHues: ['Gold', 'Tan', 'White', 'Pearl'],
  },
  'her-15': {
    harmonyName: 'Champagne Gold & Peach Shimmer',
    primaryColor: { name: 'Champagne Royal Gold', hex: '#CFB53B' },
    secondaryColor: { name: 'Peach Gold Luster', hex: '#FAD6A5' },
    accentColor: { name: 'Polki Diamond', hex: '#E6E6FA' },
    swatches: [
      { name: 'Champagne Royal Gold', hex: '#CFB53B', role: 'primary' },
      { name: 'Peach Gold Luster', hex: '#FAD6A5', role: 'secondary' },
      { name: 'Polki Diamond', hex: '#E6E6FA', role: 'accent' },
    ],
    compatibleHues: ['Gold', 'Champagne', 'Kundan', 'Pearl'],
  },
  'her-16': {
    harmonyName: 'Architectural Pure White',
    primaryColor: { name: 'Pure Silk White', hex: '#F8F9FA' },
    accentColor: { name: 'Liquid Luster White', hex: '#FFFFFF' },
    swatches: [
      { name: 'Pure Silk White', hex: '#F8F9FA', role: 'primary' },
      { name: 'Liquid Luster White', hex: '#FFFFFF', role: 'accent' },
    ],
    compatibleHues: ['Silver', 'Crystal', 'Diamond', 'White', 'Platinum'],
  },
  'her-suit-sovereign-plum': {
    harmonyName: 'Sovereign Plum & Antique Gold',
    primaryColor: { name: 'Sovereign Plum Velvet', hex: '#4D0E13' },
    secondaryColor: { name: 'Burgundy Wine', hex: '#6D3546' },
    accentColor: { name: 'Polished Gold Vermeil', hex: '#D4AF37' },
    swatches: [
      { name: 'Sovereign Plum Velvet', hex: '#4D0E13', role: 'primary' },
      { name: 'Burgundy Wine', hex: '#6D3546', role: 'secondary' },
      { name: 'Polished Gold Vermeil', hex: '#D4AF37', role: 'accent' },
    ],
    compatibleHues: ['Gold', 'Plum', 'Antique Gold', 'Pearl', 'Burgundy'],
  },
  'her-lehenga-tissue-garba': {
    harmonyName: 'Sunset Coral & Festive Gold',
    primaryColor: { name: 'Sunset Coral Silk', hex: '#FA8072' },
    secondaryColor: { name: 'Marigold Ochre', hex: '#CC7722' },
    accentColor: { name: 'Mirrorwork Silver', hex: '#E0E0E0' },
    isMulticolor: true,
    multicolorGradient: 'linear-gradient(135deg, #FA8072 0%, #CC7722 50%, #D4AF37 100%)',
    swatches: [
      { name: 'Sunset Coral Silk', hex: '#FA8072', role: 'primary' },
      { name: 'Marigold Ochre', hex: '#CC7722', role: 'secondary' },
      { name: 'Mirrorwork Silver', hex: '#E0E0E0', role: 'accent' },
    ],
    compatibleHues: ['Antique Gold', 'Mirrorwork', 'Oxidized Silver', 'Coral'],
  },
  'her-gown-corset-champagne': {
    harmonyName: 'Champagne Satin & Freshwater Pearl',
    primaryColor: { name: 'Duchesse Champagne Satin', hex: '#EED9C4' },
    secondaryColor: { name: 'Oyster Ivory', hex: '#F4F0EA' },
    accentColor: { name: 'Freshwater Pearl Crystal', hex: '#FDFBF7' },
    swatches: [
      { name: 'Duchesse Champagne Satin', hex: '#EED9C4', role: 'primary' },
      { name: 'Oyster Ivory', hex: '#F4F0EA', role: 'secondary' },
      { name: 'Freshwater Pearl Crystal', hex: '#FDFBF7', role: 'accent' },
    ],
    compatibleHues: ['Pearl', 'Champagne', 'Rose Gold', 'Gold'],
  },
  'her-saree-kanjivaram-magenta': {
    harmonyName: 'Royal Magenta & Pure Gold Zari',
    primaryColor: { name: 'Royal Magenta Silk', hex: '#CA1F7B' },
    secondaryColor: { name: 'Peacock Blue Weave', hex: '#005F73' },
    accentColor: { name: 'Pure Gold Zari', hex: '#D4AF37' },
    swatches: [
      { name: 'Royal Magenta Silk', hex: '#CA1F7B', role: 'primary' },
      { name: 'Peacock Blue Weave', hex: '#005F73', role: 'secondary' },
      { name: 'Pure Gold Zari', hex: '#D4AF37', role: 'accent' },
    ],
    compatibleHues: ['Gold', 'Kundan', 'Antique Gold', 'Pearl'],
  },
  'her-dress-velvet-coquette': {
    harmonyName: 'Ruby Velvet & Blush Bow',
    primaryColor: { name: 'Ruby Velvet', hex: '#8B1E2F' },
    secondaryColor: { name: 'Blush Bow', hex: '#F4C2C2' },
    accentColor: { name: 'Pearl Ivory Trim', hex: '#FFFFF0' },
    swatches: [
      { name: 'Ruby Velvet', hex: '#8B1E2F', role: 'primary' },
      { name: 'Blush Bow', hex: '#F4C2C2', role: 'secondary' },
      { name: 'Pearl Ivory Trim', hex: '#FFFFF0', role: 'accent' },
    ],
    compatibleHues: ['Pearl', 'Rose Gold', 'Plum', 'Champagne'],
  },
  'her-coord-linen-terracotta': {
    harmonyName: 'Baked Terracotta & Ochre',
    primaryColor: { name: 'Baked Terracotta', hex: '#C85A32' },
    secondaryColor: { name: 'Warm Ochre', hex: '#D99058' },
    accentColor: { name: 'Natural Sand', hex: '#F5EFE7' },
    swatches: [
      { name: 'Baked Terracotta', hex: '#C85A32', role: 'primary' },
      { name: 'Warm Ochre', hex: '#D99058', role: 'secondary' },
      { name: 'Natural Sand', hex: '#F5EFE7', role: 'accent' },
    ],
    compatibleHues: ['Gold', 'Tan', 'Terracotta', 'Sand'],
  },
  'her-anarkali-georgette-sage': {
    harmonyName: 'Dusty Sage Green & Muted Gold',
    primaryColor: { name: 'Dusty Sage Georgette', hex: '#9CAF88' },
    secondaryColor: { name: 'Mint Celadon', hex: '#A3C1AD' },
    accentColor: { name: 'Muted Antique Gold', hex: '#C5A059' },
    swatches: [
      { name: 'Dusty Sage Georgette', hex: '#9CAF88', role: 'primary' },
      { name: 'Mint Celadon', hex: '#A3C1AD', role: 'secondary' },
      { name: 'Muted Antique Gold', hex: '#C5A059', role: 'accent' },
    ],
    compatibleHues: ['Antique Gold', 'Pearl', 'Kundan', 'Gold'],
  },
  'her-baddie-leather-trench': {
    harmonyName: 'Obsidian Black & Silver Chrome',
    primaryColor: { name: 'Obsidian Pitch Black', hex: '#1A1A1A' },
    accentColor: { name: 'Polished Silver Chrome', hex: '#C0C0C0' },
    swatches: [
      { name: 'Obsidian Pitch Black', hex: '#1A1A1A', role: 'primary' },
      { name: 'Polished Silver Chrome', hex: '#C0C0C0', role: 'accent' },
    ],
    compatibleHues: ['Silver', 'Crystal', 'Black', 'Gunmetal'],
  },
  'her-dress-vintage-slip': {
    harmonyName: 'Buttercream Satin & Vanilla',
    primaryColor: { name: 'Pale Butter Yellow', hex: '#FFFDD0' },
    secondaryColor: { name: 'Vanilla Cream Satin', hex: '#FFF8DC' },
    accentColor: { name: 'Delicate Pearl', hex: '#FDFBF7' },
    swatches: [
      { name: 'Pale Butter Yellow', hex: '#FFFDD0', role: 'primary' },
      { name: 'Vanilla Cream Satin', hex: '#FFF8DC', role: 'secondary' },
      { name: 'Delicate Pearl', hex: '#FDFBF7', role: 'accent' },
    ],
    compatibleHues: ['Pearl', 'Gold', 'Ivory', 'Champagne'],
  },
  'her-lehenga-midnight-zardozi': {
    harmonyName: 'Midnight Navy & Antique Gold',
    primaryColor: { name: 'Midnight Navy Silk', hex: '#001B3A' },
    secondaryColor: { name: 'Deep Sapphire', hex: '#0F52BA' },
    accentColor: { name: 'Antique Gold Zardozi', hex: '#D4AF37' },
    swatches: [
      { name: 'Midnight Navy Silk', hex: '#001B3A', role: 'primary' },
      { name: 'Deep Sapphire', hex: '#0F52BA', role: 'secondary' },
      { name: 'Antique Gold Zardozi', hex: '#D4AF37', role: 'accent' },
    ],
    compatibleHues: ['Antique Gold', 'Kundan', 'Gold', 'Pearl'],
  },
  'her-suit-power-ivory': {
    harmonyName: 'Pearl Ivory & Brushed Gold',
    primaryColor: { name: 'Structured Pearl Ivory', hex: '#FFFFF0' },
    secondaryColor: { name: 'Alabaster White', hex: '#F2F0EB' },
    accentColor: { name: 'Brushed Gold Buttons', hex: '#D4AF37' },
    swatches: [
      { name: 'Structured Pearl Ivory', hex: '#FFFFF0', role: 'primary' },
      { name: 'Alabaster White', hex: '#F2F0EB', role: 'secondary' },
      { name: 'Brushed Gold Buttons', hex: '#D4AF37', role: 'accent' },
    ],
    compatibleHues: ['Gold', 'Pearl', 'Ivory', 'Champagne'],
  },

  // ==================== FOR HIM ====================
  'him-1': {
    harmonyName: 'Black & Crisp White',
    primaryColor: { name: 'Midnight Tuxedo Black', hex: '#0A0A0A' },
    secondaryColor: { name: 'Crisp Cotton White', hex: '#FFFFFF' },
    accentColor: { name: 'Satin Lapel Sheen', hex: '#1C1C1C' },
    swatches: [
      { name: 'Midnight Tuxedo Black', hex: '#0A0A0A', role: 'primary' },
      { name: 'Crisp Cotton White', hex: '#FFFFFF', role: 'secondary' },
      { name: 'Satin Lapel Sheen', hex: '#1C1C1C', role: 'accent' },
    ],
    compatibleHues: ['Black', 'Silver', 'White', 'Gunmetal', 'Onyx'],
  },
  'him-2': {
    harmonyName: 'Navy Blue & Crisp White',
    primaryColor: { name: 'Deep Navy Blue', hex: '#0B1B3D' },
    secondaryColor: { name: 'Crisp Poplin White', hex: '#FFFFFF' },
    accentColor: { name: 'Slate Blue Vest', hex: '#2E4057' },
    swatches: [
      { name: 'Deep Navy Blue', hex: '#0B1B3D', role: 'primary' },
      { name: 'Crisp Poplin White', hex: '#FFFFFF', role: 'secondary' },
      { name: 'Slate Blue Vest', hex: '#2E4057', role: 'accent' },
    ],
    compatibleHues: ['Cognac', 'Brown', 'Navy', 'Silver', 'Burgundy'],
  },
  'him-3': {
    harmonyName: 'Regal Gold & Deep Maroon',
    primaryColor: { name: 'Regal Antique Gold', hex: '#D4AF37' },
    secondaryColor: { name: 'Ivory Raw Silk', hex: '#FFFFF0' },
    accentColor: { name: 'Deep Maroon Brocade', hex: '#800020' },
    swatches: [
      { name: 'Regal Antique Gold', hex: '#D4AF37', role: 'primary' },
      { name: 'Ivory Raw Silk', hex: '#FFFFF0', role: 'secondary' },
      { name: 'Deep Maroon Brocade', hex: '#800020', role: 'accent' },
    ],
    compatibleHues: ['Antique Gold', 'Ivory', 'Maroon', 'Gold'],
  },
  'him-4': {
    harmonyName: 'Ivory & Antique Gold',
    primaryColor: { name: 'Pristine Ivory Silk', hex: '#FFFFF0' },
    secondaryColor: { name: 'Champagne Shimmer', hex: '#F7E7CE' },
    accentColor: { name: 'Antique Gold Thread', hex: '#D4AF37' },
    swatches: [
      { name: 'Pristine Ivory Silk', hex: '#FFFFF0', role: 'primary' },
      { name: 'Champagne Shimmer', hex: '#F7E7CE', role: 'secondary' },
      { name: 'Antique Gold Thread', hex: '#D4AF37', role: 'accent' },
    ],
    compatibleHues: ['Antique Gold', 'Ivory', 'Pearl', 'Gold'],
  },
  'him-5': {
    harmonyName: 'Royal Maroon & Gold Brocade',
    primaryColor: { name: 'Royal Crimson Maroon', hex: '#800000' },
    secondaryColor: { name: 'Burgundy Wine', hex: '#67000D' },
    accentColor: { name: 'Gold Brocade Zari', hex: '#D4AF37' },
    swatches: [
      { name: 'Royal Crimson Maroon', hex: '#800000', role: 'primary' },
      { name: 'Burgundy Wine', hex: '#67000D', role: 'secondary' },
      { name: 'Gold Brocade Zari', hex: '#D4AF37', role: 'accent' },
    ],
    compatibleHues: ['Gold', 'Maroon', 'Antique Gold', 'Plum'],
  },
  'him-6': {
    harmonyName: 'Pure White & Silver',
    primaryColor: { name: 'Pure Cotton White', hex: '#FFFFFF' },
    secondaryColor: { name: 'Chikan Off-White', hex: '#F5F5F5' },
    accentColor: { name: 'Silver Tonal Buttons', hex: '#C0C0C0' },
    swatches: [
      { name: 'Pure Cotton White', hex: '#FFFFFF', role: 'primary' },
      { name: 'Chikan Off-White', hex: '#F5F5F5', role: 'secondary' },
      { name: 'Silver Tonal Buttons', hex: '#C0C0C0', role: 'accent' },
    ],
    compatibleHues: ['Silver', 'White', 'Ivory', 'Gold'],
  },
  'him-7': {
    harmonyName: 'Jet Black & Antique Brass',
    primaryColor: { name: 'Jet Wool Black', hex: '#111111' },
    secondaryColor: { name: 'Charcoal Texture', hex: '#222222' },
    accentColor: { name: 'Antique Brass Buttons', hex: '#B5A642' },
    swatches: [
      { name: 'Jet Wool Black', hex: '#111111', role: 'primary' },
      { name: 'Charcoal Texture', hex: '#222222', role: 'secondary' },
      { name: 'Antique Brass Buttons', hex: '#B5A642', role: 'accent' },
    ],
    compatibleHues: ['Black', 'Antique Gold', 'Brass', 'Cognac'],
  },
  'him-8': {
    harmonyName: 'Midnight Black & Satin Trim',
    primaryColor: { name: 'Midnight Tailored Black', hex: '#000000' },
    accentColor: { name: 'Satin Peak Lapel', hex: '#222222' },
    swatches: [
      { name: 'Midnight Tailored Black', hex: '#000000', role: 'primary' },
      { name: 'Satin Peak Lapel', hex: '#222222', role: 'accent' },
    ],
    compatibleHues: ['Black', 'White', 'Silver', 'Gunmetal'],
  },
  'him-9': {
    harmonyName: 'Royal Blue & White',
    primaryColor: { name: 'Royal Sapphire Blue', hex: '#1034A6' },
    secondaryColor: { name: 'Crisp White Shirt', hex: '#FFFFFF' },
    accentColor: { name: 'Midnight Navy Weave', hex: '#001845' },
    swatches: [
      { name: 'Royal Sapphire Blue', hex: '#1034A6', role: 'primary' },
      { name: 'Crisp White Shirt', hex: '#FFFFFF', role: 'secondary' },
      { name: 'Midnight Navy Weave', hex: '#001845', role: 'accent' },
    ],
    compatibleHues: ['Cognac', 'Brown', 'Navy', 'Silver', 'Black'],
  },
  'him-10': {
    harmonyName: 'Multicolor Festive & Mirrorwork',
    primaryColor: { name: 'Festive Ochre Yellow', hex: '#D97706' },
    secondaryColor: { name: 'Royal Crimson Maroon', hex: '#881337' },
    accentColor: { name: 'Mirrorwork Silver', hex: '#E0E0E0' },
    isMulticolor: true,
    multicolorGradient: 'linear-gradient(135deg, #D97706 0%, #881337 50%, #D4AF37 100%)',
    swatches: [
      { name: 'Festive Ochre Yellow', hex: '#D97706', role: 'primary' },
      { name: 'Royal Crimson Maroon', hex: '#881337', role: 'secondary' },
      { name: 'Mirrorwork Silver', hex: '#E0E0E0', role: 'accent' },
    ],
    compatibleHues: ['Antique Gold', 'Oxidized Silver', 'Maroon', 'Multi'],
  },
  'him-11': {
    harmonyName: 'Indigo & Sky Blue',
    primaryColor: { name: 'Rich Indigo Blue', hex: '#1E3A8A' },
    secondaryColor: { name: 'Sky Blue Print', hex: '#38BDF8' },
    accentColor: { name: 'Silver Thread Details', hex: '#CBD5E1' },
    swatches: [
      { name: 'Rich Indigo Blue', hex: '#1E3A8A', role: 'primary' },
      { name: 'Sky Blue Print', hex: '#38BDF8', role: 'secondary' },
      { name: 'Silver Thread Details', hex: '#CBD5E1', role: 'accent' },
    ],
    compatibleHues: ['Silver', 'White', 'Navy', 'Tan'],
  },
  'him-12': {
    harmonyName: 'Linen White & Sandy Beige',
    primaryColor: { name: 'Crisp Linen White', hex: '#F9FAFB' },
    secondaryColor: { name: 'Sandy Beige Trousers', hex: '#E2D9CC' },
    swatches: [
      { name: 'Crisp Linen White', hex: '#F9FAFB', role: 'primary' },
      { name: 'Sandy Beige Trousers', hex: '#E2D9CC', role: 'secondary' },
    ],
    compatibleHues: ['Tan', 'White', 'Cognac', 'Brown'],
  },
  'him-13': {
    harmonyName: 'Coastal Azure & Crisp White',
    primaryColor: { name: 'Coastal Azure Blue', hex: '#0284C7' },
    secondaryColor: { name: 'Ocean Turquoise', hex: '#06B6D4' },
    accentColor: { name: 'Crisp White Piping', hex: '#FFFFFF' },
    swatches: [
      { name: 'Coastal Azure Blue', hex: '#0284C7', role: 'primary' },
      { name: 'Ocean Turquoise', hex: '#06B6D4', role: 'secondary' },
      { name: 'Crisp White Piping', hex: '#FFFFFF', role: 'accent' },
    ],
    compatibleHues: ['White', 'Tan', 'Silver', 'Blue'],
  },
  'him-14': {
    harmonyName: 'Black & Gold Brocade',
    primaryColor: { name: 'Obsidian Black', hex: '#18181B' },
    secondaryColor: { name: 'Charcoal Silk', hex: '#27272A' },
    accentColor: { name: 'Gold Brocade Motif', hex: '#EAB308' },
    swatches: [
      { name: 'Obsidian Black', hex: '#18181B', role: 'primary' },
      { name: 'Charcoal Silk', hex: '#27272A', role: 'secondary' },
      { name: 'Gold Brocade Motif', hex: '#EAB308', role: 'accent' },
    ],
    compatibleHues: ['Gold', 'Antique Gold', 'Black', 'Onyx'],
  },
  'him-15': {
    harmonyName: 'Raw Silk Gold & Royal Ivory',
    primaryColor: { name: 'Raw Silk Gold', hex: '#CA8A04' },
    secondaryColor: { name: 'Royal Ivory Brocade', hex: '#FEF9C3' },
    accentColor: { name: 'Emerald Brooch Accent', hex: '#065F46' },
    swatches: [
      { name: 'Raw Silk Gold', hex: '#CA8A04', role: 'primary' },
      { name: 'Royal Ivory Brocade', hex: '#FEF9C3', role: 'secondary' },
      { name: 'Emerald Brooch Accent', hex: '#065F46', role: 'accent' },
    ],
    compatibleHues: ['Antique Gold', 'Ivory', 'Emerald', 'Gold'],
  },
  'him-16': {
    harmonyName: 'Sculpted Jet Black',
    primaryColor: { name: 'Sculpted Jet Black', hex: '#000000' },
    accentColor: { name: 'Matte Carbon Trim', hex: '#1C1917' },
    swatches: [
      { name: 'Sculpted Jet Black', hex: '#000000', role: 'primary' },
      { name: 'Matte Carbon Trim', hex: '#1C1917', role: 'accent' },
    ],
    compatibleHues: ['Black', 'Silver', 'Gunmetal'],
  },
  'him-suit-tuxedo-charcoal': {
    harmonyName: 'Midnight Charcoal & Plum Velvet',
    primaryColor: { name: 'Midnight Charcoal', hex: '#2D1517' },
    secondaryColor: { name: 'Plum Velvet Tux', hex: '#4D0E13' },
    accentColor: { name: 'Duchesse Satin Trim', hex: '#1A1A1A' },
    swatches: [
      { name: 'Midnight Charcoal', hex: '#2D1517', role: 'primary' },
      { name: 'Plum Velvet Tux', hex: '#4D0E13', role: 'secondary' },
      { name: 'Duchesse Satin Trim', hex: '#1A1A1A', role: 'accent' },
    ],
    compatibleHues: ['Black', 'Plum', 'Silver', 'Gunmetal', 'Burgundy'],
  },
  'him-sherwani-raw-silk-ivory': {
    harmonyName: 'Raw Silk Ivory & Antique Gold',
    primaryColor: { name: 'Pure Raw Silk Ivory', hex: '#FFFFF0' },
    secondaryColor: { name: 'Champagne Pearl Silk', hex: '#F8F9FA' },
    accentColor: { name: 'Antique Gold Zardozi', hex: '#D4AF37' },
    swatches: [
      { name: 'Pure Raw Silk Ivory', hex: '#FFFFF0', role: 'primary' },
      { name: 'Champagne Pearl Silk', hex: '#F8F9FA', role: 'secondary' },
      { name: 'Antique Gold Zardozi', hex: '#D4AF37', role: 'accent' },
    ],
    compatibleHues: ['Antique Gold', 'Ivory', 'Pearl', 'Gold'],
  },
  'him-suit-double-breasted-navy': {
    harmonyName: 'Deep Navy & Oxford Blue',
    primaryColor: { name: 'Deep Midnight Navy', hex: '#001845' },
    secondaryColor: { name: 'Oxford Blue Flannel', hex: '#1D3557' },
    accentColor: { name: 'Horn Button Accent', hex: '#4A3B32' },
    swatches: [
      { name: 'Deep Midnight Navy', hex: '#001845', role: 'primary' },
      { name: 'Oxford Blue Flannel', hex: '#1D3557', role: 'secondary' },
      { name: 'Horn Button Accent', hex: '#4A3B32', role: 'accent' },
    ],
    compatibleHues: ['Cognac', 'Navy', 'Brown', 'Silver'],
  },
  'him-kurta-bundi-terracotta': {
    harmonyName: 'Rust Terracotta & Warm Ochre',
    primaryColor: { name: 'Baked Rust Terracotta', hex: '#C85A32' },
    secondaryColor: { name: 'Warm Ochre Bundi', hex: '#D99058' },
    accentColor: { name: 'Antique Brass Buttons', hex: '#B5A642' },
    swatches: [
      { name: 'Baked Rust Terracotta', hex: '#C85A32', role: 'primary' },
      { name: 'Warm Ochre Bundi', hex: '#D99058', role: 'secondary' },
      { name: 'Antique Brass Buttons', hex: '#B5A642', role: 'accent' },
    ],
    compatibleHues: ['Antique Gold', 'Tan', 'Terracotta', 'Brass'],
  },
  'him-blazer-houndstooth-wool': {
    harmonyName: 'Charcoal Houndstooth & Ecru',
    primaryColor: { name: 'Houndstooth Charcoal', hex: '#2B2B2B' },
    secondaryColor: { name: 'Ecru Cream Wool', hex: '#EFE8DD' },
    accentColor: { name: 'Leather Suede Trim', hex: '#8B5A2B' },
    swatches: [
      { name: 'Houndstooth Charcoal', hex: '#2B2B2B', role: 'primary' },
      { name: 'Ecru Cream Wool', hex: '#EFE8DD', role: 'secondary' },
      { name: 'Leather Suede Trim', hex: '#8B5A2B', role: 'accent' },
    ],
    compatibleHues: ['Cognac', 'Brown', 'Black', 'Tan'],
  },
  'him-casual-linen-overshirt-olive': {
    harmonyName: 'Muted Olive & Sage',
    primaryColor: { name: 'Muted Olive Drab', hex: '#556B2F' },
    secondaryColor: { name: 'Sage Green Linen', hex: '#8F9779' },
    accentColor: { name: 'Horn Button Detail', hex: '#3B2F2F' },
    swatches: [
      { name: 'Muted Olive Drab', hex: '#556B2F', role: 'primary' },
      { name: 'Sage Green Linen', hex: '#8F9779', role: 'secondary' },
      { name: 'Horn Button Detail', hex: '#3B2F2F', role: 'accent' },
    ],
    compatibleHues: ['Tan', 'Olive', 'White', 'Brown'],
  },

  // ==================== ACCESSORIES ====================
  'acc-pearl-choker': {
    harmonyName: 'Freshwater Pearl & Gold',
    primaryColor: { name: 'Baroque Freshwater Pearl', hex: '#FDFBF7' },
    secondaryColor: { name: '18K Gold Vermeil', hex: '#D4AF37' },
    swatches: [
      { name: 'Baroque Freshwater Pearl', hex: '#FDFBF7', role: 'primary' },
      { name: '18K Gold Vermeil', hex: '#D4AF37', role: 'secondary' },
    ],
    compatibleHues: ['Pearl', 'Gold', 'Ivory', 'Champagne'],
  },
  'acc-kundan-jhumkas': {
    harmonyName: 'Antique Gold & Seed Pearl',
    primaryColor: { name: 'Antique Polki Gold', hex: '#D4AF37' },
    secondaryColor: { name: 'Seed Pearl Cluster', hex: '#FFFFF0' },
    accentColor: { name: 'Ruby Meenakari', hex: '#8B0000' },
    swatches: [
      { name: 'Antique Polki Gold', hex: '#D4AF37', role: 'primary' },
      { name: 'Seed Pearl Cluster', hex: '#FFFFF0', role: 'secondary' },
      { name: 'Ruby Meenakari', hex: '#8B0000', role: 'accent' },
    ],
    compatibleHues: ['Antique Gold', 'Gold', 'Kundan', 'Pearl', 'Red'],
  },
  'acc-jewelled-necklace': {
    harmonyName: 'Emerald Green & Antique Gold',
    primaryColor: { name: 'Royal Emerald Stone', hex: '#065F46' },
    secondaryColor: { name: 'Antique 22K Gold', hex: '#D4AF37' },
    accentColor: { name: 'Polki Diamond', hex: '#E5E4E2' },
    swatches: [
      { name: 'Royal Emerald Stone', hex: '#065F46', role: 'primary' },
      { name: 'Antique 22K Gold', hex: '#D4AF37', role: 'secondary' },
      { name: 'Polki Diamond', hex: '#E5E4E2', role: 'accent' },
    ],
    compatibleHues: ['Emerald', 'Antique Gold', 'Gold', 'Green'],
  },
  'acc-crystal-chandelier-earrings': {
    harmonyName: 'Prismatic Crystal & Rhodium',
    primaryColor: { name: 'Austrian Crystal Ice', hex: '#F8FAFC' },
    secondaryColor: { name: 'Rhodium Silver', hex: '#CBD5E1' },
    swatches: [
      { name: 'Austrian Crystal Ice', hex: '#F8FAFC', role: 'primary' },
      { name: 'Rhodium Silver', hex: '#CBD5E1', role: 'secondary' },
    ],
    compatibleHues: ['Crystal', 'Silver', 'Platinum', 'Diamond'],
  },
  'acc-minimal-gold-huggie': {
    harmonyName: '18K Warm Gold',
    primaryColor: { name: '18K Polished Gold', hex: '#D4AF37' },
    swatches: [
      { name: '18K Polished Gold', hex: '#D4AF37', role: 'primary' },
    ],
    compatibleHues: ['Gold', 'Champagne', 'Warm Gold'],
  },
  'acc-chunky-chain': {
    harmonyName: 'Polished Royal Gold',
    primaryColor: { name: 'Polished Royal Gold', hex: '#D4AF37' },
    swatches: [
      { name: 'Polished Royal Gold', hex: '#D4AF37', role: 'primary' },
    ],
    compatibleHues: ['Gold', 'Warm Gold'],
  },
  'acc-boho-silver-belt': {
    harmonyName: 'Oxidized Silver & Ghungroo',
    primaryColor: { name: 'Oxidized Antique Silver', hex: '#94A3B8' },
    accentColor: { name: 'Silver Ghungroo Drop', hex: '#CBD5E1' },
    swatches: [
      { name: 'Oxidized Antique Silver', hex: '#94A3B8', role: 'primary' },
      { name: 'Silver Ghungroo Drop', hex: '#CBD5E1', role: 'accent' },
    ],
    compatibleHues: ['Oxidized Silver', 'Silver', 'Mirrorwork'],
  },
  'acc-metallic-stiletto': {
    harmonyName: 'Liquid Rose Gold & Silver',
    primaryColor: { name: 'Liquid Rose Gold', hex: '#C8A49F' },
    secondaryColor: { name: 'Mirror Silver', hex: '#C0C0C0' },
    swatches: [
      { name: 'Liquid Rose Gold', hex: '#C8A49F', role: 'primary' },
      { name: 'Mirror Silver', hex: '#C0C0C0', role: 'secondary' },
    ],
    compatibleHues: ['Rose Gold', 'Silver', 'Champagne', 'Crystal'],
  },
  'acc-velvet-embroidered-loafers': {
    harmonyName: 'Deep Plum & Antique Gold',
    primaryColor: { name: 'Imperial Plum Velvet', hex: '#4D0E13' },
    secondaryColor: { name: 'Gold Bullion Embroidery', hex: '#D4AF37' },
    accentColor: { name: 'Black Velvet Trim', hex: '#18181B' },
    swatches: [
      { name: 'Imperial Plum Velvet', hex: '#4D0E13', role: 'primary' },
      { name: 'Gold Bullion Embroidery', hex: '#D4AF37', role: 'secondary' },
      { name: 'Black Velvet Trim', hex: '#18181B', role: 'accent' },
    ],
    compatibleHues: ['Plum', 'Antique Gold', 'Black', 'Gold', 'Burgundy'],
  },
  'acc-zari-juttis': {
    harmonyName: 'Antique Gold Zari & Tan',
    primaryColor: { name: 'Antique Gold Zari', hex: '#D4AF37' },
    secondaryColor: { name: 'Natural Tan Leather', hex: '#B8860B' },
    swatches: [
      { name: 'Antique Gold Zari', hex: '#D4AF37', role: 'primary' },
      { name: 'Natural Tan Leather', hex: '#B8860B', role: 'secondary' },
    ],
    compatibleHues: ['Antique Gold', 'Gold', 'Tan', 'Kundan'],
  },
  'acc-minimal-mule': {
    harmonyName: 'Pristine Ivory',
    primaryColor: { name: 'Pristine Nappa Ivory', hex: '#FFFFF0' },
    secondaryColor: { name: 'Natural Leather Sole', hex: '#E8DCC4' },
    swatches: [
      { name: 'Pristine Nappa Ivory', hex: '#FFFFF0', role: 'primary' },
      { name: 'Natural Leather Sole', hex: '#E8DCC4', role: 'secondary' },
    ],
    compatibleHues: ['Ivory', 'White', 'Sand', 'Tan'],
  },
  'acc-clean-sneaker': {
    harmonyName: 'Pure Chalk White',
    primaryColor: { name: 'Pure White Calfskin', hex: '#FFFFFF' },
    swatches: [
      { name: 'Pure White Calfskin', hex: '#FFFFFF', role: 'primary' },
    ],
    compatibleHues: ['White', 'Chalk'],
  },
  'acc-pearl-mini-tote': {
    harmonyName: 'Iridescent Pearl Ivory',
    primaryColor: { name: 'Iridescent Pearl Ivory', hex: '#FDFBF7' },
    secondaryColor: { name: 'Champagne Satin Liner', hex: '#FFF8DC' },
    swatches: [
      { name: 'Iridescent Pearl Ivory', hex: '#FDFBF7', role: 'primary' },
      { name: 'Champagne Satin Liner', hex: '#FFF8DC', role: 'secondary' },
    ],
    compatibleHues: ['Pearl', 'Ivory', 'Champagne', 'Gold'],
  },
  'acc-crystal-clutch': {
    harmonyName: 'Champagne Crystal & Gold',
    primaryColor: { name: 'Champagne Austrian Crystal', hex: '#EEE4DA' },
    secondaryColor: { name: 'Gold Clasp Hardware', hex: '#D4AF37' },
    swatches: [
      { name: 'Champagne Austrian Crystal', hex: '#EEE4DA', role: 'primary' },
      { name: 'Gold Clasp Hardware', hex: '#D4AF37', role: 'secondary' },
    ],
    compatibleHues: ['Champagne', 'Gold', 'Crystal', 'Pearl'],
  },
  'acc-potli-embroidered-gold': {
    harmonyName: 'Deep Plum & Antique Gold',
    primaryColor: { name: 'Deep Plum Velvet', hex: '#4D0E13' },
    secondaryColor: { name: 'Antique Gold Zardozi', hex: '#D4AF37' },
    accentColor: { name: 'Seed Pearl Tassels', hex: '#FFFFF0' },
    swatches: [
      { name: 'Deep Plum Velvet', hex: '#4D0E13', role: 'primary' },
      { name: 'Antique Gold Zardozi', hex: '#D4AF37', role: 'secondary' },
      { name: 'Seed Pearl Tassels', hex: '#FFFFF0', role: 'accent' },
    ],
    compatibleHues: ['Plum', 'Antique Gold', 'Gold', 'Burgundy', 'Pearl'],
  },
  'acc-minimal-leather-tote': {
    harmonyName: 'Bone Ivory & Brushed Brass',
    primaryColor: { name: 'Bone Ivory Leather', hex: '#F5F5F0' },
    accentColor: { name: 'Brushed Brass Hardware', hex: '#B5A642' },
    swatches: [
      { name: 'Bone Ivory Leather', hex: '#F5F5F0', role: 'primary' },
      { name: 'Brushed Brass Hardware', hex: '#B5A642', role: 'accent' },
    ],
    compatibleHues: ['Ivory', 'Gold', 'Tan', 'Brass'],
  },
  'acc-bold-crimson-clutch': {
    harmonyName: 'Scarlet Red & Polished Gold',
    primaryColor: { name: 'Saturated Scarlet Red', hex: '#B71C1C' },
    accentColor: { name: 'Polished Gold Edge', hex: '#D4AF37' },
    swatches: [
      { name: 'Saturated Scarlet Red', hex: '#B71C1C', role: 'primary' },
      { name: 'Polished Gold Edge', hex: '#D4AF37', role: 'accent' },
    ],
    compatibleHues: ['Red', 'Crimson', 'Gold', 'Black'],
  },
  'acc-canvas-crossbody': {
    harmonyName: 'Natural Sand & Saddle Tan',
    primaryColor: { name: 'Natural Sand Canvas', hex: '#D8C4AC' },
    secondaryColor: { name: 'Vegetable-Tanned Saddle Tan', hex: '#8B5A2B' },
    swatches: [
      { name: 'Natural Sand Canvas', hex: '#D8C4AC', role: 'primary' },
      { name: 'Vegetable-Tanned Saddle Tan', hex: '#8B5A2B', role: 'secondary' },
    ],
    compatibleHues: ['Sand', 'Tan', 'Brown', 'Ivory'],
  },
  'acc-velvet-bow-barrette': {
    harmonyName: 'Deep Plum & Dusty Rose',
    primaryColor: { name: 'Deep Plum Velvet', hex: '#4D0E13' },
    secondaryColor: { name: 'Dusty Rose Velvet', hex: '#C8A49F' },
    swatches: [
      { name: 'Deep Plum Velvet', hex: '#4D0E13', role: 'primary' },
      { name: 'Dusty Rose Velvet', hex: '#C8A49F', role: 'secondary' },
    ],
    compatibleHues: ['Plum', 'Dusty Rose', 'Pearl', 'Burgundy'],
  },
  'acc-retro-cateye': {
    harmonyName: 'Plum Tortoise & Amber',
    primaryColor: { name: 'Plum Tortoise Acetate', hex: '#4D0E13' },
    secondaryColor: { name: 'Amber Gradient Lens', hex: '#78350F' },
    swatches: [
      { name: 'Plum Tortoise Acetate', hex: '#4D0E13', role: 'primary' },
      { name: 'Amber Gradient Lens', hex: '#78350F', role: 'secondary' },
    ],
    compatibleHues: ['Plum', 'Tortoise', 'Gold', 'Black'],
  },

  // Added Authentic Men's & Women's Complementary Accessories
  'acc-kundan-bangles': {
    harmonyName: 'Royal Antique Gold & Emerald',
    primaryColor: { name: 'Royal Antique Gold', hex: '#D4AF37' },
    secondaryColor: { name: 'Emerald Polki Accent', hex: '#065F46' },
    accentColor: { name: 'Seed Pearl Fringe', hex: '#FFFFF0' },
    swatches: [
      { name: 'Royal Antique Gold', hex: '#D4AF37', role: 'primary' },
      { name: 'Emerald Polki Accent', hex: '#065F46', role: 'secondary' },
      { name: 'Seed Pearl Fringe', hex: '#FFFFF0', role: 'accent' },
    ],
    compatibleHues: ['Antique Gold', 'Gold', 'Emerald', 'Kundan', 'Pearl'],
  },
  'acc-men-classic-derby': {
    harmonyName: 'Burnished Black & Espresso',
    primaryColor: { name: 'Burnished Black Calfskin', hex: '#111111' },
    secondaryColor: { name: 'Espresso Sole Welt', hex: '#2E1C14' },
    swatches: [
      { name: 'Burnished Black Calfskin', hex: '#111111', role: 'primary' },
      { name: 'Espresso Sole Welt', hex: '#2E1C14', role: 'secondary' },
    ],
    compatibleHues: ['Black', 'Charcoal', 'Navy', 'Silver', 'White'],
  },
  'acc-men-leather-belt-cufflinks': {
    harmonyName: 'Italian Black Leather & Gunmetal',
    primaryColor: { name: 'Italian Black Calfskin', hex: '#0A0A0A' },
    secondaryColor: { name: 'Gunmetal Silver Hardware', hex: '#4A4E69' },
    accentColor: { name: 'Black Onyx Stone', hex: '#18181B' },
    swatches: [
      { name: 'Italian Black Calfskin', hex: '#0A0A0A', role: 'primary' },
      { name: 'Gunmetal Silver Hardware', hex: '#4A4E69', role: 'secondary' },
      { name: 'Black Onyx Stone', hex: '#18181B', role: 'accent' },
    ],
    compatibleHues: ['Black', 'Silver', 'Gunmetal', 'Charcoal'],
  },
  'acc-men-silk-pocket-tie': {
    harmonyName: 'Mulberry Silk Black & Plum',
    primaryColor: { name: 'Mulberry Silk Black', hex: '#111111' },
    secondaryColor: { name: 'Plum Satin Border', hex: '#4D0E13' },
    swatches: [
      { name: 'Mulberry Silk Black', hex: '#111111', role: 'primary' },
      { name: 'Plum Satin Border', hex: '#4D0E13', role: 'secondary' },
    ],
    compatibleHues: ['Black', 'Plum', 'Burgundy', 'White', 'Charcoal'],
  },
  'acc-men-banarasi-stole': {
    harmonyName: 'Royal Ivory & Antique Gold Zari',
    primaryColor: { name: 'Royal Ivory Silk', hex: '#FFFFF0' },
    secondaryColor: { name: 'Antique Gold Zari Weave', hex: '#D4AF37' },
    swatches: [
      { name: 'Royal Ivory Silk', hex: '#FFFFF0', role: 'primary' },
      { name: 'Antique Gold Zari Weave', hex: '#D4AF37', role: 'secondary' },
    ],
    compatibleHues: ['Antique Gold', 'Ivory', 'Gold', 'Maroon'],
  },
  'acc-men-heritage-watch': {
    harmonyName: 'Cognac Leather & 18K Gold',
    primaryColor: { name: 'Cognac Saddle Leather', hex: '#8B4513' },
    secondaryColor: { name: 'Sunburst Sapphire Dial', hex: '#1E3A8A' },
    accentColor: { name: '18K Polished Gold Bezel', hex: '#D4AF37' },
    swatches: [
      { name: 'Cognac Saddle Leather', hex: '#8B4513', role: 'primary' },
      { name: 'Sunburst Sapphire Dial', hex: '#1E3A8A', role: 'secondary' },
      { name: '18K Polished Gold Bezel', hex: '#D4AF37', role: 'accent' },
    ],
    compatibleHues: ['Cognac', 'Gold', 'Navy', 'Brown', 'Tan'],
  },
  'acc-men-mojari-juttis': {
    harmonyName: 'Raw Silk Ivory & Gold Zari',
    primaryColor: { name: 'Raw Silk Ivory', hex: '#FFFFF0' },
    secondaryColor: { name: 'Antique Gold Zari', hex: '#D4AF37' },
    accentColor: { name: 'Genuine Leather Sole', hex: '#B8860B' },
    swatches: [
      { name: 'Raw Silk Ivory', hex: '#FFFFF0', role: 'primary' },
      { name: 'Antique Gold Zari', hex: '#D4AF37', role: 'secondary' },
      { name: 'Genuine Leather Sole', hex: '#B8860B', role: 'accent' },
    ],
    compatibleHues: ['Antique Gold', 'Ivory', 'Gold', 'Tan'],
  },
};

/**
 * Returns custom saved color overrides from localStorage
 */
export function getSavedColorOverrides(): Record<string, ProductColorHarmony> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(COLOR_OVERRIDES_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Persists a custom color harmony override for a product
 */
export function saveColorOverride(productId: string, harmony: ProductColorHarmony): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getSavedColorOverrides();
    current[productId] = harmony;
    localStorage.setItem(COLOR_OVERRIDES_KEY, JSON.stringify(current));
  } catch {
    // Graceful fallback if storage full
  }
}

/**
 * Standard hex lookup for generic color names
 */
const COLOR_HEX_MAP: Record<string, string> = {
  red: '#990000',
  crimson: '#8B0000',
  wine: '#5B0612',
  gold: '#D4AF37',
  'antique gold': '#D4AF37',
  champagne: '#EED9C4',
  pink: '#F4C2C2',
  'blush pink': '#F4C2C2',
  'rose gold': '#B76E79',
  blue: '#0047AB',
  'royal blue': '#0047AB',
  navy: '#001F3F',
  green: '#1B4D3E',
  emerald: '#1B4D3E',
  sage: '#9CAF88',
  black: '#111111',
  white: '#FFFFFF',
  ivory: '#FFFFF0',
  cream: '#FFFFF0',
  silver: '#C0C0C0',
  platinum: '#E5E4E2',
  yellow: '#E1AD01',
  mustard: '#E1AD01',
  maroon: '#800000',
  plum: '#4D0E13',
  charcoal: '#2D1517',
  beige: '#D8C4AC',
  tan: '#C19A6B',
  brown: '#8B5A2B',
  cognac: '#8B4513',
  terracotta: '#C85A32',
  orange: '#FF7F00',
  multi: '#D9138A',
};

/**
 * Dynamically gets or derives the exact Color Harmony for ANY product in the catalog.
 * Guarantees every product has distinct, true-to-life colors rather than generic defaults.
 */
export function getProductColorHarmony(product: Product): ProductColorHarmony {
  // 1. Check custom overrides from localStorage
  const overrides = getSavedColorOverrides();
  if (overrides[product.id]) {
    return overrides[product.id];
  }

  // 2. Check curated master catalog
  if (CATALOG_COLOR_HARMONY[product.id]) {
    return CATALOG_COLOR_HARMONY[product.id];
  }

  // 3. Robust dynamic derivation based on product's actual colors & metadata
  const colors = product.colors && product.colors.length > 0
    ? product.colors
    : [{ name: 'Refined Neutral', hex: '#F5EFE7' }];

  const primaryName = colors[0].name;
  const primaryHex = colors[0].hex && colors[0].hex !== '#000000' && colors[0].hex !== '#FF0000'
    ? colors[0].hex
    : (COLOR_HEX_MAP[primaryName.toLowerCase()] || colors[0].hex || '#4D0E13');

  const swatches: ColorSwatchItem[] = [
    { name: primaryName, hex: primaryHex, role: 'primary' },
  ];

  let secondaryColor: { name: string; hex: string } | undefined;
  if (colors.length > 1) {
    const secName = colors[1].name;
    const secHex = colors[1].hex && colors[1].hex !== '#000000'
      ? colors[1].hex
      : (COLOR_HEX_MAP[secName.toLowerCase()] || colors[1].hex || '#D4AF37');
    secondaryColor = { name: secName, hex: secHex };
    swatches.push({ name: secName, hex: secHex, role: 'secondary' });
  }

  // Derive accent from description if mentions gold/zari/silver/mirror/pearl
  let accentColor: { name: string; hex: string } | undefined;
  const descLower = (product.description || '').toLowerCase();
  if (descLower.includes('gold') || descLower.includes('zari') || descLower.includes('zardozi')) {
    accentColor = { name: 'Antique Gold Zari', hex: '#D4AF37' };
    swatches.push({ name: 'Antique Gold Zari', hex: '#D4AF37', role: 'accent' });
  } else if (descLower.includes('silver') || descLower.includes('crystal') || descLower.includes('diamond')) {
    accentColor = { name: 'Rhodium Silver & Crystal', hex: '#C0C0C0' };
    swatches.push({ name: 'Rhodium Silver & Crystal', hex: '#C0C0C0', role: 'accent' });
  } else if (descLower.includes('pearl')) {
    accentColor = { name: 'Freshwater Pearl', hex: '#FDFBF7' };
    swatches.push({ name: 'Freshwater Pearl', hex: '#FDFBF7', role: 'accent' });
  }

  const isMulti = primaryName.toLowerCase().includes('multi') ||
    (product.occasions && product.occasions.includes('navratri-garba') && !secondaryColor);

  let harmonyName = primaryName;
  if (isMulti) {
    harmonyName = 'Multicolor Festive';
  } else if (secondaryColor) {
    harmonyName = `${primaryName} & ${secondaryColor.name}`;
  } else if (accentColor) {
    harmonyName = `${primaryName} & ${accentColor.name.split(' ')[0]}`;
  }

  return {
    harmonyName,
    primaryColor: { name: primaryName, hex: primaryHex },
    secondaryColor,
    accentColor,
    isMulticolor: isMulti,
    multicolorGradient: isMulti ? 'linear-gradient(135deg, #D9138A 0%, #FF7F00 35%, #00B4D8 70%, #FFD700 100%)' : undefined,
    swatches,
    compatibleHues: [primaryName, secondaryColor?.name, accentColor?.name, 'Gold', 'Silver', 'Black'].filter(Boolean) as string[],
  };
}
