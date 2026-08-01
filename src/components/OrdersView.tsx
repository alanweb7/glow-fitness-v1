import React from 'react';
import { Package, Truck, CheckCircle, Clock, ArrowLeft, Copy, QrCode } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const OrdersView: React.FC = () => {
  const { orders, setCurrentView } = useStore();

  return (
    <div className="py-12 bg-[#FAF7F6] min-h-screen font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="flex justify-between items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.3em] text-[#C18282] font-semibold">
              Área da Cliente
            </span>
            <h1 className="font-serif italic text-3xl text-[#1A1A1A]">Meus Pedidos</h1>
          </div>

          <button
            onClick={() => setCurrentView('store')}
            className="flex items-center gap-2 text-xs uppercase font-semibold text-neutral-600 hover:text-[#C18282] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar à Loja
          </button>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white p-12 border border-[#1A1A1A]/10 text-center rounded-sm space-y-4">
            <Package className="w-12 h-12 text-neutral-300 mx-auto" />
            <p className="text-sm text-neutral-500 font-light">Você ainda não realizou nenhum pedido em nossa loja.</p>
            <button
              onClick={() => setCurrentView('catalog')}
              className="bg-[#C18282] text-white text-xs uppercase font-semibold px-6 py-3 rounded"
            >
              FAZER PRIMEIRA COMPRA
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div key={order.id} className="bg-white border border-[#1A1A1A]/10 shadow-sm rounded-sm p-6 space-y-6">
                
                {/* Header info */}
                <div className="flex flex-wrap justify-between items-center border-b border-neutral-100 pb-4 gap-2 text-xs">
                  <div>
                    <span className="text-neutral-500 font-light">Pedido</span>
                    <h3 className="text-base font-bold text-[#1A1A1A]">{order.orderNumber}</h3>
                    <span className="text-neutral-400">{new Date(order.createdAt).toLocaleDateString('pt-BR')}</span>
                  </div>

                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      order.status === 'Pago' ? 'bg-emerald-100 text-emerald-800' :
                      order.status === 'Enviado' ? 'bg-blue-100 text-blue-800' :
                      order.status === 'Entregue' ? 'bg-purple-100 text-purple-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {order.status}
                    </span>
                    <span className="block text-sm font-bold text-[#C18282] mt-1">
                      R$ {order.total.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* Status Timeline */}
                <div className="bg-[#FAF7F6] p-4 rounded text-xs space-y-2">
                  <span className="font-semibold text-neutral-700 block">Linha do Tempo do Pedido:</span>
                  <div className="grid grid-cols-4 gap-2 text-center pt-2">
                    {['Pendente', 'Pago', 'Enviado', 'Entregue'].map((st, idx) => {
                      const isPast = ['Pendente', 'Pago', 'Em Separação', 'Enviado', 'Entregue'].indexOf(order.status) >= idx;
                      return (
                        <div key={st} className="flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            isPast ? 'bg-[#C18282] text-white' : 'bg-neutral-200 text-neutral-400'
                          }`}>
                            {idx + 1}
                          </div>
                          <span className={`mt-1 text-[11px] ${isPast ? 'font-semibold text-neutral-800' : 'text-neutral-400'}`}>
                            {st}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Tracking Code if Available */}
                {order.trackingCode && (
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded text-xs text-blue-900 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Truck className="w-4 h-4 text-blue-600" />
                      <span>Código de Rastreio: <strong>{order.trackingCode}</strong></span>
                    </div>
                    <a
                      href={`https://rastreamento.correios.com.br/app/index.php?codigo=${order.trackingCode}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-700 font-bold underline"
                    >
                      Rastrear nos Correios
                    </a>
                  </div>
                )}

                {/* Items */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-neutral-700 uppercase tracking-wider">Itens do Pedido:</h4>
                  <div className="space-y-2">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between items-center text-xs py-1 border-b border-neutral-50">
                        <div className="flex items-center gap-3">
                          <img src={item.productImage} alt="" className="w-10 h-12 object-cover rounded" />
                          <div>
                            <span className="font-medium text-neutral-800 block">{item.productName}</span>
                            <span className="text-neutral-500">{item.colorName} • Tam: {item.size} • Qtd: {item.quantity}</span>
                          </div>
                        </div>
                        <span className="font-semibold text-neutral-900">
                          R$ {(item.price * item.quantity).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
