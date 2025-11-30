import Link from 'next/link';
import Image from 'next/image';
import { News } from '@/lib/firebase';

export default function NewsCard({ news }: { news: News }) {
  return (
    <Link href={`/noticia/${news.id}`} className="group w-full">
      <article
        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 backdrop-blur-sm flex flex-col h-full max-w-sm mx-auto"
      >
        {/* Imagem */}
        <div className="relative w-full overflow-hidden shrink-0" style={{ paddingBottom: '60%' }}>
          <Image
            src={news.imageUrl}
            alt={news.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Categoria */}
          <div className="absolute top-3 left-3 md:top-4 md:left-4">
            <span className="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg backdrop-blur-sm">
              {news.category}
            </span>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-4 md:p-5 flex-1 flex flex-col relative">
          {/* Linha decorativa */}
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-orange-400 via-purple-500 to-orange-400" />

          {/* Título */}
          <h3 className="pt-2 text-base md:text-lg font-bold mb-2 text-gray-800 group-hover:text-purple-600 transition-colors duration-300 leading-snug line-clamp-3">
            {news.title}
          </h3>

          {/* Subtítulo */}
          <p className="text-gray-600 text-sm md:text-base leading-relaxed overflow-hidden flex-1 line-clamp-3 md:line-clamp-4 mb-4">
            {news.subtitle}
          </p>

          {/* Footer */}
          <div className="mt-auto pt-3 md:pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 font-medium">Leia mais</span>
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-purple-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300 shadow-md">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Brilho hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
      </article>
    </Link>
  );
}
