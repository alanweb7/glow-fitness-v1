import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowRight, MessageCircle } from 'lucide-react';

export const BlogView: React.FC = () => {
  const navigate = useNavigate();

  const posts = [
    {
      id: '1',
      title: 'Como escolher o top ideal para treinos de alto impacto',
      summary: 'Descubra a importância da sustentação e como a largura das alças previne dores nos ombros durante corridas e treinos de crossfit.',
      date: '28 de Julho, 2026',
      author: 'Equipe Glow Fitness',
      image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: '2',
      title: 'Macaquinho Fitness: A tendência que uniu praticidade e estilo',
      summary: 'Por que os macaquinhos com cós alto e bojo removível se tornaram os queridinhos das academias em 2026.',
      date: '15 de Julho, 2026',
      author: 'Vanessa Santos',
      image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    },
    {
      id: '3',
      title: 'Cuidados essenciais para conservar suas roupas de ginástica por anos',
      summary: 'Dicas práticas de lavagem, secagem e sabão neutro para manter a elasticidade da poliamida e do elastano sempre novas.',
      date: '02 de Julho, 2026',
      author: 'Equipe Glow Fitness',
      image: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=800&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <div className="py-16 bg-[#FAF7F6] min-h-screen font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        <div className="text-center space-y-3">
          <span className="text-xs uppercase tracking-[0.3em] text-[#C18282] font-semibold">
            Blog & Dicas de Estilo
          </span>
          <h1 className="font-serif italic text-4xl sm:text-5xl text-[#1A1A1A]">Glow Magazine</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map(post => (
            <div key={post.id} className="bg-white border border-[#1A1A1A]/10 rounded overflow-hidden flex flex-col justify-between shadow-xs">
              <div>
                <div className="aspect-[16/10] bg-neutral-100 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-center gap-3 text-[10px] text-neutral-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {post.date}</span>
                    <span className="flex items-center gap-1"><User className="w-3 h-3" /> {post.author}</span>
                  </div>
                  <h3 className="font-serif italic text-lg text-[#1A1A1A] leading-snug">{post.title}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed font-light">{post.summary}</p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button
                  onClick={() => navigate('/catalog')}
                  className="text-xs font-semibold text-[#C18282] hover:text-[#1A1A1A] flex items-center gap-1 transition-colors"
                >
                  Ler Artigo Completo <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
