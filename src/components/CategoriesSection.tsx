import React from 'react';
import { useStore } from '../context/StoreContext';

export const CategoriesSection: React.FC = () => {
  const { categories, setSelectedCategoryId, setCurrentView } = useStore();

  const handleCategoryClick = (slug: string) => {
    setSelectedCategoryId(slug);
    setCurrentView('catalog');
  };

  return (
    <section className="py-12 sm:py-16 bg-[#FDFCFB] border-b border-[#1A1A1A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-sans uppercase tracking-[0.25em] text-sm sm:text-base font-semibold text-[#1A1A1A] mb-8 sm:mb-12">
          CATEGORIAS
        </h2>

        {/* Circular Category Cards - Exact Match to Layout */}
        <div className="flex items-center justify-start sm:justify-center gap-6 sm:gap-10 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat) => {
            if (cat.isHighlightCircle) {
              return (
                <div
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.slug)}
                  className="flex flex-col items-center group cursor-pointer flex-shrink-0"
                >
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#E3B0AF]/40 group-hover:bg-[#C18282] transition-colors border border-[#C18282]/30 flex flex-col items-center justify-center p-2 shadow-sm text-center">
                    <span className="font-sans uppercase text-xs font-bold tracking-widest text-[#1A1A1A] group-hover:text-white transition-colors">
                      NOVI<br />DADES
                    </span>
                  </div>
                  <span className="mt-3 text-xs font-semibold text-[#1A1A1A] group-hover:text-[#C18282] transition-colors">
                    {cat.name}
                  </span>
                </div>
              );
            }

            return (
              <div
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className="flex flex-col items-center group cursor-pointer flex-shrink-0"
              >
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#C18282] transition-all shadow-sm bg-neutral-100">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="mt-3 text-xs font-medium text-[#1A1A1A] group-hover:text-[#C18282] transition-colors">
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
