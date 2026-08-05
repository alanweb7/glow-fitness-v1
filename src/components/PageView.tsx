import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2, Phone, Mail, Instagram, Clock } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Page, PageContent, PageSection } from '../types';

interface PageData {
  id: string;
  title: string;
  slug: string;
  template: string;
  content: PageContent;
  featured_image: string | null;
  meta_title: string | null;
  meta_description: string | null;
}

export const PageView: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<PageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPage = async () => {
      if (!slug) return;

      const { data, error: fetchError } = await supabase
        .from('pages')
        .select('id, title, slug, template, content, featured_image, meta_title, meta_description')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (fetchError || !data) {
        setError('Página não encontrada');
        setLoading(false);
        return;
      }

      setPage(data);
      setLoading(false);
    };

    loadPage();
  }, [slug]);

  if (loading) {
    return (
      <div className="py-32 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#C18282]" />
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="py-32 text-center">
        <h1 className="font-serif italic text-3xl text-[#1A1A1A] mb-4">Página não encontrada</h1>
        <p className="text-neutral-500">A página que você procura não existe ou está indisponível.</p>
      </div>
    );
  }

  const content = page.content || {};
  const sections = content.sections || [];
  const featuredImage = page.featured_image || content.heroImage;

  return (
    <div className="py-16 bg-[#FAF7F6] min-h-screen font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Featured Image */}
        {featuredImage && (
          <div className="w-full aspect-[21/9] rounded overflow-hidden shadow-md">
            <img
              src={featuredImage}
              alt={page.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Title */}
        <div className="text-center space-y-3">
          {content.heroSubtitle && (
            <span className="text-xs uppercase tracking-[0.3em] text-[#C18282] font-semibold">
              {content.heroSubtitle}
            </span>
          )}
          <h1 className="font-serif italic text-4xl sm:text-5xl text-[#1A1A1A]">
            {content.heroTitle || page.title}
          </h1>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {sections.map((section, idx) => (
            <SectionRenderer key={idx} section={section} index={idx} />
          ))}
        </div>

        {/* Custom HTML */}
        {content.customHtml && (
          <div 
            className="prose prose-neutral max-w-none"
            dangerouslySetInnerHTML={{ __html: content.customHtml }}
          />
        )}

      </div>
    </div>
  );
};

const SectionRenderer: React.FC<{ section: PageSection; index: number }> = ({ section, index }) => {
  switch (section.type) {
    case 'info':
      return (
        <div className="bg-white p-8 border border-[#1A1A1A]/10 rounded shadow-sm space-y-4">
          {section.title && (
            <h2 className="font-serif italic text-2xl text-[#1A1A1A] font-normal">
              {section.title}
            </h2>
          )}
          {section.text && (
            <p className="text-sm text-neutral-700 leading-relaxed font-light">
              {section.text}
            </p>
          )}
          {section.items && (
            <ul className="space-y-2">
              {section.items.map((item, i) => (
                <li key={i} className="text-sm text-neutral-600 flex items-start gap-2">
                  <span className="text-[#C18282] mt-1">•</span>
                  <span className="font-light">{item}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="flex flex-wrap gap-4 pt-4 text-xs text-neutral-500">
            {section.whatsapp && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>WhatsApp: {section.whatsapp}</span>
              </div>
            )}
            {section.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{section.email}</span>
              </div>
            )}
            {section.instagram && (
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4" />
                <span>{section.instagram}</span>
              </div>
            )}
            {section.horario && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{section.horario}</span>
              </div>
            )}
          </div>
        </div>
      );

    case 'list':
      return (
        <div className="bg-white p-8 border border-[#1A1A1A]/10 rounded shadow-sm space-y-4">
          {section.title && (
            <h2 className="font-serif italic text-2xl text-[#1A1A1A] font-normal">
              {section.title}
            </h2>
          )}
          {section.items && (
            <ul className="space-y-2">
              {section.items.map((item, i) => (
                <li key={i} className="text-sm text-neutral-600 flex items-start gap-2">
                  <span className="text-[#C18282] mt-1">•</span>
                  <span className="font-light">{item}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      );

    case 'cta':
      return (
        <div className="bg-[#E2B3B1]/20 p-8 border border-[#C18282]/30 rounded text-center space-y-4">
          {section.title && (
            <h2 className="font-serif italic text-2xl text-[#1A1A1A] font-normal">
              {section.title}
            </h2>
          )}
          {section.text && (
            <p className="text-sm text-neutral-600 font-light">{section.text}</p>
          )}
          {section.ctaText && section.ctaUrl && (
            <a
              href={section.ctaUrl}
              className="inline-block bg-[#1A1A1A] text-white text-xs uppercase font-semibold px-8 py-3 rounded hover:bg-[#C18282] transition-colors"
            >
              {section.ctaText}
            </a>
          )}
        </div>
      );

    default:
      return (
        <div className="bg-white p-8 border border-[#1A1A1A]/10 rounded shadow-sm space-y-4">
          {section.title && (
            <h2 className="font-serif italic text-2xl text-[#1A1A1A] font-normal">
              {section.title}
            </h2>
          )}
          {section.text && (
            <p className="text-sm text-neutral-700 leading-relaxed font-light">
              {section.text}
            </p>
          )}
        </div>
      );
  }
};
