import React, { useState } from 'react';
import { Search, ShoppingBag, User, Sparkles, LayoutDashboard, Menu, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Header: React.FC = () => {
  const {
    cartCount,
    setIsCartOpen,
    setIsQuickSearchOpen,
    setIsAiStylistOpen,
    currentView,
    setCurrentView,
    setSelectedCategoryId,
    setSelectedProductId,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigateToCategory = (slug: string | null) => {
    setSelectedCategoryId(slug);
    setSelectedProductId(null);
    setCurrentView(slug ? 'catalog' : 'store');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#1A1A1A] text-white shadow-md">
      {/* Admin Quick Switcher Top Bar */}
      <div className="bg-[#262626] border-b border-neutral-800 py-1 px-4 text-xs flex justify-between items-center text-neutral-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Modo Loja Virtual (Visão do Cliente)</span>
        </div>
        <button
          onClick={() => setCurrentView(currentView === 'admin' ? 'store' : 'admin')}
          className="flex items-center gap-1.5 bg-[#C18282] hover:bg-[#a96e6e] text-white px-2.5 py-0.5 rounded text-xs font-semibold transition-colors"
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          {currentView === 'admin' ? 'Voltar para Loja' : 'Painel Admin'}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-neutral-300 hover:text-white p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <div
            onClick={() => {
              setCurrentView('store');
              setSelectedCategoryId(null);
              setSelectedProductId(null);
            }}
            className="cursor-pointer flex flex-col items-center sm:items-start select-none"
          >
            <div className="flex items-baseline">
              <span className="font-serif italic text-3xl sm:text-4xl text-[#EAD3D0] tracking-wide font-normal">Glow</span>
              <span className="text-xs uppercase tracking-[0.3em] font-sans font-light text-neutral-300 ml-1">FITNESS</span>
            </div>
          </div>

          {/* Navigation Links - Desktop */}
          <nav className="hidden md:flex items-center space-x-8 text-sm uppercase tracking-widest font-medium text-neutral-200">
            <button
              onClick={() => navigateToCategory(null)}
              className={`hover:text-[#C18282] transition-colors ${currentView === 'store' ? 'text-[#C18282]' : ''}`}
            >
              Início
            </button>
            <button
              onClick={() => navigateToCategory(null)}
              className={`hover:text-[#C18282] transition-colors ${currentView === 'catalog' ? 'text-[#C18282]' : ''}`}
            >
              Produtos
            </button>
            <button
              onClick={() => navigateToCategory('macaquinho')}
              className="hover:text-[#C18282] transition-colors"
            >
              Categorias
            </button>
            <button
              onClick={() => { setCurrentView('about'); setMobileMenuOpen(false); }}
              className={`hover:text-[#C18282] transition-colors ${currentView === 'about' ? 'text-[#C18282]' : ''}`}
            >
              Sobre Nós
            </button>
            <button
              onClick={() => { setCurrentView('blog'); setMobileMenuOpen(false); }}
              className={`hover:text-[#C18282] transition-colors ${currentView === 'blog' ? 'text-[#C18282]' : ''}`}
            >
              Contato
            </button>
          </nav>

          {/* Action Icons Right */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* AI Stylist Recommendation Button */}
            <button
              onClick={() => setIsAiStylistOpen(true)}
              className="hidden sm:flex items-center gap-1.5 bg-[#C18282]/20 hover:bg-[#C18282]/30 border border-[#C18282]/40 text-[#EAD3D0] px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              title="Glow AI Stylist"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C18282]" />
              <span>Glow AI</span>
            </button>

            {/* Quick Search Button */}
            <button
              onClick={() => setIsQuickSearchOpen(true)}
              className="p-2 text-neutral-300 hover:text-white transition-colors"
              title="Buscar produtos"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Customer Orders Portal */}
            <button
              onClick={() => setCurrentView('orders')}
              className="p-2 text-neutral-300 hover:text-white transition-colors"
              title="Meus Pedidos"
            >
              <User className="w-5 h-5" />
            </button>

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-neutral-300 hover:text-white transition-colors"
              title="Carrinho"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#C18282] text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#121212] border-t border-neutral-800 px-4 pt-3 pb-6 space-y-3">
          <button
            onClick={() => navigateToCategory(null)}
            className="block w-full text-left py-2 text-sm uppercase tracking-wider text-neutral-200 hover:text-[#C18282]"
          >
            Início
          </button>
          <button
            onClick={() => navigateToCategory(null)}
            className="block w-full text-left py-2 text-sm uppercase tracking-wider text-neutral-200 hover:text-[#C18282]"
          >
            Produtos
          </button>
          <button
            onClick={() => navigateToCategory('macaquinho')}
            className="block w-full text-left py-2 text-sm uppercase tracking-wider text-neutral-200 hover:text-[#C18282]"
          >
            Categorias
          </button>
          <button
            onClick={() => { setCurrentView('about'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-sm uppercase tracking-wider text-neutral-200 hover:text-[#C18282]"
          >
            Sobre Nós
          </button>
          <button
            onClick={() => { setCurrentView('blog'); setMobileMenuOpen(false); }}
            className="block w-full text-left py-2 text-sm uppercase tracking-wider text-neutral-200 hover:text-[#C18282]"
          >
            Blog & Contato
          </button>
          <button
            onClick={() => { setIsAiStylistOpen(true); setMobileMenuOpen(false); }}
            className="flex items-center gap-2 w-full text-left py-2 text-sm text-[#EAD3D0]"
          >
            <Sparkles className="w-4 h-4 text-[#C18282]" />
            <span>Consultoria de Estilo Glow AI</span>
          </button>
        </div>
      )}
    </header>
  );
};
