import React, { useState } from 'react';
import { Search, Mail, Eye, Trash2, CheckCircle2, MessageSquare, X, Save } from 'lucide-react';
import { ContactMessageItem } from '../../../types';
import { updateContactMessage } from '../../../lib/dataService';

interface ContactMessagesModuleProps {
  messages: ContactMessageItem[];
  onMessagesUpdated: (updated: ContactMessageItem[]) => void;
}

export const AdminContactMessagesModule: React.FC<ContactMessagesModuleProps> = ({
  messages,
  onMessagesUpdated,
}) => {
  const [search, setSearch] = useState('');
  const [selectedMsg, setSelectedMsg] = useState<ContactMessageItem | null>(null);
  const [replyNotes, setReplyNotes] = useState('');
  const [statusVal, setStatusVal] = useState<'new' | 'replied' | 'archived'>('new');
  const [isSaving, setIsSaving] = useState(false);

  const openMsg = async (msg: ContactMessageItem) => {
    setSelectedMsg(msg);
    setReplyNotes(msg.internalNotes || '');
    setStatusVal(msg.status);
    if (!msg.isRead) {
      const updated = await updateContactMessage(msg.id, { isRead: true });
      onMessagesUpdated(messages.map(m => (m.id === msg.id ? updated : m)));
    }
  };

  const handleSave = async () => {
    if (!selectedMsg) return;
    setIsSaving(true);
    try {
      const updated = await updateContactMessage(selectedMsg.id, {
        status: statusVal,
        internalNotes: replyNotes.trim() || undefined,
      });
      setSelectedMsg(updated);
      onMessagesUpdated(messages.map(m => (m.id === updated.id ? updated : m)));
    } finally {
      setIsSaving(false);
    }
  };

  const filtered = messages.filter(m => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      m.email.toLowerCase().includes(q) ||
      m.subject.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-5 rounded-2xl bg-[#101626] border border-[#263249] flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search contact inquiries..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#141C2E] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400"
          />
        </div>
        <span className="text-xs text-[#A7B2C8]">
          Total Messages: <strong>{messages.length}</strong> ({messages.filter(m => !m.isRead).length} Unread)
        </span>
      </div>

      <div className="rounded-2xl bg-[#101626] border border-[#263249] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#080B14] border-b border-[#263249] text-[#A7B2C8] uppercase font-mono">
            <tr>
              <th className="py-3 px-4">Sender</th>
              <th className="py-3 px-4">Subject</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#263249]/60">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-[#A7B2C8]">
                  No messages submitted yet.
                </td>
              </tr>
            ) : (
              filtered.map(m => (
                <tr
                  key={m.id}
                  onClick={() => openMsg(m)}
                  className={`hover:bg-[#141C2E]/60 transition-colors cursor-pointer ${
                    !m.isRead ? 'font-semibold text-white bg-blue-500/5' : 'text-[#A7B2C8]'
                  }`}
                >
                  <td className="py-3 px-4">
                    <div className="text-white">{m.name}</div>
                    <div className="text-[11px] text-slate-400">{m.email}</div>
                  </td>
                  <td className="py-3 px-4 text-white">
                    <div>{m.subject}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-xs">{m.message}</div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    {new Date(m.createdAt).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] uppercase font-semibold ${
                        m.status === 'replied'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : m.status === 'archived'
                          ? 'bg-slate-500/20 text-slate-300'
                          : 'bg-cyan-500/20 text-cyan-300'
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      className="p-1.5 rounded-lg bg-[#141C2E] border border-[#263249] text-slate-300 hover:text-cyan-300"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedMsg && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#101626] border border-[#263249] rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-5 text-xs text-[#F8FAFC]">
            <div className="flex justify-between items-center border-b border-[#263249] pb-3">
              <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
                Inquiry: {selectedMsg.subject}
              </h3>
              <button onClick={() => setSelectedMsg(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 bg-[#080B14] p-4 rounded-xl border border-[#263249]">
              <div className="flex justify-between text-slate-400">
                <span>From: <strong className="text-white">{selectedMsg.name}</strong> ({selectedMsg.email})</span>
                {selectedMsg.phone && <span>Phone: {selectedMsg.phone}</span>}
              </div>
              <p className="text-slate-200 whitespace-pre-line leading-relaxed pt-2 border-t border-[#263249]">
                {selectedMsg.message}
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Status</label>
                <select
                  value={statusVal}
                  onChange={e => setStatusVal(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs"
                >
                  <option value="new">New</option>
                  <option value="replied">Replied</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Internal Review Notes</label>
                <textarea
                  rows={2}
                  value={replyNotes}
                  onChange={e => setReplyNotes(e.target.value)}
                  placeholder="Private manager notes..."
                  className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs resize-none"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-[#263249]">
              <a
                href={`mailto:${selectedMsg.email}?subject=Re: ${encodeURIComponent(selectedMsg.subject)}`}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Reply Via Email</span>
              </a>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMsg(null)}
                  className="px-4 py-2 rounded-xl border border-[#263249] text-slate-300"
                >
                  Close
                </button>
                <button
                  type="button"
                  disabled={isSaving}
                  onClick={handleSave}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white font-bold"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
