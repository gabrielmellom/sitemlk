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
      await addCarouselImage({
        title: form.title,
        imageUrl,
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
    setForm({ title: '', imageFile: null });
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

            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) => setForm({ ...form, imageFile: e.target.files?.[0] || null })}
              className="w-full px-3 py-2 border rounded"
            />

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {carouselImages.map((image) => (
          <div key={image.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative w-full h-[200px]">
              <Image src={image.imageUrl} alt={image.title} fill sizes="100vw" className="object-cover" />
            </div>
            <div className="p-4 flex justify-between items-center">
              <p className="font-semibold">{image.title}</p>
              <button onClick={() => handleDelete(image.id!)} className="p-2 text-red-600 hover:bg-red-100 rounded">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}