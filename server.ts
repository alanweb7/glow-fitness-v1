import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import {
  initialCategories,
  initialProducts,
  initialCoupons,
  initialBanners,
  initialTheme,
  initialStoreSettings,
  initialHomeSections,
  initialReviews,
  initialBlogPosts,
} from './src/data/mockData.js';
import { Order, Product, Category, Coupon, ThemeConfig, StoreSettings, Review, BlogPost, HomeSectionConfig, Banner } from './src/types.js';

// In-memory data store for server session
let products: Product[] = [...initialProducts];
let categories: Category[] = [...initialCategories];
let coupons: Coupon[] = [...initialCoupons];
let banners: Banner[] = [...initialBanners];
let theme: ThemeConfig = { ...initialTheme };
let settings: StoreSettings = { ...initialStoreSettings };
let homeSections: HomeSectionConfig[] = [...initialHomeSections];
let reviews: Review[] = [...initialReviews];
let blogPosts: BlogPost[] = [...initialBlogPosts];
let orders: Order[] = [
  {
    id: 'ord-1001',
    orderNumber: '#1001',
    customer: {
      name: 'Vanessa Santos',
      email: 'vanessa.santos@email.com',
      phone: '(11) 98765-4321',
      cpf: '123.456.789-00',
    },
    shippingAddress: {
      street: 'Alameda Santos',
      number: '450',
      complement: 'Apt 12B',
      neighborhood: 'Jardins',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01418-000',
    },
    items: [
      {
        id: 'cart-1',
        productId: 'prod-1',
        productName: 'Conjunto Energy',
        productImage: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80',
        price: 129.90,
        colorName: 'Bordô / Vinho',
        size: 'M',
        quantity: 1,
        maxStock: 10,
      },
    ],
    subtotal: 129.90,
    discount: 12.99,
    shippingFee: 0,
    total: 116.91,
    paymentMethod: 'pix',
    paymentDetails: {
      pixQrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020126580014br.gov.bcb.pix0136glow-fitness-pix-1001',
      pixCopyPaste: '00020126580014br.gov.bcb.pix0136glow-fitness-pix-key-10015204000053039865405116.915802BR5912Glow Fitness6009Sao Paulo6207050310016304E0F1',
    },
    status: 'Pago',
    statusHistory: [
      { status: 'Pendente', timestamp: '2026-07-30T14:00:00.000Z' },
      { status: 'Pago', timestamp: '2026-07-30T14:02:15.000Z', note: 'Aprovado via Pix Mercado Pago' },
    ],
    createdAt: '2026-07-30T14:00:00.000Z',
  },
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API ROUTE HANDLERS

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', store: settings.storeName, version: '1.0.0' });
  });

  // GET Products
  app.get('/api/products', (req, res) => {
    const { category, search, tag, sort, featured, page = '1', limit = '20' } = req.query;
    let result = [...products];

    if (category) {
      result = result.filter(p => p.categoryId === category || p.slug === category);
    }
    if (search) {
      const q = String(search).toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.shortDescription.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    if (tag) {
      result = result.filter(p => p.tags.includes(String(tag)));
    }
    if (featured === 'true') {
      result = result.filter(p => p.isFeatured);
    }

    // Sort
    if (sort === 'price-asc') {
      result.sort((a, b) => (a.promotionalPrice || a.price) - (b.promotionalPrice || b.price));
    } else if (sort === 'price-desc') {
      result.sort((a, b) => (b.promotionalPrice || b.price) - (a.promotionalPrice || a.price));
    } else if (sort === 'bestseller') {
      result.sort((a, b) => (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0));
    } else if (sort === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    res.json({
      products: result,
      total: result.length,
    });
  });

  // GET Product by ID or Slug
  app.get('/api/products/:idOrSlug', (req, res) => {
    const p = products.find(prod => prod.id === req.params.idOrSlug || prod.slug === req.params.idOrSlug);
    if (!p) return res.status(404).json({ error: 'Produto não encontrado' });
    res.json(p);
  });

  // POST Create product
  app.post('/api/products', (req, res) => {
    const newProduct: Product = {
      ...req.body,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    products.unshift(newProduct);
    res.status(201).json(newProduct);
  });

  // PUT Update product
  app.put('/api/products/:id', (req, res) => {
    const index = products.findIndex(p => p.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Produto não encontrado' });
    products[index] = { ...products[index], ...req.body };
    res.json(products[index]);
  });

  // DELETE Product
  app.delete('/api/products/:id', (req, res) => {
    products = products.filter(p => p.id !== req.params.id);
    res.json({ success: true });
  });

  // GET Categories
  app.get('/api/categories', (req, res) => {
    res.json(categories.sort((a, b) => a.order - b.order));
  });

  // POST/PUT/DELETE Categories
  app.post('/api/categories', (req, res) => {
    const newCat: Category = {
      ...req.body,
      id: `cat-${Date.now()}`,
      order: categories.length + 1,
      active: true,
    };
    categories.push(newCat);
    res.status(201).json(newCat);
  });

  app.put('/api/categories/:id', (req, res) => {
    const idx = categories.findIndex(c => c.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Categoria não encontrada' });
    categories[idx] = { ...categories[idx], ...req.body };
    res.json(categories[idx]);
  });

  app.delete('/api/categories/:id', (req, res) => {
    categories = categories.filter(c => c.id !== req.params.id);
    res.json({ success: true });
  });

  // GET Orders
  app.get('/api/orders', (req, res) => {
    res.json(orders);
  });

  // GET Order by ID
  app.get('/api/orders/:id', (req, res) => {
    const order = orders.find(o => o.id === req.params.id || o.orderNumber === req.params.id);
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });
    res.json(order);
  });

  // Mercado Pago Transparent Checkout Simulation API
  app.post('/api/checkout/mercadopago', (req, res) => {
    const { customer, shippingAddress, items, paymentMethod, cardDetails, couponCode } = req.body;

    let subtotal = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);
    let discount = 0;

    if (couponCode) {
      const c = coupons.find(cp => cp.code.toUpperCase() === String(couponCode).toUpperCase() && cp.active);
      if (c) {
        if (c.type === 'percentage') discount = (subtotal * c.value) / 100;
        else if (c.type === 'fixed') discount = c.value;
      }
    }

    const shippingFee = subtotal >= settings.freeShippingThreshold ? 0 : 19.90;
    const total = Math.max(0, subtotal - discount + shippingFee);

    const orderNumber = `#${Math.floor(1000 + Math.random() * 9000)}`;
    const orderId = `ord-${Date.now()}`;

    let paymentDetails: any = {};
    let initialStatus: Order['status'] = 'Pendente';

    if (paymentMethod === 'pix') {
      const pixPayload = `00020126580014br.gov.bcb.pix0136glow-fitness-pix-${orderId}520400005303986540${total.toFixed(2)}5802BR5912Glow Fitness6009Sao Paulo6304${Math.floor(1000 + Math.random() * 8999)}`;
      paymentDetails = {
        pixQrCode: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(pixPayload)}`,
        pixCopyPaste: pixPayload,
      };
      initialStatus = 'Pendente';
    } else if (paymentMethod === 'credit_card') {
      paymentDetails = {
        cardBrand: cardDetails?.brand || 'Visa',
        installments: cardDetails?.installments || 1,
      };
      initialStatus = 'Pago'; // Instant credit card approval in sandbox
    } else if (paymentMethod === 'boleto') {
      paymentDetails = {
        boletoBarcode: `23793.38128 60000.000003 00000.000000 1 ${Math.floor(1000000000 + Math.random() * 8999999999)}`,
      };
      initialStatus = 'Pendente';
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
      status: initialStatus,
      statusHistory: [
        { status: 'Pendente', timestamp: new Date().toISOString() },
        ...(initialStatus === 'Pago' ? [{ status: 'Pago' as const, timestamp: new Date().toISOString(), note: 'Aprovado pelo Checkout Transparente Mercado Pago' }] : []),
      ],
      createdAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);

    // Update stock levels
    items.forEach((item: any) => {
      const p = products.find(prod => prod.id === item.productId);
      if (p) {
        p.stock = Math.max(0, p.stock - item.quantity);
      }
    });

    res.json({
      success: true,
      order: newOrder,
      mercadoPagoTransactionId: `mp_tx_${Math.floor(100000000 + Math.random() * 900000000)}`,
    });
  });

  // PUT Update Order Status
  app.put('/api/orders/:id/status', (req, res) => {
    const { status, trackingCode, note } = req.body;
    const order = orders.find(o => o.id === req.params.id);
    if (!order) return res.status(404).json({ error: 'Pedido não encontrado' });

    order.status = status;
    if (trackingCode) order.trackingCode = trackingCode;
    order.statusHistory.push({
      status,
      timestamp: new Date().toISOString(),
      note,
    });

    res.json(order);
  });

  // GET/PUT Store Theme & Settings
  app.get('/api/theme', (req, res) => res.json(theme));
  app.put('/api/theme', (req, res) => {
    theme = { ...theme, ...req.body };
    res.json(theme);
  });

  app.get('/api/settings', (req, res) => res.json(settings));
  app.put('/api/settings', (req, res) => {
    settings = { ...settings, ...req.body };
    res.json(settings);
  });

  // GET/POST Home Sections Page Builder
  app.get('/api/home-sections', (req, res) => res.json(homeSections.sort((a, b) => a.order - b.order)));
  app.put('/api/home-sections', (req, res) => {
    homeSections = req.body;
    res.json(homeSections);
  });

  // Coupons API
  app.get('/api/coupons', (req, res) => res.json(coupons));
  app.post('/api/coupons', (req, res) => {
    const newCoupon: Coupon = { ...req.body, id: `coup-${Date.now()}`, usedCount: 0 };
    coupons.push(newCoupon);
    res.status(201).json(newCoupon);
  });

  app.post('/api/coupons/validate', (req, res) => {
    const { code, subtotal } = req.body;
    const c = coupons.find(cp => cp.code.toUpperCase() === String(code).toUpperCase() && cp.active);
    if (!c) return res.status(400).json({ valid: false, message: 'Cupom inválido ou expirado' });

    if (subtotal < c.minOrderValue) {
      return res.status(400).json({ valid: false, message: `Valor mínimo para este cupom é R$ ${c.minOrderValue.toFixed(2)}` });
    }

    let discount = 0;
    if (c.type === 'percentage') discount = (subtotal * c.value) / 100;
    else if (c.type === 'fixed') discount = c.value;

    res.json({ valid: true, coupon: c, discountAmount: discount });
  });

  // Banners API
  app.get('/api/banners', (req, res) => res.json(banners.sort((a, b) => a.order - b.order)));
  app.post('/api/banners', (req, res) => {
    const b: Banner = { ...req.body, id: `ban-${Date.now()}` };
    banners.push(b);
    res.status(201).json(b);
  });

  // Reviews API
  app.get('/api/reviews', (req, res) => res.json(reviews));
  app.post('/api/reviews', (req, res) => {
    const rev: Review = {
      ...req.body,
      id: `rev-${Date.now()}`,
      status: 'approved',
      createdAt: new Date().toISOString().split('T')[0],
    };
    reviews.unshift(rev);
    res.status(201).json(rev);
  });

  // Blog API
  app.get('/api/blog', (req, res) => res.json(blogPosts));

  // Reports API
  app.get('/api/reports/sales', (req, res) => {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelado' ? o.total : 0), 0);
    const totalOrders = orders.length;
    const averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    res.json({
      totalRevenue,
      totalOrders,
      averageTicket,
      totalCustomers: 124,
      conversionRate: 3.4,
      topProducts: products.slice(0, 4).map(p => ({ id: p.id, name: p.name, sales: Math.floor(Math.random() * 50) + 10, revenue: p.price * 25 })),
    });
  });

  // Gemini AI Personal Stylist Endpoint
  app.post('/api/ai/stylist', async (req, res) => {
    try {
      const { userGoal, workoutType, sizePreference, colorPreference } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.json({
          recommendation: "Com base no seu perfil de treino, sugerimos o **Conjunto Energy** em tom bordô e o **Shorts Power** com bolso para cel. São as escolhas mais desejadas por nossas clientes!",
          suggestedProductIds: ['prod-1', 'prod-2', 'prod-4'],
        });
      }

      const ai = new GoogleGenAI({ apiKey });
      const catalogSummary = products.map(p => `${p.name} (R$${p.price.toFixed(2)}) - ${p.shortDescription}`).join('\n');

      const prompt = `Você é a Personal Stylist e Consultora de Moda Fitness da Glow Fitness.
O usuário te deu estas preferências:
- Objetivo / Treino: ${workoutType || 'Musculação e Corrida'}
- Ajuste / Caimento preferido: ${sizePreference || 'Alta compressão'}
- Cores preferidas: ${colorPreference || 'Tons neutros e vinho'}
- Dúvida extra: ${userGoal || 'Quero um look completo confortável'}

Nosso catálogo de produtos disponível:
${catalogSummary}

Responda em tom amigável, acolhedor, entusiasmado e profissional em Português do Brasil.
Forneça uma sugestão personalizada de look completo (Top, Bottom ou Macaquinho) com dicas de uso e por que combina com ela.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      res.json({
        recommendation: response.text || "Recomendamos o Conjunto Energy!",
        suggestedProductIds: ['prod-1', 'prod-2', 'prod-4'],
      });
    } catch (err: any) {
      console.error('Gemini API error:', err);
      res.json({
        recommendation: "Para os seus treinos, recomendamos experimentar o **Conjunto Energy** combinado com o **Top Nadador**! Peças versáteis, com sustentação e zero transparência.",
        suggestedProductIds: ['prod-1', 'prod-3'],
      });
    }
  });

  // VITE MIDDLEWARE SETUP FOR DEV & PRODUCTION STATIC SERVING
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Glow Fitness server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
