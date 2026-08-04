import React from 'react';
import { useNavigate } from 'react-router-dom';

export const AboutSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 sm:py-24 bg-[#E2B3B1]/30 border-t border-b border-[#1A1A1A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Photo Frame */}
          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] max-w-md mx-auto overflow-hidden shadow-xl border border-[#1A1A1A]/10 bg-white">
              <img
                src="https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&auto=format&fit=crop&q=80"
                alt="Glow Fitness - Quem Somos"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          {/* Right Column: Narrative Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <h2 className="font-sans uppercase tracking-[0.25em] text-sm sm:text-base font-semibold text-[#1A1A1A]">
              QUEM SOMOS?
            </h2>

            <p className="text-base sm:text-lg leading-relaxed text-[#333333] font-light">
              A <strong>Glow Fitness</strong> nasceu do sonho de oferecer roupas fitness que unam conforto, qualidade e estilo. Cada peça foi escolhida com carinho para valorizar a autoestima da mulher e acompanhá-la em todos os momentos, dentro e fora da academia.
            </p>

            <p className="text-base sm:text-lg leading-relaxed text-[#333333] font-light">
              Mais do que vender roupas, queremos que cada cliente faça parte da nossa história.
            </p>

            <div className="pt-4">
              <button
                onClick={() => navigate('/about')}
                className="inline-block border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white uppercase tracking-widest text-xs font-semibold px-8 py-3.5 transition-colors"
              >
                SAIBA MAIS
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
