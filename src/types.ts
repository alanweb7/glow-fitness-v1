export type OrderStatus = 'Pendente' | 'Pago' | 'Em Separação' | 'Enviado' | 'Entregue' | 'Cancelado' | 'Reembolsado';

export type PaymentMethod = 'pix' | 'credit_card' | 'boleto';

export interface ProductVariation {
  id: string;
  colorName: string;
  colorHex: string;
  size: 'PP' | 'P' | 'M' | 'G' | 'GG';
  sku: string;
  price: number;
  promotionalPrice?: number;
  stock: number;
  image?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  shortDescription: string;
  fullDescription: string;
  categoryId: string;
  categoryName: string;
  brand: string;
  collection?: string;
  price: number;
  promotionalPrice?: number;
  sku: string;
  barcode?: string;
  stock: number;
  minStock: number;
  status: 'active' | 'draft' | 'archived';
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  isOnSale: boolean;
  tags: string[];
  images: string[];
  videoUrl?: string;
  variations: ProductVariation[];
  rating: number;
  reviewsCount: number;
  weightKg: number;
  dimensionsCm: {
    height: number;
    width: number;
    length: number;
  };
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image: string; // circular thumbnail for home
  icon?: string;
  order: number;
  parentId?: string;
  active: boolean;
  isHighlightCircle?: boolean; // e.g. "NOVIDADES" circle
  highlightColor?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  variationId?: string;
  colorName?: string;
  size?: string;
  quantity: number;
  maxStock: number;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'fixed' | 'percentage' | 'free_shipping';
  value: number;
  minOrderValue: number;
  maxUsage: number;
  usedCount: number;
  expiresAt: string;
  active: boolean;
}

export interface ShippingOption {
  id: string;
  name: string;
  company: string;
  price: number;
  deliveryDays: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    cpf: string;
  };
  shippingAddress: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentDetails?: {
    cardBrand?: string;
    installments?: number;
    pixQrCode?: string;
    pixCopyPaste?: string;
    boletoBarcode?: string;
  };
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  trackingCode?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  ordersCount: number;
  totalSpent: number;
  createdAt: string;
}

export interface HomeSectionConfig {
  id: string;
  title: string;
  type: 'hero' | 'announcement' | 'categories' | 'highlights' | 'about' | 'banners' | 'testimonials' | 'instagram' | 'blog' | 'newsletter' | 'footer';
  enabled: boolean;
  order: number;
  settings?: Record<string, any>;
}

export interface Banner {
  id: string;
  title: string;
  subtitle?: string;
  desktopImage: string;
  mobileImage: string;
  ctaText?: string;
  ctaUrl?: string;
  position: 'hero' | 'middle' | 'popup';
  active: boolean;
  order: number;
}

export interface ThemeConfig {
  primaryColor: string; // e.g. #C18282 (Dusty Rose)
  secondaryColor: string; // e.g. #1A1A1A (Dark Charcoal)
  accentColor: string; // e.g. #EAD3D0 (Soft Rose Cream)
  backgroundColor: string; // e.g. #FAF7F6
  textColor: string; // e.g. #222222
  cardBackgroundColor: string; // e.g. #FFFFFF
  buttonRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  fontFamily: 'sans' | 'serif' | 'display';
}

export interface StoreSettings {
  storeName: string;
  slogan: string;
  logoUrl: string;
  faviconUrl: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  facebook: string;
  tiktok: string;
  youtube: string;
  address: string;
  businessHours: string;
  freeShippingThreshold: number;
  mercadoPagoPublicKey: string;
  mercadoPagoAccessToken: string;
  seoTitle: string;
  seoDescription: string;
  googleAnalyticsId: string;
  metaPixelId: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  author: string;
  rating: number; // 1 to 5
  comment: string;
  photoUrl?: string;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage: string;
  author: string;
  tags: string[];
  createdAt: string;
}
