import { AppNotification } from '../types';

export interface AutoNotificationTemplate {
  id: string;
  title: string;
  message: string;
  category: 'stylist' | 'drops' | 'community' | 'promo';
  type: 'stylist_tip' | 'flash_drop' | 'community' | 'promo';
  actionUrl: string;
  actionLabel: string;
}

/**
 * Curated, relevant RENTORA updates for Female Renters
 * Strictly genuine fashion updates: Style tips, lookbook drops, accessories, and wardrobe reminders.
 * Zero fake bookings, zero fake payments, zero fake availability updates.
 */
export const FEMALE_AUTO_NOTIFICATIONS: AutoNotificationTemplate[] = [
  {
    id: 'f_notif_1',
    title: 'RÉNÉ Style Suggestion ✨',
    message: 'Pair fluid silk gowns with our Baroque Pearl Drop Earrings for an effortless royal gala aesthetic.',
    category: 'stylist',
    type: 'stylist_tip',
    actionUrl: '#accessories',
    actionLabel: 'View Jewelry',
  },
  {
    id: 'f_notif_2',
    title: 'New Outfit Recommendation 👗',
    message: 'The Seraphina Velvet Bow Mini Dress is now featured in our Seasonal Lookbook with fresh styling notes.',
    category: 'drops',
    type: 'flash_drop',
    actionUrl: '#lookbook',
    actionLabel: 'Explore Lookbook',
  },
  {
    id: 'f_notif_3',
    title: 'Curated Collection Update 🌹',
    message: 'New handcrafted Kundan Chandbalis and pearl chokers have been added to our Bijoux vault.',
    category: 'drops',
    type: 'flash_drop',
    actionUrl: '#accessories',
    actionLabel: 'Browse Jewels',
  },
  {
    id: 'f_notif_4',
    title: 'Wishlist Styling Note 🎀',
    message: 'Remember to complete your celebration look with our Duchess Plum Velvet Barrette in your fitting bag.',
    category: 'stylist',
    type: 'stylist_tip',
    actionUrl: '#builder',
    actionLabel: 'Build Look',
  },
  {
    id: 'f_notif_5',
    title: 'The RENTORA Edit 🌸',
    message: 'Our stylists just published a guide on styling fluid satin slip dresses for sunset cocktail parties.',
    category: 'community',
    type: 'community',
    actionUrl: '#edit',
    actionLabel: 'Read The Edit',
  },
  {
    id: 'f_notif_6',
    title: 'Personalized Fashion Suggestion 💎',
    message: 'For sangeet celebrations, pastel organza lehengas coordinate gracefully with antique polki bangles.',
    category: 'stylist',
    type: 'stylist_tip',
    actionUrl: '#occasions',
    actionLabel: 'View Occasions',
  },
  {
    id: 'f_notif_7',
    title: 'Seasonal Wardrobe Note ✨',
    message: 'Rich ruby velvet and champagne silk are this season\'s most requested rental textures for receptions.',
    category: 'drops',
    type: 'flash_drop',
    actionUrl: '#collections',
    actionLabel: 'Explore Outfits',
  },
  {
    id: 'f_notif_8',
    title: 'RÉNÉ Sizing & Fitting Tip 🪞',
    message: 'Need precise measurements? Doorstep fit assistance and alteration checks are included with every booking.',
    category: 'stylist',
    type: 'stylist_tip',
    actionUrl: '#account',
    actionLabel: 'View Sizing',
  },
  {
    id: 'f_notif_9',
    title: 'Luxury Keepsake Reminder 🎀',
    message: 'Rental orders above ₹3,000 include our Signature Pearl & Crystal Bow Keepsake Box at ₹0.',
    category: 'promo',
    type: 'promo',
    actionUrl: '#collections',
    actionLabel: 'Browse Boutique',
  },
  {
    id: 'f_notif_10',
    title: 'Editorial Lookbook Drop 👑',
    message: 'Discover new bridal guest silhouettes with hand-cut zardozi embroidery in our latest editorial lookbook.',
    category: 'drops',
    type: 'flash_drop',
    actionUrl: '#lookbook',
    actionLabel: 'View Lookbook',
  },
];

/**
 * Curated, relevant RENTORA updates for Male Renters
 * Strictly genuine fashion updates: Style tips, lookbook drops, accessories, and wardrobe reminders.
 * Zero fake bookings, zero fake payments, zero fake availability updates.
 */
export const MALE_AUTO_NOTIFICATIONS: AutoNotificationTemplate[] = [
  {
    id: 'm_notif_1',
    title: 'RÉNÉ Style Suggestion 🕶️',
    message: 'Pair tailored double-breasted suits with our handcrafted velvet embroidered loafers for black-tie perfection.',
    category: 'stylist',
    type: 'stylist_tip',
    actionUrl: '#accessories',
    actionLabel: 'View Footwear',
  },
  {
    id: 'm_notif_2',
    title: 'New Outfit Recommendation 👔',
    message: 'The Savile Row Midnight Tuxedo with silk faille lapels is now available in our formal collection.',
    category: 'drops',
    type: 'flash_drop',
    actionUrl: '#lookbook',
    actionLabel: 'Explore Tuxedos',
  },
  {
    id: 'm_notif_3',
    title: 'Heritage Menswear Tip 👑',
    message: 'RÉNÉ recommends layering a pure Banarasi silk stole over structured bandhgalas for royal wedding elegance.',
    category: 'stylist',
    type: 'stylist_tip',
    actionUrl: '#collections',
    actionLabel: 'View Bandhgalas',
  },
  {
    id: 'm_notif_4',
    title: 'Curated Collection Update 🎩',
    message: 'Explore our collection of heritage gold cufflinks and signet accents crafted for formal banquets.',
    category: 'drops',
    type: 'flash_drop',
    actionUrl: '#accessories',
    actionLabel: 'Browse Accessories',
  },
  {
    id: 'm_notif_5',
    title: 'The Gentleman\'s Edit 🥂',
    message: 'Discover how to coordinate pocket squares with raw silk indowestern sherwanis without clashing textures.',
    category: 'community',
    type: 'community',
    actionUrl: '#edit',
    actionLabel: 'Read The Edit',
  },
  {
    id: 'm_notif_6',
    title: 'Personalized Fashion Suggestion ⚡',
    message: 'Attending a festive celebration? Mirrorwork kurta sets in dusty rose and sage green are the season\'s top choice.',
    category: 'stylist',
    type: 'stylist_tip',
    actionUrl: '#occasions',
    actionLabel: 'View Festive Wear',
  },
  {
    id: 'm_notif_7',
    title: 'Saved Outfit Reminder 💼',
    message: 'Complete your tailored suit with Italian leather oxfords and silk bowtie in the Outfit Builder.',
    category: 'stylist',
    type: 'stylist_tip',
    actionUrl: '#builder',
    actionLabel: 'Open Builder',
  },
  {
    id: 'm_notif_8',
    title: 'VIP Grooming Note ⚜️',
    message: 'Every RENTORA blazer and sherwani arrives freshly pressed and UV-sanitized in a sealed garment bag.',
    category: 'community',
    type: 'community',
    actionUrl: '#how-it-works',
    actionLabel: 'Learn More',
  },
];

/**
 * Curated, relevant RENTORA updates for Unisex / Unselected Gender Renters
 */
export const UNISEX_AUTO_NOTIFICATIONS: AutoNotificationTemplate[] = [
  {
    id: 'u_notif_1',
    title: 'RÉNÉ Style Suggestion ✨',
    message: 'Balance statement jewelry by keeping the neckline uncluttered and letting one hero piece shine.',
    category: 'stylist',
    type: 'stylist_tip',
    actionUrl: '#reni',
    actionLabel: 'Chat with RÉNÉ',
  },
  {
    id: 'u_notif_2',
    title: 'Seasonal Lookbook Drop ✨',
    message: 'Discover fresh designer silhouettes, seasonal palettes, and runway looks in the RENTORA Lookbook.',
    category: 'drops',
    type: 'flash_drop',
    actionUrl: '#lookbook',
    actionLabel: 'Browse Lookbook',
  },
  {
    id: 'u_notif_3',
    title: 'Personalized Fashion Suggestion 🌟',
    message: 'Explore curated aesthetics from Old Money to Royal Heritage in our thematic boutique sections.',
    category: 'drops',
    type: 'flash_drop',
    actionUrl: '#collections',
    actionLabel: 'Explore Aesthetics',
  },
  {
    id: 'u_notif_4',
    title: 'Outfit Builder Recommendation 🪞',
    message: 'Try mixing and matching complete ensembles with matching accessories in the RENTORA Outfit Builder.',
    category: 'stylist',
    type: 'stylist_tip',
    actionUrl: '#builder',
    actionLabel: 'Open Builder',
  },
  {
    id: 'u_notif_5',
    title: 'Complimentary Luxury Keepsake 🎀',
    message: 'Rental orders above ₹3,000 include our Signature Pearl & Crystal Bow Keepsake Box at ₹0.',
    category: 'promo',
    type: 'promo',
    actionUrl: '#collections',
    actionLabel: 'View Outfits',
  },
  {
    id: 'u_notif_6',
    title: 'Doorstep Sanitization Standard 🛡️',
    message: 'Every RENTORA garment undergoes hospital-grade UV-C sanitization before arriving in custom sealed bags.',
    category: 'community',
    type: 'community',
    actionUrl: '#how-it-works',
    actionLabel: 'Learn More',
  },
  {
    id: 'u_notif_7',
    title: 'The RENTORA Edit 📖',
    message: 'Read our new style guide on coordinating colors across luxury accessories for memorable gala evenings.',
    category: 'community',
    type: 'community',
    actionUrl: '#edit',
    actionLabel: 'Read The Edit',
  },
  {
    id: 'u_notif_8',
    title: 'Curated Collection Update 💎',
    message: 'Handcrafted accessories and designer footwear have been refreshed across all rental collections.',
    category: 'drops',
    type: 'flash_drop',
    actionUrl: '#accessories',
    actionLabel: 'Browse Vault',
  },
];

/**
 * Selects the next relevant, non-repetitive notification for the currently logged-in user.
 * Avoids repeating notifications by tracking user-specific sent keys in localStorage
 * and verifying against existing active notifications.
 */
export function getNextRelevantAutoNotification(
  userId: string,
  genderPreference?: string | null,
  existingNotifications: AppNotification[] = []
): AutoNotificationTemplate | null {
  if (!userId) return null;

  const normalizedGender = (genderPreference || '').toLowerCase().trim();
  let pool = UNISEX_AUTO_NOTIFICATIONS;
  if (normalizedGender === 'female' || normalizedGender === 'her') {
    pool = FEMALE_AUTO_NOTIFICATIONS;
  } else if (normalizedGender === 'male' || normalizedGender === 'him') {
    pool = MALE_AUTO_NOTIFICATIONS;
  }

  // Retrieve previously sent keys for this specific user
  let sentIds: string[] = [];
  try {
    const raw = localStorage.getItem(`rentora_sent_auto_notifs_${userId}`);
    if (raw) {
      sentIds = JSON.parse(raw);
    }
  } catch {}

  // Existing notification messages to ensure zero duplicate content in the panel
  const existingMessages = new Set(existingNotifications.map((n) => `${n.title}:::${n.message}`));

  // Filter pool for items that haven't been sent and aren't in active notifications
  let candidates = pool.filter((item) => {
    if (sentIds.includes(item.id)) return false;
    if (existingMessages.has(`${item.title}:::${item.message}`)) return false;
    return true;
  });

  // If no new relevant update exists, do not send anything (returns null)
  if (candidates.length === 0) {
    return null;
  }

  const chosen = candidates[0];
  if (!chosen) return null;

  // Record sent key for this user
  try {
    if (!sentIds.includes(chosen.id)) {
      sentIds.push(chosen.id);
    }
    localStorage.setItem(`rentora_sent_auto_notifs_${userId}`, JSON.stringify(sentIds));
  } catch {}

  return chosen;
}
