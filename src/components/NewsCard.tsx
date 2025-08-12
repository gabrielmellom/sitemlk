import Link from 'next/link';
import Image from 'next/image';
import { News } from '@/lib/firebase';

export default function NewsCard({ news }: { news: News }) {
  return (
    <Link href={`/noticia/${news.id}`} className="group">
      <article 
        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 backdrop-blur-sm"
        style={{ width: '350px', height: '581px' }}
      >
        {/* Container da imagem com overlay */}
        <div className="relative h-80 w-full overflow-hidden">
          <Image
            src={news.imageUrl}
            alt={news.title}
            fill
            sizes="350px"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          {/* Categoria flutuante */}
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg backdrop-blur-sm">
              {news.category}
            </span>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 h-64 flex flex-col relative">
          {/* Linha decorativa */}
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-orange-400 via-purple-500 to-orange-400"></div>
          
          <div className="pt-4 flex flex-col h-full">
            {/* Título */}
            <h3 className="text-xl font-bold line-clamp-2 mb-4 text-gray-800 group-hover:text-purple-600 transition-colors duration-300 leading-tight">
              {news.title}
            </h3>
            
            {/* Subtítulo */}
            <p className="text-gray-600 line-clamp-4 flex-grow leading-relaxed text-sm">
              {news.subtitle}
            </p>

            {/* Footer com botão */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">
                  Leia mais
                </span>
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Efeito de brilho hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none"></div>
      </article>
    </Link>
  );
}