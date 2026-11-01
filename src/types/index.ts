export interface MenuItem {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  description: string;
  price: number; // in PKR
  priceNote?: string; // e.g. "Retail MRP" or "Per Kg / Seasonal"
  image: string;
  isAvailable: boolean;
  isFeatured?: boolean;
  isDemoItem?: boolean;
  preparationTime?: string;
  spiciness?: 'mild' | 'medium' | 'hot';
  tags?: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  itemCount?: number;
  image?: string;
  badge?: string;
}

export interface Deal {
  id: string;
  title: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  originalPrice: number;
  offerPrice: number;
  discountPercentage: number;
  promoCode?: string;
  includedItems: string[];
  serves: string;
  validUntil: string;
  isFeatured: boolean;
  isActive: boolean;
  terms: string[];
  badge?: string;
}

export interface CartItem {
  item: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export type OrderFulfilment = 'pickup' | 'delivery';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash_at_counter' | 'cash_on_delivery';

export interface OrderItem {
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  specialInstructions?: string;
}

export interface Order {
  reference: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  fulfilmentMethod: OrderFulfilment;
  deliveryAddress?: string;
  deliveryArea?: string;
  pickupTime?: string;
  instructions?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid_on_fulfilment';
  createdAt: string;
  updatedAt: string;
}

export interface Reservation {
  reference: string;
  fullName: string;
  phone: string;
  email?: string;
  date: string;
  timeSlot: string;
  guests: number;
  seatingPreference: 'indoor_family_hall' | 'outdoor_riverside' | 'executive_lounge' | 'any';
  specialRequest?: string;
  status: 'received' | 'confirmed' | 'declined' | 'cancelled';
  createdAt: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'riverside' | 'culinary' | 'ambiance' | 'family';
  image: string;
  caption: string;
}

export interface SiteSettings {
  brandName: string;
  tagline: string;
  locationName: string;
  address: string;
  highwayRef: string;
  phone: string;
  whatsapp: string;
  email: string;
  operatingHours: string;
  currency: string;
  verifiedNotice: string;
  legalDisclaimer: string;
  aboutHistory: string;
  deliveryNotice: string;
}
