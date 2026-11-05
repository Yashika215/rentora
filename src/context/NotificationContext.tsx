import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { AppNotification, WebSocketMessage, UserProfile } from '../types';
import { useAuth } from './AuthContext';
import { getNextRelevantAutoNotification } from '../data/autoNotifications';

export interface UserNotificationPayload {
  title: string;
  message: string;
  type?: 'order_status' | 'live_rental' | 'flash_drop' | 'stylist_tip' | 'community' | 'promo';
  category?: 'orders' | 'drops' | 'stylist' | 'community' | 'promo';
  actionUrl?: string;
  actionLabel?: string;
  priority?: 'high' | 'normal' | 'low';
  metadata?: any;
}

interface NotificationContextType {
  notifications: AppNotification[];
  unreadCount: number;
  activeConnections: number;
  connectionStatus: 'connected' | 'connecting' | 'disconnected';
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  notifyUser: (payload: UserNotificationPayload) => void;
  sendNotification: (payload: Partial<AppNotification>) => void;
  simulateEvent: (scenario: string, customPayload?: any) => Promise<void>;
  toasts: AppNotification[];
  dismissToast: (id: string) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Gentle luxury chime using Web Audio API
const playChime = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const now = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    osc1.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(880, now + 0.08); // A5
    osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.35); // D6

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.linearRampToValueAtTime(0.08, now + 0.04);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now + 0.05);
    osc1.stop(now + 0.6);
    osc2.stop(now + 0.6);
  } catch (err) {
    // Audio autoplay restrictions caught safely
  }
};

const uniqueNotifications = (list: AppNotification[]) => {
  if (!Array.isArray(list)) return [];
  const seen = new Set<string>();
  return list.filter((n) => {
    if (!n || !n.id) return false;
    if (seen.has(n.id)) return false;
    seen.add(n.id);
    return true;
  });
};

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const currentUserId = currentUser?.id || null;

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [activeConnections, setActiveConnections] = useState<number>(1);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('disconnected');
  const [toasts, setToasts] = useState<AppNotification[]>([]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [soundEnabled, setSoundEnabledState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('rentora_sound_enabled');
      return stored !== null ? stored === 'true' : true;
    } catch {
      return true;
    }
  });

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const pingIntervalRef = useRef<number | null>(null);
  const autoNotifIntervalRef = useRef<number | null>(null);

  const notificationsRef = useRef<AppNotification[]>(notifications);
  const currentUserRef = useRef<UserProfile | null>(currentUser);

  useEffect(() => {
    notificationsRef.current = notifications;
  }, [notifications]);

  useEffect(() => {
    currentUserRef.current = currentUser;
  }, [currentUser]);

  const setSoundEnabled = (val: boolean) => {
    setSoundEnabledState(val);
    try {
      localStorage.setItem('rentora_sound_enabled', String(val));
    } catch {}
  };

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const triggerToast = useCallback(
    (notif: AppNotification) => {
      setToasts((prev) => {
        if (prev.some((t) => t.id === notif.id)) return prev;
        return [notif, ...prev.slice(0, 2)];
      });
      if (soundEnabled) {
        playChime();
      }
      setTimeout(() => {
        dismissToast(notif.id);
      }, 6500);
    },
    [soundEnabled, dismissToast]
  );

  // Sync to local storage for current user
  const persistUserNotifications = useCallback(
    (userId: string, notifs: AppNotification[]) => {
      try {
        localStorage.setItem(`rentora_notifs_${userId}`, JSON.stringify(uniqueNotifications(notifs)));
      } catch (e) {
        console.warn('Could not persist notifications to localStorage:', e);
      }
    },
    []
  );

  // Load user-specific initial notifications
  const loadUserNotifications = useCallback(
    async (userId: string) => {
      // 1. Try local cache first for instant response
      try {
        const cachedRaw = localStorage.getItem(`rentora_notifs_${userId}`);
        if (cachedRaw) {
          const cached = JSON.parse(cachedRaw);
          if (Array.isArray(cached)) {
            setNotifications(uniqueNotifications(cached));
          }
        } else {
          setNotifications([]);
        }
      } catch {}

      // 2. Fetch from server
      try {
        const res = await fetch(`/api/notifications?userId=${encodeURIComponent(userId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.notifications && Array.isArray(data.notifications)) {
            // Merge with local storage ensuring user ID matches
            const userSpecific = uniqueNotifications(data.notifications.filter((n: AppNotification) => !n.userId || n.userId === userId));
            setNotifications(userSpecific);
            persistUserNotifications(userId, userSpecific);
            if (data.activeConnections) {
              setActiveConnections(data.activeConnections);
            }
          }
        }
      } catch (e) {
        console.warn('Could not fetch user notifications from server:', e);
      }
    },
    [persistUserNotifications]
  );

  // Connect WebSocket specifically identified for current user
  const connectWebSocket = useCallback(
    (userId: string) => {
      if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
        // Send auth update if existing socket
        if (wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(JSON.stringify({ type: 'auth', userId }));
        }
        return;
      }

      setConnectionStatus('connecting');
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws/notifications?userId=${encodeURIComponent(userId)}`;

      try {
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          setConnectionStatus('connected');
          ws.send(JSON.stringify({ type: 'auth', userId }));

          if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = window.setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: 'ping' }));
            }
          }, 30000);
        };

        ws.onmessage = (event) => {
          try {
            const data: WebSocketMessage = JSON.parse(event.data);

            if (data.type === 'init') {
              if (data.userId === userId || !data.userId) {
                const uniqueInit = uniqueNotifications(data.notifications);
                setNotifications(uniqueInit);
                persistUserNotifications(userId, uniqueInit);
                setActiveConnections(data.activeConnections || 1);
              }
            } else if (data.type === 'notification:new') {
              // Only accept notification if it matches current user
              if (!data.notification.userId || data.notification.userId === userId) {
                setNotifications((prev) => {
                  if (prev.some((n) => n.id === data.notification.id)) {
                    return prev;
                  }
                  // New notification actually added
                  const updated = [data.notification, ...prev];
                  persistUserNotifications(userId, updated);
                  // Trigger toast only for truly new incoming notifications
                  triggerToast(data.notification);
                  return updated;
                });
              }
              setActiveConnections(data.activeConnections || 1);
            } else if (data.type === 'notification:read') {
              setNotifications((prev) => {
                const updated = prev.map((n) => (n.id === data.id ? { ...n, read: true } : n));
                persistUserNotifications(userId, updated);
                return updated;
              });
            } else if (data.type === 'notification:read_all') {
              setNotifications((prev) => {
                const updated = prev.map((n) => ({ ...n, read: true }));
                persistUserNotifications(userId, updated);
                return updated;
              });
            } else if (data.type === 'notification:delete') {
              setNotifications((prev) => {
                const updated = prev.filter((n) => n.id !== data.id);
                persistUserNotifications(userId, updated);
                return updated;
              });
            } else if (data.type === 'presence') {
              setActiveConnections(data.activeConnections || 1);
            }
          } catch (err) {
            console.error('Failed to parse WebSocket message:', err);
          }
        };

        ws.onclose = () => {
          setConnectionStatus('disconnected');
          if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
          if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = window.setTimeout(() => {
            if (currentUserId) {
              connectWebSocket(currentUserId);
            }
          }, 3500);
        };

        ws.onerror = (err) => {
          console.warn('WebSocket connection error, closing for reconnect:', err);
          ws.close();
        };
      } catch (err) {
        console.warn('WebSocket init failed:', err);
        setConnectionStatus('disconnected');
      }
    },
    [currentUserId, persistUserNotifications, triggerToast]
  );

  // Switch user session: load their individual notifications & re-authenticate WebSocket
  useEffect(() => {
    if (currentUserId) {
      loadUserNotifications(currentUserId);
      connectWebSocket(currentUserId);
    } else {
      // User logged out: clear notifications state completely
      setNotifications([]);
      setToasts([]);
      setConnectionStatus('disconnected');
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (autoNotifIntervalRef.current) {
        clearInterval(autoNotifIntervalRef.current);
        autoNotifIntervalRef.current = null;
      }
    }

    return () => {
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
    };
  }, [currentUserId, loadUserNotifications, connectWebSocket]);

  // Mark single notification read
  const markAsRead = (id: string) => {
    if (!currentUserId) return;
    setNotifications((prev) => {
      const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      persistUserNotifications(currentUserId, updated);
      return updated;
    });

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'notification:read', id, userId: currentUserId }));
    } else {
      fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId }),
      }).catch(console.error);
    }
  };

  // Mark all notifications read
  const markAllAsRead = () => {
    if (!currentUserId) return;
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      persistUserNotifications(currentUserId, updated);
      return updated;
    });

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'notification:read_all', userId: currentUserId }));
    } else {
      fetch('/api/notifications/mark-all-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId }),
      }).catch(console.error);
    }
  };

  // Delete notification
  const deleteNotification = (id: string) => {
    if (!currentUserId) return;
    setNotifications((prev) => {
      const updated = prev.filter((n) => n.id !== id);
      persistUserNotifications(currentUserId, updated);
      return updated;
    });
    dismissToast(id);

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'notification:delete', id, userId: currentUserId }));
    } else {
      fetch(`/api/notifications/${id}?userId=${encodeURIComponent(currentUserId)}`, {
        method: 'DELETE',
      }).catch(console.error);
    }
  };

  // Trigger an individual notification for the logged-in user based on actual user activity (with strict deduplication)
  const notifyUser = useCallback(
    (payload: UserNotificationPayload) => {
      if (!currentUserId) return;

      // Strict duplicate prevention: ensure exact same title & message is never duplicated
      const isDuplicate = notificationsRef.current.some(
        (n) => n.title === payload.title && n.message === payload.message
      );
      if (isDuplicate) {
        return;
      }

      const newNotif: AppNotification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        userId: currentUserId,
        type: payload.type || 'stylist_tip',
        category: payload.category || 'stylist',
        title: payload.title,
        message: payload.message,
        timestamp: new Date().toISOString(),
        read: false,
        priority: payload.priority || 'normal',
        actionUrl: payload.actionUrl,
        actionLabel: payload.actionLabel,
        metadata: payload.metadata,
      };

      // Immediate local state update & persistence with double-check for race conditions
      setNotifications((prev) => {
        // 1. Prevent exact same ID (Duplicate Key fix)
        if (prev.some((n) => n.id === newNotif.id)) return prev;

        // 2. Prevent same content ever (Strict Double Notification fix for academic prototype)
        // If the exact same message was sent recently (last 30s), skip it.
        const isRecentDuplicate = prev.some(
          (n) => n.title === newNotif.title && 
                 n.message === newNotif.message && 
                 (Date.now() - new Date(n.timestamp).getTime() < 30000)
        );
        if (isRecentDuplicate) return prev;

        const updated = [newNotif, ...prev.slice(0, 49)];
        persistUserNotifications(currentUserId, updated);
        return updated;
      });

      triggerToast(newNotif);

      // Respect browser notification permissions
      try {
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          new Notification(newNotif.title, {
            body: newNotif.message,
            icon: '/assets/aistudio/rentora-logo_359e5dd0.png',
          });
        }
      } catch (err) {
        // Fallback cleanly to in-app notification panel
      }

      // Send to server
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'notification:create',
            payload: newNotif,
          })
        );
      } else {
        fetch('/api/notifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newNotif),
        }).catch(console.error);
      }
    },
    [currentUserId, persistUserNotifications, triggerToast]
  );

  // Request browser notification permission if available
  useEffect(() => {
    if (currentUserId && typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
      }
    }
  }, [currentUserId]);

  // Automatic relevant notifications every 3 minutes (180 seconds) for the logged-in user
  useEffect(() => {
    // 1. Clear any existing timer to prevent duplicate timers
    if (autoNotifIntervalRef.current) {
      clearInterval(autoNotifIntervalRef.current);
      autoNotifIntervalRef.current = null;
    }

    // 2. Stop timer immediately if no user is logged in
    if (!currentUserId || !currentUser) {
      return;
    }

    // 3. Exact 180-second (3-minute) interval
    const INTERVAL_MS = 180 * 1000;

    autoNotifIntervalRef.current = window.setInterval(() => {
      const activeUser = currentUserRef.current;
      const activeUserId = activeUser?.id;
      if (!activeUserId) return;

      const nextTemplate = getNextRelevantAutoNotification(
        activeUserId,
        activeUser.gender,
        notificationsRef.current
      );

      if (nextTemplate) {
        notifyUser({
          title: nextTemplate.title,
          message: nextTemplate.message,
          type: nextTemplate.type,
          category: nextTemplate.category,
          actionUrl: nextTemplate.actionUrl,
          actionLabel: nextTemplate.actionLabel,
          priority: 'normal',
        });
      }
    }, INTERVAL_MS);

    // 4. Clean up interval when session ends or component unmounts
    return () => {
      if (autoNotifIntervalRef.current) {
        clearInterval(autoNotifIntervalRef.current);
        autoNotifIntervalRef.current = null;
      }
    };
  }, [currentUserId, notifyUser]);

  const sendNotification = (payload: Partial<AppNotification>) => {
    if (!currentUserId) return;
    notifyUser({
      title: payload.title || 'New Update',
      message: payload.message || '',
      type: payload.type,
      category: payload.category,
      actionUrl: payload.actionUrl,
      actionLabel: payload.actionLabel,
      priority: payload.priority,
      metadata: payload.metadata,
    });
  };

  const simulateEvent = async (scenario: string, customPayload?: any) => {
    if (!currentUserId) return;
    try {
      await fetch('/api/notifications/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario, customPayload, userId: currentUserId }),
      });
    } catch (e) {
      console.error('Error triggering simulated event:', e);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        activeConnections,
        connectionStatus,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        notifyUser,
        sendNotification,
        simulateEvent,
        toasts,
        dismissToast,
        soundEnabled,
        setSoundEnabled,
        isNotificationOpen,
        setIsNotificationOpen,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
