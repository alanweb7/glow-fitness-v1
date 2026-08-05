import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TopAnnouncementBar } from './components/TopAnnouncementBar';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { CategoriesSection } from './components/CategoriesSection';
import { FeaturedProducts } from './components/FeaturedProducts';
import { AboutSection } from './components/AboutSection';
import { Footer } from './components/Footer';
import { CatalogView } from './components/CatalogView';
import { OrdersView } from './components/OrdersView';
import { AboutView } from './components/AboutView';
import { BlogView } from './components/BlogView';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminPanel } from './components/AdminPanel';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { QuickSearchModal } from './components/QuickSearchModal';
import { AiStylistModal } from './components/AiStylistModal';
import { LoginView } from './components/LoginView';
import { PageView } from './components/PageView';
import { Loader2 } from 'lucide-react';

// Store Layout (public pages)
const StoreLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FDFCFB] text-[#1A1A1A] selection:bg-[#C18282] selection:text-white font-sans antialiased">
      <div>
        <TopAnnouncementBar />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<><HeroBanner /><CategoriesSection /><FeaturedProducts /><AboutSection /></>} />
            <Route path="/product/:productId" element={<ProductDetailModal />} />
            <Route path="/catalog" element={<CatalogView />} />
            <Route path="/catalog/:categoryId" element={<CatalogView />} />
            <Route path="/orders" element={<OrdersView />} />
            <Route path="/about" element={<AboutView />} />
            <Route path="/blog" element={<BlogView />} />
            <Route path="/checkout" element={<CheckoutModal />} />
            <Route path="/:slug" element={<PageView />} />
          </Routes>
        </main>
      </div>
      <Footer />
      <CartDrawer />
      <QuickSearchModal />
      <AiStylistModal />
    </div>
  );
};

// Admin Layout (protected)
const AdminLayout: React.FC = () => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF7F6] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#C18282]" />
          <span className="text-xs text-neutral-500 uppercase tracking-widest">Carregando...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginView />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF7F6] flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-serif italic text-[#1A1A1A] mb-2">Acesso Negado</h2>
          <p className="text-sm text-neutral-500">Você não tem permissão para acessar o painel administrativo.</p>
        </div>
      </div>
    );
  }

  // Redirect /admin to /admin/dashboard
  if (location.pathname === '/admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <AdminPanel />;
};

// App Routes
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/admin/*" element={<AdminLayout />} />
      <Route path="/*" element={<StoreLayout />} />
    </Routes>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StoreProvider>
          <AppRoutes />
        </StoreProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
