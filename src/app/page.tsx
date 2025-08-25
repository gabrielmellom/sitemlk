'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import NewsCard from '@/components/NewsCard';
import SafeImage from '@/components/SafeImage';
import Footer from '@/components/Footer';
import SplashScreen from '@/components/SplashScreen';
import Carousel from '@/components/Carousel';
import AdsSection from '@/components/AdsSection';
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
      // Carrega primeira "página" + demais seções em paralelo
      const [firstPage, carouselData, adsDataFromDB, eventsDataFromDB] = await Promise.all([
        getNewsPaginated(pageSize), // primeira página
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
      // evita duplicados caso tenha inserções durante a navegação
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
        duration={3000}
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

      {/* Carrossel Principal (Hero) */}
      {carouselImages.length > 0 && (
        <div className="relative h-[500px] w-full overflow-hidden bg-gray-900">
          {carouselImages.map((image, index) => (
            <div
              key={image.id}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
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
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
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

      {/* Notícias */}
      <main className="container mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold mb-10 text-center">Últimas Notícias</h1>

        {news.length > 0 ? (
          <>
            <div className="flex flex-wrap gap-8 justify-center mb-10">
              {news.map((item) => (
                <NewsCard key={item.id} news={item} />
              ))}
            </div>

            {/* Botão Ver mais */}
            <div className="flex justify-center mb-16">
              <button
                onClick={loadMoreNews}
                disabled={!hasMore || loadingMore}
                className={`px-6 py-3 rounded-xl font-medium shadow-md transition ${
                  hasMore
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                {loadingMore ? 'Carregando...' : hasMore ? 'Ver mais notícias' : 'Não há mais notícias'}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-10 mb-16">
            <p className="text-gray-500">Nenhuma notícia disponível no momento.</p>
          </div>
        )}

        {/* Carrossel de Eventos */}
        {eventsData.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Eventos e Shows</h2>
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
      </main>

      {/* Seção de Anúncios */}
      <AdsSection
        ads={adsData}
        title="Nossos Parceiros"
        className="bg-gray-50"
        loading={loading}
      />

      <Footer />
    </>
  );
}