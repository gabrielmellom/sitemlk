import Link from 'next/link';
import Image from 'next/image';
import { News } from '@/lib/firebase';

export default function NewsCard({ news }: { news: News }) {
  return (
    <Link href={`/noticia/${news.id}`} className="group">
      <article
        className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-100 backdrop-blur-sm flex flex-col"
        style={{ width: 350, height: 581 }} /* altura fixa p/ alinhar os cards */
      >
        {/* Imagem */}
        <div className="relative h-50 w-full overflow-hidden shrink-0">
          <Image
            src={news.imageUrl}
            alt={news.title}
            fill
            sizes="350px"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />

          {/* Categoria */}
          <div className="absolute top-4 left-4">
            <span className="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide shadow-lg backdrop-blur-sm">
              {news.category}
            </span>
          </div>
        </div>

        {/* Conteúdo (grid: título | subtítulo | footer) */}
        <div className="p-5 flex-1 grid grid-rows-[auto,1fr,auto] gap-0 relative min-h-0">
          {/* Linha decorativa */}
          <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-orange-400 via-purple-500 to-orange-400" />

          {/* Título (NÃO corta) */}
          <h3 className="pt-2 text-lg font-bold mb-1 text-gray-800 group-hover:text-purple-600 transition-colors duration-300 leading-snug">
            {news.title}
          </h3>

          {/* Subtítulo (pode cortar) */}
          <p className="text-gray-600 text-base  leading-relaxed overflow-hidden min-h-0 line-clamp-[6]">
            {news.subtitle}
          </p>

          {/* Footer */}
          <div className="mt-4 pt-4 border-t border-gray-100">
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
