import React, { useState, useEffect } from 'react';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MoodSelector } from './components/MoodSelector';
import { AestheticSection } from './components/AestheticSection';
import { OccasionSection } from './components/OccasionSection';
import { MeetReniSection } from './components/MeetReniSection';
import { OutfitBuilderSection } from './components/OutfitBuilderSection';
import { ProductGrid } from './components/ProductGrid';
import { FreeGiftBanner } from './components/FreeGiftBanner';
import { TheRentoraEdit } from './components/TheRentoraEdit';
import { RentalHowItWorks } from './components/RentalHowItWorks';
import { StyleFaq } from './components/StyleFaq';
import { Footer } from './components/Footer';
import { ReniChatbot } from './components/ReniChatbot';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CompleteLookModal } from './components/CompleteLookModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { AccountModal } from './components/AccountModal';
import { StylePersonaQuiz } from './components/StylePersonaQuiz';
import { AuthPage } from './components/AuthPage';
import { SeasonalLookbook } from './components/SeasonalLookbook';
import { StylistsPicksCarousel } from './components/StylistsPicksCarousel';
import { MaisonRentoraSection } from './components/MaisonRentoraSection';
import { Sparkles, CheckCircle2, X } from 'lucide-react';
import { NotificationProvider, useNotifications } from './context/NotificationContext';
import { LocationProvider, useLocation } from './context/LocationContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ImageManagerProvider, useImageManager } from './context/ImageManagerContext';
import { ImageManagerModal } from './components/ImageManagerModal';
import { NotificationCenter } from './components/NotificationCenter';
import { NotificationToastContainer } from './components/NotificationToastContainer';
import { LocationSelectorModal } from './components/LocationSelectorModal';
import { useScrollSpy } from './hooks/useScrollSpy';

import { Product, PRODUCTS, FREE_GIFT_PROMOTION } from './data/catalog';
import { DEFAULT_LOCATION } from './data/locations';
import { CartItem, Order, UserProfile } from './types';

const SECTION_IDS = ['home', 'lookbook', 'collections', 'occasions', 'builder', 'edit'];

function RentoraApp() {
  const { isNotificationOpen, setIsNotificationOpen, notifyUser } = useNotifications();
  const { currentUser, signOut, updateProfile, isAuthenticated, isLoading } = useAuth();
  const { isSelectorOpen, setIsSelectorOpen, setLocation } = useLocation();
  const { isManagerOpen, setIsManagerOpen } = useImageManager();

  const [signOutNotice, setSignOutNotice] = useState<string | null>(null);

  // Navigation & Filter states with sessionStorage persistence
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'her' | 'him' | 'accessory'>('all');
  const activeSection = useScrollSpy(SECTION_IDS);

  useEffect(() => {
    if (activeSection) {
      if (activeSection === 'collections') {
        if (selectedCategory === 'her') setActiveTab('her');
        else if (selectedCategory === 'him') setActiveTab('him');
        else if (selectedCategory === 'accessory') setActiveTab('accessories');
        else setActiveTab('collections');
      } else {
        setActiveTab(activeSection);
      }
    }
  }, [activeSection, selectedCategory]);

  const handleSelectCategory = (cat: 'all' | 'her' | 'him' | 'accessory') => {
    setSelectedCategory(cat);
    const navTab = cat === 'her' ? 'her' : cat === 'him' ? 'him' : cat === 'accessory' ? 'accessories' : 'collections';
    setActiveTab(navTab);
    const elem = document.getElementById('collections');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };
  const [accountModalTab, setAccountModalTab] = useState<'profile' | 'orders' | 'sizing' | 'referral'>('profile');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [selectedAesthetics, setSelectedAesthetics] = useState<string[]>([]);

  // Persist filter preferences in sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem('rentora_category_filter', activeTab);
    } catch (e) {
      console.warn('sessionStorage not available', e);
    }
  }, [activeTab]);

  useEffect(() => {
    try {
      if (selectedOccasion) {
        sessionStorage.setItem('rentora_occasion_filter', selectedOccasion);
      } else {
        sessionStorage.removeItem('rentora_occasion_filter');
      }
    } catch (e) {
      console.warn('sessionStorage not available', e);
    }
  }, [selectedOccasion]);

  // Cart & Wishlist state (Start empty for fresh user experience)
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Modal visibility states
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [isReniChatOpen, setIsReniChatOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [completeLookProduct, setCompleteLookProduct] = useState<Product | null>(null);

  // Toast notification for persona / auth updates
  const [personaToast, setPersonaToast] = useState<{
    visible: boolean;
    title: string;
    aesthetics: string[];
  } | null>(null);

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = (user: UserProfile) => {
    setSignOutNotice(null);
    setIsAuthModalOpen(false);
    if (activeTab === 'auth') {
      setActiveTab('home');
    }
    if (user.preferredAesthetics && user.preferredAesthetics.length > 0) {
      setSelectedAesthetics(user.preferredAesthetics);
    } else {
      setSelectedAesthetics([]);
    }
    if (user.preferredLocation && user.preferredLocation.city) {
      setLocation(user.preferredLocation);
    } else {
      setLocation(DEFAULT_LOCATION);
      try {
        localStorage.removeItem('rentora_selected_location');
      } catch {}
    }
    setSelectedOccasion(null);
    setSelectedMood(null);
    setSearchQuery('');

    setPersonaToast({
      visible: true,
      title: `Welcome, ${user.fullName.split(' ')[0]}! 🎀`,
      aesthetics: user.preferredAesthetics || selectedAesthetics,
    });
    setTimeout(() => {
      setPersonaToast((prev) => (prev ? { ...prev, visible: false } : null));
    }, 5000);

    notifyUser({
      type: 'promo',
      category: 'promo',
      title: `Welcome to RENTORA, ${user.fullName.split(' ')[0]}! 🎀`,
      message: 'Your personal luxury wardrobe is active. Complimentary doorstep delivery & damage waiver enabled.',
      actionUrl: '#collections',
      actionLabel: 'Explore Collections',
    });
  };

  const handleLogout = async () => {
    try {
      await signOut();
      sessionStorage.clear();
      setIsAccountOpen(false);
      setIsCartOpen(false);
      setIsCheckoutOpen(false);
      setIsWishlistOpen(false);
      setIsReniChatOpen(false);
      setDetailProduct(null);
      setCompleteLookProduct(null);
      setActiveTab('home');
      setSignOutNotice("You've signed out successfully! 💗 Sign in again to continue with RENTORA.");
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Auto pop-up Style Persona Quiz for first-time visitors
  useEffect(() => {
    try {
      const hasSeenQuiz = localStorage.getItem('rentora_quiz_seen');
      if (!hasSeenQuiz) {
        const timer = setTimeout(() => {
          setIsQuizOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // In case localStorage is restricted
    }
  }, []);

  const handleQuizComplete = (assignedAesthetics: string[], personaTitle: string) => {
    setSelectedAesthetics(assignedAesthetics);
    try {
      localStorage.setItem('rentora_quiz_seen', 'true');
      localStorage.setItem('rentora_persona', personaTitle);
    } catch {
      // Silently ignore if localStorage is restricted
    }

    setPersonaToast({
      visible: true,
      title: personaTitle,
      aesthetics: assignedAesthetics,
    });

    if (currentUser) {
      notifyUser({
        type: 'stylist_tip',
        category: 'stylist',
        title: `Style Persona Calibrated: ${personaTitle} 🎀`,
        message: `RÉNÉ has calibrated your private showroom with curated edits for: ${assignedAesthetics.join(', ')}.`,
        actionUrl: '#collections',
        actionLabel: 'Explore Curations',
      });
    }

    // Auto dismiss toast after 6s
    setTimeout(() => {
      setPersonaToast((prev) => (prev ? { ...prev, visible: false } : null));
    }, 6000);

    // Smoothly scroll down to the collections so user sees their tailored catalog
    setTimeout(() => {
      const elem = document.getElementById('collections');
      if (elem) elem.scrollIntoView({ behavior: 'smooth' });
    }, 350);
  };

  const handleNotificationNavigate = (url: string) => {
    setIsNotificationOpen(false);
    if (url === '#orders') {
      setAccountModalTab('orders');
      setIsAccountOpen(true);
      return;
    }
    if (url === '#reni') {
      setIsReniChatOpen(true);
      return;
    }
    if (url === '#her') {
      setActiveTab('her');
      setTimeout(() => {
        document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return;
    }
    if (url === '#him') {
      setActiveTab('him');
      setTimeout(() => {
        document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return;
    }
    if (url === '#accessories') {
      setActiveTab('accessories');
      setTimeout(() => {
        document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return;
    }
    if (url === '#builder') {
      document.getElementById('builder')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (url === '#lookbook') {
      document.getElementById('lookbook')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (url === '#edit') {
      document.getElementById('edit')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    if (url === '#occasions') {
      document.getElementById('occasions')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    const targetId = url.replace('#', '');
    const elem = document.getElementById(targetId);
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  // Cart Calculations
  const cartMerchandiseSubtotal = cartItems.reduce((acc, item) => acc + item.itemTotal, 0);

  // Cart Handlers
  const handleAddToCart = (item: CartItem, silent?: boolean) => {
    setCartItems((prev) => [...prev, item]);
    setIsCartOpen(true);
    if (currentUser && !silent) {
      notifyUser({
        type: 'live_rental',
        category: 'orders',
        title: 'Added to Fitting Bag 🛍️',
        message: `"${item.product.name}" (Size ${item.selectedSize}) added for ${item.rentalDurationDays} days.`,
        actionUrl: '#cart',
        actionLabel: 'Review Bag',
      });
    }
  };

  const handleAddBundleToCart = (items: CartItem[]) => {
    setCartItems((prev) => [...prev, ...items]);
    setIsCartOpen(true);
    if (currentUser) {
      notifyUser({
        type: 'live_rental',
        category: 'orders',
        title: 'Styled Look Added ✨',
        message: `${items.length} coordinated pieces added to your fitting bag from Outfit Builder.`,
        actionUrl: '#cart',
        actionLabel: 'Review Bag',
      });
    }
  };

  const handleRemoveCartItem = (id: string) => {
    const itemToRemove = cartItems.find((item) => item.id === id);
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    if (currentUser && itemToRemove) {
      notifyUser({
        type: 'live_rental',
        category: 'orders',
        title: 'Item Removed from Bag',
        message: `"${itemToRemove.product.name}" was removed from your fitting bag.`,
      });
    }
  };

  const handleUpdateDuration = (id: string, days: number) => {
    const targetItem = cartItems.find((item) => item.id === id);
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const factor = days === 3 ? 0.85 : days === 7 ? 1.5 : 1;
          const newPrice = Math.round(item.product.rentalPrice4Days * factor);
          return {
            ...item,
            rentalDurationDays: days,
            itemTotal: newPrice,
          };
        }
        return item;
      })
    );
    if (currentUser && targetItem) {
      notifyUser({
        type: 'live_rental',
        category: 'orders',
        title: 'Rental Window Adjusted ⏱️',
        message: `"${targetItem.product.name}" updated to a ${days}-day rental window.`,
      });
    }
  };

  // Wishlist Handlers
  const handleToggleWishlist = (product: Product) => {
    if (wishlist.some((p) => p.id === product.id)) {
      setWishlist((prev) => prev.filter((p) => p.id !== product.id));
      if (currentUser) {
        notifyUser({
          type: 'stylist_tip',
          category: 'stylist',
          title: 'Wishlist Updated',
          message: `"${product.name}" removed from your private wishlist.`,
        });
      }
    } else {
      setWishlist((prev) => [...prev, product]);
      if (currentUser) {
        notifyUser({
          type: 'stylist_tip',
          category: 'stylist',
          title: 'Saved to Wishlist ✨',
          message: `"${product.name}" saved to your personal luxury wishlist.`,
          actionUrl: '#collections',
          actionLabel: 'View Wishlist',
        });
      }
    }
  };

  const isWishlisted = (id: string) => wishlist.some((p) => p.id === id);

  // Aesthetic handlers
  const handleToggleAesthetic = (id: string) => {
    if (selectedAesthetics.includes(id)) {
      setSelectedAesthetics(selectedAesthetics.filter((a) => a !== id));
    } else {
      setSelectedAesthetics([...selectedAesthetics, id]);
    }
  };

  const handleClearAesthetics = () => {
    setSelectedAesthetics([]);
  };

  // Occasion selection handler
  const handleSelectOccasion = (id: string | null) => {
    setSelectedOccasion(id);
  };

  const handleViewOccasionCollection = (id: string) => {
    setSelectedOccasion(id);
    const elem = document.getElementById('collections');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOrderComplete = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]); // Clear cart upon successful order
    if (currentUser) {
      notifyUser({
        type: 'order_status',
        category: 'orders',
        title: `Order #${newOrder.id} Confirmed! 🎉`,
        message: `Your luxury rental for ${newOrder.items.length} item(s) has been reserved for delivery to ${newOrder.deliveryDetails.city}.`,
        actionUrl: '#orders',
        actionLabel: 'Track Delivery',
        metadata: {
          orderId: newOrder.id,
          status: 'Confirmed',
        },
      });
    }
  };

  // Requirement: Session check on page load with elegant branded splash screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF6F0] flex flex-col items-center justify-center p-4">
        <img
          src="/assets/aistudio/rentora-logo_359e5dd0.png"
          alt="RENTORA"
          className="h-14 sm:h-16 w-auto object-contain mb-4 animate-pulse filter brightness-105"
        />
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-[#D99BAE]/60 shadow-xs text-xs font-semibold text-[#54243E]">
          <div className="w-3.5 h-3.5 border-2 border-[#54243E] border-t-transparent rounded-full animate-spin" />
          <span>Authenticating your luxury closet...</span>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#EEE4DA] text-[#2D1517] flex flex-col font-sans selection:bg-[#C8A49F]/30 selection:text-[#4D0E13]">
      
      {/* 1. Announcement Bar */}
      <AnnouncementBar onOpenGiftPromo={() => {
        const elem = document.getElementById('free-gift-promo');
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }} />

      {/* 2. Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'her') {
            handleSelectCategory('her');
          } else if (tab === 'him') {
            handleSelectCategory('him');
          } else if (tab === 'accessories' || tab === 'accessory') {
            handleSelectCategory('accessory');
          } else if (tab === 'collections' || tab === 'all') {
            handleSelectCategory('all');
          } else {
            setActiveTab(tab);
            const elem = document.getElementById(tab);
            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
            else if (tab === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        cartCount={cartItems.length}
        cartTotal={cartMerchandiseSubtotal}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenReniChat={() => setIsReniChatOpen(true)}
        onOpenQuiz={() => setIsQuizOpen(true)}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        currentUser={currentUser}
        onOpenAuth={(mode) => handleOpenAuth(mode || 'signin')}
        onLogout={handleLogout}
        onOpenLocation={() => setIsSelectorOpen(true)}
        onOpenImageManager={() => setIsManagerOpen(true)}
      />

      {/* Conditional Full-Page View for Auth or Normal Landing Experience */}
      {activeTab === 'auth' ? (
        <div className="min-h-screen bg-gradient-to-br from-[#EEE4DA] via-[#EEE4DA] to-[#D8C4AC] flex flex-col">
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 flex items-center justify-between border-b border-[#C8A49F]/30">
            <button
              onClick={() => setActiveTab('home')}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#4D0E13] hover:underline cursor-pointer bg-white px-4 py-2 rounded-full border border-[#C8A49F]/40 shadow-xs"
            >
              <span>← Back to RENTORA Store</span>
            </button>
            <div className="inline-flex items-center gap-1.5 text-xs text-[#4D0E13] font-medium">
              <span>🎀</span>
              <span>Exclusive Member Privileges</span>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
            <AuthPage
              isModal={false}
              initialMode="signin"
              onSuccess={handleAuthSuccess}
            />
          </div>
        </div>
      ) : (
        <main key="store-landing-page" className="flex-1">
          {/* 3. Hero Section */}
          <div id="home">
            <Hero
              onExploreCollections={() => handleSelectCategory('all')}
              onSelectCategory={(cat) => handleSelectCategory(cat === 'accessory' ? 'accessory' : cat)}
              onMeetReni={() => {
                setIsReniChatOpen(true);
              }}
              onTakeQuiz={() => setIsQuizOpen(true)}
              onOpenGiftPromo={() => {
                const elem = document.getElementById('free-gift-promo');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
              }}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onOpenProductDetail={(prod) => setDetailProduct(prod)}
            />
          </div>

      {/* 4. Today's Mood Selector */}
      <MoodSelector
        selectedMood={selectedMood}
        onSelectMood={(moodId) => {
          setSelectedMood(moodId);
          if (!moodId) {
            setSelectedAesthetics([]);
          }
        }}
        onAddToCart={handleAddToCart}
        onOpenProductDetail={(prod) => setDetailProduct(prod)}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={isWishlisted}
        onOpenReniChatForMood={() => setIsReniChatOpen(true)}
      />

      {/* 4.5. RÉNÉ's Stylist Picks Carousel */}
      <StylistsPicksCarousel
        onAddToCart={handleAddToCart}
        onOpenProductDetail={(prod) => setDetailProduct(prod)}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={isWishlisted}
      />

      {/* 4.8. High-Fashion Editorial Parisian Section (Inspired by Maison Reference) */}
      <MaisonRentoraSection
        onExploreCollections={() => handleSelectCategory('all')}
      />

      {/* 5. Free Gift Promotional Banner with Live Progress */}
      <div id="free-gift-promo">
        <FreeGiftBanner
          currentCartTotal={cartMerchandiseSubtotal}
          onExploreGiftEligibleOutfits={() => handleSelectCategory('all')}
        />
      </div>

      {/* 6. Occasion Discovery Section */}
      <div id="occasions">
        <OccasionSection
          selectedOccasion={selectedOccasion}
          onSelectOccasion={handleSelectOccasion}
          onViewOccasionCollection={handleViewOccasionCollection}
          onAddToCart={handleAddToCart}
          onOpenProductDetail={(prod) => setDetailProduct(prod)}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={isWishlisted}
        />
      </div>


      {/* 8. Meet RÉNÉ — Your RENTORA Style Bestie */}
      <MeetReniSection
        onOpenChat={() => setIsReniChatOpen(true)}
        onOpenOutfitBuilder={() => {
          const elem = document.getElementById('builder');
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        }}
        onTakeQuiz={() => setIsQuizOpen(true)}
      />

      {/* 9. AI-Powered Complete Outfit Builder */}
      <div id="builder">
        <OutfitBuilderSection
          onAddToCart={handleAddToCart}
          onAddBundleToCart={handleAddBundleToCart}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={isWishlisted}
          onOpenProductDetail={(prod) => setDetailProduct(prod)}
          onOpenCart={() => setIsCartOpen(true)}
        />
      </div>

      {/* 10. Curated Collections: For Her, For Him & Accessories */}
      <div id="collections">
        <ProductGrid
          activeCategory={selectedCategory}
          onCategoryChange={(cat) => {
            setSelectedCategory(cat);
            setActiveTab(cat === 'her' ? 'her' : cat === 'him' ? 'him' : cat === 'accessory' ? 'accessories' : 'collections');
          }}
          selectedOccasionFilter={selectedOccasion}
          selectedAestheticFilter={selectedAesthetics}
          searchQuery={searchQuery}
          onAddToCart={handleAddToCart}
          onOpenDetail={(prod) => setDetailProduct(prod)}
          onCompleteMyLook={(prod) => setCompleteLookProduct(prod)}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={isWishlisted}
        />
      </div>

      {/* 10.5. Seasonal Trend Lookbook with Hotspots */}
      <div id="lookbook">
        <SeasonalLookbook
          onAddToCart={handleAddToCart}
          onOpenProductDetail={(prod) => setDetailProduct(prod)}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={isWishlisted}
        />
      </div>

      {/* 11. The RENTORA Edit (Editorial Inspiration) */}
      <div id="edit">
        <TheRentoraEdit />
      </div>

      {/* 12. Rental Details & How It Works */}
      <RentalHowItWorks />

      {/* 12.5. Style FAQ */}
      <StyleFaq />

      {/* 13. Footer */}
      <Footer
        onNavClick={(tab) => {
          if (tab === 'her') handleSelectCategory('her');
          else if (tab === 'him') handleSelectCategory('him');
          else if (tab === 'accessories' || tab === 'accessory') handleSelectCategory('accessory');
          else {
            setActiveTab(tab);
            const elem = document.getElementById(tab === 'collections' ? 'collections' : tab);
            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onOpenReniChat={() => setIsReniChatOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />
        </main>
      )}

      {/* Floating & Interactive Reni Chatbot */}
      <ReniChatbot
        isOpen={isReniChatOpen}
        onClose={() => setIsReniChatOpen(false)}
        onOpen={() => setIsReniChatOpen(true)}
        onAddToCart={(item) => handleAddToCart(item, true)}
        onOpenProductDetail={(prod) => setDetailProduct(prod)}
        onOpenOutfitBuilder={() => {
          setIsReniChatOpen(false);
          const elem = document.getElementById('builder');
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        }}
        userOccasion={selectedOccasion}
        userAesthetics={selectedAesthetics}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onUpdateDuration={handleUpdateDuration}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        onOrderComplete={handleOrderComplete}
        currentUser={currentUser}
      />

      {/* Product Detail Modal */}
      {detailProduct && (
        <ProductDetailModal
          key={`detail-${detailProduct.id}`}
          product={detailProduct}
          onClose={() => setDetailProduct(null)}
          onAddToCart={handleAddToCart}
          onCompleteMyLook={(prod) => setCompleteLookProduct(prod)}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={isWishlisted(detailProduct.id)}
          onOpenProductDetail={(prod) => setDetailProduct(prod)}
        />
      )}

      {/* Complete My Look Coordinated Accessories Modal */}
      {completeLookProduct && (
        <CompleteLookModal
          key={`complete-${completeLookProduct.id}`}
          product={completeLookProduct}
          onClose={() => setCompleteLookProduct(null)}
          onAddBundleToCart={handleAddBundleToCart}
          onOpenProductDetail={(prod) => setDetailProduct(prod)}
        />
      )}

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlist}
        onRemoveWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onOpenProductDetail={(prod) => setDetailProduct(prod)}
      />

      {/* User Account & Rentals Modal */}
      <AccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        orders={orders}
        userAesthetics={selectedAesthetics}
        onToggleAesthetic={handleToggleAesthetic}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onUpdateUser={(updated) => updateProfile(updated)}
        initialTab={accountModalTab}
      />

      {/* Modal Sign In / Sign Up Form */}
      <AuthPage
        isModal={true}
        isOpen={isAuthModalOpen}
        initialMode={authModalMode}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
      />

      {/* Country, State, and City Location Selector Modal */}
      <LocationSelectorModal
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
      />

      {/* Interactive Style Persona Quiz Modal */}
      <StylePersonaQuiz
        isOpen={isQuizOpen}
        onClose={() => {
          setIsQuizOpen(false);
          try {
            localStorage.setItem('rentora_quiz_seen', 'true');
          } catch {}
        }}
        onComplete={handleQuizComplete}
        onOpenProductDetail={(prod) => setDetailProduct(prod)}
        onOpenReniChat={(prompt) => {
          setIsReniChatOpen(true);
        }}
        onOpenOutfitBuilder={() => {
          setIsQuizOpen(false);
          const elem = document.getElementById('builder');
          if (elem) elem.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Floating Style Persona Toast Notification */}
      {personaToast?.visible && (
        <div className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-[#C8A49F] animate-bounceIn flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#4D0E13] text-white flex items-center justify-center shrink-0 shadow-sm text-lg">
            🎀
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-[#4D0E13] tracking-wider">
                Style Persona Calibrated ✨
              </span>
              <button
                onClick={() => setPersonaToast((prev) => (prev ? { ...prev, visible: false } : null))}
                className="text-gray-400 hover:text-gray-600 cursor-pointer p-0.5"
                aria-label="Dismiss Notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <h4 className="font-serif text-sm font-bold text-[#2D1517] mt-0.5">
              {personaToast.title}
            </h4>
            <p className="text-[11px] text-[#5e5460] mt-1 leading-tight">
              Rental catalog, outfit builder, and RÉNÉ's recommendations are now tailored to your aesthetic!
            </p>
          </div>
        </div>
      )}

      {/* Real-time WebSocket Notification Center */}
      <NotificationCenter
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onNavigateTo={handleNotificationNavigate}
      />

      {/* Real-time Floating Notification Toasts */}
      <NotificationToastContainer
        onNavigateTo={handleNotificationNavigate}
      />

      {/* Central Image Manager Modal */}
      <ImageManagerModal
        isOpen={isManagerOpen}
        onClose={() => setIsManagerOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LocationProvider>
        <NotificationProvider>
          <ImageManagerProvider>
            <RentoraApp />
          </ImageManagerProvider>
        </NotificationProvider>
      </LocationProvider>
    </AuthProvider>
  );
}
