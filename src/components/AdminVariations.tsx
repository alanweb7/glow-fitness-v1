import React, { useState, useEffect } from 'react';
import { Palette, Plus, Edit, Trash2, Loader2, X, Check, GripVertical, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ProductOption, ProductOptionValue } from '../types';

const OPTION_TYPES = [
  { value: 'size', label: 'Tamanho' },
  { value: 'color', label: 'Cor' },
  { value: 'material', label: 'Material' },
  { value: 'style', label: 'Estilo' },
];

const DEFAULT_SIZES = ['PP', 'P', 'M', 'G', 'GG'];
const DEFAULT_COLORS = [
  { label: 'Preto', value: 'preto', hex: '#000000' },
  { label: 'Branco', value: 'branco', hex: '#FFFFFF' },
  { label: 'Rosa', value: 'rosa', hex: '#C18282' },
  { label: 'Azul', value: 'azul', hex: '#3B82F6' },
  { label: 'Vermelho', value: 'vermelho', hex: '#EF4444' },
  { label: 'Verde', value: 'verde', hex: '#22C55E' },
  { label: 'Cinza', value: 'cinza', hex: '#6B7280' },
  { label: 'Bege', value: 'bege', hex: '#D4B896' },
];

export const AdminVariations: React.FC = () => {
  const [options, setOptions] = useState<ProductOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOption, setEditingOption] = useState<Partial<ProductOption> | null>(null);
  const [newValues, setNewValues] = useState<{ label: string; value: string; colorHex?: string }[]>([]);
  const [newValueLabel, setNewValueLabel] = useState('');
  const [newValueHex, setNewValueHex] = useState('');

  useEffect(() => {
    loadOptions();
  }, []);

  const loadOptions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('product_options')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading options:', error);
      setLoading(false);
      return;
    }

    const mapped: ProductOption[] = (data || []).map((o: any) => ({
      id: o.id,
      name: o.name,
      type: o.type,
      values: Array.isArray(o.values) ? o.values : [],
      createdAt: o.created_at,
    }));

    setOptions(mapped);
    setLoading(false);
  };

  const handleSaveOption = async () => {
    if (!editingOption?.name || !editingOption?.type) return;
    setSaving(true);

    const payload = {
      name: editingOption.name,
      type: editingOption.type,
      values: newValues.map((v, i) => ({
        id: `val-${Date.now()}-${i}`,
        optionId: editingOption.id || '',
        label: v.label,
        value: v.value,
        colorHex: v.colorHex,
        order: i,
      })),
    };

    if (editingOption.id) {
      const { error } = await supabase
        .from('product_options')
        .update({ name: payload.name, type: payload.type, values: payload.values })
        .eq('id', editingOption.id);

      if (error) {
        console.error('Error updating option:', error);
        alert('Erro ao salvar: ' + error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from('product_options')
        .insert({ name: payload.name, type: payload.type, values: payload.values });

      if (error) {
        console.error('Error creating option:', error);
        alert('Erro ao criar: ' + error.message);
        setSaving(false);
        return;
      }
    }

    setIsModalOpen(false);
    setEditingOption(null);
    setNewValues([]);
    await loadOptions();
    setSaving(false);
  };

  const handleDeleteOption = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta opção?')) return;
    await supabase.from('product_options').delete().eq('id', id);
    await loadOptions();
  };

  const handleDeleteValue = (index: number) => {
    setNewValues(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddValue = () => {
    if (!newValueLabel.trim()) return;
    const slug = newValueLabel.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    setNewValues(prev => [
      ...prev,
      {
        label: newValueLabel.trim(),
        value: slug,
        colorHex: editingOption?.type === 'color' ? newValueHex : undefined,
      },
    ]);
    setNewValueLabel('');
    setNewValueHex('');
  };

  const loadDefaults = (type: string) => {
    if (type === 'size') {
      setNewValues(DEFAULT_SIZES.map((s, i) => ({
        label: s,
        value: s.toLowerCase(),
      })));
    } else if (type === 'color') {
      setNewValues(DEFAULT_COLORS.map(c => ({
        label: c.label,
        value: c.value,
        colorHex: c.hex,
      })));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'size': return '📏';
      case 'color': return '🎨';
      case 'material': return '🧵';
      case 'style': return '✨';
      default: return '⚙️';
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      size: 'bg-blue-100 text-blue-700',
      color: 'bg-purple-100 text-purple-700',
      material: 'bg-amber-100 text-amber-700',
      style: 'bg-emerald-100 text-emerald-700',
    };
    return colors[type] || 'bg-neutral-100 text-neutral-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#C18282]" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-neutral-500">{options.length} opções cadastradas</p>
        <button
          onClick={() => {
            setEditingOption({ name: '', type: 'size' });
            setNewValues([]);
            setIsModalOpen(true);
          }}
          className="bg-[#C18282] hover:bg-[#a86a6a] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nova Opção
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {options.map(option => (
          <div key={option.id} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">{getTypeIcon(option.type)}</span>
                <div>
                  <h4 className="font-bold text-neutral-900">{option.name}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${getTypeBadge(option.type)}`}>
                    {OPTION_TYPES.find(t => t.value === option.type)?.label || option.type}
                  </span>
                </div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setEditingOption(option);
                    setNewValues(option.values || []);
                    setIsModalOpen(true);
                  }}
                  className="p-2 text-neutral-500 hover:text-[#C18282] hover:bg-[#C18282]/10 rounded-lg transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteOption(option.id)}
                  className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mt-3">
              {(option.values || []).slice(0, 8).map((v: any, i: number) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-neutral-100 rounded text-xs text-neutral-700 flex items-center gap-1"
                >
                  {v.colorHex && (
                    <span
                      className="w-3 h-3 rounded-full border border-neutral-300 inline-block"
                      style={{ backgroundColor: v.colorHex }}
                    />
                  )}
                  {v.label}
                </span>
              ))}
              {(option.values || []).length > 8 && (
                <span className="px-2 py-1 bg-neutral-100 rounded text-xs text-neutral-500">
                  +{(option.values || []).length - 8} mais
                </span>
              )}
            </div>
          </div>
        ))}

        {options.length === 0 && (
          <div className="col-span-full bg-white rounded-xl border border-neutral-100 p-12 text-center">
            <Palette className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500">Nenhuma opção de variação cadastrada</p>
            <p className="text-xs text-neutral-400 mt-1">Crie opções como Tamanho, Cor, Material, etc.</p>
          </div>
        )}
      </div>

      {isModalOpen && editingOption && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">
                {editingOption.id ? 'Editar Opção' : 'Nova Opção'}
              </h3>
              <button
                onClick={() => { setIsModalOpen(false); setEditingOption(null); setNewValues([]); }}
                className="p-1 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Nome *</label>
                  <input
                    type="text"
                    value={editingOption.name || ''}
                    onChange={e => setEditingOption({ ...editingOption, name: e.target.value })}
                    placeholder="Ex: Tamanho, Cor..."
                    className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Tipo *</label>
                  <select
                    value={editingOption.type || 'size'}
                    onChange={e => {
                      const type = e.target.value;
                      setEditingOption({ ...editingOption, type: type as any });
                      if (newValues.length === 0) loadDefaults(type);
                    }}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm bg-white"
                  >
                    {OPTION_TYPES.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="border border-neutral-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-neutral-700">Valores</label>
                  {newValues.length === 0 && (
                    <button
                      onClick={() => loadDefaults(editingOption.type || 'size')}
                      className="text-xs text-[#C18282] hover:underline font-medium"
                    >
                      Carregar padrões
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {newValues.map((v, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 bg-neutral-100 rounded-full text-xs text-neutral-700 flex items-center gap-1.5 group"
                    >
                      {v.colorHex && (
                        <span
                          className="w-3 h-3 rounded-full border border-neutral-300"
                          style={{ backgroundColor: v.colorHex }}
                        />
                      )}
                      {v.label}
                      <button
                        onClick={() => handleDeleteValue(i)}
                        className="text-neutral-400 hover:text-red-500 ml-1"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  {editingOption.type === 'color' && (
                    <input
                      type="color"
                      value={newValueHex || '#000000'}
                      onChange={e => setNewValueHex(e.target.value)}
                      className="w-10 h-10 rounded border border-neutral-300 cursor-pointer"
                    />
                  )}
                  <input
                    type="text"
                    value={newValueLabel}
                    onChange={e => setNewValueLabel(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddValue()}
                    placeholder={editingOption.type === 'size' ? 'Ex: PP, P, M...' : 'Ex: Rosa, Azul...'}
                    className="flex-1 p-2.5 border border-neutral-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={handleAddValue}
                    disabled={!newValueLabel.trim()}
                    className="px-3 py-2.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-neutral-200 flex gap-3">
              <button
                onClick={() => { setIsModalOpen(false); setEditingOption(null); setNewValues([]); }}
                className="flex-1 border border-neutral-300 py-2.5 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveOption}
                disabled={saving || !editingOption.name}
                className="flex-1 bg-[#C18282] hover:bg-[#a86a6a] text-white py-2.5 rounded-lg text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
