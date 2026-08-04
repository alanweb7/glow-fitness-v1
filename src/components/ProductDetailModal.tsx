import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, Star, Heart, ShieldCheck, Truck, RefreshCw, ShoppingBag, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ProductDetailModal: React.FC = () => {
  const {
    products,
    addToCart,
    wishlist,
    toggleWishlist,
    reviews,
    addReview,
  } = useStore();

  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const product = products.find(p => p.id === productId);

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'reviews' | 'shipping'>('desc');

  // Review form state
  const [newAuthor, setNewAuthor] = useState('');
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!productId || !product) return null;

  // Set defaults on product load
  const availableColors = Array.from(new Set(product.variations.map(v => v.colorName)));
  const availableSizes = Array.from(new Set(product.variations.map(v => v.size)));

  const currentColor = selectedColor || availableColors[0] || 'Bordô / Vinho';
  const currentSize = selectedSize || availableSizes[0] || 'M';

  const productReviews = reviews.filter(r => r.productId === product.id);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor.trim() || !newComment.trim()) return;
    addReview({
      productId: product.id,
      productName: product.name,
      author: newAuthor,
      rating: newRating,
      comment: newComment,
    });
    setNewAuthor('');
    setNewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 font-sans">
      <div className="relative bg-[#FDFCFB] text-[#1A1A1A] w-full max-w-4xl rounded-sm shadow-2xl overflow-hidden border border-[#1A1A1A]/10 my-auto">
        
        {/* Close Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 z-10 p-2 bg-white/80 hover:bg-white text-neutral-700 rounded-full shadow transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 p-6 sm:p-8">
          
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-neutral-100 rounded-sm overflow-hidden border border-[#1A1A1A]/10 relative">
              <img
                src={product.images[activeImageIdx] || product.images[0]}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`absolute top-3 left-3 p-2.5 rounded-full shadow-md transition-colors ${
                  wishlist.includes(product.id) ? 'bg-[#C18282] text-white' : 'bg-white text-neutral-700 hover:text-[#C18282]'
                }`}
              >
                <Heart className="w-4 h-4 fill-current" />
              </button>
            </div>

            {/* Thumbnail Row */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-16 h-20 rounded-sm overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImageIdx === idx ? 'border-[#C18282]' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Details & Controls */}
          <div className="flex flex-col justify-between space-y-5">
            <div>
              {/* Category & Brand */}
              <div className="text-xs uppercase tracking-widest text-[#C18282] font-semibold">
                {product.categoryName} • {product.brand}
              </div>

              {/* Product Title */}
              <h1 className="font-serif italic text-2xl sm:text-3xl font-normal text-[#1A1A1A] mt-1">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-neutral-300'}`}
                    />
                  ))}
                </div>
                <span className="text-xs font-semibold text-neutral-600">
                  {product.rating.toFixed(1)} ({product.reviewsCount + productReviews.length} avaliações)
                </span>
              </div>

              {/* Price Display */}
              <div className="mt-4 flex items-baseline gap-3">
                {product.promotionalPrice && product.promotionalPrice < product.price ? (
                  <>
                    <span className="text-2xl font-bold text-[#1A1A1A]">
                      R$ {product.promotionalPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-sm text-neutral-400 line-through font-light">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="bg-[#C18282] text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      Economize R$ {(product.price - product.promotionalPrice).toFixed(2).replace('.', ',')}
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-bold text-[#1A1A1A]">
                    R$ {product.price.toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-1">em até 6x de R$ {((product.promotionalPrice || product.price) / 6).toFixed(2).replace('.', ',')} sem juros</p>

              {/* Short Description */}
              <p className="text-xs text-neutral-600 leading-relaxed mt-3 border-t border-b border-[#1A1A1A]/10 py-3 font-light">
                {product.shortDescription}
              </p>

              {/* Variation Pickers */}
              <div className="space-y-4 mt-4">
                {/* Color Picker */}
                {availableColors.length > 0 && (
                  <div>
                    <span className="text-xs uppercase font-semibold text-[#1A1A1A]">
                      Cor: <strong className="text-[#C18282] font-medium">{currentColor}</strong>
                    </span>
                    <div className="flex gap-2.5 mt-2">
                      {product.variations.map((v, i) => (
                        <button
                          key={i}
                          onClick={() => setSelectedColor(v.colorName)}
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-transform ${
                            currentColor === v.colorName ? 'scale-110 border-[#1A1A1A] ring-2 ring-[#C18282]/50' : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: v.colorHex || '#1A1A1A' }}
                          title={v.colorName}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Size Picker */}
                {availableSizes.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="uppercase font-semibold text-[#1A1A1A]">Tamanho:</span>
                      <span className="text-[#C18282] underline cursor-pointer hover:text-[#1A1A1A]">Guia de Medidas</span>
                    </div>
                    <div className="flex gap-2 mt-2">
                      {['PP', 'P', 'M', 'G', 'GG'].map(sz => {
                        const isAvailable = availableSizes.includes(sz as any);
                        return (
                          <button
                            key={sz}
                            disabled={!isAvailable}
                            onClick={() => setSelectedSize(sz)}
                            className={`w-10 h-10 rounded-sm border text-xs font-semibold uppercase transition-all ${
                              currentSize === sz
                                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                                : isAvailable
                                ? 'bg-white text-neutral-700 border-neutral-300 hover:border-[#C18282]'
                                : 'bg-neutral-100 text-neutral-300 border-neutral-200 line-through cursor-not-allowed'
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity Controls */}
                <div className="flex items-center gap-4 pt-2">
                  <span className="text-xs uppercase font-semibold text-[#1A1A1A]">Qtd:</span>
                  <div className="flex items-center border border-neutral-300 rounded text-xs">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1.5 hover:bg-neutral-100 font-bold text-neutral-700"
                    >
                      -
                    </button>
                    <span className="px-4 py-1.5 font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1.5 hover:bg-neutral-100 font-bold text-neutral-700"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  addToCart(product, currentColor, currentSize, quantity);
                }}
                className="w-full bg-[#C18282] hover:bg-[#a96e6e] text-white uppercase tracking-widest text-xs font-semibold py-4 rounded-sm transition-all flex items-center justify-center gap-2 shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>ADICIONAR AO CARRINHO</span>
              </button>

              <button
                onClick={() => {
                  addToCart(product, currentColor, currentSize, quantity);
                  navigate('/checkout');
                }}
                className="w-full bg-[#1A1A1A] hover:bg-[#333333] text-white uppercase tracking-widest text-xs font-semibold py-3.5 rounded-sm transition-all"
              >
                COMPRAR AGORA (CHECKOUT RÁPIDO)
              </button>
            </div>

            {/* Micro guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-200 text-[11px] text-neutral-600">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-[#C18282]" />
                <span>Envio Rápido</span>
              </div>
              <div className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 text-[#C18282]" />
                <span>Troca Grátis</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C18282]" />
                <span>Mercado Pago</span>
              </div>
            </div>

          </div>
        </div>

        {/* Tabs for Description & Reviews */}
        <div className="bg-neutral-50 border-t border-[#1A1A1A]/10 p-6 sm:p-8">
          <div className="flex border-b border-neutral-300 gap-6 text-xs font-semibold uppercase tracking-wider">
            <button
              onClick={() => setActiveTab('desc')}
              className={`pb-3 transition-colors ${activeTab === 'desc' ? 'border-b-2 border-[#C18282] text-[#C18282]' : 'text-neutral-500'}`}
            >
              Descrição Detalhada
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 transition-colors ${activeTab === 'reviews' ? 'border-b-2 border-[#C18282] text-[#C18282]' : 'text-neutral-500'}`}
            >
              Avaliações de Clientes ({productReviews.length})
            </button>
          </div>

          <div className="pt-4 text-xs text-neutral-600 leading-relaxed">
            {activeTab === 'desc' && (
              <div className="space-y-3 font-light">
                <p>{product.fullDescription}</p>
                <div className="grid grid-cols-2 gap-2 pt-2 font-normal text-neutral-800">
                  <div>• Material: Poliamida com Elastano Lycra</div>
                  <div>• Compressão: Média / Alta</div>
                  <div>• Bojo: Removível em 100% EVA</div>
                  <div>• Transparência: Zero Transparência</div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Submit review */}
                <form onSubmit={handleReviewSubmit} className="bg-white p-4 rounded border border-neutral-200 space-y-3">
                  <h4 className="font-semibold text-neutral-800">Escrever uma Avaliação</h4>
                  {reviewSubmitted && (
                    <div className="p-2 bg-emerald-50 text-emerald-700 rounded text-xs flex items-center gap-1">
                      <Check className="w-4 h-4" /> Avaliação enviada com sucesso!
                    </div>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Seu nome"
                      value={newAuthor}
                      onChange={e => setNewAuthor(e.target.value)}
                      required
                      className="p-2 border border-neutral-300 rounded text-xs"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-neutral-600">Nota:</span>
                      <select
                        value={newRating}
                        onChange={e => setNewRating(Number(e.target.value))}
                        className="p-2 border border-neutral-300 rounded text-xs bg-white"
                      >
                        <option value={5}>5 Estrelas - Excelente</option>
                        <option value={4}>4 Estrelas - Muito Bom</option>
                        <option value={3}>3 Estrelas - Bom</option>
                      </select>
                    </div>
                  </div>
                  <textarea
                    placeholder="Conte sobre o caimento, conforto e tecido do produto..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    required
                    rows={2}
                    className="w-full p-2 border border-neutral-300 rounded text-xs"
                  />
                  <button type="submit" className="bg-[#1A1A1A] text-white px-4 py-2 text-xs font-semibold uppercase rounded hover:bg-[#C18282] transition-colors">
                    Enviar Avaliação
                  </button>
                </form>

                {/* Reviews List */}
                <div className="space-y-3">
                  {productReviews.length === 0 ? (
                    <p className="text-neutral-400 font-light">Seja a primeira a avaliar este produto!</p>
                  ) : (
                    productReviews.map(r => (
                      <div key={r.id} className="p-3 bg-white border border-neutral-200 rounded space-y-1">
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-[#1A1A1A]">{r.author}</span>
                          <span className="text-[10px] text-neutral-400">{r.createdAt}</span>
                        </div>
                        <div className="flex text-amber-400">
                          {[...Array(r.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400" />
                          ))}
                        </div>
                        <p className="text-neutral-600 font-light">{r.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
