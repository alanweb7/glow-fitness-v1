import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
};

export const HeroBanner: React.FC = () => {
  const { banners } = useStore();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const heroBanner = banners.find(b => b.position === 'hero' && b.active) || banners[0];

  const backgroundImage = isMobile
    ? (heroBanner?.mobileImage || heroBanner?.desktopImage || 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=1600&auto=format&fit=crop&q=80')
    : (heroBanner?.desktopImage || 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=1600&auto=format&fit=crop&q=80');

  return (
    <div className="relative bg-[#1A1A1A] text-white overflow-hidden min-h-[500px] sm:min-h-[600px] flex items-center">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt="Glow Fitness Collection"
          className="w-full h-full object-cover object-center opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
      </div>

      {/* Content Container */}
      <div className="relative max-w-7xl mx-auto px-6 sm:px-12 py-20 w-full">
        <div className="max-w-xl space-y-6">
          {/* Eyebrow */}
          <span className="inline-block text-xs uppercase tracking-[0.3em] font-sans font-medium text-[#EAD3D0] border-b border-[#C18282]/40 pb-1">
            {heroBanner?.title || 'SEJA SUA MELHOR VERSÃO'}
          </span>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl font-light leading-tight tracking-tight text-white font-sans">
            Moda fitness para mulheres que querem{' '}
            <span className="font-serif italic text-[#EAD3D0] font-normal block sm:inline">
              se sentir lindas, confiantes e confortáveis.
            </span>
          </h1>

          {/* CTA Button */}
          <div className="pt-4">
            <button
              onClick={() => {
                const el = document.getElementById('destaques');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else navigate('/catalog');
              }}
              className="bg-[#C18282] hover:bg-[#a96e6e] text-white uppercase tracking-widest text-xs sm:text-sm font-semibold px-8 py-4 rounded-sm transition-all transform hover:-translate-y-0.5 shadow-lg"
            >
              {heroBanner?.ctaText || 'CONHEÇA A COLEÇÃO'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
