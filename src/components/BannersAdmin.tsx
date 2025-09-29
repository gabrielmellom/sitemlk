'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  // Vamos assumir que você vai adicionar essas funções no firebase
  getBanners,
  addBanner,
  updateBanner,
  deleteBanner,
  uploadImage,
} from '@/lib/firebase';

// Tipo para os banners
interface Banner {
  id?: string;
  titulo: string;
  link: string;
  imagem: string;
  ativo: boolean;
  ordem: number;
  tamanho: 'grande' | 'pequeno'; // grande = banner principal, pequeno = banners menores
  createdAt?: Date;
  updatedAt?: Date;
}

export default function BannersAdmin() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    titulo: '',
    link: '',
    imageFile: null as File | null,
    ativo: true,
    ordem: 0,
    tamanho: 'pequeno' as 'grande' | 'pequeno',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const bannersData = await getBanners();
      setBanners(bannersData);
    } catch (error) {
      console.error('Erro ao carregar banners:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imagem = editing?.imagem || '';
      if (form.imageFile) {
        imagem = await uploadImage(form.imageFile, 'banners');
      }

      const bannerData = {
        titulo: form.titulo,
        link: form.link,
        imagem,
        ativo: form.ativo,
        ordem: form.ordem,
        tamanho: form.tamanho,
        updatedAt: new Date(),
      };

      if (editing?.id) {
        await updateBanner(editing.id, bannerData);
        toast.success('Banner atualizado!');
      } else {
        await addBanner({ ...bannerData, createdAt: new Date() });
        toast.success('Banner criado!');
      }

      resetForm();
      loadData();
    } catch (error) {
      toast.error('Erro ao salvar banner');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este banner?')) return;
    try {
      await deleteBanner(id);
      toast.success('Banner excluído!');
      loadData();
    } catch (error) {
      toast.error('Erro ao excluir banner');
    }
  };

  const handleEdit = (banner: Banner) => {
    setEditing(banner);
    setForm({
      titulo: banner.titulo,
      link: banner.link,
      imageFile: null,
      ativo: banner.ativo,
      ordem: banner.ordem,
      tamanho: banner.tamanho,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm({ titulo: '', link: '', imageFile: null, ativo: true, ordem: 0, tamanho: 'pequeno' });
  };

  const bannersPequenos = banners.filter(b => b.tamanho === 'pequeno');
  const bannersGrandes = banners.filter(b => b.tamanho === 'grande');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Banners da Página</h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus size={20} />
          Novo Banner
        </button>
      </div>

      {/* Aviso sobre layout */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-blue-800 mb-2">Configuração do Layout:</h3>
        <p className="text-blue-700 text-sm mb-2">
          • <strong>Banner Grande:</strong> Será exibido como banner principal (recomendado: 1 apenas)
        </p>
        <p className="text-blue-700 text-sm">
          • <strong>Banners Pequenos:</strong> Serão exibidos em grid ao lado do banner grande (recomendado: 4 banners)
        </p>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-bold mb-4">{editing ? 'Editar Banner' : 'Novo Banner'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Título do banner"
              required
              className="w-full px-3 py-2 border rounded"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            />
            
            <input
              type="url"
              placeholder="Link de redirecionamento (https://...)"
              required
              className="w-full px-3 py-2 border rounded"
              value={form.link}
              onChange={(e) => setForm({ ...form, link: e.target.value })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Tamanho do Banner</label>
                <select
                  className="w-full px-3 py-2 border rounded"
                  value={form.tamanho}
                  onChange={(e) => setForm({ ...form, tamanho: e.target.value as 'grande' | 'pequeno' })}
                >
                  <option value="pequeno">Banner Pequeno</option>
                  <option value="grande">Banner Grande</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm mb-1">Ordem de Exibição</label>
                <input
                  type="number"
                  min="0"
                  className="w-full px-3 py-2 border rounded"
                  value={form.ordem}
                  onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={form.ativo} 
                onChange={(e) => setForm({ ...form, ativo: e.target.checked })} 
              />
              <span>Banner ativo</span>
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, imageFile: e.target.files?.[0] || null })}
              className="w-full px-3 py-2 border rounded"
              required={!editing}
            />
            {editing && <p className="text-sm text-gray-500">Deixe vazio para manter a imagem atual</p>}

            <div className="flex gap-4">
              <button 
                type="submit" 
                disabled={loading} 
                className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Preview do Layout */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="font-semibold mb-4">Preview do Layout</h3>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 min-h-[200px]">
          {/* Banner Grande */}
          <div className="lg:col-span-3 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
            {bannersGrandes.length > 0 ? (
              <div className="relative w-full h-[200px]">
                <Image 
                  src={bannersGrandes[0].imagem} 
                  alt={bannersGrandes[0].titulo}
                  fill
                  className="object-cover rounded-lg"
                />
                <div className="absolute top-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                  Banner Grande
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-500">Banner Grande</p>
                <p className="text-xs text-gray-400">Nenhum banner grande configurado</p>
              </div>
            )}
          </div>

          {/* Banners Pequenos */}
          <div className="lg:col-span-2 grid grid-cols-2 gap-2">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="bg-white rounded-lg border-2 border-dashed border-gray-300 aspect-square flex items-center justify-center">
                {bannersPequenos[index] ? (
                  <div className="relative w-full h-full">
                    <Image 
                      src={bannersPequenos[index].imagem} 
                      alt={bannersPequenos[index].titulo}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <div className="absolute top-1 left-1 bg-black/50 text-white px-1 py-0.5 rounded text-xs">
                      {index + 1}
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Banner {index + 1}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Banners */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Todos os Banners</h3>
        
        {banners.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 mb-4">Nenhum banner cadastrado</p>
            <button onClick={() => setShowForm(true)} className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700">
              Criar primeiro banner
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {banners.map((banner) => (
              <div key={banner.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="relative w-full h-[150px]">
                  <Image src={banner.imagem} alt={banner.titulo} fill className="object-cover" />
                  {!banner.ativo && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                      <span className="text-white font-bold">INATIVO</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                    {banner.tamanho === 'grande' ? 'Grande' : 'Pequeno'}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2">{banner.titulo}</h3>
                  <p className="text-sm text-gray-600 mb-2 truncate">
                    <ExternalLink size={14} className="inline mr-1" />
                    {banner.link}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded">Ordem: {banner.ordem}</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(banner)} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                        <Edit size={16} />
                      </button>
                      <button onClick={() => banner.id && handleDelete(banner.id)} className="p-1 text-red-600 hover:bg-red-100 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}