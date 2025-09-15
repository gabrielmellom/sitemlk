"use client"
import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase'; // Ajuste o caminho conforme sua estrutura
import Header from '@/components/Header';

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

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

        {/* Seção Nossa Equipe */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Nossa equipe</h2>
          <div className="w-16 h-1 bg-purple-600 mb-12"></div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
          ) : (
            /* Grid da equipe */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {colaboradores.map((colaborador: Colaborador) => (
                <div
                  key={colaborador.id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
                >
                  {/* Foto como banner */}
                  <div className="relative h-64 w-full overflow-hidden">
                    {colaborador.imagem ? (
                      <img
                        src={colaborador.imagem}
                        alt={colaborador.nome || 'Colaborador'}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-600 text-2xl font-bold">
                        {getInitials(colaborador.nome)}
                      </div>
                    )}
                  </div>

                  {/* Texto abaixo */}
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {colaborador.nome || 'Nome não informado'}
                    </h3>
                    <p className="text-gray-600">
                      {colaborador.cargo || 'Cargo não informado'}
                    </p>
                    {colaborador.drt && (
                      <p className="text-sm text-gray-500">{colaborador.drt}</p>
                    )}
                    {colaborador.informacaoAdicional && (
                      <p className="text-sm text-gray-500">{colaborador.informacaoAdicional}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>

          )}

          {!loading && colaboradores.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">Nenhum colaborador encontrado.</p>
            </div>
          )}
        </div>
      </main>

      {/* Rodapé simples */}
      <footer className="bg-purple-600 text-white py-6 text-center text-sm">
        © {new Date().getFullYear()} Grupo MLK - Todos os direitos reservados.
      </footer>
    </div>
  );
};

export default SobrePage;