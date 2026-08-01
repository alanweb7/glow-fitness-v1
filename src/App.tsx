import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
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

const StoreContent: React.FC = () => {
  const { currentView } = useStore();

  if (currentView === 'admin') {
    return <AdminPanel />;
  }

  if (currentView === 'checkout') {
    return <CheckoutModal />;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#FDFCFB] text-[#1A1A1A] selection:bg-[#C18282] selection:text-white font-sans antialiased">
      <div>
        <TopAnnouncementBar />
        <Header />

        <main>
          {currentView === 'store' && (
            <>
              <HeroBanner />
              <CategoriesSection />
              <FeaturedProducts />
              <AboutSection />
            </>
          )}

          {currentView === 'catalog' && <CatalogView />}
          {currentView === 'orders' && <OrdersView />}
          {currentView === 'about' && <AboutView />}
          {currentView === 'blog' && <BlogView />}
        </main>
      </div>

      <Footer />

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <CartDrawer />
      <QuickSearchModal />
      <AiStylistModal />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <StoreContent />
    </StoreProvider>
  );
}
