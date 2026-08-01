import React from 'react';
import { Truck, Tag, CreditCard } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const TopAnnouncementBar: React.FC = () => {
  const { settings } = useStore();

  return (
    <div className="bg-[#FAF0EE] border-b border-[#EAD3D0] text-[#4A3B3A] text-xs font-medium py-2 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2 text-center sm:text-left">
        <div className="flex items-center justify-center gap-1.5 w-full sm:w-auto">
          <Truck className="w-3.5 h-3.5 text-[#C18282]" />
          <span>FRETE GRÁTIS ACIMA DE R$ {settings.freeShippingThreshold.toFixed(0)}</span>
        </div>

        <div className="hidden md:flex items-center justify-center gap-1.5">
          <Tag className="w-3.5 h-3.5 text-[#C18282]" />
          <span>10% OFF NA PRIMEIRA COMPRA COM O CUPOM <strong className="text-[#1A1A1A]">GLOW10</strong></span>
        </div>

        <div className="flex items-center justify-center gap-1.5 w-full sm:w-auto">
          <CreditCard className="w-3.5 h-3.5 text-[#C18282]" />
          <span>PARCELE EM ATÉ 6X SEM JUROS NO CARTÃO</span>
        </div>
      </div>
    </div>
  );
};
