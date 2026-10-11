import React, { useState, useEffect } from 'react';
import {
  Image,
  Plus,
  Trash2,
  Edit,
  Globe,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Sparkles,
  X,
} from 'lucide-react';
import { ClientLogoItem } from '../../../types';
import {
  getClientLogos,
  saveClientLogo,
  deleteClientLogo,
  logAdminActivity,
} from '../../../lib/dataService';
import { useAuth } from '../../../context/AuthContext';

export const AdminClientLogosModule: React.FC = () => {
  const { user, demoUser } = useAuth();
  const adminEmail = user?.email || demoUser?.email || 'admin@futurenttech.com';

  const [logos, setLogos] = useState<ClientLogoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLogo, setEditingLogo] = useState<Partial<ClientLogoItem> | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const list = await getClientLogos();
      setLogos(list);
    } catch (e) {
      console.error('Error loading client logos:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLogo?.clientName || !editingLogo?.logoUrl) return;

    const logoToSave: ClientLogoItem = {
      id: editingLogo.id || `logo_${Date.now()}`,
      clientName: editingLogo.clientName,
      websiteUrl: editingLogo.websiteUrl || '',
      logoUrl: editingLogo.logoUrl,
      altText: editingLogo.altText || `${editingLogo.clientName} Brand Logo`,
      isFeatured: editingLogo.isFeatured ?? true,
      isEnabled: editingLogo.isEnabled ?? true,
      displayOrder: Number(editingLogo.displayOrder) || logos.length + 1,
      createdAt: editingLogo.createdAt || new Date().toISOString(),
    };

    await saveClientLogo(logoToSave);
    await logAdminActivity(
      adminEmail,
      editingLogo.id ? 'UPDATE_CLIENT_LOGO' : 'ADD_CLIENT_LOGO',
      'clientLogos',
      logoToSave.clientName
    );

    setIsModalOpen(false);
    setEditingLogo(null);
    loadData();
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Remove client logo "${name}"?`)) {
      await deleteClientLogo(id);
      await logAdminActivity(adminEmail, 'DELETE_CLIENT_LOGO', 'clientLogos', name);
      loadData();
    }
  };

  const handleToggle = async (logo: ClientLogoItem) => {
    await saveClientLogo({ ...logo, isEnabled: !logo.isEnabled });
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#101626] border border-[#263249] rounded-2xl p-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider mb-1">
              <Image className="w-4 h-4" />
              Brand Proof & Social Validation
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Space_Grotesk'] text-white">
              Client Logo Board
            </h2>
            <p className="text-sm text-[#A7B2C8] mt-1 max-w-2xl">
              Showcase trusted enterprises, strategic partner logos, and portfolio brand badges on
              the homepage and about page.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingLogo({
                clientName: '',
                logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
                websiteUrl: 'https://example.com',
                altText: '',
                isFeatured: true,
                isEnabled: true,
                displayOrder: logos.length + 1,
              });
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/10 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Client Logo
          </button>
        </div>
      </div>

      {/* Logos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {logos.map(logo => (
          <div
            key={logo.id}
            className="bg-[#101626] border border-[#263249] rounded-2xl p-4 flex flex-col justify-between hover:border-cyan-500/30 transition-all"
          >
            <div>
              <div className="h-24 rounded-xl bg-[#080B14] border border-[#263249] flex items-center justify-center p-3 mb-3 overflow-hidden">
                <img
                  src={logo.logoUrl}
                  alt={logo.altText}
                  className="max-h-full max-w-full object-contain filter grayscale hover:grayscale-0 transition-all"
                />
              </div>

              <div className="flex items-center justify-between mb-1">
                <h4 className="font-bold text-white text-xs truncate max-w-[150px]">
                  {logo.clientName}
                </h4>
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                    logo.isEnabled ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {logo.isEnabled ? 'ACTIVE' : 'OFF'}
                </span>
              </div>

              {logo.websiteUrl && (
                <a
                  href={logo.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-cyan-400 hover:underline flex items-center gap-1 font-mono truncate mb-2"
                >
                  <Globe className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{logo.websiteUrl}</span>
                </a>
              )}
            </div>

            <div className="pt-3 border-t border-[#263249] flex items-center justify-between">
              <span className="text-[10px] text-slate-500 font-mono">Order: #{logo.displayOrder}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleToggle(logo)}
                  title={logo.isEnabled ? 'Disable' : 'Enable'}
                  className="p-1.5 rounded-lg bg-[#141C2E] text-slate-400 hover:text-white cursor-pointer"
                >
                  {logo.isEnabled ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <XCircle className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => {
                    setEditingLogo(logo);
                    setIsModalOpen(true);
                  }}
                  className="p-1.5 rounded-lg bg-[#141C2E] text-slate-400 hover:text-cyan-300 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(logo.id, logo.clientName)}
                  className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && editingLogo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#101626] border border-[#263249] rounded-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#263249] pb-3">
              <h3 className="text-base font-bold font-['Space_Grotesk'] text-white">
                {editingLogo.id ? 'Edit Client Logo' : 'Add Client Brand Logo'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  value={editingLogo.clientName || ''}
                  onChange={e => setEditingLogo({ ...editingLogo, clientName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Logo Image URL *</label>
                <input
                  type="url"
                  required
                  value={editingLogo.logoUrl || ''}
                  onChange={e => setEditingLogo({ ...editingLogo, logoUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Website URL</label>
                <input
                  type="url"
                  value={editingLogo.websiteUrl || ''}
                  onChange={e => setEditingLogo({ ...editingLogo, websiteUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingLogo.displayOrder || 1}
                    onChange={e => setEditingLogo({ ...editingLogo, displayOrder: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-xs text-white"
                  />
                </div>
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingLogo.isEnabled ?? true}
                      onChange={e => setEditingLogo({ ...editingLogo, isEnabled: e.target.checked })}
                      className="rounded border-[#263249] text-cyan-500 focus:ring-0"
                    />
                    Enabled
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-[#263249] flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#141C2E] border border-[#263249] text-slate-300 text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold text-xs cursor-pointer"
                >
                  Save Logo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
