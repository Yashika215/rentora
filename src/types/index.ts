import { Product } from '../data/catalog';

export interface CartItem {
  id: string; // unique cart entry id
  product: Product;
  selectedSize: string;
  selectedColor: string;
  rentalDurationDays: number;
  startDate?: string;
  endDate?: string;
  itemTotal: number;
}

export interface UserPreferences {
  aesthetics: string[];
  occasions: string[];
  genderPreference: 'her' | 'him' | 'all';
  budgetMax: number;
  currentMood?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  refundableDeposit: number;
  hasFreeGift: boolean;
  freeGiftName?: string;
  totalPaid: number;
  startDate: string;
  endDate: string;
  deliveryDetails: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  paymentMethod: string;
  createdAt: string;
  status: 'Confirmed' | 'Dispatched' | 'Active Rental' | 'Returned';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'reni';
  text: string;
  timestamp: string;
  recommendedProductIds?: string[];
  actionLink?: {
    type: 'open_builder' | 'view_collection' | 'open_cart';
    label: string;
  };
}

export interface UserLocation {
  country: string;
  state: string;
  city: string;
  pincode?: string;
  hub?: string;
  isServiceable?: boolean;
}

export interface CityAvailability {
  city: string;
  state: string;
  country: string;
  isServiceable: boolean;
  tier: 'flagship_express' | 'express_hub' | 'tier2' | 'standard';
  deliverySpeed: string;
  estimatedDeliveryDate: string;
  orderCutoffTime: string;
  nextAvailableSlot: string;
  availableOutfitsCount: number;
  totalOutfitsCount: number;
  availabilityPercentage: number;
  courierPartner: string;
  returnPickupAvailable: boolean;
  sanitizationHub: string;
  pincodeVerified?: boolean;
  pincode?: string;
  notes: string;
  features: string[];
  lastCheckedTime?: string;
}

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  gender?: 'female' | 'male' | 'unisex' | 'prefer_not_to_say';
  avatarUrl?: string;
  memberTier: 'Member' | 'Silver Renter' | 'Gold VIP Renter' | 'Diamond Luxe';
  savedAddress?: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  preferredLocation?: UserLocation;
  preferredAesthetics: string[];
  joinedDate: string;
  rentalCredits: number;
}

export type NotificationCategory = 'orders' | 'drops' | 'stylist' | 'community' | 'promo';

export interface AppNotification {
  id: string;
  userId?: string;
  type: 'order_status' | 'live_rental' | 'flash_drop' | 'stylist_tip' | 'community' | 'promo';
  category: NotificationCategory;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority?: 'high' | 'normal' | 'low';
  actionUrl?: string;
  actionLabel?: string;
  metadata?: {
    orderId?: string;
    productTitle?: string;
    productPrice?: number;
    userLocation?: string;
    avatarUrl?: string;
    discountCode?: string;
    status?: 'Confirmed' | 'Dispatched' | 'Active Rental' | 'Returned';
  };
}

export type WebSocketMessage =
  | { type: 'init'; notifications: AppNotification[]; activeConnections: number; userId?: string }
  | { type: 'notification:new'; notification: AppNotification; activeConnections: number }
  | { type: 'notification:read'; id: string; userId?: string }
  | { type: 'notification:read_all'; userId?: string }
  | { type: 'notification:delete'; id: string; userId?: string }
  | { type: 'notification:create'; payload: Partial<AppNotification> & { userId?: string } }
  | { type: 'auth'; userId: string }
  | { type: 'ping' }
  | { type: 'pong' }
  | { type: 'presence'; activeConnections: number };


