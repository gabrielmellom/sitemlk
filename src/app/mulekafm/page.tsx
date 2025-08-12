// src/app/mulekafm/page.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import Header from '@/components/Header';
import { Play, Pause, Volume2, VolumeX, Radio, MessageCircle } from 'lucide-react';

const STREAM_URL = 'https://ice.fabricahost.com.br/mulekafmpr';

export default function MulekaFMPage() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState<number>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('mulekafm_volume') : null;
    return saved ? Number(saved) : 0.8;
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = muted ? 0 : volume;
  }, [volume, muted]);

  useEffect(() => {
    localStorage.setItem('mulekafm_volume', String(volume));
  }, [volume]);

  const togglePlay = async () => {
    const el = audioRef.current;
    if (!el) return;
    setErrorMsg(null);
    try {
      if (isPlaying) {
        el.pause();
        setIsPlaying(false);
      } else {
        // garante a src e tenta tocar (alguns browsers só liberam após interação)
        if (el.src !== STREAM_URL) el.src = STREAM_URL;
        await el.play();
        setIsPlaying(true);
      }
    } catch (err) {
      setErrorMsg('Não consegui iniciar o áudio. Toque no botão novamente ou verifique o volume do seu dispositivo.');
      console.error(err);
    }
  };

  const toggleMute = () => setMuted((m) => !m);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-100 via-white to-purple-100">
      <Header />

      <main className="flex-1">
        <section className="container mx-auto px-6 py-10">
          {/* Cabeçalho da emissora */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-orange-400/90 flex items-center justify-center shadow-lg">
              <Radio className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mt-4 text-purple-700">
              Muleka FM — ao vivo
            </h1>
            <p className="text-gray-600 mt-2">
              Música, alegria e informação 24h 🟣🟠
            </p>
          </div>

          {/* Card do Player */}
          <div className="max-w-3xl mx-auto">
            <div className="relative overflow-hidden rounded-3xl bg-white/80 backdrop-blur shadow-xl border border-purple-100">
              <div className="grid md:grid-cols-[200px,1fr]">
                {/* Capa / visual */}
                <div className="relative p-8 md:p-10 bg-gradient-to-br from-orange-400 to-purple-500 flex items-center justify-center">
                  {/* “Equalizer” animado quando tocando */}
                  <div className="flex items-end gap-2 h-24">
                    <span className={`w-2 rounded bg-white/90 ${isPlaying ? 'bar bar-1' : 'h-6'}`} />
                    <span className={`w-2 rounded bg-white/90 ${isPlaying ? 'bar bar-2' : 'h-10'}`} />
                    <span className={`w-2 rounded bg-white/90 ${isPlaying ? 'bar bar-3' : 'h-16'}`} />
                    <span className={`w-2 rounded bg-white/90 ${isPlaying ? 'bar bar-4' : 'h-8'}`} />
                  </div>
                </div>

                {/* Controles */}
                <div className="p-6 md:p-8">
                  {/* Título/descrição */}
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Rádio Muleka FM</h2>
                    <p className="text-sm text-gray-600">
                      Tocando agora: programação ao vivo
                    </p>
                  </div>

                  {/* Botões principais */}
                  <div className="flex items-center gap-4">
                    <button
                      onClick={togglePlay}
                      className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-600 text-white shadow-lg hover:scale-105 active:scale-95 transition-transform focus:outline-none focus:ring-4 focus:ring-purple-300"
                      aria-label={isPlaying ? 'Pausar' : 'Reproduzir'}
                    >
                      {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 translate-x-[1px]" />}
                    </button>

                    {/* Volume */}
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
                          if (v === 0) setMuted(true);
                          else setMuted(false);
                        }}
                        className="w-full accent-purple-600"
                        aria-label="Volume"
                      />
                    </div>
                  </div>

                  {/* Ações extras */}
                  

                  {/* Mensagem de erro / aviso */}
                  {errorMsg && (
                    <p className="mt-4 text-sm text-red-600">
                      {errorMsg}
                    </p>
                  )}
                </div>
              </div>

              {/* elemento de áudio (invisível) */}
              <audio ref={audioRef} src={STREAM_URL} preload="none" />
            </div>

            {/* Observação sobre autoplay */}
            <p className="text-xs text-gray-500 text-center mt-4">
              Dica: alguns navegadores bloqueiam autoplay. Toque no botão Play para iniciar.
            </p>
          </div>
        </section>
      </main>

      <footer className="bg-purple-600 text-white py-6 text-center text-sm">
        © {new Date().getFullYear()} Muleka FM — Grupo MLK.
      </footer>

      {/* CSS das barras do "equalizer" */}
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
