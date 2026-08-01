import React from 'react';
import { ShieldCheck, Heart, Sparkles, Award } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AboutView: React.FC = () => {
  const { setCurrentView } = useStore();

  return (
    <div className="py-16 bg-[#FAF7F6] min-h-screen font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C18282] font-semibold">
            Nossa História & Essência
          </span>
          <h1 className="font-serif italic text-4xl sm:text-5xl text-[#1A1A1A]">Sobre a Glow Fitness</h1>
        </div>

        {/* Grid narrative */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-white p-8 sm:p-12 border border-[#1A1A1A]/10 shadow-sm rounded-sm">
          <div className="space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed font-light">
            <h2 className="font-serif italic text-2xl text-[#1A1A1A] font-normal">
              Empoderamento, Conforto e Tecnologia em Cada Costura
            </h2>
            <p>
              A <strong>Glow Fitness</strong> nasceu da paixão por criar roupas de ginástica femininas que superam expectativas em caimento, tecnologia de compressão e elegância.
            </p>
            <p>
              Sabemos o quanto uma peça bem estruturada transforma a confiança na hora do treino. Por isso, desenvolvemos modelagens exclusivas que oferecem <strong>zero transparência</strong>, sustentação ideal no busto e cós anatomicamente projetado para valorizar suas curvas naturais.
            </p>
            <p>
              Seja no macaquinhos, nos tops nadadores ou nos shorts com efeito empina bumbum, garantimos a máxima durabilidade com tecidos em poliamida nobre e elastano Lycra®.
            </p>
          </div>

          <div className="aspect-[4/5] rounded overflow-hidden shadow-md">
            <img
              src="https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&auto=format&fit=crop&q=80"
              alt="Sobre Glow Fitness"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 border border-[#1A1A1A]/10 rounded text-center space-y-2">
            <ShieldCheck className="w-8 h-8 text-[#C18282] mx-auto" />
            <h3 className="font-bold text-sm text-[#1A1A1A] uppercase tracking-wider">Zero Transparência</h3>
            <p className="text-xs text-neutral-500 font-light">Tecido de alta gramatura testado em agachamentos intensos.</p>
          </div>

          <div className="bg-white p-6 border border-[#1A1A1A]/10 rounded text-center space-y-2">
            <Heart className="w-8 h-8 text-[#C18282] mx-auto" />
            <h3 className="font-bold text-sm text-[#1A1A1A] uppercase tracking-wider">Autoestima Feminina</h3>
            <p className="text-xs text-neutral-500 font-light">Modelagens pensadas para valorizar todos os corpos reais.</p>
          </div>

          <div className="bg-white p-6 border border-[#1A1A1A]/10 rounded text-center space-y-2">
            <Award className="w-8 h-8 text-[#C18282] mx-auto" />
            <h3 className="font-bold text-sm text-[#1A1A1A] uppercase tracking-wider">Envio para todo Brasil</h3>
            <p className="text-xs text-neutral-500 font-light">Checkout seguro via Mercado Pago e entrega garantida.</p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => setCurrentView('catalog')}
            className="bg-[#1A1A1A] text-white text-xs uppercase font-semibold px-8 py-4 rounded hover:bg-[#C18282] transition-colors"
          >
            CONHECER A COLEÇÃO
          </button>
        </div>

      </div>
    </div>
  );
};
