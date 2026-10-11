import React, { useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { FaqItem } from '../../../types';
import { saveFaq, deleteFaq } from '../../../lib/dataService';

export const AdminFaqsModule: React.FC<{
  faqs: FaqItem[];
  onFaqsUpdated: (updated: FaqItem[]) => void;
}> = ({ faqs, onFaqsUpdated }) => {
  const [editing, setEditing] = useState<FaqItem | null>(null);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('General');

  const openNew = () => {
    setEditing({} as FaqItem);
    setQuestion('');
    setAnswer('');
    setCategory('General');
  };

  const openEdit = (f: FaqItem) => {
    setEditing(f);
    setQuestion(f.question);
    setAnswer(f.answer);
    setCategory(f.category);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete FAQ item?')) {
      await deleteFaq(id);
      onFaqsUpdated(faqs.filter(f => f.id !== id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = editing?.id || `faq_${Date.now()}`;
    const item: FaqItem = {
      id,
      question: question.trim(),
      answer: answer.trim(),
      category: category.trim(),
      isActive: true,
      order: editing?.order || faqs.length + 1,
    };
    await saveFaq(item);
    if (!editing?.id) {
      onFaqsUpdated([...faqs, item]);
    } else {
      onFaqsUpdated(faqs.map(f => (f.id === id ? item : f)));
    }
    setEditing(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-5 rounded-2xl bg-[#101626] border border-[#263249] flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
            FAQ Management
          </h3>
          <p className="text-xs text-[#A7B2C8]">Questions and answers displayed in public accordions.</p>
        </div>
        <button
          onClick={openNew}
          className="px-4 py-2 rounded-xl bg-[#4F8CFF] text-white text-xs font-bold flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add FAQ</span>
        </button>
      </div>

      <div className="space-y-3">
        {faqs.map(f => (
          <div key={f.id} className="p-5 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-['Space_Grotesk']">{f.question}</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/10 text-cyan-300 border border-blue-500/30">
                  {f.category}
                </span>
              </div>
              <div className="flex gap-1.5">
                <button
                  onClick={() => openEdit(f)}
                  className="p-1 rounded bg-[#080B14] border border-[#263249] text-slate-300 hover:text-cyan-300"
                >
                  <Edit className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleDelete(f.id)}
                  className="p-1 rounded bg-[#080B14] border border-[#263249] text-slate-300 hover:text-rose-300"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
            <p className="text-xs text-[#A7B2C8] leading-relaxed">{f.answer}</p>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleSave} className="bg-[#101626] border border-[#263249] rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-[#263249] pb-3">
              <h3 className="text-base font-bold text-white">FAQ Item</h3>
              <button type="button" onClick={() => setEditing(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

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
              <label className="block text-slate-300 mb-1">Question</label>
              <input
                type="text"
                required
                value={question}
                onChange={e => setQuestion(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 mb-1">Answer</label>
              <textarea
                rows={4}
                required
                value={answer}
                onChange={e => setAnswer(e.target.value)}
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
