import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createHmac, timingSafeEqual } from 'crypto';
import {
  initialSiteSettings,
  initialCategories,
  initialMenuItems,
  initialDeals,
  initialGallery,
} from './src/data/initialData.ts';
import { Order, Reservation, OrderStatus } from './src/types/index.ts';
import { databaseEnabled, initializeDatabase, listRecords, getRecord, saveRecord, deleteRecord } from './src/server/database.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// In-memory persistent database stores
let siteSettings = { ...initialSiteSettings };
let categories = [...initialCategories];
let menuItems = [...initialMenuItems];
let deals = [...initialDeals];
let gallery = [...initialGallery];

// Customer orders store
const orders: Map<string, Order> = new Map();

// Seed initial demonstration orders so tracking works out of the box
const demoOrder: Order = {
  reference: 'ZT-78912',
  customerName: 'Muhammad Tariq',
  customerPhone: '+923001234567',
  customerEmail: 'tariq@example.pk',
  fulfilmentMethod: 'pickup',
  pickupTime: '20 mins',
  instructions: 'Pack extra mint chutney and separate lemons please.',
  items: [
    {
      itemId: 'item-mutton-karahi',
      itemName: 'Zaytoon Special Mutton Handi Karahi',
      quantity: 1,
      unitPrice: 2850,
      subtotal: 2850,
    },
    {
      itemId: 'item-roghni-naan',
      itemName: 'Sesame Butter Roghni Naan',
      quantity: 4,
      unitPrice: 120,
      subtotal: 480,
    },
    {
      itemId: 'item-mineral-water-large',
      itemName: 'Sealed Mineral Water Bottle (1.5 Litre)',
      quantity: 1,
      unitPrice: 140,
      subtotal: 140,
    },
  ],
  subtotal: 3470,
  deliveryFee: 0,
  total: 3470,
  status: 'preparing',
  paymentMethod: 'cash_at_counter',
  paymentStatus: 'pending',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
orders.set(demoOrder.reference, demoOrder);

// Reservations store
const reservations: Map<string, Reservation> = new Map();
const demoReservation: Reservation = {
  reference: 'ZTR-4421',
  fullName: 'Farhan Ahmad',
  phone: '+923029876543',
  email: 'farhan@example.com',
  date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  timeSlot: '20:30',
  guests: 6,
  seatingPreference: 'outdoor_riverside',
  specialRequest: 'Riverside corner table for family birthday dinner.',
  status: 'confirmed',
  createdAt: new Date().toISOString(),
};
reservations.set(demoReservation.reference, demoReservation);

// Contact inquiries store
interface ContactInquiry {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  subject: string;
  message: string;
  createdAt: string;
}
const inquiries: ContactInquiry[] = [];

async function hydrateDatabase() {
  await initializeDatabase();
  if (!databaseEnabled) return;

  const savedSettings = await getRecord<typeof siteSettings>('site_settings', 'main');
  if (savedSettings) siteSettings = { ...siteSettings, ...savedSettings };
  else await saveRecord('site_settings', 'main', siteSettings);

  const savedCategories = await listRecords<typeof categories[number]>('categories');
  if (savedCategories.length) categories = savedCategories;
  else for (const item of categories) await saveRecord('categories', item.id, item);

  const savedMenuItems = await listRecords<typeof menuItems[number]>('menu_items');
  if (savedMenuItems.length) menuItems = savedMenuItems;
  else for (const item of menuItems) await saveRecord('menu_items', item.id, item);

  const savedDeals = await listRecords<typeof deals[number]>('deals');
  if (savedDeals.length) deals = savedDeals;
  else for (const item of deals) await saveRecord('deals', item.id, item);

  // Versioned image refresh updates old database records without resetting prices or other admin edits.
  const imagesMigrated = Boolean((siteSettings as typeof siteSettings & { productImagesMigratedV3?: boolean }).productImagesMigratedV3);
  if (!imagesMigrated) {
    categories = categories.map((savedItem) => {
      const seededItem = initialCategories.find((item) => item.id === savedItem.id);
      return seededItem ? { ...savedItem, image: seededItem.image } : savedItem;
    });
    menuItems = menuItems.map((savedItem) => {
      const seededItem = initialMenuItems.find((item) => item.id === savedItem.id);
      return seededItem ? { ...savedItem, image: seededItem.image } : savedItem;
    });
    deals = deals.map((savedItem) => {
      const seededItem = initialDeals.find((item) => item.id === savedItem.id);
      return seededItem ? { ...savedItem, image: seededItem.image } : savedItem;
    });
    for (const item of categories) await saveRecord('categories', item.id, item);
    for (const item of menuItems) await saveRecord('menu_items', item.id, item);
    for (const item of deals) await saveRecord('deals', item.id, item);
    siteSettings = { ...siteSettings, productImagesMigratedV3: true };
    await saveRecord('site_settings', 'main', siteSettings);
  }

  const savedGallery = await listRecords<typeof gallery[number]>('gallery');
  if (savedGallery.length) gallery = savedGallery;
  else for (const item of gallery) await saveRecord('gallery', item.id, item);

  orders.clear();
  for (const item of await listRecords<Order>('orders')) orders.set(item.reference, item);

  reservations.clear();
  for (const item of await listRecords<Reservation>('reservations')) reservations.set(item.reference, item);

  inquiries.splice(0, inquiries.length, ...(await listRecords<ContactInquiry>('inquiries')));
}

// ==========================================
// Private Admin API
// Credentials are supplied only through Render environment variables.
// ==========================================
const adminLoginAttempts = new Map<string, { count: number; resetAt: number }>();
const ADMIN_COOKIE = 'zaytoon_admin_session';
const ADMIN_SESSION_SECONDS = 8 * 60 * 60;

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

function signAdminToken(payload: string) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error('Admin session secret is not configured.');
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

function getAdminToken(req: Request): string | null {
  const cookies = (req.headers.cookie || '').split(';');
  const entry = cookies.map((part) => part.trim()).find((part) => part.startsWith(ADMIN_COOKIE + '='));
  return entry ? decodeURIComponent(entry.slice(ADMIN_COOKIE.length + 1)) : null;
}

function isAdminAuthenticated(req: Request) {
  const token = getAdminToken(req);
  if (!token) return false;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  try {
    if (!safeEqual(signature, signAdminToken(payload))) return false;
    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return decoded.user === process.env.ADMIN_USERNAME && Number(decoded.exp) > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function requireAdmin(req: Request, res: Response, next: () => void) {
  if (!isAdminAuthenticated(req)) {
    res.status(401).json({ success: false, message: 'Admin login required.' });
    return;
  }
  next();
}

app.get('/api/admin/config-status', (_req: Request, res: Response) => {
  const usernameConfigured = Boolean(process.env.ADMIN_USERNAME);
  const passwordConfigured = Boolean(process.env.ADMIN_PASSWORD);
  const sessionSecretLength = (process.env.ADMIN_SESSION_SECRET || '').length;
  res.json({
    usernameConfigured,
    passwordConfigured,
    sessionSecretConfigured: sessionSecretLength > 0,
    sessionSecretValid: sessionSecretLength >= 32,
    ready: usernameConfigured && passwordConfigured && sessionSecretLength >= 32,
  });
});

app.post('/api/admin/login', (req: Request, res: Response) => {
  const username = String(req.body?.username || '');
  const password = String(req.body?.password || '');
  const configuredUsername = process.env.ADMIN_USERNAME || '';
  const configuredPassword = process.env.ADMIN_PASSWORD || '';
  const sessionSecret = process.env.ADMIN_SESSION_SECRET || '';

  if (!configuredUsername || !configuredPassword || sessionSecret.length < 32) {
    res.status(503).json({ success: false, message: 'Admin credentials are not configured in the hosting environment.' });
    return;
  }

  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const attempts = adminLoginAttempts.get(ip);
  if (attempts && attempts.resetAt > now && attempts.count >= 5) {
    res.status(429).json({ success: false, message: 'Too many login attempts. Try again in 15 minutes.' });
    return;
  }

  if (!safeEqual(username, configuredUsername) || !safeEqual(password, configuredPassword)) {
    const nextAttempts = attempts && attempts.resetAt > now
      ? { count: attempts.count + 1, resetAt: attempts.resetAt }
      : { count: 1, resetAt: now + 15 * 60 * 1000 };
    adminLoginAttempts.set(ip, nextAttempts);
    res.status(401).json({ success: false, message: 'Incorrect username or password.' });
    return;
  }

  adminLoginAttempts.delete(ip);
  const payload = Buffer.from(JSON.stringify({
    user: configuredUsername,
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS,
  })).toString('base64url');
  const token = payload + '.' + signAdminToken(payload);
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${ADMIN_COOKIE}=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=${ADMIN_SESSION_SECONDS}${secure}`);
  res.json({ success: true, username: configuredUsername });
});

app.post('/api/admin/logout', (_req: Request, res: Response) => {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${ADMIN_COOKIE}=; HttpOnly; SameSite=Strict; Path=/api/admin; Max-Age=0${secure}`);
  res.json({ success: true });
});

app.get('/api/admin/me', requireAdmin, (_req: Request, res: Response) => {
  res.json({ success: true, username: process.env.ADMIN_USERNAME });
});

app.get('/api/admin/dashboard', requireAdmin, (_req: Request, res: Response) => {
  const orderList = Array.from(orders.values());
  const reservationList = Array.from(reservations.values());
  res.json({
    success: true,
    data: {
      totalOrders: orderList.length,
      pendingOrders: orderList.filter((item) => item.status === 'pending').length,
      activeReservations: reservationList.filter((item) => item.status === 'received' || item.status === 'confirmed').length,
      unreadMessages: inquiries.length,
      recentOrders: orderList.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
      recentReservations: reservationList.sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5),
    },
  });
});

app.get('/api/admin/orders', requireAdmin, (_req: Request, res: Response) => {
  const data = Array.from(orders.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  res.json({ success: true, data });
});

app.patch('/api/admin/orders/:reference/status', requireAdmin, async (req: Request, res: Response) => {
  const order = orders.get(req.params.reference);
  const allowed: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'completed', 'cancelled'];
  const status = req.body?.status as OrderStatus;
  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found.' });
    return;
  }
  if (!allowed.includes(status)) {
    res.status(400).json({ success: false, message: 'Invalid order status.' });
    return;
  }
  order.status = status;
  order.updatedAt = new Date().toISOString();
  try {
    if (databaseEnabled) await saveRecord('orders', order.reference, order);
    res.json({ success: true, data: order });
  } catch {
    res.status(500).json({ success: false, message: 'Could not save order update.' });
  }
});

app.get('/api/admin/reservations', requireAdmin, (_req: Request, res: Response) => {
  const data = Array.from(reservations.values()).sort((a, b) => (a.date + a.timeSlot).localeCompare(b.date + b.timeSlot));
  res.json({ success: true, data });
});

app.patch('/api/admin/reservations/:reference/status', requireAdmin, async (req: Request, res: Response) => {
  const reservation = reservations.get(req.params.reference);
  const allowed = ['received', 'confirmed', 'declined', 'cancelled'];
  const status = String(req.body?.status || '');
  if (!reservation) {
    res.status(404).json({ success: false, message: 'Reservation not found.' });
    return;
  }
  if (!allowed.includes(status)) {
    res.status(400).json({ success: false, message: 'Invalid reservation status.' });
    return;
  }
  reservation.status = status as Reservation['status'];
  try {
    if (databaseEnabled) await saveRecord('reservations', reservation.reference, reservation);
    res.json({ success: true, data: reservation });
  } catch {
    res.status(500).json({ success: false, message: 'Could not save reservation update.' });
  }
});

app.get('/api/admin/messages', requireAdmin, (_req: Request, res: Response) => {
  res.json({ success: true, data: [...inquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt)) });
});

// Admin content management: menu, categories, deals, gallery and site settings.
const adminCollections = ['menu_items', 'categories', 'deals', 'gallery', 'site_settings'] as const;
type AdminCollection = typeof adminCollections[number];

function getAdminCollection(collection: AdminCollection): any[] {
  if (collection === 'menu_items') return menuItems;
  if (collection === 'categories') return categories;
  if (collection === 'deals') return deals;
  if (collection === 'gallery') return gallery;
  return [siteSettings];
}

function setAdminCollection(collection: AdminCollection, data: any[]) {
  if (collection === 'menu_items') menuItems = data;
  else if (collection === 'categories') categories = data;
  else if (collection === 'deals') deals = data;
  else if (collection === 'gallery') gallery = data;
  else if (data[0]) siteSettings = data[0];
}

app.get('/api/admin/content/:collection', requireAdmin, (req: Request, res: Response) => {
  const collection = req.params.collection as AdminCollection;
  if (!adminCollections.includes(collection)) {
    res.status(404).json({ success: false, message: 'Unknown content section.' });
    return;
  }
  res.json({ success: true, data: getAdminCollection(collection) });
});

app.put('/api/admin/content/:collection/:id', requireAdmin, async (req: Request, res: Response) => {
  const collection = req.params.collection as AdminCollection;
  const id = String(req.params.id || '');
  const record = req.body?.data;
  if (!adminCollections.includes(collection)) {
    res.status(404).json({ success: false, message: 'Unknown content section.' });
    return;
  }
  if (!record || typeof record !== 'object' || Array.isArray(record) || !id) {
    res.status(400).json({ success: false, message: 'A valid content record is required.' });
    return;
  }
  if (collection === 'site_settings' && id !== 'main') {
    res.status(400).json({ success: false, message: 'Site settings use the main record.' });
    return;
  }
  if (collection !== 'site_settings' && String(record.id || '') !== id) {
    res.status(400).json({ success: false, message: 'Record ID must match the URL.' });
    return;
  }
  try {
    if (collection === 'site_settings') {
      siteSettings = { ...siteSettings, ...record };
      if (databaseEnabled) await saveRecord('site_settings', 'main', siteSettings);
      res.json({ success: true, data: siteSettings });
      return;
    }
    const current = getAdminCollection(collection);
    const index = current.findIndex((item) => String(item.id) === id);
    const updated = [...current];
    if (index >= 0) updated[index] = record;
    else updated.push(record);
    setAdminCollection(collection, updated);
    if (databaseEnabled) await saveRecord(collection, id, record);
    res.json({ success: true, data: record });
  } catch {
    res.status(500).json({ success: false, message: 'Could not save content.' });
  }
});

app.delete('/api/admin/content/:collection/:id', requireAdmin, async (req: Request, res: Response) => {
  const collection = req.params.collection as AdminCollection;
  const id = String(req.params.id || '');
  if (!adminCollections.includes(collection)) {
    res.status(404).json({ success: false, message: 'Unknown content section.' });
    return;
  }
  if (collection === 'site_settings') {
    res.status(400).json({ success: false, message: 'Site settings cannot be deleted.' });
    return;
  }
  try {
    const updated = getAdminCollection(collection).filter((item) => String(item.id) !== id);
    setAdminCollection(collection, updated);
    if (databaseEnabled) await deleteRecord(collection, id);
    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false, message: 'Could not delete content.' });
  }
});

// ==========================================
// API v1 Routes (Clean Public Surface)
// ==========================================

// Public Site Settings
app.get('/api/v1/site-settings/public', (_req: Request, res: Response) => {
  res.json({ success: true, data: siteSettings });
});

// Menu Categories
app.get('/api/v1/menu/categories', (_req: Request, res: Response) => {
  const categoriesWithCount = categories.map((cat) => ({
    ...cat,
    itemCount: menuItems.filter((i) => i.categoryId === cat.id && i.isAvailable).length,
  }));
  res.json({ success: true, data: categoriesWithCount });
});

// Menu Items
app.get('/api/v1/menu/items', (req: Request, res: Response) => {
  const { category, search, featured } = req.query;
  let filtered = [...menuItems];

  if (category) {
    const targetCat = categories.find((c) => c.slug === category || c.id === category);
    if (targetCat) {
      filtered = filtered.filter((i) => i.categoryId === targetCat.id);
    }
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q) ||
        i.categoryName.toLowerCase().includes(q)
    );
  }

  if (featured === 'true') {
    filtered = filtered.filter((i) => i.isFeatured);
  }

  res.json({ success: true, count: filtered.length, data: filtered });
});

// Single Menu Item
app.get('/api/v1/menu/items/:slug', (req: Request, res: Response) => {
  const item = menuItems.find((i) => i.slug === req.params.slug || i.id === req.params.slug);
  if (!item) {
    res.status(404).json({ success: false, message: 'Menu item not found' });
    return;
  }
  res.json({ success: true, data: item });
});

// Active Deals & Promotions
app.get('/api/v1/deals/active', (_req: Request, res: Response) => {
  const activeDeals = deals.filter((d) => d.isActive);
  res.json({ success: true, count: activeDeals.length, data: activeDeals });
});

// Single Deal
app.get('/api/v1/deals/:slug', (req: Request, res: Response) => {
  const deal = deals.find((d) => d.slug === req.params.slug || d.id === req.params.slug);
  if (!deal) {
    res.status(404).json({ success: false, message: 'Deal not found or expired' });
    return;
  }
  res.json({ success: true, data: deal });
});

// Gallery Items
app.get('/api/v1/gallery', (_req: Request, res: Response) => {
  res.json({ success: true, data: gallery });
});

// Contact & Location Information
app.get('/api/v1/contact', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      locationName: siteSettings.locationName,
      address: siteSettings.address,
      highwayRef: siteSettings.highwayRef,
      phone: siteSettings.phone,
      whatsapp: siteSettings.whatsapp,
      email: siteSettings.email,
      operatingHours: siteSettings.operatingHours,
      verifiedNotice: siteSettings.verifiedNotice,
    },
  });
});

// Submit Online Order
app.post('/api/v1/orders', async (req: Request, res: Response) => {
  try {
    const {
      customerName,
      customerPhone,
      customerEmail,
      fulfilmentMethod,
      deliveryAddress,
      deliveryArea,
      pickupTime,
      instructions,
      items,
      paymentMethod,
    } = req.body;

    if (!customerName || !customerPhone || !items || !Array.isArray(items) || items.length === 0) {
      res.status(400).json({
        success: false,
        message: 'Invalid order submission. Name, phone number, and items are required.',
      });
      return;
    }

    if (fulfilmentMethod === 'delivery' && !deliveryAddress) {
      res.status(400).json({
        success: false,
        message: 'Delivery address is required for home/highway delivery orders.',
      });
      return;
    }

    // Server-side validation of item prices & availability
    let subtotal = 0;
    const validatedItems = items.map((cartItem: { itemId: string; quantity: number; specialInstructions?: string }) => {
      const dbItem = menuItems.find((i) => i.id === cartItem.itemId);
      if (!dbItem || !dbItem.isAvailable) {
        throw new Error(`Item ${cartItem.itemId} is currently unavailable.`);
      }
      const qty = Math.max(1, Math.floor(cartItem.quantity || 1));
      const lineTotal = dbItem.price * qty;
      subtotal += lineTotal;
      return {
        itemId: dbItem.id,
        itemName: dbItem.name,
        quantity: qty,
        unitPrice: dbItem.price,
        subtotal: lineTotal,
        specialInstructions: cartItem.specialInstructions || '',
      };
    });

    const deliveryFee = fulfilmentMethod === 'delivery' ? 200 : 0;
    const total = subtotal + deliveryFee;

    // Generate unique human-readable order reference: ZT-XXXXX
    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const reference = `ZT-${randomSuffix}`;

    const newOrder: Order = {
      reference,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail ? customerEmail.trim() : undefined,
      fulfilmentMethod: fulfilmentMethod === 'delivery' ? 'delivery' : 'pickup',
      deliveryAddress: deliveryAddress ? deliveryAddress.trim() : undefined,
      deliveryArea: deliveryArea || 'Dera Ghazi Khan / Ghazi Ghat',
      pickupTime: pickupTime || '25-30 minutes',
      instructions: instructions ? instructions.trim() : undefined,
      items: validatedItems,
      subtotal,
      deliveryFee,
      total,
      status: 'pending',
      paymentMethod: paymentMethod === 'cash_on_delivery' ? 'cash_on_delivery' : 'cash_at_counter',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    orders.set(reference, newOrder);
    if (databaseEnabled) await saveRecord('orders', reference, newOrder);

    res.status(201).json({
      success: true,
      message: 'Order received successfully. The restaurant will review and confirm your order.',
      data: newOrder,
    });
  } catch (err: any) {
    res.status(400).json({ success: false, message: err.message || 'Failed to process order' });
  }
});

// Track Order (Secure: requires matching phone or exact reference)
app.get('/api/v1/orders/track', async (req: Request, res: Response) => {
  const { reference, phone } = req.query;

  if (!reference || typeof reference !== 'string') {
    res.status(400).json({ success: false, message: 'Order reference is required.' });
    return;
  }

  const cleanRef = reference.trim().toUpperCase();
  const order = orders.get(cleanRef);

  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found. Please verify the reference code.' });
    return;
  }

  // Security check: if phone is provided, match last 4 digits
  if (phone && typeof phone === 'string') {
    const cleanPhone = phone.replace(/\D/g, '');
    const orderPhoneClean = order.customerPhone.replace(/\D/g, '');
    if (!orderPhoneClean.endsWith(cleanPhone.slice(-4))) {
      res.status(403).json({
        success: false,
        message: 'Phone number verification failed. Please enter the phone number used during checkout.',
      });
      return;
    }
  }

  res.json({
    success: true,
    data: {
      reference: order.reference,
      customerName: order.customerName,
      customerPhone: order.customerPhone.slice(0, 4) + '****' + order.customerPhone.slice(-3),
      fulfilmentMethod: order.fulfilmentMethod,
      status: order.status,
      items: order.items,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      total: order.total,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      pickupTime: order.pickupTime,
      deliveryArea: order.deliveryArea,
      paymentMethod: order.paymentMethod,
    },
  });
});

// Check Reservation Slot Availability
app.get('/api/v1/reservations/availability', (req: Request, res: Response) => {
  const { date } = req.query;
  const targetDate = typeof date === 'string' ? date : new Date().toISOString().split('T')[0];

  const bookedSlots = Array.from(reservations.values())
    .filter((r) => r.date === targetDate && r.status !== 'cancelled' && r.status !== 'declined')
    .map((r) => r.timeSlot);

  // Standard dining slots
  const allSlots = [
    '13:00', '14:00', '15:00', '17:00',
    '18:30', '19:30', '20:30', '21:30', '22:30', '23:30', '01:00'
  ];

  const availability = allSlots.map((slot) => {
    const bookingsInSlot = bookedSlots.filter((s) => s === slot).length;
    // Limit to max 5 table reservations per slot to prevent double booking
    return {
      slot,
      available: bookingsInSlot < 5,
      remainingTables: Math.max(0, 5 - bookingsInSlot),
    };
  });

  res.json({ success: true, date: targetDate, data: availability });
});

// Book Table Reservation
app.post('/api/v1/reservations', async (req: Request, res: Response) => {
  try {
    const { fullName, phone, email, date, timeSlot, guests, seatingPreference, specialRequest } = req.body;

    if (!fullName || !phone || !date || !timeSlot || !guests) {
      res.status(400).json({
        success: false,
        message: 'Please provide full name, mobile number, reservation date, time, and guest count.',
      });
      return;
    }

    const guestCount = parseInt(guests, 10);
    if (isNaN(guestCount) || guestCount < 1 || guestCount > 40) {
      res.status(400).json({
        success: false,
        message: 'Guest count must be between 1 and 40 persons. For larger events, please contact us directly.',
      });
      return;
    }

    // Verify slot capacity
    const currentBookings = Array.from(reservations.values()).filter(
      (r) => r.date === date && r.timeSlot === timeSlot && r.status !== 'cancelled' && r.status !== 'declined'
    ).length;

    if (currentBookings >= 5) {
      res.status(409).json({
        success: false,
        message: 'The selected time slot is fully booked. Please select an alternate dining hour.',
      });
      return;
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const reference = `ZTR-${randomSuffix}`;

    const newReservation: Reservation = {
      reference,
      fullName: fullName.trim(),
      phone: phone.trim(),
      email: email ? email.trim() : undefined,
      date,
      timeSlot,
      guests: guestCount,
      seatingPreference: seatingPreference || 'any',
      specialRequest: specialRequest ? specialRequest.trim() : undefined,
      status: 'received',
      createdAt: new Date().toISOString(),
    };

    reservations.set(reference, newReservation);
    if (databaseEnabled) await saveRecord('reservations', reference, newReservation);

    res.status(201).json({
      success: true,
      message: 'Reservation request received. Our host will confirm availability shortly via phone call.',
      data: newReservation,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Failed to process reservation request' });
  }
});

// Submit Contact Message
app.post('/api/v1/contact-messages', async (req: Request, res: Response) => {
  try {
    const { fullName, phone, email, subject, message } = req.body;

  if (!fullName || !phone || !message) {
    res.status(400).json({
      success: false,
      message: 'Full name, phone number, and inquiry message are required.',
    });
    return;
  }

  const inquiry: ContactInquiry = {
    id: `inq-${Date.now()}`,
    fullName: fullName.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : undefined,
    subject: subject ? subject.trim() : 'General Inquiry',
    message: message.trim(),
    createdAt: new Date().toISOString(),
  };

  inquiries.push(inquiry);
  if (databaseEnabled) await saveRecord('inquiries', inquiry.id, inquiry);

    res.status(201).json({
      success: true,
      message: 'Thank you for your message. Our hospitality manager will contact you promptly.',
      data: { id: inquiry.id },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to save contact message.' });
  }
});

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    database: databaseEnabled ? 'connected' : 'development-memory-mode',
    service: 'zaytoon-public-api',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ==========================================
// Vite Integration (Dev) / Static Serving (Prod)
// ==========================================
async function startServer() {
  const serverPort = Number(process.env.PORT) || 3000;
  await hydrateDatabase();

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0' },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Serve transformed index.html for all non-API SPA routes
    app.use('*', async (req: Request, res: Response, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api/')) {
        return next();
      }
      try {
        const indexPath = path.resolve(__dirname, 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        if (vite) {
          vite.ssrFixStacktrace(e);
        }
        next(e);
      }
    });
  } else {
    // Production: serve built static files
    const distPath = path.resolve(__dirname, 'dist');

    // Serve original restaurant photos directly from the repository's public folder.
    // This keeps /images/* working even if a deployment build omits Vite's public copy.
    app.use(
      '/images',
      express.static(path.resolve(__dirname, 'public/images'), {
        maxAge: '7d',
        fallthrough: false,
      })
    );

    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(serverPort, '0.0.0.0', () => {
    console.log(`Zaytoon Restaurant Server running at http://0.0.0.0:${serverPort}`);
  });
}

startServer();
