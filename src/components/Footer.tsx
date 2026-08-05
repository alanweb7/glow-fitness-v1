import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Phone, Facebook, Video } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { settings } = useStore();

  return (
    <footer className="bg-[#121212] text-white pt-14 pb-8 border-t border-neutral-800 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 pb-12 border-b border-neutral-800">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              {settings.logoUrl ? (
                <img src={settings.logoUrl} alt={settings.storeName || 'Glow Fitness'} className="h-10 object-contain" />
              ) : (
                <>
                  <span className="font-serif italic text-3xl text-[#EAD3D0] tracking-wide font-normal">Glow</span>
                  <span className="text-xs uppercase tracking-[0.3em] font-sans font-light text-neutral-400 ml-1">FITNESS</span>
                </>
              )}
            </Link>

            <p className="text-xs text-neutral-400 leading-relaxed max-w-xs font-light">
              {settings.slogan || 'Moda fitness que valoriza seu corpo, sua força e sua essência.'}
            </p>

            <div className="flex items-center space-x-3 pt-2 text-neutral-300">
              <a href={`https://instagram.com/${settings.instagram}`} target="_blank" rel="noreferrer" className="p-2 bg-neutral-800 hover:bg-[#C18282] hover:text-white rounded-full transition-colors">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={`https://wa.me/${settings.whatsapp}`} target="_blank" rel="noreferrer" className="p-2 bg-neutral-800 hover:bg-emerald-600 hover:text-white rounded-full transition-colors">
                <Phone className="w-4 h-4" />
              </a>
              <a href={`https://facebook.com/${settings.facebook}`} target="_blank" rel="noreferrer" className="p-2 bg-neutral-800 hover:bg-blue-600 hover:text-white rounded-full transition-colors">
                <Facebook className="w-4 h-4" />
              </a>
              <a href={`https://tiktok.com/@${settings.tiktok}`} target="_blank" rel="noreferrer" className="p-2 bg-neutral-800 hover:bg-[#C18282] hover:text-white rounded-full transition-colors">
                <Video className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Useful Pages */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-200">
              PÁGINAS ÚTEIS
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400 font-light">
              <li>
                <Link to="/" className="hover:text-[#C18282] transition-colors">Início</Link>
              </li>
              <li>
                <Link to="/catalog" className="hover:text-[#C18282] transition-colors">Produtos</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#C18282] transition-colors">Sobre Nós</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#C18282] transition-colors">Contato & Blog</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#C18282] transition-colors">Política de Trocas e Devoluções</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-200">
              ATENDIMENTO
            </h4>
            <div className="space-y-2 text-xs text-neutral-400 font-light">
              <p>
                <strong className="text-neutral-300 font-medium">WhatsApp:</strong><br />
                {settings.phone || '(11) 99999-9999'}
              </p>
              <p>
                <strong className="text-neutral-300 font-medium">E-mail:</strong><br />
                {settings.email || 'contato@glowfitness.com.br'}
              </p>
              <p>
                <strong className="text-neutral-300 font-medium">Horário:</strong><br />
                {settings.businessHours || 'Seg a Sex: 9h às 18h | Sábado: 9h às 13h'}
              </p>
            </div>
          </div>

          {/* Payment Methods */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-neutral-200">
              FORMAS DE PAGAMENTO
            </h4>

            <div className="grid grid-cols-3 gap-2 pt-1">
              <div className="bg-white px-2 py-1.5 rounded flex items-center justify-center border border-neutral-700">
                <span className="text-[11px] font-black text-blue-900 tracking-tighter italic">VISA</span>
              </div>
              <div className="bg-white px-2 py-1.5 rounded flex items-center justify-center border border-neutral-700">
                <span className="text-[10px] font-bold text-red-600">Master</span>
              </div>
              <div className="bg-white px-2 py-1.5 rounded flex items-center justify-center border border-neutral-700">
                <span className="text-[10px] font-bold text-red-500">Elo</span>
              </div>
              <div className="bg-white px-2 py-1.5 rounded flex items-center justify-center border border-neutral-700">
                <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                  ❖ pix
                </span>
              </div>
              <div className="bg-white px-2 py-1.5 rounded flex items-center justify-center border border-neutral-700 col-span-2">
                <span className="text-[10px] font-bold text-neutral-800 tracking-widest uppercase">
                  ║║ Boleto
                </span>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-emerald-400 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Checkout Seguro Mercado Pago Transparente</span>
            </div>
          </div>

        </div>

        <div className="pt-6 text-center text-xs text-neutral-500 font-light">
          © 2026 {settings.storeName || 'Glow Fitness'}. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};
