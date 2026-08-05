import React, { useState, useEffect } from 'react';
import { FileText, Plus, Edit, Trash2, Loader2, X, Check, Eye, EyeOff, Search, Globe, ChevronDown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Page, PageContent, PageSection, PAGE_TEMPLATES, PageTemplate } from '../types';
import { ImageUpload } from './ImageUpload';

export const AdminPages: React.FC = () => {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<Partial<Page> | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<PageTemplate>('blank');

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pages')
      .select('*')
      .order('order', { ascending: true });

    if (error) {
      console.error('Error loading pages:', error);
      setLoading(false);
      return;
    }

    const mapped: Page[] = (data || []).map((p: any) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      template: p.template,
      content: p.content || {},
      featuredImage: p.featured_image,
      metaTitle: p.meta_title,
      metaDescription: p.meta_description,
      ogImage: p.og_image,
      isPublished: p.is_published,
      showInMenu: p.show_in_menu,
      showInFooter: p.show_in_footer,
      parentId: p.parent_id,
      order: p.order,
      createdAt: p.created_at,
      updatedAt: p.updated_at,
    }));

    setPages(mapped);
    setLoading(false);
  };

  const filtered = pages.filter(p =>
    p.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchFilter.toLowerCase()) ||
    p.template.toLowerCase().includes(searchFilter.toLowerCase())
  );

  const handleSavePage = async () => {
    if (!editingPage?.title) return;
    setSaving(true);

    const slug = editingPage.slug || editingPage.title
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    const payload = {
      title: editingPage.title,
      slug,
      template: editingPage.template || 'blank',
      content: editingPage.content || {},
      featured_image: editingPage.featuredImage || '',
      meta_title: editingPage.metaTitle || editingPage.title,
      meta_description: editingPage.metaDescription || '',
      og_image: editingPage.ogImage || '',
      is_published: editingPage.isPublished !== false,
      show_in_menu: editingPage.showInMenu || false,
      show_in_footer: editingPage.showInFooter || false,
      parent_id: editingPage.parentId || null,
      order: editingPage.order || 0,
      updated_at: new Date().toISOString(),
    };

    if (editingPage.id) {
      const { error } = await supabase
        .from('pages')
        .update(payload)
        .eq('id', editingPage.id);

      if (error) {
        alert('Erro ao salvar: ' + error.message);
        setSaving(false);
        return;
      }
    } else {
      const { error } = await supabase
        .from('pages')
        .insert(payload);

      if (error) {
        alert('Erro ao criar: ' + error.message);
        setSaving(false);
        return;
      }
    }

    setIsModalOpen(false);
    setEditingPage(null);
    await loadPages();
    setSaving(false);
  };

  const handleDeletePage = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta página?')) return;
    await supabase.from('pages').delete().eq('id', id);
    await loadPages();
  };

  const handleTogglePublish = async (page: Page) => {
    await supabase
      .from('pages')
      .update({ is_published: !page.is_published })
      .eq('id', page.id);
    await loadPages();
  };

  const applyTemplate = (template: PageTemplate) => {
    setSelectedTemplate(template);
    const templateContents: Record<PageTemplate, PageContent> = {
      blank: {},
      about: {
        heroTitle: 'Sobre a Glow Fitness',
        heroSubtitle: 'Moda fitness que une estilo, conforto e performance',
        sections: [
          { title: 'Nossa Missão', text: 'Todas as mulheres merecem se sentir bonitas e confiantes durante os treinos.' },
          { title: 'Nossos Valores', items: ['Qualidade Premium', 'Sustentabilidade', 'Inclusão', 'Estilo'] },
          { title: 'Nossa Equipe', text: 'Uma equipe apaixonada por fitness e moda.' },
        ],
      },
      legal: {
        heroTitle: 'Termos e Condições',
        sections: [
          { title: 'Seção 1', text: 'Conteúdo desta seção...' },
          { title: 'Seção 2', text: 'Conteúdo desta seção...' },
        ],
      },
      faq: {
        heroTitle: 'Perguntas Frequentes',
        sections: [
          { title: 'Pergunta 1', text: 'Resposta...' },
          { title: 'Pergunta 2', text: 'Resposta...' },
        ],
      },
      contact: {
        heroTitle: 'Fale Conosco',
        sections: [
          { type: 'form', fields: ['nome', 'email', 'assunto', 'mensagem'] },
          { type: 'info', whatsapp: '(11) 99999-9999', email: 'contato@glowfitness.com.br', instagram: '@glowfitnessbr' },
        ],
      },
      landing: {
        heroTitle: 'Oferta Especial',
        heroSubtitle: 'Aproveite nossa promoção exclusiva',
        sections: [
          { title: 'Benefícios', items: ['Benefício 1', 'Benefício 2', 'Benefício 3'] },
          { title: 'Chamada para Ação', ctaText: 'COMPRAR AGORA', ctaUrl: '/catalog' },
        ],
      },
      blog: {
        heroTitle: 'Título do Artigo',
        heroSubtitle: 'Subtítulo do artigo',
        sections: [
          { title: 'Introdução', text: 'Conteúdo da introdução...' },
          { title: 'Desenvolvimento', text: 'Conteúdo do desenvolvimento...' },
          { title: 'Conclusão', text: 'Conteúdo da conclusão...' },
        ],
      },
    };
    setEditingPage(prev => ({
      ...prev,
      template,
      content: templateContents[template],
    }));
  };

  const addSection = () => {
    if (!editingPage) return;
    const sections = editingPage.content?.sections || [];
    setEditingPage({
      ...editingPage,
      content: {
        ...editingPage.content,
        sections: [...sections, { title: 'Nova Seção', text: 'Conteúdo da seção...' }],
      },
    });
  };

  const updateSection = (idx: number, field: string, value: string) => {
    if (!editingPage?.content?.sections) return;
    const sections = [...editingPage.content.sections];
    sections[idx] = { ...sections[idx], [field]: value };
    setEditingPage({
      ...editingPage,
      content: { ...editingPage.content, sections },
    });
  };

  const removeSection = (idx: number) => {
    if (!editingPage?.content?.sections) return;
    const sections = editingPage.content.sections.filter((_, i) => i !== idx);
    setEditingPage({
      ...editingPage,
      content: { ...editingPage.content, sections },
    });
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-neutral-500">{pages.length} páginas cadastradas</p>
        <button
          onClick={() => {
            setEditingPage({
              title: '',
              template: 'blank',
              content: {},
              isPublished: true,
              order: pages.length + 1,
            });
            setSelectedTemplate('blank');
            setIsModalOpen(true);
          }}
          className="bg-[#C18282] hover:bg-[#a86a6a] text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Nova Página
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
        <input
          type="text"
          placeholder="Buscar por título ou slug..."
          value={searchFilter}
          onChange={e => setSearchFilter(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-lg text-sm focus:outline-none focus:border-[#C18282]"
        />
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left font-semibold">Página</th>
              <th className="px-6 py-3 text-left font-semibold">Modelo</th>
              <th className="px-6 py-3 text-left font-semibold">Slug</th>
              <th className="px-6 py-3 text-left font-semibold">Status</th>
              <th className="px-6 py-3 text-left font-semibold">Menu</th>
              <th className="px-6 py-3 text-right font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {filtered.map(page => (
              <tr key={page.id} className="hover:bg-neutral-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {page.featuredImage ? (
                      <img src={page.featuredImage} alt="" className="w-10 h-10 rounded-lg object-cover" />
                    ) : (
                      <div className="w-10 h-10 bg-[#C18282]/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-4 h-4 text-[#C18282]" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-neutral-900">{page.title}</p>
                      <p className="text-xs text-neutral-500">Ordem: {page.order}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase bg-neutral-100 text-neutral-600">
                    {PAGE_TEMPLATES[page.template]?.icon} {PAGE_TEMPLATES[page.template]?.label || page.template}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-neutral-500 font-mono">/{page.slug}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleTogglePublish(page)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase transition-colors ${
                      page.isPublished
                        ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                        : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                    }`}
                  >
                    {page.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {page.isPublished ? 'Publicado' : 'Rascunho'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-1">
                    {page.showInMenu && (
                      <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-bold">MENU</span>
                    )}
                    {page.showInFooter && (
                      <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[9px] font-bold">FOOTER</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => {
                        setEditingPage(page);
                        setSelectedTemplate(page.template);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-neutral-500 hover:text-[#C18282] hover:bg-[#C18282]/10 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePage(page.id)}
                      className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-neutral-400">
                  Nenhuma página encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Page Edit Modal */}
      {isModalOpen && editingPage && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-neutral-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-neutral-900">
                {editingPage.id ? 'Editar Página' : 'Nova Página'}
              </h3>
              <button
                onClick={() => { setIsModalOpen(false); setEditingPage(null); }}
                className="p-1 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Template Selection (only for new pages) */}
              {!editingPage.id && (
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-2 uppercase tracking-wider">Modelo da Página</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(Object.keys(PAGE_TEMPLATES) as PageTemplate[]).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => applyTemplate(t)}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          selectedTemplate === t
                            ? 'border-[#C18282] bg-[#C18282]/5'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <span className="text-xl">{PAGE_TEMPLATES[t].icon}</span>
                        <p className="text-xs font-bold text-neutral-900 mt-1">{PAGE_TEMPLATES[t].label}</p>
                        <p className="text-[10px] text-neutral-500 mt-0.5">{PAGE_TEMPLATES[t].description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Título *</label>
                  <input
                    type="text"
                    value={editingPage.title || ''}
                    onChange={e => setEditingPage({ ...editingPage, title: e.target.value })}
                    className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Slug</label>
                  <input
                    type="text"
                    value={editingPage.slug || ''}
                    onChange={e => setEditingPage({ ...editingPage, slug: e.target.value })}
                    placeholder="gerado-automaticamente"
                    className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              {/* Hero Section */}
              <div className="border border-neutral-200 rounded-lg p-4 space-y-3">
                <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">Hero / Cabeçalho</label>
                <ImageUpload
                  label="Imagem Destacada"
                  value={editingPage.featuredImage || ''}
                  onChange={url => setEditingPage({ ...editingPage, featuredImage: url })}
                  bucket="banner-images"
                />
                <input
                  type="text"
                  value={editingPage.content?.heroTitle || ''}
                  onChange={e => setEditingPage({
                    ...editingPage,
                    content: { ...editingPage.content, heroTitle: e.target.value },
                  })}
                  placeholder="Título do Hero"
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                />
                <input
                  type="text"
                  value={editingPage.content?.heroSubtitle || ''}
                  onChange={e => setEditingPage({
                    ...editingPage,
                    content: { ...editingPage.content, heroSubtitle: e.target.value },
                  })}
                  placeholder="Subtítulo do Hero"
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                />
              </div>

              {/* Sections */}
              <div className="border border-neutral-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">Seções</label>
                  <button
                    type="button"
                    onClick={addSection}
                    className="text-xs text-[#C18282] hover:underline font-medium flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" /> Adicionar Seção
                  </button>
                </div>

                {(editingPage.content?.sections || []).length === 0 && (
                  <p className="text-xs text-neutral-400 text-center py-3">Nenhuma seção adicionada</p>
                )}

                <div className="space-y-3">
                  {(editingPage.content?.sections || []).map((section, idx) => (
                    <div key={idx} className="bg-neutral-50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase">Seção {idx + 1}</span>
                        <button
                          type="button"
                          onClick={() => removeSection(idx)}
                          className="text-neutral-400 hover:text-red-500"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={section.title || ''}
                        onChange={e => updateSection(idx, 'title', e.target.value)}
                        placeholder="Título da seção"
                        className="w-full p-2 border border-neutral-300 rounded text-sm bg-white"
                      />
                      <textarea
                        value={section.text || ''}
                        onChange={e => updateSection(idx, 'text', e.target.value)}
                        placeholder="Conteúdo da seção"
                        rows={3}
                        className="w-full p-2 border border-neutral-300 rounded text-sm bg-white resize-none"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* SEO */}
              <div className="border border-neutral-200 rounded-lg p-4 space-y-3">
                <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">SEO</label>
                <input
                  type="text"
                  value={editingPage.metaTitle || ''}
                  onChange={e => setEditingPage({ ...editingPage, metaTitle: e.target.value })}
                  placeholder="Meta Title (SEO)"
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm"
                />
                <textarea
                  value={editingPage.metaDescription || ''}
                  onChange={e => setEditingPage({ ...editingPage, metaDescription: e.target.value })}
                  placeholder="Meta Description (SEO)"
                  rows={2}
                  className="w-full p-2.5 border border-neutral-300 rounded-lg text-sm resize-none"
                />
              </div>

              {/* Settings */}
              <div className="border border-neutral-200 rounded-lg p-4 space-y-3">
                <label className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">Configurações</label>
                <div className="grid grid-cols-3 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPage.isPublished !== false}
                      onChange={e => setEditingPage({ ...editingPage, isPublished: e.target.checked })}
                      className="w-4 h-4 rounded border-neutral-300 text-[#C18282] focus:ring-[#C18282]"
                    />
                    <span className="text-xs text-neutral-600">Publicado</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPage.showInMenu || false}
                      onChange={e => setEditingPage({ ...editingPage, showInMenu: e.target.checked })}
                      className="w-4 h-4 rounded border-neutral-300 text-[#C18282] focus:ring-[#C18282]"
                    />
                    <span className="text-xs text-neutral-600">Mostrar no Menu</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPage.showInFooter || false}
                      onChange={e => setEditingPage({ ...editingPage, showInFooter: e.target.checked })}
                      className="w-4 h-4 rounded border-neutral-300 text-[#C18282] focus:ring-[#C18282]"
                    />
                    <span className="text-xs text-neutral-600">Mostrar no Footer</span>
                  </label>
                </div>
                <div>
                  <label className="block text-[11px] text-neutral-500 mb-1">Ordem</label>
                  <input
                    type="number"
                    min="0"
                    value={editingPage.order || 0}
                    onChange={e => setEditingPage({ ...editingPage, order: Number(e.target.value) })}
                    className="w-24 p-2 border border-neutral-300 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-neutral-200 flex gap-3">
              <button
                onClick={() => { setIsModalOpen(false); setEditingPage(null); }}
                className="flex-1 border border-neutral-300 py-2.5 rounded-lg text-sm font-medium text-neutral-700 hover:bg-neutral-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSavePage}
                disabled={saving || !editingPage.title}
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
