import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, CreditCard, QrCode, FileText, CheckCircle, ArrowLeft, Copy, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Order, PaymentMethod } from '../types';

export const CheckoutModal: React.FC = () => {
  const { cart, cartSubtotal, settings, coupons, createOrder } = useStore();
  const navigate = useNavigate();

  const [step, setStep] = useState<'form' | 'success'>('form');
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form state
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerCpf, setCustomerCpf] = useState('');
  const [addressStreet, setAddressStreet] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [addressComplement, setAddressComplement] = useState('');
  const [addressNeighborhood, setAddressNeighborhood] = useState('');
  const [addressCity, setAddressCity] = useState('');
  const [addressState, setAddressState] = useState('');
  const [addressZipCode, setAddressZipCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix');
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState<{ code: string; discount: number } | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);

  // Card state
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardInstallments, setCardInstallments] = useState(1);

  const freeShipping = cartSubtotal >= settings.freeShippingThreshold;
  const shippingFee = freeShipping ? 0 : 15.90;
  const discount = couponApplied?.discount || 0;
  const total = cartSubtotal - discount + shippingFee;

  const applyCoupon = () => {
    const coupon = coupons.find(
      c => c.code.toUpperCase() === couponCode.toUpperCase() && c.active && new Date(c.expiresAt) > new Date()
    );
    if (coupon && cartSubtotal >= coupon.minOrderValue) {
      let disc = 0;
      if (coupon.type === 'fixed') disc = coupon.value;
      else if (coupon.type === 'percentage') disc = (cartSubtotal * coupon.value) / 100;
      else if (coupon.type === 'free_shipping') disc = 0;
      setCouponApplied({ code: coupon.code, discount: disc });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const order = await createOrder({
        customer: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone,
          cpf: customerCpf,
        },
        shippingAddress: {
          street: addressStreet,
          number: addressNumber,
          complement: addressComplement,
          neighborhood: addressNeighborhood,
          city: addressCity,
          state: addressState,
          zipCode: addressZipCode,
        },
        items: cart,
        paymentMethod,
        paymentDetails: paymentMethod === 'pix'
          ? { pixCopyPaste: '00020126580014br.gov.bcb.pix0136glow-fitness@email.com520400005303986540' + total.toFixed(2) + '582BR5913GLOW FITNESS6009SAO PAULO62070503***6304' }
          : paymentMethod === 'boleto'
          ? { boletoBarcode: '23793.38128 60000.000003 00000.000400 1 843400000' + Math.floor(Math.random() * 9000 + 1000) }
          : { cardBrand: 'Visa', installments: cardInstallments },
        subtotal: cartSubtotal,
        discount,
        shippingFee,
        total,
      });

      setCreatedOrder(order);
      setStep('success');
    } catch (err) {
      console.error('Erro ao criar pedido:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (step === 'success' && createdOrder) {
    return (
      <div className="min-h-screen bg-[#FAF7F6] py-10 px-4 font-sans">
        <div className="max-w-2xl mx-auto bg-white p-8 sm:p-12 border border-[#1A1A1A]/10 rounded-sm text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>

          <div>
            <h1 className="font-serif italic text-3xl text-[#1A1A1A]">Pedido Confirmado!</h1>
            <p className="text-sm text-neutral-500 mt-2">Obrigada por comprar na Glow Fitness.</p>
          </div>

          <div className="bg-neutral-50 p-5 rounded border border-neutral-200 text-left space-y-2 text-xs text-neutral-600">
            <div className="flex justify-between">
              <span>Número do Pedido:</span>
              <strong className="text-[#1A1A1A]">{createdOrder.orderNumber}</strong>
            </div>
            <div className="flex justify-between">
              <span>Forma de Pagamento:</span>
              <strong className="text-[#1A1A1A] uppercase">{createdOrder.paymentMethod === 'pix' ? 'PIX' : createdOrder.paymentMethod === 'boleto' ? 'Boleto' : 'Cartão de Crédito'}</strong>
            </div>
            <div className="flex justify-between border-t border-neutral-200 pt-2 mt-2">
              <span className="font-semibold">Total Pago:</span>
              <strong className="text-[#C18282] text-sm">R$ {createdOrder.total.toFixed(2).replace('.', ',')}</strong>
            </div>
          </div>

          {createdOrder.paymentMethod === 'pix' && (
            <div className="bg-emerald-50 p-4 rounded border border-emerald-200 text-left space-y-2">
              <p className="text-xs font-semibold text-emerald-800 flex items-center gap-1">
                <QrCode className="w-4 h-4" /> PIX - Pagamento Instantâneo
              </p>
              <p className="text-[11px] text-emerald-700">Escaneie o QR Code ou copie o código abaixo para pagar.</p>
              <div className="flex items-center gap-2 bg-white p-2 rounded border border-emerald-200">
                <code className="flex-1 text-[10px] text-neutral-600 break-all font-mono">
                  {createdOrder.paymentDetails?.pixCopyPaste || '00020126580014br.gov.bcb.pix0136glow-fitness@email.com'}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(createdOrder.paymentDetails?.pixCopyPaste || '');
                    setCopiedPix(true);
                    setTimeout(() => setCopiedPix(false), 2000);
                  }}
                  className="p-1.5 text-emerald-600 hover:bg-emerald-100 rounded"
                >
                  {copiedPix ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {createdOrder.paymentMethod === 'boleto' && (
            <div className="bg-amber-50 p-4 rounded border border-amber-200 text-left space-y-2">
              <p className="text-xs font-semibold text-amber-800 flex items-center gap-1">
                <FileText className="w-4 h-4" /> Boleto Bancário
              </p>
              <p className="text-[11px] text-amber-700">O boleto será enviado para seu e-mail. Prazo de compensação: até 3 dias úteis.</p>
              <div className="flex items-center gap-2 bg-white p-2 rounded border border-amber-200">
                <code className="flex-1 text-[10px] text-neutral-600 break-all font-mono">
                  {createdOrder.paymentDetails?.boletoBarcode || '23793.38128 60000.000003 00000.000400 1 8434000000000'}
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(createdOrder.paymentDetails?.boletoBarcode || '');
                    setCopiedPix(true);
                    setTimeout(() => setCopiedPix(false), 2000);
                  }}
                  className="p-1.5 text-amber-600 hover:bg-amber-100 rounded"
                >
                  {copiedPix ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => navigate('/orders')}
              className="flex-1 bg-[#1A1A1A] text-white text-xs uppercase tracking-widest font-semibold py-3.5 rounded hover:bg-[#C18282] transition-colors"
            >
              ACOMPANHAR MEUS PEDIDOS
            </button>
            <button
              onClick={() => navigate('/')}
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
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-xs uppercase font-semibold tracking-wider text-neutral-600 hover:text-[#C18282] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar para a Loja
          </button>

          <div className="flex items-center gap-2 text-emerald-700 text-xs font-medium bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <Lock className="w-3.5 h-3.5" />
            <span>Ambiente Criptografado 256-bit • Mercado Pago</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Forms */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Customer Info */}
              <div className="bg-white p-6 border border-[#1A1A1A]/10 rounded-sm space-y-4">
                <h2 className="text-sm uppercase tracking-widest font-semibold text-[#1A1A1A] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white text-[10px] flex items-center justify-center font-bold">1</span>
                  Dados Pessoais
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Nome completo *"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    required
                    className="p-3 border border-neutral-300 rounded text-xs outline-none focus:border-[#C18282]"
                  />
                  <input
                    type="tel"
                    placeholder="Telefone (com DDD) *"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    required
                    className="p-3 border border-neutral-300 rounded text-xs outline-none focus:border-[#C18282]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="email"
                    placeholder="E-mail *"
                    value={customerEmail}
                    onChange={e => setCustomerEmail(e.target.value)}
                    required
                    className="p-3 border border-neutral-300 rounded text-xs outline-none focus:border-[#C18282]"
                  />
                  <input
                    type="text"
                    placeholder="CPF *"
                    value={customerCpf}
                    onChange={e => setCustomerCpf(e.target.value)}
                    required
                    className="p-3 border border-neutral-300 rounded text-xs outline-none focus:border-[#C18282]"
                  />
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-white p-6 border border-[#1A1A1A]/10 rounded-sm space-y-4">
                <h2 className="text-sm uppercase tracking-widest font-semibold text-[#1A1A1A] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white text-[10px] flex items-center justify-center font-bold">2</span>
                  Endereço de Entrega
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="CEP *"
                    value={addressZipCode}
                    onChange={e => setAddressZipCode(e.target.value)}
                    required
                    className="p-3 border border-neutral-300 rounded text-xs outline-none focus:border-[#C18282] sm:col-span-1"
                  />
                  <input
                    type="text"
                    placeholder="Rua / Avenida *"
                    value={addressStreet}
                    onChange={e => setAddressStreet(e.target.value)}
                    required
                    className="p-3 border border-neutral-300 rounded text-xs outline-none focus:border-[#C18282] sm:col-span-2"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Número *"
                    value={addressNumber}
                    onChange={e => setAddressNumber(e.target.value)}
                    required
                    className="p-3 border border-neutral-300 rounded text-xs outline-none focus:border-[#C18282]"
                  />
                  <input
                    type="text"
                    placeholder="Complemento"
                    value={addressComplement}
                    onChange={e => setAddressComplement(e.target.value)}
                    className="p-3 border border-neutral-300 rounded text-xs outline-none focus:border-[#C18282]"
                  />
                  <input
                    type="text"
                    placeholder="Bairro *"
                    value={addressNeighborhood}
                    onChange={e => setAddressNeighborhood(e.target.value)}
                    required
                    className="p-3 border border-neutral-300 rounded text-xs outline-none focus:border-[#C18282]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Cidade *"
                    value={addressCity}
                    onChange={e => setAddressCity(e.target.value)}
                    required
                    className="p-3 border border-neutral-300 rounded text-xs outline-none focus:border-[#C18282]"
                  />
                  <select
                    value={addressState}
                    onChange={e => setAddressState(e.target.value)}
                    required
                    className="p-3 border border-neutral-300 rounded text-xs outline-none focus:border-[#C18282] bg-white"
                  >
                    <option value="">Estado *</option>
                    <option value="AC">Acre</option><option value="AL">Alagoas</option><option value="AP">Amapá</option>
                    <option value="AM">Amazonas</option><option value="BA">Bahia</option><option value="CE">Ceará</option>
                    <option value="DF">Distrito Federal</option><option value="ES">Espírito Santo</option><option value="GO">Goiás</option>
                    <option value="MA">Maranhão</option><option value="MT">Mato Grosso</option><option value="MS">Mato Grosso do Sul</option>
                    <option value="MG">Minas Gerais</option><option value="PA">Pará</option><option value="PB">Paraíba</option>
                    <option value="PR">Paraná</option><option value="PE">Pernambuco</option><option value="PI">Piauí</option>
                    <option value="RJ">Rio de Janeiro</option><option value="RN">Rio Grande do Norte</option><option value="RS">Rio Grande do Sul</option>
                    <option value="RO">Rondônia</option><option value="RR">Roraima</option><option value="SC">Santa Catarina</option>
                    <option value="SP">São Paulo</option><option value="SE">Sergipe</option><option value="TO">Tocantins</option>
                  </select>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white p-6 border border-[#1A1A1A]/10 rounded-sm space-y-4">
                <h2 className="text-sm uppercase tracking-widest font-semibold text-[#1A1A1A] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1A1A1A] text-white text-[10px] flex items-center justify-center font-bold">3</span>
                  Forma de Pagamento
                </h2>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pix')}
                    className={`p-4 border rounded text-center text-xs font-semibold uppercase tracking-wider transition-all ${
                      paymentMethod === 'pix'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-neutral-300 text-neutral-500 hover:border-neutral-400'
                    }`}
                  >
                    <QrCode className="w-5 h-5 mx-auto mb-1" />
                    PIX
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-4 border rounded text-center text-xs font-semibold uppercase tracking-wider transition-all ${
                      paymentMethod === 'credit_card'
                        ? 'border-[#C18282] bg-[#FAF0EE] text-[#C18282]'
                        : 'border-neutral-300 text-neutral-500 hover:border-neutral-400'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto mb-1" />
                    Cartão
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('boleto')}
                    className={`p-4 border rounded text-center text-xs font-semibold uppercase tracking-wider transition-all ${
                      paymentMethod === 'boleto'
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-neutral-300 text-neutral-500 hover:border-neutral-400'
                    }`}
                  >
                    <FileText className="w-5 h-5 mx-auto mb-1" />
                    Boleto
                  </button>
                </div>

                {paymentMethod === 'pix' && (
                  <div className="bg-emerald-50 p-4 rounded border border-emerald-200 text-xs text-emerald-700 space-y-1">
                    <p className="font-semibold">Pagamento Instantâneo via PIX</p>
                    <p>Após confirmar o pedido, um QR Code será gerado. O pagamento é aprovado em segundos.</p>
                    <p className="text-[10px] text-emerald-600">Taxa: R$ 0,00 • Aprovação: Instantânea</p>
                  </div>
                )}

                {paymentMethod === 'credit_card' && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Número do Cartão *"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                      required
                      className="w-full p-3 border border-neutral-300 rounded text-xs outline-none focus:border-[#C18282]"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Nome no Cartão *"
                        value={cardName}
                        onChange={e => setCardName(e.target.value)}
                        required
                        className="p-3 border border-neutral-300 rounded text-xs outline-none focus:border-[#C18282]"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="MM/AA *"
                          value={cardExpiry}
                          onChange={e => setCardExpiry(e.target.value)}
                          required
                          className="p-3 border border-neutral-300 rounded text-xs outline-none focus:border-[#C18282]"
                        />
                        <input
                          type="text"
                          placeholder="CVV *"
                          value={cardCvv}
                          onChange={e => setCardCvv(e.target.value)}
                          required
                          className="p-3 border border-neutral-300 rounded text-xs outline-none focus:border-[#C18282]"
                        />
                      </div>
                    </div>
                    <select
                      value={cardInstallments}
                      onChange={e => setCardInstallments(Number(e.target.value))}
                      className="w-full p-3 border border-neutral-300 rounded text-xs outline-none focus:border-[#C18282] bg-white"
                    >
                      {[1, 2, 3, 4, 5, 6].map(n => (
                        <option key={n} value={n}>
                          {n}x de R$ {(total / n).toFixed(2).replace('.', ',')} {n === 1 ? 'à vista' : 'sem juros'}
                        </option>
                      ))}
                    </select>
                    <div className="bg-blue-50 p-3 rounded border border-blue-200 text-[11px] text-blue-700 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 flex-shrink-0" />
                      Checkout Transparente Mercado Pago • Seus dados estão protegidos com criptografia SSL 256-bit.
                    </div>
                  </div>
                )}

                {paymentMethod === 'boleto' && (
                  <div className="bg-amber-50 p-4 rounded border border-amber-200 text-xs text-amber-700 space-y-1">
                    <p className="font-semibold">Boleto Bancário</p>
                    <p>O boleto será gerado após a confirmação. Prazo de compensação: até 3 dias úteis.</p>
                    <p className="text-[10px] text-amber-600">Envio por e-mail • Entrega após compensação</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-5">
              <div className="bg-white p-6 border border-[#1A1A1A]/10 rounded-sm space-y-4 sticky top-24">
                <h2 className="text-sm uppercase tracking-widest font-semibold text-[#1A1A1A] border-b border-neutral-200 pb-3">
                  RESUMO DO PEDIDO
                </h2>

                {/* Items */}
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.id} className="flex gap-3 text-xs">
                      <img src={item.productImage} alt="" className="w-12 h-14 object-cover rounded bg-neutral-100 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-[#1A1A1A] line-clamp-1">{item.productName}</p>
                        <p className="text-neutral-400 text-[10px]">{item.colorName && `${item.colorName} / `}{item.size} • Qtd: {item.quantity}</p>
                      </div>
                      <span className="font-semibold text-[#1A1A1A]">R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
                    </div>
                  ))}
                </div>

                {/* Coupon */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Cupom de desconto"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                    className="flex-1 p-2.5 border border-neutral-300 rounded text-xs outline-none focus:border-[#C18282]"
                  />
                  <button
                    type="button"
                    onClick={applyCoupon}
                    className="bg-[#1A1A1A] text-white px-4 py-2.5 rounded text-xs font-semibold hover:bg-[#C18282] transition-colors"
                  >
                    Aplicar
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-[11px] text-emerald-600 font-medium">Cupom {couponApplied.code} aplicado! -R$ {couponApplied.discount.toFixed(2).replace('.', ',')}</p>
                )}

                {/* Totals */}
                <div className="space-y-2 text-xs border-t border-neutral-200 pt-3">
                  <div className="flex justify-between text-neutral-500">
                    <span>Subtotal</span>
                    <span>R$ {cartSubtotal.toFixed(2).replace('.', ',')}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Desconto</span>
                      <span>-R$ {discount.toFixed(2).replace('.', ',')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-neutral-500">
                    <span>Frete</span>
                    <span>{freeShipping ? <span className="text-emerald-600 font-semibold">GRÁTIS</span> : `R$ ${shippingFee.toFixed(2).replace('.', ',')}`}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-[#1A1A1A] border-t border-neutral-200 pt-2 mt-2">
                    <span>TOTAL</span>
                    <span className="text-[#C18282]">R$ {total.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || cart.length === 0}
                  className="w-full bg-[#1A1A1A] hover:bg-[#C18282] text-white uppercase tracking-widest text-xs font-semibold py-4 rounded transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <span className="animate-pulse">Processando...</span>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      CONFIRMAR PEDIDO
                    </>
                  )}
                </button>

                <p className="text-[10px] text-center text-neutral-400">
                  Ao confirmar, você concorda com nossos termos de uso e política de privacidade.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
