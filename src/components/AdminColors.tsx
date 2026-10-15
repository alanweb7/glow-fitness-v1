import React from 'react';
import { Palette, RotateCcw, Layout, Check } from 'lucide-react';
import { ThemeConfig } from '../types';
import { useStore } from '../context/StoreContext';

interface ColorField {
  key: keyof ThemeConfig;
  label: string;
  description: string;
  defaultValue: string;
}

interface ColorGroup {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  fields: ColorField[];
}

// Grupos de cores configuráveis por seção.
// Para adicionar novas seções, basta incluir um novo grupo ou campo aqui.
const COLOR_GROUPS: ColorGroup[] = [
  {
    id: 'pages',
    label: 'Páginas',
    description: 'Cores base aplicadas em todas as páginas da loja.',
    icon: <Layout className="w-4 h-4" />,
    fields: [
      {
        key: 'backgroundColor',
        label: 'Cor de Fundo das Páginas',
        description: 'Cor de fundo geral das páginas da loja.',
        defaultValue: '#FAF7F6',
      },
    ],
  },
];

const ColorFieldRow: React.FC<{ field: ColorField }> = ({ field }) => {
  const { theme, updateTheme } = useStore();
  const value = (theme[field.key] as string) || field.defaultValue;
  const isDefault = value.toLowerCase() === field.defaultValue.toLowerCase();

  const setValue = (color: string) => {
    updateTheme({ [field.key]: color } as Partial<ThemeConfig>);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 border border-neutral-200 rounded-lg">
      <div className="flex-1">
        <p className="text-sm font-medium text-neutral-800">{field.label}</p>
        <p className="text-xs text-neutral-500">{field.description}</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={e => setValue(e.target.value)}
            className="w-10 h-10 rounded-lg border border-neutral-200 cursor-pointer bg-white p-1"
            title="Selecionar cor"
          />
        </div>
        <input
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
          spellCheck={false}
          className="w-28 p-2.5 border border-neutral-300 rounded-lg text-sm font-mono uppercase focus:outline-none focus:border-[#C18282]"
        />
        <button
          type="button"
          onClick={() => setValue(field.defaultValue)}
          disabled={isDefault}
          className="p-2.5 text-neutral-500 hover:text-[#C18282] hover:bg-[#C18282]/10 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="Restaurar cor padrão"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export const AdminColors: React.FC = () => {
  const { theme } = useStore();

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
        <div className="flex items-center gap-3 mb-1">
          <Palette className="w-5 h-5 text-[#C18282]" />
          <h3 className="font-semibold text-neutral-800">Cores do Site</h3>
        </div>
        <p className="text-xs text-neutral-500 mb-6">
          Personalize as cores das seções da loja. As alterações são aplicadas e salvas automaticamente.
        </p>

        <div className="space-y-6">
          {COLOR_GROUPS.map(group => (
            <div key={group.id} className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-[#C18282]/10 text-[#C18282]">
                  {group.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold text-neutral-800">{group.label}</p>
                  <p className="text-xs text-neutral-500">{group.description}</p>
                </div>
              </div>

              <div className="space-y-3">
                {group.fields.map(field => (
                  <ColorFieldRow key={field.key} field={field} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
        <h3 className="font-semibold text-neutral-800 mb-3">Pré-visualização</h3>
        <div
          className="rounded-lg border border-neutral-200 p-6 transition-colors"
          style={{ backgroundColor: theme.backgroundColor }}
        >
          <div className="flex items-center gap-2 text-neutral-600">
            <Check className="w-4 h-4" />
            <span className="text-sm">
              Fundo das páginas: <span className="font-mono uppercase">{theme.backgroundColor}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
