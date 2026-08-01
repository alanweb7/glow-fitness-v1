import React, { useState } from 'react';
import { X, Search, ArrowRight, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const QuickSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    products,
    setSelectedProductId,
    setSelectedCategoryId,
    setCurrentView,
  } = useStore();

  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const results = query.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(query.toLowerCase()) ||
        p.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const popularTags = ['Macaquinho', 'Top Nadador', 'Shorts Empina Bumbum', 'Conjunto Energy', 'Legging Cós Alto'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-start justify-center pt-16 px-4 font-sans">
      <div className="bg-white w-full max-w-2xl rounded-sm shadow-2xl overflow-hidden border border-[#1A1A1A]/10 space-y-4 p-6">
        
        {/* Header Bar */}
        <div className="flex justify-between items-center border-b border-neutral-200 pb-3">
          <div className="flex items-center gap-2 text-neutral-800">
            <Search className="w-5 h-5 text-[#C18282]" />
            <h3 className="font-serif italic text-xl">Buscar em Glow Fitness</h3>
          </div>
          <button onClick={() => setIsSearchOpen(false)} className="text-neutral-400 hover:text-neutral-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input */}
        <div className="relative">
          <input
            type="text"
            autoFocus
            placeholder="Digite o que procura (ex: macaquinho, legging, top)..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="w-full p-3.5 pl-11 bg-neutral-50 border border-neutral-300 rounded text-sm outline-none focus:border-[#C18282] focus:bg-white"
          />
          <Search className="w-5 h-5 text-neutral-400 absolute left-3.5 top-3.5" />
        </div>

        {/* Popular Tags */}
        {!query && (
          <div className="space-y-2 pt-2">
            <span className="text-xs uppercase font-semibold text-neutral-400 tracking-wider block">
              Buscas Populares:
            </span>
            <div className="flex flex-wrap gap-2">
              {popularTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1 bg-neutral-100 hover:bg-[#F5EBE8] hover:text-[#C18282] text-neutral-700 text-xs rounded-full transition-colors flex items-center gap-1"
                >
                  <Tag className="w-3 h-3" />
                  <span>{tag}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        {query && (
          <div className="space-y-3 pt-2">
            <div className="flex justify-between items-center text-xs text-neutral-500">
              <span>{results.length} resultados encontrados</span>
              <button
                onClick={() => {
                  setIsSearchOpen(false);
                  setCurrentView('catalog');
                }}
                className="text-[#C18282] font-semibold hover:underline flex items-center gap-1"
              >
                Ver no catálogo completo <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto space-y-2 pr-1">
              {results.length === 0 ? (
                <p className="text-xs text-neutral-400 text-center py-8">Nenhum produto encontrado para "{query}".</p>
              ) : (
                results.map(prod => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSelectedProductId(prod.id);
                    }}
                    className="flex items-center gap-4 p-2.5 rounded hover:bg-[#FAF0EE] cursor-pointer transition-colors border border-transparent hover:border-[#EAD3D0]"
                  >
                    <img src={prod.images[0]} alt="" className="w-12 h-14 object-cover rounded bg-neutral-100" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm text-[#1A1A1A]">{prod.name}</h4>
                      <span className="text-xs text-neutral-400">{prod.categoryName}</span>
                    </div>
                    <span className="font-bold text-sm text-[#C18282]">
                      R$ {(prod.promotionalPrice || prod.price).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
