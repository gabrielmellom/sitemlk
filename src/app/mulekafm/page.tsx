// src/app/massafm/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import { Play, Pause, Volume2, VolumeX, Radio, Video } from 'lucide-react';
import Social from '@/components/socialdinamicomlk';
import { getBanners } from '@/lib/firebase';

const STREAM_URL = 'https://ice.fabricahost.com.br/mulekafmpr';

interface Banner {
  id?: string;
  titulo: string;
  link: string;
  imagem: string;
  ativo: boolean;
  ordem: number;
  tamanho: 'grande' | 'pequeno';
}

export default function MassaFMPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState<number>(() => {
    if (typeof window === 'undefined') return 0.85;
    const saved = localStorage.getItem('massafm_volume');
    return saved ? Number(saved) : 0.85;
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [activePlayer, setActivePlayer] = useState<'radio' | 'video'>('video');

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = muted ? 0 : volume;
  }, [volume, muted]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('massafm_volume', String(volume));
    }
  }, [volume]);

  useEffect(() => {
    const loadBanners = async () => {
      try {
        const bannersData = await getBanners();
        setBanners(bannersData.filter(b => b.ativo));
      } catch (error) {
        console.error('Erro ao carregar banners:', error);
      }
    };
    loadBanners();
  }, []);

  const togglePlay = async () => {
    const el = audioRef.current;
    if (!el) return;
    setErrorMsg(null);
    try {
      if (isPlaying) {
        el.pause();
        setIsPlaying(false);
      } else {
        if (el.src !== STREAM_URL) el.src = STREAM_URL;
        await el.play();
        setIsPlaying(true);
      }
    } catch (err) {
      setErrorMsg('Não consegui iniciar o áudio. Toque no botão novamente ou verifique o volume do dispositivo.');
      console.error(err);
    }
  };

  const toggleMute = () => setMuted((m) => !m);

  const handleBannerClick = (link: string) => {
    window.open(link, '_blank');
  };

  const bannersGrandes = banners.filter(b => b.tamanho === 'grande').sort((a, b) => a.ordem - b.ordem);
  const bannersPequenos = banners.filter(b => b.tamanho === 'pequeno').sort((a, b) => a.ordem - b.ordem);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-200 via-white to-purple-100">
      <Header />
      <Social/>
      <main className="flex-1 mt-22">
        {/* HERO */}
        <section className="relative">
          <div className="container mx-auto px-6 pt-8 pb-4">
            <div className="relative w-full h-[180px] sm:h-[220px] md:h-[260px] rounded-2xl overflow-hidden shadow">
              <Image
                src="/mlkinicio.jpeg"
                alt="Muleka FM"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* Título e Descrição */}
        <section className="container mx-auto px-6 pb-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold mt-4 text-purple-700">
              Muleka FM
            </h1>
            <p className="text-gray-600 mt-2 text-lg">#TemCoisaBoa — 24 horas no ar 🟠🟣</p>
          </div>
        </section>

        {/* Seção Principal - Responsiva */}
        <section className="container mx-auto px-6 pb-12">
          {/* Toggle para Mobile/Tablet (visível apenas em telas pequenas) */}
          <div className="flex justify-center mb-6 md:hidden">
            <div className="bg-white rounded-full p-1 shadow-lg inline-flex">
              <button
                onClick={() => setActivePlayer('video')}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full transition-all duration-300 whitespace-nowrap ${
                  activePlayer === 'video' 
                    ? 'bg-purple-600 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Video size={20} />
                <span>Vídeo</span>
              </button>
              <button
                onClick={() => setActivePlayer('radio')}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-full transition-all duration-300 whitespace-nowrap ${
                  activePlayer === 'radio' 
                    ? 'bg-orange-500 text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Radio size={20} />
                <span>Rádio</span>
              </button>
            </div>
          </div>

          {/* Layout Mobile/Tablet - Player único com toggle */}
          <div className="md:hidden">
            {activePlayer === 'video' ? (
              /* Video Player Mobile */
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    title="MULEKA FM"
                    src="https://wise-stream.mycloudstream.io/player/dhjsasv9?autoplay=true"
                    className="absolute inset-0 w-full h-full"
                    style={{ border: 'none' }}
                    scrolling="no"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                </div>
                <div className="p-6 bg-gradient-to-r from-purple-600 to-orange-500">
                  <div className="text-center text-white">
                    <h3 className="text-xl font-bold">Assista ao Vivo</h3>
                    <p className="text-purple-100 mt-1">Programação 24h com vídeo</p>
                  </div>
                </div>
              </div>
            ) : (
              /* Radio Player Mobile */
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Rádio Muleka FM</h2>
                    <p className="text-gray-600">Programação ao vivo</p>
                  </div>

                  <div className="flex items-center justify-center gap-6 mb-8">
                    <button
                      onClick={togglePlay}
                      className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-orange-500 to-purple-600 text-white shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-300"
                      aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
                    >
                      {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10 translate-x-[2px]" />}
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      onClick={toggleMute}
                      className="p-3 rounded-full hover:bg-gray-100 transition"
                      aria-label={muted ? 'Ativar som' : 'Silenciar'}
                    >
                      {muted ? <VolumeX className="w-6 h-6 text-gray-700" /> : <Volume2 className="w-6 h-6 text-gray-700" />}
                    </button>
                    <input
                      type="range"
                      min={0}
                      max={1}
                      step={0.01}
                      value={muted ? 0 : volume}
                      onChange={(e) => {
                        const v = Number(e.target.value);
                        setVolume(v);
                        setMuted(v === 0);
                      }}
                      className="flex-1 accent-orange-500"
                      aria-label="Volume"
                    />
                    <span className="text-sm text-gray-500 w-12 text-center">
                      {Math.round((muted ? 0 : volume) * 100)}%
                    </span>
                  </div>

                  {errorMsg && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-600 text-center">{errorMsg}</p>
                    </div>
                  )}

                  {/* Equalizer para mobile */}
                  <div className="flex items-end justify-center gap-2 h-16 mt-8">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <span
                        key={i}
                        className={`w-2 rounded-full bg-gradient-to-t from-orange-500 to-purple-600 ${
                          isPlaying ? `bar bar-${(i % 4) + 1}` : 'h-4'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <audio ref={audioRef} src={STREAM_URL} preload="none" />
              </div>
            )}
          </div>

          {/* Layout Desktop - Lado a lado original */}
          <div className="hidden md:grid md:grid-cols-2 gap-8 items-stretch">
            {/* Player custom (ESQUERDA) */}
            <div className="max-w-xl md:max-w-none mx-auto w-full h-full">
              <div className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur shadow-xl border border-orange-100 h-full flex flex-col min-h-[420px]">
                <div className="grid md:grid-cols-[200px,1fr] flex-1">
                  {/* equalizer */}
                  <div className="relative p-8 md:p-10 bg-gradient-to-br from-orange-500 to-purple-600 flex items-center justify-center">
                    <div className="flex items-end gap-2 h-24">
                      <span className={`w-2 rounded bg-white/90 ${isPlaying ? 'bar bar-1' : 'h-6'}`} />
                      <span className={`w-2 rounded bg-white/90 ${isPlaying ? 'bar bar-2' : 'h-10'}`} />
                      <span className={`w-2 rounded bg-white/90 ${isPlaying ? 'bar bar-3' : 'h-16'}`} />
                      <span className={`w-2 rounded bg-white/90 ${isPlaying ? 'bar bar-4' : 'h-8'}`} />
                    </div>
                  </div>

                  {/* controles */}
                  <div className="p-6 md:p-8">
                    <div className="mb-6">
                      <h2 className="text-xl font-semibold text-gray-900">Muleka FM</h2>
                      <p className="text-sm text-gray-600">Tocando agora: programação ao vivo</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={togglePlay}
                        className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-500 text-white shadow-lg hover:scale-105 active:scale-95 transition-transform focus:outline-none focus:ring-4 focus:ring-orange-300"
                        aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
                      >
                        {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 translate-x-[1px]" />}
                      </button>

                      <div className="flex items-center gap-3 flex-1">
                        <button
                          onClick={toggleMute}
                          className="p-2 rounded-lg hover:bg-gray-100 transition"
                          aria-label={muted ? 'Ativar som' : 'Silenciar'}
                        >
                          {muted ? <VolumeX className="w-6 h-6 text-gray-800" /> : <Volume2 className="w-6 h-6 text-gray-800" />}
                        </button>
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.01}
                          value={muted ? 0 : volume}
                          onChange={(e) => {
                            const v = Number(e.target.value);
                            setVolume(v);
                            setMuted(v === 0);
                          }}
                          className="w-full accent-orange-500"
                          aria-label="Volume"
                        />
                      </div>
                    </div>

                    {errorMsg && <p className="mt-4 text-sm text-red-600">{errorMsg}</p>}
                  </div>
                </div>

                <audio ref={audioRef} src={STREAM_URL} preload="none" />
              </div>
            </div>

            {/* Player embed (DIREITA) */}
            <div className="w-full h-full">
              <div className="rounded-3xl bg-white shadow-xl border border-purple-200 h-full flex flex-col min-h-[420px]">
                <div className="relative w-full px-4 pb-2 flex-1 flex items-stretch">
                  <div className="relative w-full pt-[56.25%]">
                    <iframe
                      title="MULEKA FM"
                      src="https://wise-stream.mycloudstream.io/player/dhjsasv9?autoplay=true"
                      className="absolute inset-0 w-full h-full rounded-2xl"  
                      style={{ border: 'none' }}
                      scrolling="no"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center py-2">
                  Se não iniciar, verifique o bloqueio de autoplay.
                </p>
              </div>
            </div>
          </div>

          {/* Status Info */}
          <div className="text-center mt-6">
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur rounded-full px-4 py-2 shadow-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-700">Ao vivo agora</span>
            </div>
          </div>
        </section>

        {/* Seção de Banners */}
        {banners.length > 0 && (
          <section className="container mx-auto px-6 pb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Parceiros & Conteúdos</h2>
              <p className="text-gray-600 mt-2">Confira nossos parceiros e conteúdos exclusivos</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
              {bannersGrandes.length > 0 && (
                <div className="lg:col-span-3">
                  <div 
                    className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                    onClick={() => handleBannerClick(bannersGrandes[0].link)}
                  >
                    <div className="relative h-[320px] lg:h-[440px]">
                      <Image
                        src={bannersGrandes[0].imagem}
                        alt={bannersGrandes[0].titulo}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <h3 className="text-white font-bold text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {bannersGrandes[0].titulo}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                {bannersPequenos.slice(0, 4).map((banner, index) => (
                  <div
                    key={banner.id}
                    className="group cursor-pointer overflow-hidden rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
                    onClick={() => handleBannerClick(banner.link)}
                  >
                    <div className="relative aspect-square">
                      <Image
                        src={banner.imagem}
                        alt={banner.titulo}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute bottom-2 left-2 right-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <h4 className="text-white font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 line-clamp-2">
                          {banner.titulo}
                        </h4>
                      </div>
                    </div>
                  </div>
                ))}

                {Array.from({ length: Math.max(0, 4 - bannersPequenos.length) }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <p className="text-gray-400 text-sm text-center">Em breve</p>
                  </div>
                ))}
              </div>
            </div>

            {bannersPequenos.length > 4 && (
              <div className="text-center mt-8">
                <p className="text-gray-600 text-sm">
                  E mais {bannersPequenos.length - 4} parceiro{bannersPequenos.length - 4 > 1 ? 's' : ''}!
                </p>
              </div>
            )}
          </section>
        )}

      </main>

      <footer className="bg-[#FF9400] text-white py-6 text-center text-sm">
        © {new Date().getFullYear()} Muleka FM  — Grupo MLK.
      </footer>

      <style jsx>{`
        @keyframes bounce1 { 0%,100%{height:2rem} 50%{height:6rem} }
        @keyframes bounce2 { 0%,100%{height:1rem} 50%{height:4rem} }
        @keyframes bounce3 { 0%,100%{height:3rem} 50%{height:7rem} }
        @keyframes bounce4 { 0%,100%{height:1.5rem} 50%{height:5rem} }
        .bar { display:block; }
        .bar-1 { animation: bounce1 1.2s ease-in-out infinite; }
        .bar-2 { animation: bounce2 0.8s ease-in-out infinite; }
        .bar-3 { animation: bounce3 1.4s ease-in-out infinite; }
        .bar-4 { animation: bounce4 1s ease-in-out infinite; }
        .line-clamp-2 {
          overflow: hidden;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
        }
      `}</style>
    </div>
  );
}