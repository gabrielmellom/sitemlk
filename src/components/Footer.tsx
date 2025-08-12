'use client';

import Link from 'next/link';
import { MessageCircle, Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-orange-500 text-white w-full" style={{ fontSize: '0.75rem' }}>
      {/* Seção principal */}
      <div className="w-full px-4 py-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Logo e descrição */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-3" style={{ gap: '0.5rem' }}>
              <div className="bg-white rounded-full flex items-center justify-center" style={{ width: '1.5rem', height: '1.5rem' }}>
                <MessageCircle style={{ width: '1rem', height: '1rem' }} className="text-orange-500" />
              </div>
              <span className="font-bold" style={{ fontSize: '1rem' }}>Portal Notícias</span>
            </div>
            <p className="text-orange-100 leading-relaxed mb-3 max-w-xs" style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
              Seu portal de notícias confiável, mantendo você informado sobre os acontecimentos mais importantes do dia.
            </p>
            
            {/* Redes sociais */}
            <div className="flex" style={{ gap: '0.5rem' }}>
              <a href="#" className="bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ width: '1.5rem', height: '1.5rem' }}>
                <Facebook style={{ width: '0.75rem', height: '0.75rem' }} />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ width: '1.5rem', height: '1.5rem' }}>
                <Instagram style={{ width: '0.75rem', height: '0.75rem' }} />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ width: '1.5rem', height: '1.5rem' }}>
                <Twitter style={{ width: '0.75rem', height: '0.75rem' }} />
              </a>
              <a href="#" className="bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110" style={{ width: '1.5rem', height: '1.5rem' }}>
                <Youtube style={{ width: '0.75rem', height: '0.75rem' }} />
              </a>
            </div>
          </div>

          {/* Links rápidos */}
          <div>
            <h3 className="font-bold mb-2 text-white" style={{ fontSize: '0.875rem' }}>Links Rápidos</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <li>
                <Link href="/" className="text-orange-100 hover:text-white transition-colors duration-300 flex items-center group" style={{ fontSize: '0.75rem', gap: '0.5rem' }}>
                  <span className="bg-white rounded-full group-hover:scale-125 transition-transform" style={{ width: '0.25rem', height: '0.25rem' }}></span>
                  Início
                </Link>
              </li>
              <li>
                <Link href="/sobre" className="text-orange-100 hover:text-white transition-colors duration-300 flex items-center group" style={{ fontSize: '0.75rem', gap: '0.5rem' }}>
                  <span className="bg-white rounded-full group-hover:scale-125 transition-transform" style={{ width: '0.25rem', height: '0.25rem' }}></span>
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/noticias" className="text-orange-100 hover:text-white transition-colors duration-300 flex items-center group" style={{ fontSize: '0.75rem', gap: '0.5rem' }}>
                  <span className="bg-white rounded-full group-hover:scale-125 transition-transform" style={{ width: '0.25rem', height: '0.25rem' }}></span>
                  Notícias
                </Link>
              </li>
              <li>
                <Link href="/aniversariante" className="text-orange-100 hover:text-white transition-colors duration-300 flex items-center group" style={{ fontSize: '0.75rem', gap: '0.5rem' }}>
                  <span className="bg-white rounded-full group-hover:scale-125 transition-transform" style={{ width: '0.25rem', height: '0.25rem' }}></span>
                  Aniversariante
                </Link>
              </li>
              <li>
                <Link href="/videos" className="text-orange-100 hover:text-white transition-colors duration-300 flex items-center group" style={{ fontSize: '0.75rem', gap: '0.5rem' }}>
                  <span className="bg-white rounded-full group-hover:scale-125 transition-transform" style={{ width: '0.25rem', height: '0.25rem' }}></span>
                  Vídeos
                </Link>
              </li>
            </ul>
          </div>

          {/* Categorias */}
          <div>
            <h3 className="font-bold mb-2 text-white" style={{ fontSize: '0.875rem' }}>Categorias</h3>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <li>
                <Link href="/categoria/politica" className="text-orange-100 hover:text-white transition-colors duration-300 flex items-center group" style={{ fontSize: '0.75rem', gap: '0.5rem' }}>
                  <span className="bg-white rounded-full group-hover:scale-125 transition-transform" style={{ width: '0.25rem', height: '0.25rem' }}></span>
                  Política
                </Link>
              </li>
              <li>
                <Link href="/categoria/economia" className="text-orange-100 hover:text-white transition-colors duration-300 flex items-center group" style={{ fontSize: '0.75rem', gap: '0.5rem' }}>
                  <span className="bg-white rounded-full group-hover:scale-125 transition-transform" style={{ width: '0.25rem', height: '0.25rem' }}></span>
                  Economia
                </Link>
              </li>
              <li>
                <Link href="/categoria/esportes" className="text-orange-100 hover:text-white transition-colors duration-300 flex items-center group" style={{ fontSize: '0.75rem', gap: '0.5rem' }}>
                  <span className="bg-white rounded-full group-hover:scale-125 transition-transform" style={{ width: '0.25rem', height: '0.25rem' }}></span>
                  Esportes
                </Link>
              </li>
              <li>
                <Link href="/categoria/cultura" className="text-orange-100 hover:text-white transition-colors duration-300 flex items-center group" style={{ fontSize: '0.75rem', gap: '0.5rem' }}>
                  <span className="bg-white rounded-full group-hover:scale-125 transition-transform" style={{ width: '0.25rem', height: '0.25rem' }}></span>
                  Cultura
                </Link>
              </li>
              <li>
                <Link href="/categoria/tecnologia" className="text-orange-100 hover:text-white transition-colors duration-300 flex items-center group" style={{ fontSize: '0.75rem', gap: '0.5rem' }}>
                  <span className="bg-white rounded-full group-hover:scale-125 transition-transform" style={{ width: '0.25rem', height: '0.25rem' }}></span>
                  Tecnologia
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h3 className="font-bold mb-2 text-white" style={{ fontSize: '0.875rem' }}>Contato</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="flex items-center text-orange-100" style={{ gap: '0.5rem' }}>
                <div className="bg-white/20 rounded-full flex items-center justify-center flex-shrink-0" style={{ width: '1rem', height: '1rem' }}>
                  <Mail style={{ width: '0.5rem', height: '0.5rem' }} className="text-white" />
                </div>
                <span style={{ fontSize: '0.75rem', wordBreak: 'break-all' }}>agencia@mlk.digital</span>
              </div>
              <div className="flex items-center text-orange-100" style={{ gap: '0.5rem' }}>
                <div className="bg-white/20 rounded-full flex items-center justify-center flex-shrink-0" style={{ width: '1rem', height: '1rem' }}>
                  <Phone style={{ width: '0.5rem', height: '0.5rem' }} className="text-white" />
                </div>
                <span style={{ fontSize: '0.75rem' }}>(44) 98418-0021</span>
              </div>
              <div className="flex items-start text-orange-100" style={{ gap: '0.5rem' }}>
                <div className="bg-white/20 rounded-full flex items-center justify-center flex-shrink-0" style={{ width: '1rem', height: '1rem', marginTop: '0.125rem' }}>
                  <MapPin style={{ width: '0.5rem', height: '0.5rem' }} className="text-white" />
                </div>
                <span style={{ fontSize: '0.75rem', lineHeight: '1.2' }}>
                  Biguaçu, Santa Catarina<br />
                  Brasil
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Linha separadora */}
      <div className="border-t border-orange-300/30"></div>

      {/* Copyright */}
      <div className="w-full px-4" style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center" style={{ gap: '0.25rem' }}>
          <p className="text-orange-100" style={{ fontSize: '0.75rem' }}>
            © 2025 Portal Notícias. Todos os direitos reservados.
          </p>
          <div className="flex" style={{ gap: '0.75rem', fontSize: '0.75rem' }}>
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