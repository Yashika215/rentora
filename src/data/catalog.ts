export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'her' | 'him' | 'accessory';
  subCategory: string;
  pricePerDay: number;
  rentalPrice4Days: number;
  retailPrice: number;
  deposit: number;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  aesthetic: string[];
  occasions: string[];
  description: string;
  fabric: string;
  fit: string;
  care: string;
  rating: number;
  reviewsCount: number;
  isTrending?: boolean;
  isNewArrival?: boolean;
  matchingAccessories?: string[]; // IDs of recommended accessories
  moods?: string[]; // IDs of matching moods: 'soft-romantic' | 'main-character' | 'desi-diva' | 'clean-minimal' | 'bold-confident' | 'chill-casual'
}

export interface Occasion {
  id: string;
  name: string;
  tagline: string;
  image: string;
  category: 'festive' | 'party' | 'wedding' | 'casual' | 'college';
}

export interface Aesthetic {
  id: string;
  name: string;
  emoji: string;
  tagline: string;
  accentColor: string;
  description: string;
}

export const AESTHETICS: Aesthetic[] = [
  { id: 'coquette', name: 'Coquette', emoji: '🎀', tagline: 'Dainty bows, pearls & soft romantic looks', accentColor: '#C8A49F', description: 'Women\'s bows, delicate lace & soft romantic looks; men\'s soft pastel tailoring and refined romantic accents.' },
  { id: 'old-money', name: 'Old Money', emoji: '🍸', tagline: 'Timeless luxury & tailored tailoring', accentColor: '#4D0E13', description: 'Tailored suits, double-breasted blazers, crisp polos, shirts and elegant luxury outfits for men and women.' },
  { id: 'desi-glam', name: 'Desi Glam', emoji: '✨', tagline: 'High-octane royal sparkle & mirrorwork', accentColor: '#C7B7D4', description: 'Men\'s royal sherwanis, bandhgalas and kurta sets; women\'s glamorous zardozi lehengas and shimmering ethnic wear.' },
  { id: 'soft-girl', name: 'Soft Girl', emoji: '🌸', tagline: 'Gentle pastels, dreamy silks & florid ease', accentColor: '#C8A49F', description: 'Feminine pastel silks and florid ease; men\'s soft pastel knitwear, relaxed linens and gentle tailoring.' },
  { id: 'clean-girl', name: 'Clean Girl', emoji: '🧴', tagline: 'Crisp neutrals, slick lines & sleek elegance', accentColor: '#2D1517', description: 'Minimal monochrome coordinates, tailored linen separates, and sleek polished outfits for both genders.' },
  { id: 'baddie', name: 'Baddie', emoji: '🔥', tagline: 'Form-fitting, statement cutouts & confidence', accentColor: '#4D0E13', description: 'Bold corsetry, sculpted bodycon gowns, sharp oversized coats and striking statement streetwear for men and women.' },
  { id: 'diva', name: 'Diva', emoji: '👑', tagline: 'High drama, cape sleeves & luxury trains', accentColor: '#4D0E13', description: 'High-drama cape sleeves, floor-sweeping silhouettes and glamorous red-carpet statement outfits for men and women.' },
  { id: 'traditional', name: 'Traditional', emoji: '🪔', tagline: 'Pure handwoven heritage & classic grace', accentColor: '#4D0E13', description: 'Pure handwoven Banarasi silks, heritage brocades, raw silk sherwanis and classic ethnic wear for both men and women.' },
  { id: 'western', name: 'Western', emoji: '💃', tagline: 'Chic cocktail dresses & sharp pant suits', accentColor: '#2D1517', description: 'Men\'s crisp shirts, trousers and tailored suits; women\'s satin slip dresses, chic cocktail gowns and power wear.' },
  { id: 'y2k', name: 'Y2K', emoji: '💿', tagline: 'Playful metallics, cargo glam & nostalgia', accentColor: '#C7B7D4', description: 'Playful metallics, cargo glam, baby tees, rhinestone accents and retro-inspired street style for men and women.' },
  { id: 'quiet-luxury', name: 'Quiet Luxury', emoji: '☕', tagline: 'Understated fabrics & impeccable cuts', accentColor: '#4D0E13', description: 'Understated virgin wool suiting, plum cashmere, minimal hardware and refined whisper-quiet elegance for both genders.' },
  { id: 'cottagecore', name: 'Cottagecore', emoji: '🧺', tagline: 'Puff sleeves, meadow eyelets & nostalgia', accentColor: '#C8A49F', description: 'Nature-inspired tiered skirts, smocked bodices, prairie romance and relaxed vacation charm for men and women.' },
  { id: 'streetwear', name: 'Streetwear', emoji: '👟', tagline: 'Oversized silhouettes, drop shoulders & drip', accentColor: '#2D1517', description: 'Oversized silhouettes, drop shoulders, boxy tees, utility cargos and sneakers for men and women.' },
  { id: 'minimalist', name: 'Minimalist', emoji: '🤍', tagline: 'Pure geometry, monochrome & calm ease', accentColor: '#2D1517', description: 'Unfussy architectural cuts, neutral ivory foundations, monochrome elegance and calm ease for both genders.' },
  { id: 'boho-chic', name: 'Boho Chic', emoji: '🌙', tagline: 'Free-flowing tiers, tassels & artistic ease', accentColor: '#C7B7D4', description: 'Free-flowing tiers, artisan waist belts, oxidized silver jewelry and relaxed bohemian style for men and women.' },
  { id: 'indie-sleaze', name: 'Indie Sleaze', emoji: '🎸', tagline: 'Glam grunge, metallic sheen & nightlife edge', accentColor: '#4D0E13', description: 'Glam grunge, metallic sheen, vintage leather jackets and effortless after-hours nightlife edge for men and women.' },
];

export const OCCASIONS: Occasion[] = [
  { id: 'navratri-garba', name: 'Navratri & Garba Nights', tagline: 'Whirl in heavy mirrorwork flared ghagras & embroidered kedyus', image: '/assets/aistudio/festive_lehenga_garba_1792952794231.jpg', category: 'festive' },
  { id: 'weddings-guest', name: 'Weddings & Reception', tagline: 'Turn heads without upstaging the bride; regal silhouettes', image: '/assets/aistudio/hero_fashion_editorial_1792952792888.jpg', category: 'wedding' },
  { id: 'engagements', name: 'Engagements & Cocktail', tagline: 'Champagne silk gowns, embellished bandhgalas & sleek coordinates', image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80', category: 'wedding' },
  { id: 'festivals-diwali', name: 'Diwali & Festive Feasts', tagline: 'Zari-bordered anarkalis, raw silk kurtas and festive sparkle', image: '/assets/aistudio/download__38__b5ed67d1.jpg', category: 'festive' },
  { id: 'eid-celebrations', name: 'Eid Celebrations', tagline: 'Graceful pastel shararas, chikankari kurtas and rich velvet stoles', image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?auto=format&fit=crop&w=800&q=80', category: 'festive' },
  { id: 'birthday-parties', name: 'Birthday Parties', tagline: 'Main character coquette dresses, corset tops & statement fits', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80', category: 'party' },
  { id: 'college-farewell', name: 'College Freshers & Farewell', tagline: 'Saree styling, black-tie suits & unforgettable photo moments', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80', category: 'college' },
  { id: 'photoshoots', name: 'Editorial Photoshoots', tagline: 'High-concept couture, dramatic capes & avant-garde tailoring', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80', category: 'party' },
  { id: 'date-nights', name: 'Date Nights & Anniversaries', tagline: 'Plum silk slip dresses, velvet bombers & flattering cuts', image: 'https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&w=800&q=80', category: 'party' },
  { id: 'vacation-beach', name: 'Vacations & Resort Outings', tagline: 'Breezy linen sets, tropical coordinates and sun-drenched glam', image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80', category: 'casual' },
  { id: 'brunches-casual', name: 'Sunday Brunches', tagline: 'Pastel puff-sleeve midi dresses, loafers and effortless separates', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80', category: 'casual' },
  { id: 'formal-galas', name: 'Black Tie Galas & Formals', tagline: 'Double-breasted tuxedos, satin mermaid gowns & regal poise', image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80', category: 'party' },
];

export const APPAREL_SIZES_HER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL'];
export const APPAREL_SIZES_HIM = ['34 (XXS)', '36 (XS)', '38 (S)', '40 (M)', '42 (L)', '44 (XL)', '46 (2XL)', '48 (3XL)', '50 (4XL)'];
export const FOOTWEAR_SIZES_HER = ['EU 36 (UK 3)', 'EU 37 (UK 4)', 'EU 38 (UK 5)', 'EU 39 (UK 6)', 'EU 40 (UK 7)', 'EU 41 (UK 8)'];
export const FOOTWEAR_SIZES_HIM = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'];
export const BELT_SIZES = ['S (26-30")', 'M (30-34")', 'L (34-38")', 'XL (38-42")', 'XXL (42-46")'];

export const PRODUCTS: Product[] = [
  // ==================== FOR HER ====================
  // ==================== FOR HER ====================
  { id: 'her-1', name: 'Designer Evening Gown', brand: 'RENTORA', category: 'her', subCategory: 'Dresses', pricePerDay: 400, rentalPrice4Days: 1400, retailPrice: 30000, deposit: 1000, images: ['/assets/aistudio/designer_evening_gown_exact.png'], sizes: ['S', 'M', 'L'], colors: [{name: 'Black & Gold', hex: '#000000'}], aesthetic: ['diva', 'western'], occasions: ['formal-galas'], description: 'Sculptural black satin evening gown featuring a dramatic metallic gold bow sash and a sweeping mermaid silhouette.', fabric: 'Satin & Metallic Lamé', fit: 'Fitted', care: 'Dry clean', rating: 4.8, reviewsCount: 10, moods: ['soft-romantic', 'main-character', 'bold-confident'] },
  { id: 'her-2', name: 'Bridal Lehenga', brand: 'RENTORA', category: 'her', subCategory: 'Ethnic', pricePerDay: 600, rentalPrice4Days: 2000, retailPrice: 50000, deposit: 1500, images: ['/assets/aistudio/bridal_lehenga_exact.png'], sizes: ['S', 'M'], colors: [{name: 'Crimson Gold', hex: '#8B0000'}], aesthetic: ['desi-glam'], occasions: ['weddings-guest'], description: 'Rich crimson velvet & silk bridal lehenga with handcrafted heritage gold zardozi embroidery.', fabric: 'Silk & Velvet', fit: 'Flare', care: 'Dry clean', rating: 4.9, reviewsCount: 15, moods: ['desi-diva'] },
  { id: 'her-3', name: 'Wedding Guest Lehenga', brand: 'RENTORA', category: 'her', subCategory: 'Ethnic', pricePerDay: 350, rentalPrice4Days: 1200, retailPrice: 25000, deposit: 700, images: ['https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80'], sizes: ['S', 'M'], colors: [{name: 'Pink', hex: '#FFC0CB'}], aesthetic: ['traditional', 'soft-girl'], occasions: ['weddings-guest'], description: 'Guest lehenga in pastel blush silk.', fabric: 'Silk', fit: 'Flare', care: 'Dry clean', rating: 4.7, reviewsCount: 20, moods: ['soft-romantic', 'desi-diva'] },
  { id: 'her-4', name: 'Embroidered Anarkali Suit', brand: 'RENTORA', category: 'her', subCategory: 'Ethnic', pricePerDay: 300, rentalPrice4Days: 1000, retailPrice: 20000, deposit: 600, images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'], sizes: ['S', 'M'], colors: [{name: 'Blue', hex: '#0000FF'}], aesthetic: ['traditional'], occasions: ['festivals-diwali'], description: 'Anarkali suit.', fabric: 'Georgette', fit: 'Flare', care: 'Dry clean', rating: 4.6, reviewsCount: 12, moods: ['desi-diva'] },
  { id: 'her-5', name: 'Traditional Saree', brand: 'RENTORA', category: 'her', subCategory: 'Ethnic', pricePerDay: 350, rentalPrice4Days: 1200, retailPrice: 25000, deposit: 700, images: ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'], sizes: ['Free Size'], colors: [{name: 'Green', hex: '#008000'}], aesthetic: ['traditional'], occasions: ['festivals-diwali'], description: 'Saree.', fabric: 'Silk', fit: 'Classic', care: 'Dry clean', rating: 4.8, reviewsCount: 25, moods: ['desi-diva'] },
  { id: 'her-6', name: 'Designer Cocktail Dress', brand: 'RENTORA', category: 'her', subCategory: 'Dresses', pricePerDay: 300, rentalPrice4Days: 1000, retailPrice: 20000, deposit: 600, images: ['https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=80'], sizes: ['S', 'M'], colors: [{name: 'Black', hex: '#000000'}], aesthetic: ['western', 'minimalist'], occasions: ['formal-galas'], description: 'Cocktail dress.', fabric: 'Satin', fit: 'Fitted', care: 'Dry clean', rating: 4.7, reviewsCount: 18, moods: ['main-character', 'clean-minimal'] },
  { id: 'her-7', name: 'Indo-Western Co-Ord Set', brand: 'RENTORA', category: 'her', subCategory: 'Dresses', pricePerDay: 300, rentalPrice4Days: 1000, retailPrice: 20000, deposit: 600, images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'], sizes: ['S', 'M'], colors: [{name: 'White', hex: '#FFFFFF'}], aesthetic: ['western', 'clean-girl'], occasions: ['brunches-casual'], description: 'Co-ord set.', fabric: 'Cotton', fit: 'Relaxed', care: 'Dry clean', rating: 4.6, reviewsCount: 11, moods: ['clean-minimal', 'chill-casual'] },
  { id: 'her-8', name: 'Garba Chaniya Choli', brand: 'RENTORA', category: 'her', subCategory: 'Ethnic', pricePerDay: 350, rentalPrice4Days: 1200, retailPrice: 25000, deposit: 700, images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'], sizes: ['S', 'M'], colors: [{name: 'Multi', hex: '#FF00FF'}], aesthetic: ['desi-glam'], occasions: ['navratri-garba'], description: 'Garba set.', fabric: 'Cotton', fit: 'Flare', care: 'Dry clean', rating: 4.9, reviewsCount: 30, moods: ['desi-diva'] },
  { id: 'her-9', name: 'Festive Sharara Set', brand: 'RENTORA', category: 'her', subCategory: 'Ethnic', pricePerDay: 300, rentalPrice4Days: 1000, retailPrice: 20000, deposit: 600, images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80'], sizes: ['S', 'M'], colors: [{name: 'Yellow', hex: '#FFFF00'}], aesthetic: ['traditional'], occasions: ['festivals-diwali'], description: 'Sharara set.', fabric: 'Georgette', fit: 'Relaxed', care: 'Dry clean', rating: 4.7, reviewsCount: 14, moods: ['desi-diva'] },
  { id: 'her-10', name: 'Elegant Reception Gown', brand: 'RENTORA', category: 'her', subCategory: 'Dresses', pricePerDay: 400, rentalPrice4Days: 1400, retailPrice: 30000, deposit: 1000, images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'], sizes: ['S', 'M'], colors: [{name: 'Silver', hex: '#C0C0C0'}], aesthetic: ['diva', 'western'], occasions: ['formal-galas'], description: 'Reception gown in liquid metallic sheen.', fabric: 'Satin', fit: 'Fitted', care: 'Dry clean', rating: 4.8, reviewsCount: 22, moods: ['main-character', 'bold-confident'] },
  { id: 'her-11', name: 'Birthday Party Dress', brand: 'RENTORA', category: 'her', subCategory: 'Dresses', pricePerDay: 250, rentalPrice4Days: 800, retailPrice: 15000, deposit: 500, images: ['https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80'], sizes: ['S', 'M'], colors: [{name: 'Pink', hex: '#FFC0CB'}], aesthetic: ['coquette', 'soft-girl'], occasions: ['birthday-parties'], description: 'Romantic pastel pink party dress.', fabric: 'Polyester', fit: 'Fitted', care: 'Dry clean', rating: 4.6, reviewsCount: 15, moods: ['soft-romantic', 'chill-casual'] },
  { id: 'her-12', name: 'Chic Mini Party Dress', brand: 'RENTORA', category: 'her', subCategory: 'Dresses', pricePerDay: 250, rentalPrice4Days: 800, retailPrice: 15000, deposit: 500, images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80'], sizes: ['S', 'M'], colors: [{name: 'Black', hex: '#000000'}], aesthetic: ['western', 'baddie'], occasions: ['birthday-parties'], description: 'Edgy mini dress with sharp styling.', fabric: 'Polyester', fit: 'Fitted', care: 'Dry clean', rating: 4.7, reviewsCount: 19, moods: ['bold-confident'] },
  { id: 'her-13', name: 'Premium Blazer and Trouser Set', brand: 'RENTORA', category: 'her', subCategory: 'Dresses', pricePerDay: 350, rentalPrice4Days: 1200, retailPrice: 25000, deposit: 700, images: ['https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&w=800&q=80'], sizes: ['S', 'M'], colors: [{name: 'Beige', hex: '#F5F5DC'}], aesthetic: ['western', 'clean-girl', 'quiet-luxury'], occasions: ['formal-galas'], description: 'Tailored neutral beige power blazer set.', fabric: 'Polyester', fit: 'Relaxed', care: 'Dry clean', rating: 4.7, reviewsCount: 16, moods: ['clean-minimal', 'bold-confident'] },
  { id: 'her-14', name: 'Resort Maxi Dress', brand: 'RENTORA', category: 'her', subCategory: 'Dresses', pricePerDay: 250, rentalPrice4Days: 800, retailPrice: 15000, deposit: 500, images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=800&q=80'], sizes: ['S', 'M'], colors: [{name: 'White', hex: '#FFFFFF'}], aesthetic: ['western', 'cottagecore'], occasions: ['vacation-beach'], description: 'Breezy white maxi dress.', fabric: 'Cotton', fit: 'Relaxed', care: 'Dry clean', rating: 4.6, reviewsCount: 11, moods: ['soft-romantic', 'clean-minimal', 'chill-casual'] },
  { id: 'her-15', name: 'Engagement Outfit', brand: 'RENTORA', category: 'her', subCategory: 'Ethnic', pricePerDay: 400, rentalPrice4Days: 1400, retailPrice: 30000, deposit: 1000, images: ['https://images.unsplash.com/photo-1550639525-c97d455acf70?auto=format&fit=crop&w=800&q=80'], sizes: ['S', 'M'], colors: [{name: 'Gold', hex: '#FFD700'}], aesthetic: ['desi-glam'], occasions: ['engagements'], description: 'Engagement outfit.', fabric: 'Silk', fit: 'Fitted', care: 'Dry clean', rating: 4.8, reviewsCount: 20, moods: ['desi-diva'] },
  { id: 'her-16', name: 'Editorial Photoshoot Dress', brand: 'RENTORA', category: 'her', subCategory: 'Dresses', pricePerDay: 500, rentalPrice4Days: 1800, retailPrice: 40000, deposit: 1200, images: ['https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'], sizes: ['S', 'M'], colors: [{name: 'White', hex: '#FFFFFF'}], aesthetic: ['diva'], occasions: ['photoshoots'], description: 'Photoshoot dress.', fabric: 'Silk', fit: 'Fitted', care: 'Dry clean', rating: 4.9, reviewsCount: 25, moods: ['main-character', 'bold-confident'] },
  // ==================== FOR HIM ====================
  { id: 'him-1', name: 'Classic Black Tuxedo', brand: 'RENTORA', category: 'him', subCategory: 'Suits', pricePerDay: 500, rentalPrice4Days: 1800, retailPrice: 40000, deposit: 1200, images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80'], sizes: ['M', 'L', 'XL'], colors: [{name: 'Black', hex: '#000000'}], aesthetic: ['old-money'], occasions: ['formal-galas'], description: 'Classic tuxedo.', fabric: 'Wool', fit: 'Slim', care: 'Dry clean', rating: 4.9, reviewsCount: 12, moods: ['main-character', 'clean-minimal', 'bold-confident'] },
  { id: 'him-2', name: 'Navy Blue Three-Piece Suit', brand: 'RENTORA', category: 'him', subCategory: 'Suits', pricePerDay: 450, rentalPrice4Days: 1600, retailPrice: 35000, deposit: 1000, images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'], sizes: ['M', 'L', 'XL'], colors: [{name: 'Navy', hex: '#000080'}], aesthetic: ['old-money', 'quiet-luxury'], occasions: ['formal-galas'], description: 'Tailored navy suit with crisp vest.', fabric: 'Wool', fit: 'Slim', care: 'Dry clean', rating: 4.8, reviewsCount: 15, moods: ['clean-minimal'] },
  { id: 'him-3', name: 'Wedding Sherwani', brand: 'RENTORA', category: 'him', subCategory: 'Ethnic', pricePerDay: 600, rentalPrice4Days: 2000, retailPrice: 50000, deposit: 1500, images: ['/assets/aistudio/Blue_velvet_indowestern_with_gold_zardosi_embroidery_254366cd.jpg', 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'], sizes: ['M', 'L', 'XL'], colors: [{name: 'Royal Blue', hex: '#0A2540'}], aesthetic: ['traditional'], occasions: ['weddings-guest'], description: 'The Nizam Royal Velvet & Silk Sherwani with handcrafted zardosi embroidery.', fabric: 'Silk Velvet', fit: 'Fitted', care: 'Dry clean', rating: 4.9, reviewsCount: 20, moods: ['desi-diva'] },
  { id: 'him-4', name: 'Ivory Embroidered Sherwani', brand: 'RENTORA', category: 'him', subCategory: 'Ethnic', pricePerDay: 550, rentalPrice4Days: 1900, retailPrice: 45000, deposit: 1400, images: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'], sizes: ['M', 'L', 'XL'], colors: [{name: 'Ivory', hex: '#FFFFF0'}], aesthetic: ['traditional', 'soft-girl'], occasions: ['weddings-guest'], description: 'Ivory sherwani with delicate embroidery.', fabric: 'Silk', fit: 'Fitted', care: 'Dry clean', rating: 4.8, reviewsCount: 18, moods: ['soft-romantic', 'desi-diva'] },
  { id: 'him-5', name: 'Indo-Western Festive Outfit', brand: 'RENTORA', category: 'him', subCategory: 'Ethnic', pricePerDay: 400, rentalPrice4Days: 1400, retailPrice: 30000, deposit: 1000, images: ['https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=800&q=80'], sizes: ['M', 'L', 'XL'], colors: [{name: 'Maroon', hex: '#800000'}], aesthetic: ['desi-glam'], occasions: ['festivals-diwali'], description: 'Indo-western outfit.', fabric: 'Silk', fit: 'Fitted', care: 'Dry clean', rating: 4.7, reviewsCount: 14, moods: ['desi-diva'] },
  { id: 'him-6', name: 'Kurta-Pajama Set', brand: 'RENTORA', category: 'him', subCategory: 'Ethnic', pricePerDay: 250, rentalPrice4Days: 800, retailPrice: 15000, deposit: 500, images: ['https://images.unsplash.com/photo-1612336307429-8a898d10e221?auto=format&fit=crop&w=800&q=80'], sizes: ['M', 'L', 'XL'], colors: [{name: 'White', hex: '#FFFFFF'}], aesthetic: ['traditional'], occasions: ['festivals-diwali'], description: 'Kurta-pajama set.', fabric: 'Cotton', fit: 'Relaxed', care: 'Dry clean', rating: 4.6, reviewsCount: 12, moods: ['desi-diva', 'chill-casual'] },
  { id: 'him-7', name: 'Bandhgala Jacket Set', brand: 'RENTORA', category: 'him', subCategory: 'Ethnic', pricePerDay: 350, rentalPrice4Days: 1200, retailPrice: 25000, deposit: 700, images: ['https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80'], sizes: ['M', 'L', 'XL'], colors: [{name: 'Black', hex: '#000000'}], aesthetic: ['old-money'], occasions: ['formal-galas'], description: 'Bandhgala set.', fabric: 'Wool', fit: 'Fitted', care: 'Dry clean', rating: 4.8, reviewsCount: 16, moods: ['clean-minimal', 'bold-confident'] },
  { id: 'him-8', name: 'Black Formal Blazer', brand: 'RENTORA', category: 'him', subCategory: 'Suits', pricePerDay: 300, rentalPrice4Days: 1000, retailPrice: 20000, deposit: 600, images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80'], sizes: ['M', 'L', 'XL'], colors: [{name: 'Black', hex: '#000000'}], aesthetic: ['western'], occasions: ['formal-galas'], description: 'Formal blazer.', fabric: 'Wool', fit: 'Slim', care: 'Dry clean', rating: 4.7, reviewsCount: 13, moods: ['clean-minimal', 'bold-confident'] },
  { id: 'him-9', name: 'Cocktail Party Suit', brand: 'RENTORA', category: 'him', subCategory: 'Suits', pricePerDay: 400, rentalPrice4Days: 1400, retailPrice: 30000, deposit: 1000, images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'], sizes: ['M', 'L', 'XL'], colors: [{name: 'Blue', hex: '#0000FF'}], aesthetic: ['western'], occasions: ['formal-galas'], description: 'Cocktail suit in royal blue.', fabric: 'Wool', fit: 'Slim', care: 'Dry clean', rating: 4.8, reviewsCount: 17, moods: ['main-character', 'bold-confident'] },
  { id: 'him-10', name: 'Garba Night Traditional Outfit', brand: 'RENTORA', category: 'him', subCategory: 'Ethnic', pricePerDay: 300, rentalPrice4Days: 1000, retailPrice: 20000, deposit: 600, images: ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80'], sizes: ['M', 'L', 'XL'], colors: [{name: 'Multi', hex: '#FF00FF'}], aesthetic: ['desi-glam'], occasions: ['navratri-garba'], description: 'Garba outfit with festive embroidery.', fabric: 'Cotton', fit: 'Relaxed', care: 'Dry clean', rating: 4.9, reviewsCount: 25, moods: ['desi-diva'] },
  { id: 'him-11', name: 'Printed Festive Kurta', brand: 'RENTORA', category: 'him', subCategory: 'Ethnic', pricePerDay: 250, rentalPrice4Days: 800, retailPrice: 15000, deposit: 500, images: ['https://images.unsplash.com/photo-1612336307429-8a898d10e221?auto=format&fit=crop&w=800&q=80'], sizes: ['M', 'L', 'XL'], colors: [{name: 'Blue', hex: '#0000FF'}], aesthetic: ['traditional'], occasions: ['festivals-diwali'], description: 'Festive kurta.', fabric: 'Cotton', fit: 'Relaxed', care: 'Dry clean', rating: 4.6, reviewsCount: 10, moods: ['desi-diva'] },
  { id: 'him-12', name: 'Casual Linen Shirt and Trousers', brand: 'RENTORA', category: 'him', subCategory: 'Casual', pricePerDay: 200, rentalPrice4Days: 600, retailPrice: 10000, deposit: 300, images: ['https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80'], sizes: ['M', 'L', 'XL'], colors: [{name: 'White', hex: '#FFFFFF'}], aesthetic: ['western', 'clean-girl'], occasions: ['vacation-beach'], description: 'Airy linen shirt & relaxed trousers set.', fabric: 'Linen', fit: 'Relaxed', care: 'Dry clean', rating: 4.5, reviewsCount: 8, moods: ['clean-minimal', 'chill-casual'] },
  { id: 'him-13', name: 'Resort Wear Set', brand: 'RENTORA', category: 'him', subCategory: 'Casual', pricePerDay: 250, rentalPrice4Days: 800, retailPrice: 15000, deposit: 500, images: ['https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=800&q=80'], sizes: ['M', 'L', 'XL'], colors: [{name: 'Blue', hex: '#0000FF'}], aesthetic: ['western'], occasions: ['vacation-beach'], description: 'Resort set.', fabric: 'Cotton', fit: 'Relaxed', care: 'Dry clean', rating: 4.6, reviewsCount: 9, moods: ['chill-casual'] },
  { id: 'him-14', name: 'Premium Waistcoat Outfit', brand: 'RENTORA', category: 'him', subCategory: 'Ethnic', pricePerDay: 350, rentalPrice4Days: 1200, retailPrice: 25000, deposit: 700, images: ['https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'], sizes: ['M', 'L', 'XL'], colors: [{name: 'Black', hex: '#000000'}], aesthetic: ['traditional'], occasions: ['weddings-guest'], description: 'Waistcoat outfit.', fabric: 'Silk', fit: 'Fitted', care: 'Dry clean', rating: 4.7, reviewsCount: 15, moods: ['soft-romantic', 'desi-diva'] },
  { id: 'him-15', name: 'Designer Wedding Guest Outfit', brand: 'RENTORA', category: 'him', subCategory: 'Ethnic', pricePerDay: 450, rentalPrice4Days: 1600, retailPrice: 35000, deposit: 1000, images: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'], sizes: ['M', 'L', 'XL'], colors: [{name: 'Gold', hex: '#FFD700'}], aesthetic: ['traditional'], occasions: ['weddings-guest'], description: 'Wedding outfit in rich zari raw silk.', fabric: 'Silk', fit: 'Fitted', care: 'Dry clean', rating: 4.8, reviewsCount: 19, moods: ['desi-diva'] },
  { id: 'him-16', name: 'Editorial Photoshoot Outfit', brand: 'RENTORA', category: 'him', subCategory: 'Suits', pricePerDay: 500, rentalPrice4Days: 1800, retailPrice: 40000, deposit: 1200, images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80'], sizes: ['M', 'L', 'XL'], colors: [{name: 'Black', hex: '#000000'}], aesthetic: ['diva'], occasions: ['photoshoots'], description: 'Photoshoot outfit.', fabric: 'Wool', fit: 'Slim', care: 'Dry clean', rating: 4.9, reviewsCount: 22, moods: ['main-character', 'bold-confident'] },
  {
    id: 'him-suit-tuxedo-charcoal',
    name: 'Savile Row Satin Shawl Lapel Tuxedo',
    brand: 'Lord & RENTORA',
    category: 'him',
    subCategory: 'Suits & Blazers',
    pricePerDay: 449,
    rentalPrice4Days: 1699,
    retailPrice: 42000,
    deposit: 1000,
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80'],
    sizes: APPAREL_SIZES_HIM,
    colors: [
      { name: 'Midnight Charcoal', hex: '#2D1517' },
      { name: 'Plum Velvet Tux', hex: '#4D0E13' }
    ],
    aesthetic: ['old-money', 'quiet-luxury', 'western', 'minimalist'],
    occasions: ['formal-galas', 'engagements', 'college-farewell', 'weddings-guest'],
    description: 'Black-tie perfection cut from super 140s Italian wool with a lustrous silk-satin shawl lapel, matched trousers with satin side stripes, and crisp tuxedo shirt.',
    fabric: 'Super 140s Wool with Duchesse Satin Trim',
    fit: 'Modern tailored slim fit with slight waist suppression',
    care: 'Pressed and delivered ready-to-wear with wooden hanger.',
    rating: 4.9,
    reviewsCount: 26,
    matchingAccessories: ['acc-velvet-embroidered-loafers'],
    moods: ['main-character', 'clean-minimal']
  },
  {
    id: 'him-kurta-mirrorwork-rose',
    name: 'Jharokha Dusty Rose Silk Kurta & Nehru Jacket',
    brand: 'RENTORA Utsav',
    category: 'him',
    subCategory: 'Ethnic & Sherwanis',
    pricePerDay: 325,
    rentalPrice4Days: 1249,
    retailPrice: 22000,
    deposit: 700,
    images: ['/assets/aistudio/mens_rose_kurta_1792980985890.jpg'],
    sizes: APPAREL_SIZES_HIM,
    colors: [
      { name: 'Dusty Rose & Ivory', hex: '#C8A49F' },
      { name: 'Soft Lavender', hex: '#C7B7D4' }
    ],
    aesthetic: ['desi-glam', 'traditional', 'soft-girl', 'coquette'],
    occasions: ['navratri-garba', 'festivals-diwali', 'eid-celebrations', 'brunches-casual'],
    description: 'Pure raw-silk asymmetric kurta layered under a hand-embroidered mirrorwork Nehru jacket with antique buttons. Pair with tapered off-white trousers.',
    fabric: 'Raw Mulberry Silk & Organza Blend',
    fit: 'Comfortable festive drape with side vents',
    care: 'Complimentary sanitization and return pickup included.',
    rating: 4.8,
    reviewsCount: 45,
    matchingAccessories: ['acc-velvet-embroidered-loafers'],
    moods: ['soft-romantic', 'desi-diva']
  },
  {
    id: 'him-velvet-smoking-jacket',
    name: 'Midnight Velvet Tailored Smoking Jacket',
    brand: 'Maison RENTORA',
    category: 'him',
    subCategory: 'Suits & Blazers',
    pricePerDay: 390,
    rentalPrice4Days: 1450,
    retailPrice: 32000,
    deposit: 850,
    images: ['https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'],
    sizes: APPAREL_SIZES_HIM,
    colors: [
      { name: 'Plum Velvet', hex: '#4D0E13' }
    ],
    aesthetic: ['old-money', 'diva', 'indie-sleaze', 'quiet-luxury'],
    occasions: ['formal-galas', 'date-nights', 'engagements'],
    description: 'Luxe micro-velvet smoking jacket with silk satin peak lapels and frosted brass buttons.',
    fabric: 'Silk-blend Micro Velvet',
    fit: 'Slightly nipped waist tailored silhouette',
    care: 'Pre-sanitized.',
    rating: 4.9,
    reviewsCount: 21,
    matchingAccessories: ['acc-velvet-embroidered-loafers'],
    moods: ['main-character', 'bold-confident']
  },
  {
    id: 'him-street-overcoat-rosewood',
    name: 'Atelier Double-Breasted Wool Overcoat',
    brand: 'RENTORA Streetwear',
    category: 'him',
    subCategory: 'Streetwear & Casual',
    pricePerDay: 350,
    rentalPrice4Days: 1299,
    retailPrice: 26500,
    deposit: 750,
    images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'],
    sizes: APPAREL_SIZES_HIM,
    colors: [
      { name: 'Charcoal Plum', hex: '#2D1517' }
    ],
    aesthetic: ['streetwear', 'clean-girl', 'minimalist', 'old-money'],
    occasions: ['birthday-parties', 'photoshoots', 'vacation-beach', 'date-nights'],
    description: 'Double-breasted virgin wool blend tailored longcoat with wide peak lapels.',
    fabric: 'Virgin Wool & Silk Viscose Lining',
    fit: 'Relaxed drop-shoulder boxy fit',
    care: 'Dry cleaned.',
    rating: 4.7,
    reviewsCount: 19,
    matchingAccessories: ['acc-clean-sneaker'],
    moods: ['clean-minimal', 'bold-confident']
  },
  {
    id: 'him-boho-bandhgala',
    name: 'Linen Brocade Open Bandhgala Set',
    brand: 'RENTORA Utsav',
    category: 'him',
    subCategory: 'Ethnic & Sherwanis',
    pricePerDay: 310,
    rentalPrice4Days: 1100,
    retailPrice: 20000,
    deposit: 600,
    images: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'],
    sizes: APPAREL_SIZES_HIM,
    colors: [
      { name: 'Earthy Sand', hex: '#D8C4AC' }
    ],
    aesthetic: ['boho-chic', 'traditional', 'minimalist'],
    occasions: ['brunches-casual', 'vacation-beach', 'festivals-diwali'],
    description: 'Lightweight linen-blend bandhgala jacket with woven self-design motifs and drawstring linen trousers.',
    fabric: 'Raw Linen & Cotton Blend',
    fit: 'Relaxed summer festive fit',
    care: 'Ozone sanitized.',
    rating: 4.8,
    reviewsCount: 18,
    matchingAccessories: ['acc-velvet-embroidered-loafers'],
    moods: ['chill-casual', 'clean-minimal']
  },
  {
    id: 'him-y2k-leather-bomber',
    name: 'Vintage Leather Biker Bomber Jacket',
    brand: 'RENTORA Y2K',
    category: 'him',
    subCategory: 'Streetwear & Casual',
    pricePerDay: 330,
    rentalPrice4Days: 1190,
    retailPrice: 24000,
    deposit: 700,
    images: ['https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=800&q=80'],
    sizes: APPAREL_SIZES_HIM,
    colors: [
      { name: 'Distressed Black', hex: '#2D1517' }
    ],
    aesthetic: ['y2k', 'indie-sleaze', 'streetwear', 'baddie'],
    occasions: ['birthday-parties', 'photoshoots', 'college-farewell'],
    description: 'Heavyweight vintage distressed faux leather bomber with silver chunky zippers and quilted lining.',
    fabric: 'Vegan Distressed Leatherette',
    fit: 'Boxy retro Y2K fit',
    care: 'Pre-sanitized.',
    rating: 4.8,
    reviewsCount: 22,
    matchingAccessories: ['acc-clean-sneaker'],
    moods: ['bold-confident']
  },
  {
    id: 'him-suit-linen-sand',
    name: 'Riviera Ivory Double-Breasted Linen Suit',
    brand: 'Lord & RENTORA',
    category: 'him',
    subCategory: 'Suits & Blazers',
    pricePerDay: 360,
    rentalPrice4Days: 1350,
    retailPrice: 29000,
    deposit: 750,
    images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'],
    sizes: APPAREL_SIZES_HIM,
    colors: [
      { name: 'Ivory Sand', hex: '#EEE4DA' }
    ],
    aesthetic: ['old-money', 'clean-girl', 'quiet-luxury', 'minimalist'],
    occasions: ['brunches-casual', 'vacation-beach', 'engagements', 'photoshoots'],
    description: 'Breezy double-breasted suit tailored from pure Italian flax linen with mother-of-pearl buttons and flat-front trousers.',
    fabric: '100% Italian Linen with Lightweight Viscose Lining',
    fit: 'Tailored resort fit with unconstructed soft shoulders',
    care: 'Eco-steamed and dry cleaned.',
    rating: 4.9,
    reviewsCount: 24,
    matchingAccessories: ['acc-men-heritage-watch'],
    moods: ['clean-minimal', 'chill-casual']
  },
  {
    id: 'him-indowestern-emerald-zari',
    name: 'Shahenshah Emerald Green Zardozi Indo-Western Suit',
    brand: 'Virasat by RENTORA',
    category: 'him',
    subCategory: 'Ethnic & Sherwanis',
    pricePerDay: 420,
    rentalPrice4Days: 1599,
    retailPrice: 42000,
    deposit: 1000,
    images: ['https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'],
    sizes: APPAREL_SIZES_HIM,
    colors: [
      { name: 'Emerald Green & Gold', hex: '#1B4D3E' },
      { name: 'Midnight Charcoal', hex: '#2D1517' }
    ],
    aesthetic: ['desi-glam', 'traditional', 'old-money', 'diva'],
    occasions: ['weddings-guest', 'engagements', 'festivals-diwali', 'formal-galas'],
    description: 'Architectural asymmetric crossover jacket with hand-embroidered metallic zardozi on collar and shoulder, paired with tailored slim-fit trousers.',
    fabric: 'Silk Georgette & Satin Lining with Zari',
    fit: 'Sculpted athletic fit with structured shoulder pads',
    care: 'Museum-grade heritage dry cleaning included.',
    rating: 4.9,
    reviewsCount: 32,
    isTrending: true,
    matchingAccessories: ['acc-velvet-embroidered-loafers'],
    moods: ['desi-diva', 'main-character']
  },
  {
    id: 'him-bandhgala-royal-ivory',
    name: 'Imperial Ivory Silk Jacquard Bandhgala Suit',
    brand: 'RENTORA Royal Heritage',
    category: 'him',
    subCategory: 'Ethnic & Sherwanis',
    pricePerDay: 390,
    rentalPrice4Days: 1499,
    retailPrice: 38000,
    deposit: 900,
    images: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'],
    sizes: APPAREL_SIZES_HIM,
    colors: [
      { name: 'Ivory Jacquard', hex: '#EEE4DA' }
    ],
    aesthetic: ['quiet-luxury', 'old-money', 'traditional', 'minimalist'],
    occasions: ['weddings-guest', 'engagements', 'festivals-diwali', 'brunches-casual'],
    description: 'Classic high-neck regal bandhgala tailored in subtle self-woven gold jacquard silk with antiqued brass buttons and straight trousers.',
    fabric: 'Pure Mulberry Silk Jacquard',
    fit: 'Sharp razor-cut shoulder with chest ease',
    care: 'Ozone sanitized.',
    rating: 4.8,
    reviewsCount: 28,
    matchingAccessories: ['acc-velvet-embroidered-loafers'],
    moods: ['clean-minimal', 'soft-romantic']
  },
  {
    id: 'him-blazer-velvet-navy',
    name: 'Sovereign Midnight Navy Velvet Dinner Jacket',
    brand: 'Maison RENTORA',
    category: 'him',
    subCategory: 'Suits & Blazers',
    pricePerDay: 375,
    rentalPrice4Days: 1399,
    retailPrice: 34000,
    deposit: 800,
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80'],
    sizes: APPAREL_SIZES_HIM,
    colors: [
      { name: 'Midnight Navy', hex: '#2D1517' }
    ],
    aesthetic: ['baddie', 'diva', 'western', 'quiet-luxury'],
    occasions: ['formal-galas', 'date-nights', 'college-farewell', 'birthday-parties'],
    description: 'Sumptuous plush navy micro-velvet single-breasted dinner jacket with satin shawl lapels and silk-covered buttons.',
    fabric: 'Plush Italian Micro-Velvet with Satin Face',
    fit: 'Modern Italian tailored fit',
    care: 'Sanitized in garment sleeve.',
    rating: 4.9,
    reviewsCount: 25,
    matchingAccessories: ['acc-men-silk-pocket-tie'],
    moods: ['main-character', 'bold-confident']
  },


  // ==================== ACCESSORIES ====================
  // JEWELLERY & EARRINGS
  {
    id: 'acc-pearl-choker',
    name: 'Constellation Triple-Row Baroque Pearl Choker',
    brand: 'RENTORA Bijoux',
    category: 'accessory',
    subCategory: 'Jewellery & Necklaces',
    pricePerDay: 120,
    rentalPrice4Days: 399,
    retailPrice: 8500,
    deposit: 300,
    images: ['/assets/aistudio/coquette_accessories_gift_1792952794547.jpg'],
    sizes: ['One Size (Adjustable extender chain)'],
    colors: [
      { name: 'Warm Ivory & Gold', hex: '#EEE4DA' }
    ],
    aesthetic: ['coquette', 'old-money', 'soft-girl', 'desi-glam', 'clean-girl'],
    occasions: ['weddings-guest', 'engagements', 'birthday-parties', 'formal-galas', 'date-nights'],
    description: 'Triple-strand cultured pearl choker adorned with hand-set crystal filigree clasps. Pairs seamlessly with plunging evening gowns as well as sweetheart lehenga blouses.',
    fabric: 'Freshwater Pearls & 18K Gold Vermeil',
    fit: '13" base with 3" adjustable extender',
    care: 'Hygienically UV-sanitized and delivered in a velvet jewelry case.',
    rating: 5.0,
    reviewsCount: 64,
    isTrending: true,
    moods: ['soft-romantic', 'clean-minimal']
  },
  {
    id: 'acc-pearl-drop-earrings',
    name: 'Lumière Freshwater Pearl Drop Earrings',
    brand: 'RENTORA Bijoux',
    category: 'accessory',
    subCategory: 'Jewellery & Necklaces',
    pricePerDay: 95,
    rentalPrice4Days: 320,
    retailPrice: 6500,
    deposit: 250,
    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80'],
    sizes: ['One Size'],
    colors: [
      { name: 'Lustrous Pearl & Gold', hex: '#EEE4DA' }
    ],
    aesthetic: ['soft-girl', 'coquette', 'clean-girl'],
    occasions: ['weddings-guest', 'engagements', 'date-nights', 'brunches-casual'],
    description: 'Delicate tear-shaped cultured freshwater pearls dangling from dainty 18K gold vermeil French wire hooks.',
    fabric: 'Natural Freshwater Pearls & 18K Gold Vermeil',
    fit: 'Featherlight drop hook',
    care: 'Sanitized and sealed in soft velvet pouch.',
    rating: 4.9,
    reviewsCount: 38,
    moods: ['soft-romantic']
  },
  {
    id: 'acc-kundan-jhumkas',
    name: 'Chandbali Kundan & Seed Pearl Jhumkas',
    brand: 'Virasat Jewels',
    category: 'accessory',
    subCategory: 'Jewellery & Necklaces',
    pricePerDay: 130,
    rentalPrice4Days: 450,
    retailPrice: 11000,
    deposit: 350,
    images: ['https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80'],
    sizes: ['One Size'],
    colors: [
      { name: 'Antique Gold & Pearl', hex: '#D8C4AC' }
    ],
    aesthetic: ['desi-glam', 'traditional'],
    occasions: ['weddings-guest', 'navratri-garba', 'festivals-diwali', 'engagements'],
    description: 'Grand crescent Chandbali earrings with intricate hand-cut Kundan stones, micro-meenakari work, and hanging pearl cluster bells.',
    fabric: '22K Gold Micro-Plating on Brass with Uncut Stones & Pearls',
    fit: 'Comfortable post back with support disk',
    care: 'UV sanitized in padded royal jewel box.',
    rating: 4.9,
    reviewsCount: 52,
    moods: ['desi-diva']
  },
  {
    id: 'acc-jewelled-necklace',
    name: 'Maharani Emerald & Diamond Choker Set',
    brand: 'Virasat Jewels',
    category: 'accessory',
    subCategory: 'Jewellery & Necklaces',
    pricePerDay: 180,
    rentalPrice4Days: 599,
    retailPrice: 18000,
    deposit: 500,
    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80'],
    sizes: ['One Size (Adjustable dori closure)'],
    colors: [
      { name: 'Emerald & Antique Gold', hex: '#D8C4AC' }
    ],
    aesthetic: ['desi-glam', 'traditional', 'diva'],
    occasions: ['weddings-guest', 'engagements', 'festivals-diwali'],
    description: 'Heavy Kundan and uncut stone choker with drop emerald beads and matching oversized chandelier earrings.',
    fabric: '22K Gold Micro Plating with Cubic Zirconia & Faux Emeralds',
    fit: 'Adjustable thread tie',
    care: 'UV sanitized in velvet box.',
    rating: 4.9,
    reviewsCount: 31,
    moods: ['desi-diva', 'main-character']
  },
  {
    id: 'acc-crystal-chandelier-earrings',
    name: 'Starlight Starburst Crystal Chandelier Earrings',
    brand: 'Maison RENTORA',
    category: 'accessory',
    subCategory: 'Jewellery & Necklaces',
    pricePerDay: 110,
    rentalPrice4Days: 380,
    retailPrice: 9200,
    deposit: 300,
    images: ['https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80'],
    sizes: ['One Size'],
    colors: [
      { name: 'Prismatic Silver Crystal', hex: '#EEE4DA' }
    ],
    aesthetic: ['diva', 'western', 'baddie'],
    occasions: ['formal-galas', 'birthday-parties', 'photoshoots', 'engagements'],
    description: 'Dramatic cascading Austrian crystal earrings that catch every spotlight beam with radiant prismatic fire.',
    fabric: 'Rhodium-Plated Brass & Faceted Zircon Crystals',
    fit: 'Shoulder-grazing drop with hypoallergenic post',
    care: 'Jewelry polish and velvet sleeve included.',
    rating: 4.8,
    reviewsCount: 41,
    moods: ['main-character', 'bold-confident']
  },
  {
    id: 'acc-minimal-gold-huggie',
    name: 'Aura 18K Gold Geometric Huggie Earrings',
    brand: 'RENTORA Minimal',
    category: 'accessory',
    subCategory: 'Jewellery & Necklaces',
    pricePerDay: 75,
    rentalPrice4Days: 240,
    retailPrice: 5200,
    deposit: 200,
    images: ['https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80'],
    sizes: ['One Size'],
    colors: [
      { name: 'Warm Polished Gold', hex: '#D8C4AC' }
    ],
    aesthetic: ['clean-girl', 'minimalist', 'quiet-luxury'],
    occasions: ['brunches-casual', 'vacation-beach', 'formal-galas'],
    description: 'Ultra-clean architectural huggies with click-top closure. Perfect understated modern everyday luxury.',
    fabric: '18K Heavy Gold Vermeil over Sterling Silver',
    fit: 'Snug earlobe fit (14mm diameter)',
    care: 'Anti-tarnish cloth pouch.',
    rating: 4.9,
    reviewsCount: 33,
    moods: ['clean-minimal', 'chill-casual']
  },
  {
    id: 'acc-chunky-chain',
    name: 'Sovereign Sculpted Gold Collar & Cuff Set',
    brand: 'RENTORA Studio',
    category: 'accessory',
    subCategory: 'Jewellery & Necklaces',
    pricePerDay: 135,
    rentalPrice4Days: 460,
    retailPrice: 12000,
    deposit: 350,
    images: ['https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=800&q=80'],
    sizes: ['One Size'],
    colors: [
      { name: 'Brushed Royal Gold', hex: '#D8C4AC' }
    ],
    aesthetic: ['baddie', 'diva', 'western'],
    occasions: ['formal-galas', 'photoshoots', 'birthday-parties'],
    description: 'Chunky interlocking curb chain collar necklace with a matching sculpted open-cuff bracelet for commanding presence.',
    fabric: 'Heavy Polished Gold-Toned Alloy',
    fit: '16" collar length with 2" extender',
    care: 'Ozone sanitized.',
    rating: 4.7,
    reviewsCount: 29,
    moods: ['bold-confident']
  },
  {
    id: 'acc-boho-silver-belt',
    name: 'Artisan Oxidized Silver Coin Waist Belt',
    brand: 'Boho Atelier',
    category: 'accessory',
    subCategory: 'Jewellery & Necklaces',
    pricePerDay: 85,
    rentalPrice4Days: 280,
    retailPrice: 5800,
    deposit: 200,
    images: ['/assets/aistudio/White_creamy_34bef213.jpg'],
    sizes: BELT_SIZES,
    colors: [
      { name: 'Oxidized Silver & Ruby', hex: '#A8A9AD' }
    ],
    aesthetic: ['boho-chic', 'traditional', 'desi-glam'],
    occasions: ['navratri-garba', 'festivals-diwali', 'vacation-beach'],
    description: 'Statement handcrafted floral motif oxidized silver waist belt featuring delicate ruby crystal accents and adjustable link chain.',
    fabric: 'Silver Plated Brass Alloy & Ruby Crystals',
    fit: 'Adjustable link chain',
    care: 'Anti-tarnish cloth pouch.',
    rating: 4.8,
    reviewsCount: 16,
    moods: ['desi-diva']
  },

  // FOOTWEAR & SHOES
  {
    id: 'acc-metallic-stiletto',
    name: 'Starlight Metallic Ankle-Wrap Strappy Heels',
    brand: 'Maison RENTORA',
    category: 'accessory',
    subCategory: 'Shoes & Footwear',
    pricePerDay: 170,
    rentalPrice4Days: 599,
    retailPrice: 15000,
    deposit: 500,
    images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=800&q=80'],
    sizes: FOOTWEAR_SIZES_HER,
    colors: [
      { name: 'Liquid Rose Gold', hex: '#C8A49F' },
      { name: 'Mirror Silver', hex: '#C7B7D4' }
    ],
    aesthetic: ['baddie', 'diva', 'western', 'y2k'],
    occasions: ['birthday-parties', 'engagements', 'weddings-guest', 'formal-galas'],
    description: 'Architectural 90mm heel wrapped in metallic faux-leather with crisscrossing ankle ties and cushioned toe strap.',
    fabric: 'Metallic Vegan Leather & Memory Cushion',
    fit: '3.5 inch heel height, true to European sizing',
    care: 'Hospital-grade sanitized soles and insoles.',
    rating: 4.7,
    reviewsCount: 33,
    moods: ['soft-romantic', 'main-character', 'bold-confident']
  },
  {
    id: 'acc-velvet-embroidered-loafers',
    name: 'Rajwada Embroidered Velvet Evening Loafers',
    brand: 'RENTORA Men',
    category: 'accessory',
    subCategory: 'Shoes & Footwear',
    pricePerDay: 160,
    rentalPrice4Days: 549,
    retailPrice: 12500,
    deposit: 450,
    images: ['https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80'],
    sizes: FOOTWEAR_SIZES_HIM,
    colors: [
      { name: 'Plum & Antique Gold', hex: '#4D0E13' },
      { name: 'Black Velvet', hex: '#2D1517' }
    ],
    aesthetic: ['traditional', 'old-money', 'desi-glam', 'quiet-luxury'],
    occasions: ['weddings-guest', 'engagements', 'formal-galas', 'festivals-diwali'],
    description: 'Handcrafted velvet smoking slippers with delicate gold bullion embroidery along the vamp, padded memory foam insole, and stacked leather sole.',
    fabric: 'Micro Velvet with Genuine Leather Lining & Sole',
    fit: 'True to UK shoe sizes, soft slip-on fit',
    care: 'Deep cleaned, sanitized with anti-bacterial ozone treatment.',
    rating: 4.9,
    reviewsCount: 27,
    moods: ['desi-diva', 'main-character']
  },
  {
    id: 'acc-zari-juttis',
    name: 'Royal Handcrafted Zardozi Leather Juttis',
    brand: 'Virasat Footwear',
    category: 'accessory',
    subCategory: 'Shoes & Footwear',
    pricePerDay: 125,
    rentalPrice4Days: 420,
    retailPrice: 7800,
    deposit: 250,
    images: ['https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'],
    sizes: FOOTWEAR_SIZES_HER,
    colors: [
      { name: 'Antique Gold Zari', hex: '#D8C4AC' }
    ],
    aesthetic: ['desi-glam', 'traditional'],
    occasions: ['navratri-garba', 'weddings-guest', 'festivals-diwali'],
    description: 'Pure leather mojari juttis adorned with dense zardozi wire embroidery, padded memory sole, and bite-free cushioned collar.',
    fabric: 'Genuine Leather with Silk Thread Zari',
    fit: 'True to size Indian traditional jutti fit',
    care: 'Sanitized with UV ozone.',
    rating: 4.8,
    reviewsCount: 35,
    moods: ['desi-diva']
  },
  {
    id: 'acc-minimal-mule',
    name: 'Sleek Square-Toe Ivory Leather Block Mules',
    brand: 'RENTORA Minimal',
    category: 'accessory',
    subCategory: 'Shoes & Footwear',
    pricePerDay: 130,
    rentalPrice4Days: 450,
    retailPrice: 9500,
    deposit: 300,
    images: ['https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=800&q=80'],
    sizes: FOOTWEAR_SIZES_HER,
    colors: [
      { name: 'Pristine Ivory', hex: '#EEE4DA' }
    ],
    aesthetic: ['clean-girl', 'minimalist', 'quiet-luxury'],
    occasions: ['brunches-casual', 'formal-galas', 'vacation-beach'],
    description: 'Minimalist 55mm architectural block heel mule crafted in butter-soft Italian nappa leather with a modern square footbed.',
    fabric: 'Supple Nappa Leather & Leather Sole',
    fit: 'Slip-on ease, true to European sizing',
    care: 'Cleaned and sanitized.',
    rating: 4.8,
    reviewsCount: 26,
    moods: ['clean-minimal']
  },
  {
    id: 'acc-clean-sneaker',
    name: 'Pristine White Minimal Leather Court Sneakers',
    brand: 'RENTORA Leisure',
    category: 'accessory',
    subCategory: 'Shoes & Footwear',
    pricePerDay: 110,
    rentalPrice4Days: 360,
    retailPrice: 8900,
    deposit: 250,
    images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=800&q=80'],
    sizes: FOOTWEAR_SIZES_HER,
    colors: [
      { name: 'Pure White & Chalk', hex: '#FFFFFF' }
    ],
    aesthetic: ['clean-girl', 'quiet-luxury', 'streetwear'],
    occasions: ['brunches-casual', 'vacation-beach', 'birthday-parties'],
    description: 'Clean-cut low-top luxury leather sneakers with unbranded monochrome profile and ultra-cushioned cupsole.',
    fabric: 'Full-Grain Calf Leather & Natural Rubber',
    fit: 'Standard unisex trainer fit',
    care: 'Hospital sanitized insoles.',
    rating: 4.9,
    reviewsCount: 42,
    moods: ['chill-casual']
  },

  // HANDBAGS & CLUTCHES
  {
    id: 'acc-pearl-mini-tote',
    name: 'Lumière Hand-Beaded Pearl Top-Handle Bag',
    brand: 'RENTORA Bijoux',
    category: 'accessory',
    subCategory: 'Bags & Clutches',
    pricePerDay: 135,
    rentalPrice4Days: 450,
    retailPrice: 11500,
    deposit: 350,
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'],
    sizes: ['One Size'],
    colors: [
      { name: 'Iridescent Pearl Ivory', hex: '#EEE4DA' }
    ],
    aesthetic: ['coquette', 'soft-girl', 'old-money'],
    occasions: ['weddings-guest', 'engagements', 'brunches-casual'],
    description: 'Structured mini bag meticulously hand-woven from thousands of lustrous faux pearls with a satin drawstring pouch liner.',
    fabric: 'Acrylic Pearls & Silk Satin Liner',
    fit: 'Fits smartphone, compact & lip tint',
    care: 'Packed in protective silk dust bag.',
    rating: 4.9,
    reviewsCount: 37,
    moods: ['soft-romantic']
  },
  {
    id: 'acc-crystal-clutch',
    name: 'Aurelia Solstice Crystal Mosaic Minaudière',
    brand: 'Maison RENTORA',
    category: 'accessory',
    subCategory: 'Bags & Clutches',
    pricePerDay: 150,
    rentalPrice4Days: 499,
    retailPrice: 14000,
    deposit: 400,
    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80'],
    sizes: ['One Size (Fits iPhone Pro Max, cardholder & lipstick)'],
    colors: [
      { name: 'Champagne Crystal', hex: '#EEE4DA' }
    ],
    aesthetic: ['diva', 'desi-glam', 'coquette', 'old-money', 'baddie'],
    occasions: ['weddings-guest', 'engagements', 'formal-galas', 'birthday-parties'],
    description: 'Hard-case evening clutch encrusted in multifaceted Austrian crystals in floral kaleidoscope patterns. Features a jeweled ball clasp and detachable serpentine chain strap.',
    fabric: 'Gold Metal Hardware & Pavé Crystals with Satin Lining',
    fit: 'Compact structured box clutch (19cm x 12cm x 5cm)',
    care: 'Polished and inspected before dispatch.',
    rating: 4.9,
    reviewsCount: 48,
    isTrending: true,
    moods: ['main-character', 'bold-confident']
  },
  {
    id: 'acc-potli-embroidered-gold',
    name: 'Maharani Zardozi Royal Velvet Potli Bag',
    brand: 'Virasat Jewels',
    category: 'accessory',
    subCategory: 'Bags & Clutches',
    pricePerDay: 110,
    rentalPrice4Days: 380,
    retailPrice: 9800,
    deposit: 300,
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'],
    sizes: ['One Size'],
    colors: [
      { name: 'Deep Plum & Antique Gold', hex: '#4D0E13' }
    ],
    aesthetic: ['desi-glam', 'traditional', 'coquette'],
    occasions: ['weddings-guest', 'festivals-diwali', 'engagements'],
    description: 'Hand-embroidered velvet drawstring potli with pearl tassel ties and heavy zardozi motifs.',
    fabric: 'Silk Velvet & Gold Thread Work',
    fit: 'Drawstring pouch style',
    care: 'Padded dust bag.',
    rating: 4.9,
    reviewsCount: 25,
    moods: ['desi-diva']
  },
  {
    id: 'acc-minimal-leather-tote',
    name: 'Céline Architectural Ivory Leather Shoulder Bag',
    brand: 'RENTORA Minimal',
    category: 'accessory',
    subCategory: 'Bags & Clutches',
    pricePerDay: 140,
    rentalPrice4Days: 480,
    retailPrice: 13500,
    deposit: 350,
    images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80'],
    sizes: ['One Size'],
    colors: [
      { name: 'Ivory Bone & Gold Pin', hex: '#EEE4DA' }
    ],
    aesthetic: ['clean-girl', 'minimalist', 'quiet-luxury'],
    occasions: ['brunches-casual', 'formal-galas', 'photoshoots'],
    description: 'Sculptural asymmetric curved shoulder bag in smooth Italian box calfskin with invisible magnetic closure and brushed brass hardware.',
    fabric: 'Italian Box Calfskin & Suede Lining',
    fit: 'Spacious shoulder drop',
    care: 'Conditioned and boxed.',
    rating: 4.9,
    reviewsCount: 31,
    moods: ['clean-minimal']
  },
  {
    id: 'acc-bold-crimson-clutch',
    name: 'Vogue Scarlet Sculpted Geometric Minaudière',
    brand: 'Maison RENTORA',
    category: 'accessory',
    subCategory: 'Bags & Clutches',
    pricePerDay: 145,
    rentalPrice4Days: 490,
    retailPrice: 12800,
    deposit: 350,
    images: ['https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=800&q=80'],
    sizes: ['One Size'],
    colors: [
      { name: 'Saturated Scarlet Red', hex: '#B71C1C' }
    ],
    aesthetic: ['baddie', 'diva', 'western'],
    occasions: ['formal-galas', 'birthday-parties', 'photoshoots'],
    description: 'Striking sculpted crimson acrylic clutch with geometric facets and magnetic gold edge clasp. Unmistakable confidence.',
    fabric: 'Cast Acrylic & Gold-Plated Trim',
    fit: 'Box minaudière with chain strap',
    care: 'Polished in protective box.',
    rating: 4.8,
    reviewsCount: 22,
    moods: ['bold-confident']
  },
  {
    id: 'acc-canvas-crossbody',
    name: 'Riviera Canvas & Tan Saddle Leather Crossbody Bag',
    brand: 'RENTORA Leisure',
    category: 'accessory',
    subCategory: 'Bags & Clutches',
    pricePerDay: 95,
    rentalPrice4Days: 310,
    retailPrice: 7200,
    deposit: 200,
    images: ['https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'],
    sizes: ['One Size'],
    colors: [
      { name: 'Natural Sand & Saddle Tan', hex: '#D8C4AC' }
    ],
    aesthetic: ['quiet-luxury', 'clean-girl'],
    occasions: ['vacation-beach', 'brunches-casual', 'birthday-parties'],
    description: 'Heavyweight organic cotton canvas trimmed with vegetable-tanned saddle leather and adjustable shoulder strap for relaxed everyday chic.',
    fabric: 'Organic Cotton Canvas & Saddle Leather',
    fit: 'Adjustable crossbody length',
    care: 'Pre-treated waterproof finish.',
    rating: 4.7,
    reviewsCount: 19,
    moods: ['chill-casual']
  },

  // HAIR & EYEWEAR ACCENTS
  {
    id: 'acc-velvet-bow-barrette',
    name: 'Duchess Plum Velvet Oversized Bow Barrette',
    brand: 'Coquette Studio',
    category: 'accessory',
    subCategory: 'Hair Accessories',
    pricePerDay: 80,
    rentalPrice4Days: 249,
    retailPrice: 4200,
    deposit: 200,
    images: ['https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=800&q=80'],
    sizes: ['One Size'],
    colors: [
      { name: 'Deep Plum Velvet', hex: '#4D0E13' },
      { name: 'Dusty Rose Velvet', hex: '#C8A49F' }
    ],
    aesthetic: ['coquette', 'soft-girl', 'cottagecore', 'clean-girl'],
    occasions: ['birthday-parties', 'date-nights', 'brunches-casual', 'college-farewell'],
    description: 'Generous Parisian-cut micro velvet bow with a gold-tone French barrette closure. Instantly adds whimsical charm to half-up styles, low ponytails, or sleek chignons.',
    fabric: 'Silk-blend Micro Velvet & Brass Barrette',
    fit: 'French barrette clasp for all hair textures',
    care: 'UV-sanitized and packed in silk pouch.',
    rating: 4.8,
    reviewsCount: 39,
    moods: ['soft-romantic', 'chill-casual']
  },
  {
    id: 'acc-retro-cateye',
    name: 'Vintage Riviera Tinted Cat-Eye Sunglasses',
    brand: 'RENTORA Optical',
    category: 'accessory',
    subCategory: 'Sunglasses & Belts',
    pricePerDay: 90,
    rentalPrice4Days: 299,
    retailPrice: 6500,
    deposit: 250,
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80'],
    sizes: ['One Size'],
    colors: [
      { name: 'Plum Tortoise', hex: '#4D0E13' }
    ],
    aesthetic: ['clean-girl', 'old-money', 'y2k', 'streetwear', 'indie-sleaze'],
    occasions: ['vacation-beach', 'brunches-casual', 'photoshoots', 'birthday-parties'],
    description: 'Chunky sculpted acetate frames with subtle burgundy-plum gradient lenses and 100% UV400 protection.',
    fabric: 'Handmade Italian Acetate & CR39 Lenses',
    fit: 'Flattering medium frame fit for all face shapes',
    care: 'Includes microfiber cloth and hard shell travel case.',
    rating: 4.8,
    reviewsCount: 22,
    moods: ['clean-minimal', 'bold-confident', 'chill-casual']
  },
  {
    id: 'acc-kundan-bangles',
    name: 'Royal Heritage Kundan & Polki Kada Bangles (Pair)',
    brand: 'Virasat Jewels',
    category: 'accessory',
    subCategory: 'Jewellery & Necklaces',
    pricePerDay: 135,
    rentalPrice4Days: 460,
    retailPrice: 13000,
    deposit: 400,
    images: ['https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=800&q=80'],
    sizes: ['2.4 (Small)', '2.6 (Medium)', '2.8 (Large)'],
    colors: [
      { name: 'Royal Antique Gold & Emerald', hex: '#D4AF37' }
    ],
    aesthetic: ['desi-glam', 'traditional'],
    occasions: ['weddings-guest', 'festivals-diwali', 'engagements', 'navratri-garba'],
    description: 'Pair of openable royal kada bangles encrusted with hand-set Kundan stones, emerald meenakari, and seed pearl borders. Perfect complement to lehengas and sarees.',
    fabric: '22K Gold Micro-Plating on Brass with Uncut Kundan & Emerald Glaze',
    fit: 'Screw clasp opening, fits all wrist sizes comfortably',
    care: 'UV sanitized in royal velvet presentation box.',
    rating: 4.9,
    reviewsCount: 36,
    moods: ['desi-diva', 'main-character']
  },
  {
    id: 'acc-men-classic-derby',
    name: 'Handcrafted Italian Calfskin Oxford Dress Shoes',
    brand: 'RENTORA Men',
    category: 'accessory',
    subCategory: 'Shoes & Footwear',
    pricePerDay: 175,
    rentalPrice4Days: 590,
    retailPrice: 16500,
    deposit: 500,
    images: ['https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80'],
    sizes: FOOTWEAR_SIZES_HIM,
    colors: [
      { name: 'Burnished Black Calfskin', hex: '#111111' }
    ],
    aesthetic: ['old-money', 'quiet-luxury', 'western'],
    occasions: ['formal-galas', 'weddings-guest', 'college-farewell', 'engagements'],
    description: 'Sleek closed-lacing Oxford shoes handcrafted in Italy from supple full-grain calfskin with stacked leather heels and cushioned footbeds for gala nights.',
    fabric: 'Full-Grain Italian Calfskin Leather',
    fit: 'True to UK shoe sizes',
    care: 'Mirror-shined, cedar tree rested, and sanitized.',
    rating: 4.9,
    reviewsCount: 31,
    moods: ['clean-minimal', 'bold-confident']
  },
  {
    id: 'acc-men-leather-belt-cufflinks',
    name: 'Reversible Italian Leather Belt & Onyx Cufflinks Set',
    brand: 'RENTORA Men',
    category: 'accessory',
    subCategory: 'Sunglasses & Belts',
    pricePerDay: 95,
    rentalPrice4Days: 320,
    retailPrice: 7800,
    deposit: 250,
    images: ['https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80'],
    sizes: BELT_SIZES,
    colors: [
      { name: 'Italian Black Leather & Gunmetal', hex: '#0A0A0A' }
    ],
    aesthetic: ['old-money', 'quiet-luxury', 'western'],
    occasions: ['formal-galas', 'weddings-guest', 'college-farewell'],
    description: 'Dual-sided reversible Italian calfskin belt in black and rich espresso brown with brushed gunmetal buckle, paired with faceted black onyx cufflinks.',
    fabric: 'Italian Leather & Solid Gunmetal Brass with Natural Onyx',
    fit: '32mm width formal belt',
    care: 'Sanitized and packed in branded leather pouch.',
    rating: 4.8,
    reviewsCount: 28,
    moods: ['clean-minimal']
  },
  {
    id: 'acc-men-silk-pocket-tie',
    name: 'Mulberry Silk Bowtie & Hand-Rolled Pocket Square Set',
    brand: 'Lord & RENTORA',
    category: 'accessory',
    subCategory: 'Jewellery & Necklaces',
    pricePerDay: 85,
    rentalPrice4Days: 290,
    retailPrice: 6200,
    deposit: 200,
    images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80'],
    sizes: ['One Size (Adjustable neckband)'],
    colors: [
      { name: 'Mulberry Silk Black & Plum', hex: '#111111' }
    ],
    aesthetic: ['old-money', 'quiet-luxury', 'western'],
    occasions: ['formal-galas', 'college-farewell', 'weddings-guest'],
    description: 'Pure 22-momme mulberry silk pre-tied tuxedo bowtie with coordinating hand-rolled silk twill pocket square for black-tie gala perfection.',
    fabric: '100% Mulberry Silk Twill',
    fit: 'Adjustable slider fits collar sizes 14" to 19"',
    care: 'Steam pressed in protective case.',
    rating: 4.9,
    reviewsCount: 24,
    moods: ['bold-confident', 'clean-minimal']
  },
  {
    id: 'acc-men-banarasi-stole',
    name: 'Royal Banarasi Silk Zari Wedding Stole',
    brand: 'Virasat Jewels',
    category: 'accessory',
    subCategory: 'Jewellery & Necklaces',
    pricePerDay: 120,
    rentalPrice4Days: 390,
    retailPrice: 9500,
    deposit: 300,
    images: ['https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80'],
    sizes: ['Free Size (2.5m x 0.7m)'],
    colors: [
      { name: 'Royal Ivory & Antique Gold Zari', hex: '#FFFFF0' }
    ],
    aesthetic: ['traditional', 'desi-glam'],
    occasions: ['weddings-guest', 'festivals-diwali', 'engagements'],
    description: 'Bespoke handwoven Banarasi katan silk stole adorned with intricate gold zari jaal motifs and delicate fringe. Designed to drape majestically over sherwanis and kurtas.',
    fabric: 'Pure Banarasi Katan Silk & Gold Zari',
    fit: 'Generous drape length',
    care: 'Dry clean only, presented in raw silk envelope.',
    rating: 4.9,
    reviewsCount: 33,
    moods: ['desi-diva']
  },
  {
    id: 'acc-men-heritage-watch',
    name: 'Kallista Heritage Chronograph Dress Watch',
    brand: 'RENTORA Men',
    category: 'accessory',
    subCategory: 'Sunglasses & Belts',
    pricePerDay: 190,
    rentalPrice4Days: 650,
    retailPrice: 22000,
    deposit: 700,
    images: ['https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80'],
    sizes: ['One Size (Adjustable strap)'],
    colors: [
      { name: 'Cognac Leather & 18K Gold', hex: '#8B4513' }
    ],
    aesthetic: ['old-money', 'quiet-luxury'],
    occasions: ['formal-galas', 'weddings-guest', 'brunches-casual'],
    description: 'Sophisticated 40mm chronograph with sunburst sapphire dial, 18K gold-plated stainless steel case, and hand-stitched cognac calfskin strap.',
    fabric: '316L Stainless Steel, Sapphire Crystal & Italian Leather',
    fit: '40mm diameter case, adjustable wrist strap',
    care: 'Precision inspected and UV sanitized in watch case.',
    rating: 4.9,
    reviewsCount: 40,
    moods: ['clean-minimal', 'bold-confident']
  },
  {
    id: 'acc-men-mojari-juttis',
    name: 'Hand-Embroidered Raw Silk Mojari Juttis',
    brand: 'Virasat Footwear',
    category: 'accessory',
    subCategory: 'Shoes & Footwear',
    pricePerDay: 130,
    rentalPrice4Days: 440,
    retailPrice: 8500,
    deposit: 300,
    images: ['https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80'],
    sizes: FOOTWEAR_SIZES_HIM,
    colors: [
      { name: 'Raw Silk Ivory & Gold Zari', hex: '#FFFFF0' }
    ],
    aesthetic: ['traditional', 'desi-glam'],
    occasions: ['weddings-guest', 'festivals-diwali', 'engagements'],
    description: 'Traditional royal juttis crafted in ivory raw silk with micro dabka and gold thread embroidery, padded memory foam sole, and soft leather lining.',
    fabric: 'Raw Silk, Leather Sole & Gold Dabka Thread',
    fit: 'True to UK shoe sizes',
    care: 'Ozone sanitized.',
    rating: 4.8,
    reviewsCount: 29,
    moods: ['desi-diva']
  },
  {
    id: 'her-dress-velvet-coquette',
    name: 'Seraphina Velvet Bow Mini Dress',
    brand: 'Maison RENTORA',
    category: 'her',
    subCategory: 'Dresses',
    pricePerDay: 280,
    rentalPrice4Days: 999,
    retailPrice: 18500,
    deposit: 500,
    images: ['/assets/aistudio/OFF_THE_SHOULDER_CONTRAST_BOW_DETAIL_VELVET_MINI_DRESS_-_Faire__1__788f26f0.jpg'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Ruby Velvet & Blush Bow', hex: '#8B1E2F' }],
    aesthetic: ['coquette', 'soft-girl'],
    occasions: ['birthday-parties', 'date-nights'],
    description: 'Off-the-shoulder ruby velvet mini dress featuring an architectural contrast blush bow and fitted bodice.',
    fabric: 'Mulberry Silk Micro-Velvet',
    fit: 'Fitted Bodice with Flared Hem',
    care: 'Dry clean and ozone sanitized.',
    rating: 4.8,
    reviewsCount: 17,
    moods: ['soft-romantic', 'main-character']
  },
  {
    id: 'her-dress-vintage-slip',
    name: 'Buttercream Satin Bias-Cut Slip Dress',
    brand: 'RENTORA Atelier',
    category: 'her',
    subCategory: 'Dresses',
    pricePerDay: 290,
    rentalPrice4Days: 1050,
    retailPrice: 19500,
    deposit: 550,
    images: ['/assets/aistudio/Classy_Dresses_for_Women___Elegant_Outfit_Ideas_for_Every_Occasion__1__a9c72458.jpg'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [{ name: 'Buttercream Ivory', hex: '#FFFFF0' }],
    aesthetic: ['coquette', 'clean-girl', 'minimalist'],
    occasions: ['brunches-casual', 'date-nights', 'vacation-beach'],
    description: 'Fluid cowl neck slip dress cut from butter-soft lustrous satin with delicate French seams.',
    fabric: 'Heavyweight Silk Satin',
    fit: 'Bias-cut Fluid Drape',
    care: 'Dry clean only.',
    rating: 4.9,
    reviewsCount: 23,
    moods: ['clean-minimal', 'soft-romantic']
  },
  {
    id: 'her-suit-sovereign-plum',
    name: 'Sovereign Plum Velvet Power Suit',
    brand: 'Maison RENTORA',
    category: 'her',
    subCategory: 'Dresses',
    pricePerDay: 390,
    rentalPrice4Days: 1399,
    retailPrice: 28000,
    deposit: 750,
    images: ['/assets/aistudio/hero_fashion_editorial_1792952792888.jpg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [{ name: 'Sovereign Plum', hex: '#4D0E13' }],
    aesthetic: ['old-money', 'diva', 'quiet-luxury'],
    occasions: ['formal-galas', 'engagements', 'photoshoots'],
    description: 'Double-breasted tailored velvet power blazer with fluid puddle-hem trousers in royal plum.',
    fabric: 'Italian Cotton-Silk Velvet',
    fit: 'Tailored Power Silhouette',
    care: 'Dry clean only.',
    rating: 4.9,
    reviewsCount: 29,
    moods: ['main-character', 'bold-confident']
  }
];

export const FREE_GIFT_PROMOTION = {
  thresholdAmount: 3000,
  giftName: 'Signature RENTORA Crystal & Pearl Bow Jewelry Gift Set 🎀',
  giftValue: 1299,
  giftImage: '/assets/aistudio/coquette_accessories_gift_1792952794547.jpg',
  description: 'Complimentary high-aesthetic jewelry keepsake box with pearl earrings & silk bow pouch, automatically included for rental totals above ₹3,000.',
  terms: 'Valid on net merchandise rental subtotal before refundable deposits and delivery fees. Keepsake is yours to keep forever!'
};

export const EDITORIAL_ARTICLES = [
  {
    id: 'edit-1',
    title: 'How to Style 1 Statement Velvet Suit in 3 Unforgettable Ways',
    category: 'Style Guide',
    readTime: '3 min read',
    excerpt: 'From power boardroom cocktails to after-hours speakeasies and red carpets, discover how RENTORA besties rework the Sovereign Plum Suit.',
    image: '/assets/aistudio/Velvet_Elegance__Three_Women_in_Traditional_Fashion_cdd4b543.png',
    tag: 'Versatility'
  },
  {
    id: 'edit-2',
    title: 'The Modern Garba & Navratri Playbook: Mirrorwork Without the Weight',
    category: 'Festive Edit',
    readTime: '4 min read',
    excerpt: 'Ditch stiff 15kg lehengas for airy tissue organza and weightless mirrorwork that lets you twirl from dusk till 3 AM without sweating.',
    image: '/assets/aistudio/Bridesmaids_Style_cfccb78c.jpg',
    tag: 'Trending'
  },
  {
    id: 'edit-3',
    title: 'Old Money vs. Coquette: How to Blend Heritage Tailoring with Playful Bows',
    category: 'Aesthetic Deep Dive',
    readTime: '5 min read',
    excerpt: 'RÉNÉ breaks down the subtle art of pairing structured double-breasted blazers with romantic pearl chokers and velvet ribbons.',
    image: '/assets/aistudio/coquette_accessories_gift_1792952794547.jpg',
    tag: 'RÉNÉ Recommends'
  },
  {
    id: 'edit-4',
    title: 'The Men’s Wedding Guest Blueprint: Beyond Boring Navy Suits',
    category: 'Groom & Guest',
    readTime: '3 min read',
    excerpt: 'Why deep jewel tones like imperial plum, muted rosewood, and raw silk textures are defining this wedding season’s best-dressed lists.',
    image: '/assets/aistudio/download__44__030bc2a4.jpg',
    tag: 'For Him'
  }
];

export interface MoodOption {
  id: string;
  label: string;
  emoji: string;
  headline: string;
  tagline: string;
  palette: string[];
  aesthetic: string;
  quote: string;
  outfitAdvice: string;
  accessoryAdvice: string;
  reneRecommendation: {
    outfitId: string;
    outfitName: string;
    outfitPrice: string;
    jewellery: string;
    footwear: string;
    bag: string;
    explanation: string;
  };
}

export const TODAY_MOODS: MoodOption[] = [
  {
    id: 'soft-romantic',
    label: 'Soft & Romantic 🌸',
    emoji: '🌸',
    headline: 'Your Soft & Romantic Edit',
    tagline: 'Pastel pink, lavender, blush, and ivory outfits paired with delicate pearls and elegant heels.',
    palette: ['#FDE2E4', '#E2ECE9', '#DFE7FD', '#F5EFE7'],
    aesthetic: 'soft-girl',
    quote: 'Delicate floral silks, pastel dupattas, baroque pearls, and dreamy movement.',
    outfitAdvice: 'Pastel pink, lavender, blush, and ivory outfits, floral dresses, elegant gowns, and soft lehengas.',
    accessoryAdvice: 'Delicate pearl drop earrings, triple-row pearl chokers, elegant heels, and velvet bows.',
    reneRecommendation: {
      outfitId: 'her-3',
      outfitName: 'Wedding Guest Lehenga',
      outfitPrice: '₹1,200 / 4 days',
      jewellery: 'Constellation Triple-Row Baroque Pearl Choker & Delicate Pearl Drops',
      footwear: 'Starlight Metallic Ankle-Wrap Strappy Heels in Liquid Rose Gold',
      bag: 'Lumière Hand-Beaded Pearl Top-Handle Bag',
      explanation: 'Soft & Romantic is all about ethereal tenderness. Delicate blush pastels, luminous freshwater pearls, and graceful rose-gold heels create a dreamy, poetry-in-motion silhouette.'
    }
  },
  {
    id: 'main-character',
    label: 'Main Character Energy ✨',
    emoji: '✨',
    headline: 'Your Main Character Energy Edit',
    tagline: 'Statement gowns, glamorous party dresses, metallic jewel tones, bold heels, and standout handbags.',
    palette: ['#FFD700', '#C0C0C0', '#4D0E13', '#1A1A2E'],
    aesthetic: 'diva',
    quote: 'All eyes on you. Sculptural silhouettes, golden shimmer, and red-carpet charisma.',
    outfitAdvice: 'Statement gowns, glamorous party dresses, standout suits, metallic, jewel-toned, and dramatic outfits.',
    accessoryAdvice: 'Statement chandelier earrings, bold metallic heels, and crystal mosaic minaudières.',
    reneRecommendation: {
      outfitId: 'her-10',
      outfitName: 'Elegant Reception Gown',
      outfitPrice: '₹1,400 / 4 days',
      jewellery: 'Starlight Starburst Crystal Chandelier Earrings & Diamond Choker',
      footwear: 'Starlight Mirror Metallic Strappy Heels (90mm)',
      bag: 'Aurelia Solstice Crystal Mosaic Minaudière',
      explanation: 'Main Character Energy demands the spotlight! High-voltage crystal shimmer, dramatic evening satin, and metallic footwear ensure all eyes remain fixed on you from entry to exit.'
    }
  },
  {
    id: 'desi-diva',
    label: 'Desi Diva 🧡',
    emoji: '🧡',
    headline: 'Your Desi Diva Edit',
    tagline: 'Designer lehengas, sarees, anarkalis, chaniya cholis, royal jhumkas, and velvet potli bags.',
    palette: ['#E65100', '#FFB300', '#4D0E13', '#2E7D32'],
    aesthetic: 'desi-glam',
    quote: 'Cinematic Bollywood glam, intricate zardozi, twirling flares, and heritage opulence.',
    outfitAdvice: 'Designer lehengas, sarees, anarkalis, chaniya cholis with rich festive colors, embroidery, and traditional prints.',
    accessoryAdvice: 'Chandbali Kundan jhumkas, bangles, Rajwada velvet loafers, and embroidered potli bags.',
    reneRecommendation: {
      outfitId: 'her-2',
      outfitName: 'Bridal & Festive Royal Lehenga',
      outfitPrice: '₹2,000 / 4 days',
      jewellery: 'Maharani Emerald & Kundan Choker with Chandbali Jhumkas',
      footwear: 'Rajwada Embroidered Velvet Loafers / Royal Zardozi Juttis',
      bag: 'Maharani Zardozi Royal Velvet Potli Bag with Pearl Tassels',
      explanation: 'Desi Diva celebrates timeless Indian grandeur! Rich zari embroidery, opulent Kundan jhumkas, and the velvet potli celebrate heritage with cinematic Bollywood presence over casual western clothing.'
    }
  },
  {
    id: 'clean-minimal',
    label: 'Clean & Minimal 🤍',
    emoji: '🤍',
    headline: 'Your Clean & Minimal Edit',
    tagline: 'Neutral-toned dresses, tailored suits, minimalist co-ords, minimal jewellery, and structured bags.',
    palette: ['#FFFFFF', '#F5F5DC', '#292727', '#C6A77D'],
    aesthetic: 'clean-girl',
    quote: 'Effortless monochrome, crisp lines, structured silhouettes, and quiet luxury.',
    outfitAdvice: 'Neutral-toned dresses, tailored suits, minimalist co-ords in black, white, beige, ivory, and muted colors.',
    accessoryAdvice: 'Minimal geometric huggie hoops, structured leather shoulder bags, and square-toe mules.',
    reneRecommendation: {
      outfitId: 'her-13',
      outfitName: 'Premium Blazer and Trouser Set',
      outfitPrice: '₹1,200 / 4 days',
      jewellery: 'Aura 18K Gold Geometric Huggie Earrings & Dainty Chain',
      footwear: 'Sleek Square-Toe Ivory Leather Block Mules',
      bag: 'Céline Architectural Ivory Structured Leather Handbag',
      explanation: 'Clean & Minimal champions quiet luxury. Architectural tailoring in neutral tones, zero fuss, and pure lines let impeccable cut and silhouette speak for themselves.'
    }
  },
  {
    id: 'bold-confident',
    label: 'Bold & Confident 🔥',
    emoji: '🔥',
    headline: 'Your Bold & Confident Edit',
    tagline: 'Power suits, striking gowns, statement dresses, chunky jewellery, and standout bags.',
    palette: ['#B71C1C', '#0D47A1', '#000000', '#FF6F00'],
    aesthetic: 'baddie',
    quote: 'Power suits, sculpted dresses, bold reds & blacks, chunky gold, and fierce confidence.',
    outfitAdvice: 'Power suits, striking gowns, statement dresses, and edgy looks in red, black, cobalt, and bold colors.',
    accessoryAdvice: 'Chunky gold collar jewelry, statement 90mm heels, and standout sculpted crimson clutches.',
    reneRecommendation: {
      outfitId: 'her-1',
      outfitName: 'Designer Evening Gown (Onyx & Gold)',
      outfitPrice: '₹1,400 / 4 days',
      jewellery: 'Sovereign Sculpted Gold Collar & Heavy Cuff Set',
      footwear: 'Starlight Metallic 90mm Strappy Statement Heels',
      bag: 'Vogue Metallic Sculpted Geometric Minaudière',
      explanation: 'Bold & Confident is daring, sculpted, and unapologetic. Midnight black satin, dramatic metallic gold bow sash, and sculpted gold accessories command every room.'
    }
  },
  {
    id: 'chill-casual',
    label: 'Chill & Casual 🖤',
    emoji: '🖤',
    headline: 'Your Chill & Casual Edit',
    tagline: 'Casual co-ord sets, relaxed dresses, linen outfits, comfortable fabrics, and everyday accessories.',
    palette: ['#292727', '#E0E0E0', '#B0BEC5', '#EFEBE9'],
    aesthetic: 'quiet-luxury',
    quote: 'Relaxed linen, breathable coordinates, comfortable sneakers, and effortless off-duty chic.',
    outfitAdvice: 'Casual co-ord sets, relaxed dresses, linen outfits, and smart-casual looks with comfortable fabrics and relaxed silhouettes.',
    accessoryAdvice: 'Pristine court sneakers, comfortable flats, everyday crossbody bags, and tinted cat-eye sunglasses.',
    reneRecommendation: {
      outfitId: 'her-7',
      outfitName: 'Indo-Western Co-Ord Set',
      outfitPrice: '₹1,000 / 4 days',
      jewellery: 'Dainty Everyday Huggies & Duchess Velvet Bow Accent',
      footwear: 'Pristine White Minimal Leather Court Sneakers',
      bag: 'Riviera Canvas & Tan Saddle Leather Crossbody Bag',
      explanation: 'Chill & Casual is about laid-back refinement. Airy breathable cotton and linen, relaxed silhouettes, and clean court sneakers deliver effortless luxury without trying too hard.'
    }
  }
];

