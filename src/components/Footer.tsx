'use client';

import Link from 'next/link';
import { Mail, Phone, MapPin, Radio, Megaphone, Instagram, Facebook, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#72227f] to-[#8e2a97] text-white w-full">
      {/* Seção principal */}
      <div className="w-full px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Grid principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            
            {/* Sobre o Grupo MLK */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-[#f6a719] p-2 rounded-xl shadow-lg">
                  <img src="/logo.png" width={40} height={40} alt="Grupo MLK" className="rounded-lg" />
                </div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-[#f6a719] to-[#ffb84d] bg-clip-text text-transparent">
                  Grupo MLK
                </h3>
              </div>
              <p className="text-purple-100 leading-relaxed text-sm">
                Comunicação, entretenimento e inovação. Conectando pessoas e marcas com qualidade e credibilidade.
              </p>
              
              {/* Redes Sociais */}
              <div className="flex gap-3 pt-2">
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-[#f6a719] p-2 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <Instagram size={20} />
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-[#f6a719] p-2 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <Facebook size={20} />
                </a>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-[#f6a719] p-2 rounded-full transition-all duration-300 hover:scale-110"
                >
                  <Youtube size={20} />
                </a>
              </div>
            </div>

            {/* Nossas Rádios */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                <Radio className="text-[#f6a719]" size={20} />
                Nossas Rádios
              </h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/cianorte"
                    className="group flex items-center gap-2 text-purple-100 hover:text-[#f6a719] transition-all duration-300"
                  >
                    <span className="w-1.5 h-1.5 bg-[#f6a719] rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                    <span className="text-sm group-hover:translate-x-1 transition-transform">Massa FM Cianorte 96.9</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/mulekafm"
                    className="group flex items-center gap-2 text-purple-100 hover:text-[#f6a719] transition-all duration-300"
                  >
                    <span className="w-1.5 h-1.5 bg-[#f6a719] rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                    <span className="text-sm group-hover:translate-x-1 transition-transform">Massa FM Paranavaí 88.7</span>
                  </Link>
                </li>
                <li>
                  <a
                    href="https://lekadasorte.com.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-2 text-purple-100 hover:text-[#f6a719] transition-all duration-300"
                  >
                    <span className="w-1.5 h-1.5 bg-[#f6a719] rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                    <span className="text-sm group-hover:translate-x-1 transition-transform">Leka da Sorte</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Links Rápidos */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                <Megaphone className="text-[#f6a719]" size={20} />
                Links Rápidos
              </h3>
              <ul className="space-y-3">
                {[
                  { href: '/', label: 'Início' },
                  { href: '/sobre', label: 'Sobre Nós' },
                  { href: '/#noticias', label: 'Notícias' },
                  { href: '/login', label: 'Área Admin' },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-purple-100 hover:text-[#f6a719] transition-all duration-300"
                    >
                      <span className="w-1.5 h-1.5 bg-[#f6a719] rounded-full group-hover:w-2 group-hover:h-2 transition-all"></span>
                      <span className="text-sm group-hover:translate-x-1 transition-transform">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contato */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-4">
                <Mail className="text-[#f6a719]" size={20} />
                Contato
              </h3>
              <div className="space-y-3">
                <a 
                  href="mailto:agencia@mlk.digital"
                  className="flex items-start gap-3 text-purple-100 hover:text-[#f6a719] transition-colors group"
                >
                  <div className="bg-white/10 rounded-lg p-2 group-hover:bg-[#f6a719] transition-all">
                    <Mail size={16} />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Email</p>
                    <p className="text-xs opacity-90 break-all">agencia@mlk.digital</p>
                  </div>
                </a>
                
                <a 
                  href="tel:+5544984180021"
                  className="flex items-start gap-3 text-purple-100 hover:text-[#f6a719] transition-colors group"
                >
                  <div className="bg-white/10 rounded-lg p-2 group-hover:bg-[#f6a719] transition-all">
                    <Phone size={16} />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Telefone</p>
                    <p className="text-xs opacity-90">(44) 98418-0021</p>
                  </div>
                </a>
                
                <div className="flex items-start gap-3 text-purple-100">
                  <div className="bg-white/10 rounded-lg p-2">
                    <MapPin size={16} />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium">Localização</p>
                    <p className="text-xs opacity-90 leading-relaxed">
                      Paraíso do Norte, Paraná<br />
                      Brasil
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Linha separadora com gradiente */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/30 to-transparent my-8"></div>

          {/* Marcas do Grupo */}
          <div className="text-center mb-8">
            <p className="text-purple-200 text-sm mb-3 font-medium">Marcas do Grupo MLK</p>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <span className="bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-all cursor-default">
                Massa FM Cianorte
              </span>
              <span className="bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-all cursor-default">
                Massa FM Paranavaí
              </span>
              <span className="bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-all cursor-default">
                Simplay TV
              </span>
              <span className="bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-all cursor-default">
                Leka da Sorte
              </span>
              <span className="bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-all cursor-default">
                MLK Agência
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright - Seção inferior */}
      <div className="bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-purple-200 text-sm text-center md:text-left">
              © {new Date().getFullYear()} Grupo MLK - Comunicação e Entretenimento. Todos os direitos reservados.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <Link 
                href="/politica-privacidade" 
                className="text-purple-200 hover:text-[#f6a719] transition-colors"
              >
                Política de Privacidade
              </Link>
              <span className="text-purple-400">•</span>
              <Link 
                href="/termos-uso" 
                className="text-purple-200 hover:text-[#f6a719] transition-colors"
              >
                Termos de Uso
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
