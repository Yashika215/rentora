import React, { useState } from 'react';
import { Order, UserProfile } from '../types';
import { AESTHETICS } from '../data/catalog';
import { 
  X, 
  User, 
  Package, 
  Heart, 
  Sparkles, 
  MapPin, 
  Calendar, 
  Clock, 
  CheckCircle, 
  LogOut, 
  LogIn, 
  Award,
  Edit3,
  Check,
  Copy,
  Share2,
  Gift,
  Users,
  Truck,
  Bell
} from 'lucide-react';
import { OrderTracking } from './OrderTracking';
import { useNotifications } from '../context/NotificationContext';
import { useLocation } from '../context/LocationContext';
import { useAuth } from '../context/AuthContext';
import { useImageManager } from '../context/ImageManagerContext';
import { NotificationIcon, BowIcon, GogglesIcon } from './NotificationIcon';


import { GUJARAT_CITIES } from '../data/locations';

interface AccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  userAesthetics: string[];
  onToggleAesthetic: (id: string) => void;
  currentUser?: UserProfile | null;
  onLogout?: () => void;
  onOpenAuth?: () => void;
  onUpdateUser?: (updatedUser: UserProfile) => void;
  initialTab?: 'profile' | 'orders' | 'sizing' | 'referral';
}

export const AccountModal: React.FC<AccountModalProps> = ({
  isOpen,
  onClose,
  orders,
  userAesthetics,
  onToggleAesthetic,
  currentUser,
  onLogout,
  onOpenAuth,
  onUpdateUser,
  initialTab = 'profile',
}) => {
  const { formattedLocation, setIsSelectorOpen, deliveryInfo } = useLocation();
  const { updateProfile } = useAuth();
  const { simulateEvent, notifyUser } = useNotifications();
  const { getImage } = useImageManager();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'sizing' | 'referral'>(initialTab);

  // Sync activeTab when initialTab or isOpen changes
  React.useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Dedicated Form Modal States
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isEditAddressModalOpen, setIsEditAddressModalOpen] = useState(false);
  const [profileFormError, setProfileFormError] = useState<string | null>(null);
  const [addressFormError, setAddressFormError] = useState<string | null>(null);

  // Editable profile state - initialize safely with Gujarat defaults
  const [editName, setEditName] = useState(currentUser?.fullName || 'Aditi Verma');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [editEmail, setEditEmail] = useState(currentUser?.email || 'aditi.verma@gmail.com');
  const [editAddress, setEditAddress] = useState(currentUser?.savedAddress?.address || 'Flat 402, Royal Orchid Enclave, Bodakdev');
  const [editCity, setEditCity] = useState(currentUser?.savedAddress?.city || 'Ahmedabad');
  const [editPincode, setEditPincode] = useState(currentUser?.savedAddress?.pincode || '380054');

  // Editable measurements state
  const [bust, setBust] = useState('34 Inches (Size S/M)');
  const [waist, setWaist] = useState('28 Inches');
  const [hips, setHips] = useState('38 Inches');
  const [height, setHeight] = useState('5\' 6" (+3" Heel)');

  // Which field is currently being inline edited on tap
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState('');

  // Referral state
  const [copiedLink, setCopiedLink] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync state whenever currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.fullName || 'Aditi Verma');
      setEditPhone(currentUser.phone || '+91 98765 43210');
      setEditEmail(currentUser.email || 'aditi.verma@gmail.com');
      if (currentUser.savedAddress) {
        setEditAddress(currentUser.savedAddress.address || 'Flat 402, Royal Orchid Enclave, Bodakdev');
        setEditCity(currentUser.savedAddress.city || 'Ahmedabad');
        setEditPincode(currentUser.savedAddress.pincode || '380054');
      }
    }
  }, [currentUser]);

  // Referral code calculation
  const referralCode = currentUser ? `RENTORA-${currentUser.fullName.split(' ')[0].toUpperCase()}2026` : 'RENTORA-ADITI2026';
  const referralLink = `https://rentora.in/invite?ref=${referralCode}`;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStartEditing = (fieldKey: string, currentValue: string) => {
    setEditingField(fieldKey);
    setTempValue(currentValue);
  };

  // Modal open check - now safely AFTER all React hooks have run
  if (!isOpen) return null;

  // Unauthenticated user prompt - safely AFTER all React hooks have run
  if (!currentUser) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-2xl border border-[#C8A49F]">
          <div className="w-14 h-14 rounded-full bg-[#EEE4DA] flex items-center justify-center mx-auto text-[#4D0E13]">
            <User className="w-7 h-7" />
          </div>
          <h3 className="font-serif text-xl font-bold text-[#4D0E13]">Sign In Required</h3>
          <p className="text-xs text-[#5e5460]">
            Please sign in to access your personal measurements, active rentals, saved addresses, and VIP rental benefits.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                onClose();
                if (onOpenAuth) onOpenAuth();
              }}
              className="w-full py-2.5 rounded-full bg-[#4D0E13] text-white text-xs font-bold hover:bg-[#6A1A21] cursor-pointer shadow-md"
            >
              Sign In to My Account 🎀
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 text-xs text-[#5e5460] hover:text-[#2D1517] cursor-pointer"
            >
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSaveField = (fieldKey: string) => {
    let newName = editName;
    let newPhone = editPhone;
    let newEmail = editEmail;
    let newAddress = editAddress;
    let newCity = editCity;
    let newPincode = editPincode;

    if (fieldKey === 'name') newName = tempValue;
    if (fieldKey === 'phone') newPhone = tempValue;
    if (fieldKey === 'email') newEmail = tempValue;
    if (fieldKey === 'address') newAddress = tempValue;
    if (fieldKey === 'city') newCity = tempValue;
    if (fieldKey === 'pincode') newPincode = tempValue;
    if (fieldKey === 'bust') setBust(tempValue);
    if (fieldKey === 'waist') setWaist(tempValue);
    if (fieldKey === 'hips') setHips(tempValue);
    if (fieldKey === 'height') setHeight(tempValue);

    setEditName(newName);
    setEditPhone(newPhone);
    setEditEmail(newEmail);
    setEditAddress(newAddress);
    setEditCity(newCity);
    setEditPincode(newPincode);

    if (currentUser && onUpdateUser) {
      const updated: UserProfile = {
        ...currentUser,
        fullName: newName,
        phone: newPhone,
        email: newEmail,
        savedAddress: {
          address: newAddress,
          city: newCity,
          state: currentUser.savedAddress?.state || 'Gujarat',
          pincode: newPincode,
        },
      };
      onUpdateUser(updated);
      try {
        localStorage.setItem('rentora_current_user', JSON.stringify(updated));
      } catch {}

      if (['bust', 'waist', 'hips', 'height'].includes(fieldKey)) {
        notifyUser({
          type: 'stylist_tip',
          category: 'stylist',
          title: 'Custom Measurements Saved 📐',
          message: `Your ${fieldKey} was updated to "${tempValue}". Precision garment sizing applied to your rental profile.`,
          actionUrl: '#sizing',
          actionLabel: 'View Sizing',
        });
      } else {
        notifyUser({
          type: 'stylist_tip',
          category: 'stylist',
          title: 'Profile Updated ✨',
          message: `Your ${fieldKey} has been updated in your RENTORA account profile.`,
          actionUrl: '#profile',
          actionLabel: 'View Profile',
        });
      }
    }

    setEditingField(null);
    showToast('Updated instantly on tap! ✨');
  };

  // Dedicated Profile Form Save with validation
  const handleSaveProfileForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileFormError(null);

    if (!editName.trim() || editName.trim().length < 2) {
      setProfileFormError('Please enter a valid full name (minimum 2 characters).');
      return;
    }
    if (!editEmail.trim() || !editEmail.includes('@') || !editEmail.includes('.')) {
      setProfileFormError('Please enter a valid email address.');
      return;
    }

    if (currentUser) {
      const updated: UserProfile = {
        ...currentUser,
        fullName: editName.trim(),
        phone: editPhone.trim(),
        email: editEmail.trim(),
      };
      if (onUpdateUser) onUpdateUser(updated);
      await updateProfile({ fullName: editName.trim(), phone: editPhone.trim() });
      try {
        localStorage.setItem('rentora_current_user', JSON.stringify(updated));
      } catch {}

      notifyUser({
        type: 'stylist_tip',
        category: 'stylist',
        title: 'Profile Updated ✨',
        message: 'Your personal account profile details have been saved.',
        actionUrl: '#profile',
        actionLabel: 'View Profile',
      });
    }
    setIsEditProfileModalOpen(false);
    showToast('Profile updated successfully! ✨');
  };

  // Dedicated Address Form Save with validation (Strictly Gujarat)
  const handleSaveAddressForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressFormError(null);

    if (!editAddress.trim() || editAddress.trim().length < 5) {
      setAddressFormError('Please enter complete flat/house, building, and street details.');
      return;
    }
    const cleanPin = editPincode.trim().replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      setAddressFormError('Please enter a valid 6-digit Gujarat PIN code (e.g. 380054).');
      return;
    }

    if (currentUser) {
      const updated: UserProfile = {
        ...currentUser,
        savedAddress: {
          address: editAddress.trim(),
          city: editCity,
          state: 'Gujarat',
          pincode: cleanPin,
        },
        preferredLocation: {
          country: 'India',
          state: 'Gujarat',
          city: editCity,
          pincode: cleanPin,
          isServiceable: true,
        },
      };
      if (onUpdateUser) onUpdateUser(updated);
      await updateProfile({
        savedAddress: {
          address: editAddress.trim(),
          city: editCity,
          state: 'Gujarat',
          pincode: cleanPin,
        },
        preferredLocation: {
          country: 'India',
          state: 'Gujarat',
          city: editCity,
          pincode: cleanPin,
          isServiceable: true,
        },
      });
      try {
        localStorage.setItem('rentora_current_user', JSON.stringify(updated));
      } catch {}

      notifyUser({
        type: 'order_status',
        category: 'orders',
        title: 'Delivery Address Saved 📍',
        message: `Your VIP doorstep rental address in ${editCity} (${cleanPin}) has been updated.`,
        actionUrl: '#profile',
        actionLabel: 'Review Address',
      });
    }
    setIsEditAddressModalOpen(false);
    showToast('Delivery address in Gujarat saved! 📍');
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    showToast('Referral link copied! Share with friends to earn ₹500 credits.');
    setTimeout(() => setCopiedLink(false), 3000);
  };

  const getInitials = (name: string) => {
    if (!name) return 'R';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const displayName = currentUser?.fullName || editName;
  const displayEmail = currentUser?.email || editEmail;
  const displayTier = currentUser?.memberTier || 'Gold VIP Renter';
  const displayCredits = currentUser?.rentalCredits || 500;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-[#C8A49F]/40 max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Toast Notification inside Modal */}
        {toastMessage && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#4D0E13] text-white text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounceIn">
            <Sparkles className="w-3.5 h-3.5 text-[#C8A49F]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-[#EEE4DA] to-[#E4D8CC] border-b border-[#C8A49F]/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#4D0E13] text-white flex items-center justify-center font-serif text-lg font-bold border-2 border-[#C8A49F] shrink-0 shadow-sm">
              {getInitials(displayName)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-bold text-[#2D1517]">
                  {displayName}
                </h3>
                <span className="text-[10px] bg-[#C8A49F]/30 text-[#4D0E13] px-2 py-0.5 rounded-full font-semibold">
                  {displayTier}
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  ₹{displayCredits} Credits
                </span>
              </div>
              <p className="text-xs text-[#5e5460]">{displayEmail}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {currentUser && onLogout ? (
              <button
                onClick={() => {
                  onLogout();
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#C8A49F]/50 text-xs font-semibold text-[#4D0E13] hover:bg-white transition-all cursor-pointer shadow-xs"
                title="Sign out of RENTORA"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            ) : onOpenAuth ? (
              <button
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#4D0E13] text-xs font-semibold text-white hover:bg-[#3b172a] transition-all cursor-pointer shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In / Join</span>
              </button>
            ) : null}

            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white text-[#2D1517] transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center overflow-x-auto scrollbar-none border-b border-[#C8A49F]/25 bg-[#EEE4DA]/50 px-3 sm:px-6 text-xs font-semibold gap-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-3 sm:px-4 border-b-2 cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'profile'
                ? 'border-[#4D0E13] text-[#4D0E13]'
                : 'border-transparent text-[#5e5460] hover:text-[#4D0E13]'
            }`}
          >
            Profile & Address
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-3 sm:px-4 border-b-2 cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'orders'
                ? 'border-[#4D0E13] text-[#4D0E13]'
                : 'border-transparent text-[#5e5460] hover:text-[#4D0E13]'
            }`}
          >
            My Rentals ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('sizing')}
            className={`py-3 px-3 sm:px-4 border-b-2 cursor-pointer transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'sizing'
                ? 'border-[#4D0E13] text-[#4D0E13]'
                : 'border-transparent text-[#5e5460] hover:text-[#4D0E13]'
            }`}
          >
            Measurements Vault
          </button>
          <button
            onClick={() => setActiveTab('referral')}
            className={`py-3 px-3 sm:px-4 border-b-2 cursor-pointer transition-colors flex items-center gap-1 whitespace-nowrap shrink-0 ${
              activeTab === 'referral'
                ? 'border-[#4D0E13] text-[#4D0E13]'
                : 'border-transparent text-[#5e5460] hover:text-[#4D0E13]'
            }`}
          >
            <Gift className="w-3.5 h-3.5 text-[#C8A49F]" />
            <span>Refer & Earn</span>
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* PROFILE & ADDRESS TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-5">
              
              {/* Header Action Bar with Explicit Edit Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#EEE4DA] p-3.5 rounded-2xl border border-[#C8A49F]/40 gap-3">
                <div>
                  <h4 className="font-serif text-sm font-bold text-[#2D1517]">
                    Manage Your RENTORA Profile & Gujarat Address 🎀
                  </h4>
                  <p className="text-[11px] text-[#5e5460]">
                    Keep your contact details and Gujarat delivery address updated for seamless fittings.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileFormError(null);
                      setIsEditProfileModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#4D0E13] text-white text-xs font-bold hover:bg-[#3b172a] transition-all cursor-pointer shadow-xs"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#C8A49F]" />
                    <span>Edit Profile</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAddressFormError(null);
                      setIsEditAddressModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#4D0E13] border border-[#C8A49F] text-xs font-bold hover:bg-[#fbf0f4] transition-all cursor-pointer shadow-xs"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#4D0E13]" />
                    <span>Edit Address</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                
                {/* Full Name Field */}
                <div className="p-3.5 bg-[#EEE4DA] rounded-2xl border border-[#C8A49F]/30 relative group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#5e5460] font-medium">Full Name</span>
                    <Edit3 className="w-3 h-3 text-[#4D0E13] opacity-60 group-hover:opacity-100" />
                  </div>
                  {editingField === 'name' ? (
                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="flex-1 px-2.5 py-1 rounded-lg border border-[#4D0E13] bg-white text-xs"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveField('name')}
                        className="px-3 py-1 bg-[#4D0E13] text-white rounded-lg font-bold"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <p 
                      onClick={() => handleStartEditing('name', editName)}
                      className="font-bold text-sm text-[#2D1517] cursor-pointer hover:text-[#4D0E13] transition-colors"
                      title="Tap to edit"
                    >
                      {editName} ✎
                    </p>
                  )}
                </div>

                {/* Phone Field */}
                <div className="p-3.5 bg-[#EEE4DA] rounded-2xl border border-[#C8A49F]/30 relative group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#5e5460] font-medium">Phone Number</span>
                    <Edit3 className="w-3 h-3 text-[#4D0E13] opacity-60 group-hover:opacity-100" />
                  </div>
                  {editingField === 'phone' ? (
                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="flex-1 px-2.5 py-1 rounded-lg border border-[#4D0E13] bg-white text-xs"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveField('phone')}
                        className="px-3 py-1 bg-[#4D0E13] text-white rounded-lg font-bold"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <p 
                      onClick={() => handleStartEditing('phone', editPhone)}
                      className="font-bold text-sm text-[#2D1517] cursor-pointer hover:text-[#4D0E13] transition-colors"
                      title="Tap to edit"
                    >
                      {editPhone} ✎
                    </p>
                  )}
                </div>

                {/* Email Field */}
                <div className="p-3.5 bg-[#EEE4DA] rounded-2xl border border-[#C8A49F]/30 relative group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#5e5460] font-medium">Email Address</span>
                    <Edit3 className="w-3 h-3 text-[#4D0E13] opacity-60 group-hover:opacity-100" />
                  </div>
                  {editingField === 'email' ? (
                    <div className="flex gap-2 mt-1">
                      <input
                        type="email"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="flex-1 px-2.5 py-1 rounded-lg border border-[#4D0E13] bg-white text-xs"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveField('email')}
                        className="px-3 py-1 bg-[#4D0E13] text-white rounded-lg font-bold"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <p 
                      onClick={() => handleStartEditing('email', editEmail)}
                      className="font-bold text-sm text-[#2D1517] cursor-pointer hover:text-[#4D0E13] transition-colors truncate"
                      title="Tap to edit"
                    >
                      {editEmail} ✎
                    </p>
                  )}
                </div>

                {/* Address Field */}
                <div className="p-3.5 bg-[#EEE4DA] rounded-2xl border border-[#C8A49F]/30 relative group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#5e5460] font-medium">Delivery Address & Pincode</span>
                    <Edit3 className="w-3 h-3 text-[#4D0E13] opacity-60 group-hover:opacity-100" />
                  </div>
                  {editingField === 'address' ? (
                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="flex-1 px-2.5 py-1 rounded-lg border border-[#4D0E13] bg-white text-xs"
                        autoFocus
                      />
                      <button
                        onClick={() => handleSaveField('address')}
                        className="px-3 py-1 bg-[#4D0E13] text-white rounded-lg font-bold"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <p 
                      onClick={() => handleStartEditing('address', editAddress)}
                      className="font-bold text-sm text-[#2D1517] cursor-pointer hover:text-[#4D0E13] transition-colors truncate"
                      title="Tap to edit"
                    >
                      {editAddress}, {editCity} - {editPincode} ✎
                    </p>
                  )}
                </div>

                {/* Gender Preference & Notification Icon Card */}
                <div className="sm:col-span-2 p-4 bg-gradient-to-r from-[#EEE4DA] via-[#FDF5F2] to-[#EEE4DA] rounded-2xl border border-[#C8A49F]/50 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-full bg-[#4D0E13] text-[#F5EFE7]">
                        <NotificationIcon gender={currentUser?.gender} className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-xs text-[#4D0E13] block">Notification Icon Preference</span>
                        <span className="text-[11px] text-[#5e5460]">
                          {currentUser?.gender === 'female'
                            ? 'Female (Pink/Burgundy Bow 🎀)'
                            : currentUser?.gender === 'male'
                            ? 'Male (Stylish Goggles 🕶️)'
                            : 'Unisex / Neutral (Classic Bell 🔔)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        updateProfile({ gender: 'female' });
                        if (currentUser && onUpdateUser) onUpdateUser({ ...currentUser, gender: 'female' });
                        showToast('Notification icon updated to Pink/Burgundy Bow 🎀!');
                      }}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        currentUser?.gender === 'female'
                          ? 'bg-[#4D0E13] text-white border-[#4D0E13] shadow-xs'
                          : 'bg-white text-[#4D0E13] border-[#C8A49F]/50 hover:bg-stone-50'
                      }`}
                    >
                      <BowIcon className="w-4 h-4 shrink-0" />
                      <span>Female (Bow)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        updateProfile({ gender: 'male' });
                        if (currentUser && onUpdateUser) onUpdateUser({ ...currentUser, gender: 'male' });
                        showToast('Notification icon updated to Stylish Goggles 🕶️!');
                      }}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        currentUser?.gender === 'male'
                          ? 'bg-[#4D0E13] text-white border-[#4D0E13] shadow-xs'
                          : 'bg-white text-[#4D0E13] border-[#C8A49F]/50 hover:bg-stone-50'
                      }`}
                    >
                      <GogglesIcon className="w-4 h-4 shrink-0" />
                      <span>Male (Goggles)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        updateProfile({ gender: 'unisex' });
                        if (currentUser && onUpdateUser) onUpdateUser({ ...currentUser, gender: 'unisex' });
                        showToast('Notification icon updated to Unisex Bell 🔔!');
                      }}
                      className={`py-2 px-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                        currentUser?.gender === 'unisex' || !currentUser?.gender
                          ? 'bg-[#4D0E13] text-white border-[#4D0E13] shadow-xs'
                          : 'bg-white text-[#4D0E13] border-[#C8A49F]/50 hover:bg-stone-50'
                      }`}
                    >
                      <Bell className="w-4 h-4 shrink-0" />
                      <span>Unisex (Bell)</span>
                    </button>
                  </div>
                </div>

                {/* Preferred Rental & Delivery Location Card */}
                <div className="p-4 bg-gradient-to-r from-[#EEE4DA] via-[#fbf0f4] to-[#EEE4DA] rounded-2xl border border-[#C8A49F]/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#4D0E13]" />
                      <span className="font-bold text-xs text-[#4D0E13]">Preferred Rental & Delivery Location</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        setIsSelectorOpen(true);
                      }}
                      className="px-3 py-1 rounded-full bg-[#4D0E13] text-white text-[11px] font-bold hover:bg-[#6A1A21] transition-all cursor-pointer shadow-xs"
                    >
                      Change Location
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-xs flex-wrap gap-2 pt-1">
                    <span className="font-bold text-[#2D1517] text-sm">📍 {formattedLocation}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${deliveryInfo.badgeColor}`}>
                      {deliveryInfo.badgeText}
                    </span>
                  </div>

                  <p className="text-[11px] text-[#5e5460] leading-relaxed">
                    {deliveryInfo.notes}
                  </p>
                </div>

              </div>

              {/* Password Reset Timing Info */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#EEE4DA] to-[#E4D8CC] border border-[#C8A49F]/40 text-xs flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#4D0E13] shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-[#4D0E13]">Password Reset & Security Timing</h5>
                  <p className="text-[#5e5460] mt-0.5 leading-relaxed">
                    Password reset SMS verification codes & secure email tokens arrive in <strong>under 30 seconds</strong>.
                  </p>
                </div>
              </div>

              {/* Aesthetic Preferences Section */}
              <div className="pt-2">
                <h5 className="font-serif text-sm font-bold text-[#2D1517] mb-2">
                  Aesthetic Preferences (Tap to toggle)
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {AESTHETICS.map((aes) => {
                    const isSelected = userAesthetics.includes(aes.id);
                    return (
                      <button
                        key={aes.id}
                        onClick={() => onToggleAesthetic(aes.id)}
                        className={`p-2.5 rounded-xl text-left border transition-all text-xs flex items-center gap-2 cursor-pointer ${
                          isSelected
                            ? 'bg-[#4D0E13] text-white border-[#4D0E13]'
                            : 'bg-[#EEE4DA] text-[#2D1517] border-[#C8A49F]/30 hover:border-[#4D0E13]'
                        }`}
                      >
                        <span>{aes.emoji}</span>
                        <span className="font-medium truncate">{aes.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div
                    key={order.id}
                    className="p-4 rounded-2xl bg-[#EEE4DA] border border-[#C8A49F]/30 space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-[#C8A49F]/20 text-xs">
                      <div>
                        <span className="font-bold text-[#4D0E13]">Order #{order.id}</span>
                        <span className="text-[#5e5460] ml-2">Booked on {order.createdAt}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                        {order.status}
                      </span>
                    </div>
                    
                    <OrderTracking status={order.status} />

                    <div className="flex items-center justify-between text-xs pt-1 pb-1">
                      <span className="text-[11px] text-[#5e5460]">Live Status Feed:</span>
                      <button
                        onClick={() => {
                          simulateEvent('order_dispatched', { orderId: order.id });
                          showToast('Real-time delivery update broadcast via WebSockets! 🚚');
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#4D0E13]/30 text-[11px] font-bold text-[#4D0E13] hover:bg-[#4D0E13] hover:text-white transition-all cursor-pointer shadow-xs"
                      >
                        <Truck className="w-3 h-3" />
                        <span>Simulate Live Courier Ping</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      {order.items.slice(0, 3).map((item) => (
                        <img
                          key={item.id}
                          src={getImage(`product-${item.product.id}`, item.product.images[0])}
                          alt={item.product.name}
                          className="w-14 h-14 rounded-xl object-contain p-1 bg-white border border-[#C8A49F]/30"
                        />
                      ))}
                      <div className="flex-1 min-w-0 text-xs">
                        <p className="font-semibold text-[#2D1517] truncate">
                          {order.items.map((i) => i.product.name).join(', ')}
                        </p>
                        <p className="text-[11px] text-[#5e5460] mt-0.5">
                          Delivery: {order.startDate} · Return: {order.endDate}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#C8A49F]/20 flex items-center justify-between text-xs">
                      <span className="text-[#5e5460]">Paid Total (inc. deposit):</span>
                      <span className="font-mono font-bold text-[#4D0E13]">
                        ₹{order.totalPaid.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Package className="w-10 h-10 text-[#C8A49F] mx-auto mb-2" />
                  <h4 className="font-serif text-base font-bold text-[#2D1517]">
                    No active rentals yet
                  </h4>
                  <p className="text-xs text-[#5e5460] mt-1">
                    Book your first designer piece and track delivery status right here!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* SIZING & MEASUREMENTS TAB (Tap-to-Edit Inline) */}
          {activeTab === 'sizing' && (
            <div className="space-y-4 text-xs">
              <div className="p-3 bg-[#EEE4DA] rounded-2xl border border-[#C8A49F]/30">
                <h4 className="font-serif text-sm font-bold text-[#2D1517] mb-0.5">
                  Tap any measurement below to update 📐
                </h4>
                <p className="text-[11px] text-[#5e5460]">
                  Click on bust, waist, hips, or height to edit instantly.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                
                {/* Bust */}
                <div className="p-3.5 bg-[#EEE4DA] rounded-2xl border border-[#C8A49F]/30 relative group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#5e5460] font-medium">Bust / Chest</span>
                    <Edit3 className="w-3 h-3 text-[#4D0E13]" />
                  </div>
                  {editingField === 'bust' ? (
                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="flex-1 px-2 py-1 rounded-lg border border-[#4D0E13] bg-white text-xs font-mono"
                        autoFocus
                      />
                      <button onClick={() => handleSaveField('bust')} className="px-2.5 py-1 bg-[#4D0E13] text-white rounded-lg font-bold">Save</button>
                    </div>
                  ) : (
                    <strong 
                      onClick={() => handleStartEditing('bust', bust)}
                      className="text-sm font-mono text-[#2D1517] cursor-pointer hover:text-[#4D0E13] block"
                      title="Tap to edit"
                    >
                      {bust} ✎
                    </strong>
                  )}
                </div>

                {/* Waist */}
                <div className="p-3.5 bg-[#EEE4DA] rounded-2xl border border-[#C8A49F]/30 relative group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#5e5460] font-medium">Waistline</span>
                    <Edit3 className="w-3 h-3 text-[#4D0E13]" />
                  </div>
                  {editingField === 'waist' ? (
                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="flex-1 px-2 py-1 rounded-lg border border-[#4D0E13] bg-white text-xs font-mono"
                        autoFocus
                      />
                      <button onClick={() => handleSaveField('waist')} className="px-2.5 py-1 bg-[#4D0E13] text-white rounded-lg font-bold">Save</button>
                    </div>
                  ) : (
                    <strong 
                      onClick={() => handleStartEditing('waist', waist)}
                      className="text-sm font-mono text-[#2D1517] cursor-pointer hover:text-[#4D0E13] block"
                      title="Tap to edit"
                    >
                      {waist} ✎
                    </strong>
                  )}
                </div>

                {/* Hips */}
                <div className="p-3.5 bg-[#EEE4DA] rounded-2xl border border-[#C8A49F]/30 relative group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#5e5460] font-medium">Hips</span>
                    <Edit3 className="w-3 h-3 text-[#4D0E13]" />
                  </div>
                  {editingField === 'hips' ? (
                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="flex-1 px-2 py-1 rounded-lg border border-[#4D0E13] bg-white text-xs font-mono"
                        autoFocus
                      />
                      <button onClick={() => handleSaveField('hips')} className="px-2.5 py-1 bg-[#4D0E13] text-white rounded-lg font-bold">Save</button>
                    </div>
                  ) : (
                    <strong 
                      onClick={() => handleStartEditing('hips', hips)}
                      className="text-sm font-mono text-[#2D1517] cursor-pointer hover:text-[#4D0E13] block"
                      title="Tap to edit"
                    >
                      {hips} ✎
                    </strong>
                  )}
                </div>

                {/* Height */}
                <div className="p-3.5 bg-[#EEE4DA] rounded-2xl border border-[#C8A49F]/30 relative group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[#5e5460] font-medium">Height & Heels</span>
                    <Edit3 className="w-3 h-3 text-[#4D0E13]" />
                  </div>
                  {editingField === 'height' ? (
                    <div className="flex gap-2 mt-1">
                      <input
                        type="text"
                        value={tempValue}
                        onChange={(e) => setTempValue(e.target.value)}
                        className="flex-1 px-2 py-1 rounded-lg border border-[#4D0E13] bg-white text-xs font-mono"
                        autoFocus
                      />
                      <button onClick={() => handleSaveField('height')} className="px-2.5 py-1 bg-[#4D0E13] text-white rounded-lg font-bold">Save</button>
                    </div>
                  ) : (
                    <strong 
                      onClick={() => handleStartEditing('height', height)}
                      className="text-sm font-mono text-[#2D1517] cursor-pointer hover:text-[#4D0E13] block"
                      title="Tap to edit"
                    >
                      {height} ✎
                    </strong>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* REFERRAL TAB (Refer-a-Friend Module) */}
          {activeTab === 'referral' && (
            <div className="space-y-4 text-xs">
              <div className="p-5 rounded-3xl bg-gradient-to-r from-[#EEE4DA] via-[#E4D8CC] to-[#EEE4DA] border border-[#C8A49F]/50 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#4D0E13] text-white flex items-center justify-center mx-auto shadow-md">
                  <Gift className="w-6 h-6 text-[#C8A49F]" />
                </div>
                <h4 className="font-serif text-lg font-bold text-[#2D1517]">
                  Give ₹500, Get ₹500 Rental Credits
                </h4>
                <p className="text-xs text-[#5e5460] max-w-md mx-auto">
                  Share your personal RENTORA VIP invite link with friends. When they rent their first designer outfit, they get ₹500 off, and you receive ₹500 rental credits automatically!
                </p>

                {/* Referral Link Box */}
                <div className="flex items-center gap-2 max-w-md mx-auto bg-white p-2 rounded-2xl border border-[#C8A49F]/60 shadow-xs">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="flex-1 bg-transparent px-2 text-xs font-mono text-[#4D0E13] outline-none"
                  />
                  <button
                    onClick={handleCopyReferral}
                    className="px-4 py-2 rounded-xl bg-[#4D0E13] text-white font-bold hover:bg-[#3b172a] transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>

                {/* Social Share Buttons */}
                <div className="flex justify-center gap-3 pt-2">
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`Hey! Join RENTORA — India's premier luxury fashion rental club. Use my invite link to get ₹500 off your first rental: ${referralLink}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold flex items-center gap-1.5 hover:bg-emerald-700 transition-all shadow-xs"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share via WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Referral Stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-4 bg-[#EEE4DA] rounded-2xl border border-[#C8A49F]/30 text-center">
                  <Users className="w-5 h-5 text-[#4D0E13] mx-auto mb-1" />
                  <span className="text-[#5e5460] block font-medium">Friends Referred</span>
                  <strong className="text-lg font-serif font-bold text-[#4D0E13]">2 Friends</strong>
                </div>
                <div className="p-4 bg-[#EEE4DA] rounded-2xl border border-[#C8A49F]/30 text-center">
                  <Award className="w-5 h-5 text-[#4D0E13] mx-auto mb-1" />
                  <span className="text-[#5e5460] block font-medium">Credits Earned</span>
                  <strong className="text-lg font-serif font-bold text-emerald-700">₹1,000</strong>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Dedicated Edit Profile Modal */}
        {isEditProfileModalOpen && (
          <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#C8A49F] text-xs text-[#2D1517] space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#C8A49F]/30 pb-3">
                <h4 className="font-serif text-base font-bold text-[#4D0E13] flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4 text-[#C8A49F]" />
                  Edit Profile Details
                </h4>
                <button
                  onClick={() => setIsEditProfileModalOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-full cursor-pointer text-[#2D1517]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {profileFormError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px]">
                  {profileFormError}
                </div>
              )}

              <form onSubmit={handleSaveProfileForm} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#4D0E13] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#C8A49F] bg-white text-xs text-[#2D1517] focus:outline-none focus:border-[#4D0E13]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#4D0E13] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 rounded-xl border border-[#C8A49F] bg-white text-xs text-[#2D1517] focus:outline-none focus:border-[#4D0E13]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#4D0E13] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 rounded-xl border border-[#C8A49F] bg-white text-xs text-[#2D1517] focus:outline-none focus:border-[#4D0E13]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditProfileModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 font-semibold cursor-pointer hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#4D0E13] text-white font-bold cursor-pointer hover:bg-[#3b172a] shadow-xs"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Dedicated Edit Address Modal (Strictly Gujarat Only) */}
        {isEditAddressModalOpen && (
          <div className="fixed inset-0 z-60 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#C8A49F] text-xs text-[#2D1517] space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-[#C8A49F]/30 pb-3">
                <h4 className="font-serif text-base font-bold text-[#4D0E13] flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#C8A49F]" />
                  Edit Delivery Address (Gujarat, India)
                </h4>
                <button
                  onClick={() => setIsEditAddressModalOpen(false)}
                  className="p-1.5 hover:bg-gray-100 rounded-full cursor-pointer text-[#2D1517]"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-2.5 rounded-xl bg-[#EEE4DA] border border-[#C8A49F]/40 text-[11px] text-[#4D0E13]">
                📍 <strong>Gujarat Service Area:</strong> Doorstep couture fitting, delivery, and pickup are active across Gujarat.
              </div>

              {addressFormError && (
                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px]">
                  {addressFormError}
                </div>
              )}

              <form onSubmit={handleSaveAddressForm} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#4D0E13] mb-1">
                    Street Address & House / Flat / Society *
                  </label>
                  <textarea
                    rows={2}
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    required
                    placeholder="e.g. Flat 402, Royal Orchid Enclave, Bodakdev"
                    className="w-full px-3 py-2 rounded-xl border border-[#C8A49F] bg-white text-xs text-[#2D1517] focus:outline-none focus:border-[#4D0E13]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#4D0E13] mb-1">
                      City in Gujarat *
                    </label>
                    <select
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-[#C8A49F] bg-white text-xs text-[#2D1517] focus:outline-none focus:border-[#4D0E13]"
                    >
                      {GUJARAT_CITIES.map((city) => (
                        <option key={city.name} value={city.name}>
                          {city.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#4D0E13] mb-1">
                      State / Region
                    </label>
                    <input
                      type="text"
                      disabled
                      value="Gujarat, India"
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-100 text-xs text-gray-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#4D0E13] mb-1">
                    PIN Code (6 Digits) *
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={editPincode}
                    onChange={(e) => setEditPincode(e.target.value.replace(/\D/g, ''))}
                    required
                    placeholder="e.g. 380054"
                    className="w-full px-3 py-2 rounded-xl border border-[#C8A49F] bg-white text-xs text-[#2D1517] focus:outline-none focus:border-[#4D0E13]"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditAddressModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-gray-300 text-gray-700 font-semibold cursor-pointer hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#4D0E13] text-white font-bold cursor-pointer hover:bg-[#3b172a] shadow-xs"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
