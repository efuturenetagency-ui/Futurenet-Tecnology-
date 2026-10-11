import React, { useState } from 'react';
import { Plus, Edit, Trash2, Star, X } from 'lucide-react';
import { TestimonialItem } from '../../../types';
import { saveTestimonial, deleteTestimonial } from '../../../lib/dataService';

export const AdminTestimonialsModule: React.FC<{
  testimonials: TestimonialItem[];
  onTestimonialsUpdated: (updated: TestimonialItem[]) => void;
}> = ({ testimonials, onTestimonialsUpdated }) => {
  const [editing, setEditing] = useState<TestimonialItem | null>(null);
  const [clientName, setClientName] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [quote, setQuote] = useState('');
  const [rating, setRating] = useState(5);
  const [avatar, setAvatar] = useState('');

  const openNew = () => {
    setEditing({} as TestimonialItem);
    setClientName('');
    setCompany('');
    setRole('');
    setQuote('');
    setRating(5);
    setAvatar('');
  };

  const openEdit = (t: TestimonialItem) => {
    setEditing(t);
    setClientName(t.clientName);
    setCompany(t.company);
    setRole(t.role);
    setQuote(t.quote);
    setRating(t.rating);
    setAvatar(t.avatar || '');
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete testimonial?')) {
      await deleteTestimonial(id);
      onTestimonialsUpdated(testimonials.filter(t => t.id !== id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editing?.id || `test_${Date.now()}`;
    const item: TestimonialItem = {
      id,
      clientName: clientName.trim(),
      company: company.trim(),
      role: role.trim(),
      quote: quote.trim(),
      rating,
      avatar: avatar.trim() || undefined,
      isActive: true,
      order: editing?.order || testimonials.length + 1,
    };
    await saveTestimonial(item);
    if (!editing?.id) {
      onTestimonialsUpdated([...testimonials, item]);
    } else {
      onTestimonialsUpdated(testimonials.map(t => (t.id === id ? item : t)));
    }
    setEditing(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-5 rounded-2xl bg-[#101626] border border-[#263249] flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
            Testimonials & Client Endorsements
          </h3>
          <p className="text-xs text-[#A7B2C8]">Manage client reviews displayed on public landing pages.</p>
        </div>
        <button
          onClick={openNew}
          className="px-4 py-2 rounded-xl bg-[#4F8CFF] text-white text-xs font-bold flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map(t => (
          <div key={t.id} className="p-5 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex gap-1 text-amber-400">
                {[...Array(t.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs text-slate-300 italic">"{t.quote}"</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#263249]/60">
              <div>
                <div className="text-xs font-bold text-white">{t.clientName}</div>
                <div className="text-[10px] text-slate-400">{t.role}, {t.company}</div>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => openEdit(t)}
                  className="p-1 rounded bg-[#080B14] border border-[#263249] text-slate-300 hover:text-cyan-300"
                >
                  <Edit className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-1 rounded bg-[#080B14] border border-[#263249] text-slate-300 hover:text-rose-300"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-[#101626] border border-[#263249] rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-[#263249] pb-3">
              <h3 className="text-base font-bold text-white">Testimonial Record</h3>
              <button type="button" onClick={() => setEditing(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Client Full Name</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={e => setClientName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-300 mb-1">Company</label>
                <input
                  type="text"
                  required
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1">Role</label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={e => setRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Avatar Image URL (Optional)</label>
              <input
                type="text"
                value={avatar}
                onChange={e => setAvatar(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Testimonial Quote</label>
              <textarea
                rows={3}
                required
                value={quote}
                onChange={e => setQuote(e.target.value)}
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
