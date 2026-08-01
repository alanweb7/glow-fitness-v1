import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Settings,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  TrendingUp,
  DollarSign,
  Users,
  Eye,
  Save,
  Truck,
  ArrowLeft,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Product, Order, Category, Coupon } from '../types';

export const AdminPanel: React.FC = () => {
  const {
    products,
    categories,
    orders,
    coupons,
    settings,
    updateProduct,
    createProduct,
    deleteProduct,
    updateOrderStatus,
    updateSettings,
    addCoupon,
    toggleCouponStatus,
    setCurrentView,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'kpis' | 'products' | 'orders' | 'coupons' | 'settings'>('kpis');

  // New Product Modal State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  // Stats calculation
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const paidOrdersCount = orders.length;
  const avgTicket = paidOrdersCount > 0 ? totalRevenue / paidOrdersCount : 0;

  // Save/Edit Product
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price) return;

    if (editingProduct.id) {
      await updateProduct(editingProduct.id, editingProduct);
    } else {
      await createProduct({
        name: editingProduct.name,
        slug: editingProduct.name.toLowerCase().replace(/\s+/g, '-'),
        price: Number(editingProduct.price),
        promotionalPrice: editingProduct.promotionalPrice ? Number(editingProduct.promotionalPrice) : undefined,
        categoryId: editingProduct.categoryId || categories[0]?.id || 'cat-1',
        categoryName: categories.find(c => c.id === editingProduct.categoryId)?.name || 'Coleção',
        brand: 'Glow Fitness',
        images: editingProduct.images?.length ? editingProduct.images : ['https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800'],
        shortDescription: editingProduct.shortDescription || 'Peça fitness de alta compressão',
        fullDescription: editingProduct.fullDescription || 'Desenvolvida com fios de poliamida nobre e elastano.',
        rating: 5.0,
        reviewsCount: 1,
        isNew: !!editingProduct.isNew,
        isOnSale: !!editingProduct.isOnSale,
        isFeatured: editingProduct.isFeatured !== false,
        variations: editingProduct.variations || [
          { colorName: 'Bordô', colorHex: '#7A2E3B', size: 'M', stock: 10 },
        ],
        tags: editingProduct.tags || ['fitness', 'glow'],
      });
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-[#F4F1F0] text-[#1A1A1A] font-sans">
      
      {/* Admin Header Navbar */}
      <header className="bg-[#121212] text-white py-4 px-6 border-b border-neutral-800 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <span className="font-serif italic text-2xl text-[#EAD3D0]">Glow</span>
          <span className="text-[10px] uppercase tracking-[0.25em] bg-[#C18282] px-2 py-0.5 rounded font-bold">
            PAINEL ADMINISTRATIVO
          </span>
        </div>

        <button
          onClick={() => setCurrentView('store')}
          className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar à Loja Principal
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-300 gap-2 overflow-x-auto pb-1 text-xs font-semibold uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('kpis')}
            className={`px-4 py-3 rounded-t flex items-center gap-2 transition-colors ${
              activeTab === 'kpis' ? 'bg-white border-t-2 border-[#C18282] text-[#1A1A1A] font-bold shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" /> Visão Geral & Métricas
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-3 rounded-t flex items-center gap-2 transition-colors ${
              activeTab === 'products' ? 'bg-white border-t-2 border-[#C18282] text-[#1A1A1A] font-bold shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Package className="w-4 h-4" /> Gestão de Produtos ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-3 rounded-t flex items-center gap-2 transition-colors ${
              activeTab === 'orders' ? 'bg-white border-t-2 border-[#C18282] text-[#1A1A1A] font-bold shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <ShoppingBag className="w-4 h-4" /> Pedidos Clientes ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-3 rounded-t flex items-center gap-2 transition-colors ${
              activeTab === 'coupons' ? 'bg-white border-t-2 border-[#C18282] text-[#1A1A1A] font-bold shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Tag className="w-4 h-4" /> Cupons de Desconto
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-3 rounded-t flex items-center gap-2 transition-colors ${
              activeTab === 'settings' ? 'bg-white border-t-2 border-[#C18282] text-[#1A1A1A] font-bold shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
            }`}
          >
            <Settings className="w-4 h-4" /> Configurações da Loja
          </button>
        </div>

        {/* Tab 1: KPIs & Overview */}
        {activeTab === 'kpis' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="bg-white p-5 border border-neutral-200 rounded shadow-xs space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">Faturamento Total</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-neutral-900">R$ {totalRevenue.toFixed(2).replace('.', ',')}</span>
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
              </div>

              <div className="bg-white p-5 border border-neutral-200 rounded shadow-xs space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">Total de Pedidos</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-neutral-900">{paidOrdersCount}</span>
                  <ShoppingBag className="w-6 h-6 text-blue-600" />
                </div>
              </div>

              <div className="bg-white p-5 border border-neutral-200 rounded shadow-xs space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">Ticket Médio</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-neutral-900">R$ {avgTicket.toFixed(2).replace('.', ',')}</span>
                  <TrendingUp className="w-6 h-6 text-[#C18282]" />
                </div>
              </div>

              <div className="bg-white p-5 border border-neutral-200 rounded shadow-xs space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">Produtos Ativos</span>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-neutral-900">{products.length}</span>
                  <Package className="w-6 h-6 text-amber-600" />
                </div>
              </div>
            </div>

            {/* Recent Orders table */}
            <div className="bg-white border border-neutral-200 rounded shadow-xs p-6 space-y-4">
              <h3 className="font-serif italic text-xl">Últimos Pedidos Recebidos</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-neutral-100 uppercase text-neutral-500 border-b border-neutral-200 font-bold">
                    <tr>
                      <th className="p-3">Pedido</th>
                      <th className="p-3">Cliente</th>
                      <th className="p-3">Pagamento</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {orders.slice(0, 5).map(o => (
                      <tr key={o.id} className="hover:bg-neutral-50">
                        <td className="p-3 font-bold text-[#1A1A1A]">{o.orderNumber}</td>
                        <td className="p-3 font-medium">{o.customer.name}</td>
                        <td className="p-3 uppercase text-neutral-500">{o.paymentMethod}</td>
                        <td className="p-3 font-bold">R$ {o.total.toFixed(2).replace('.', ',')}</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                            {o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Products Manager */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded border border-neutral-200">
              <h3 className="font-serif italic text-xl">Catálogo de Produtos ({products.length})</h3>
              <button
                onClick={() => {
                  setEditingProduct({
                    name: '',
                    price: 99.9,
                    promotionalPrice: 79.9,
                    categoryId: categories[0]?.id || 'cat-1',
                    isNew: true,
                    isFeatured: true,
                    images: ['https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800'],
                  });
                  setIsProductModalOpen(true);
                }}
                className="bg-[#1A1A1A] hover:bg-[#C18282] text-white text-xs uppercase font-bold px-4 py-2.5 rounded transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Novo Produto
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map(prod => (
                <div key={prod.id} className="bg-white p-4 border border-neutral-200 rounded flex gap-4 items-center">
                  <img src={prod.images[0]} alt="" className="w-20 h-24 object-cover rounded bg-neutral-100" />
                  <div className="flex-1 space-y-1 text-xs">
                    <span className="text-[10px] text-neutral-400 uppercase font-semibold">{prod.categoryName}</span>
                    <h4 className="font-bold text-neutral-900 line-clamp-1">{prod.name}</h4>
                    <div className="font-semibold text-neutral-800">
                      R$ {prod.price.toFixed(2).replace('.', ',')}
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => {
                          setEditingProduct(prod);
                          setIsProductModalOpen(true);
                        }}
                        className="p-1.5 bg-neutral-100 hover:bg-[#C18282] hover:text-white rounded text-neutral-700 transition-colors"
                        title="Editar"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteProduct(prod.id)}
                        className="p-1.5 bg-neutral-100 hover:bg-red-600 hover:text-white rounded text-neutral-700 transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Orders Manager */}
        {activeTab === 'orders' && (
          <div className="bg-white border border-neutral-200 rounded p-6 space-y-4">
            <h3 className="font-serif italic text-xl">Gestão de Pedidos ({orders.length})</h3>

            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="p-4 border border-neutral-200 rounded space-y-3">
                  <div className="flex flex-wrap justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-neutral-900 text-sm">{order.orderNumber}</span> • {order.customer.name} ({order.customer.email})
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-neutral-900">R$ {order.total.toFixed(2).replace('.', ',')}</span>
                      <select
                        value={order.status}
                        onChange={e => updateOrderStatus(order.id, e.target.value as any)}
                        className="p-1.5 border border-neutral-300 rounded font-bold uppercase text-[11px] bg-neutral-50"
                      >
                        <option value="Pendente">Pendente</option>
                        <option value="Pago">Pago</option>
                        <option value="Em Separação">Em Separação</option>
                        <option value="Enviado">Enviado</option>
                        <option value="Entregue">Entregue</option>
                      </select>
                    </div>
                  </div>

                  <div className="text-xs text-neutral-600 font-light border-t border-neutral-100 pt-2">
                    Endereço: {order.shippingAddress.street}, {order.shippingAddress.number} - {order.shippingAddress.city}/{order.shippingAddress.state} (CEP {order.shippingAddress.zipCode})
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Coupons Manager */}
        {activeTab === 'coupons' && (
          <div className="bg-white border border-neutral-200 rounded p-6 space-y-4">
            <h3 className="font-serif italic text-xl">Cupons de Desconto</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coupons.map(c => (
                <div key={c.id} className="p-4 border border-neutral-200 rounded flex justify-between items-center">
                  <div>
                    <span className="font-bold text-sm text-[#1A1A1A] uppercase tracking-wider">{c.code}</span>
                    <p className="text-xs text-neutral-500 font-light">
                      {c.type === 'percentage' ? `${c.value}% OFF` : `R$ ${c.value} OFF`}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleCouponStatus(c.id)}
                    className={`px-3 py-1 text-xs font-bold uppercase rounded ${
                      c.active ? 'bg-emerald-100 text-emerald-800' : 'bg-neutral-200 text-neutral-600'
                    }`}
                  >
                    {c.active ? 'Ativo' : 'Inativo'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Product Edit/Create Modal */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg p-6 rounded shadow-xl space-y-4 max-h-[90vh] overflow-y-auto text-xs">
            <h3 className="font-serif italic text-xl font-normal text-[#1A1A1A]">
              {editingProduct.id ? 'Editar Produto' : 'Cadastrar Novo Produto'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Nome do Produto</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-2 border border-neutral-300 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Preço Normal (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.price || 0}
                    onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full p-2 border border-neutral-300 rounded"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Preço Oferta (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.promotionalPrice || 0}
                    onChange={e => setEditingProduct({ ...editingProduct, promotionalPrice: Number(e.target.value) })}
                    className="w-full p-2 border border-neutral-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Categoria</label>
                <select
                  value={editingProduct.categoryId}
                  onChange={e => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                  className="w-full p-2 border border-neutral-300 rounded bg-white"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">URL da Imagem Principal</label>
                <input
                  type="text"
                  value={editingProduct.images?.[0] || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, images: [e.target.value] })}
                  className="w-full p-2 border border-neutral-300 rounded"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="flex-1 border border-neutral-300 py-2.5 rounded uppercase font-semibold text-neutral-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#1A1A1A] hover:bg-[#C18282] text-white py-2.5 rounded uppercase font-bold"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
