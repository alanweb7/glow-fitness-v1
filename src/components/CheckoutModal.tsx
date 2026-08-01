import React, { useState } from 'react';
import { ShieldCheck, Lock, CreditCard, QrCode, FileText, CheckCircle, ArrowLeft, Copy, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order, PaymentMethod } from '../types';

export const CheckoutModal: React.FC = () => {
  const { cart, cartSubtotal, settings, coupons, createOrder, setCurrentView } = useStore();

  const [step, setStep] = useState<'form' | 'success'>('form');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Form State
  const [customer, setCustomer] = useState({
    name: 'Vanessa Santos',
    email: 'vanessa.santos@email.com',
    phone: '(11) 98765-4321',
    cpf: '123.456.789-00',
  });

  const [shippingAddress, setShippingAddress] = useState({
    street: 'Alameda Santos',
    number: '450',
    complement: 'Apt 12B',
    neighborhood: 'Jardins',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01418-000',
  });

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [cardDetails, setCardDetails] = useState({
    number: '4532 •••• •••• 8821',
    holder: 'VANESSA SANTOS',
    expiry: '12/28',
    cvv: '884',
    installments: 1,
  });

  const [couponInput, setCouponInput] = useState('GLOW10');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('GLOW10');
  const [discountAmount, setDiscountAmount] = useState<number>(cartSubtotal * 0.1);
  const [copiedPix, setCopiedPix] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingFee = cartSubtotal >= settings.freeShippingThreshold ? 0 : 19.90;
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee);

  const handleApplyCoupon = () => {
    const found = coupons.find(c => c.code.toUpperCase() === couponInput.trim().toUpperCase() && c.active);
    if (found) {
      setAppliedCoupon(found.code);
      if (found.type === 'percentage') setDiscountAmount((cartSubtotal * found.value) / 100);
      else if (found.type === 'fixed') setDiscountAmount(found.value);
    } else {
      alert('Cupom inválido ou expirado');
    }
  };

  const handleSubmitCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const orderData = {
        customer,
        shippingAddress,
        items: cart,
        paymentMethod,
        cardDetails: paymentMethod === 'credit_card' ? cardDetails : undefined,
        couponCode: appliedCoupon,
      };

      const order = await createOrder(orderData);
      setCreatedOrder(order);
      setStep('success');
    } catch (err: any) {
      alert(err.message || 'Erro ao processar compra via Mercado Pago');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  if (step === 'success' && createdOrder) {
    return (
      <div className="min-h-screen bg-[#FAF7F6] py-12 px-4 font-sans flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white border border-[#1A1A1A]/10 rounded-sm shadow-xl p-6 sm:p-10 space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h1 className="font-serif italic text-3xl text-[#1A1A1A]">Pedido Realizado com Sucesso!</h1>
            <p className="text-sm text-neutral-600">
              Número do Pedido: <strong className="text-[#C18282]">{createdOrder.orderNumber}</strong>
            </p>
          </div>

          {/* Payment Instructions depending on method */}
          {createdOrder.paymentMethod === 'pix' && (
            <div className="bg-[#FAF0EE] border border-[#EAD3D0] p-6 rounded-sm space-y-4 text-center">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-[#1A1A1A]">
                Pagamento via PIX (Aprovação Instantânea)
              </h3>
              <p className="text-xs text-neutral-600">
                Escaneie o QR Code abaixo com o aplicativo do seu banco ou copie a chave Pix.
              </p>

              <div className="w-48 h-48 mx-auto bg-white p-2 border border-neutral-300 rounded shadow-sm">
                <img
                  src={createdOrder.paymentDetails?.pixQrCode}
                  alt="QR Code Pix"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="max-w-md mx-auto">
                <button
                  onClick={() => copyToClipboard(createdOrder.paymentDetails?.pixCopyPaste || '')}
                  className="w-full bg-[#1A1A1A] hover:bg-[#C18282] text-white text-xs uppercase font-semibold py-3 px-4 rounded-sm transition-colors flex items-center justify-center gap-2"
                >
                  {copiedPix ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedPix ? 'CHAVE PIX COPIADA!' : 'COPIAR CHAVE PIX (COPIA E COLA)'}</span>
                </button>
              </div>
            </div>
          )}

          {createdOrder.paymentMethod === 'credit_card' && (
            <div className="bg-emerald-50 border border-emerald-200 p-4 rounded text-center text-xs text-emerald-800 space-y-1">
              <p className="font-bold text-sm">✓ Pagamento Aprovado no Cartão de Crédito!</p>
              <p>Seu pedido já entrou em processo de separação e embalagem.</p>
            </div>
          )}

          {/* Order Details Summary */}
          <div className="border-t border-[#1A1A1A]/10 pt-4 space-y-3 text-xs">
            <h4 className="font-bold text-neutral-800 uppercase tracking-wider">Resumo da Compra</h4>
            <div className="space-y-2">
              {createdOrder.items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-neutral-600">
                  <span>{item.quantity}x {item.productName} ({item.colorName} / {item.size})</span>
                  <span className="font-medium">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-200 pt-2 flex justify-between font-bold text-sm text-[#1A1A1A]">
              <span>Total Pago</span>
              <span className="text-[#C18282]">R$ {createdOrder.total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setCurrentView('orders')}
              className="flex-1 bg-[#1A1A1A] text-white text-xs uppercase tracking-widest font-semibold py-3.5 rounded hover:bg-[#C18282] transition-colors"
            >
              ACOMPANHAR MEUS PEDIDOS
            </button>
            <button
              onClick={() => setCurrentView('store')}
              className="flex-1 border border-neutral-300 text-neutral-700 text-xs uppercase tracking-widest font-semibold py-3.5 rounded hover:bg-neutral-100 transition-colors"
            >
              VOLTAR PARA A LOJA
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F6] py-10 px-4 font-sans">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header Back Link */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setCurrentView('store')}
            className="flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-neutral-600 hover:text-[#C18282] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para a Loja
          </button>

          <div className="flex items-center gap-2 text-emerald-700 text-xs font-medium bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <Lock className="w-3.5 h-3.5" />
            <span>Ambiente Criptografado 256-bit • Mercado Pago</span>
          </div>
        </div>

        <h1 className="font-serif italic text-3xl text-[#1A1A1A] text-center sm:text-left">
          Checkout Transparente Glow Fitness
        </h1>

        <form onSubmit={handleSubmitCheckout} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Form: Customer & Payment */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Customer Info */}
            <div className="bg-white p-6 border border-[#1A1A1A]/10 shadow-sm rounded-sm space-y-4">
              <h3 className="font-serif italic text-xl font-normal text-[#1A1A1A] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white text-xs flex items-center justify-center font-sans font-bold not-italic">
                  1
                </span>
                Dados Pessoais
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-neutral-600 mb-1 font-medium">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={customer.name}
                    onChange={e => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded focus:border-[#C18282] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1 font-medium">E-mail para Confirmação</label>
                  <input
                    type="email"
                    required
                    value={customer.email}
                    onChange={e => setCustomer({ ...customer, email: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded focus:border-[#C18282] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1 font-medium">Telefone / WhatsApp</label>
                  <input
                    type="text"
                    required
                    value={customer.phone}
                    onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded focus:border-[#C18282] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1 font-medium">CPF (Nota Fiscal)</label>
                  <input
                    type="text"
                    required
                    value={customer.cpf}
                    onChange={e => setCustomer({ ...customer, cpf: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded focus:border-[#C18282] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Shipping Address */}
            <div className="bg-white p-6 border border-[#1A1A1A]/10 shadow-sm rounded-sm space-y-4">
              <h3 className="font-serif italic text-xl font-normal text-[#1A1A1A] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white text-xs flex items-center justify-center font-sans font-bold not-italic">
                  2
                </span>
                Endereço de Entrega
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block text-neutral-600 mb-1 font-medium">CEP</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.zipCode}
                    onChange={e => setShippingAddress({ ...shippingAddress, zipCode: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded focus:border-[#C18282] outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-neutral-600 mb-1 font-medium">Rua / Logradouro</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.street}
                    onChange={e => setShippingAddress({ ...shippingAddress, street: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded focus:border-[#C18282] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1 font-medium">Número</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.number}
                    onChange={e => setShippingAddress({ ...shippingAddress, number: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded focus:border-[#C18282] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1 font-medium">Bairro</label>
                  <input
                    type="text"
                    required
                    value={shippingAddress.neighborhood}
                    onChange={e => setShippingAddress({ ...shippingAddress, neighborhood: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded focus:border-[#C18282] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-600 mb-1 font-medium">Cidade / UF</label>
                  <input
                    type="text"
                    required
                    value={`${shippingAddress.city} - ${shippingAddress.state}`}
                    onChange={e => {
                      const [c, s] = e.target.value.split('-');
                      setShippingAddress({ ...shippingAddress, city: c?.trim() || 'São Paulo', state: s?.trim() || 'SP' });
                    }}
                    className="w-full p-2.5 border border-neutral-300 rounded focus:border-[#C18282] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Payment Method Selection */}
            <div className="bg-white p-6 border border-[#1A1A1A]/10 shadow-sm rounded-sm space-y-4">
              <h3 className="font-serif italic text-xl font-normal text-[#1A1A1A] flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white text-xs flex items-center justify-center font-sans font-bold not-italic">
                  3
                </span>
                Forma de Pagamento Mercado Pago
              </h3>

              {/* Method Selector Tabs */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pix')}
                  className={`p-3 border rounded text-xs flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === 'pix'
                      ? 'border-[#C18282] bg-[#FAF0EE] text-[#1A1A1A] font-bold shadow-xs'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                  }`}
                >
                  <QrCode className="w-5 h-5 text-emerald-600" />
                  <span>PIX (Instantâneo)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('credit_card')}
                  className={`p-3 border rounded text-xs flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === 'credit_card'
                      ? 'border-[#C18282] bg-[#FAF0EE] text-[#1A1A1A] font-bold shadow-xs'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                  }`}
                >
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span>Cartão até 6x</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('boleto')}
                  className={`p-3 border rounded text-xs flex flex-col items-center gap-2 transition-all ${
                    paymentMethod === 'boleto'
                      ? 'border-[#C18282] bg-[#FAF0EE] text-[#1A1A1A] font-bold shadow-xs'
                      : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                  }`}
                >
                  <FileText className="w-5 h-5 text-neutral-700" />
                  <span>Boleto Bancário</span>
                </button>
              </div>

              {/* Credit Card Inputs */}
              {paymentMethod === 'credit_card' && (
                <div className="p-4 bg-neutral-50 rounded border border-neutral-200 space-y-3 text-xs">
                  <div>
                    <label className="block text-neutral-600 mb-1 font-medium">Número do Cartão</label>
                    <input
                      type="text"
                      required
                      value={cardDetails.number}
                      onChange={e => setCardDetails({ ...cardDetails, number: e.target.value })}
                      className="w-full p-2.5 border border-neutral-300 rounded bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-neutral-600 mb-1 font-medium">Validade</label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        required
                        value={cardDetails.expiry}
                        onChange={e => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        className="w-full p-2.5 border border-neutral-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-neutral-600 mb-1 font-medium">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        required
                        value={cardDetails.cvv}
                        onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                        className="w-full p-2.5 border border-neutral-300 rounded bg-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-neutral-600 mb-1 font-medium">Parcelas (Sem Juros)</label>
                    <select
                      value={cardDetails.installments}
                      onChange={e => setCardDetails({ ...cardDetails, installments: Number(e.target.value) })}
                      className="w-full p-2.5 border border-neutral-300 rounded bg-white font-medium"
                    >
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <option key={num} value={num}>
                          {num}x de R$ {(finalTotal / num).toFixed(2).replace('.', ',')} sem juros
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

            </div>

          </div>

          {/* Right Summary Panel */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 border border-[#1A1A1A]/10 shadow-sm rounded-sm space-y-4 sticky top-24">
              <h3 className="font-serif italic text-xl font-normal text-[#1A1A1A] border-b border-[#1A1A1A]/10 pb-3">
                Resumo da Compra ({cart.length} itens)
              </h3>

              {/* Items preview */}
              <div className="max-h-56 overflow-y-auto space-y-3 pr-1">
                {cart.map(item => (
                  <div key={item.id} className="flex gap-3 text-xs border-b border-neutral-100 pb-2">
                    <img src={item.productImage} alt="" className="w-12 h-14 object-cover rounded" />
                    <div className="flex-1">
                      <p className="font-semibold text-neutral-800 line-clamp-1">{item.productName}</p>
                      <p className="text-neutral-500">{item.quantity}x • {item.colorName || 'Padrão'}</p>
                      <p className="font-bold text-neutral-900 mt-1">
                        R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Input */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Cupom de Desconto</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={e => setCouponInput(e.target.value)}
                    placeholder="Ex: GLOW10"
                    className="flex-1 p-2 border border-neutral-300 rounded text-xs uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="bg-neutral-800 text-white text-xs px-3 rounded font-semibold hover:bg-[#C18282] transition-colors"
                  >
                    Aplicar
                  </button>
                </div>
                {appliedCoupon && (
                  <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
                    ✓ Cupom {appliedCoupon} aplicado com sucesso!
                  </span>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-2 text-xs border-t border-neutral-200 pt-3">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>R$ {cartSubtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Desconto Cupom</span>
                    <span>- R$ {discountAmount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>Frete</span>
                  {shippingFee === 0 ? (
                    <span className="text-emerald-600 font-bold">GRÁTIS</span>
                  ) : (
                    <span>R$ {shippingFee.toFixed(2).replace('.', ',')}</span>
                  )}
                </div>

                <div className="flex justify-between text-base font-bold text-[#1A1A1A] border-t border-neutral-300 pt-3">
                  <span>Total</span>
                  <span className="text-[#C18282]">R$ {finalTotal.toFixed(2).replace('.', ',')}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || cart.length === 0}
                className="w-full bg-[#1A1A1A] hover:bg-[#C18282] text-white uppercase tracking-widest text-xs font-bold py-4 rounded-sm transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isSubmitting ? 'PROCESSANDO MERCADO PAGO...' : 'FINALIZAR COM MERCADO PAGO'}</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
