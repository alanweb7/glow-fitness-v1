import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Settings,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  DollarSign,
  Users,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Store,
  LogOut,
  Menu,
  X,
  Search,
  Bell,
  Image,
  FileText,
  Home,
  Truck,
  Star,
  Eye,
  Shield,
  Palette,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { Product, Order, Category, Coupon } from '../types';
import { ImageGallery } from './ImageGallery';
import { AdminUsers } from './AdminUsers';
import { AdminRoles } from './AdminRoles';
import { AdminVariations } from './AdminVariations';

type AdminPage = 'dashboard' | 'products' | 'orders' | 'coupons' | 'banners' | 'blog' | 'settings' | 'users' | 'roles';

const menuItems: { id: AdminPage; label: string; icon: React.ReactNode; badge?: number }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { id: 'products', label: 'Produtos', icon: <Package className="w-5 h-5" /> },
  { id: 'orders', label: 'Pedidos', icon: <ShoppingBag className="w-5 h-5" /> },
  { id: 'coupons', label: 'Cupons', icon: <Tag className="w-5 h-5" /> },
  { id: 'banners', label: 'Banners', icon: <Image className="w-5 h-5" /> },
  { id: 'blog', label: 'Blog', icon: <FileText className="w-5 h-5" /> },
  { id: 'users', label: 'Usuários', icon: <Users className="w-5 h-5" /> },
  { id: 'roles', label: 'Perfis de Acesso', icon: <Shield className="w-5 h-5" /> },
  { id: 'settings', label: 'Configurações', icon: <Settings className="w-5 h-5" /> },
];

export const AdminPanel: React.FC = () => {
  const {
    products,
    categories,
    orders,
    coupons,
    banners,
    settings,
    updateProduct,
    createProduct,
    deleteProduct,
    updateCategory,
    addCategory,
    deleteCategory,
    updateOrderStatus,
    updateSettings,
    addCoupon,
    toggleCouponStatus,
    updateBanner,
    addBanner,
    deleteBanner,
  } = useStore();
  const { signOut, profile } = useAuth();
  const location = useLocation();

  const currentPage: AdminPage = (location.pathname.split('/admin/')[1] || 'dashboard') as AdminPage;
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [productTab, setProductTab] = useState<'products' | 'categories' | 'variations'>('products');
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);

  // Stats
  const totalRevenue = orders.reduce((acc, o) => acc + o.total, 0);
  const paidOrdersCount = orders.filter(o => o.status !== 'Cancelado').length;
  const avgTicket = paidOrdersCount > 0 ? totalRevenue / paidOrdersCount : 0;
  const pendingOrders = orders.filter(o => o.status === 'Pendente').length;

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.price) return;

    if (editingProduct.id) {
      await updateProduct(editingProduct as Product);
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
        variations: editingProduct.variations || [],
        tags: editingProduct.tags || ['fitness', 'glow'],
        stock: editingProduct.stock || 0,
        minStock: editingProduct.minStock || 3,
        status: 'active',
        isBestSeller: false,
        sku: editingProduct.sku || `GLOW-${Date.now()}`,
        weightKg: 0.3,
        dimensionsCm: { height: 5, width: 20, length: 25 },
      });
    }

    setIsProductModalOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9] flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 ${sidebarOpen ? 'w-64' : 'w-20'} bg-[#1a1d21] transition-all duration-300 flex flex-col`}>
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#C18282] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-white font-serif italic text-lg">Glow</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white/60 hover:text-white p-1"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 py-4 overflow-y-auto">
          <div className="px-3 mb-2">
            {sidebarOpen && (
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-semibold px-3">
                Menu Principal
              </span>
            )}
          </div>

          {menuItems.map((item) => (
            <Link
              key={item.id}
              to={`/admin/${item.id}`}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors ${
                currentPage === item.id
                  ? 'bg-[#C18282] text-white'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`}
              title={!sidebarOpen ? item.label : undefined}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              {sidebarOpen && (
                <>
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          ))}

          <div className="px-3 mt-6 mb-2">
            {sidebarOpen && (
              <span className="text-[10px] uppercase tracking-widest text-white/30 font-semibold px-3">
                Sistema
              </span>
            )}
          </div>

          <Link
            to="/"
            className="w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:bg-white/5 hover:text-white transition-colors"
            title="Ver Loja"
          >
            <Store className="w-5 h-5" />
            {sidebarOpen && <span className="text-sm">Ver Loja</span>}
          </Link>
        </nav>

        {/* User */}
        {sidebarOpen && (
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#C18282]/20 rounded-full flex items-center justify-center">
                <span className="text-[#C18282] font-bold text-sm">
                  {profile?.fullName?.charAt(0) || 'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{profile?.fullName || 'Admin'}</p>
                <p className="text-white/40 text-[11px] truncate">{profile?.role || 'admin'}</p>
              </div>
              <button
                onClick={() => signOut()}
                className="text-white/40 hover:text-red-400 transition-colors"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${sidebarOpen ? 'ml-64' : 'ml-20'} transition-all duration-300`}>
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-neutral-200 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-neutral-800">
              {menuItems.find(m => m.id === currentPage)?.label || 'Dashboard'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Buscar..."
                className="pl-10 pr-4 py-2 bg-neutral-100 border border-transparent rounded-lg text-sm focus:outline-none focus:border-[#C18282] focus:bg-white transition-colors w-64"
              />
            </div>

            <button className="relative p-2 text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              {pendingOrders > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {pendingOrders}
                </span>
              )}
            </button>

            <div className="h-8 w-px bg-neutral-200" />

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#C18282]/20 rounded-full flex items-center justify-center">
                <span className="text-[#C18282] font-bold text-xs">
                  {profile?.fullName?.charAt(0) || 'A'}
                </span>
              </div>
              <span className="text-sm font-medium text-neutral-700 hidden sm:block">
                {profile?.fullName || 'Admin'}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {!['dashboard', 'products', 'orders', 'coupons', 'banners', 'blog', 'settings', 'users', 'roles'].includes(currentPage) && (
            <div className="text-center py-20">
              <p className="text-neutral-500 text-sm">Página não encontrada.</p>
              <Link to="/admin/dashboard" className="text-[#C18282] text-sm font-semibold underline mt-2 inline-block">
                Ir para o Dashboard
              </Link>
            </div>
          )}

          {/* Dashboard */}
          {currentPage === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full -mr-8 -mt-8" />
                  <div className="relative">
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Faturamento</p>
                    <p className="text-2xl font-bold text-neutral-900 mt-1">R$ {totalRevenue.toFixed(2).replace('.', ',')}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-blue-600 font-medium">
                      <TrendingUp className="w-3 h-3" />
                      <span>+12% este mês</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full -mr-8 -mt-8" />
                  <div className="relative">
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Pedidos</p>
                    <p className="text-2xl font-bold text-neutral-900 mt-1">{paidOrdersCount}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 font-medium">
                      <ShoppingBag className="w-3 h-3" />
                      <span>{pendingOrders} pendentes</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full -mr-8 -mt-8" />
                  <div className="relative">
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Ticket Médio</p>
                    <p className="text-2xl font-bold text-neutral-900 mt-1">R$ {avgTicket.toFixed(2).replace('.', ',')}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-amber-600 font-medium">
                      <BarChart3 className="w-3 h-3" />
                      <span>por pedido</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full -mr-8 -mt-8" />
                  <div className="relative">
                    <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Produtos</p>
                    <p className="text-2xl font-bold text-neutral-900 mt-1">{products.length}</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-purple-600 font-medium">
                      <Package className="w-3 h-3" />
                      <span>{products.filter(p => p.status === 'active').length} ativos</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="bg-white rounded-xl shadow-sm border border-neutral-100">
                <div className="px-6 py-4 border-b border-neutral-100 flex items-center justify-between">
                  <h3 className="font-semibold text-neutral-800">Últimos Pedidos</h3>
                  <Link
                    to="/admin/orders"
                    className="text-xs text-[#C18282] hover:underline font-medium"
                  >
                    Ver todos
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold">Pedido</th>
                        <th className="px-6 py-3 text-left font-semibold">Cliente</th>
                        <th className="px-6 py-3 text-left font-semibold">Total</th>
                        <th className="px-6 py-3 text-left font-semibold">Status</th>
                        <th className="px-6 py-3 text-left font-semibold">Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {orders.slice(0, 5).map(o => (
                        <tr key={o.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-neutral-900">{o.orderNumber}</td>
                          <td className="px-6 py-4">
                            <div>
                              <p className="font-medium text-neutral-900">{o.customer.name}</p>
                              <p className="text-xs text-neutral-500">{o.customer.email}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 font-bold text-neutral-900">R$ {o.total.toFixed(2).replace('.', ',')}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                              o.status === 'Entregue' ? 'bg-emerald-100 text-emerald-700' :
                              o.status === 'Pago' ? 'bg-blue-100 text-blue-700' :
                              o.status === 'Enviado' ? 'bg-purple-100 text-purple-700' :
                              o.status === 'Cancelado' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-neutral-500 text-xs">
                            {new Date(o.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-neutral-400">
                            Nenhum pedido registrado
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top Products */}
              <div className="bg-white rounded-xl shadow-sm border border-neutral-100">
                <div className="px-6 py-4 border-b border-neutral-100">
                  <h3 className="font-semibold text-neutral-800">Produtos Mais Vendidos</h3>
                </div>
                <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {products.filter(p => p.isBestSeller || p.isFeatured).slice(0, 4).map(p => (
                    <div key={p.id} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg">
                      <img src={p.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">{p.name}</p>
                        <p className="text-xs text-neutral-500">R$ {p.price.toFixed(2).replace('.', ',')}</p>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-amber-600">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{p.rating}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Products */}
          {currentPage === 'products' && (
            <div className="space-y-4">
              {/* Tabs */}
              <div className="flex border-b border-neutral-200">
                <button
                  onClick={() => setProductTab('products')}
                  className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                    productTab === 'products'
                      ? 'border-[#C18282] text-[#C18282]'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  Produtos
                </button>
                <button
                  onClick={() => setProductTab('categories')}
                  className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                    productTab === 'categories'
                      ? 'border-[#C18282] text-[#C18282]'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  Categorias
                </button>
                <button
                  onClick={() => setProductTab('variations')}
                  className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                    productTab === 'variations'
                      ? 'border-[#C18282] text-[#C18282]'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  Variações
                </button>
              </div>

              {/* Products Tab */}
              {productTab === 'products' && (
                <>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-neutral-500">{products.length} produtos cadastrados</p>
                    <button
                      onClick={() => {
                        setEditingProduct({
                          name: '',
                          price: 99.9,
                          promotionalPrice: 79.9,
                          categoryId: categories[0]?.id,
                          isNew: true,
                          isFeatured: true,
                          images: [],
                        });
                        setIsProductModalOpen(true);
                      }}
                      className="bg-[#C18282] hover:bg-[#a86a6a] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Novo Produto
                    </button>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-3 text-left font-semibold">Produto</th>
                          <th className="px-6 py-3 text-left font-semibold">Categoria</th>
                          <th className="px-6 py-3 text-left font-semibold">Preço</th>
                          <th className="px-6 py-3 text-left font-semibold">Estoque</th>
                          <th className="px-6 py-3 text-left font-semibold">Status</th>
                          <th className="px-6 py-3 text-right font-semibold">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {products.map(p => (
                          <tr key={p.id} className="hover:bg-neutral-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img src={p.images[0]} alt="" className="w-10 h-12 rounded object-cover" />
                                <div>
                                  <p className="font-medium text-neutral-900">{p.name}</p>
                                  <p className="text-xs text-neutral-500">{p.sku}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-neutral-600">{p.categoryName}</td>
                            <td className="px-6 py-4">
                              <span className="font-bold text-neutral-900">R$ {p.price.toFixed(2).replace('.', ',')}</span>
                              {p.promotionalPrice && p.promotionalPrice < p.price && (
                                <span className="block text-xs text-emerald-600">Oferta: R$ {p.promotionalPrice.toFixed(2).replace('.', ',')}</span>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <span className={`font-medium ${p.stock <= p.minStock ? 'text-red-600' : 'text-neutral-900'}`}>
                                {p.stock} un.
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                p.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                                p.status === 'draft' ? 'bg-amber-100 text-amber-700' :
                                'bg-neutral-100 text-neutral-500'
                              }`}>
                                {p.status}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setEditingProduct(p);
                                    setIsProductModalOpen(true);
                                  }}
                                  className="p-2 text-neutral-500 hover:text-[#C18282] hover:bg-[#C18282]/10 rounded-lg transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteProduct(p.id)}
                                  className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* Categories Tab */}
              {productTab === 'categories' && (
                <>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-neutral-500">{categories.length} categorias cadastradas</p>
                    <button
                      onClick={() => {
                        setEditingCategory({ name: '', slug: '', active: true, order: categories.length + 1 });
                        setIsCategoryModalOpen(true);
                      }}
                      className="bg-[#C18282] hover:bg-[#a86a6a] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Nova Categoria
                    </button>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
                        <tr>
                          <th className="px-6 py-3 text-left font-semibold">Categoria</th>
                          <th className="px-6 py-3 text-left font-semibold">Slug</th>
                          <th className="px-6 py-3 text-left font-semibold">Ordem</th>
                          <th className="px-6 py-3 text-left font-semibold">Status</th>
                          <th className="px-6 py-3 text-right font-semibold">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100">
                        {categories.map(c => (
                          <tr key={c.id} className="hover:bg-neutral-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                {c.image && (
                                  <img src={c.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
                                )}
                                <span className="font-medium text-neutral-900">{c.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-neutral-500 font-mono text-xs">{c.slug}</td>
                            <td className="px-6 py-4 text-neutral-500">{c.order}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                                c.active ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-500'
                              }`}>
                                {c.active ? 'Ativo' : 'Inativo'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setEditingCategory(c);
                                    setIsCategoryModalOpen(true);
                                  }}
                                  className="p-2 text-neutral-500 hover:text-[#C18282] hover:bg-[#C18282]/10 rounded-lg transition-colors"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => deleteCategory(c.id)}
                                  className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* Variations Tab */}
              {productTab === 'variations' && <AdminVariations />}
            </div>
          )}

          {/* Orders */}
          {currentPage === 'orders' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-100">
                  <h3 className="font-semibold text-neutral-800">Gestão de Pedidos</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold">Pedido</th>
                        <th className="px-6 py-3 text-left font-semibold">Cliente</th>
                        <th className="px-6 py-3 text-left font-semibold">Pagamento</th>
                        <th className="px-6 py-3 text-left font-semibold">Total</th>
                        <th className="px-6 py-3 text-left font-semibold">Status</th>
                        <th className="px-6 py-3 text-left font-semibold">Data</th>
                        <th className="px-6 py-3 text-right font-semibold">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {orders.map(o => (
                        <tr key={o.id} className="hover:bg-neutral-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-neutral-900">{o.orderNumber}</td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-neutral-900">{o.customer.name}</p>
                            <p className="text-xs text-neutral-500">{o.customer.email}</p>
                          </td>
                          <td className="px-6 py-4 uppercase text-neutral-600 text-xs font-medium">{o.paymentMethod}</td>
                          <td className="px-6 py-4 font-bold text-neutral-900">R$ {o.total.toFixed(2).replace('.', ',')}</td>
                          <td className="px-6 py-4">
                            <select
                              value={o.status}
                              onChange={e => updateOrderStatus(o.id, e.target.value as any)}
                              className={`px-2 py-1 border-0 rounded text-[11px] font-bold uppercase cursor-pointer ${
                                o.status === 'Entregue' ? 'bg-emerald-100 text-emerald-700' :
                                o.status === 'Pago' ? 'bg-blue-100 text-blue-700' :
                                o.status === 'Enviado' ? 'bg-purple-100 text-purple-700' :
                                o.status === 'Cancelado' ? 'bg-red-100 text-red-700' :
                                'bg-amber-100 text-amber-700'
                              }`}
                            >
                              <option value="Pendente">Pendente</option>
                              <option value="Pago">Pago</option>
                              <option value="Em Separação">Em Separação</option>
                              <option value="Enviado">Enviado</option>
                              <option value="Entregue">Entregue</option>
                              <option value="Cancelado">Cancelado</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 text-neutral-500 text-xs">
                            {new Date(o.createdAt).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-2 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-center text-neutral-400">
                            Nenhum pedido registrado
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Coupons */}
          {currentPage === 'coupons' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-neutral-500">{coupons.length} cupons cadastrados</p>
                <button
                  onClick={() => {
                    addCoupon({
                      code: 'NOVO_CUPOM',
                      type: 'percentage',
                      value: 10,
                      minOrderValue: 100,
                      maxUsage: 100,
                      expiresAt: '2026-12-31',
                      active: true,
                    });
                  }}
                  className="bg-[#C18282] hover:bg-[#a86a6a] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Novo Cupom
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {coupons.map(c => (
                  <div key={c.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold text-[#1a1d21] uppercase tracking-wider">{c.code}</span>
                        <p className="text-sm text-neutral-500 mt-1">
                          {c.type === 'percentage' ? `${c.value}% OFF` :
                           c.type === 'free_shipping' ? 'Frete Grátis' :
                           `R$ ${c.value} OFF`}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleCouponStatus(c.id)}
                        className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${
                          c.active ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-500'
                        }`}
                      >
                        {c.active ? 'Ativo' : 'Inativo'}
                      </button>
                    </div>
                    <div className="text-xs text-neutral-500 space-y-1 border-t border-neutral-100 pt-3">
                      <p>Pedido mínimo: R$ {c.minOrderValue.toFixed(2).replace('.', ',')}</p>
                      <p>Usos: {c.usedCount}/{c.maxUsage}</p>
                      <p>Validade: {new Date(c.expiresAt).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Banners */}
          {currentPage === 'banners' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-neutral-500">{banners.length} banners cadastrados</p>
                <button
                  onClick={() => {
                    setEditingBanner({
                      title: '',
                      subtitle: '',
                      desktopImage: '',
                      mobileImage: '',
                      position: 'hero',
                      active: true,
                      order: banners.length + 1,
                    });
                    setIsBannerModalOpen(true);
                  }}
                  className="bg-[#C18282] hover:bg-[#a86a6a] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Novo Banner
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {banners.map(b => (
                  <div key={b.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-4 flex gap-4">
                    <img src={b.desktopImage} alt="" className="w-40 h-24 object-cover rounded-lg" />
                    <div className="flex-1">
                      <h4 className="font-bold text-neutral-900">{b.title}</h4>
                      <p className="text-sm text-neutral-500">{b.subtitle}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-0.5 bg-neutral-100 rounded text-xs text-neutral-600">{b.position}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${b.active ? 'bg-emerald-100 text-emerald-700' : 'bg-neutral-100 text-neutral-500'}`}>
                          {b.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => {
                          setEditingBanner(b);
                          setIsBannerModalOpen(true);
                        }}
                        className="p-2 text-neutral-500 hover:text-[#C18282] hover:bg-[#C18282]/10 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteBanner(b.id)}
                        className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blog */}
          {currentPage === 'blog' && (
            <div className="space-y-4">
              <p className="text-sm text-neutral-500">Gerencie o conteúdo do blog</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {['Como escolher o top fitness', 'Tecnologia Seamless'].map((title, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5">
                    <h4 className="font-bold text-neutral-900">{title}</h4>
                    <p className="text-sm text-neutral-500 mt-1">Postado em {new Date().toLocaleDateString('pt-BR')}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings */}
          {currentPage === 'settings' && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
                <h3 className="font-semibold text-neutral-800 mb-4">Configurações da Loja</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Nome da Loja</label>
                    <input
                      type="text"
                      value={settings.storeName}
                      onChange={e => updateSettings({ storeName: e.target.value })}
                      className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={e => updateSettings({ email: e.target.value })}
                      className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Telefone</label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={e => updateSettings({ phone: e.target.value })}
                      className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">WhatsApp</label>
                    <input
                      type="text"
                      value={settings.whatsapp}
                      onChange={e => updateSettings({ whatsapp: e.target.value })}
                      className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Slogan</label>
                    <input
                      type="text"
                      value={settings.slogan}
                      onChange={e => updateSettings({ slogan: e.target.value })}
                      className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Endereço</label>
                    <input
                      type="text"
                      value={settings.address}
                      onChange={e => updateSettings({ address: e.target.value })}
                      className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Frete Grátis Acima de (R$)</label>
                    <input
                      type="number"
                      value={settings.freeShippingThreshold}
                      onChange={e => updateSettings({ freeShippingThreshold: Number(e.target.value) })}
                      className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {}}
                  className="mt-6 bg-[#C18282] hover:bg-[#a86a6a] text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
                >
                  Salvar Alterações
                </button>
              </div>
            </div>
          )}

          {/* Users */}
          {currentPage === 'users' && <AdminUsers />}

          {/* Roles */}
          {currentPage === 'roles' && <AdminRoles />}
        </main>
      </div>

      {/* Product Modal */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">
                {editingProduct.id ? 'Editar Produto' : 'Novo Produto'}
              </h3>
              <button
                onClick={() => { setIsProductModalOpen(false); setEditingProduct(null); }}
                className="p-1 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="flex-1 overflow-y-auto p-6 space-y-4">
              <ImageGallery
                images={editingProduct.images || []}
                onChange={(newImages) => setEditingProduct({ ...editingProduct, images: newImages })}
                bucket="product-images"
                maxImages={10}
              />

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Nome do Produto *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Descrição Curta</label>
                <input
                  type="text"
                  value={editingProduct.shortDescription || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })}
                  placeholder="Resumo do produto (aparece na listagem)"
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Descrição Completa</label>
                <textarea
                  value={editingProduct.fullDescription || ''}
                  onChange={e => setEditingProduct({ ...editingProduct, fullDescription: e.target.value })}
                  placeholder="Descrição detalhada do produto (aparece na página do produto)"
                  rows={3}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Preço (R$) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.price || 0}
                    onChange={e => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Preço Oferta (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingProduct.promotionalPrice || 0}
                    onChange={e => setEditingProduct({ ...editingProduct, promotionalPrice: Number(e.target.value) })}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Categoria</label>
                <select
                  value={editingProduct.categoryId}
                  onChange={e => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm bg-white"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Cores Disponíveis */}
              <div className="border border-neutral-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">Cores Disponíveis</label>
                  <button
                    type="button"
                    onClick={() => {
                      const variations = editingProduct.variations || [];
                      setEditingProduct({
                        ...editingProduct,
                        variations: [
                          ...variations,
                          {
                            id: `var-${Date.now()}`,
                            colorName: '',
                            colorHex: '#C18282',
                            size: 'M',
                            sku: '',
                            price: editingProduct.price || 0,
                            stock: 0,
                          },
                        ],
                      });
                    }}
                    className="text-xs text-[#C18282] hover:underline font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Adicionar Cor
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(editingProduct.variations || []).length === 0 && (
                    <p className="text-xs text-neutral-400">Nenhuma cor adicionada</p>
                  )}
                  {(editingProduct.variations || []).map((v, idx) => (
                    <div key={v.id || idx} className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-1.5 group">
                      <input
                        type="color"
                        value={v.colorHex || '#000000'}
                        onChange={e => {
                          const variations = [...(editingProduct.variations || [])];
                          variations[idx] = { ...variations[idx], colorHex: e.target.value };
                          setEditingProduct({ ...editingProduct, variations });
                        }}
                        className="w-6 h-6 rounded border border-neutral-300 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={v.colorName || ''}
                        onChange={e => {
                          const variations = [...(editingProduct.variations || [])];
                          variations[idx] = { ...variations[idx], colorName: e.target.value };
                          setEditingProduct({ ...editingProduct, variations });
                        }}
                        placeholder="Nome"
                        className="w-20 p-1 border border-transparent rounded text-xs focus:border-neutral-300 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const variations = (editingProduct.variations || []).filter((_, i) => i !== idx);
                          setEditingProduct({ ...editingProduct, variations });
                        }}
                        className="p-0.5 text-neutral-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tamanhos Disponíveis */}
              <div className="border border-neutral-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">Tamanhos Disponíveis</label>
                  <button
                    type="button"
                    onClick={() => {
                      const variations = editingProduct.variations || [];
                      const sizes = ['PP', 'P', 'M', 'G', 'GG'];
                      const usedSizes = variations.map(v => v.size);
                      const nextSize = sizes.find(s => !usedSizes.includes(s as any)) || 'M';
                      const firstColor = variations[0]?.colorName || '';
                      const firstHex = variations[0]?.colorHex || '#C18282';
                      setEditingProduct({
                        ...editingProduct,
                        variations: [
                          ...variations,
                          {
                            id: `var-${Date.now()}`,
                            colorName: firstColor,
                            colorHex: firstHex,
                            size: nextSize,
                            sku: '',
                            price: editingProduct.price || 0,
                            stock: 0,
                          },
                        ],
                      });
                    }}
                    className="text-xs text-[#C18282] hover:underline font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Adicionar Tamanho
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {['PP', 'P', 'M', 'G', 'GG'].map(sz => {
                    const isActive = (editingProduct.variations || []).some(v => v.size === sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => {
                          const variations = editingProduct.variations || [];
                          if (isActive) {
                            setEditingProduct({
                              ...editingProduct,
                              variations: variations.filter(v => v.size !== sz),
                            });
                          } else {
                            const firstColor = variations[0]?.colorName || '';
                            const firstHex = variations[0]?.colorHex || '#C18282';
                            setEditingProduct({
                              ...editingProduct,
                              variations: [
                                ...variations,
                                {
                                  id: `var-${Date.now()}`,
                                  colorName: firstColor,
                                  colorHex: firstHex,
                                  size: sz,
                                  sku: '',
                                  price: editingProduct.price || 0,
                                  stock: 0,
                                },
                              ],
                            });
                          }
                        }}
                        className={`px-4 py-2 rounded-lg text-xs font-bold border-2 transition-all ${
                          isActive
                            ? 'bg-[#C18282] text-white border-[#C18282]'
                            : 'bg-white text-neutral-600 border-neutral-200 hover:border-[#C18282] hover:text-[#C18282]'
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Estoque */}
              <div className="border border-neutral-200 rounded-lg p-4 space-y-3">
                <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">Estoque</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] text-neutral-500 mb-1">Quantidade em Estoque</label>
                    <input
                      type="number"
                      min="0"
                      value={editingProduct.stock || 0}
                      onChange={e => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                      className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-neutral-500 mb-1">Estoque Mínimo</label>
                    <input
                      type="number"
                      min="0"
                      value={editingProduct.minStock || 3}
                      onChange={e => setEditingProduct({ ...editingProduct, minStock: Number(e.target.value) })}
                      className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.stock > 0 ? false : true}
                    onChange={e => {
                      if (e.target.checked) {
                        setEditingProduct({ ...editingProduct, stock: 0 });
                      } else {
                        setEditingProduct({ ...editingProduct, stock: 1 });
                      }
                    }}
                    className="w-4 h-4 rounded border-neutral-300 text-[#C18282] focus:ring-[#C18282]"
                  />
                  <span className="text-xs text-neutral-600">Mostrar produto como "Sem Estoque"</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setIsProductModalOpen(false); setEditingProduct(null); }}
                  className="flex-1 border border-neutral-300 py-2.5 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#C18282] hover:bg-[#a86a6a] text-white py-2.5 rounded-lg text-sm font-medium"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-xl shadow-2xl">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">
                {editingCategory.id ? 'Editar Categoria' : 'Nova Categoria'}
              </h3>
              <button
                onClick={() => { setIsCategoryModalOpen(false); setEditingCategory(null); }}
                className="p-1 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Nome *</label>
                <input
                  type="text"
                  value={editingCategory.name || ''}
                  onChange={e => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Slug</label>
                <input
                  type="text"
                  value={editingCategory.slug || ''}
                  onChange={e => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  placeholder="gerado-automaticamente"
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Descrição</label>
                <textarea
                  value={editingCategory.description || ''}
                  onChange={e => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  rows={2}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Ordem</label>
                  <input
                    type="number"
                    value={editingCategory.order || 1}
                    onChange={e => setEditingCategory({ ...editingCategory, order: Number(e.target.value) })}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Status</label>
                  <select
                    value={editingCategory.active ? 'true' : 'false'}
                    onChange={e => setEditingCategory({ ...editingCategory, active: e.target.value === 'true' })}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm bg-white"
                  >
                    <option value="true">Ativo</option>
                    <option value="false">Inativo</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-neutral-200 flex gap-3">
              <button
                onClick={() => { setIsCategoryModalOpen(false); setEditingCategory(null); }}
                className="flex-1 border border-neutral-300 py-2.5 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  if (!editingCategory.name) return;
                  const slug = editingCategory.slug || editingCategory.name.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '');

                  if (editingCategory.id) {
                    await updateCategory({ ...editingCategory, slug } as Category);
                  } else {
                    await addCategory({
                      name: editingCategory.name,
                      slug,
                      description: editingCategory.description || '',
                      image: editingCategory.image || '',
                      order: editingCategory.order || categories.length + 1,
                      active: editingCategory.active !== false,
                    });
                  }
                  setIsCategoryModalOpen(false);
                  setEditingCategory(null);
                }}
                className="flex-1 bg-[#C18282] hover:bg-[#a86a6a] text-white py-2.5 rounded-lg text-sm font-medium"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Banner Modal */}
      {isBannerModalOpen && editingBanner && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">
                {editingBanner.id ? 'Editar Banner' : 'Novo Banner'}
              </h3>
              <button
                onClick={() => { setIsBannerModalOpen(false); setEditingBanner(null); }}
                className="p-1 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Título *</label>
                <input
                  type="text"
                  value={editingBanner.title || ''}
                  onChange={e => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Subtítulo</label>
                <input
                  type="text"
                  value={editingBanner.subtitle || ''}
                  onChange={e => setEditingBanner({ ...editingBanner, subtitle: e.target.value })}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Imagem Desktop (URL)</label>
                <input
                  type="url"
                  value={editingBanner.desktopImage || ''}
                  onChange={e => setEditingBanner({ ...editingBanner, desktopImage: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                />
                {editingBanner.desktopImage && (
                  <img src={editingBanner.desktopImage} alt="" className="mt-2 w-full h-32 object-cover rounded-lg" />
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Imagem Mobile (URL)</label>
                <input
                  type="url"
                  value={editingBanner.mobileImage || ''}
                  onChange={e => setEditingBanner({ ...editingBanner, mobileImage: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Texto do Botão (CTA)</label>
                  <input
                    type="text"
                    value={editingBanner.ctaText || ''}
                    onChange={e => setEditingBanner({ ...editingBanner, ctaText: e.target.value })}
                    placeholder="Comprar Agora"
                    className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Link do Botão (CTA)</label>
                  <input
                    type="url"
                    value={editingBanner.ctaUrl || ''}
                    onChange={e => setEditingBanner({ ...editingBanner, ctaUrl: e.target.value })}
                    placeholder="/catalog"
                    className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Posição</label>
                  <select
                    value={editingBanner.position || 'hero'}
                    onChange={e => setEditingBanner({ ...editingBanner, position: e.target.value as any })}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm bg-white"
                  >
                    <option value="hero">Hero (Topo)</option>
                    <option value="middle">Meio da Página</option>
                    <option value="popup">Pop-up</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Ordem</label>
                  <input
                    type="number"
                    min="1"
                    value={editingBanner.order || 1}
                    onChange={e => setEditingBanner({ ...editingBanner, order: Number(e.target.value) })}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingBanner.active !== false}
                  onChange={e => setEditingBanner({ ...editingBanner, active: e.target.checked })}
                  className="w-4 h-4 rounded border-neutral-300 text-[#C18282] focus:ring-[#C18282]"
                />
                <span className="text-xs text-neutral-600">Banner Ativo</span>
              </label>
            </div>

            <div className="px-6 py-4 border-t border-neutral-200 flex gap-3">
              <button
                onClick={() => { setIsBannerModalOpen(false); setEditingBanner(null); }}
                className="flex-1 border border-neutral-300 py-2.5 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancelar
              </button>
              <button
                onClick={async () => {
                  if (!editingBanner.title) return;
                  if (editingBanner.id) {
                    await updateBanner(editingBanner as Banner);
                  } else {
                    await addBanner({
                      title: editingBanner.title,
                      subtitle: editingBanner.subtitle || '',
                      desktopImage: editingBanner.desktopImage || '',
                      mobileImage: editingBanner.mobileImage || '',
                      ctaText: editingBanner.ctaText,
                      ctaUrl: editingBanner.ctaUrl,
                      position: editingBanner.position || 'hero',
                      active: editingBanner.active !== false,
                      order: editingBanner.order || banners.length + 1,
                    });
                  }
                  setIsBannerModalOpen(false);
                  setEditingBanner(null);
                }}
                className="flex-1 bg-[#C18282] hover:bg-[#a86a6a] text-white py-2.5 rounded-lg text-sm font-medium"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
