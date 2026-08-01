import React, { createContext, useContext, useState, useEffect } from 'react';
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
  Customer,
} from '../types';
import {
  initialProducts,
  initialCategories,
  initialCoupons,
  initialBanners,
  initialTheme,
  initialStoreSettings,
  initialHomeSections,
  initialReviews,
  initialBlogPosts,
} from '../data/mockData';

interface StoreContextType {
  // Data
  products: Product[];
  categories: Category[];
  cart: CartItem[];
  wishlist: string[]; // product IDs
  orders: Order[];
  coupons: Coupon[];
  banners: Banner[];
  theme: ThemeConfig;
  settings: StoreSettings;
  homeSections: HomeSectionConfig[];
  reviews: Review[];
  blogPosts: BlogPost[];
  
  // UI & View State
  currentView: 'store' | 'product-detail' | 'catalog' | 'checkout' | 'orders' | 'admin' | 'blog' | 'about';
  selectedProductId: string | null;
  selectedCategoryId: string | null;
  searchQuery: string;
  isCartOpen: boolean;
  isQuickSearchOpen: boolean;
  isAiStylistOpen: boolean;
  activeAdminTab: string;

  // Actions
  setCurrentView: (view: StoreContextType['currentView']) => void;
  setSelectedProductId: (id: string | null) => void;
  setSelectedCategoryId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setIsCartOpen: (open: boolean) => void;
  setIsQuickSearchOpen: (open: boolean) => void;
  setIsAiStylistOpen: (open: boolean) => void;
  setActiveAdminTab: (tab: string) => void;

  // Cart actions
  addToCart: (product: Product, selectedColor?: string, selectedSize?: string, qty?: number) => void;
  removeFromCart: (cartItemId: string) => void;
  updateCartQuantity: (cartItemId: string, qty: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartCount: number;

  // Wishlist actions
  toggleWishlist: (productId: string) => void;

  // Admin CRUD actions
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
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('glow_fitness_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('glow_fitness_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [banners, setBanners] = useState<Banner[]>(initialBanners);
  const [theme, setTheme] = useState<ThemeConfig>(initialTheme);
  const [settings, setSettings] = useState<StoreSettings>(initialStoreSettings);
  const [homeSections, setHomeSections] = useState<HomeSectionConfig[]>(initialHomeSections);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPosts);

  // Navigation State
  const [currentView, setCurrentView] = useState<StoreContextType['currentView']>('store');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isQuickSearchOpen, setIsQuickSearchOpen] = useState(false);
  const [isAiStylistOpen, setIsAiStylistOpen] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState('dashboard');

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('glow_fitness_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('glow_fitness_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Load backend state on mount
  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => { if (data.products) setProducts(data.products); })
      .catch(err => console.log('Using local products fallback:', err));

    fetch('/api/categories')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setCategories(data); })
      .catch(() => {});

    fetch('/api/orders')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data)) setOrders(data); })
      .catch(() => {});

    fetch('/api/theme')
      .then(res => res.json())
      .then(data => { if (data.primaryColor) setTheme(data); })
      .catch(() => {});

    fetch('/api/settings')
      .then(res => res.json())
      .then(data => { if (data.storeName) setSettings(data); })
      .catch(() => {});
  }, []);

  // Inject Theme Dynamic CSS Variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', theme.primaryColor);
    root.style.setProperty('--color-secondary', theme.secondaryColor);
    root.style.setProperty('--color-accent', theme.accentColor);
    root.style.setProperty('--color-bg', theme.backgroundColor);
    root.style.setProperty('--color-text', theme.textColor);
    root.style.setProperty('--color-card', theme.cardBackgroundColor);
  }, [theme]);

  // Cart Calculations
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
          colorName: selectedColor || (product.variations[0]?.colorName),
          size: selectedSize || (product.variations[0]?.size || 'M'),
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

  // Admin Actions
  const updateProduct = (updated: Product) => {
    setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    fetch(`/api/products/${updated.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(() => {});
  };

  const addProduct = (newProdData: Omit<Product, 'id' | 'createdAt'>) => {
    const newP: Product = {
      ...newProdData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [newP, ...prev]);
    fetch('/api/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newP),
    }).catch(() => {});
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    fetch(`/api/products/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const updateCategory = (updated: Category) => {
    setCategories(prev => prev.map(c => (c.id === updated.id ? updated : c)));
    fetch(`/api/categories/${updated.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    }).catch(() => {});
  };

  const addCategory = (catData: Omit<Category, 'id'>) => {
    const newC: Category = { ...catData, id: `cat-${Date.now()}` };
    setCategories(prev => [...prev, newC]);
    fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newC),
    }).catch(() => {});
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    fetch(`/api/categories/${id}`, { method: 'DELETE' }).catch(() => {});
  };

  const updateOrderStatus = (orderId: string, status: Order['status'], trackingCode?: string, note?: string) => {
    setOrders(prev =>
      prev.map(o => {
        if (o.id === orderId) {
          const updated = {
            ...o,
            status,
            trackingCode: trackingCode || o.trackingCode,
            statusHistory: [
              ...o.statusHistory,
              { status, timestamp: new Date().toISOString(), note },
            ],
          };
          return updated;
        }
        return o;
      })
    );

    fetch(`/api/orders/${orderId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, trackingCode, note }),
    }).catch(() => {});
  };

  const updateTheme = (newTheme: Partial<ThemeConfig>) => {
    const merged = { ...theme, ...newTheme };
    setTheme(merged);
    fetch('/api/theme', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(merged),
    }).catch(() => {});
  };

  const updateSettings = (newSettings: Partial<StoreSettings>) => {
    const merged = { ...settings, ...newSettings };
    setSettings(merged);
    fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(merged),
    }).catch(() => {});
  };

  const updateHomeSections = (sections: HomeSectionConfig[]) => {
    setHomeSections(sections);
    fetch('/api/home-sections', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sections),
    }).catch(() => {});
  };

  const addCoupon = (cData: Omit<Coupon, 'id' | 'usedCount'>) => {
    const newC: Coupon = { ...cData, id: `coup-${Date.now()}`, usedCount: 0 };
    setCoupons(prev => [...prev, newC]);
    fetch('/api/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newC),
    }).catch(() => {});
  };

  const addReview = (revData: Omit<Review, 'id' | 'createdAt' | 'status'>) => {
    const newR: Review = {
      ...revData,
      id: `rev-${Date.now()}`,
      status: 'approved',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setReviews(prev => [newR, ...prev]);
    fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newR),
    }).catch(() => {});
  };

  const createOrder = async (orderPayload: any): Promise<Order> => {
    const res = await fetch('/api/checkout/mercadopago', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload),
    });
    const data = await res.json();
    if (data.success && data.order) {
      setOrders(prev => [data.order, ...prev]);
      clearCart();
      return data.order;
    }
    throw new Error(data.error || 'Erro ao processar pedido');
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

        currentView,
        selectedProductId,
        selectedCategoryId,
        searchQuery,
        isCartOpen,
        isQuickSearchOpen,
        isAiStylistOpen,
        activeAdminTab,

        setCurrentView,
        setSelectedProductId,
        setSelectedCategoryId,
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
