import React, { useState } from 'react';
import { 
  Heart, 
  ShoppingBag, 
  User, 
  Sparkles, 
  Search, 
  Menu, 
  X, 
  ArrowRight, 
  LogIn, 
  LogOut, 
  UserPlus, 
  Bell, 
  MapPin, 
  ChevronDown 
} from 'lucide-react';
import { UserProfile } from '../types';
import { useNotifications } from '../context/NotificationContext';
import { useLocation } from '../context/LocationContext';
import { NotificationIcon } from './NotificationIcon';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenAccount: () => void;
  onOpenReniChat: () => void;
  onOpenQuiz?: () => void;
  onOpenNotifications?: () => void;
  onOpenLocation?: () => void;
  currentUser?: UserProfile | null;
  onOpenAuth: (mode?: 'signin' | 'signup') => void;
  onLogout?: () => void;
  onOpenImageManager?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  cartTotal,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenAccount,
  onOpenReniChat,
  onOpenQuiz,
  onOpenNotifications,
  onOpenLocation,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenImageManager,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);

  const { unreadCount, connectionStatus, setIsNotificationOpen } = useNotifications();
  const { shortLocation, formattedLocation, setIsSelectorOpen } = useLocation();

  const handleOpenNotifs = () => {
    if (onOpenNotifications) {
      onOpenNotifications();
    } else {
      setIsNotificationOpen(true);
    }
  };

  const handleOpenLocation = () => {
    if (onOpenLocation) {
      onOpenLocation();
    } else {
      setIsSelectorOpen(true);
    }
  };

  const handleSignOutClick = () => {
    if (onLogout) {
      onLogout();
    }
    setShowSignOutConfirm(false);
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'lookbook', label: 'Lookbook ✨' },
    { id: 'her', label: 'For Her' },
    { id: 'him', label: 'For Him' },
    { id: 'occasions', label: 'Occasions' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'builder', label: 'Outfit Builder' },
    { id: 'edit', label: 'The Edit' },
  ];

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    if (id === 'her' || id === 'him' || id === 'accessories') {
      const elem = document.getElementById('collections');
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      const elem = document.getElementById(id);
      if (elem) {
        elem.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const userFirstName = currentUser?.fullName ? currentUser.fullName.split(' ')[0] : 'Renter';
  const userInitials = currentUser?.fullName
    ? currentUser.fullName.split(' ').length >= 2
      ? `${currentUser.fullName.split(' ')[0][0]}${currentUser.fullName.split(' ')[1][0]}`.toUpperCase()
      : currentUser.fullName.slice(0, 2).toUpperCase()
    : 'AV';

  return (
    <header className="sticky top-0 z-40 bg-[#EEE4DA]/95 backdrop-blur-md border-b border-[#C8A49F]/30 transition-shadow duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-2 sm:gap-4">
          
          {/* Zone 1: Official Brand Logo */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center text-left group cursor-pointer focus:outline-none py-1"
              aria-label="RENTORA — Rent • Wear • Repeat"
            >
              <img
                src="/assets/aistudio/rentora-logo_359e5dd0.png"
                alt="RENTORA — Rent • Wear • Repeat"
                className="h-10 sm:h-14 lg:h-16 w-auto object-contain transition-transform duration-200 group-hover:scale-105 drop-shadow-xs"
              />
            </button>
          </div>

          {/* Zone 2: Navigation Links (Visible on large screens) */}
          <nav className="hidden xl:flex items-center gap-5 text-sm font-medium text-[#2D1517]">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative py-1 whitespace-nowrap transition-colors cursor-pointer hover:text-[#4D0E13] ${
                    isActive ? 'text-[#4D0E13] font-bold' : 'text-[#5e5460]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#4D0E13] rounded-full" />
                  )}
                </button>
              );
            })}

          </nav>

          {/* Zone 3: Actions (Search, Notifications, Wishlist, Cart, Location, Account/Auth, Mobile Menu) */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">


            {/* Mobile Location Quick Badge */}
            <button
              onClick={handleOpenLocation}
              className="md:hidden flex items-center gap-1 px-2 py-1 rounded-full bg-white/90 border border-[#C8A49F]/50 text-[#4D0E13] text-[10px] sm:text-[11px] font-bold truncate max-w-[85px] sm:max-w-[110px]"
              title="Change location"
            >
              <MapPin className="w-3 h-3 text-[#4D0E13] shrink-0" />
              <span className="truncate">{shortLocation.split(',')[0]}</span>
            </button>

            {/* Real-Time Notifications Icon */}
            <button
              onClick={handleOpenNotifs}
              aria-label="Real-time notifications"
              title="Real-time notifications"
              className="relative p-2 text-[#5e5460] hover:text-[#4D0E13] hover:bg-[#C8A49F]/15 rounded-full transition-colors cursor-pointer group"
            >
              <NotificationIcon gender={currentUser?.gender} className="w-5 h-5 group-hover:scale-105 transition-transform text-[#4D0E13]" />
              {connectionStatus === 'connected' && (
                <span
                  className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-500 border border-white"
                  title="Connected to live server feed"
                />
              )}
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 bg-[#4D0E13] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce shadow-xs">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Wishlist */}
            <button
              onClick={onOpenWishlist}
              aria-label="Wishlist"
              className="relative p-2 text-[#5e5460] hover:text-[#4D0E13] hover:bg-[#C8A49F]/15 rounded-full transition-colors cursor-pointer"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#4D0E13] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>



            {/* Cart Button */}
            <button
              onClick={onOpenCart}
              aria-label="Rental Cart"
              className="flex items-center gap-2 p-2 sm:px-3 sm:py-2 text-[#4D0E13] bg-[#C8A49F]/20 hover:bg-[#C8A49F]/30 rounded-full transition-colors cursor-pointer font-medium"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#4D0E13] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </div>
              {cartCount > 0 && (
                <span className="hidden sm:inline text-xs font-semibold tabular-nums text-[#4D0E13]">
                  ₹{cartTotal.toLocaleString()}
                </span>
              )}
            </button>

            {/* Authentication States: Signed In vs Signed Out */}
            {currentUser ? (
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Desktop Location Selector */}
                <button
                  onClick={handleOpenLocation}
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#C8A49F]/50 text-[#4D0E13] text-xs font-semibold hover:border-[#4D0E13] transition-all cursor-pointer shadow-xs"
                  title="Change location"
                >
                  <MapPin className="w-3.5 h-3.5 text-[#4D0E13] shrink-0" />
                  <span className="truncate max-w-[100px]">{shortLocation.split(',')[0]}</span>
                </button>
                {/* Account Dashboard Button */}
                <button
                  onClick={onOpenAccount}
                  aria-label="Account Profile"
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-white border border-[#C8A49F] hover:border-[#4D0E13] transition-all cursor-pointer shadow-xs group"
                  title="View Account & Rentals"
                >
                  <div className="w-6 h-6 rounded-full bg-[#4D0E13] text-white flex items-center justify-center text-[10px] font-serif font-bold group-hover:scale-105 transition-transform">
                    {userInitials}
                  </div>
                  <span className="hidden sm:inline text-xs font-semibold text-[#4D0E13] max-w-[80px] truncate">
                    {userFirstName}
                  </span>
                </button>

                {/* Direct Sign Out Action (with confirmation dropdown/tooltip) */}
                <div className="relative hidden sm:block">
                  <button
                    onClick={() => setShowSignOutConfirm(!showSignOutConfirm)}
                    className="p-2 text-[#5e5460] hover:text-[#4D0E13] hover:bg-[#C8A49F]/15 rounded-full transition-colors cursor-pointer"
                    title="Sign Out"
                    aria-label="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>

                  {showSignOutConfirm && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#C8A49F]/50 p-3 z-50 animate-fadeIn text-xs">
                      <p className="font-semibold text-[#2D1517] mb-2 leading-tight">
                        Sign out of {currentUser.fullName}?
                      </p>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleSignOutClick}
                          className="flex-1 py-1 px-2.5 bg-[#4D0E13] text-white rounded-lg font-bold text-[11px] hover:bg-[#6A1A21] cursor-pointer"
                        >
                          Sign Out
                        </button>
                        <button
                          onClick={() => setShowSignOutConfirm(false)}
                          className="py-1 px-2 text-[#5e5460] hover:text-[#2D1517] text-[11px] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              /* Signed Out State: Single unified Sign In button */
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => onOpenAuth('signin')}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#4D0E13] text-white text-xs font-semibold hover:bg-[#6A1A21] shadow-xs hover:shadow-md transition-all cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5 text-[#C8A49F]" />
                  <span>Sign In</span>
                </button>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#4D0E13] hover:bg-[#C8A49F]/15 rounded-md"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Quick Navigation Strip (Mobile / Tablet) */}
      <div className="xl:hidden border-t border-[#C8A49F]/25 bg-[#EEE4DA]/95 px-3 py-2 overflow-x-auto scrollbar-none shadow-xs">
        <nav className="flex items-center gap-2 sm:gap-3 text-xs font-semibold text-[#2D1517] whitespace-nowrap min-w-max mx-auto justify-start sm:justify-center">
          {navLinks.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`px-3 py-1 rounded-full transition-colors cursor-pointer shrink-0 ${
                  isActive
                    ? 'bg-[#4D0E13] text-white shadow-xs'
                    : 'text-[#5e5460] hover:text-[#4D0E13] hover:bg-[#C8A49F]/20'
                }`}
              >
                {link.label}
              </button>
            );
          })}
          {onOpenQuiz && (
            <button
              onClick={onOpenQuiz}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full bg-[#C8A49F]/25 text-[#4D0E13] border border-[#C8A49F]/40 hover:bg-[#C8A49F]/40 shrink-0 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3 h-3 text-[#4D0E13]" />
              <span>Style Persona Quiz ✨</span>
            </button>
          )}
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#EEE4DA] border-b border-[#C8A49F]/30 px-6 py-5 shadow-lg animate-fadeIn">
          <nav className="flex flex-col gap-3">

            {/* Mobile Location Selector Card */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleOpenLocation();
              }}
              className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-[#C8A49F]/60 text-xs text-left shadow-xs cursor-pointer group hover:border-[#4D0E13]"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#4D0E13] text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-[#C8A49F]" />
                </div>
                <div>
                  <div className="text-[10px] text-[#5e5460] uppercase tracking-wider font-semibold">Delivery Location</div>
                  <div className="font-bold text-[#4D0E13] text-xs truncate max-w-[210px]">{formattedLocation}</div>
                </div>
              </div>
              <span className="text-xs font-bold text-[#4D0E13] underline shrink-0">Change</span>
            </button>

            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-left py-2 text-base font-medium transition-colors ${
                  activeTab === link.id ? 'text-[#4D0E13] font-bold' : 'text-[#5e5460]'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-3 border-t border-[#C8A49F]/30 flex flex-col gap-2">
              {onOpenQuiz && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenQuiz();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white text-[#4D0E13] border border-[#C8A49F] font-semibold text-sm shadow-xs"
                >
                  <Sparkles className="w-4 h-4 text-[#4D0E13]" />
                  <span>Style Persona Quiz ✨</span>
                </button>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenReniChat();
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#4D0E13] text-white font-medium text-sm shadow-md"
              >
                <Sparkles className="w-4 h-4 text-[#C8A49F]" />
                <span>Chat with RÉNÉ ✨ AI Stylist</span>
              </button>

              {/* Notifications Button */}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleOpenNotifs();
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-white text-[#4D0E13] border border-[#C8A49F] font-semibold text-xs shadow-xs"
              >
                <div className="flex items-center gap-2">
                  <NotificationIcon gender={currentUser?.gender} className="w-4 h-4 text-[#4D0E13]" />
                  <span>Real-Time Notifications</span>
                </div>
                {unreadCount > 0 ? (
                  <span className="bg-[#4D0E13] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                ) : (
                  <span className="text-[10px] text-emerald-700 font-medium">Live</span>
                )}
              </button>

              {onOpenQuiz && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenQuiz();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-[#4D0E13] border border-[#C8A49F] font-semibold text-xs shadow-xs"
                >
                  <span>🎀</span>
                  <span>Take Style Persona Quiz</span>
                </button>
              )}

              {/* User Account / Sign In / Sign Out */}
              {currentUser ? (
                <div className="space-y-2 pt-1">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAccount();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-[#4D0E13] border border-[#C8A49F]/60 font-semibold text-xs shadow-xs"
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>My Account & Rentals ({currentUser.fullName.split(' ')[0]})</span>
                  </button>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleSignOutClick();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#4D0E13]/10 text-[#4D0E13] border border-[#4D0E13]/20 font-semibold text-xs hover:bg-[#4D0E13]/20 cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="pt-1">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAuth('signin');
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#4D0E13] text-white font-semibold text-xs shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-[#C8A49F]" />
                    <span>Sign In</span>
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
