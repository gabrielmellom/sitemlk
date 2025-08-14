'use client';

import Link from 'next/link';
import { MessageCircle, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#FF9400] text-white w-full text-[0.75rem]">
      {/* Seção principal */}
      <div className="w-full px-4 py-6">
        <div
          className="
            max-w-6xl mx-auto 
            grid gap-6 
            grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
            justify-items-center lg:justify-items-start
          "
        >
          {/* Logo e descrição */}
          <div className="w-full max-w-xs text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-3">
              <div className="bg-white rounded-full flex items-center justify-center w-6 h-6">
                <MessageCircle className="text-orange-500 w-4 h-4" />
              </div>
              <span className="font-bold text-[1rem]">Portal Notícias</span>
            </div>

            <p className="text-orange-100 leading-relaxed mb-3">
              Seu portal de notícias confiável, mantendo você informado sobre os acontecimentos mais importantes do dia.
            </p>
          </div>

          {/* Links rápidos */}
          <div className="w-full max-w-xs text-center lg:text-left">
            <h3 className="font-bold mb-2">Links Rápidos</h3>
            <ul className="flex flex-col gap-1">
              {[
                { href: '/', label: 'Início' },
                { href: '/sobre', label: 'Sobre' },
                { href: '/noticias', label: 'Notícias' },
                { href: '/mulekafm', label: 'Muleka fm' },
                { href: '/cianorte', label: 'Massa fm Cianorte' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-orange-100 hover:text-white transition-colors duration-300 inline-flex items-center gap-2"
                  >
                    <span className="bg-white rounded-full w-1 h-1 inline-block" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contato */}
          <div className="w-full max-w-xs text-center lg:text-left">
            <h3 className="font-bold mb-2">Contato</h3>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center lg:justify-start gap-2 text-orange-100">
                <div className="bg-white/20 rounded-full flex items-center justify-center w-4 h-4">
                  <Mail className="w-2 h-2 text-white" />
                </div>
                <span className="break-all">agencia@mlk.digital</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 text-orange-100">
                <div className="bg-white/20 rounded-full flex items-center justify-center w-4 h-4">
                  <Phone className="w-2 h-2 text-white" />
                </div>
                <span>(44) 98418-0021</span>
              </div>
              <div className="flex items-start justify-center lg:justify-start gap-2 text-orange-100">
                <div className="bg-white/20 rounded-full flex items-center justify-center w-4 h-4 mt-[2px]">
                  <MapPin className="w-2 h-2 text-white" />
                </div>
                <span className="leading-snug">
                  paraíso do norte, paraná
                  <br />
                  Brasil
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Linha separadora */}
      <div className="border-t border-orange-300/30" />

      {/* Copyright */}
      <div className="w-full px-4 py-2">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-2 text-center">
          <p className="text-orange-100">
            © 2025 Portal Notícias. Todos os direitos reservados.
          </p>
          <div className="flex gap-3">
            <Link href="/politica-privacidade" className="text-orange-100 hover:text-white transition-colors">
              Política de Privacidade
            </Link>
            <Link href="/termos-uso" className="text-orange-100 hover:text-white transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
