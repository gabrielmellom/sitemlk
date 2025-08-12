// src/app/sobre/page.tsx
'use client';

import Header from '@/components/Header';

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header do portal */}
      <Header />

      {/* Conteúdo principal */}
      <main className="flex-1 container mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-purple-700 mb-8">
          Sobre Nós
        </h1>

        <div className="bg-white shadow-lg rounded-lg p-8 space-y-6">
          <p className="text-lg leading-relaxed text-gray-700">
            A <strong>MLK Comunicação</strong> é um grupo inovador que une informação, entretenimento,
            marketing e conectividade. Somos responsáveis por marcas fortes e reconhecidas
            como a <strong>Rádio Massa FM 96.9</strong>, a <strong>Rádio Muleka FM</strong>, a
            <strong> Simplay TV</strong>, a <strong>Leka da Sorte</strong> e a <strong>MLK Agência</strong>,
            especializada em marketing, tráfego pago, desenvolvimento de sites, aplicativos
            e soluções criativas.
          </p>

          <p className="text-lg leading-relaxed text-gray-700">
            Nosso propósito é conectar pessoas e marcas com qualidade, credibilidade e inovação,
            oferecendo conteúdo relevante, ações promocionais estratégicas e experiências que
            fortalecem a relação com o público.
          </p>

          <p className="text-lg font-semibold text-gray-800">
            Somos comunicação. Somos inovação. Somos o Grupo MLK.
          </p>
        </div>
      </main>

      {/* Rodapé simples */}
      <footer className="bg-purple-600 text-white py-6 text-center text-sm">
        © {new Date().getFullYear()} Grupo MLK - Todos os direitos reservados.
      </footer>
    </div>
  );
}
