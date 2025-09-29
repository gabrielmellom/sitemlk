'use client';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getNews,
  createNews,
  updateNews,
  deleteNews,
  uploadImage,
  News,
} from '@/lib/firebase';

interface NewsAdminProps {
  user: any;
}

export default function NewsAdmin({ user }: NewsAdminProps) {
  const [news, setNews] = useState<News[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<News | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    content: '',
    category: '',
    imageFile: null as File | null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const newsData = await getNews(false);
    setNews(newsData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = editing?.imageUrl || '';
      if (form.imageFile) {
        imageUrl = await uploadImage(form.imageFile, 'news');
      }

      const newsData = {
        title: form.title,
        subtitle: form.subtitle,
        content: form.content,
        category: form.category,
        imageUrl,
        author: user?.email || 'Admin',
        published: true,
        createdAt: editing?.createdAt || new Date(),
        news: '',
      };

      if (editing?.id) {
        await updateNews(editing.id, newsData);
        toast.success('Notícia atualizada!');
      } else {
        await createNews(newsData);
        toast.success('Notícia criada!');
      }

      resetForm();
      loadData();
    } catch (error) {
      toast.error('Erro ao salvar notícia');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta notícia?')) return;
    try {
      await deleteNews(id);
      toast.success('Notícia excluída!');
      loadData();
    } catch (error) {
      toast.error('Erro ao excluir notícia');
    }
  };

  const handleEdit = (news: News) => {
    setEditing(news);
    setForm({
      title: news.title,
      subtitle: news.subtitle,
      content: news.content,
      category: news.category,
      imageFile: null,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm({ title: '', subtitle: '', content: '', category: '', imageFile: null });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Notícias</h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
        >
          <Plus size={20} />
          Nova Notícia
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-bold mb-4">{editing ? 'Editar Notícia' : 'Nova Notícia'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Título"
              required
              className="w-full px-3 py-2 border rounded"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Subtítulo"
              required
              className="w-full px-3 py-2 border rounded"
              value={form.subtitle}
              onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
            />
            <select
              required
              className="w-full px-3 py-2 border rounded"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
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
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, imageFile: e.target.files?.[0] || null })}
              className="w-full px-3 py-2 border rounded"
            />
            {editing && <p className="text-sm text-gray-500">Deixe vazio para manter a imagem atual</p>}

            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
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
              <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-100 rounded">
                <Edit size={20} />
              </button>
              <button onClick={() => handleDelete(item.id!)} className="p-2 text-red-600 hover:bg-red-100 rounded">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}