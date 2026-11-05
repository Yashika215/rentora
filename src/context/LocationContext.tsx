import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserLocation, CityAvailability } from '../types';
import { 
  DEFAULT_LOCATION, 
  DeliveryServiceInfo, 
  getLocationDeliveryInfo,
  GUJARAT_CITIES,
  validateAndNormalizeLocation,
  FIXED_COUNTRY,
  FIXED_STATE,
  isGujaratPinCode,
  calculateCityAvailability,
} from '../data/locations';

interface LocationContextType {
  location: UserLocation;
  setLocation: (loc: UserLocation) => void;
  isSelectorOpen: boolean;
  setIsSelectorOpen: (open: boolean) => void;
  deliveryInfo: DeliveryServiceInfo;
  cityAvailability: CityAvailability;
  isLoadingAvailability: boolean;
  fetchAvailability: (cityName: string, pincode?: string) => Promise<CityAvailability>;
  formattedLocation: string;
  shortLocation: string;
  detectGeolocation: () => Promise<boolean>;
  isDetecting: boolean;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const STORAGE_KEY = 'rentora_selected_location';

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocationState] = useState<UserLocation>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return validateAndNormalizeLocation(parsed);
      }
    } catch (e) {
      console.warn('Could not read location from localStorage:', e);
    }
    return DEFAULT_LOCATION;
  });

  const [isSelectorOpen, setIsSelectorOpen] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  const [cityAvailability, setCityAvailability] = useState<CityAvailability>(() => 
    calculateCityAvailability(location.city)
  );

  const fetchAvailability = useCallback(async (cityName: string, pincode?: string): Promise<CityAvailability> => {
    setIsLoadingAvailability(true);
    try {
      const params = new URLSearchParams({ city: cityName });
      if (pincode) params.append('pincode', pincode);
      
      const res = await fetch(`/api/locations/availability?${params.toString()}`);
      if (res.ok) {
        const data: CityAvailability = await res.json();
        setCityAvailability(data);
        setIsLoadingAvailability(false);
        return data;
      }
    } catch (err) {
      console.warn('Failed to fetch live availability from server, using local calculation:', err);
    }

    const fallback = calculateCityAvailability(cityName, pincode);
    setCityAvailability(fallback);
    setIsLoadingAvailability(false);
    return fallback;
  }, []);

  // Sync availability whenever active location city changes
  useEffect(() => {
    fetchAvailability(location.city, location.pincode);
  }, [location.city, location.pincode, fetchAvailability]);

  const setLocation = (newLoc: UserLocation) => {
    const safeLoc = validateAndNormalizeLocation(newLoc);
    setLocationState(safeLoc);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safeLoc));
    } catch (e) {
      console.warn('Could not save location to localStorage:', e);
    }

    // Refresh live availability for the new city
    fetchAvailability(safeLoc.city, safeLoc.pincode);

    // Also sync to authenticated user profile if token exists
    const token = localStorage.getItem('rentora_auth_token');
    if (token) {
      fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ preferredLocation: safeLoc }),
      }).catch((err) => {
        console.warn('Could not sync preferred location to profile:', err);
      });
    }
  };

  const deliveryInfo = getLocationDeliveryInfo(location);

  const formattedLocation = location.city ? `${location.city}, Gujarat, India` : 'Select City & Hub 📍';
  const shortLocation = location.city ? `${location.city}, Gujarat` : 'Select Location';

  // Optional manual geolocation detection restricted to Gujarat
  const detectGeolocation = async (): Promise<boolean> => {
    if (!navigator.geolocation) {
      return false;
    }

    setIsDetecting(true);
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`
            );
            if (res.ok) {
              const data = await res.json();
              const addr = data.address || {};
              const detectedCity = (addr.city || addr.town || addr.state_district || addr.county || '').toString().toLowerCase();
              const detectedState = (addr.state || '').toString().toLowerCase();

              // Check if detected in Gujarat
              if (detectedState.includes('gujarat')) {
                const matchedCity = GUJARAT_CITIES.find((c) =>
                  detectedCity.includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(detectedCity)
                );
                if (matchedCity) {
                  setLocation({
                    country: FIXED_COUNTRY,
                    state: FIXED_STATE,
                    city: matchedCity.name,
                    isServiceable: true,
                  });
                  setIsDetecting(false);
                  resolve(true);
                  return;
                }
              }
            }
          } catch (e) {
            console.warn('Reverse geocoding error:', e);
          }
          setIsDetecting(false);
          resolve(false);
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
          setIsDetecting(false);
          resolve(false);
        },
        { timeout: 7000 }
      );
    });
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        setLocation,
        isSelectorOpen,
        setIsSelectorOpen,
        deliveryInfo,
        cityAvailability,
        isLoadingAvailability,
        fetchAvailability,
        formattedLocation,
        shortLocation,
        detectGeolocation,
        isDetecting,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
