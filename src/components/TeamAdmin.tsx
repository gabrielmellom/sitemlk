'use client';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  getTeamMembers,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  uploadImage,
  TeamMember,
} from '@/lib/firebase';

export default function TeamAdmin() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    nome: '',
    cargo: '',
    imageFile: null as File | null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const teamData = await getTeamMembers();
    setTeamMembers(teamData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imagem = editing?.imagem || '';
      if (form.imageFile) {
        imagem = await uploadImage(form.imageFile, 'team');
      }

      const teamData = {
        nome: form.nome,
        cargo: form.cargo,
        imagem,
        ordem: teamMembers.length,
      };

      if (editing?.id) {
        await updateTeamMember(editing.id, teamData);
        toast.success('Membro atualizado!');
      } else {
        await addTeamMember(teamData);
        toast.success('Membro adicionado!');
      }

      resetForm();
      loadData();
    } catch (error) {
      toast.error('Erro ao salvar membro da equipe');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este membro?')) return;
    try {
      await deleteTeamMember(id);
      toast.success('Membro excluído!');
      loadData();
    } catch (error) {
      toast.error('Erro ao excluir membro');
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditing(member);
    setForm({
      nome: member.nome,
      cargo: member.cargo,
      imageFile: null,
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm({ nome: '', cargo: '', imageFile: null });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Equipe</h2>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-green-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-green-700"
        >
          <Plus size={20} />
          Novo Membro
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h3 className="text-xl font-bold mb-4">
            {editing ? 'Editar Membro da Equipe' : 'Novo Membro da Equipe'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Nome completo"
              required
              className="w-full px-3 py-2 border rounded"
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
            />
            <input
              type="text"
              placeholder="Cargo/função"
              required
              className="w-full px-3 py-2 border rounded"
              value={form.cargo}
              onChange={(e) => setForm({ ...form, cargo: e.target.value })}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, imageFile: e.target.files?.[0] || null })}
              className="w-full px-3 py-2 border rounded"
              required={!editing}
            />
            {editing && <p className="text-sm text-gray-500">Deixe vazio para manter a imagem atual</p>}

            <div className="flex gap-4">
              <button type="submit" disabled={loading} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
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
        {teamMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="relative w-full h-[250px]">
              <Image src={member.imagem} alt={member.nome} fill sizes="100vw" className="object-cover" />
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg">{member.nome}</h3>
              <p className="text-gray-600">{member.cargo}</p>
              <div className="flex justify-end gap-2 mt-4">
                <button onClick={() => handleEdit(member)} className="p-2 text-blue-600 hover:bg-blue-100 rounded">
                  <Edit size={16} />
                </button>
                <button onClick={() => member.id && handleDelete(member.id)} className="p-2 text-red-600 hover:bg-red-100 rounded">
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
          <button onClick={() => setShowForm(true)} className="bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700">
            Adicionar primeiro membro
          </button>
        </div>
      )}
    </div>
  );
}