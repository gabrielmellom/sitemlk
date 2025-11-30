'use client';

import { useState, useEffect } from 'react';
import SafeImage from '@/components/SafeImage';

interface CarouselItem {
  id: string;
  imageUrl: string;
  imageUrlMobile?: string;
  title: string;
  description?: string;
}

interface CarouselProps {
  items: CarouselItem[];
  height?: string;
  autoPlay?: boolean;
  autoPlayInterval?: number;
  showTitle?: boolean;
  showDescription?: boolean;
  className?: string;
}

export default function Carousel({
  items,
  height = "h-[400px]",
  autoPlay = true,
  autoPlayInterval = 5000,
  showTitle = true,
  showDescription = false,
  className = ""
}: CarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play do carrossel
  useEffect(() => {
    if (autoPlay && items.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % items.length);
      }, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [items.length, autoPlay, autoPlayInterval]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % items.length);
  };

  if (items.length === 0) {
    return (
      <div className={`${height} w-full bg-gray-200 flex items-center justify-center ${className}`}>
        <p className="text-gray-500">Nenhuma imagem disponível</p>
      </div>
    );
  }

  return (
    <div className={`relative ${height} w-full overflow-hidden bg-gray-900 rounded-lg ${className}`}>
      {/* Slides */}
      {items.map((item, index) => (
        <div
          key={item.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Se tem imagem mobile, mostra ambas com display condicional */}
          {item.imageUrlMobile ? (
            <>
              {/* Imagem Desktop - esconde em mobile */}
              <div className="hidden md:block w-full h-full">
                <SafeImage
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Imagem Mobile - esconde em desktop */}
              <div className="block md:hidden w-full h-full">
                <SafeImage
                  src={item.imageUrlMobile}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </>
          ) : (
            <SafeImage
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Overlay com informações */}
          {(showTitle || showDescription) && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              {showTitle && (
                <h3 className="text-white text-2xl font-bold drop-shadow-lg mb-2">
                  {item.title}
                </h3>
              )}
              {showDescription && item.description && (
                <p className="text-white/90 text-sm drop-shadow">
                  {item.description}
                </p>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Botões de navegação */}
      {items.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            aria-label="Slide anterior"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
            aria-label="Próximo slide"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Indicadores */}
      {items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
              aria-label={`Ir para slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}