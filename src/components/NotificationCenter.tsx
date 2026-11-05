import React, { useState } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { AppNotification, NotificationCategory } from '../types';
import { NotificationIcon } from './NotificationIcon';
import { 
  X, 
  Bell, 
  Volume2, 
  VolumeX, 
  CheckCheck, 
  Trash2, 
  Truck, 
  Zap, 
  Sparkles, 
  ShoppingBag, 
  Gift, 
  ArrowRight,
  Radio, 
  RefreshCw,
  Send,
  PlayCircle
} from 'lucide-react';

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTo: (url: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  onNavigateTo,
}) => {
  const {
    notifications,
    unreadCount,
    activeConnections,
    connectionStatus,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    simulateEvent,
    soundEnabled,
    setSoundEnabled,
  } = useNotifications();
  const { currentUser } = useAuth();

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showSimulator, setShowSimulator] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  if (!isOpen) return null;

  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const diffMs = Date.now() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      return `${diffDays}d ago`;
    } catch {
      return 'Recently';
    }
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (activeCategory === 'all') return true;
    return notif.category === activeCategory;
  });

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'orders':
        return <Truck className="w-4 h-4 text-[#4D0E13]" />;
      case 'drops':
        return <Zap className="w-4 h-4 text-amber-600" />;
      case 'stylist':
        return <Sparkles className="w-4 h-4 text-pink-600" />;
      case 'community':
        return <ShoppingBag className="w-4 h-4 text-emerald-700" />;
      case 'promo':
        return <Gift className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-[#4D0E13]" />;
    }
  };

  const handleSimulate = async (scenario: string) => {
    setIsSimulating(true);
    await simulateEvent(scenario);
    setTimeout(() => setIsSimulating(false), 400);
  };

  const handleActionClick = (notif: AppNotification) => {
    markAsRead(notif.id);
    onClose();
    if (notif.actionUrl) {
      onNavigateTo(notif.actionUrl);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[#FFFBF8] h-full shadow-2xl flex flex-col border-l border-[#C8A49F]/30 animate-slideInRight"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#C8A49F]/30 bg-[#EEE4DA]/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#4D0E13] text-[#EEE4DA] flex items-center justify-center shadow-xs">
                <NotificationIcon gender={currentUser?.gender} className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-serif text-lg font-bold text-[#4D0E13]">
                    Notifications
                  </h3>
                  {unreadCount > 0 && (
                    <span className="bg-[#4D0E13] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {/* WebSocket Real-time live status indicator */}
                <div className="flex items-center gap-1.5 text-[11px] text-[#5e5460] mt-0.5">
                  <span className="relative flex h-2 w-2">
                    {connectionStatus === 'connected' ? (
                      <>
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                      </>
                    ) : (
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    )}
                  </span>
                  <span className="font-medium">
                    {connectionStatus === 'connected' ? (
                      <>
                        <span className="text-emerald-700 font-semibold">
                          {currentUser ? `Personalized for ${currentUser.fullName.split(' ')[0]}` : 'Live WS Connected'}
                        </span>
                        <span className="mx-1">•</span>
                        <span>{activeConnections} {activeConnections === 1 ? 'client' : 'clients'} active</span>
                      </>
                    ) : (
                      <span className="text-amber-700">Connecting to live feed...</span>
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Actions (Sound, Mark all read, Close) */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                title={soundEnabled ? 'Chime sound enabled (click to mute)' : 'Chime sound muted (click to enable)'}
                className="p-2 rounded-full hover:bg-[#C8A49F]/20 text-[#4D0E13] transition-colors cursor-pointer"
                aria-label="Toggle notification sound"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4 text-[#4D0E13]" /> : <VolumeX className="w-4 h-4 text-gray-400" />}
              </button>

              <button
                onClick={markAllAsRead}
                title="Mark all as read"
                className="p-2 rounded-full hover:bg-[#C8A49F]/20 text-[#4D0E13] transition-colors cursor-pointer"
                aria-label="Mark all as read"
              >
                <CheckCheck className="w-4 h-4" />
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[#C8A49F]/20 text-[#4D0E13] transition-colors cursor-pointer ml-1"
                aria-label="Close notification panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filter Categories */}
          <div className="flex items-center gap-1.5 mt-3 overflow-x-auto scrollbar-none pb-0.5">
            {[
              { id: 'all', label: 'All', count: notifications.length },
              { id: 'orders', label: 'Orders 🚚', count: notifications.filter((n) => n.category === 'orders').length },
              { id: 'drops', label: 'Drops ⚡', count: notifications.filter((n) => n.category === 'drops').length },
              { id: 'stylist', label: 'RÉNÉ 🎀', count: notifications.filter((n) => n.category === 'stylist').length },
              { id: 'community', label: 'Community 🛍️', count: notifications.filter((n) => n.category === 'community').length },
            ].map((cat) => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#4D0E13] text-white shadow-xs'
                      : 'bg-white/80 text-[#5e5460] hover:bg-white hover:text-[#4D0E13] border border-[#C8A49F]/30'
                  }`}
                >
                  <span>{cat.label}</span>
                  {cat.count > 0 && (
                    <span
                      className={`text-[10px] px-1 rounded-full ${
                        isActive ? 'bg-white/30 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {cat.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Real-Time Live Testing / Simulation Bar */}
        <div className="bg-[#EEE4DA]/40 border-b border-[#C8A49F]/25 px-4 py-2 flex items-center justify-between text-xs">
          <button
            onClick={() => setShowSimulator(!showSimulator)}
            className="flex items-center gap-1.5 font-bold text-[#4D0E13] hover:underline cursor-pointer"
          >
            <PlayCircle className="w-3.5 h-3.5 text-[#4D0E13]" />
            <span>{showSimulator ? 'Hide Live Event Tester ▲' : 'Simulate Live WebSocket Events ▼'}</span>
          </button>
          <span className="text-[10px] text-gray-500 font-mono">Real-time bi-directional WS</span>
        </div>

        {showSimulator && (
          <div className="bg-white p-3.5 border-b border-[#C8A49F]/30 animate-fadeIn text-xs flex flex-col gap-2">
            <p className="text-[11px] text-[#5e5460]">
              Click any event below to broadcast from the server over WebSockets instantly with sound chime & live toast:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                disabled={isSimulating}
                onClick={() => handleSimulate('order_dispatched')}
                className="flex items-center gap-1.5 p-2 rounded-xl bg-[#4D0E13]/5 border border-[#4D0E13]/20 hover:bg-[#4D0E13]/10 text-[#4D0E13] font-semibold text-[11px] transition-all cursor-pointer text-left"
              >
                <Truck className="w-3.5 h-3.5 shrink-0" />
                <span>🚚 Order Out for Delivery</span>
              </button>

              <button
                disabled={isSimulating}
                onClick={() => handleSimulate('flash_drop')}
                className="flex items-center gap-1.5 p-2 rounded-xl bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-800 font-semibold text-[11px] transition-all cursor-pointer text-left"
              >
                <Zap className="w-3.5 h-3.5 shrink-0" />
                <span>⚡ VIP Flash Drop</span>
              </button>

              <button
                disabled={isSimulating}
                onClick={() => handleSimulate('stylist_tip')}
                className="flex items-center gap-1.5 p-2 rounded-xl bg-pink-50 border border-pink-200 hover:bg-pink-100 text-pink-800 font-semibold text-[11px] transition-all cursor-pointer text-left"
              >
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span>🎀 RÉNÉ Stylist Alert</span>
              </button>

              <button
                disabled={isSimulating}
                onClick={() => handleSimulate('order_placed')}
                className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px] transition-all cursor-pointer text-left"
              >
                <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                <span>🛍️ Booking Confirmation</span>
              </button>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {!currentUser ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#5e5460]">
              <div className="w-16 h-16 rounded-full bg-[#EEE4DA] flex items-center justify-center mb-3 text-[#4D0E13]">
                <NotificationIcon gender={null} className="w-7 h-7" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#4D0E13]">
                Personalized Notifications
              </h4>
              <p className="text-xs text-gray-500 mt-1 max-w-xs leading-relaxed">
                Log in or create your RENTORA account to receive individual notifications for your fitting bag, private wishlist, RÉNÉ recommendations, and doorstep delivery updates.
              </p>
              <button
                onClick={() => {
                  onClose();
                  onNavigateTo('#auth');
                }}
                className="mt-4 px-4 py-2 rounded-full bg-[#4D0E13] text-white text-xs font-semibold hover:bg-[#6A1A21] transition-all cursor-pointer shadow-xs"
              >
                Sign In to View Notifications ✨
              </button>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 text-[#5e5460]">
              <div className="w-16 h-16 rounded-full bg-[#EEE4DA] flex items-center justify-center mb-3 text-[#4D0E13]/60">
                <NotificationIcon gender={currentUser.gender} className="w-7 h-7" />
              </div>
              <h4 className="font-serif text-lg font-bold text-[#4D0E13]">
                All Caught Up!
              </h4>
              <p className="text-xs text-gray-500 mt-1 max-w-xs leading-relaxed">
                No active notifications in this category. Real-time notifications for order tracking, drop alerts, and style advice will appear here live.
              </p>
              <button
                onClick={() => handleSimulate('stylist_tip')}
                className="mt-4 px-4 py-2 rounded-full bg-[#4D0E13] text-white text-xs font-semibold hover:bg-[#6A1A21] transition-all cursor-pointer shadow-xs"
              >
                Send Test Notification ✨
              </button>
            </div>
          ) : (
            filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`relative rounded-2xl p-4 transition-all border ${
                  !notif.read
                    ? 'bg-white border-[#4D0E13]/30 shadow-md shadow-[#4D0E13]/5'
                    : 'bg-white/60 border-[#C8A49F]/30 hover:bg-white'
                }`}
              >
                {/* Header row: category badge + timestamp + dismiss */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-6 h-6 rounded-full bg-[#EEE4DA] flex items-center justify-center shrink-0">
                      {getCategoryIcon(notif.category)}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#4D0E13]">
                      {notif.category}
                    </span>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#4D0E13] inline-block ml-1 animate-pulse" title="Unread" />
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400 font-medium">
                      {formatTimestamp(notif.timestamp)}
                    </span>
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="text-gray-300 hover:text-red-600 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                      title="Delete notification"
                      aria-label="Delete notification"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Notification Title & Message */}
                <div className="pl-7">
                  <h4 className="text-sm font-bold text-[#2D1517] leading-tight">
                    {notif.title}
                  </h4>
                  <p className="text-xs text-[#5e5460] mt-1 leading-relaxed">
                    {notif.message}
                  </p>

                  {/* Actions / CTA Link */}
                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-[#C8A49F]/20">
                    {notif.actionUrl ? (
                      <button
                        onClick={() => handleActionClick(notif)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#4D0E13] text-white text-xs font-semibold hover:bg-[#6A1A21] transition-all cursor-pointer group shadow-xs"
                      >
                        <span>{notif.actionLabel || 'View'}</span>
                        <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                      </button>
                    ) : (
                      <div />
                    )}

                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        className="text-[11px] text-[#4D0E13] hover:underline cursor-pointer font-medium"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#C8A49F]/30 bg-[#EEE4DA]/60 flex items-center justify-between text-xs text-[#5e5460]">
          <span>RENTORA Real-Time Notification Stream</span>
          <button
            onClick={onClose}
            className="text-xs font-bold text-[#4D0E13] hover:underline cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
