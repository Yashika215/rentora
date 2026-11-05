import { UserLocation, CityAvailability } from '../types';

export interface GujaratCity {
  name: string;
  isPopular?: boolean;
  tier: 'flagship_express' | 'express_hub' | 'tier2' | 'standard';
  pincodePrefix: string;
  deliveryTime: string;
}

export const GUJARAT_CITIES: GujaratCity[] = [
  { name: 'Ahmedabad', isPopular: true, tier: 'flagship_express', pincodePrefix: '380xxx', deliveryTime: 'Express 24h (Same-Day Dispatch)' },
  { name: 'Surat', isPopular: true, tier: 'express_hub', pincodePrefix: '395xxx', deliveryTime: 'Express 24h Delivery' },
  { name: 'Vadodara', isPopular: true, tier: 'express_hub', pincodePrefix: '390xxx', deliveryTime: 'Express 24h Delivery' },
  { name: 'Rajkot', isPopular: true, tier: 'express_hub', pincodePrefix: '360xxx', deliveryTime: 'Express 24-48h Delivery' },
  { name: 'Gandhinagar', isPopular: true, tier: 'flagship_express', pincodePrefix: '382xxx', deliveryTime: 'Express 24h Delivery' },
  { name: 'Bhavnagar', isPopular: true, tier: 'tier2', pincodePrefix: '364xxx', deliveryTime: '24-48h Doorstep Delivery' },
  { name: 'Jamnagar', isPopular: true, tier: 'tier2', pincodePrefix: '361xxx', deliveryTime: '24-48h Doorstep Delivery' },
  { name: 'Anand', isPopular: true, tier: 'tier2', pincodePrefix: '388xxx', deliveryTime: 'Express 24h Delivery' },
  { name: 'Mehsana', isPopular: true, tier: 'tier2', pincodePrefix: '384xxx', deliveryTime: '24-48h Doorstep Delivery' },
  { name: 'Bharuch', isPopular: true, tier: 'tier2', pincodePrefix: '392xxx', deliveryTime: '24-48h Doorstep Delivery' },
  { name: 'Junagadh', isPopular: false, tier: 'tier2', pincodePrefix: '362xxx', deliveryTime: '48h Doorstep Delivery' },
  { name: 'Navsari', isPopular: false, tier: 'tier2', pincodePrefix: '396xxx', deliveryTime: '24-48h Doorstep Delivery' },
  { name: 'Morbi', isPopular: false, tier: 'standard', pincodePrefix: '363xxx', deliveryTime: '48h Doorstep Delivery' },
  { name: 'Vapi', isPopular: false, tier: 'tier2', pincodePrefix: '396xxx', deliveryTime: '24-48h Doorstep Delivery' },
  { name: 'Porbandar', isPopular: false, tier: 'standard', pincodePrefix: '360xxx', deliveryTime: '48h Doorstep Delivery' },
  { name: 'Valsad', isPopular: false, tier: 'tier2', pincodePrefix: '396xxx', deliveryTime: '24-48h Doorstep Delivery' },
  { name: 'Palanpur', isPopular: false, tier: 'standard', pincodePrefix: '385xxx', deliveryTime: '48h Doorstep Delivery' },
  { name: 'Patan', isPopular: false, tier: 'standard', pincodePrefix: '384xxx', deliveryTime: '48h Doorstep Delivery' },
  { name: 'Surendranagar', isPopular: false, tier: 'standard', pincodePrefix: '363xxx', deliveryTime: '48h Doorstep Delivery' },
  { name: 'Godhra', isPopular: false, tier: 'standard', pincodePrefix: '389xxx', deliveryTime: '48h Doorstep Delivery' },
  { name: 'Veraval / Somnath', isPopular: false, tier: 'standard', pincodePrefix: '362xxx', deliveryTime: '48h Doorstep Delivery' },
  { name: 'Bhuj', isPopular: false, tier: 'standard', pincodePrefix: '370xxx', deliveryTime: '48h Doorstep Delivery' },
];

export const DELIVERY_HUBS: Record<string, string[]> = {
  'Ahmedabad': ['Ahmedabad Central Hub (Navrangpura)', 'East Ahmedabad Dispatch (Maninagar)', 'West Express Hub (Bopal)', 'Gift City Logistics Node'],
  'Surat': ['Surat Diamond Hub (Varachha)', 'South Surat Express (Adajan)', 'Textile Market Node', 'Surat Airport Express Hub'],
  'Vadodara': ['Vadodara Main Hub (Alkapuri)', 'Sayajigunj Dispatch Center', 'Waghodia Road Hub'],
  'Rajkot': ['Rajkot Central Hub (Yagnik Road)', 'Metoda Industrial Node', 'Kalawad Road Hub'],
  'Gandhinagar': ['Sargasan Central Hub', 'Sector 21 Dispatch Center', 'Gift City Hub'],
  'Bhavnagar': ['Bhavnagar City Hub', 'Kala Nala Dispatch Center'],
  'Jamnagar': ['Jamnagar Central Hub', 'Digjam Circle Node'],
  'Anand': ['Anand City Hub', 'V.V. Nagar Dispatch Center'],
  'Bharuch': ['Bharuch GIDC Hub', 'Narmada View Node'],
  'Mehsana': ['Mehsana Main Hub', 'Modhera Road Node']
};

export const FIXED_COUNTRY = 'India';
export const FIXED_STATE = 'Gujarat';

export const DEFAULT_LOCATION: UserLocation = {
  country: FIXED_COUNTRY,
  state: FIXED_STATE,
  city: '',
  hub: '',
  isServiceable: false,
};

// Check if given PIN code is within valid Gujarat postal range (360000 - 396999)
export function isGujaratPinCode(pincode: string): boolean {
  const cleaned = pincode.trim();
  if (!/^\d{6}$/.test(cleaned)) {
    return false;
  }
  const numeric = parseInt(cleaned, 10);
  return numeric >= 360000 && numeric <= 396999;
}

// Validate if city is in our supported Gujarat network
export function isSupportedGujaratCity(cityName: string): boolean {
  if (!cityName) return false;
  const q = cityName.trim().toLowerCase();
  return GUJARAT_CITIES.some((c) => c.name.toLowerCase() === q);
}

// Safely normalize user location, resetting to Ahmedabad, Gujarat if outside service area
export function validateAndNormalizeLocation(loc: unknown): UserLocation {
  if (!loc || typeof loc !== 'object') {
    return DEFAULT_LOCATION;
  }

  const candidate = loc as Partial<UserLocation>;
  const countryMatches = (candidate.country || '').trim().toLowerCase() === 'india';
  const stateMatches = (candidate.state || '').trim().toLowerCase().includes('gujarat');
  const cityMatches = candidate.city && isSupportedGujaratCity(candidate.city);

  if (countryMatches && stateMatches && cityMatches) {
    const matchedCityObj = GUJARAT_CITIES.find(
      (c) => c.name.toLowerCase() === (candidate.city || '').trim().toLowerCase()
    );
    return {
      country: FIXED_COUNTRY,
      state: FIXED_STATE,
      city: matchedCityObj ? matchedCityObj.name : '',
      hub: candidate.hub || '',
      pincode: candidate.pincode || '',
      isServiceable: true,
    };
  }

  return DEFAULT_LOCATION;
}

export interface DeliveryServiceInfo {
  isAvailable: boolean;
  deliverySpeed: string;
  badgeText: string;
  badgeColor: string;
  notes: string;
  features: string[];
}

export function getLocationDeliveryInfo(location: UserLocation): DeliveryServiceInfo {
  const cityName = (location.city || '').trim().toLowerCase();

  const cityObj = GUJARAT_CITIES.find((c) => c.name.toLowerCase() === cityName);

  if (!cityObj) {
    return {
      isAvailable: false,
      deliverySpeed: 'Outside Service Area ❌',
      badgeText: 'Rental Unavailable Outside Gujarat',
      badgeColor: 'bg-rose-100 text-rose-800 border-rose-300',
      notes: 'RENTORA currently operates luxury couture rentals exclusively in Gujarat, India.',
      features: [
        'Delivery restricted to Gujarat addresses only',
        'PIN codes must be between 360xxx and 396xxx',
      ],
    };
  }

  if (cityObj.tier === 'flagship_express') {
    return {
      isAvailable: true,
      deliverySpeed: 'Express 24h Flagship Hub ⚡',
      badgeText: 'Flagship Gujarat Hub — Same-Day Dispatch',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      notes: 'Complimentary trial fits, same-day courier dispatch from Ahmedabad warehouse, and dry-clean sanitized packaging included.',
      features: [
        'Guaranteed 24h delivery across Ahmedabad & Gandhinagar',
        'Free custom-fit styling & backup size option included',
        'Doorstep return pickup at zero extra fee',
      ],
    };
  }

  if (cityObj.tier === 'express_hub') {
    return {
      isAvailable: true,
      deliverySpeed: '24-Hour Express Hub 🚀',
      badgeText: 'Active Gujarat Express Hub',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      notes: 'Guaranteed 24-hour white-glove courier dispatch. Pre-scheduled contactless returns with sanitized garment bag.',
      features: [
        'Pre-booked delivery slot 1-2 days before your celebration',
        'Hassle-free return pickup at your doorstep',
        'Full transit insurance covered with zero hidden charges',
      ],
    };
  }

  return {
    isAvailable: true,
    deliverySpeed: '24–48h Doorstep Rental 🚚',
    badgeText: 'Gujarat Doorstep Courier Service',
    badgeColor: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    notes: 'Direct express courier delivery across all municipal sectors and PIN codes in this region.',
    features: [
      'Door-to-door courier delivery and pickup',
      'Dry cleaned, steamed, and sealed luxury packaging',
      'Transparent security deposit refund within 24h of return',
    ],
  };
}

export function calculateCityAvailability(
  cityName: string,
  pincode?: string
): CityAvailability {
  if (!cityName) {
    return {
      city: '',
      state: FIXED_STATE,
      country: FIXED_COUNTRY,
      isServiceable: false,
      tier: 'standard',
      deliverySpeed: 'Select City & Hub 📍',
      estimatedDeliveryDate: 'Pending Selection',
      orderCutoffTime: '—',
      nextAvailableSlot: '—',
      availableOutfitsCount: 0,
      totalOutfitsCount: 32,
      availabilityPercentage: 0,
      courierPartner: '—',
      returnPickupAvailable: false,
      sanitizationHub: '—',
      notes: 'Please select your city and delivery hub to see live outfit availability and delivery timelines.',
      features: [],
      lastCheckedTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
  }

  const cleanCity = cityName.trim();
  const cityObj = GUJARAT_CITIES.find(
    (c) => c.name.toLowerCase() === cleanCity.toLowerCase()
  ) || GUJARAT_CITIES[0];

  const now = new Date();
  const isPincodeValid = pincode ? isGujaratPinCode(pincode) : undefined;

  // Format delivery dates nicely
  const addDays = (days: number) => {
    const d = new Date(now);
    d.setDate(d.getDate() + days);
    return d.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  const nowTimeStr = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const totalCatalog = 32;

  if (cityObj.tier === 'flagship_express') {
    return {
      city: cityObj.name,
      state: FIXED_STATE,
      country: FIXED_COUNTRY,
      isServiceable: true,
      tier: 'flagship_express',
      deliverySpeed: 'Express 24h (Same-Day Dispatch) ⚡',
      estimatedDeliveryDate: `Tomorrow, ${addDays(1)} by 1:00 PM`,
      orderCutoffTime: 'Order within next 3h 15m for same-day dispatch',
      nextAvailableSlot: 'Tomorrow Morning (9:30 AM – 1:00 PM)',
      availableOutfitsCount: 32,
      totalOutfitsCount: totalCatalog,
      availabilityPercentage: 100,
      courierPartner: 'BlueDart Apex Luxury Express (Local Dispatch Van)',
      returnPickupAvailable: true,
      sanitizationHub: 'Ahmedabad Central CleanRoom (Ozone Steamed)',
      pincodeVerified: isPincodeValid,
      pincode: pincode || cityObj.pincodePrefix,
      notes: 'Central luxury warehouse location — complete 32-piece runway wardrobe available for immediate reservation.',
      features: [
        '100% catalog available for same-day courier dispatch',
        'Complimentary backup size & fit-assistance included',
        'Zero-hassle contactless return pickup at your doorstep',
      ],
      lastCheckedTime: nowTimeStr,
    };
  }

  if (cityObj.tier === 'express_hub') {
    return {
      city: cityObj.name,
      state: FIXED_STATE,
      country: FIXED_COUNTRY,
      isServiceable: true,
      tier: 'express_hub',
      deliverySpeed: 'Express 24h Hub Delivery 🚀',
      estimatedDeliveryDate: `Tomorrow, ${addDays(1)} by 4:00 PM`,
      orderCutoffTime: 'Order by 6:00 PM today for guaranteed next-day arrival',
      nextAvailableSlot: 'Tomorrow Afternoon (2:00 PM – 5:30 PM)',
      availableOutfitsCount: 31,
      totalOutfitsCount: totalCatalog,
      availabilityPercentage: 97,
      courierPartner: 'Delhivery Direct Luxury Air & Road Link',
      returnPickupAvailable: true,
      sanitizationHub: 'Gujarat Regional Express Distribution Hub',
      pincodeVerified: isPincodeValid,
      pincode: pincode || cityObj.pincodePrefix,
      notes: 'Active regional hub with high garment throughput and 24h white-glove courier dispatch.',
      features: [
        '31 of 32 designer looks in stock ready to ship',
        'Dedicated tracking with real-time driver ETA updates',
        'Pre-scheduled return pickup on your 4th or 7th rental day',
      ],
      lastCheckedTime: nowTimeStr,
    };
  }

  if (cityObj.tier === 'tier2') {
    return {
      city: cityObj.name,
      state: FIXED_STATE,
      country: FIXED_COUNTRY,
      isServiceable: true,
      tier: 'tier2',
      deliverySpeed: '24–48h Priority Doorstep 🚚',
      estimatedDeliveryDate: `${addDays(2)} by 2:00 PM`,
      orderCutoffTime: 'Order before 5:00 PM for overnight transit dispatch',
      nextAvailableSlot: `${addDays(2)} Morning Slot`,
      availableOutfitsCount: 30,
      totalOutfitsCount: totalCatalog,
      availabilityPercentage: 94,
      courierPartner: 'Shadowfax Express Priority Fleet',
      returnPickupAvailable: true,
      sanitizationHub: 'Pre-sanitized in Ahmedabad & Sealed in Garment Box',
      pincodeVerified: isPincodeValid,
      pincode: pincode || cityObj.pincodePrefix,
      notes: 'Direct priority courier delivery to all addresses within municipal city limits.',
      features: [
        '30 of 32 couture outfits available for reservation',
        'Includes sealed weatherproof luxury garment bag',
        'Full refundable deposit returned within 24h of return pickup',
      ],
      lastCheckedTime: nowTimeStr,
    };
  }

  // standard tier
  return {
    city: cityObj.name,
    state: FIXED_STATE,
    country: FIXED_COUNTRY,
    isServiceable: true,
    tier: 'standard',
    deliverySpeed: '48h Regional Doorstep Delivery 📦',
    estimatedDeliveryDate: `${addDays(2)} by 5:00 PM`,
    orderCutoffTime: 'Order today for priority 48-hour delivery',
    nextAvailableSlot: `${addDays(2)} Delivery Window`,
    availableOutfitsCount: 29,
    totalOutfitsCount: totalCatalog,
    availabilityPercentage: 91,
    courierPartner: 'SpeedPost Luxury Courier Logistics',
    returnPickupAvailable: true,
    sanitizationHub: 'Factory-Sealed Luxury Packaging Facility',
    pincodeVerified: isPincodeValid,
    pincode: pincode || cityObj.pincodePrefix,
    notes: 'Delivered directly to your doorstep across district sectors.',
    features: [
      '29 of 32 couture outfits available for booking',
      'Door-to-door courier delivery and pickup included',
      'Pre-sanitized with zero washing required by renter',
    ],
    lastCheckedTime: nowTimeStr,
  };
}
