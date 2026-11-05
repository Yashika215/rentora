import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useAuth } from '../context/AuthContext';
import { AppNotification } from '../types';
import { NotificationIcon } from './NotificationIcon';
import { 
  Truck, 
  Zap, 
  Sparkles, 
  ShoppingBag, 
  Gift, 
  Bell, 
  X, 
  ArrowRight,
  Radio
} from 'lucide-react';

interface NotificationToastContainerProps {
  onNavigateTo: (url: string) => void;
}

export const NotificationToastContainer: React.FC<NotificationToastContainerProps> = ({ onNavigateTo }) => {
  const { toasts, dismissToast, markAsRead } = useNotifications();
  const { currentUser } = useAuth();

  if (toasts.length === 0) return null;

  const getIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'order_status':
        return <Truck className="w-4 h-4 text-[#4D0E13]" />;
      case 'flash_drop':
        return <Zap className="w-4 h-4 text-amber-600" />;
      case 'stylist_tip':
        return <Sparkles className="w-4 h-4 text-pink-600" />;
      case 'live_rental':
        return <ShoppingBag className="w-4 h-4 text-emerald-700" />;
      case 'promo':
        return <Gift className="w-4 h-4 text-purple-600" />;
      default:
        return <NotificationIcon gender={currentUser?.gender} className="w-4 h-4 text-[#4D0E13]" />;
    }
  };

  const getBadgeColor = (type: AppNotification['type']) => {
    switch (type) {
      case 'order_status':
        return 'bg-[#4D0E13]/10 border-[#4D0E13]/30 text-[#4D0E13]';
      case 'flash_drop':
        return 'bg-amber-100 border-amber-300 text-amber-800';
      case 'stylist_tip':
        return 'bg-pink-100 border-pink-300 text-pink-800';
      case 'live_rental':
        return 'bg-emerald-100 border-emerald-300 text-emerald-800';
      case 'promo':
        return 'bg-purple-100 border-purple-300 text-purple-800';
      default:
        return 'bg-[#EEE4DA] border-[#C8A49F]/40 text-[#4D0E13]';
    }
  };

  return (
    <div className="fixed top-22 right-4 sm:right-6 z-50 flex flex-col gap-3 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto bg-[#FFFBF8] border border-[#C8A49F]/50 rounded-2xl p-4 shadow-xl shadow-[#4D0E13]/10 transform transition-all duration-300 animate-slideInRight flex flex-col gap-2 relative overflow-hidden backdrop-blur-md"
        >
          {/* Top Live pill & Type */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border flex items-center gap-1 ${getBadgeColor(toast.type)}`}>
                {getIcon(toast.type)}
                <span className="uppercase tracking-wider">
                  {toast.type.replace('_', ' ')}
                </span>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#5e5460]">Just now</span>
              <button
                onClick={() => dismissToast(toast.id)}
                className="text-gray-400 hover:text-gray-600 p-0.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Dismiss alert"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Title & Body */}
          <div className="pr-2">
            <h4 className="text-sm font-bold text-[#4D0E13] leading-snug">
              {toast.title}
            </h4>
            <p className="text-xs text-[#2D1517]/80 mt-0.5 line-clamp-2 leading-relaxed">
              {toast.message}
            </p>
          </div>

          {/* Action Link if provided */}
          {toast.actionUrl && (
            <div className="pt-1 flex items-center justify-between border-t border-[#C8A49F]/20 mt-1">
              <button
                onClick={() => {
                  markAsRead(toast.id);
                  dismissToast(toast.id);
                  onNavigateTo(toast.actionUrl!);
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-[#4D0E13] hover:text-[#6A1A21] hover:underline cursor-pointer group"
              >
                <span>{toast.actionLabel || 'View details'}</span>
                <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
              </button>
              <button
                onClick={() => {
                  markAsRead(toast.id);
                  dismissToast(toast.id);
                }}
                className="text-[10px] text-gray-500 hover:text-gray-700 cursor-pointer"
              >
                Mark read
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
