'use client';

import SafeImage from '@/components/SafeImage';

// Interface atualizada para corresponder aos campos do banco
interface AdItem {
  id: string;
  imagem1: string; // Campo imagem do banco
  link: string;    // Campo link do banco
  titulo: string;  // Campo titulo do banco
  ativo?: boolean;
  ordem?: number;
}

interface AdsSectionProps {
  ads: AdItem[];
  title?: string;
  className?: string;
  loading?: boolean;
}

export default function AdsSection({ 
  ads, 
  title = "Nossos Parceiros",
  className = "",
  loading = false
}: AdsSectionProps) {
  
  const handleAdClick = (ad: AdItem) => {
    if (ad.link) {
      // Adiciona https:// se não tiver protocolo
      const url = ad.link.startsWith('http') ? ad.link : `https://${ad.link}`;
      window.open(url, '_blank');
    }
  };

  // Loading state
  if (loading) {
    return (
      <section className={`py-8 ${className}`}>
        <div className="mx-auto px-6" style={{ maxWidth: '70rem' }}>
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            {title}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-square bg-gray-200 animate-pulse"></div>
                <div className="p-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Se não houver anúncios
  if (!ads || ads.length === 0) {
    return (
      <section className={`py-8 ${className}`}>
        <div className="mx-auto px-6" style={{ maxWidth: '70rem' }}>
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            {title}
          </h2>
          
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">Nenhum anúncio disponível no momento.</p>
            
            {/* Call to action quando não há anúncios */}
            <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-lg p-6 border border-orange-200 max-w-lg mx-auto">
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                Seja nosso primeiro parceiro!
              </h3>
              <p className="text-gray-600 mb-4">
                Anuncie na Muleka FM e alcance milhares de ouvintes.
              </p>
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                Fale Conosco
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-8 ${className}`}>
      <div className="mx-auto px-6" style={{ maxWidth: '70rem' }}>
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {title}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ads.map((ad) => (
            <div
              key={ad.id}
              className={`group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 ${
                ad.link ? 'cursor-pointer' : ''
              }`}
              onClick={() => handleAdClick(ad)}
            >
              {/* Container quadrado */}
              <div className="aspect-square relative overflow-hidden">
                <SafeImage
                  src={ad.imagem1} // Usando o campo imagem1 do banco
                  alt={ad.titulo}  // Usando o campo titulo do banco
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Overlay com hover */}
                {ad.link && (
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-white text-center">
                      <svg className="w-8 h-8 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span className="text-sm font-medium">Visitar Site</span>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Título */}
              <div className="p-3">
                <h3 className="text-base font-semibold text-gray-800 text-center group-hover:text-orange-600 transition-colors">
                  {ad.titulo} {/* Usando o campo titulo do banco */}
                </h3>
              </div>
              
              {/* Badge "Anúncio" */}
              <div className="absolute top-1 right-1">
                <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                  Anúncio
                </span>
              </div>
            </div>
          ))}
        </div>
        <br />
        <br />
         <br />
          <br />
        {/* Call to action para anunciantes */}
        <div className="mt-6 text-center">
          <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-lg p-4 border border-orange-200 max-w-lg mx-auto">
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              Quer anunciar com a gente?
            </h3>
            <p className="text-gray-600 text-sm mb-3">
              Alcance milhares de ouvintes todos os dias!
            </p>
            <a href="https://wa.me/4484180021">
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors text-sm">
              Fale Conosco
            </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}