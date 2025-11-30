'use client';
import { useState, useEffect, useRef } from 'react';
import { Plus, Edit, Trash2, Bold, Italic, Underline, List, ListOrdered, Heading2, Quote, Palette, Type, FileText } from 'lucide-react';
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
  const editorRef = useRef<HTMLDivElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [showFontSize, setShowFontSize] = useState(false);
  const [selectedFontSize, setSelectedFontSize] = useState('16px');
  const [showFontFamily, setShowFontFamily] = useState(false);
  const [selectedFontFamily, setSelectedFontFamily] = useState('Arial');

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
    // Aguarda o form aparecer antes de atualizar o editor
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = news.content;
      }
    }, 100);
  };

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm({ title: '', subtitle: '', content: '', category: '', imageFile: null });
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
      }
    }, 50);
  };

  const applyFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const applyColor = (color: string) => {
    const selection = window.getSelection();
    
    if (!selection || selection.rangeCount === 0) {
      setSelectedColor(color);
      setShowColorPicker(false);
      return;
    }
    
    const hasSelection = selection.toString().length > 0;
    
    if (hasSelection) {
      // Se há texto selecionado, envolve em span com cor
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      
      // Cria um span com a cor
      const span = document.createElement('span');
      span.style.color = color;
      span.textContent = selectedText;
      
      // Remove o conteúdo selecionado e insere o span
      range.deleteContents();
      range.insertNode(span);
      
      // Atualiza o conteúdo
      handleEditorChange();
      
      setActiveColor(null);
      toast.success('Cor aplicada!');
    } else {
      // Ativa a cor para os próximos caracteres
      setActiveColor(color);
      toast.success(`Cor ativa: ${color === '#000000' ? 'Preto' : 'Colorido'}. Digite para ver!`, {
        duration: 2000,
        icon: '🎨'
      });
    }
    
    setSelectedColor(color);
    setShowColorPicker(false);
    editorRef.current?.focus();
  };

  const handleEditorChange = () => {
    if (editorRef.current) {
      setForm({ ...form, content: editorRef.current.innerHTML });
    }
  };

  const applyFontSize = (size: string) => {
    const selection = window.getSelection();
    
    if (!selection || selection.rangeCount === 0) {
      setSelectedFontSize(size);
      setShowFontSize(false);
      return;
    }
    
    const hasSelection = selection.toString().length > 0;
    
    if (hasSelection) {
      // Se há texto selecionado, envolve em span com tamanho
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      
      // Cria um span com o tamanho
      const span = document.createElement('span');
      span.style.fontSize = size;
      span.textContent = selectedText;
      
      // Remove o conteúdo selecionado e insere o span
      range.deleteContents();
      range.insertNode(span);
      
      // Atualiza o conteúdo
      handleEditorChange();
      
      toast.success(`Tamanho ${size} aplicado!`);
    }
    
    setSelectedFontSize(size);
    setShowFontSize(false);
    editorRef.current?.focus();
  };

  const applyFontFamily = (font: string) => {
    const selection = window.getSelection();
    
    if (!selection || selection.rangeCount === 0) {
      setSelectedFontFamily(font);
      setShowFontFamily(false);
      return;
    }
    
    const hasSelection = selection.toString().length > 0;
    
    if (hasSelection) {
      // Se há texto selecionado, envolve em span com a fonte
      const range = selection.getRangeAt(0);
      const selectedText = range.toString();
      
      // Cria um span com a fonte
      const span = document.createElement('span');
      span.style.fontFamily = font;
      span.textContent = selectedText;
      
      // Remove o conteúdo selecionado e insere o span
      range.deleteContents();
      range.insertNode(span);
      
      // Atualiza o conteúdo
      handleEditorChange();
      
      toast.success(`Fonte ${font} aplicada!`);
    }
    
    setSelectedFontFamily(font);
    setShowFontFamily(false);
    editorRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (activeColor && !e.ctrlKey && !e.metaKey && e.key.length === 1) {
      e.preventDefault();
      
      // Insere o caractere com cor
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        
        const span = document.createElement('span');
        span.style.color = activeColor;
        span.textContent = e.key;
        
        range.deleteContents();
        range.insertNode(span);
        
        // Move o cursor para depois do caractere inserido
        range.setStartAfter(span);
        range.setEndAfter(span);
        selection.removeAllRanges();
        selection.addRange(range);
        
        handleEditorChange();
      }
    }
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

            {/* Editor de Texto Rico */}
            <div className="border rounded overflow-hidden">
              <div className="bg-gray-100 border-b p-2 flex flex-wrap gap-1 items-center">
                <button
                  type="button"
                  onClick={() => applyFormat('bold')}
                  className="p-2 hover:bg-gray-200 rounded transition"
                  title="Negrito (Ctrl+B)"
                >
                  <Bold size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat('italic')}
                  className="p-2 hover:bg-gray-200 rounded transition"
                  title="Itálico (Ctrl+I)"
                >
                  <Italic size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat('underline')}
                  className="p-2 hover:bg-gray-200 rounded transition"
                  title="Sublinhado (Ctrl+U)"
                >
                  <Underline size={18} />
                </button>
                <div className="w-px bg-gray-300 mx-1"></div>
                <button
                  type="button"
                  onClick={() => applyFormat('formatBlock', '<h2>')}
                  className="p-2 hover:bg-gray-200 rounded transition"
                  title="Título"
                >
                  <Heading2 size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat('formatBlock', '<p>')}
                  className="px-3 py-2 hover:bg-gray-200 rounded transition text-sm font-medium"
                  title="Parágrafo Normal"
                >
                  P
                </button>
                <div className="w-px bg-gray-300 mx-1"></div>
                <button
                  type="button"
                  onClick={() => applyFormat('insertUnorderedList')}
                  className="p-2 hover:bg-gray-200 rounded transition"
                  title="Lista com marcadores"
                >
                  <List size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat('insertOrderedList')}
                  className="p-2 hover:bg-gray-200 rounded transition"
                  title="Lista numerada"
                >
                  <ListOrdered size={18} />
                </button>
                <button
                  type="button"
                  onClick={() => applyFormat('formatBlock', '<blockquote>')}
                  className="p-2 hover:bg-gray-200 rounded transition"
                  title="Citação"
                >
                  <Quote size={18} />
                </button>
                <div className="w-px bg-gray-300 mx-1"></div>
                
                {/* Seletor de Tipo de Fonte */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFontFamily(!showFontFamily);
                      setShowColorPicker(false);
                      setShowFontSize(false);
                    }}
                    className="px-3 py-2 hover:bg-gray-200 rounded transition flex items-center gap-1 text-sm"
                    title="Tipo de fonte"
                  >
                    <FileText size={18} />
                    <span className="text-xs max-w-[60px] truncate" style={{ fontFamily: selectedFontFamily }}>
                      {selectedFontFamily}
                    </span>
                  </button>
                  
                  {showFontFamily && (
                    <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-xl p-2 z-50 min-w-[180px]">
                      <p className="text-xs font-semibold text-gray-700 mb-2 px-2">Tipo de fonte:</p>
                      {[
                        'Arial',
                        'Times New Roman',
                        'Georgia',
                        'Courier New',
                        'Verdana',
                        'Comic Sans MS',
                      ].map((font) => (
                        <button
                          key={font}
                          type="button"
                          onClick={() => applyFontFamily(font)}
                          className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition ${
                            selectedFontFamily === font ? 'bg-blue-50 text-blue-700 font-semibold' : ''
                          }`}
                          style={{ fontFamily: font }}
                        >
                          {font}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setShowFontFamily(false)}
                        className="mt-2 w-full py-2 text-xs text-white bg-gray-700 hover:bg-gray-800 rounded transition"
                      >
                        Fechar
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Seletor de Tamanho de Fonte */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowFontSize(!showFontSize);
                      setShowColorPicker(false);
                      setShowFontFamily(false);
                    }}
                    className="px-3 py-2 hover:bg-gray-200 rounded transition flex items-center gap-1 text-sm font-medium"
                    title="Tamanho da fonte"
                  >
                    <Type size={18} />
                    <span className="text-xs">{selectedFontSize}</span>
                  </button>
                  
                  {showFontSize && (
                    <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-xl p-2 z-50 min-w-[140px]">
                      <p className="text-xs font-semibold text-gray-700 mb-2 px-2">Tamanho:</p>
                      {[
                        { label: 'Pequeno', size: '12px' },
                        { label: 'Normal', size: '16px' },
                        { label: 'Médio', size: '20px' },
                        { label: 'Grande', size: '24px' },
                        { label: 'Muito Grande', size: '32px' },
                        { label: 'Gigante', size: '40px' },
                      ].map((item) => (
                        <button
                          key={item.size}
                          type="button"
                          onClick={() => applyFontSize(item.size)}
                          className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 transition ${
                            selectedFontSize === item.size ? 'bg-blue-50 text-blue-700 font-semibold' : ''
                          }`}
                          style={{ fontSize: item.size }}
                        >
                          {item.label}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => setShowFontSize(false)}
                        className="mt-2 w-full py-2 text-xs text-white bg-gray-700 hover:bg-gray-800 rounded transition"
                      >
                        Fechar
                      </button>
                    </div>
                  )}
                </div>
                
                {/* Seletor de Cores */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowColorPicker(!showColorPicker);
                      setShowFontSize(false);
                      setShowFontFamily(false);
                    }}
                    className={`p-2 hover:bg-gray-200 rounded transition flex items-center gap-1 ${activeColor ? 'ring-2 ring-blue-500' : ''}`}
                    title={activeColor ? `Cor ativa: ${activeColor}` : "Cor do texto"}
                  >
                    <Palette size={18} />
                    <div 
                      className="w-4 h-4 rounded border border-gray-400"
                      style={{ backgroundColor: selectedColor }}
                    />
                    {activeColor && (
                      <span className="text-xs text-blue-600 font-bold">✓</span>
                    )}
                  </button>
                  
                  {showColorPicker && (
                    <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-xl p-4 z-50 min-w-[240px]">
                      <p className="text-xs font-semibold text-gray-700 mb-1">Escolha uma cor:</p>
                      <p className="text-[10px] text-gray-500 mb-3">Selecione o texto ou escolha antes de digitar</p>
                      <div className="grid grid-cols-5 gap-2 mb-3">
                        {[
                          '#000000', '#FF0000', '#0000FF', '#008000', '#FFA500',
                          '#808080', '#800080', '#FF1493', '#00CED1', '#FFD700',
                          '#8B4513', '#FF6347', '#4169E1', '#32CD32', '#DC143C'
                        ].map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => applyColor(color)}
                            className="w-10 h-10 rounded-lg border-2 hover:scale-110 transition-all shadow-sm relative"
                            style={{ 
                              backgroundColor: color,
                              borderColor: selectedColor === color ? '#1f2937' : '#e5e7eb'
                            }}
                            title={color}
                          >
                            {selectedColor === color && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white text-xl">✓</span>
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                      <div className="border-t pt-3">
                        <label className="text-xs text-gray-600 block mb-2">Cor personalizada:</label>
                        <input
                          type="color"
                          value={selectedColor}
                          onChange={(e) => applyColor(e.target.value)}
                          className="w-full h-10 cursor-pointer rounded border"
                          title="Escolher cor personalizada"
                        />
                      </div>
                      {activeColor && activeColor !== '#000000' && (
                        <button
                          type="button"
                          onClick={() => {
                            setActiveColor(null);
                            setSelectedColor('#000000');
                            toast.success('Cor desativada');
                          }}
                          className="mt-3 w-full py-2 text-sm text-orange-600 bg-orange-50 hover:bg-orange-100 rounded transition border border-orange-200"
                        >
                          ✕ Desativar cor ativa
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setShowColorPicker(false)}
                        className="mt-3 w-full py-2 text-sm text-white bg-gray-700 hover:bg-gray-800 rounded transition"
                      >
                        Fechar
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div
                ref={editorRef}
                contentEditable
                onInput={handleEditorChange}
                onKeyDown={handleKeyDown}
                className="min-h-[300px] p-4 focus:outline-none prose max-w-none"
                style={{ minHeight: '300px' }}
                suppressContentEditableWarning
              />
            </div>
            <p className="text-xs text-gray-500">
              💡 Dica: Selecione o texto e use os botões para formatar (negrito, cores, fontes, tamanhos, listas, etc.)
            </p>
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