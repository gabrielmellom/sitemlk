'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getEvents,
  addEvent,
  updateEvent,
  deleteEvent,
  uploadImage,
  EventItem,
} from '@/lib/firebase';

export default function EventsAdmin() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    imageFile: null as File | null,
    ativo: true,
    ordem: 0,
    startsAt: '',
    endsAt: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const eventsData = await getEvents();
    setEvents(eventsData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let imageUrl = editing?.imageUrl || '';
      if (form.imageFile) {
        imageUrl = await uploadImage(form.imageFile, 'events');
      }

      const payload: Omit<EventItem, 'id'> = {
        imageUrl,
        title: form.title,
        description: form.description,
        order: form.ordem,
        active: form.ativo,
        startsAt: form.startsAt ? new Date(form.startsAt) : undefined,
        endsAt: form.endsAt ? new Date(form.endsAt) : undefined,
        createdAt: editing?.createdAt ?? new Date(),
        updatedAt: new Date(),
      };

      if (editing?.id) {
        await updateEvent(editing.id, payload);
        toast.success('Evento atualizado!');
      } else {
        await addEvent(payload);
        toast.success('Evento criado!');
      }

      resetForm();
      loadData();
    } catch (err) {
      toast.error('Erro ao salvar evento');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir este evento?')) return;
    try {
      await deleteEvent(id);
      toast.success('Evento excluído!');
      loadData();
    } catch {
      toast.error('Erro ao excluir evento');
    }
  };

  const handleEdit = (ev: EventItem) => {
    const toISO = (v: any) => {
      if (!v) return '';
      if (typeof v === 'string') return v.slice(0, 10);
      const date = v?.seconds ? new Date(v.seconds * 1000) : new Date(v);
      return isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
    };

    setEditing(ev);
    setForm({
      title: ev.title || '',
      description: ev.description || '',
      imageFile: null,
      ativo: ev.active ?? true,
      ordem: ev.order ?? 0,
      startsAt: toISO(ev.startsAt),
      endsAt: toISO(ev.endsAt),
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm({ title: '', description: '', imageFile: null, ativo: true, ordem: 0, startsAt: '', endsAt: '' });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Shows & Eventos</h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-purple-700"
        >
          <Plus size={20} />
          Novo Evento
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-bold mb-4">{editing ? 'Editar Evento' : 'Novo Evento'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Título do evento"
              required
              className="w-full px-3 py-2 border rounded"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              placeholder="Descrição"
              rows={4}
              className="w-full px-3 py-2 border rounded"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-1">Data de Início</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded"
                  value={form.startsAt}
                  onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Data de Fim</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded"
                  value={form.endsAt}
                  onChange={(e) => setForm({ ...form, endsAt: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm mb-1">Ordem</label>
                <input
                  type="number"
                  min={0}
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
              <span>Evento ativo</span>
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
              <button type="submit" disabled={loading} className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">
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
                  <button onClick={() => handleEdit(ev)} className="p-1 text-blue-600 hover:bg-blue-100 rounded">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => ev.id && handleDelete(ev.id)} className="p-1 text-red-600 hover:bg-red-100 rounded">
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
          <button onClick={() => setShowForm(true)} className="bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700">
            Criar primeiro evento
          </button>
        </div>
      )}
    </div>
  );
}