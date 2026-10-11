import React, { useState } from 'react';
import { Plus, Edit, Trash2, Save, X, ExternalLink, Image } from 'lucide-react';
import { PortfolioProjectItem } from '../../../types';
import { savePortfolioProject, deletePortfolioProject } from '../../../lib/dataService';

export const AdminPortfolioModule: React.FC<{
  portfolio: PortfolioProjectItem[];
  onPortfolioUpdated: (updated: PortfolioProjectItem[]) => void;
}> = ({ portfolio, onPortfolioUpdated }) => {
  const [editingItem, setEditingItem] = useState<PortfolioProjectItem | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Website Development');
  const [description, setDescription] = useState('');
  const [client, setClient] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);

  const openNew = () => {
    setEditingItem({} as PortfolioProjectItem);
    setTitle('');
    setCategory('Website Development');
    setDescription('');
    setClient('');
    setTags('React, TypeScript, Cloud Firestore');
    setImageUrl('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80');
    setIsActive(true);
  };

  const openEdit = (p: PortfolioProjectItem) => {
    setEditingItem(p);
    setTitle(p.title);
    setCategory(p.category);
    setDescription(p.description);
    setClient(p.client || '');
    setTags(p.tags.join(', '));
    setImageUrl(p.image);
    setIsActive(p.isActive);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this portfolio project?')) {
      await deletePortfolioProject(id);
      onPortfolioUpdated(portfolio.filter(p => p.id !== id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editingItem?.id || `port_${Date.now()}`;
    const item: PortfolioProjectItem = {
      id,
      title: title.trim(),
      category: category.trim(),
      description: description.trim(),
      client: client.trim() || undefined,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      image: imageUrl.trim(),
      featured: true,
      order: editingItem?.order || portfolio.length + 1,
      isActive,
    };
    await savePortfolioProject(item);
    if (!editingItem?.id) {
      onPortfolioUpdated([...portfolio, item]);
    } else {
      onPortfolioUpdated(portfolio.map(p => (p.id === id ? item : p)));
    }
    setEditingItem(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-5 rounded-2xl bg-[#101626] border border-[#263249] flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
            Portfolio Showcase Management
          </h3>
          <p className="text-xs text-[#A7B2C8]">
            Manage featured projects shown on the homepage portfolio section.
          </p>
        </div>
        <button
          onClick={openNew}
          className="px-4 py-2 rounded-xl bg-[#4F8CFF] text-white text-xs font-bold flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {portfolio.map(item => (
          <div key={item.id} className="p-5 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-4">
            <div className="h-40 rounded-xl overflow-hidden relative border border-[#263249]">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/70 text-cyan-300 text-[10px] font-mono">
                {item.category}
              </span>
            </div>

            <div>
              <h4 className="text-base font-bold text-white">{item.title}</h4>
              <p className="text-xs text-[#A7B2C8] line-clamp-2 mt-1">{item.description}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#263249]/60">
              <span className={`text-[10px] uppercase font-semibold ${item.isActive ? 'text-emerald-400' : 'text-slate-400'}`}>
                {item.isActive ? 'Active' : 'Inactive'}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(item)}
                  className="p-1.5 rounded-lg bg-[#080B14] border border-[#263249] text-slate-300 hover:text-cyan-300"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg bg-[#080B14] border border-[#263249] text-slate-300 hover:text-rose-300"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-[#101626] border border-[#263249] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-[#263249] pb-3">
              <h3 className="text-base font-bold text-white">
                {editingItem.id ? 'Edit Project' : 'New Project'}
              </h3>
              <button type="button" onClick={() => setEditingItem(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Project Title</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">Category</label>
                <input
                  type="text"
                  required
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Client</label>
                <input
                  type="text"
                  value={client}
                  onChange={e => setClient(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Image URL</label>
              <input
                type="text"
                required
                value={imageUrl}
                onChange={e => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Tags (Comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Description</label>
              <textarea
                rows={3}
                required
                value={description}
                onChange={e => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white resize-none"
              />
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#263249]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={e => setIsActive(e.target.checked)}
                />
                <span>Active</span>
              </label>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 rounded-xl border border-[#263249] text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white font-bold"
                >
                  Save Project
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
