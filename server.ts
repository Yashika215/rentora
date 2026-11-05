import express from 'express';
import http from 'http';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Prevent browser from caching stale bundles or HTML
app.use((_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// Server-side Gemini client
const apiKey = process.env.GEMINI_API_KEY;
const isValidKey = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim().length > 10);
const ai = isValidKey
  ? new GoogleGenAI({
      apiKey: apiKey!,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// ==========================================
// REAL-TIME NOTIFICATIONS SYSTEM (WebSockets)
// ==========================================

export interface ServerNotification {
  id: string;
  userId: string;
  type: 'order_status' | 'live_rental' | 'flash_drop' | 'stylist_tip' | 'community' | 'promo';
  category: 'orders' | 'drops' | 'stylist' | 'community' | 'promo';
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

// Map of userId -> ServerNotification[]
const userNotificationsMap = new Map<string, ServerNotification[]>();

function getUserNotifications(userId: string): ServerNotification[] {
  if (!userId) return [];
  if (!userNotificationsMap.has(userId)) {
    userNotificationsMap.set(userId, []);
  }
  return userNotificationsMap.get(userId) || [];
}

interface UserWebSocket extends WebSocket {
  userId?: string;
}

// Setup WebSocket Server with dedicated path
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  try {
    const url = new URL(request.url || '', `http://${request.headers.host || 'localhost'}`);
    if (url.pathname === '/ws/notifications' || url.pathname === '/ws') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        const userId = url.searchParams.get('userId') || '';
        (ws as UserWebSocket).userId = userId;
        wss.emit('connection', ws, request);
      });
    }
  } catch (err) {
    console.error('Error handling WebSocket upgrade:', err);
  }
});

function sendToUser(userId: string, data: any) {
  if (!userId) return;
  const payload = JSON.stringify(data);
  wss.clients.forEach((client) => {
    const userWs = client as UserWebSocket;
    if (userWs.readyState === WebSocket.OPEN && userWs.userId === userId) {
      try {
        userWs.send(payload);
      } catch (err) {
        console.error('Failed to send WebSocket message to user:', err);
      }
    }
  });
}

function broadcastPresence() {
  const payload = JSON.stringify({
    type: 'presence',
    activeConnections: wss.clients.size,
  });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(payload);
      } catch {}
    }
  });
}

function addUserNotification(data: Partial<ServerNotification> & { userId: string }): ServerNotification {
  const userId = data.userId || 'guest';
  const newNotif: ServerNotification = {
    id: data.id || `notif-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId,
    type: data.type || 'stylist_tip',
    category: data.category || 'stylist',
    title: data.title || 'New Update',
    message: data.message || '',
    timestamp: new Date().toISOString(),
    read: false,
    priority: data.priority || 'normal',
    actionUrl: data.actionUrl,
    actionLabel: data.actionLabel,
    metadata: data.metadata,
  };

  const existing = getUserNotifications(userId);
  userNotificationsMap.set(userId, [newNotif, ...existing.slice(0, 50)]);

  sendToUser(userId, {
    type: 'notification:new',
    notification: newNotif,
    activeConnections: wss.clients.size,
  });

  return newNotif;
}

wss.on('connection', (ws: UserWebSocket, request) => {
  // If user ID was present in query, send their specific notifications
  if (ws.userId) {
    ws.send(
      JSON.stringify({
        type: 'init',
        userId: ws.userId,
        notifications: getUserNotifications(ws.userId),
        activeConnections: wss.clients.size,
      })
    );
  }

  broadcastPresence();

  ws.on('message', (message: string) => {
    try {
      const parsed = JSON.parse(message.toString());

      if (parsed.type === 'auth') {
        const userId = parsed.userId || '';
        ws.userId = userId;
        ws.send(
          JSON.stringify({
            type: 'init',
            userId,
            notifications: getUserNotifications(userId),
            activeConnections: wss.clients.size,
          })
        );
      } else if (parsed.type === 'notification:read') {
        const userId = parsed.userId || ws.userId;
        if (userId) {
          const notifs = getUserNotifications(userId);
          const target = notifs.find((n) => n.id === parsed.id);
          if (target) {
            target.read = true;
            sendToUser(userId, {
              type: 'notification:read',
              id: parsed.id,
              userId,
            });
          }
        }
      } else if (parsed.type === 'notification:read_all') {
        const userId = parsed.userId || ws.userId;
        if (userId) {
          const notifs = getUserNotifications(userId);
          notifs.forEach((n) => (n.read = true));
          sendToUser(userId, {
            type: 'notification:read_all',
            userId,
          });
        }
      } else if (parsed.type === 'notification:delete') {
        const userId = parsed.userId || ws.userId;
        if (userId) {
          const notifs = getUserNotifications(userId).filter((n) => n.id !== parsed.id);
          userNotificationsMap.set(userId, notifs);
          sendToUser(userId, {
            type: 'notification:delete',
            id: parsed.id,
            userId,
          });
        }
      } else if (parsed.type === 'notification:create') {
        if (parsed.payload) {
          const targetUserId = parsed.payload.userId || ws.userId;
          if (targetUserId) {
            addUserNotification({ ...parsed.payload, userId: targetUserId });
          }
        }
      } else if (parsed.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong' }));
      }
    } catch (e) {
      console.error('Error handling WebSocket message:', e);
    }
  });

  ws.on('close', () => {
    broadcastPresence();
  });
});

// ==========================================
// REST API ENDPOINTS
// ==========================================

// Helper to resolve request userId from header or query
function resolveRequestUserId(req: express.Request): string {
  const queryUserId = req.query.userId as string;
  if (queryUserId && queryUserId.trim()) return queryUserId.trim();
  const authUser = getAuthenticatedUser(req);
  if (authUser) return authUser.id;
  return '';
}

// Get notifications for specific user
app.get('/api/notifications', (req, res) => {
  const userId = resolveRequestUserId(req);
  if (!userId) {
    return res.json({
      notifications: [],
      unreadCount: 0,
      activeConnections: wss.clients.size,
    });
  }

  const notifs = getUserNotifications(userId);
  const unreadCount = notifs.filter((n) => !n.read).length;
  res.json({
    userId,
    notifications: notifs,
    unreadCount,
    activeConnections: wss.clients.size,
  });
});

// Create notification for specific user
app.post('/api/notifications', (req, res) => {
  const { userId, title, message, type, category, actionUrl, actionLabel, metadata, priority } = req.body;
  const targetUserId = userId || resolveRequestUserId(req);

  if (!targetUserId) {
    return res.status(400).json({ error: 'User ID is required to create a personalized notification' });
  }

  if (!title || !message) {
    return res.status(400).json({ error: 'Title and message are required' });
  }

  const notif = addUserNotification({
    userId: targetUserId,
    title,
    message,
    type,
    category,
    actionUrl,
    actionLabel,
    metadata,
    priority,
  });

  res.status(201).json(notif);
});

// Mark one notification as read for user
app.patch('/api/notifications/:id/read', (req, res) => {
  const { id } = req.params;
  const userId = req.body?.userId || resolveRequestUserId(req);

  // Search across users if userId not provided
  let found = false;
  let ownerUserId = userId;

  if (ownerUserId) {
    const list = getUserNotifications(ownerUserId);
    const target = list.find((n) => n.id === id);
    if (target) {
      target.read = true;
      found = true;
    }
  } else {
    for (const [uid, list] of userNotificationsMap.entries()) {
      const target = list.find((n) => n.id === id);
      if (target) {
        target.read = true;
        ownerUserId = uid;
        found = true;
        break;
      }
    }
  }

  if (!found) {
    return res.status(404).json({ error: 'Notification not found' });
  }

  if (ownerUserId) {
    sendToUser(ownerUserId, { type: 'notification:read', id, userId: ownerUserId });
  }

  res.json({ success: true, id });
});

// Mark all notifications as read for user
app.post('/api/notifications/mark-all-read', (req, res) => {
  const userId = req.body?.userId || resolveRequestUserId(req);
  if (!userId) {
    return res.status(400).json({ error: 'User ID required' });
  }

  const list = getUserNotifications(userId);
  list.forEach((n) => (n.read = true));
  sendToUser(userId, { type: 'notification:read_all', userId });

  res.json({ success: true, count: list.length });
});

// Delete notification for user
app.delete('/api/notifications/:id', (req, res) => {
  const { id } = req.params;
  const userId = (req.query?.userId as string) || resolveRequestUserId(req);

  let ownerUserId = userId;
  let deleted = false;

  if (ownerUserId) {
    const beforeLen = getUserNotifications(ownerUserId).length;
    const filtered = getUserNotifications(ownerUserId).filter((n) => n.id !== id);
    userNotificationsMap.set(ownerUserId, filtered);
    if (filtered.length < beforeLen) deleted = true;
  } else {
    for (const [uid, list] of userNotificationsMap.entries()) {
      const filtered = list.filter((n) => n.id !== id);
      if (filtered.length < list.length) {
        userNotificationsMap.set(uid, filtered);
        ownerUserId = uid;
        deleted = true;
        break;
      }
    }
  }

  if (!deleted) {
    return res.status(404).json({ error: 'Notification not found' });
  }

  if (ownerUserId) {
    sendToUser(ownerUserId, { type: 'notification:delete', id, userId: ownerUserId });
  }

  res.json({ success: true, id });
});

// Real-Time Event Simulation for the active user
app.post('/api/notifications/simulate', (req, res) => {
  const { scenario, customPayload, userId } = req.body;
  const targetUserId = userId || resolveRequestUserId(req);

  if (!targetUserId) {
    return res.status(400).json({ error: 'User ID required for personalized simulation' });
  }

  let notif: ServerNotification;

  switch (scenario) {
    case 'order_dispatched':
      notif = addUserNotification({
        userId: targetUserId,
        type: 'order_status',
        category: 'orders',
        title: 'Order Status Update 🚚',
        message: 'Your rental outfit has been packed and handed over to our VIP doorstep courier!',
        priority: 'high',
        actionUrl: '#orders',
        actionLabel: 'Track Delivery',
        metadata: {
          orderId: customPayload?.orderId || 'REN-7821',
          status: 'Active Rental',
        },
      });
      break;

    case 'flash_drop':
      notif = addUserNotification({
        userId: targetUserId,
        type: 'flash_drop',
        category: 'drops',
        title: 'Personalized Collection Alert ✨',
        message: 'New designer styles matching your style preferences have been curated in your boutique catalog!',
        priority: 'high',
        actionUrl: '#lookbook',
        actionLabel: 'Browse Vault',
      });
      break;

    case 'stylist_tip':
      notif = addUserNotification({
        userId: targetUserId,
        type: 'stylist_tip',
        category: 'stylist',
        title: 'RÉNÉ Personal Styling Alert 🎀',
        message: 'RÉNÉ created 3 personalized outfit pairings based on your saved aesthetics and quiz results.',
        priority: 'normal',
        actionUrl: '#reni',
        actionLabel: 'View Styling Board',
      });
      break;

    case 'order_placed':
      notif = addUserNotification({
        userId: targetUserId,
        type: 'order_status',
        category: 'orders',
        title: customPayload?.orderId ? `Order #${customPayload.orderId} Confirmed! 🎉` : 'Order Confirmed! 🎉',
        message: customPayload?.productTitle
          ? `Your reservation for "${customPayload.productTitle}" is locked! Complimentary dry cleaning & damage protection included.`
          : 'Your luxury rental has been reserved! Doorstep delivery scheduled.',
        priority: 'high',
        actionUrl: '#orders',
        actionLabel: 'View Order',
        metadata: {
          orderId: customPayload?.orderId || `REN-${Math.floor(1000 + Math.random() * 9000)}`,
          status: 'Confirmed',
        },
      });
      break;

    default:
      notif = addUserNotification({
        userId: targetUserId,
        type: 'stylist_tip',
        category: 'stylist',
        title: 'Wardrobe Recommendation 🎀',
        message: 'Explore hand-selected accessories that coordinate seamlessly with your rental outfits.',
        priority: 'normal',
        actionUrl: '#accessories',
        actionLabel: 'View Accessories',
      });
  }

  res.json({ success: true, notification: notif });
});

// ==========================================
// AUTHENTICATION & USER MANAGEMENT API
// ==========================================

interface StoredUser {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  passwordHash: string;
  salt: string;
  memberTier: 'Member' | 'Silver Renter' | 'Gold VIP Renter' | 'Diamond Luxe';
  savedAddress?: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  preferredLocation?: {
    country: string;
    state: string;
    city: string;
    pincode?: string;
    isServiceable?: boolean;
  };
  preferredAesthetics: string[];
  joinedDate: string;
  rentalCredits: number;
  measurements?: {
    bust?: string;
    waist?: string;
    hips?: string;
    height?: string;
  };
}

interface ActiveSession {
  token: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
}

const DB_FILE_PATH = path.resolve(__dirname, 'users-db.json');

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

function verifyPassword(password: string, hash: string, salt: string): boolean {
  try {
    const key = crypto.scryptSync(password, salt, 64);
    const original = Buffer.from(hash, 'hex');
    return crypto.timingSafeEqual(key, original);
  } catch {
    return false;
  }
}

// In-memory sessions map (token -> ActiveSession)
const sessions = new Map<string, ActiveSession>();

// Initialize or load user database
let usersStore: StoredUser[] = [];

function loadUsers(): StoredUser[] {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read users-db.json, re-initializing default seed user:', err);
  }

  // Default initial seed user (Aditi Verma)
  const aditiSalt = crypto.randomBytes(16).toString('hex');
  const initialUsers: StoredUser[] = [
    {
      id: 'usr-aditi-01',
      fullName: 'Aditi Verma',
      email: 'aditi.verma@gmail.com',
      phone: '+91 98765 43210',
      passwordHash: hashPassword('RentoraLuxe@2026', aditiSalt),
      salt: aditiSalt,
      memberTier: 'Gold VIP Renter',
      savedAddress: {
        address: 'Flat 402, Royal Orchid Enclave, Bodakdev',
        city: 'Ahmedabad',
        state: 'Gujarat',
        pincode: '380054',
      },
      preferredLocation: {
        country: 'India',
        state: 'Gujarat',
        city: 'Ahmedabad',
        isServiceable: true,
      },
      preferredAesthetics: ['coquette', 'desi-glam'],
      joinedDate: 'Oct 2026',
      rentalCredits: 500,
      measurements: {
        bust: '34 Inches (Size S/M)',
        waist: '28 Inches',
        hips: '38 Inches',
        height: '5\' 6" (+3" Heel)',
      },
    },
  ];

  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(initialUsers, null, 2), 'utf-8');
  } catch (e) {
    console.warn('Could not save initial users-db.json:', e);
  }

  return initialUsers;
}

usersStore = loadUsers();

function saveUsers() {
  try {
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(usersStore, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to write users-db.json:', e);
  }
}

function sanitizeUser(user: StoredUser) {
  const { passwordHash, salt, ...safeUser } = user;
  return safeUser;
}

function getAuthenticatedUser(req: express.Request): StoredUser | null {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.substring(7).trim();
  const session = sessions.get(token);
  if (!session) return null;
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }
  return usersStore.find((u) => u.id === session.userId) || null;
}

// 1. Sign Up Endpoint
app.post('/api/auth/signup', (req, res) => {
  try {
    const { fullName, email, password, phone, preferredAesthetics, preferredLocation } = req.body;

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter your full name (at least 2 characters).' });
    }

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email format (e.g. name@domain.com).' });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Check if email already registered
    const existing = usersStore.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email address already exists. Please sign in instead.' });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);

    const newUser: StoredUser = {
      id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      fullName: fullName.trim(),
      email: cleanEmail,
      phone: phone ? phone.trim() : undefined,
      passwordHash,
      salt,
      memberTier: 'Member',
      preferredLocation: preferredLocation || {
        country: 'India',
        state: 'Gujarat',
        city: 'Ahmedabad',
        isServiceable: true,
      },
      preferredAesthetics: Array.isArray(preferredAesthetics) && preferredAesthetics.length > 0 ? preferredAesthetics : ['coquette', 'desi-glam'],
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      rentalCredits: 200, // Welcome gift credits
    };

    usersStore.push(newUser);
    saveUsers();

    // Generate Session Token
    const token = crypto.randomBytes(32).toString('hex');
    const sessionExpiry = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
    sessions.set(token, {
      token,
      userId: newUser.id,
      createdAt: Date.now(),
      expiresAt: sessionExpiry,
    });

    // Add individual welcome notification for the newly registered user
    addUserNotification({
      userId: newUser.id,
      type: 'promo',
      category: 'promo',
      title: `Welcome to RENTORA, ${newUser.fullName.split(' ')[0]}! 🎀`,
      message: 'Your personal luxury wardrobe is active. Complimentary doorstep delivery & damage waiver enabled.',
      actionUrl: '#collections',
      actionLabel: 'Explore Collections',
      priority: 'high',
    });

    return res.status(201).json({
      success: true,
      token,
      user: sanitizeUser(newUser),
      message: 'Account created successfully! Welcome to RENTORA.',
    });
  } catch (err) {
    console.error('Error during /api/auth/signup:', err);
    return res.status(500).json({ error: 'Account registration encountered a server error. Please try again.' });
  }
});

// 2. Sign In Endpoint (Academic Demo Mode - Instant verification for any valid email & non-empty password)
app.post('/api/auth/signin', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Please enter your email address.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ error: 'Please enter a valid email format (e.g. demo@gmail.com).' });
    }

    if (!password || typeof password !== 'string' || password.trim() === '') {
      return res.status(400).json({ error: 'Please enter a non-empty password.' });
    }

    let user = usersStore.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      // Auto-register demo user profile on the fly
      const namePart = cleanEmail.split('@')[0];
      const formattedName = namePart
        .split(/[._-]/)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');

      const salt = crypto.randomBytes(16).toString('hex');
      user = {
        id: `usr-demo-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        fullName: formattedName.length > 1 ? formattedName : 'Demo Renter',
        email: cleanEmail,
        phone: '+91 98765 43210',
        passwordHash: hashPassword(password, salt),
        salt,
        memberTier: 'Gold VIP Renter',
        savedAddress: {
          address: 'Flat 402, Royal Orchid Enclave, Bodakdev',
          city: 'Ahmedabad',
          state: 'Gujarat',
          pincode: '380054',
        },
        preferredLocation: {
          country: 'India',
          state: 'Gujarat',
          city: 'Ahmedabad',
          isServiceable: true,
        },
        preferredAesthetics: ['coquette', 'desi-glam'],
        joinedDate: 'Oct 2026',
        rentalCredits: 500,
      };

      usersStore.push(user);
      saveUsers();
    }

    const token = crypto.randomBytes(32).toString('hex');
    const sessionExpiry = Date.now() + 30 * 24 * 60 * 60 * 1000;
    sessions.set(token, {
      token,
      userId: user.id,
      createdAt: Date.now(),
      expiresAt: sessionExpiry,
    });

    return res.json({
      success: true,
      token,
      user: sanitizeUser(user),
      message: 'Welcome to RENTORA!',
    });
  } catch (err) {
    console.error('Error during /api/auth/signin:', err);
    return res.status(500).json({ error: 'Sign in failed due to a server error. Please try again.' });
  }
});

// 3. Current Authenticated User (Session Verification)
app.get('/api/auth/me', (req, res) => {
  const user = getAuthenticatedUser(req);
  if (!user) {
    return res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
  }
  return res.json({
    success: true,
    user: sanitizeUser(user),
  });
});

// 4. Sign Out Endpoint
app.post('/api/auth/signout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    sessions.delete(token);
  }
  return res.json({ success: true, message: 'Signed out successfully.' });
});

// 5. Update Profile & Location Endpoint
app.put('/api/auth/profile', (req, res) => {
  try {
    const user = getAuthenticatedUser(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: please sign in to update your profile.' });
    }

    const { fullName, phone, savedAddress, preferredLocation, preferredAesthetics, measurements } = req.body;

    if (fullName && typeof fullName === 'string' && fullName.trim().length >= 2) {
      user.fullName = fullName.trim();
    }
    if (phone !== undefined) {
      user.phone = phone;
    }
    if (savedAddress) {
      user.savedAddress = {
        ...user.savedAddress,
        ...savedAddress,
      };
    }
    if (preferredLocation) {
      user.preferredLocation = {
        ...user.preferredLocation,
        ...preferredLocation,
      };
    }
    if (Array.isArray(preferredAesthetics)) {
      user.preferredAesthetics = preferredAesthetics;
    }
    if (measurements) {
      user.measurements = {
        ...user.measurements,
        ...measurements,
      };
    }

    saveUsers();

    return res.json({
      success: true,
      user: sanitizeUser(user),
      message: 'Profile updated successfully!',
    });
  } catch (err) {
    console.error('Error during /api/auth/profile:', err);
    return res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// 6. Forgot Password Endpoint
app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Please enter your registered email address.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = usersStore.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    return res.status(404).json({ error: 'No account registered with this email address.' });
  }

  // Generate 6-digit code for quick reset
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  return res.json({
    success: true,
    message: `Password reset instructions and verification code sent to ${cleanEmail}.`,
    resetCode, // provided so user can complete reset in testing flow
  });
});

// 7. Reset Password Endpoint
app.post('/api/auth/reset-password', (req, res) => {
  const { email, newPassword } = req.body;
  if (!email || !newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'Valid email and new password (min 6 chars) are required.' });
  }

  const cleanEmail = email.trim().toLowerCase();
  const user = usersStore.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    return res.status(404).json({ error: 'User account not found.' });
  }

  user.salt = crypto.randomBytes(16).toString('hex');
  user.passwordHash = hashPassword(newPassword, user.salt);
  saveUsers();

  return res.json({
    success: true,
    message: 'Password has been reset successfully! You can now sign in with your new password.',
  });
});

// ==========================================
// LOCATION & LOCAL AVAILABILITY API
// ==========================================

const GUJARAT_CITIES_DATA = [
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

function isGujaratPin(pin: string): boolean {
  if (!pin) return false;
  const cleaned = pin.trim();
  if (!/^\d{6}$/.test(cleaned)) return false;
  const num = parseInt(cleaned, 10);
  return num >= 360000 && num <= 396999;
}

app.get('/api/locations/availability', (req, res) => {
  try {
    const rawCity = ((req.query.city as string) || 'Ahmedabad').trim();
    const rawPincode = ((req.query.pincode as string) || '').trim();

    const cityMatch = GUJARAT_CITIES_DATA.find(
      (c) => c.name.toLowerCase() === rawCity.toLowerCase()
    ) || GUJARAT_CITIES_DATA[0];

    const isPinValid = rawPincode ? isGujaratPin(rawPincode) : undefined;
    const now = new Date();

    const addDays = (days: number) => {
      const d = new Date(now);
      d.setDate(d.getDate() + days);
      return d.toLocaleDateString('en-IN', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
      });
    };

    const currentTimeString = now.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const totalCatalog = 32;

    if (cityMatch.tier === 'flagship_express') {
      return res.json({
        city: cityMatch.name,
        state: 'Gujarat',
        country: 'India',
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
        pincodeVerified: isPinValid,
        pincode: rawPincode || cityMatch.pincodePrefix,
        notes: 'Central luxury warehouse location — complete 32-piece wardrobe in stock ready for instant booking.',
        features: [
          '100% wardrobe in stock for same-day dispatch',
          'Complimentary backup size & fit-assistance included',
          'Zero-hassle contactless return pickup at your doorstep',
        ],
        lastCheckedTime: currentTimeString,
      });
    }

    if (cityMatch.tier === 'express_hub') {
      return res.json({
        city: cityMatch.name,
        state: 'Gujarat',
        country: 'India',
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
        pincodeVerified: isPinValid,
        pincode: rawPincode || cityMatch.pincodePrefix,
        notes: 'Active regional hub with 24h courier dispatch and insured doorstep delivery.',
        features: [
          '31 of 32 designer looks in stock ready to ship',
          'Dedicated tracking with real-time driver ETA updates',
          'Pre-scheduled return pickup on your 4th or 7th rental day',
        ],
        lastCheckedTime: currentTimeString,
      });
    }

    if (cityMatch.tier === 'tier2') {
      return res.json({
        city: cityMatch.name,
        state: 'Gujarat',
        country: 'India',
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
        pincodeVerified: isPinValid,
        pincode: rawPincode || cityMatch.pincodePrefix,
        notes: 'Direct priority courier delivery to all addresses within municipal city limits.',
        features: [
          '30 of 32 couture outfits available for reservation',
          'Includes sealed weatherproof luxury garment bag',
          'Full refundable deposit returned within 24h of return pickup',
        ],
        lastCheckedTime: currentTimeString,
      });
    }

    // standard
    return res.json({
      city: cityMatch.name,
      state: 'Gujarat',
      country: 'India',
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
      pincodeVerified: isPinValid,
      pincode: rawPincode || cityMatch.pincodePrefix,
      notes: 'Delivered directly to your doorstep across district sectors.',
      features: [
        '29 of 32 couture outfits available for booking',
        'Door-to-door courier delivery and pickup included',
        'Pre-sanitized with zero washing required by renter',
      ],
      lastCheckedTime: currentTimeString,
    });
  } catch (err) {
    console.error('Error in /api/locations/availability:', err);
    return res.status(500).json({ error: 'Failed to fetch location delivery availability' });
  }
});

// ==========================================
// RÉNÉ AI Stylist Chat Endpoint
// ==========================================
app.post('/api/reni/chat', async (req, res) => {
  try {
    const { message, history = [], userPreferences = {} } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const { occasion, budget, aesthetic, collection } = userPreferences;

    const systemPrompt = `You are RÉNÉ, the professional personal fashion stylist at RENTORA (Rent • Wear • Repeat), a luxury couture rental house in Gujarat, India.

Brand Colors: Deep plum (#4D0E13), Dusty rose (#C8A49F), Warm ivory (#EEE4DA), Soft lavender (#C7B7D4), Charcoal (#2D1517).

STRICT PERSONALITY & TONE GUIDELINES:
1. Professional, stylish, intelligent, and friendly AI fashion stylist.
2. Natural, articulate language. DO NOT use excessive emojis (at most 1 subtle accent like ✨ or 👗 per response).
3. STRICTLY PROHIBITED: Do not use any Gen-Z slang or casual buzzwords. Never say "bestie", "queen", "slay", "omg", "vibe check", or "10/10 energy".
4. Address the exact user query directly without changing the topic. Do not make up information or assume unrequested preferences.
5. If the user asks for a specific count (e.g. "suggest 3 options", "show 1 option"), provide exactly that number.
6. If the user asks for a specific product, colour, size, occasion, or price, address that exact requirement.
7. Only recommend products from the existing RENTORA catalogue. Never invent unavailable or nonexistent products.
8. If no suitable product exists, clearly state: "I couldn't find an exact match in the current collection."
9. Suggest matching earrings, footwear, bags, and accessories only when relevant to the request.
10. Every styling tip must be a single short sentence (maximum 15 words). Avoid repetitions and clashing suggestions.
11. Recommend only relevant matching accessories from the actual RENTORA catalogue.
12. Remember and build upon previous user selections and context during multi-turn styling.

RENTORA CATALOGUE INVENTORY:
• WOMEN'S COUTURE:
  - "Designer Evening Gown" (₹1,400/4d, dep. ₹1,000) - Dramatic navy & silver sequin silhouette for formal galas. Sizes: XS, S, M, L.
  - "Bridal Lehenga" (₹2,000/4d, dep. ₹1,500) - Royal crimson & ruby with antique gold zardozi. Sizes: S, M, L, XL.
  - "Wedding Guest Lehenga" (₹1,200/4d, dep. ₹700) - Pastel rose quartz & sage organza twirl for sangeet. Sizes: XS, S, M, L.
  - "Embroidered Anarkali Suit" (₹1,000/4d, dep. ₹600) - Ivory cream & antique zari 32-kali flare. Sizes: S, M, L, XL.
  - "Traditional Saree" (₹1,200/4d, dep. ₹700) - Deep maroon & gold woven Kanjeevaram silk. Sizes: Free Size / One Size.
  - "Designer Cocktail Dress" (₹1,000/4d, dep. ₹600) - Midnight black structured crepe for black-tie soirees. Sizes: XS, S, M, L.
  - "Indo-Western Co-Ord Set" (₹1,000/4d, dep. ₹600) - Blush rose embroidered crop top & wide-leg palazzo. Sizes: S, M, L.
  - "Garba Chaniya Choli" (₹1,200/4d, dep. ₹700) - Kathiyawadi mirrorwork ghagra in vibrant jewel tones. Sizes: Free Size.
  - "Festive Sharara Set" (₹1,000/4d, dep. ₹600) - Emerald green georgette with tiered ruffled gota borders. Sizes: S, M, L, XL.
  - "Elegant Reception Gown" (₹1,400/4d, dep. ₹1,000) - Dusty lavender sculpted satin with sweeping train. Sizes: S, M, L.
  - "Birthday Party Dress" (₹800/4d, dep. ₹500) - Rose quartz pink velvet with statement bow back. Sizes: XS, S, M.
  - "Chic Mini Party Dress" (₹800/4d, dep. ₹500) - Champagne gold sequin mini for celebrations. Sizes: XS, S, M.
  - "Premium Blazer and Trouser Set" (₹1,200/4d, dep. ₹700) - Structured camel beige tailored double-breasted suit. Sizes: S, M, L, XL.
  - "Resort Maxi Dress" (₹800/4d, dep. ₹500) - Terracotta sunset pleated georgette for vacations. Sizes: XS, S, M, L.
  - "Engagement Outfit" (₹1,400/4d, dep. ₹1,000) - Champagne gold & peach tissue organza lehenga. Sizes: S, M, L.
  - "Editorial Photoshoot Dress" (₹1,800/4d, dep. ₹1,200) - Sculpted burgundy wine architectural couture. Sizes: S, M.
  - "Seraphina Velvet Bow Mini Dress" (₹950/4d, dep. ₹600) - Contrast dusty rose bow on rich wine velvet. Sizes: XS, S, M, L.
  - "Buttercream Satin Bias-Cut Slip Dress" (₹850/4d, dep. ₹500) - Fluid champagne yellow silk with cowl neckline. Sizes: XS, S, M, L.
  - "Sovereign Plum Velvet Power Suit" (₹1,350/4d, dep. ₹800) - Tailored deep plum velvet with gold crest buttons. Sizes: S, M, L, XL.

• MEN'S COUTURE:
  - "Classic Black Tuxedo" (₹1,800/4d, dep. ₹1,200) - Super 140s wool with satin shawl lapels for black-tie galas. Sizes: 38, 40, 42, 44.
  - "Navy Blue Three-Piece Suit" (₹1,600/4d, dep. ₹1,000) - Tailored midnight navy wool blend with vest. Sizes: 38, 40, 42, 44.
  - "Wedding Sherwani" (₹2,000/4d, dep. ₹1,500) - Royal antique gold brocade with zardozi embroidery. Sizes: 38, 40, 42, 44.
  - "Ivory Embroidered Sherwani" (₹1,900/4d, dep. ₹1,400) - Pearl ivory raw silk with hand-sewn micro-pearl collar. Sizes: 38, 40, 42.
  - "Indo-Western Festive Outfit" (₹1,400/4d, dep. ₹1,000) - Asymmetric deep maroon crossover bandhgala. Sizes: 38, 40, 42, 44.
  - "Kurta-Pajama Set" (₹800/4d, dep. ₹500) - Pastel mint green Chanderi silk with thread embroidery. Sizes: S, M, L, XL.
  - "Bandhgala Jacket Set" (₹1,200/4d, dep. ₹700) - Imperial charcoal Jodhpuri cut with brass crest buttons. Sizes: 38, 40, 42, 44.
  - "Black Formal Blazer" (₹1,000/4d, dep. ₹600) - Velvet shawl lapel single-breasted evening jacket. Sizes: 38, 40, 42.
  - "Cocktail Party Suit" (₹1,400/4d, dep. ₹1,000) - Royal sapphire blue slim-fit suit. Sizes: 38, 40, 42.
  - "Garba Night Traditional Outfit" (₹1,000/4d, dep. ₹600) - Royal blue embroidered kedia with colorful dhoti pants. Sizes: Free Size.
  - "Printed Festive Kurta" (₹800/4d, dep. ₹500) - Blush pink digital print silk blend. Sizes: S, M, L, XL.
  - "Casual Linen Shirt and Trousers" (₹600/4d, dep. ₹300) - Crisp white & sand beige linen. Sizes: M, L, XL.
  - "Resort Wear Set" (₹800/4d, dep. ₹500) - Sage green tropical cabana print shirt & shorts. Sizes: M, L, XL.
  - "Premium Waistcoat Outfit" (₹1,200/4d, dep. ₹700) - Gold Tussar silk Nehru jacket over festive kurta. Sizes: 38, 40, 42, 44.
  - "Designer Wedding Guest Outfit" (₹1,600/4d, dep. ₹1,000) - Powder blue Lucknowi Chikankari kurta with stole. Sizes: 38, 40, 42.
  - "Editorial Photoshoot Outfit" (₹1,800/4d, dep. ₹1,200) - Monochrome charcoal asymmetric drape kurta. Sizes: 38, 40, 42.
  - "Savile Row Satin Shawl Lapel Tuxedo" (₹1,950/4d, dep. ₹1,200) - Midnight charcoal bespoke wool. Sizes: 38, 40, 42, 44.
  - "Jharokha Dusty Rose Silk Kurta & Nehru Jacket" (₹1,250/4d, dep. ₹700) - Hand-cut mirrorwork. Sizes: 38, 40, 42.
  - "Shahenshah Emerald Green Zardozi Indo-Western Suit" (₹1,850/4d, dep. ₹1,100) - Royal emerald velvet. Sizes: 38, 40, 42, 44.
  - "Imperial Ivory Silk Jacquard Bandhgala Suit" (₹1,650/4d, dep. ₹1,000) - Woven Varanasi jacquard. Sizes: 38, 40, 42.
  - "Sovereign Midnight Navy Velvet Dinner Jacket" (₹1,450/4d, dep. ₹900) - Midnight navy velvet. Sizes: 38, 40, 42.

• BIJOUX & ACCESSORIES:
  - "Constellation Triple-Row Baroque Pearl Choker" (₹399/4d)
  - "Lumière Freshwater Pearl Drop Earrings" (₹320/4d)
  - "Chandbali Kundan & Seed Pearl Jhumkas" (₹450/4d)
  - "Maharani Emerald & Diamond Choker Set" (₹599/4d)
  - "Starlight Starburst Crystal Chandelier Earrings" (₹380/4d)
  - "Aura 18K Gold Geometric Huggie Earrings" (₹240/4d)
  - "Artisan Oxidized Silver Coin Waist Belt" (₹280/4d)
  - "Sovereign Sculpted Gold Collar & Cuff Set" (₹340/4d)
  - "Duchess Plum Velvet Oversized Bow Barrette" (₹249/4d)
  - "Rajwada Embroidered Velvet Evening Loafers" (₹549/4d)
  - "Starlight Metallic Ankle-Wrap Strappy Heels" (₹599/4d)
  - "Royal Handcrafted Zardozi Leather Juttis" (₹380/4d)
  - "Sleek Square-Toe Ivory Leather Block Mules" (₹350/4d)
  - "Handcrafted Italian Calfskin Oxford Dress Shoes" (₹599/4d)
  - "Aurelia Solstice Crystal Mosaic Minaudière" (₹499/4d)
  - "Maharani Zardozi Royal Velvet Potli Bag" (₹380/4d)
  - "Céline Architectural Ivory Leather Shoulder Bag" (₹480/4d)
  - "Vogue Scarlet Sculpted Geometric Minaudière" (₹420/4d)
  - "Royal Banarasi Silk Zari Wedding Stole" (₹450/4d)
  - "Kallista Heritage Chronograph Dress Watch" (₹490/4d)
  - "Hand-Embroidered Raw Silk Mojari Juttis" (₹420/4d)

INSTRUCTIONS:
1. Provide a direct, polite answer in 2–4 short sentences.
2. If the user asks for a specific number of items, present exactly that count.
3. State product names clearly along with 4-day rental rates.
4. Briefly explain why each piece aligns with the requested occasion or aesthetic.
5. If no exact match exists for their requested criteria, say: "I couldn't find an exact match in the current collection."
6. Avoid lengthy introductions or unsolicited filler.`;

    if (ai) {
      try {
        const contentsPayload: any[] = [];
        
        if (Array.isArray(history) && history.length > 0) {
          for (const item of history.slice(-4)) {
            if (item.text) {
              contentsPayload.push({
                role: item.sender === 'user' ? 'user' : 'model',
                parts: [{ text: item.text }],
              });
            }
          }
        }
        
        contentsPayload.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const geminiCall = ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contentsPayload,
          config: {
            systemInstruction: systemPrompt,
          },
        });

        geminiCall.catch(() => {});

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 5000)
        );

        const response: any = await Promise.race([geminiCall, timeoutPromise]);
        const reply = response.text || generateSmartFallbackReply(message, userPreferences);
        return res.json({ reply });
      } catch (geminiError: any) {
        console.log('[RÉNÉ AI] Switching to smart styling engine fallback:', geminiError?.message || 'standby');
      }
    }

    const fallbackResponse = generateSmartFallbackReply(message, userPreferences);
    return res.json({ reply: fallbackResponse });

  } catch (error) {
    console.error('Error in /api/reni/chat:', error);
    res.status(500).json({
      reply: "I am ready to help you find the right look from RENTORA. What occasion can I style for you?"
    });
  }
});

function generateSmartFallbackReply(msg: string, prefs: any): string {
  const lower = msg.toLowerCase();
  
  if (lower.includes('garba') || lower.includes('navratri') || lower.includes('dandiya') || lower.includes('chaniya')) {
    return "For Garba, I recommend the Garba Chaniya Choli (₹1,200/4 days) with mirrorwork flare, or for men, the Garba Night Traditional Outfit (₹1,000/4 days) with embroidered kedia.";
  }

  if (lower.includes('wedding') || lower.includes('shaadi') || lower.includes('sangeet') || lower.includes('reception') || lower.includes('bride') || lower.includes('groom')) {
    return "For weddings, I recommend our Bridal Lehenga (₹2,000/4 days) in royal crimson or Wedding Guest Lehenga (₹1,200/4 days). For men, the Wedding Sherwani (₹2,000/4 days) offers classic royal tailoring.";
  }

  if (lower.includes('tuxedo') || lower.includes('suit') || lower.includes('him') || lower.includes('men') || lower.includes('man') || lower.includes('sherwani') || lower.includes('blazer')) {
    return "For formal events, our Classic Black Tuxedo (₹1,800/4 days) and Navy Blue Three-Piece Suit (₹1,600/4 days) provide sharp, structured tailoring.";
  }

  if (lower.includes('gown') || lower.includes('evening') || lower.includes('dress') || lower.includes('cocktail') || lower.includes('her')) {
    return "For evening gatherings, the Designer Evening Gown (₹1,400/4 days) or Designer Cocktail Dress (₹1,000/4 days) offer clean, elegant silhouettes.";
  }

  if (lower.includes('birthday') || lower.includes('party') || lower.includes('mini')) {
    return "For parties, the Birthday Party Dress (₹800/4 days) in rose velvet or the Chic Mini Party Dress (₹800/4 days) in champagne sequins are standout choices.";
  }

  if (lower.includes('earring') || lower.includes('jewel') || lower.includes('jhumka') || lower.includes('accessory')) {
    return "From our Bijoux collection, I recommend the Chandbali Kundan & Seed Pearl Jhumkas (₹450/4 days) or the Lumière Freshwater Pearl Drop Earrings (₹320/4 days).";
  }

  if (lower.includes('delivery') || lower.includes('time') || lower.includes('location') || lower.includes('city') || lower.includes('gujarat') || lower.includes('ahmedabad')) {
    return "RENTORA provides express doorstep delivery across Gujarat, with same-day and 24-hour service in major cities. Garments arrive sanitized and ready to wear.";
  }

  return "I am RÉNÉ, your personal stylist at RENTORA. Share your occasion, style preference, or budget, and I will recommend exact matches from our collection.";
}

// Development Vite middleware or Production static files
async function startServer() {
  // Always serve public directory assets (e.g. downloads, static assets)
  app.use(express.static(path.resolve(__dirname, 'public')));

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: { server },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  const HOST = '0.0.0.0';
  server.listen(PORT, HOST, () => {
    console.log(`RENTORA server running on http://${HOST}:${PORT}`);
  });
}

startServer();
