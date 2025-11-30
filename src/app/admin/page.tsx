'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, logout } from '@/lib/firebase';
import { FileText, Image as ImageIcon, LogOut, ExternalLink, Calendar, Users, Grid } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

// Importar os componentes
import NewsAdmin from '../../components/NewsAdmin';
import CarouselAdmin from '../../components/CarouselAdmin';
import AdsAdmin from '../../components/AdsAdmin';
import EventsAdmin from '../../components/EventsAdmin';
import TeamAdmin from '../../components/TeamAdmin';
import BannersAdmin from '../../components/BannersAdmin';

export default function Admin() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'news' | 'carousel' | 'ads' | 'events' | 'team' | 'banners'>('news');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/login');
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [router]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logout realizado com sucesso!');
      router.push('/login');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando painel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />

      {/* Header */}
      <header className="bg-blue-900 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Painel Admin - Grupo MLK</h1>
            <p className="text-blue-200 text-sm">Bem-vindo, {user?.email}</p>
          </div>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 hover:bg-blue-800 px-4 py-2 rounded transition-colors duration-200"
          >
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setActiveTab('news')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === 'news' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
            }`}
          >
            <FileText size={20} />
            Notícias
          </button>
          
          <button
            onClick={() => setActiveTab('carousel')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === 'carousel' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
            }`}
          >
            <ImageIcon size={20} />
            Carrossel
          </button>
          
          <button
            onClick={() => setActiveTab('ads')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === 'ads' 
                ? 'bg-orange-600 text-white shadow-md' 
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
            }`}
          >
            <ExternalLink size={20} />
            Anúncios
          </button>
          
          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === 'events' 
                ? 'bg-purple-600 text-white shadow-md' 
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
            }`}
          >
            <Calendar size={20} />
            Shows & Eventos
          </button>
          
          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === 'team' 
                ? 'bg-green-600 text-white shadow-md' 
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
            }`}
          >
            <Users size={20} />
            Equipe
          </button>
          
          <button
            onClick={() => setActiveTab('banners')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              activeTab === 'banners' 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
            }`}
          >
            <Grid size={20} />
            Banners
          </button>
        </div>

        {/* Indicador da seção ativa */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
            <h2 className="text-lg font-semibold text-gray-800">
              {activeTab === 'news' && 'Gerenciar Notícias'}
              {activeTab === 'carousel' && 'Gerenciar Carrossel de Imagens'}
              {activeTab === 'ads' && 'Gerenciar Anúncios'}
              {activeTab === 'events' && 'Gerenciar Shows & Eventos'}
              {activeTab === 'team' && 'Gerenciar Equipe'}
              {activeTab === 'banners' && 'Gerenciar Banners da Página'}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {activeTab === 'news' && 'Crie, edite e gerencie as notícias do site'}
              {activeTab === 'carousel' && 'Adicione e remova imagens do carrossel principal'}
              {activeTab === 'ads' && 'Configure os anúncios exibidos no site'}
              {activeTab === 'events' && 'Gerencie shows, eventos e apresentações'}
              {activeTab === 'team' && 'Adicione e edite membros da equipe'}
              {activeTab === 'banners' && 'Configure os banners promocionais da página'}
            </p>
          </div>
        </div>

        {/* Conteúdo das Tabs */}
        <div className="transition-all duration-300">
          {activeTab === 'news' && <NewsAdmin user={user} />}
          {activeTab === 'carousel' && <CarouselAdmin />}
          {activeTab === 'ads' && <AdsAdmin />}
          {activeTab === 'events' && <EventsAdmin />}
          {activeTab === 'team' && <TeamAdmin />}
          {activeTab === 'banners' && <BannersAdmin />}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} Muleka FM - Painel Administrativo</p>
            <p>Versão 1.0 - Grupo MLK</p>
          </div>
        </div>
      </footer>
    </div>
  );
}