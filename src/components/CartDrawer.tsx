import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartSubtotal,
    settings,
  } = useStore();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const freeShippingProgress = Math.min(100, (cartSubtotal / settings.freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, settings.freeShippingThreshold - cartSubtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FDFCFB] text-[#1A1A1A] shadow-2xl flex flex-col justify-between border-l border-[#1A1A1A]/10">
          
          {/* Header */}
          <div className="p-5 border-b border-[#1A1A1A]/10 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#C18282]" />
              <h2 className="font-serif italic text-xl font-normal">Seu Carrinho</h2>
              <span className="text-xs font-semibold bg-[#F5EBE8] text-[#C18282] px-2 py-0.5 rounded-full">
                {cart.reduce((s, i) => s + i.quantity, 0)} itens
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-neutral-400 hover:text-neutral-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-[#FAF0EE] p-3 px-5 border-b border-[#EAD3D0] text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="text-[#5A4544]">
                Faltam <strong className="text-[#C18282]">R$ {remainingForFreeShipping.toFixed(2).replace('.', ',')}</strong> para você ganhar <strong>FRETE GRÁTIS!</strong>
              </p>
            ) : (
              <p className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" /> Parabéns! Você ganhou FRETE GRÁTIS!
              </p>
            )}
            <div className="w-full h-1.5 bg-[#EAD3D0] rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-[#C18282] transition-all duration-300 rounded-full"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-sm text-neutral-500 font-light">Seu carrinho está vazio.</p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/catalog');
                  }}
                  className="bg-[#C18282] text-white text-xs uppercase tracking-widest font-semibold px-6 py-3 rounded-sm hover:bg-[#a96e6e] transition-colors"
                >
                  EXPLORAR PRODUTOS
                </button>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex gap-4 p-3 bg-white border border-[#1A1A1A]/10 rounded-sm">
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-20 h-24 object-cover rounded-sm bg-neutral-100 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-medium text-sm text-[#1A1A1A] line-clamp-1">{item.productName}</h4>
                      <p className="text-xs text-neutral-500 font-light mt-0.5">
                        {item.colorName && `Cor: ${item.colorName}`} {item.size && `| Tam: ${item.size}`}
                      </p>
                      <span className="text-sm font-semibold text-[#1A1A1A] block mt-1">
                        R$ {item.price.toFixed(2).replace('.', ',')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-100">
                      <div className="flex items-center border border-neutral-300 rounded text-xs">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-0.5 hover:bg-neutral-100 font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-0.5 hover:bg-neutral-100 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-5 bg-white border-t border-[#1A1A1A]/10 space-y-3">
              <div className="flex justify-between items-center text-xs text-neutral-500">
                <span>Subtotal</span>
                <span className="font-medium text-neutral-700">R$ {cartSubtotal.toFixed(2).replace('.', ',')}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-semibold text-[#1A1A1A]">
                <span>Total Estimado</span>
                <span className="text-base text-[#C18282]">R$ {cartSubtotal.toFixed(2).replace('.', ',')}</span>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="w-full bg-[#1A1A1A] hover:bg-[#C18282] text-white uppercase tracking-widest text-xs font-semibold py-4 rounded-sm transition-all flex items-center justify-center gap-2 shadow-lg"
              >
                <span>FINALIZAR COMPRA</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[10px] text-center text-neutral-400 flex items-center justify-center gap-1">
                <Tag className="w-3 h-3 text-emerald-600" />
                <span>Mercado Pago Checkout Transparente • PIX com aprovação instantânea</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
