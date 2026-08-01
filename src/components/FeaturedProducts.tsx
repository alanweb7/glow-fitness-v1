import React from 'react';
import { ShoppingBag, Eye, Heart } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';

export const FeaturedProducts: React.FC = () => {
  const { products, setSelectedProductId, addToCart, wishlist, toggleWishlist, setCurrentView } = useStore();
  const featured = products.filter(p => p.isFeatured).slice(0, 4);

  return (
    <section id="destaques" className="py-14 sm:py-20 bg-[#FAF7F6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-sans uppercase tracking-[0.25em] text-sm sm:text-base font-semibold text-[#1A1A1A] mb-10 sm:mb-14">
          DESTAQUES
        </h2>

        {/* Grid matching reference layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {featured.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-none border border-[#1A1A1A]/10 overflow-hidden flex flex-col justify-between group hover:shadow-xl transition-all duration-300"
            >
              {/* Image & Badges */}
              <div className="relative aspect-[3/4] overflow-hidden bg-neutral-100 cursor-pointer" onClick={() => setSelectedProductId(prod.id)}>
                <img
                  src={prod.images[0]}
                  alt={prod.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1">
                  {prod.isNew && (
                    <span className="bg-[#1A1A1A] text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5">
                      Novo
                    </span>
                  )}
                  {prod.isOnSale && (
                    <span className="bg-[#C18282] text-white text-[10px] uppercase font-bold tracking-wider px-2 py-0.5">
                      Oferta
                    </span>
                  )}
                </div>

                {/* Quick actions overlay */}
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
                    title="Favoritar"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProductId(prod.id);
                    }}
                    className="p-2 bg-white text-neutral-700 hover:text-[#C18282] rounded-full shadow-md transition-colors"
                    title="Ver Detalhes"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 text-center flex flex-col flex-1 justify-between bg-white border-t border-[#1A1A1A]/5">
                <div>
                  <h3
                    onClick={() => setSelectedProductId(prod.id)}
                    className="font-medium text-sm sm:text-base text-[#1A1A1A] hover:text-[#C18282] cursor-pointer transition-colors"
                  >
                    {prod.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-center gap-2">
                    {prod.promotionalPrice && prod.promotionalPrice < prod.price ? (
                      <>
                        <span className="text-xs text-neutral-400 line-through font-light">
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

                {/* COMPRAR Button */}
                <div className="mt-4 pt-3 border-t border-neutral-100">
                  <button
                    onClick={() => {
                      if (prod.variations && prod.variations.length > 0) {
                        setSelectedProductId(prod.id);
                      } else {
                        addToCart(prod);
                      }
                    }}
                    className="w-full bg-[#F5EBE8] hover:bg-[#C18282] text-[#1A1A1A] hover:text-white border border-[#C18282]/30 text-xs uppercase tracking-widest font-semibold py-2.5 px-4 transition-all duration-200"
                  >
                    COMPRAR
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Products Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => setCurrentView('catalog')}
            className="inline-block border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white uppercase tracking-widest text-xs font-semibold px-8 py-3.5 transition-colors"
          >
            VER TODOS OS PRODUTOS
          </button>
        </div>
      </div>
    </section>
  );
};
