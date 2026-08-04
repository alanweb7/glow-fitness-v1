import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Sparkles, Send, Check, ShoppingBag, Loader2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const AiStylistModal: React.FC = () => {
  const { isAiStylistOpen, setIsAiStylistOpen, products, addToCart } = useStore();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState('');
  const [activity, setActivity] = useState('Musculação & Pilates');
  const [colorPref, setColorPref] = useState('Tons Terrosos / Rose / Neutro');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<{
    advice: string;
    recommendedProductIds: string[];
    outfitTitle: string;
  } | null>(null);

  if (!isAiStylistOpen) return null;

  const handleAskStylist = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/ai/stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userPrompt: prompt || `Quero um look para ${activity} em ${colorPref}`,
          activity,
          colorPreference: colorPref,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setRecommendation(data.recommendation);
      } else {
        throw new Error(data.message);
      }
    } catch (err: any) {
      // Fallback recommendation if server fails or API key missing
      setRecommendation({
        outfitTitle: 'Look Elegância Fitness',
        advice: `Para ${activity}, recomendamos o Macaquinho Fit Elegance aliado ao Top Nadador Glow. Tecido de alta compressão sem transparência que modela o corpo com extremo conforto durante os treinos!`,
        recommendedProductIds: [products[0]?.id || '1', products[1]?.id || '2'],
      });
    } finally {
      setLoading(false);
    }
  };

  const recProducts = recommendation
    ? products.filter(p => recommendation.recommendedProductIds.includes(p.id))
    : [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 font-sans">
      <div className="bg-[#FDFCFB] text-[#1A1A1A] w-full max-w-3xl rounded-sm shadow-2xl border border-[#C18282]/40 overflow-hidden my-auto">
        
        {/* Header */}
        <div className="bg-[#1A1A1A] text-white p-6 flex justify-between items-center relative overflow-hidden">
          <div className="relative z-10 flex items-center gap-3">
            <div className="p-2.5 bg-[#C18282] rounded-full text-white">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-[#EAD3D0] font-semibold">
                Inteligência Artificial Gemini
              </span>
              <h2 className="font-serif italic text-2xl font-normal text-white">
                Stylist Pessoal Glow Fitness
              </h2>
            </div>
          </div>
          <button onClick={() => setIsAiStylistOpen(false)} className="text-neutral-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          
          {!recommendation ? (
            <form onSubmit={handleAskStylist} className="space-y-5">
              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                Nossa assistente de estilo analisa seu tipo de treino, biotipo e preferências de cores para recomendar a combinação exata de macaquinho, top e legging com sustentação perfeita.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Tipo de Treino Principal</label>
                  <select
                    value={activity}
                    onChange={e => setActivity(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300 rounded bg-white outline-none focus:border-[#C18282]"
                  >
                    <option value="Musculação & Hipertrofia">Musculação & Treino Pesado</option>
                    <option value="Pilates & Yoga">Pilates, Yoga & Funcional</option>
                    <option value="Corrida & Cardio">Corrida & Cardio</option>
                    <option value="Uso Casual & Athleisure">Dia a Dia & Passeio (Athleisure)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold mb-1">Paleta de Cores Preferida</label>
                  <select
                    value={colorPref}
                    onChange={e => setColorPref(e.target.value)}
                    className="w-full p-2.5 border border-neutral-300 rounded bg-white outline-none focus:border-[#C18282]"
                  >
                    <option value="Tons Terrosos / Rose / Vinho">Rose, Vinho, Nude (Tons Quentes)</option>
                    <option value="Preto / Menta / Cinza">Preto & Menta (Minimalista)</option>
                    <option value="Azul Marinho & Neutros">Azul Marinho & Tons Neutros</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Detalhes adicionais (opcional)
                </label>
                <textarea
                  placeholder="Ex: Procuro peças com cós bem alto para disfarçar a barriguinha e bojo removível..."
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-neutral-300 rounded text-xs outline-none focus:border-[#C18282]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1A1A1A] hover:bg-[#C18282] text-white text-xs uppercase tracking-widest font-semibold py-4 rounded transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>CONSULTANDO GEMINI STYLIST...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-[#EAD3D0]" />
                    <span>GERAR COMBINAÇÃO PERFEITA</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              
              {/* Recommendation Box */}
              <div className="bg-[#FAF0EE] border border-[#EAD3D0] p-6 rounded space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#C18282]">
                  Look Sugerido pela IA
                </span>
                <h3 className="font-serif italic text-2xl text-[#1A1A1A]">{recommendation.outfitTitle}</h3>
                <p className="text-xs text-neutral-700 leading-relaxed font-light">
                  {recommendation.advice}
                </p>
              </div>

              {/* Recommended Items */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-800">
                  Peças do Look Sugerido:
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(recProducts.length > 0 ? recProducts : products.slice(0, 2)).map(prod => (
                    <div key={prod.id} className="bg-white p-3 border border-neutral-200 rounded flex gap-3 items-center">
                      <img src={prod.images[0]} alt="" className="w-16 h-20 object-cover rounded bg-neutral-100" />
                      <div className="flex-1 text-xs space-y-1">
                        <h5 className="font-semibold text-neutral-800 line-clamp-1">{prod.name}</h5>
                        <p className="text-neutral-500 font-light">R$ {prod.price.toFixed(2).replace('.', ',')}</p>
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => {
                              setIsAiStylistOpen(false);
                              navigate(`/product/${prod.id}`);
                            }}
                            className="text-[#C18282] font-semibold underline text-[11px]"
                          >
                            Ver Detalhes
                          </button>
                          <button
                            onClick={() => addToCart(prod)}
                            className="bg-[#1A1A1A] text-white px-2 py-0.5 rounded text-[10px] uppercase font-bold"
                          >
                            + Carrinho
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setRecommendation(null)}
                  className="flex-1 border border-neutral-300 text-neutral-700 text-xs font-semibold py-3 uppercase rounded hover:bg-neutral-100 transition-colors"
                >
                  NOVA CONSULTA
                </button>
                <button
                  onClick={() => setIsAiStylistOpen(false)}
                  className="flex-1 bg-[#1A1A1A] text-white text-xs font-semibold py-3 uppercase rounded hover:bg-[#C18282] transition-colors"
                >
                  CONCLUIR
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};
