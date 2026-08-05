import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import {
  Product,
  Category,
  CartItem,
  Order,
  Coupon,
  Banner,
  ThemeConfig,
  StoreSettings,
  HomeSectionConfig,
  Review,
  BlogPost,
} from '../types';

// Snake_case DB row -> camelCase TS mapping helpers
const mapProduct = (row: any): Product => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  shortDescription: row.short_description,
  fullDescription: row.full_description,
  categoryId: row.category_id,
  categoryName: row.category_name,
  brand: row.brand,
  collection: row.collection,
  price: Number(row.price),
  promotionalPrice: row.promotional_price ? Number(row.promotional_price) : undefined,
  sku: row.sku,
  barcode: row.barcode,
  stock: row.stock,
  minStock: row.min_stock,
  status: row.status,
  isFeatured: row.is_featured,
  isNew: row.is_new,
  isBestSeller: row.is_best_seller,
  isOnSale: row.is_on_sale,
  tags: row.tags || [],
  images: row.images || [],
  videoUrl: row.video_url,
  rating: Number(row.rating),
  reviewsCount: row.reviews_count,
  weightKg: Number(row.weight_kg),
  dimensionsCm: row.dimensions_cm || { height: 0, width: 0, length: 0 },
  createdAt: row.created_at,
  variations: [],
});

const mapCategory = (row: any): Category => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  description: row.description,
  image: row.image,
  icon: row.icon,
  order: row.order,
  parentId: row.parent_id,
  active: row.active,
  isHighlightCircle: row.is_highlight_circle,
  highlightColor: row.highlight_color,
});

const mapCoupon = (row: any): Coupon => ({
  id: row.id,
  code: row.code,
  type: row.type,
  value: Number(row.value),
  minOrderValue: Number(row.min_order_value),
  maxUsage: row.max_usage,
  usedCount: row.used_count,
  expiresAt: row.expires_at,
  active: row.active,
});

const mapBanner = (row: any): Banner => ({
  id: row.id,
  title: row.title,
  subtitle: row.subtitle,
  desktopImage: row.desktop_image,
  mobileImage: row.mobile_image,
  ctaText: row.cta_text,
  ctaUrl: row.cta_url,
  position: row.position,
  active: row.active,
  order: row.order,
});

const mapReview = (row: any): Review => ({
  id: row.id,
  productId: row.product_id,
  productName: row.product_name,
  author: row.author,
  rating: row.rating,
  comment: row.comment,
  photoUrl: row.photo_url,
  status: row.status,
  createdAt: row.created_at,
});

const mapBlogPost = (row: any): BlogPost => ({
  id: row.id,
  title: row.title,
  slug: row.slug,
  summary: row.summary,
  content: row.content,
  coverImage: row.cover_image,
  author: row.author,
  tags: row.tags || [],
  createdAt: row.created_at,
});

const mapHomeSection = (row: any): HomeSectionConfig => ({
  id: row.id,
  title: row.title,
  type: row.type,
  enabled: row.enabled,
  order: row.order,
  settings: row.settings,
});

const mapTheme = (row: any): ThemeConfig => ({
  primaryColor: row.primary_color,
  secondaryColor: row.secondary_color,
  accentColor: row.accent_color,
  backgroundColor: row.background_color,
  textColor: row.text_color,
  cardBackgroundColor: row.card_background_color,
  buttonRadius: row.button_radius,
  fontFamily: row.font_family,
});

const mapSettings = (row: any): StoreSettings => ({
  storeName: row.store_name,
  slogan: row.slogan,
  logoUrl: row.logo_url,
  faviconUrl: row.favicon_url,
  phone: row.phone,
  whatsapp: row.whatsapp,
  email: row.email,
  instagram: row.instagram,
  facebook: row.facebook,
  tiktok: row.tiktok,
  youtube: row.youtube,
  address: row.address,
  businessHours: row.business_hours,
  freeShippingThreshold: Number(row.free_shipping_threshold),
  mercadoPagoPublicKey: row.mercado_pago_public_key,
  mercadoPagoAccessToken: row.mercado_pago_access_token,
  seoTitle: row.seo_title,
  seoDescription: row.seo_description,
  googleAnalyticsId: row.google_analytics_id,
  metaPixelId: row.meta_pixel_id,
});

const mapOrder = (row: any): Order => ({
  id: row.id,
  orderNumber: row.order_number,
  customer: row.customer,
  shippingAddress: row.shipping_address,
  items: [],
  subtotal: Number(row.subtotal),
  discount: Number(row.discount),
  shippingFee: Number(row.shipping_fee),
  total: Number(row.total),
  paymentMethod: row.payment_method,
  paymentDetails: row.payment_details,
  status: row.status,
  statusHistory: row.status_history || [],
  trackingCode: row.tracking_code,
  createdAt: row.created_at,
});

interface StoreContextType {
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  wishlist: string[];
  orders: Order[];
  coupons: Coupon[];
  banners: Banner[];
  theme: ThemeConfig;
  settings: StoreSettings;
  homeSections: HomeSectionConfig[];
  reviews: Review[];
  blogPosts: BlogPost[];

  searchQuery: string;
  isCartOpen: boolean;
  isQuickSearchOpen: boolean;
  isAiStylistOpen: boolean;
  activeAdminTab: string;

  setSearchQuery: (query: string) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsQuickSearchOpen: (open: boolean) => void;
  setIsAiStylistOpen: (open: boolean) => void;
  setActiveAdminTab: (tab: string) => void;

  addToCart: (product: Product, selectedColor?: string, selectedSize?: string, qty?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;

  toggleWishlist: (productId: string) => void;

  updateProduct: (product: Product) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  deleteProduct: (id: string) => void;
  updateCategory: (category: Category) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
  updateOrderStatus: (orderId: string, status: Order['status'], trackingCode?: string, note?: string) => void;
  updateTheme: (newTheme: Partial<ThemeConfig>) => void;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  updateHomeSections: (sections: HomeSectionConfig[]) => void;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount'>) => void;
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'status'>) => void;
  createOrder: (orderData: any) => Promise<Order>;
  updateBanner: (banner: Banner) => void;
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  deleteBanner: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('glow_fitness_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('glow_fitness_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [theme, setTheme] = useState<ThemeConfig>({
    primaryColor: '#C18282',
    secondaryColor: '#1A1A1A',
    accentColor: '#EAD3D0',
    backgroundColor: '#FAF7F6',
    textColor: '#1A1A1A',
    cardBackgroundColor: '#FFFFFF',
    buttonRadius: 'sm',
    fontFamily: 'sans',
  });
  const [settings, setSettings] = useState<StoreSettings>({
    storeName: 'Glow Fitness',
    slogan: '',
    logoUrl: '',
    faviconUrl: '',
    phone: '',
    whatsapp: '',
    email: '',
    instagram: '',
    facebook: '',
    tiktok: '',
    youtube: '',
    address: '',
    businessHours: '',
    freeShippingThreshold: 199,
    mercadoPagoPublicKey: '',
    mercadoPagoAccessToken: '',
    seoTitle: '',
    seoDescription: '',
    googleAnalyticsId: '',
    metaPixelId: '',
  });
  const [homeSections, setHomeSections] = useState<HomeSectionConfig[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);
  const [isAiStylistOpen, setIsAiStylistOpen] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard');

  useEffect(() => {
    localStorage.setItem('glow_fitness_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('glow_fitness_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Load all data from Supabase on mount
  useEffect(() => {
    const loadAll = async () => {
      const [prodRes, catRes, coupRes, banRes, themeRes, settRes, secRes, revRes, blogRes, ordRes] = await Promise.all([
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('categories').select('*').order('order'),
        supabase.from('coupons').select('*'),
        supabase.from('banners').select('*').order('order'),
        supabase.from('theme_config').select('*').eq('id', 'default').single(),
        supabase.from('store_settings').select('*').eq('id', 'default').single(),
        supabase.from('home_sections').select('*').order('order'),
        supabase.from('reviews').select('*').order('created_at', { ascending: false }),
        supabase.from('blog_posts').select('*').order('created_at', { ascending: false }),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
      ]);

      // Load variations for all products
      const { data: variations } = await supabase.from('product_variations').select('*');

      if (prodRes.data) {
        const mapped = prodRes.data.map(mapProduct);
        // Attach variations to products
        mapped.forEach(p => {
          p.variations = (variations || [])
            .filter((v: any) => v.product_id === p.id)
            .map((v: any) => ({
              id: v.id,
              colorName: v.color_name,
              colorHex: v.color_hex,
              size: v.size,
              sku: v.sku,
              price: Number(v.price),
              promotionalPrice: v.promotional_price ? Number(v.promotional_price) : undefined,
              stock: v.stock,
              image: v.image,
            }));
        });
        setProducts(mapped);
      }

      if (catRes.data) setCategories(catRes.data.map(mapCategory));
      if (coupRes.data) setCoupons(coupRes.data.map(mapCoupon));
      if (banRes.data) setBanners(banRes.data.map(mapBanner));
      if (themeRes.data) setTheme(mapTheme(themeRes.data));
      if (settRes.data) setSettings(mapSettings(settRes.data));
      if (secRes.data) setHomeSections(secRes.data.map(mapHomeSection));
      if (revRes.data) setReviews(revRes.data.map(mapReview));
      if (blogRes.data) setBlogPosts(blogRes.data.map(mapBlogPost));
      if (ordRes.data) {
        // Load order items
        const { data: items } = await supabase.from('order_items').select('*');
        const mappedOrders = ordRes.data.map(mapOrder);
        mappedOrders.forEach(o => {
          o.items = (items || [])
            .filter((i: any) => i.order_id === o.id)
            .map((i: any) => ({
              id: i.id,
              productId: i.product_id,
              productName: i.product_name,
              productImage: i.product_image,
              price: Number(i.price),
              colorName: i.color_name,
              size: i.size,
              quantity: i.quantity,
              maxStock: i.max_stock,
            }));
        });
        setOrders(mappedOrders);
      }
    };

    loadAll();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-secondary', theme.secondaryColor);
    root.style.setProperty('--color-accent', theme.accentColor);
    root.style.setProperty('--color-bg', theme.backgroundColor);
    root.style.setProperty('--color-text', theme.textColor);
    root.style.setProperty('--color-card', theme.cardBackgroundColor);
  }, [theme]);

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: Product, selectedColor?: string, selectedSize?: string, qty = 1) => {
    const variation = product.variations.find(v => v.colorName === selectedColor && v.size === selectedSize);
    const cartItemId = `${product.id}-${selectedColor || 'default'}-${selectedSize || 'default'}`;

    setCart(prev => {
      const existing = prev.find(item => item.id === cartItemId);
      if (existing) {
        return prev.map(item =>
          item.id === cartItemId
            ? { ...item, quantity: Math.min(item.maxStock, item.quantity + qty) }
            : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          productId: product.id,
          productName: product.name,
          productImage: variation?.image || product.images[0],
          price: product.promotionalPrice || product.price,
          variationId: variation?.id,
          colorName: selectedColor || product.variations[0]?.colorName,
          size: selectedSize || product.variations[0]?.size || 'M',
          quantity: qty,
          maxStock: variation?.stock || product.stock || 20,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.id !== cartItemId));
  };

  const updateCartQuantity = (cartItemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart(prev =>
      prev.map(item => (item.id === cartItemId ? { ...item, quantity: Math.min(item.maxStock, qty) } : item))
    );
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (productId: string) => {
    setWishlist(prev =>
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  // Admin Actions via Supabase
  const updateProduct = async (updated: Product) => {
    setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    const { variations, ...prodData } = updated;
    await supabase.from('products').update({
      name: prodData.name,
      slug: prodData.slug,
      short_description: prodData.shortDescription,
      full_description: prodData.fullDescription,
      category_id: prodData.categoryId,
      category_name: prodData.categoryName,
      brand: prodData.brand,
      collection: prodData.collection,
      price: prodData.price,
      promotional_price: prodData.promotionalPrice,
      sku: prodData.sku,
      barcode: prodData.barcode,
      stock: prodData.stock,
      min_stock: prodData.minStock,
      status: prodData.status,
      is_featured: prodData.isFeatured,
      is_new: prodData.isNew,
      is_best_seller: prodData.isBestSeller,
      is_on_sale: prodData.isOnSale,
      tags: prodData.tags,
      images: prodData.images,
      video_url: prodData.videoUrl,
      rating: prodData.rating,
      reviews_count: prodData.reviewsCount,
      weight_kg: prodData.weightKg,
      dimensions_cm: prodData.dimensionsCm,
    }).eq('id', updated.id);

    // Sync variations
    await supabase.from('product_variations').delete().eq('product_id', updated.id);
    if (variations?.length) {
      await supabase.from('product_variations').insert(variations.map(v => ({
        id: v.id,
        product_id: updated.id,
        color_name: v.colorName,
        color_hex: v.colorHex,
        size: v.size,
        sku: v.sku,
        price: v.price,
        promotional_price: v.promotionalPrice,
        stock: v.stock,
        image: v.image,
      })));
    }
  };

  const addProduct = async (newProdData: Omit<Product, 'id' | 'createdAt'>) => {
    const id = `prod-${Date.now()}`;
    const { variations, ...prodData } = newProdData as any;
    await supabase.from('products').insert({
      id,
      name: prodData.name,
      slug: prodData.slug,
      short_description: prodData.shortDescription,
      full_description: prodData.fullDescription,
      category_id: prodData.categoryId,
      category_name: prodData.categoryName,
      brand: prodData.brand,
      collection: prodData.collection,
      price: prodData.price,
      promotional_price: prodData.promotionalPrice,
      sku: prodData.sku,
      barcode: prodData.barcode,
      stock: prodData.stock,
      min_stock: prodData.minStock,
      status: prodData.status,
      is_featured: prodData.isFeatured,
      is_new: prodData.isNew,
      is_best_seller: prodData.isBestSeller,
      is_on_sale: prodData.isOnSale,
      tags: prodData.tags,
      images: prodData.images,
      video_url: prodData.videoUrl,
      rating: prodData.rating || 0,
      reviews_count: prodData.reviewsCount || 0,
      weight_kg: prodData.weightKg || 0,
      dimensions_cm: prodData.dimensionsCm || { height: 0, width: 0, length: 0 },
    });

    const newP: Product = {
      ...newProdData,
      id,
      createdAt: new Date().toISOString(),
      variations: variations || [],
    };
    setProducts(prev => [newP, ...prev]);
  };

  const deleteProduct = async (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    await supabase.from('products').delete().eq('id', id);
  };

  const updateCategory = async (updated: Category) => {
    setCategories(prev => prev.map(c => (c.id === updated.id ? updated : c)));
    await supabase.from('categories').update({
      name: updated.name,
      slug: updated.slug,
      description: updated.description,
      image: updated.image,
      icon: updated.icon,
      order: updated.order,
      parent_id: updated.parentId,
      active: updated.active,
      is_highlight_circle: updated.isHighlightCircle,
      highlight_color: updated.highlightColor,
    }).eq('id', updated.id);
  };

  const addCategory = async (catData: Omit<Category, 'id'>) => {
    const id = `cat-${Date.now()}`;
    await supabase.from('categories').insert({
      id,
      name: catData.name,
      slug: catData.slug,
      description: catData.description,
      image: catData.image,
      icon: catData.icon,
      order: catData.order,
      parent_id: catData.parentId,
      active: catData.active,
      is_highlight_circle: catData.isHighlightCircle,
      highlight_color: catData.highlightColor,
    });
    const newC: Category = { ...catData, id };
    setCategories(prev => [...prev, newC]);
  };

  const deleteCategory = async (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    await supabase.from('categories').delete().eq('id', id);
  };

  const updateOrderStatus = async (orderId: string, status: Order['status'], trackingCode?: string, note?: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    const newHistory = [
      ...order.statusHistory,
      { status, timestamp: new Date().toISOString(), note },
    ];

    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          return { ...o, status, trackingCode: trackingCode || o.trackingCode, statusHistory: newHistory };
        }
        return o;
      })
    );

    await supabase.from('orders').update({
      status,
      tracking_code: trackingCode || order.trackingCode,
      status_history: newHistory,
    }).eq('id', orderId);
  };

  const updateTheme = async (newTheme: Partial<ThemeConfig>) => {
    const merged = { ...theme, ...newTheme };
    setTheme(merged);
    await supabase.from('theme_config').update({
      primary_color: merged.primaryColor,
      secondary_color: merged.secondaryColor,
      accent_color: merged.accentColor,
      background_color: merged.backgroundColor,
      text_color: merged.textColor,
      card_background_color: merged.cardBackgroundColor,
      button_radius: merged.buttonRadius,
      font_family: merged.fontFamily,
      updated_at: new Date().toISOString(),
    }).eq('id', 'default');
  };

  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    await supabase.from('store_settings').update({
      store_name: merged.storeName,
      slogan: merged.slogan,
      logo_url: merged.logoUrl,
      favicon_url: merged.faviconUrl,
      phone: merged.phone,
      whatsapp: merged.whatsapp,
      email: merged.email,
      instagram: merged.instagram,
      facebook: merged.facebook,
      tiktok: merged.tiktok,
      youtube: merged.youtube,
      address: merged.address,
      business_hours: merged.businessHours,
      free_shipping_threshold: merged.freeShippingThreshold,
      mercado_pago_public_key: merged.mercadoPagoPublicKey,
      mercado_pago_access_token: merged.mercadoPagoAccessToken,
      seo_title: merged.seoTitle,
      seo_description: merged.seoDescription,
      google_analytics_id: merged.googleAnalyticsId,
      meta_pixel_id: merged.metaPixelId,
      updated_at: new Date().toISOString(),
    }).eq('id', 'default');
  };

  const updateHomeSections = async (sections: HomeSectionConfig[]) => {
    setHomeSections(sections);
    await supabase.from('home_sections').delete().neq('id', '___');
    await supabase.from('home_sections').insert(sections.map(s => ({
      id: s.id,
      title: s.title,
      type: s.type,
      enabled: s.enabled,
      order: s.order,
      settings: s.settings,
    })));
  };

  const addCoupon = async (cData: Omit<Coupon, 'id' | 'usedCount'>) => {
    const id = `coup-${Date.now()}`;
    await supabase.from('coupons').insert({
      id,
      code: cData.code,
      type: cData.type,
      value: cData.value,
      min_order_value: cData.minOrderValue,
      max_usage: cData.maxUsage,
      used_count: 0,
      expires_at: cData.expiresAt,
      active: cData.active,
    });
    const newC: Coupon = { ...cData, id, usedCount: 0 };
    setCoupons(prev => [...prev, newC]);
  };

  const addReview = async (revData: Omit<Review, 'id' | 'createdAt' | 'status'>) => {
    const id = `rev-${Date.now()}`;
    await supabase.from('reviews').insert({
      id,
      product_id: revData.productId,
      product_name: revData.productName,
      author: revData.author,
      rating: revData.rating,
      comment: revData.comment,
      photo_url: revData.photoUrl,
      status: 'approved',
    });
    const newR: Review = {
      ...revData,
      id,
      status: 'approved',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setReviews(prev => [newR, ...prev]);
  };

  const createOrder = async (orderPayload: any): Promise<Order> => {
    const orderId = `ord-${Date.now()}`;
    const orderNumber = `#${Math.floor(1000 + Math.random() * 9000)}`;

    const { customer, shippingAddress, items, paymentMethod, paymentDetails, subtotal, discount, shippingFee, total } = orderPayload;

    const statusHistory = [
      { status: 'Pendente' as const, timestamp: new Date().toISOString() },
      ...(paymentMethod === 'credit_card' ? [{ status: 'Pago' as const, timestamp: new Date().toISOString(), note: 'Aprovado pelo Checkout Transparente' }] : []),
    ];

    const initialStatus = paymentMethod === 'credit_card' ? 'Pago' : 'Pendente';

    await supabase.from('orders').insert({
      id: orderId,
      order_number: orderNumber,
      customer,
      shipping_address: shippingAddress,
      subtotal,
      discount,
      shipping_fee: shippingFee,
      total,
      payment_method: paymentMethod,
      payment_details: paymentDetails,
      status: initialStatus,
      status_history: statusHistory,
    });

    await supabase.from('order_items').insert(items.map((item: any) => ({
      order_id: orderId,
      product_id: item.productId,
      product_name: item.productName,
      product_image: item.productImage,
      price: item.price,
      color_name: item.colorName,
      size: item.size,
      quantity: item.quantity,
      max_stock: item.maxStock,
    })));

    // Update stock
    for (const item of items) {
      const product = products.find(p => p.id === item.productId);
      if (product) {
        await supabase.from('products').update({
          stock: Math.max(0, product.stock - item.quantity),
        }).eq('id', item.productId);
      }
    }

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      customer,
      shippingAddress,
      items,
      subtotal,
      discount,
      shippingFee,
      total,
      paymentMethod,
      paymentDetails,
      status: initialStatus as Order['status'],
      statusHistory,
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  const updateBanner = async (updated: Banner) => {
    await supabase.from('banners').update({
      title: updated.title,
      subtitle: updated.subtitle,
      desktop_image: updated.desktopImage,
      mobile_image: updated.mobileImage,
      cta_text: updated.ctaText,
      cta_url: updated.ctaUrl,
      position: updated.position,
      active: updated.active,
      order: updated.order,
    }).eq('id', updated.id);
    setBanners(prev => prev.map(b => b.id === updated.id ? updated : b));
  };

  const addBanner = async (bData: Omit<Banner, 'id'>) => {
    const id = `banner-${Date.now()}`;
    await supabase.from('banners').insert({
      id,
      title: bData.title,
      subtitle: bData.subtitle,
      desktop_image: bData.desktopImage,
      mobile_image: bData.mobileImage,
      cta_text: bData.ctaText,
      cta_url: bData.ctaUrl,
      position: bData.position,
      active: bData.active,
      order: bData.order,
    });
    setBanners(prev => [...prev, { ...bData, id }]);
  };

  const deleteBanner = async (id: string) => {
    await supabase.from('banners').delete().eq('id', id);
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        cart,
        wishlist,
        orders,
        coupons,
        banners,
        theme,
        settings,
        homeSections,
        reviews,
        blogPosts,

        searchQuery,
        isCartOpen,
        isQuickSearchOpen,
        isAiStylistOpen,
        activeAdminTab,

        setSearchQuery,
        setIsCartOpen,
        setIsQuickSearchOpen,
        setIsAiStylistOpen,
        setActiveAdminTab,

        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartSubtotal,
        cartCount,

        toggleWishlist,

        updateProduct,
        addProduct,
        deleteProduct,
        updateCategory,
        addCategory,
        deleteCategory,
        updateOrderStatus,
        updateTheme,
        updateSettings,
        updateHomeSections,
        addCoupon,
        addReview,
        createOrder,
        updateBanner,
        addBanner,
        deleteBanner,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) throw new Error('useStore must be used within StoreProvider');
  return context;
};
