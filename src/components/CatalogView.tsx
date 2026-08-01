import React, { useState } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, Search, Heart, Eye } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CatalogView: React.FC = () => {
  const {
    products,
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    setSelectedProductId,
    addToCart,
    wishlist,
    toggleWishlist,
  } = useStore();

  const [searchFilter, setSearchFilter] = useState('');
  const [sortOption, setSortOption] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [selectedColorFilter, setSelectedColorFilter] = useState<string | null>(null);

  // Filter products
  let filtered = products.filter(p => {
    if (selectedCategoryId && p.categoryId !== selectedCategoryId && p.slug !== selectedCategoryId) {
      return false;
    }
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchCat = p.categoryName.toLowerCase().includes(q);
      const matchTag = p.tags.some(t => t.toLowerCase().includes(q));
      if (!matchName && !matchCat && !matchTag) return false;
    }
    if (selectedColorFilter) {
      const hasColor = p.variations.some(v => v.colorName === selectedColorFilter);
      if (!hasColor) return false;
    }
    return true;
  });

  // Sort products
  if (sortOption === 'price-asc') {
    filtered.sort((a, b) => (a.promotionalPrice || a.price) - (b.promotionalPrice || b.price));
  } else if (sortOption === 'price-desc') {
    filtered.sort((a, b) => (b.promotionalPrice || b.price) - (a.promotionalPrice || a.price));
  } else if (sortOption === 'newest') {
    filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  }

  const currentCategory = categories.find(c => c.id === selectedCategoryId || c.slug === selectedCategoryId);

  return (
    <div className="py-12 bg-[#FAF7F6] min-h-screen font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C18282] font-semibold">
            Coleção Completa Glow Fitness
          </span>
          <h1 className="font-serif italic text-3xl sm:text-5xl text-[#1A1A1A]">
            {currentCategory ? currentCategory.name : 'Todos os Produtos'}
          </h1>
          <p className="text-xs text-neutral-500 max-w-md mx-auto font-light">
            Encontre tops, leggings, macaquinhos e conjuntos desenvolvidos com alta tecnologia de compressão.
          </p>
        </div>

        {/* Filters and Search Toolbar */}
        <div className="bg-white p-4 border border-[#1A1A1A]/10 rounded-sm shadow-xs flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar">
            <button
              onClick={() => setSelectedCategoryId(null)}
              className={`px-3 py-1.5 rounded-full uppercase font-medium tracking-wider text-[11px] whitespace-nowrap transition-colors ${
                !selectedCategoryId ? 'bg-[#1A1A1A] text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              Todos
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`px-3 py-1.5 rounded-full uppercase font-medium tracking-wider text-[11px] whitespace-nowrap transition-colors ${
                  selectedCategoryId === cat.id || selectedCategoryId === cat.slug
                    ? 'bg-[#1A1A1A] text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Search Input & Sort Dropdown */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="relative flex-1 md:w-48">
              <input
                type="text"
                placeholder="Filtrar por nome..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 border border-neutral-300 rounded text-xs outline-none focus:border-[#C18282]"
              />
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
            </div>

            <div className="flex items-center gap-1.5 bg-neutral-100 border border-neutral-200 rounded px-2.5 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
              <select
                value={sortOption}
                onChange={e => setSortOption(e.target.value as any)}
                className="bg-transparent text-xs text-neutral-700 outline-none font-medium cursor-pointer"
              >
                <option value="featured">Destaques</option>
                <option value="price-asc">Menor Preço</option>
                <option value="price-desc">Maior Preço</option>
                <option value="newest">Lançamentos</option>
              </select>
            </div>
          </div>

        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center py-20 space-y-3 bg-white border border-neutral-200 rounded">
              <p className="text-neutral-500 text-sm font-light">Nenhum produto encontrado com estes filtros.</p>
              <button
                onClick={() => { setSelectedCategoryId(null); setSearchFilter(''); }}
                className="text-xs text-[#C18282] font-semibold underline"
              >
                Limpar todos os filtros
              </button>
            </div>
          ) : (
            filtered.map(prod => (
              <div
                key={prod.id}
                className="bg-white border border-[#1A1A1A]/10 rounded-none overflow-hidden flex flex-col justify-between group hover:shadow-xl transition-all duration-300"
              >
                {/* Product Image */}
                <div
                  onClick={() => setSelectedProductId(prod.id)}
                  className="relative aspect-[3/4] bg-neutral-100 overflow-hidden cursor-pointer"
                >
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Actions */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(prod.id);
                      }}
                      className={`p-2 rounded-full shadow-md transition-colors ${
                        wishlist.includes(prod.id)
                          ? 'bg-[#C18282] text-white'
                          : 'bg-white text-neutral-700 hover:text-[#C18282]'
                      }`}
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProductId(prod.id);
                      }}
                      className="p-2 bg-white text-neutral-700 hover:text-[#C18282] rounded-full shadow-md transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 text-center flex flex-col flex-1 justify-between bg-white border-t border-[#1A1A1A]/5 space-y-3">
                  <div>
                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-light">
                      {prod.categoryName}
                    </span>
                    <h3
                      onClick={() => setSelectedProductId(prod.id)}
                      className="font-medium text-sm text-[#1A1A1A] hover:text-[#C18282] cursor-pointer transition-colors"
                    >
                      {prod.name}
                    </h3>
                    <div className="mt-1 flex items-center justify-center gap-2">
                      {prod.promotionalPrice && prod.promotionalPrice < prod.price ? (
                        <>
                          <span className="text-xs text-neutral-400 line-through">
                            R$ {prod.price.toFixed(2).replace('.', ',')}
                          </span>
                          <span className="text-sm font-semibold text-[#1A1A1A]">
                            R$ {prod.promotionalPrice.toFixed(2).replace('.', ',')}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-semibold text-[#1A1A1A]">
                          R$ {prod.price.toFixed(2).replace('.', ',')}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (prod.variations && prod.variations.length > 0) {
                        setSelectedProductId(prod.id);
                      } else {
                        addToCart(prod);
                      }
                    }}
                    className="w-full bg-[#F5EBE8] hover:bg-[#C18282] text-[#1A1A1A] hover:text-white border border-[#C18282]/30 text-xs uppercase tracking-widest font-semibold py-2.5 transition-all"
                  >
                    COMPRAR
                  </button>
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
