'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getAds,
  addAd,
  updateAd,
  deleteAd,
  uploadImage,
  AdItem,
} from '@/lib/firebase';

export default function AdsAdmin() {
  const [ads, setAds] = useState<AdItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<AdItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    titulo: '',
    link: '',
    imageFile: null as File | null,
    ativo: true,
    ordem: 0,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const adsData = await getAds();
    setAds(adsData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imagem1 = editing?.imagem1 || '';
      if (form.imageFile) {
        imagem1 = await uploadImage(form.imageFile, 'ads');
      }

      const payload: Omit<AdItem, 'id'> = {
        imagem1,
        titulo: form.titulo,
        link: form.link,
        ordem: form.ordem,
        ativo: form.ativo,
        createdAt: editing?.createdAt ?? new Date(),
        updatedAt: new Date(),
      };

      if (editing?.id) {
        await updateAd(editing.id, payload);
        toast.success('Anúncio atualizado!');
      } else {
        await addAd(payload);
        toast.success('Anúncio criado!');
      }

      resetForm();
      loadData();
    } catch (err) {
      toast.error('Erro ao salvar anúncio');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este anúncio?')) return;
    try {
      await deleteAd(id);
      toast.success('Anúncio excluído!');
      loadData();
    } catch {
      toast.error('Erro ao excluir anúncio');
    }
  };

  const handleEdit = (ad: AdItem) => {
    setEditing(ad);
    setForm({
      titulo: ad.titulo || '',
      link: ad.link || '',
      imageFile: null,
      ativo: ad.ativo ?? true,
      ordem: ad.ordem ?? 0,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm({ titulo: '', link: '', imageFile: null, ativo: true, ordem: 0 });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Anúncios</h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-orange-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-orange-700"
        >
          <Plus size={20} />
          Novo Anúncio
        </button>
      </div>

      {/* Informação sobre anúncios */}
      <div className="bg-orange-50 border-l-4 border-orange-500 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
          <span className="text-2xl">📢</span>
          Sobre os Anúncios:
        </h3>
        <p className="text-sm text-orange-700">
          Os anúncios cadastrados aqui aparecem na <strong>seção "Nossos Parceiros"</strong> na página inicial do site.
          Use para divulgar parceiros comerciais e patrocinadores.
        </p>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-bold mb-4">{editing ? 'Editar Anúncio' : 'Novo Anúncio'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Título do anúncio (ex: Pizzaria Bella)"
              required
              className="w-full px-3 py-2 border rounded"
              value={form.titulo}
              onChange={(e) => setForm({ ...form, titulo: e.target.value })}
            />
            
            <div>
              <label className="block text-sm font-medium mb-1">Link do Site (opcional)</label>
              <input
                type="url"
                placeholder="https://exemplo.com.br"
                className="w-full px-3 py-2 border rounded"
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">
                Se preenchido, ao clicar no anúncio será redirecionado para este link
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Ordem de Exibição</label>
              <input
                type="number"
                min={0}
                className="w-full px-3 py-2 border rounded"
                value={form.ordem}
                onChange={(e) => setForm({ ...form, ordem: parseInt(e.target.value) || 0 })}
              />
              <p className="text-xs text-gray-500 mt-1">
                Quanto menor o número, mais no início aparece
              </p>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.ativo}
                onChange={(e) => setForm({ ...form, ativo: e.target.checked })}
              />
              <span>Anúncio ativo (visível no site)</span>
            </label>

            <div className="border-2 border-dashed border-orange-300 rounded-lg p-4 bg-orange-50">
              <label className="block text-sm font-semibold mb-2 text-orange-800">
                📸 Imagem do Anúncio
                <span className="ml-2 text-xs font-normal text-orange-600">
                  (Recomendado: 400x400px - formato quadrado)
                </span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, imageFile: e.target.files?.[0] || null })}
                className="w-full px-3 py-2 border rounded bg-white"
                required={!editing}
              />
              {editing?.imagem1 && (
                <p className="text-xs text-gray-600 mt-2">
                  ✅ Imagem atual: {editing.imagem1.split('/').pop()?.substring(0, 40)}...
                </p>
              )}
            </div>
            
            {editing && <p className="text-sm text-gray-500">Deixe vazio para manter a imagem atual</p>}

            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700">
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

      {ads.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="text-6xl mb-4">📢</div>
          <p className="text-gray-500 text-lg mb-4">Nenhum anúncio cadastrado</p>
          <button 
            onClick={() => setShowForm(true)} 
            className="bg-orange-600 text-white px-6 py-3 rounded hover:bg-orange-700"
          >
            Criar primeiro anúncio
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ads.map((ad) => (
            <div key={ad.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative w-full h-[200px]">
                <Image src={ad.imagem1} alt={ad.titulo} fill sizes="100vw" className="object-cover" />
                {ad.ativo === false && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold">INATIVO</span>
                  </div>
                )}
                {ad.link && (
                  <div className="absolute top-2 right-2">
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg flex items-center gap-1">
                      <ExternalLink size={12} />
                      Link
                    </span>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-1">{ad.titulo}</h3>
                {ad.link && (
                  <p className="text-xs text-blue-600 mb-2 truncate flex items-center gap-1">
                    <ExternalLink size={12} />
                    {ad.link}
                  </p>
                )}

                <div className="flex justify-between items-center mt-3">
                  <span className="text-xs bg-gray-200 px-2 py-1 rounded">Ordem: {ad.ordem ?? 0}</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(ad)} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                      <Edit size={16} />
                    </button>
                    <button onClick={() => ad.id && handleDelete(ad.id)} className="p-1 text-red-600 hover:bg-red-100 rounded">
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
  );
}
