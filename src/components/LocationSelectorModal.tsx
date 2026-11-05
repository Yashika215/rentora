import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Search, 
  Check, 
  Navigation, 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  Clock,
  ArrowRight,
  AlertCircle,
  PackageCheck,
  RefreshCw,
  CalendarCheck
} from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useNotifications } from '../context/NotificationContext';
import { 
  GUJARAT_CITIES, 
  FIXED_COUNTRY, 
  FIXED_STATE, 
  GujaratCity,
  isGujaratPinCode,
  calculateCityAvailability,
  DELIVERY_HUBS,
} from '../data/locations';
import { UserLocation, CityAvailability } from '../types';

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationSelectorModal: React.FC<LocationSelectorModalProps> = ({ isOpen, onClose }) => {
  const { 
    location, 
    setLocation, 
    detectGeolocation, 
    isDetecting,
    cityAvailability,
    fetchAvailability,
    isLoadingAvailability
  } = useLocation();
  const { notifyUser } = useNotifications();

  // Internal selected city while modal is open
  const [selectedCityName, setSelectedCityName] = useState<string>(location?.city || '');
  const [selectedHub, setSelectedHub] = useState<string>(location?.hub || '');
  const [enteredPincode, setEnteredPincode] = useState<string>(location?.pincode || '');
  const [pincodeStatus, setPincodeStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [geoNotice, setGeoNotice] = useState<string | null>(null);
  const [previewData, setPreviewData] = useState<CityAvailability>(() => cityAvailability || calculateCityAvailability(location?.city || ''));

  // Sync preview data when modal opens or selected city changes
  useEffect(() => {
    if (isOpen) {
      const activeCity = location?.city || '';
      setSelectedCityName(activeCity);
      setSelectedHub(location?.hub || '');
      setEnteredPincode(location?.pincode || '');
      if (cityAvailability) {
        setPreviewData(cityAvailability);
      } else {
        setPreviewData(calculateCityAvailability(activeCity || ''));
      }
    }
  }, [isOpen, location?.city, location?.hub, location?.pincode, cityAvailability]);

  // Fetch local availability dynamically whenever user clicks a different city
  const handleSelectCity = async (city: GujaratCity) => {
    if (!city || !city.name) return;
    setSelectedCityName(city.name);
    setSelectedHub(''); // Reset hub on city change
    setPincodeStatus(null);
    try {
      const data = await fetchAvailability(city.name, enteredPincode);
      if (data) {
        setPreviewData(data);
      }
    } catch (err) {
      console.warn('Error fetching availability for city:', err);
      setPreviewData(calculateCityAvailability(city.name, enteredPincode));
    }
  };

  // Check specific PIN code
  const handleCheckPincode = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = (enteredPincode || '').trim();
    if (!trimmed) {
      setPincodeStatus({ message: 'Please enter a 6-digit postal code', type: 'error' });
      return;
    }

    if (!isGujaratPinCode(trimmed)) {
      setPincodeStatus({ 
        message: 'PIN code is outside Gujarat (valid range 360000 - 396999). Deliveries are exclusive to Gujarat.', 
        type: 'error' 
      });
      return;
    }

    try {
      const data = await fetchAvailability(selectedCityName || '', trimmed);
      if (data) {
        setPreviewData(data);
      }
      setPincodeStatus({
        message: `Verified: Doorstep courier delivery & pickup confirmed for PIN ${trimmed}!`,
        type: 'success',
      });
    } catch (err) {
      setPincodeStatus({
        message: `Verified: Doorstep delivery confirmed for PIN ${trimmed} in Gujarat!`,
        type: 'success',
      });
    }
  };

  // Filtered Gujarat cities based on user search
  const filteredCities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return GUJARAT_CITIES;
    return GUJARAT_CITIES.filter((city) => 
      city.name.toLowerCase().includes(q) || city.pincodePrefix.includes(q)
    );
  }, [searchQuery]);

  const popularCities = useMemo(() => {
    return GUJARAT_CITIES.filter((c) => c.isPopular);
  }, []);

  if (!isOpen) return null;

  const handleConfirmLocation = () => {
    if (!selectedCityName) return;
    
    const newLoc: UserLocation = {
      country: FIXED_COUNTRY,
      state: FIXED_STATE,
      city: selectedCityName,
      hub: selectedHub,
      pincode: enteredPincode || previewData.pincode,
      isServiceable: true,
    };
    setLocation(newLoc);
    notifyUser({
      type: 'order_status',
      category: 'orders',
      title: `Delivery Hub Updated: ${selectedCityName} 📍`,
      message: selectedHub 
        ? `Local courier routing set to ${selectedHub} in ${selectedCityName}. Express doorstep delivery calibrated.`
        : `VIP doorstep delivery calibrated for ${selectedCityName}, Gujarat.`,
      actionUrl: '#collections',
      actionLabel: 'Browse Local Wardrobe',
    });
    onClose();
  };

  const handleResetSelections = () => {
    setSelectedCityName('');
    setSelectedHub('');
    setEnteredPincode('');
    setPincodeStatus(null);
    setSearchQuery('');
    // Also clear the actual location state to force manual selection
    setLocation({
      country: FIXED_COUNTRY,
      state: FIXED_STATE,
      city: '',
      hub: '',
      isServiceable: false,
    });
  };

  const handleDetectGPS = async () => {
    setGeoNotice('Locating your city in Gujarat...');
    const success = await detectGeolocation();
    if (success) {
      setGeoNotice('Detected Gujarat location successfully! 📍');
      setTimeout(() => {
        setGeoNotice(null);
        onClose();
      }, 700);
    } else {
      setGeoNotice('Location outside Gujarat or permission denied. Please select your Gujarat city below.');
      setTimeout(() => setGeoNotice(null), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#FFF6F0] rounded-3xl shadow-2xl border border-[#D99BAE]/60 max-h-[90vh] flex flex-col my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header - Deep Plum & Dusty Rose Theme */}
        <div className="px-3.5 sm:px-5 py-3.5 sm:py-4 bg-[#54243E] text-white border-b border-[#D99BAE]/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 text-[#D99BAE] border border-[#D99BAE]/40 flex items-center justify-center shadow-xs shrink-0">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-[#D99BAE]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-serif text-base sm:text-xl font-bold text-[#FFF6F0]">
                  Select Gujarat City & Delivery Hub
                </h3>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#D99BAE] text-[#54243E]">
                  Gujarat Only 📍
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-[#D99BAE] mt-0.5 line-clamp-1 sm:line-clamp-none">
                Real-time rental availability & guaranteed delivery timelines across Gujarat
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer shrink-0"
            aria-label="Close Location Selector"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Academic Prototype Disclaimer */}
        <div className="bg-[#D99BAE]/20 px-4 py-2 border-b border-[#D99BAE]/40">
          <p className="text-[10px] font-bold text-[#54243E] text-center uppercase tracking-wider">
            Academic Prototype: This is a demo location-selection feature. No actual delivery is performed.
          </p>
        </div>

        {/* Fixed Country & State Badges with GPS Detection */}
        <div className="px-3.5 sm:px-5 py-2.5 sm:py-3 bg-[#FFF6F0] border-b border-[#D99BAE]/30 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-[#54243E] font-medium">Service Region:</span>
            
            {/* Fixed Country Badge */}
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-[#D99BAE] text-[#54243E] font-bold text-xs shadow-xs">
              <span>🇮🇳</span>
              <span>India</span>
              <span className="text-[10px] text-[#54243E]/60 font-normal">(Fixed)</span>
            </span>

            <span className="text-[#D99BAE] font-bold">→</span>

            {/* Fixed State Badge */}
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#54243E] text-[#FFF6F0] font-bold text-xs shadow-xs">
              <span>📍</span>
              <span>Gujarat</span>
              <span className="text-[10px] text-[#D99BAE] font-normal">(Fixed)</span>
            </span>
          </div>

          {/* Quick GPS button */}
          <button
            onClick={handleDetectGPS}
            disabled={isDetecting}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white hover:bg-[#FFF6F0] border border-[#D99BAE] text-[#54243E] hover:border-[#54243E] text-xs font-semibold transition-all cursor-pointer shadow-xs disabled:opacity-60"
            title="Auto-detect current location in Gujarat"
          >
            <Navigation className={`w-3.5 h-3.5 text-[#54243E] ${isDetecting ? 'animate-spin' : ''}`} />
            <span>{isDetecting ? 'Detecting...' : 'Detect Gujarat GPS'}</span>
          </button>
        </div>

        {/* GPS Notice Toast */}
        {geoNotice && (
          <div className="px-5 py-2 bg-amber-50 border-b border-amber-200 text-amber-900 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
            <span>{geoNotice}</span>
          </div>
        )}

        {/* Feature: Live Local Rental Availability & Delivery Times Card for Selected City */}
        <div className="p-3 sm:p-4 bg-gradient-to-br from-white via-[#FFF6F0] to-[#fdeef2] border-b border-[#D99BAE]/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-[#D99BAE]/25">
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg">⚡</span>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-serif text-sm sm:text-base font-bold text-[#54243E]">
                    {selectedCityName} Rental Availability & Delivery Times
                  </h4>
                  {isLoadingAvailability && (
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#54243E] font-semibold animate-pulse">
                      <RefreshCw className="w-3 h-3 animate-spin" />
                      Fetching live status...
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#54243E]/80">
                  {previewData?.deliverySpeed || 'Express 24h'} • Courier: {(previewData?.courierPartner || 'BlueDart').split('(')[0]}
                </p>
              </div>
            </div>

            <span className="self-start sm:self-center text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              {previewData?.availabilityPercentage || 100}% Wardrobe In-Stock
            </span>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2.5 text-left">
            <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-[#D99BAE]/40 shadow-xs">
              <div className="flex items-center gap-1 text-[10px] font-bold text-[#54243E] uppercase tracking-wider mb-1">
                <Clock className="w-3 h-3 text-[#54243E]" />
                <span>Est. Delivery</span>
              </div>
              <p className="text-xs font-bold text-[#54243E] leading-tight">
                {previewData?.estimatedDeliveryDate ? previewData.estimatedDeliveryDate.split('by')[0] : 'Tomorrow'}
              </p>
              <span className="text-[10px] text-emerald-700 font-medium block mt-0.5">
                {previewData?.estimatedDeliveryDate?.includes('by')
                  ? `by ${previewData.estimatedDeliveryDate.split('by')[1]}`
                  : 'by 2:00 PM'}
              </span>
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-[#D99BAE]/40 shadow-xs">
              <div className="flex items-center gap-1 text-[10px] font-bold text-[#54243E] uppercase tracking-wider mb-1">
                <PackageCheck className="w-3 h-3 text-[#54243E]" />
                <span>In-Stock Fit</span>
              </div>
              <p className="text-xs font-bold text-[#54243E] leading-tight">
                {previewData?.availableOutfitsCount || 32} of {previewData?.totalOutfitsCount || 32} Looks
              </p>
              <div className="w-full bg-gray-200 h-1.5 rounded-full mt-1.5 overflow-hidden">
                <div 
                  className="bg-[#54243E] h-full rounded-full transition-all duration-500"
                  style={{ width: `${previewData?.availabilityPercentage || 100}%` }}
                />
              </div>
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-[#D99BAE]/40 shadow-xs">
              <div className="flex items-center gap-1 text-[10px] font-bold text-[#54243E] uppercase tracking-wider mb-1">
                <CalendarCheck className="w-3 h-3 text-[#54243E]" />
                <span>Order Cutoff</span>
              </div>
              <p className="text-xs font-bold text-[#54243E] leading-tight">
                Same-Day
              </p>
              <span className="text-[10px] text-[#54243E]/70 block mt-0.5 truncate" title={previewData?.orderCutoffTime}>
                {previewData?.orderCutoffTime ? previewData.orderCutoffTime.split('for')[0] : 'Order today'}
              </span>
            </div>

            <div className="p-2 sm:p-2.5 rounded-xl bg-white border border-[#D99BAE]/40 shadow-xs">
              <div className="flex items-center gap-1 text-[10px] font-bold text-[#54243E] uppercase tracking-wider mb-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Return Pickup</span>
              </div>
              <p className="text-xs font-bold text-emerald-700 leading-tight">
                100% Free
              </p>
              <span className="text-[10px] text-[#54243E]/70 block mt-0.5">
                Contactless Doorstep
              </span>
            </div>
          </div>

          {/* Quick PIN Code Check Tool */}
          <form onSubmit={handleCheckPincode} className="mt-2.5 pt-2 border-t border-[#D99BAE]/20 flex flex-col sm:flex-row items-center gap-2">
            <span className="text-[11px] font-semibold text-[#54243E] whitespace-nowrap self-start sm:self-center">
              Check PIN Code:
            </span>
            <div className="flex-1 w-full flex items-center gap-1.5">
              <input
                type="text"
                maxLength={6}
                value={enteredPincode}
                onChange={(e) => {
                  setEnteredPincode(e.target.value.replace(/\D/g, ''));
                  setPincodeStatus(null);
                }}
                placeholder="Enter 6-digit Gujarat PIN (e.g. 380054, 395007)..."
                className="flex-1 px-3 py-1.5 bg-white border border-[#D99BAE] rounded-xl text-xs text-[#54243E] placeholder-[#54243E]/40 focus:outline-none focus:ring-1 focus:ring-[#54243E]"
              />
              <button
                type="submit"
                disabled={isLoadingAvailability}
                className="px-3.5 py-1.5 bg-[#54243E] text-white rounded-xl text-xs font-semibold hover:bg-[#3d182b] transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                Verify PIN
              </button>
            </div>
          </form>

          {/* Pincode validation notice */}
          {pincodeStatus && (
            <div className={`mt-2 p-2 rounded-xl text-xs flex items-center gap-1.5 ${
              pincodeStatus.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-rose-50 text-rose-800 border border-rose-200'
            }`}>
              {pincodeStatus.type === 'success' ? (
                <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-rose-700 shrink-0" />
              )}
              <span>{pincodeStatus.message}</span>
            </div>
          )}
        </div>

        {/* City Selection Dropdown Area */}
        <div className="px-3.5 sm:px-5 py-4 bg-[#FFF6F0] border-b border-[#D99BAE]/30">
          <label className="text-[10px] font-bold text-[#54243E] uppercase tracking-wider block mb-2">
            Select Your Gujarat City *
          </label>
          <div className="relative">
            <select
              value={selectedCityName}
              onChange={(e) => {
                const city = GUJARAT_CITIES.find(c => c.name === e.target.value);
                if (city) handleSelectCity(city);
              }}
              className="w-full px-4 py-2.5 rounded-2xl border border-[#D99BAE] bg-white text-xs text-[#54243E] focus:outline-none focus:ring-1 focus:ring-[#54243E] transition-all appearance-none cursor-pointer"
            >
              <option value="">-- Choose a City --</option>
              {GUJARAT_CITIES.map((city) => (
                <option key={city.name} value={city.name}>
                  {city.name} ({city.tier === 'flagship_express' ? 'Flagship ⚡' : 'Express Hub'})
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#54243E]">
              <ArrowRight className="w-4 h-4 rotate-90" />
            </div>
          </div>
          {!selectedCityName && (
            <p className="text-[10px] text-[#54243E]/60 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>Please select a city to continue.</span>
            </p>
          )}
        </div>

        {/* Delivery Hub Selection Dropdown */}
        <div className="px-3.5 sm:px-5 py-3 bg-[#fdf2f0] border-t border-[#D99BAE]/30">
          <label className="text-[10px] font-bold text-[#54243E] uppercase tracking-wider block mb-2">
            Select Preferred Delivery Hub *
          </label>
          <div className="relative">
            <select
              value={selectedHub}
              onChange={(e) => setSelectedHub(e.target.value)}
              disabled={!selectedCityName}
              className={`w-full px-4 py-2.5 rounded-2xl border bg-white text-xs text-[#54243E] focus:outline-none focus:ring-1 focus:ring-[#54243E] transition-all appearance-none cursor-pointer ${
                !selectedCityName ? 'opacity-50 cursor-not-allowed border-gray-200' : 'border-[#D99BAE]'
              }`}
            >
              <option value="">-- Choose a Hub --</option>
              {selectedCityName && DELIVERY_HUBS[selectedCityName]?.map((hub: string) => (
                <option key={hub} value={hub}>{hub}</option>
              ))}
              {selectedCityName && (!DELIVERY_HUBS[selectedCityName] || DELIVERY_HUBS[selectedCityName].length === 0) && (
                <option value="Standard Courier">Standard Courier Dispatch (No Local Hub)</option>
              )}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#54243E]">
              <ArrowRight className="w-4 h-4 rotate-90" />
            </div>
          </div>
          {!selectedCityName && (
            <p className="text-[10px] text-[#54243E]/60 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>Select a city above to see available delivery hubs.</span>
            </p>
          )}
          {selectedCityName && (!DELIVERY_HUBS[selectedCityName] || DELIVERY_HUBS[selectedCityName].length === 0) && (
            <p className="text-[10px] text-amber-700 mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>No dedicated RENTORA hubs in this city yet. Standard express courier will be used.</span>
            </p>
          )}
        </div>

        {/* Modal Bottom Confirmation Bar */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-[#D99BAE]/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center justify-center shrink-0">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-xs text-[#54243E]">
                  📍 {selectedCityName || 'Select City'}, Gujarat
                </span>
                {selectedHub && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#54243E] text-white">
                    Hub: {selectedHub}
                  </span>
                )}
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {previewData?.deliverySpeed ? previewData.deliverySpeed.split('(')[0] : 'Express 24h'}
                </span>
              </div>
              <p className="text-[11px] text-[#54243E]/70 mt-0.5">
                {selectedCityName ? (previewData?.estimatedDeliveryDate || 'Tomorrow') : 'Select a city for delivery estimate'} • {previewData?.notes || 'Gujarat express hub active'}
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto flex items-center justify-end gap-2 shrink-0">
            <button
              type="button"
              onClick={handleResetSelections}
              className="px-4 py-2 rounded-full border border-gray-300 text-xs font-semibold text-gray-500 hover:bg-gray-50 cursor-pointer flex items-center gap-1.5"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={handleConfirmLocation}
              disabled={!selectedCityName}
              className={`px-5 py-2 rounded-full bg-[#54243E] text-[#FFF6F0] hover:bg-[#3d182b] text-xs font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                !selectedCityName ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span>Set as Delivery Hub</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D99BAE]" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
