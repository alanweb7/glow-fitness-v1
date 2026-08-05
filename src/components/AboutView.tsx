import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Heart, Award, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PageContent } from '../types';

const DEFAULT_CONTENT: PageContent = {
  heroTitle: 'Sobre a Glow Fitness',
  heroSubtitle: 'Nossa História & Essência',
  heroImage: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&auto=format&fit=crop&q=80',
  sections: [
    {
      title: 'Empoderamento, Conforto e Tecnologia em Cada Costura',
      text: 'A Glow Fitness nasceu da paixão por criar roupas de ginástica femininas que superam expectativas em caimento, tecnologia de compressão e elegância.',
    },
    {
      title: 'Nossa Essência',
      text: 'Sabemos o quanto uma peça bem estruturada transforma a confiança na hora do treino. Por isso, desenvolvemos modelagens exclusivas que oferecem zero transparência, sustentação ideal no busto e cós anatomicamente projetado para valorizar suas curvas naturais.',
    },
    {
      title: 'Tecnologia',
      text: 'Seja nos macaquinhos, nos tops nadadores ou nos shorts com efeito empina bumbum, garantimos a máxima durabilidade com tecidos em poliamida nobre e elastano Lycra®.',
    },
  ],
};

const PILLARS = [
  { icon: ShieldCheck, title: 'Zero Transparência', text: 'Tecido de alta gramatura testado em agachamentos intensos.' },
  { icon: Heart, title: 'Autoestima Feminina', text: 'Modelagens pensadas para valorizar todos os corpos reais.' },
  { icon: Award, title: 'Envio para todo Brasil', text: 'Checkout seguro via Mercado Pago e entrega garantida.' },
];

export const AboutView: React.FC = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState<PageContent>(DEFAULT_CONTENT);
  const [featuredImage, setFeaturedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAbout = async () => {
      const { data } = await supabase
        .from('pages')
        .select('content, featured_image')
        .eq('slug', 'sobre')
        .eq('is_published', true)
        .single();

      if (data?.content) {
        setContent(data.content);
      }
      if (data?.featured_image) {
        setFeaturedImage(data.featured_image);
      }
      setLoading(false);
    };
    loadAbout();
  }, []);

  if (loading) {
    return (
      <div className="py-32 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#C18282]" />
      </div>
    );
  }

  const sections = content.sections || [];
  const imageUrl = featuredImage || content.heroImage || DEFAULT_CONTENT.heroImage!;

  return (
    <div className="py-16 bg-[#FAF7F6] min-h-screen font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Title */}
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C18282] font-semibold">
            {content.heroSubtitle || 'Nossa História & Essência'}
          </span>
          <h1 className="font-serif italic text-4xl sm:text-5xl text-[#1A1A1A]">
            {content.heroTitle || 'Sobre a Glow Fitness'}
          </h1>
        </div>

        {/* Grid narrative */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-white p-8 sm:p-12 border border-[#1A1A1A]/10 shadow-sm rounded-sm">
          <div className="space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed font-light">
            {sections.map((section, idx) => (
              <div key={idx}>
                {idx === 0 && section.title && (
                  <h2 className="font-serif italic text-2xl text-[#1A1A1A] font-normal mb-3">
                    {section.title}
                  </h2>
                )}
                <p>{section.text}</p>
              </div>
            ))}
          </div>

          <div className="aspect-[4/5] rounded overflow-hidden shadow-md">
            <img
              src={imageUrl}
              alt="Sobre Glow Fitness"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {PILLARS.map((pillar, idx) => (
            <div key={idx} className="bg-white p-6 border border-[#1A1A1A]/10 rounded text-center space-y-2">
              <pillar.icon className="w-8 h-8 text-[#C18282] mx-auto" />
              <h3 className="font-bold text-sm text-[#1A1A1A] uppercase tracking-wider">{pillar.title}</h3>
              <p className="text-xs text-neutral-500 font-light">{pillar.text}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/catalog')}
            className="bg-[#1A1A1A] text-white text-xs uppercase font-semibold px-8 py-4 rounded hover:bg-[#C18282] transition-colors"
          >
            CONHECER A COLEÇÃO
          </button>
        </div>

      </div>
    </div>
  );
};
