// src/app/massafm/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Social from '@/components/socialmidiamassa';
import BannersSection from '@/components/BannersSection';
import { getBanners } from '@/lib/firebase';

import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

// Se quiser, mova para .env.local como NEXT_PUBLIC_MASSA_STREAM
const STREAM_URL = 'https://stm01.virtualcast.com.br:8148/massacianorte';

interface Banner {
  id?: string;
  titulo: string;
  link: string;
  imagem: string;
  imagemMobile?: string;
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
  const [loadingBanners, setLoadingBanners] = useState(true);

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
      setLoadingBanners(true);
      try {
        const bannersData = await getBanners();
        setBanners(bannersData);
      } catch (error) {
        console.error('Erro ao carregar banners:', error);
      } finally {
        setLoadingBanners(false);
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-200 via-white to-purple-100">
      <Header />
      <Social/>
      <main className="flex-1 mt-22" >
        {/* HERO */}
        <section className="relative">
          <div className="container mx-auto px-6 pt-8 pb-4">
            <div className="relative w-full h-[180px] sm:h-[220px] md:h-[260px] rounded-2xl overflow-hidden shadow">
              <Image
                src="/massa.png"
                alt="Massa FM 96.9 - Ouça Agora"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </section>

        {/* Título */}
        <section className="container mx-auto px-6 pb-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold mt-4 text-purple-700">
              Massa FM Cianorte 96.9 — ao vivo
            </h1>
            <p className="text-gray-600 mt-2">#A minha rádio é massa — 24 horas no ar 🟠🟣</p>
          </div>

          {/* 🔧 items-stretch força as colunas a igualarem a altura da mais alta */}
          <div className="grid md:grid-cols-2 gap-8 items-stretch">
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
                      <h2 className="text-xl font-semibold text-gray-900">Massa FM Cianorte 96.9</h2>
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
                      title="Massa FM - Player"
                      src="https://v-us-01.wisestream.io/f10b70fd-d090-4b62-a90a-fd9f4fde1b23.html"
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
        </section>

        {/* Seção de Banners */}
        <BannersSection 
          banners={banners}
          loading={loadingBanners}
        />

      </main>

      <footer className="bg-[#FF9400] text-white py-6 text-center text-sm">
        © {new Date().getFullYear()} Massa FM Cianorte 96.9 — Grupo MLK.
      </footer>

      {/* animação equalizer */}
      <style jsx>{`
        @keyframes bounce1 { 0%,100%{height:0.5rem} 50%{height:3.5rem} }
        @keyframes bounce2 { 0%,100%{height:1rem} 50%{height:4.5rem} }
        @keyframes bounce3 { 0%,100%{height:2rem} 50%{height:5.5rem} }
        @keyframes bounce4 { 0%,100%{height:0.75rem} 50%{height:4rem} }
        .bar { display:block; }
        .bar-1 { animation: bounce1 0.9s ease-in-out infinite; }
        .bar-2 { animation: bounce2 1.1s ease-in-out infinite; }
        .bar-3 { animation: bounce3 1s ease-in-out infinite; }
        .bar-4 { animation: bounce4 1.05s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
