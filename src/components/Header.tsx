"use client";

import Link from "next/link";
import { Menu, X, MessageCircle, Phone, Mail } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#72227f] to-[#8e2a97] text-white shadow-xl backdrop-blur-sm transition-all duration-300 ${
      scrolled ? 'bg-opacity-98 shadow-2xl py-1' : 'bg-opacity-95 py-0'
    }`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          
          {/* Logo e Título */}
          <div className="flex items-center space-x-4">
            <div className="bg-[#f6a719] p-2 rounded-xl shadow-lg">
              <img src="/logo.png" width={50} height={50} alt="Grupo MLK" className="rounded-lg" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-[#f6a719] to-[#ffb84d] bg-clip-text text-transparent">
                Grupo MLK
              </h1>
              <p className="text-sm text-gray-200 mt-1">Comunicação e Entretenimento</p>
            </div>
          </div>

          {/* Menu Desktop */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link
              href="/"
              className="relative group py-2 px-4 font-medium text-lg transition-all duration-300 hover:text-[#f6a719]"
            >
              Início
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#f6a719] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/sobre"
              className="relative group py-2 px-4 font-medium text-lg transition-all duration-300 hover:text-[#f6a719]"
            >
              Sobre
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#f6a719] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/mulekafm"
              className="relative group py-2 px-4 font-medium text-lg transition-all duration-300 hover:text-[#f6a719]"
            >
              Massa FM Paranavaí
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#f6a719] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="/cianorte"
              className="relative group py-2 px-4 font-medium text-lg transition-all duration-300 hover:text-[#f6a719]"
            >
              Massa FM Cianorte
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#f6a719] transition-all duration-300 group-hover:w-full"></span>
            </Link>
            <Link
              href="https://lekadasorte.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#f6a719] hover:bg-[#e8941a] text-white py-2 px-6 rounded-full font-medium text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Leka da Sorte
            </Link>
          </nav>

          {/* Ícones de Contato Desktop */}
          <div className="hidden md:flex items-center space-x-3">
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110">
              <Phone size={20} />
            </button>
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110">
              <Mail size={20} />
            </button>
            <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110">
              <MessageCircle size={20} />
            </button>
          </div>

          {/* Botão Menu Mobile */}
          <button
            className="lg:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Menu Mobile */}
        {menuOpen && (
          <div className="lg:hidden border-t border-white/20 mt-3 pt-4 pb-4">
            <nav className="flex flex-col space-y-2">
              <Link
                href="/"
                className="flex items-center py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                <span className="w-1 h-6 bg-[#f6a719] rounded-full mr-3"></span>
                Início
              </Link>
              <Link
                href="/sobre"
                className="flex items-center py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                <span className="w-1 h-6 bg-[#f6a719] rounded-full mr-3"></span>
                Sobre
              </Link>
              <Link
                href="/mulekafm"
                className="flex items-center py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                <span className="w-1 h-6 bg-[#f6a719] rounded-full mr-3"></span>
                Massa FM Paranavaí
              </Link>
              <Link
                href="/cianorte"
                className="flex items-center py-3 px-4 rounded-lg hover:bg-white/10 transition-all duration-300 font-medium"
                onClick={() => setMenuOpen(false)}
              >
                <span className="w-1 h-6 bg-[#f6a719] rounded-full mr-3"></span>
                Massa FM Cianorte
              </Link>
              <Link
                href="https://lekadasorte.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center py-3 px-4 rounded-lg bg-[#f6a719] hover:bg-[#e8941a] transition-all duration-300 font-medium mt-2"
                onClick={() => setMenuOpen(false)}
              >
                <span className="w-1 h-6 bg-white rounded-full mr-3"></span>
                Leka da Sorte
              </Link>
            </nav>
            
            {/* Ícones Mobile */}
            <div className="flex justify-center space-x-4 mt-4 pt-4 border-t border-white/20">
              <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300">
                <Phone size={20} />
              </button>
              <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300">
                <Mail size={20} />
              </button>
              <button className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300">
                <MessageCircle size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}