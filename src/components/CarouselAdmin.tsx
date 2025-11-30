'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getCarouselImages,
  addCarouselImage,
  deleteCarouselImage,
  uploadImage,
  CarouselImage,
} from '@/lib/firebase';

export default function CarouselAdmin() {
  const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    imageFile: null as File | null,
    imageMobileFile: null as File | null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const carouselData = await getCarouselImages();
    setCarouselImages(carouselData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.imageFile) return;

    setLoading(true);
    try {
      const imageUrl = await uploadImage(form.imageFile, 'carousel');
      
      let imageUrlMobile = undefined;
      if (form.imageMobileFile) {
        imageUrlMobile = await uploadImage(form.imageMobileFile, 'carousel');
      }

      await addCarouselImage({
        title: form.title,
        imageUrl,
        imageUrlMobile,
        order: carouselImages.length,
        active: true,
      });

      toast.success('Imagem adicionada!');
      resetForm();
      loadData();
    } catch (error) {
      toast.error('Erro ao adicionar imagem');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta imagem?')) return;
    try {
      await deleteCarouselImage(id);
      toast.success('Imagem excluída!');
      loadData();
    } catch (error) {
      toast.error('Erro ao excluir imagem');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setForm({ title: '', imageFile: null, imageMobileFile: null });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Carrossel</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
        >
          <Plus size={20} />
          Nova Imagem
        </button>
      </div>

      {/* Informações sobre imagens */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-l-4 border-blue-500 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
          <span className="text-2xl">💡</span>
          Dica de Proporções:
        </h3>
        <div className="text-sm text-gray-700 space-y-1">
          <p>
            <strong className="text-blue-700">🖥️ Imagem Desktop:</strong> Use formato <span className="bg-white px-2 py-0.5 rounded font-mono text-xs">1920x600px</span> (paisagem) para melhor visualização
          </p>
          <p>
            <strong className="text-purple-700">📱 Imagem Mobile:</strong> Use formato <span className="bg-white px-2 py-0.5 rounded font-mono text-xs">800x800px</span> (quadrado) para evitar distorções no celular
          </p>
          <p className="text-gray-600 italic mt-2">
            ✨ A imagem mobile é opcional. Se não for enviada, a imagem desktop será exibida em todos os dispositivos.
          </p>
        </div>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-bold mb-4">Nova Imagem</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Título da imagem"
              required
              className="w-full px-3 py-2 border rounded"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            {/* Upload Imagem Desktop */}
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 bg-blue-50">
              <label className="block text-sm font-semibold mb-2 text-blue-800">
                🖥️ Imagem Desktop/Tablet (Obrigatória)
                <span className="ml-2 text-xs font-normal text-blue-600">
                  (Recomendado: 1920x600px - formato paisagem)
                </span>
              </label>
              <input
                type="file"
                accept="image/*"
                required
                onChange={(e) => setForm({ ...form, imageFile: e.target.files?.[0] || null })}
                className="w-full px-3 py-2 border rounded bg-white"
              />
              {form.imageFile && (
                <p className="text-xs text-green-600 mt-2">
                  ✅ Arquivo selecionado: {form.imageFile.name}
                </p>
              )}
            </div>

            {/* Upload Imagem Mobile */}
            <div className="border-2 border-dashed border-purple-300 rounded-lg p-4 bg-purple-50">
              <label className="block text-sm font-semibold mb-2 text-purple-800">
                📱 Imagem Mobile (Opcional)
                <span className="ml-2 text-xs font-normal text-purple-600">
                  (Recomendado: 800x800px - formato quadrado para melhor visualização no celular)
                </span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setForm({ ...form, imageMobileFile: e.target.files?.[0] || null })}
                className="w-full px-3 py-2 border rounded bg-white"
              />
              {form.imageMobileFile && (
                <p className="text-xs text-green-600 mt-2">
                  ✅ Arquivo selecionado: {form.imageMobileFile.name}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                💡 Se não enviar imagem mobile, será usada a imagem desktop em todos os dispositivos
              </p>
            </div>

            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
                {loading ? 'Salvando..' : 'Salvar'}
              </button>
              <button type="button" onClick={resetForm} className="bg-gray-300 px-6 py-2 rounded hover:bg-gray-400">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {carouselImages.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="text-6xl mb-4">🖼️</div>
          <p className="text-gray-500 text-lg mb-4">Nenhuma imagem no carrossel</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 inline-flex items-center gap-2"
          >
            <Plus size={20} />
            Adicionar Primeira Imagem
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {carouselImages.map((image) => (
          <div key={image.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative w-full h-[200px]">
              <Image src={image.imageUrl} alt={image.title} fill sizes="100vw" className="object-cover" />
              {/* Badge indicando se tem versão mobile */}
              {image.imageUrlMobile && (
                <div className="absolute top-2 right-2">
                  <span className="bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-semibold shadow-lg">
                    📱 + Mobile
                  </span>
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="font-semibold mb-1">{image.title}</p>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      🖥️ Desktop
                    </span>
                    {image.imageUrlMobile && (
                      <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                        📱 Mobile
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={() => handleDelete(image.id!)} className="p-2 text-red-600 hover:bg-red-100 rounded flex-shrink-0">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}