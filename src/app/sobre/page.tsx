"use client"
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Users } from 'lucide-react';

// Tipagem para os colaboradores
interface Colaborador {
  id: string;
  nome: string;
  cargo: string;
  imagem?: string;
  drt?: string;
  informacaoAdicional?: string;
}



const SobrePage: React.FC = () => {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Função para gerar iniciais do nome
  const getInitials = (nome: string): string => {
    if (!nome) return 'N/A';
    return nome.split(' ')
      .map((word: string) => word.charAt(0))
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  useEffect(() => {
    const fetchColaboradores = async (): Promise<void> => {
      try {
        const querySnapshot = await getDocs(collection(db, 'sobrenos'));
        const colaboradoresData: Colaborador[] = [];

        querySnapshot.forEach((doc) => {
          colaboradoresData.push({
            id: doc.id,
            ...doc.data()
          } as Colaborador);
        });

        setColaboradores(colaboradoresData);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar colaboradores:', error);
        setLoading(false);
      }
    };

    fetchColaboradores();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-purple-50 flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-6 py-16 mt-20">
        {/* Título Principal Centralizado */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-orange-500 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Sobre Nós
          </h1>
          <div className="w-32 h-1.5 bg-gradient-to-r from-orange-500 to-purple-600 mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Conheça a história e os valores que movem o Grupo MLK
          </p>
        </div>

        {/* Card Principal com Informações */}
        <div className="max-w-6xl mx-auto mb-16">
          <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
            {/* Banner superior com gradiente */}
            <div className="h-3 bg-gradient-to-r from-orange-500 via-purple-600 to-pink-600"></div>
            
            <div className="px-8 md:px-16 py-10 md:py-12">
              {/* Texto principal */}
              <div className="text-center space-y-6">
                <p className="text-lg md:text-xl leading-relaxed text-gray-700">
                  A <strong className="text-purple-700">MLK Comunicação</strong> é um grupo inovador que une informação, entretenimento,
                  marketing e conectividade. Somos responsáveis por marcas fortes e reconhecidas
                  como a <strong className="text-orange-600">Rádio Massa FM Cianorte 96.9</strong>, a <strong className="text-orange-600">Rádio Massa FM Paranavaí 88.7</strong>, a
                  <strong className="text-purple-700"> Simplay TV</strong>, a <strong className="text-pink-600">Leka da Sorte</strong> e a <strong className="text-purple-700">MLK Agência</strong>,
                  especializada em marketing, tráfego pago, desenvolvimento de sites, aplicativos
                  e soluções criativas.
                </p>

                <p className="text-lg md:text-xl leading-relaxed text-gray-700">
                  Nosso propósito é conectar pessoas e marcas com qualidade, credibilidade e inovação,
                  oferecendo conteúdo relevante, ações promocionais estratégicas e experiências que
                  fortalecem a relação com o público.
                </p>

                <div className="pt-4">
                  <p className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent">
                    Somos comunicação. Somos inovação. Somos o Grupo MLK.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção Nossa Equipe */}
        <div className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-orange-500 to-purple-600 bg-clip-text text-transparent mb-4">
              Nossa Equipe
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-orange-500 to-purple-600 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-600 text-lg">
              Conheça os profissionais que fazem a diferença
            </p>
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-purple-600 border-t-transparent mb-4"></div>
              <p className="text-gray-600 text-lg">Carregando equipe...</p>
            </div>
          ) : (
            /* Grid da equipe */
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap justify-center gap-8">
                {colaboradores.map((colaborador: Colaborador) => (
                  <div
                    key={colaborador.id}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-all duration-300 w-full max-w-sm"
                  >
                    {/* Foto como banner */}
                    <div className="relative h-72 w-full overflow-hidden">
                      {colaborador.imagem ? (
                        <img
                          src={colaborador.imagem}
                          alt={colaborador.nome || 'Colaborador'}
                          className="absolute inset-0 w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-300 to-purple-400 flex items-center justify-center text-white text-4xl font-bold">
                          {getInitials(colaborador.nome)}
                        </div>
                      )}
                      {/* Overlay gradiente */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Texto abaixo */}
                    <div className="p-6 text-center bg-gradient-to-br from-white to-purple-50">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">
                        {colaborador.nome || 'Nome não informado'}
                      </h3>
                      <p className="text-purple-600 font-semibold mb-2">
                        {colaborador.cargo || 'Cargo não informado'}
                      </p>
                      {colaborador.drt && (
                        <p className="text-sm text-gray-500 mb-1">{colaborador.drt}</p>
                      )}
                      {colaborador.informacaoAdicional && (
                        <p className="text-sm text-gray-500">{colaborador.informacaoAdicional}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && colaboradores.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl shadow-lg max-w-2xl mx-auto">
              <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-gray-400" size={40} />
              </div>
              <p className="text-gray-600 text-xl">Nenhum colaborador cadastrado no momento.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SobrePage;