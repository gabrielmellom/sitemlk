'use client';

import SafeImage from '@/components/SafeImage';

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

interface BannersSectionProps {
  banners: Banner[];
  loading?: boolean;
}

export default function BannersSection({ banners, loading = false }: BannersSectionProps) {
  
  const handleBannerClick = (banner: Banner) => {
    if (banner.link) {
      const url = banner.link.startsWith('http') ? banner.link : `https://${banner.link}`;
      window.open(url, '_blank');
    }
  };

  // Componente para renderizar imagem responsiva
  const ResponsiveImage = ({ banner, className }: { banner: Banner; className?: string }) => {
    if (banner.imagemMobile) {
      // Se tem imagem mobile, mostra ambas com display condicional
      return (
        <>
          {/* Imagem Desktop - esconde em mobile */}
          <div className="hidden md:block w-full h-full">
            <SafeImage
              src={banner.imagem}
              alt={banner.titulo}
              className={className}
            />
          </div>
          {/* Imagem Mobile - esconde em desktop */}
          <div className="block md:hidden w-full h-full">
            <SafeImage
              src={banner.imagemMobile}
              alt={banner.titulo}
              className={className}
            />
          </div>
        </>
      );
    } else {
      // Se não tem imagem mobile, usa apenas a desktop em todos os tamanhos
      return (
        <SafeImage
          src={banner.imagem}
          alt={banner.titulo}
          className={className}
        />
      );
    }
  };

  // Filtra e organiza os banners
  const bannersAtivos = banners.filter(b => b.ativo).sort((a, b) => a.ordem - b.ordem);
  const bannerGrande = bannersAtivos.find(b => b.tamanho === 'grande');
  const bannersPequenos = bannersAtivos.filter(b => b.tamanho === 'pequeno').slice(0, 4);

  // Loading state
  if (loading) {
    return (
      <section className="py-8 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
            {/* Banner Grande Loading */}
            <div className="lg:col-span-3 bg-gray-200 rounded-2xl h-[300px] animate-pulse"></div>
            
            {/* Banners Pequenos Loading */}
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-200 rounded-xl aspect-square animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Se não houver banners configurados
  if (bannersAtivos.length === 0) {
    return null;
  }

  return (
    <section className="py-12 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          Nossos Parceiros
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
          {/* Banner Grande - Ocupa 7 colunas */}
          <div className="lg:col-span-7">
            {bannerGrande ? (
              <div
                onClick={() => handleBannerClick(bannerGrande)}
                className="group relative bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 h-full min-h-[350px] lg:min-h-[450px]"
              >
                <div className="relative w-full h-full">
                  <ResponsiveImage
                    banner={bannerGrande}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Overlay com hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300"></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="text-white text-center bg-black/50 backdrop-blur-sm px-8 py-4 rounded-2xl">
                      <svg className="w-16 h-16 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      <span className="text-xl font-bold">Visitar Site</span>
                    </div>
                  </div>

                  {/* Badge Patrocinador */}
                  <div className="absolute top-4 right-4">
                    <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm px-4 py-2 rounded-full font-bold shadow-xl">
                      ⭐ Patrocinador Principal
                    </span>
                  </div>

                  {/* Título e info no bottom */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/80 to-transparent p-6">
                    <h3 className="text-white text-2xl lg:text-3xl font-bold mb-1">{bannerGrande.titulo}</h3>
                    <p className="text-gray-200 text-sm">Clique para conhecer</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-100 rounded-2xl h-full min-h-[350px] lg:min-h-[450px] flex items-center justify-center border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <div className="text-6xl mb-3">📢</div>
                  <p className="text-gray-400 text-lg">Espaço para banner principal</p>
                </div>
              </div>
            )}
          </div>

          {/* Banners Pequenos - Ocupa 5 colunas, Grid 2x2 */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-4 auto-rows-fr">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="w-full">
                {bannersPequenos[index] ? (
                  <div
                    onClick={() => handleBannerClick(bannersPequenos[index])}
                    className="group relative bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-2xl transition-all duration-300 h-full min-h-[170px]"
                  >
                    <div className="relative w-full h-full">
                      <ResponsiveImage
                        banner={bannersPequenos[index]}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      
                      {/* Overlay permanente sutil */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {/* Overlay com hover */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="text-white text-center">
                          <svg className="w-10 h-10 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          <span className="text-sm font-bold">Visitar</span>
                        </div>
                      </div>

                      {/* Badge */}
                      <div className="absolute top-2 right-2">
                        <span className="bg-purple-600 text-white text-xs px-2.5 py-1 rounded-full font-bold shadow-lg">
                          Parceiro
                        </span>
                      </div>

                      {/* Título - sempre visível */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/90 to-transparent p-3">
                        <h3 className="text-white text-base font-bold leading-tight line-clamp-2">
                          {bannersPequenos[index].titulo}
                        </h3>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-xl h-full min-h-[170px] flex items-center justify-center border-2 border-dashed border-gray-300">
                    <div className="text-center">
                      <div className="text-3xl mb-1">📢</div>
                      <p className="text-gray-400 text-xs">Banner {index + 1}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call to action para anunciantes */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-purple-50 via-orange-50 to-purple-50 rounded-2xl p-6 border-2 border-purple-200 max-w-2xl mx-auto shadow-lg">
            <div className="flex items-center justify-center mb-3">
              <span className="text-4xl mr-3">🤝</span>
              <h3 className="text-2xl font-bold text-gray-800">
                Seja nosso parceiro!
              </h3>
            </div>
            <p className="text-gray-700 text-base mb-4">
              Anuncie nas páginas da Massa FM e Muleka FM e alcance milhares de ouvintes todos os dias.
            </p>
            <a href="https://wa.me/4484180021" target="_blank" rel="noopener noreferrer">
              <button className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-white font-bold px-8 py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                💬 Fale Conosco no WhatsApp
              </button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

