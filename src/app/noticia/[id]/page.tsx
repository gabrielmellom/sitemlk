'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/Header';
import { getNewsById, News } from '@/lib/firebase';
import DOMPurify from 'isomorphic-dompurify';

export default function NoticiaPage() {
  const params = useParams();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      try {
        const data = await getNewsById(params.id as string);
        setNews(data);
      } catch (error) {
        console.error('Erro ao carregar notícia:', error);
      } finally {
        setLoading(false);
      }
    };
    loadNews();
  }, [params.id]);

  if (loading) return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  if (!news)    return <div className="flex justify-center items-center h-screen">Notícia não encontrada</div>;

  // 🔒 Sanitiza o HTML salvo no Firestore
  const safeHtml = DOMPurify.sanitize(news.content ?? '', {
    USE_PROFILES: { html: true }, // perfil padrão de HTML
  });

  return (
    <>
      <Header />

      <article className="container mx-auto px-4 py-8 max-w-4xl mt-24">
        <span className="text-blue-600 font-semibold uppercase">{news.category}</span>

        <h1 className="text-4xl font-bold mt-2 mb-4">{news.title}</h1>

        <p className="text-xl text-gray-600 mb-6">{news.subtitle}</p>

        <div className="relative h-[400px] w-full mb-8">
          <Image
            src={news.imageUrl}
            alt={news.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>

        <div
          className="prose max-w-none text-gray-800 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />

        <div className="mt-8 pt-8 border-t text-sm text-gray-500">
          Por {news.author}
        </div>
      </article>
    </>
  );
}
