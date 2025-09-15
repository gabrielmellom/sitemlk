'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import {
  auth,
  logout,
  // News
  getNews,
  createNews,
  updateNews,
  deleteNews,
  // Upload
  uploadImage,
  // Carousel
  getCarouselImages,
  addCarouselImage,
  deleteCarouselImage,
  // Ads
  getAds,
  addAd,
  updateAd,
  deleteAd,
  // Events
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  // Team
  getTeamMembers,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  // Types
  News,
  CarouselImage,
  AdItem,
  EventItem,
  TeamMember,
} from '@/lib/firebase';

import { Plus, Edit, Trash2, Image as ImageIcon, FileText, LogOut, ExternalLink, Calendar, Users } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

export default function Admin() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'news' | 'carousel' | 'ads' | 'events' | 'team'>('news');

  // ===== Notícias =====
  const [news, setNews] = useState<News[]>([]);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [editingNews, setEditingNews] = useState<News | null>(null);
  const [newsForm, setNewsForm] = useState({
    title: '',
    subtitle: '',
    content: '',
    category: '',
    imageFile: null as File | null,
  });

  // ===== Carrossel =====
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [showCarouselForm, setShowCarouselForm] = useState(false);
  const [carouselForm, setCarouselForm] = useState({
    title: '',
    imageFile: null as File | null,
  });

  // ===== Anúncios =====
  const [ads, setAds] = useState<AdItem[]>([]);
  const [showAdsForm, setShowAdsForm] = useState(false);
  const [editingAd, setEditingAd] = useState<AdItem | null>(null);
  const [adsForm, setAdsForm] = useState({
    titulo: '',
    link: '',
    imageFile: null as File | null,
    ativo: true,
    ordem: 0,
  });

  // ===== Eventos =====
  const [events, setEvents] = useState<EventItem[]>([]);
  const [showEventsForm, setShowEventsForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [eventsForm, setEventsForm] = useState({
    title: '',
    description: '',
    imageFile: null as File | null,
    ativo: true,
    ordem: 0,
    startsAt: '', // yyyy-mm-dd
    endsAt: '',   // yyyy-mm-dd
  });

  // ===== Equipe (Sobre Nós) =====
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingTeamMember, setEditingTeamMember] = useState<TeamMember | null>(null);
  const [teamForm, setTeamForm] = useState({
    nome: '',
    cargo: '',
    imageFile: null as File | null,
  });

  // ===== Auth =====
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        loadData();
      } else {
        router.push('/login');
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [router]);

  const loadData = async () => {
    const [newsData, carouselData, adsData, eventsData, teamData] = await Promise.all([
      getNews(false),
      getCarouselImages(),
      getAds(),
      getEvents(),
      getTeamMembers(),
    ]);
    setNews(newsData);
    setCarouselImages(carouselData);
    setAds(adsData);
    setEvents(eventsData);
    setTeamMembers(teamData);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  // ===== Handlers: Notícias =====
  const handleNewsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = editingNews?.imageUrl || '';
      if (newsForm.imageFile) {
        imageUrl = await uploadImage(newsForm.imageFile, 'news');
      }

      const newsData = {
        title: newsForm.title,
        subtitle: newsForm.subtitle,
        content: newsForm.content,
        category: newsForm.category,
        imageUrl,
        author: user?.email || 'Admin',
        published: true,
        createdAt: editingNews?.createdAt || new Date(),
      };

      if (editingNews?.id) {
        await updateNews(editingNews.id, newsData);
        toast.success('Notícia atualizada!');
      } else {
        await createNews(newsData);
        toast.success('Notícia criada!');
      }

      setShowNewsForm(false);
      setEditingNews(null);
      setNewsForm({ title: '', subtitle: '', content: '', category: '', imageFile: null });
      loadData();
    } catch (error) {
      toast.error('Erro ao salvar notícia');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta notícia?')) return;
    try {
      await deleteNews(id);
      toast.success('Notícia excluída!');
      loadData();
    } catch (error) {
      toast.error('Erro ao excluir notícia');
    }
  };

  const handleEditNews = (news: News) => {
    setEditingNews(news);
    setNewsForm({
      title: news.title,
      subtitle: news.subtitle,
      content: news.content,
      category: news.category,
      imageFile: null,
    });
    setShowNewsForm(true);
  };

  // ===== Handlers: Carrossel =====
  const handleCarouselSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!carouselForm.imageFile) return;

    setLoading(true);
    try {
      const imageUrl = await uploadImage(carouselForm.imageFile, 'carousel');
      await addCarouselImage({
        title: carouselForm.title,
        imageUrl,
        order: carouselImages.length,
        active: true,
      });

      toast.success('Imagem adicionada!');
      setShowCarouselForm(false);
      setCarouselForm({ title: '', imageFile: null });
      loadData();
    } catch (error) {
      toast.error('Erro ao adicionar imagem');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCarousel = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta imagem?')) return;
    try {
      await deleteCarouselImage(id);
      toast.success('Imagem excluída!');
      loadData();
    } catch (error) {
      toast.error('Erro ao excluir imagem');
    }
  };

  // ===== Handlers: Anúncios =====
  const handleAdsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imagem1 = editingAd?.imagem1 || '';
      if (adsForm.imageFile) {
        imagem1 = await uploadImage(adsForm.imageFile, 'ads');
      }

      const adData = {
        titulo: adsForm.titulo,
        link: adsForm.link,
        imagem1,
        ativo: adsForm.ativo,
        ordem: adsForm.ordem,
      };

      if (editingAd) {
        await updateAd(editingAd.id, adData);
        toast.success('Anúncio atualizado!');
      } else {
        await addAd(adData);
        toast.success('Anúncio criado!');
      }

      setShowAdsForm(false);
      setEditingAd(null);
      setAdsForm({ titulo: '', link: '', imageFile: null, ativo: true, ordem: 0 });
      loadData();
    } catch (error) {
      toast.error('Erro ao salvar anúncio');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAd = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este anúncio?')) return;
    try {
      await deleteAd(id);
      toast.success('Anúncio excluído!');
      loadData();
    } catch (error) {
      toast.error('Erro ao excluir anúncio');
    }
  };

  const handleEditAd = (ad: AdItem) => {
    setEditingAd(ad);
    setAdsForm({
      titulo: ad.titulo,
      link: ad.link,
      imageFile: null,
      ativo: ad.ativo ?? true,
      ordem: ad.ordem ?? 0,
    });
    setShowAdsForm(true);
  };

  // ===== Handlers: Eventos =====
  const handleEventsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = editingEvent?.imageUrl || '';
      if (eventsForm.imageFile) {
        imageUrl = await uploadImage(eventsForm.imageFile, 'events');
      }

      const payload: Omit<EventItem, 'id'> = {
        imageUrl,
        title: eventsForm.title,
        description: eventsForm.description,
        order: eventsForm.ordem,
        active: eventsForm.ativo,
        startsAt: eventsForm.startsAt ? new Date(eventsForm.startsAt) : undefined,
        endsAt: eventsForm.endsAt ? new Date(eventsForm.endsAt) : undefined,
        createdAt: editingEvent?.createdAt ?? new Date(),
        updatedAt: new Date(),
      };

      if (editingEvent?.id) {
        await updateEvent(editingEvent.id, payload);
        toast.success('Evento atualizado!');
      } else {
        await addEvent(payload);
        toast.success('Evento criado!');
      }

      setShowEventsForm(false);
      setEditingEvent(null);
      setEventsForm({ title: '', description: '', imageFile: null, ativo: true, ordem: 0, startsAt: '', endsAt: '' });
      loadData();
    } catch (err) {
      toast.error('Erro ao salvar evento');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!confirm('Excluir este evento?')) return;
    try {
      await deleteEvent(id);
      toast.success('Evento excluído!');
      loadData();
    } catch {
      toast.error('Erro ao excluir evento');
    }
  };

  const handleEditEvent = (ev: EventItem) => {
    const toISO = (v: any) => {
      if (!v) return '';
      if (typeof v === 'string') return v.slice(0, 10);
      const date = v?.seconds ? new Date(v.seconds * 1000) : new Date(v);
      return isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
    };

    setEditingEvent(ev);
    setEventsForm({
      title: ev.title || '',
      description: ev.description || '',
      imageFile: null,
      ativo: ev.active ?? true,
      ordem: ev.order ?? 0,
      startsAt: toISO(ev.startsAt),
      endsAt: toISO(ev.endsAt),
    });
    setShowEventsForm(true);
  };

  // ===== Handlers: Equipe =====
  const handleTeamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imagem = editingTeamMember?.imagem || '';
      if (teamForm.imageFile) {
        imagem = await uploadImage(teamForm.imageFile, 'team');
      }

      const teamData = {
        nome: teamForm.nome,
        cargo: teamForm.cargo,
        imagem,
        ordem: teamMembers.length,
      };

      if (editingTeamMember?.id) {
        await updateTeamMember(editingTeamMember.id, teamData);
        toast.success('Membro atualizado!');
      } else {
        await addTeamMember(teamData);
        toast.success('Membro adicionado!');
      }

      setShowTeamForm(false);
      setEditingTeamMember(null);
      setTeamForm({ nome: '', cargo: '', imageFile: null });
      loadData();
    } catch (error) {
      toast.error('Erro ao salvar membro da equipe');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este membro?')) return;
    try {
      await deleteTeamMember(id);
      toast.success('Membro excluído!');
      loadData();
    } catch (error) {
      toast.error('Erro ao excluir membro');
    }
  };

  const handleEditTeamMember = (member: TeamMember) => {
    setEditingTeamMember(member);
    setTeamForm({
      nome: member.nome,
      cargo: member.cargo,
      imageFile: null,
    });
    setShowTeamForm(true);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster />

      {/* Header */}
      <header className="bg-blue-900 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Painel Admin - Muleka FM</h1>
          <button onClick={handleLogout} className="flex items-center gap-2 hover:bg-blue-800 px-4 py-2 rounded">
            <LogOut size={20} />
            Sair
          </button>
        </div>
      </header>

      <div className="container mx-auto p-6">
        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('news')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'news' ? 'bg-blue-600 text-white' : 'bg-white'}`}
          >
            <FileText size={20} />
            Notícias
          </button>
          <button
            onClick={() => setActiveTab('carousel')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'carousel' ? 'bg-blue-600 text-white' : 'bg-white'}`}
          >
            <ImageIcon size={20} />
            Carrossel
          </button>
          <button
            onClick={() => setActiveTab('ads')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'ads' ? 'bg-orange-600 text-white' : 'bg-white'}`}
          >
            <ExternalLink size={20} />
            Anúncios
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'events' ? 'bg-purple-600 text-white' : 'bg-white'}`}
          >
            <Calendar size={20} />
            Shows & Eventos
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-2 px-4 py-2 rounded ${activeTab === 'team' ? 'bg-green-600 text-white' : 'bg-white'}`}
          >
            <Users size={20} />
            Equipe
          </button>
        </div>

        {/* ===== Conteúdos ===== */}
        {activeTab === 'news' && (
          // ------- Notícias -------
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Notícias</h2>
              <button
                onClick={() => {
                  setEditingNews(null);
                  setNewsForm({ title: '', subtitle: '', content: '', category: '', imageFile: null });
                  setShowNewsForm(true);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
              >
                <Plus size={20} />
                Nova Notícia
              </button>
            </div>

            {showNewsForm && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-bold mb-4">{editingNews ? 'Editar Notícia' : 'Nova Notícia'}</h3>
                <form onSubmit={handleNewsSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Título"
                    required
                    className="w-full px-3 py-2 border rounded"
                    value={newsForm.title}
                    onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Subtítulo"
                    required
                    className="w-full px-3 py-2 border rounded"
                    value={newsForm.subtitle}
                    onChange={(e) => setNewsForm({ ...newsForm, subtitle: e.target.value })}
                  />
                  <select
                    required
                    className="w-full px-3 py-2 border rounded"
                    value={newsForm.category}
                    onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                  >
                    <option value="">Selecione uma categoria</option>
                    <option value="politica">Política</option>
                    <option value="economia">Economia</option>
                    <option value="esportes">Esportes</option>
                    <option value="cultura">Cultura</option>
                    <option value="tecnologia">Tecnologia</option>
                  </select>
                  <textarea
                    placeholder="Conteúdo da notícia (pode usar HTML)"
                    required
                    rows={10}
                    className="w-full px-3 py-2 border rounded"
                    value={newsForm.content}
                    onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewsForm({ ...newsForm, imageFile: e.target.files?.[0] || null })}
                    className="w-full px-3 py-2 border rounded"
                  />
                  {editingNews && <p className="text-sm text-gray-500">Deixe vazio para manter a imagem atual</p>}

                  <div className="flex gap-4">
                    <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                      {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewsForm(false);
                        setEditingNews(null);
                      }}
                      className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid gap-4">
              {news.map((item) => (
                <div key={item.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                  <div>
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="text-sm text-gray-600">
                      {item.category} • {item.author}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEditNews(item)} className="p-2 text-blue-600 hover:bg-blue-100 rounded">
                      <Edit size={20} />
                    </button>
                    <button onClick={() => handleDeleteNews(item.id!)} className="p-2 text-red-600 hover:bg-red-100 rounded">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'carousel' && (
          // ------- Carrossel -------
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Carrossel</h2>
              <button
                onClick={() => setShowCarouselForm(true)}
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
              >
                <Plus size={20} />
                Nova Imagem
              </button>
            </div>

            {showCarouselForm && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-bold mb-4">Nova Imagem</h3>
                <form onSubmit={handleCarouselSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Título da imagem"
                    required
                    className="w-full px-3 py-2 border rounded"
                    value={carouselForm.title}
                    onChange={(e) => setCarouselForm({ ...carouselForm, title: e.target.value })}
                  />

                  <input
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => setCarouselForm({ ...carouselForm, imageFile: e.target.files?.[0] || null })}
                    className="w-full px-3 py-2 border rounded"
                  />

                  <div className="flex gap-4">
                    <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                      {loading ? 'Salvando..' : 'Salvar'}
                    </button>
                    <button type="button" onClick={() => setShowCarouselForm(false)} className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400">
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {carouselImages.map((image) => (
                <div key={image.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="relative w-full h-[200px]">
                    <Image src={image.imageUrl} alt={image.title} fill sizes="100vw" className="object-cover" />
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <p className="font-semibold">{image.title}</p>
                    <button onClick={() => handleDeleteCarousel(image.id!)} className="p-2 text-red-600 hover:bg-red-100 rounded">
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'ads' && (
          // ------- Anúncios -------
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Anúncios</h2>
              <button
                onClick={() => {
                  setEditingAd(null);
                  setAdsForm({ titulo: '', link: '', imageFile: null, ativo: true, ordem: 0 });
                  setShowAdsForm(true);
                }}
                className="bg-orange-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-orange-700"
              >
                <Plus size={20} />
                Novo Anúncio
              </button>
            </div>

            {showAdsForm && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-bold mb-4">{editingAd ? 'Editar Anúncio' : 'Novo Anúncio'}</h3>
                <form onSubmit={handleAdsSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Título/Nome do anunciante"
                    required
                    className="w-full px-3 py-2 border rounded"
                    value={adsForm.titulo}
                    onChange={(e) => setAdsForm({ ...adsForm, titulo: e.target.value })}
                  />
                  <input
                    type="url"
                    placeholder="Link do anunciante (https://...)"
                    required
                    className="w-full px-3 py-2 border rounded"
                    value={adsForm.link}
                    onChange={(e) => setAdsForm({ ...adsForm, link: e.target.value })}
                  />
                  <input
                    type="number"
                    placeholder="Ordem de exibição (0, 1, 2...)"
                    min="0"
                    className="w-full px-3 py-2 border rounded"
                    value={adsForm.ordem}
                    onChange={(e) => setAdsForm({ ...adsForm, ordem: parseInt(e.target.value) || 0 })}
                  />

                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={adsForm.ativo} onChange={(e) => setAdsForm({ ...adsForm, ativo: e.target.checked })} />
                    <span>Anúncio ativo</span>
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAdsForm({ ...adsForm, imageFile: e.target.files?.[0] || null })}
                    className="w-full px-3 py-2 border rounded"
                    required={!editingAd}
                  />
                  {editingAd && <p className="text-sm text-gray-500">Deixe vazio para manter a imagem atual</p>}

                  <div className="flex gap-4">
                    <button type="submit" disabled={loading} className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700">
                      {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAdsForm(false);
                        setEditingAd(null);
                      }}
                      className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ads.map((ad) => (
                <div key={ad.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="relative w-full h-[200px]">
                    <Image src={ad.imagem1} alt={ad.titulo} fill sizes="100vw" className="object-cover" />
                    {ad.ativo === false && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-bold">INATIVO</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{ad.titulo}</h3>
                    <p className="text-sm text-gray-600 mb-2 truncate">
                      <ExternalLink size={14} className="inline mr-1" />
                      {ad.link}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">Ordem: {ad.ordem}</span>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditAd(ad)} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDeleteAd(ad.id)} className="p-1 text-red-600 hover:bg-red-100 rounded">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {ads.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">Nenhum anúncio cadastrado</p>
                <button onClick={() => setShowAdsForm(true)} className="bg-orange-600 text-white px-6 py-3 rounded hover:bg-orange-700">
                  Criar primeiro anúncio
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'events' && (
          // ------- Eventos -------
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Shows & Eventos</h2>
              <button
                onClick={() => {
                  setEditingEvent(null);
                  setEventsForm({ title: '', description: '', imageFile: null, ativo: true, ordem: 0, startsAt: '', endsAt: '' });
                  setShowEventsForm(true);
                }}
                className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-purple-700"
              >
                <Plus size={20} />
                Novo Evento
              </button>
            </div>

            {showEventsForm && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-bold mb-4">{editingEvent ? 'Editar Evento' : 'Novo Evento'}</h3>
                <form onSubmit={handleEventsSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Título do evento"
                    required
                    className="w-full px-3 py-2 border rounded"
                    value={eventsForm.title}
                    onChange={(e) => setEventsForm({ ...eventsForm, title: e.target.value })}
                  />
                  <textarea
                    placeholder="Descrição"
                    rows={4}
                    className="w-full px-3 py-2 border rounded"
                    value={eventsForm.description}
                    onChange={(e) => setEventsForm({ ...eventsForm, description: e.target.value })}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm mb-1">Data de Início</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border rounded"
                        value={eventsForm.startsAt}
                        onChange={(e) => setEventsForm({ ...eventsForm, startsAt: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Data de Fim</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 border rounded"
                        value={eventsForm.endsAt}
                        onChange={(e) => setEventsForm({ ...eventsForm, endsAt: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm mb-1">Ordem</label>
                      <input
                        type="number"
                        min={0}
                        className="w-full px-3 py-2 border rounded"
                        value={eventsForm.ordem}
                        onChange={(e) => setEventsForm({ ...eventsForm, ordem: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={eventsForm.ativo}
                      onChange={(e) => setEventsForm({ ...eventsForm, ativo: e.target.checked })}
                    />
                    <span>Evento ativo</span>
                  </label>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEventsForm({ ...eventsForm, imageFile: e.target.files?.[0] || null })}
                    className="w-full px-3 py-2 border rounded"
                    required={!editingEvent}
                  />
                  {editingEvent && <p className="text-sm text-gray-500">Deixe vazio para manter a imagem atual</p>}

                  <div className="flex gap-4">
                    <button type="submit" disabled={loading} className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">
                      {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowEventsForm(false);
                        setEditingEvent(null);
                      }}
                      className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((ev) => (
                <div key={ev.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="relative w-full h-[200px]">
                    <Image src={ev.imageUrl} alt={ev.title} fill sizes="100vw" className="object-cover" />
                    {ev.active === false && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold">INATIVO</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-1">{ev.title}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{ev.description}</p>

                    {/* Datas do evento */}
                    {(ev.startsAt || ev.endsAt) && (
                      <div className="text-xs text-gray-500 mb-2">
                        {ev.startsAt && (
                          <div>Início: {new Date(ev.startsAt).toLocaleDateString('pt-BR')}</div>
                        )}
                        {ev.endsAt && (
                          <div>Fim: {new Date(ev.endsAt).toLocaleDateString('pt-BR')}</div>
                        )}
                      </div>
                    )}

                    <div className="flex justify-between items-center">
                      <span className="text-xs bg-gray-200 px-2 py-1 rounded">Ordem: {ev.order ?? 0}</span>
                      <div className="flex gap-2">
                        <button onClick={() => handleEditEvent(ev)} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => ev.id && handleDeleteEvent(ev.id)} className="p-1 text-red-600 hover:bg-red-100 rounded">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {events.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">Nenhum evento cadastrado</p>
                <button onClick={() => setShowEventsForm(true)} className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700">
                  Criar primeiro evento
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'team' && (
          // ------- Equipe (Sobre Nós) -------
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Equipe</h2>
              <button
                onClick={() => {
                  setEditingTeamMember(null);
                  setTeamForm({ nome: '', cargo: '', imageFile: null });
                  setShowTeamForm(true);
                }}
                className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
              >
                <Plus size={20} />
                Novo Membro
              </button>
            </div>

            {showTeamForm && (
              <div className="bg-white p-6 rounded-lg shadow-md mb-6">
                <h3 className="text-xl font-bold mb-4">
                  {editingTeamMember ? 'Editar Membro da Equipe' : 'Novo Membro da Equipe'}
                </h3>
                <form onSubmit={handleTeamSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Nome completo"
                    required
                    className="w-full px-3 py-2 border rounded"
                    value={teamForm.nome}
                    onChange={(e) => setTeamForm({ ...teamForm, nome: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder="Cargo/função"
                    required
                    className="w-full px-3 py-2 border rounded"
                    value={teamForm.cargo}
                    onChange={(e) => setTeamForm({ ...teamForm, cargo: e.target.value })}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setTeamForm({ ...teamForm, imageFile: e.target.files?.[0] || null })}
                    className="w-full px-3 py-2 border rounded"
                    required={!editingTeamMember}
                  />
                  {editingTeamMember && <p className="text-sm text-gray-500">Deixe vazio para manter a imagem atual</p>}

                  <div className="flex gap-4">
                    <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
                      {loading ? 'Salvando...' : 'Salvar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowTeamForm(false);
                        setEditingTeamMember(null);
                      }}
                      className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="relative w-full h-[250px]">
                    <Image src={member.imagem} alt={member.nome} fill sizes="100vw" className="object-cover" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{member.nome}</h3>
                    <p className="text-gray-600">{member.cargo}</p>
                    <div className="flex justify-end gap-2 mt-4">
                      <button onClick={() => handleEditTeamMember(member)} className="p-2 text-blue-600 hover:bg-blue-100 rounded">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => member.id && handleDeleteTeamMember(member.id)} className="p-2 text-red-600 hover:bg-red-100 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {teamMembers.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">Nenhum membro da equipe cadastrado</p>
                <button onClick={() => setShowTeamForm(true)} className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">
                  Adicionar primeiro membro
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}