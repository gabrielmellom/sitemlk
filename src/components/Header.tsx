'use client';

import Link from 'next/link';
import { Menu, X, MessageCircle } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="text-white shadow-lg">
      {/* Seção Laranja - Logo e Título */}
      <div className="bg-[#FF9400]">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center space-x-3">
              <div className="">
                <img src="/logo.png" width={40} alt="" />
              </div>
              <span className="text-3xl font-bold">Portal de notíciais MLK</span>
            </div>
          </div>
        </div>
      </div>

      {/* Seção Roxa - Menu de Navegação */}
      <div className="bg-purple-600">
        <div className="container mx-auto px-4">
          {/* Menu Desktop */}
          <div className="hidden md:block">
            <nav className="flex items-center justify-center space-x-12 py-4">
              <Link
                href="/"
                className="hover:text-orange-200 transition-colors duration-200 font-medium text-lg border-b-2 border-orange-400 pb-1"
              >
                Início
              </Link>
              <Link
                href="/sobre"
                className="hover:text-orange-200 transition-colors duration-200 font-medium text-lg hover:border-b-2 hover:border-orange-400 pb-1"
              >
                Sobre
              </Link>
              <Link
                href="/mulekafm"
                className="hover:text-orange-200 transition-colors duration-200 font-medium text-lg hover:border-b-2 hover:border-orange-400 pb-1"
              >
                Muleka FM
              </Link>
              <Link
                href="/cianorte"
                className="hover:text-orange-200 transition-colors duration-200 font-medium text-lg hover:border-b-2 hover:border-orange-400 pb-1"
              >
                Massa FM Cianorte
              </Link>
              <Link
                href="https://lekadasorte.com.br"
                className="hover:text-orange-200 transition-colors duration-200 font-medium text-lg hover:border-b-2 hover:border-orange-400 pb-1"
              >
                Leka da Sorte
              </Link>
            </nav>
          </div>

          {/* Botão Menu Mobile */}
          <div className="md:hidden flex justify-center py-4">
            <button
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Menu Mobile */}
          {menuOpen && (
            <div className="md:hidden pb-4">
              <nav className="flex flex-col items-center space-y-3 border-t border-white/20 pt-4">
                <Link
                  href="/"
                  className="py-2 px-4 hover:bg-white/20 rounded-lg transition-colors font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Início
                </Link>
                <Link
                  href="/sobre"
                  className="py-2 px-4 hover:bg-white/20 rounded-lg transition-colors font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Sobre
                </Link>
                <Link
                  href="/noticias"
                  className="py-2 px-4 hover:bg-white/20 rounded-lg transition-colors font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Notícias
                </Link>
                <Link
                  href="/aniversariante"
                  className="py-2 px-4 hover:bg-white/20 rounded-lg transition-colors font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Aniversariante
                </Link>
                <Link
                  href="/videos"
                  className="py-2 px-4 hover:bg-white/20 rounded-lg transition-colors font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Vídeos
                </Link>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}