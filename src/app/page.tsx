'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import NewsCard from '@/components/NewsCard';
import SafeImage from '@/components/SafeImage';
import Footer from '@/components/Footer';
import SplashScreen from '@/components/SplashScreen';
import Carousel from '@/components/Carousel';
import AdsSection from '@/components/AdsSection';
import Social from '@/components/socialmidiahome';

import {
  getNewsPaginated,
  getCarouselImages,
  getAds,
  getEvents,
  type News,
  type CarouselImage,
  type AdItem,
  type EventItem,
} from '@/lib/firebase';
import type { QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';

// CSS do Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// ✨ ADICIONE ESTE COMPONENTE AQUI ✨
// Alternativa: usando o mesmo padrão do seu NewsCard
const FeaturedNewsCard = ({ news }: { news: any }) => {
  return (
    <Link href={`/noticia/${news.id}`} className="group block">
      <article className="relative h-80 rounded-2xl overflow-hidden shadow-xl bg-gradient-to-r from-orange-500 via-purple-600 to-pink-600">
        {/* Imagem de fundo */}
        <div className="absolute inset-0">
          <Image
            src={news.imageUrl}
            alt={news.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/20 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        </div>

        {/* Badge de destaque */}
        <div className="absolute top-4 left-4 z-10">
          <div className="bg-gradient-to-r from-orange-500 to-purple-600 px-4 py-2 rounded-full">
            <span className="text-white text-sm font-bold uppercase tracking-wide flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
              </svg>
              DESTAQUE
            </span>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="relative z-10 h-full flex flex-col justify-end p-6 text-white">
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm opacity-90">
              <span className="bg-white/20 px-3 py-1 rounded-full font-medium">
                {news.category}
              </span>
              <span>
                {news.createdAt.toDate().toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold leading-tight group-hover:text-orange-200 transition-colors duration-300">
              {news.title}
            </h2>
            
            {news.subtitle && (
              <p className="text-lg opacity-90 line-clamp-2">
                {news.subtitle}
              </p>
            )}
            
            <div className="flex items-center gap-2 text-sm font-medium group-hover:text-orange-200 transition-colors">
              <span>Leia mais</span>
              <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default function Home() {
  const [news, setNews] = useState<News[]>([]);
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [adsData, setAdsData] = useState<AdItem[]>([]);
  const [eventsData, setEventsData] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showSplash, setShowSplash] = useState(true);

  // Paginação "ver mais"
  const pageSize = 6;
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    loadInitial();
  }, []);

  // Configuração do chatbot quando o componente monta
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const iframe = document.getElementById('chatbotIframe') as HTMLIFrameElement;
      if (!iframe) return;

      switch (event.data) {
        case 'openChatbot':
          iframe.style.width = '420px';
          iframe.style.height = '800px';
          break;
        case 'closeChatbot':
          iframe.style.width = '100px';
          iframe.style.height = '100px';
          break;
        case 'maximizeChatbot':
          iframe.style.width = '500px';
          iframe.style.height = '800px';
          break;
        case 'minimizeChatbot':
          iframe.style.width = '420px';
          iframe.style.height = '800px';
          break;
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const loadInitial = async () => {
    try {
      setLoading(true);
      const [firstPage, carouselData, adsDataFromDB, eventsDataFromDB] = await Promise.all([
        getNewsPaginated(pageSize),
        getCarouselImages(),
        getAds(),
        getEvents(),
      ]);

      setNews(firstPage.data);
      setLastDoc(firstPage.lastVisible);
      setHasMore(firstPage.hasMore);

      setCarouselImages(carouselData);
      setAdsData(adsDataFromDB);
      setEventsData(eventsDataFromDB);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoreNews = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const next = await getNewsPaginated(pageSize, lastDoc);
      const existing = new Set(news.map(n => n.id));
      const deduped = next.data.filter(n => !existing.has(n.id));
      setNews(prev => [...prev, ...deduped]);
      setLastDoc(next.lastVisible);
      setHasMore(next.hasMore);
    } catch (e) {
      console.error('Erro ao carregar mais notícias:', e);
    } finally {
      setLoadingMore(false);
    }
  };

  // Converter EventItem para o formato que o Carousel espera
  const carouselEventsData = eventsData.map(event => ({
    id: event.id || '',
    imageUrl: event.imageUrl,
    title: event.title,
    description: event.description,
  }));

  // Auto-play do carrossel principal
  useEffect(() => {
    if (carouselImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [carouselImages.length]);

  const handleSplashComplete = () => setShowSplash(false);

  // Splash
  if (showSplash) {
    return (
      <SplashScreen
        logoSrc="/logo.png"
        logoAlt="Muleka FM Logo"
        logoWidth={300}
        logoHeight={300}
        duration={1300}
        onComplete={handleSplashComplete}
      />
    );
  }

  // Loading inicial
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <Social/>
      {/* Carrossel Principal (Hero) */}
      {carouselImages.length > 0 && (
        <div className="relative h-[500px] w-full overflow-hidden bg-gray-900 mt-22">
          {carouselImages.map((image, index) => (
            <div
              key={image.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
            >
              <SafeImage
                src={image.imageUrl}
                alt={image.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
                <h2 className="text-white text-4xl font-bold drop-shadow-lg">
                  {image.title}
                </h2>
              </div>
            </div>
          ))}

          {/* Indicadores */}
          {carouselImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {carouselImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50'
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Chatbot iframe */}
      <iframe
        id="chatbotIframe"
        src="https://admin.toolzz.ai/embed/6ae42909-e9b5-47c4-9c3a-bf858d45111c"
        width="100"
        height="100"
        style={{
          position: 'fixed',
          bottom: '15px',
          right: '15px',
          border: 'none',
          borderRadius: '10px',
          zIndex: 99,
          background: 'transparent',
        }}
        allow="microphone"
        title="Chatbot"
      />

      {/* ✅ SEÇÃO DE NOTÍCIAS CORRIGIDA ✅ */}
      <main className="container mx-auto px-6 py-10">
  {/* Título da seção */}
  <div className="text-center mb-12">
    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent mb-4">
      Últimas Notícias
    </h1>
    <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-purple-600 mx-auto rounded-full"></div>
    <p className="text-gray-600 mt-4 text-lg">
      Fique por dentro de tudo que acontece na região
    </p>
  </div>

  {news.length > 0 ? (
    <>
      {/* TODAS AS NOTÍCIAS USANDO O NEWSCARD PADRÃO */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mb-10">
        {news.map((item) => (
          <NewsCard key={item.id} news={item} />
        ))}
      </div>

      {/* Botão Ver mais */}
      <div className="flex justify-center mb-16">
        <button
          onClick={loadMoreNews}
          disabled={!hasMore || loadingMore}
          className="bg-gradient-to-r from-orange-500 to-purple-600 text-white px-8 py-4 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loadingMore ? (
            <div className="flex items-center gap-3">
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              <span>Carregando...</span>
            </div>
          ) : hasMore ? (
            <div className="flex items-center gap-3">
              <span>Ver mais notícias</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          ) : (
            'Não há mais notícias'
          )}
        </button>
      </div>
    </>
  ) : (
    <div className="text-center py-10 mb-16">
      <p className="text-gray-500">Nenhuma notícias disponível no momento.</p>
    </div>
  )}
</main>

      {/* Resto do seu código permanece igual */}
      {eventsData.length > 0 && (
        <section className="w-full py-12 " style={{ backgroundColor: '#E7E7E7FF' }}>
          <h2 className="text-3xl font-bold mb-8 text-center text-black">
            Eventos e Shows
          </h2>
          <div className="mx-auto px-6" style={{ maxWidth: '70rem' }}>
            <Carousel
              items={carouselEventsData}
              height="h-[350px]"
              showTitle={true}
              showDescription={true}
              autoPlayInterval={4000}
            />
          </div>
        </section>
      )}

      <div className="w-full py-12" style={{ backgroundColor: '#E7E7E7FF'}}>
        <AdsSection
          ads={adsData}
          title="Nossos Parceiros"
          loading={loading}
        />
      </div>

      <Footer />
    </>
  );
}