import React, { useState } from 'react';
import { Plus, Edit, Trash2, X, Save } from 'lucide-react';
import { ServiceCategory } from '../../../types';
import { saveCategory, deleteCategory } from '../../../lib/dataService';

export const AdminCategoriesModule: React.FC<{
  categories: ServiceCategory[];
  onCategoriesUpdated: (updated: ServiceCategory[]) => void;
}> = ({ categories, onCategoriesUpdated }) => {
  const [editing, setEditing] = useState<ServiceCategory | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [desc, setDesc] = useState('');
  const [order, setOrder] = useState<number>(1);
  const [icon, setIcon] = useState('Layers');

  const openNew = () => {
    setEditing({} as ServiceCategory);
    setName('');
    setSlug('');
    setDesc('');
    setOrder(categories.length + 1);
    setIcon('Layers');
  };

  const openEdit = (c: ServiceCategory) => {
    setEditing(c);
    setName(c.name);
    setSlug(c.slug);
    setDesc(c.description);
    setOrder(c.order);
    setIcon(c.icon || 'Layers');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this category?')) {
      await deleteCategory(id);
      onCategoriesUpdated(categories.filter(c => c.id !== id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editing?.id || slug.trim().toLowerCase();
    const item: ServiceCategory = {
      id,
      name: name.trim(),
      slug: slug.trim().toLowerCase(),
      description: desc.trim(),
      order: Number(order),
      isActive: true,
      icon,
    };
    await saveCategory(item);
    if (!editing?.id) {
      onCategoriesUpdated([...categories, item]);
    } else {
      onCategoriesUpdated(categories.map(c => (c.id === id ? item : c)));
    }
    setEditing(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-5 rounded-2xl bg-[#101626] border border-[#263249] flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
            Service Categories Management
          </h3>
          <p className="text-xs text-[#A7B2C8]">
            Manage the 5 primary tech and marketing categories.
          </p>
        </div>
        <button
          onClick={openNew}
          className="px-4 py-2 rounded-xl bg-[#4F8CFF] text-white text-xs font-bold flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map(c => (
          <div key={c.id} className="p-5 rounded-2xl bg-[#141C2E] border border-[#263249] flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-slate-400 font-bold">0{c.order}</span>
                <h4 className="text-sm font-bold text-white font-['Space_Grotesk']">{c.name}</h4>
              </div>
              <span className="text-[11px] font-mono text-cyan-400 block mt-0.5">slug: {c.slug}</span>
              <p className="text-xs text-[#A7B2C8] mt-2">{c.description}</p>
            </div>

            <div className="flex gap-1.5 flex-shrink-0">
              <button
                onClick={() => openEdit(c)}
                className="p-1.5 rounded-lg bg-[#080B14] border border-[#263249] text-slate-300 hover:text-cyan-300"
              >
                <Edit className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(c.id)}
                className="p-1.5 rounded-lg bg-[#080B14] border border-[#263249] text-slate-300 hover:text-rose-300"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-[#101626] border border-[#263249] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-[#263249] pb-3">
              <h3 className="text-base font-bold text-white">Category Record</h3>
              <button type="button" onClick={() => setEditing(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Category Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  if (!editing.id) setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Slug Identifier</label>
              <input
                type="text"
                required
                value={slug}
                onChange={e => setSlug(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Display Order</label>
              <input
                type="number"
                value={order}
                onChange={e => setOrder(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Description</label>
              <textarea
                rows={3}
                required
                value={desc}
                onChange={e => setDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#263249]">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="px-4 py-2 rounded-xl border border-[#263249] text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white font-bold"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
