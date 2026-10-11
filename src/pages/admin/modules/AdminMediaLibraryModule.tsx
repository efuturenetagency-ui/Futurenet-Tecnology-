import React, { useState } from 'react';
import { Image, Plus, Copy, Check, Trash2, ExternalLink } from 'lucide-react';
import { MediaAssetItem } from '../../../types';

const INITIAL_MEDIA: MediaAssetItem[] = [
  {
    id: 'm-1',
    name: 'Apex Finance Hero Mockup',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    type: 'image/jpeg',
    size: 420000,
    altText: 'Financial analytics dashboard screenshot',
    createdAt: '2026-10-01',
  },
  {
    id: 'm-2',
    name: 'OmniStore Mobile Storefront',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    type: 'image/jpeg',
    size: 380000,
    altText: 'E-commerce mobile UI',
    createdAt: '2026-10-02',
  },
  {
    id: 'm-3',
    name: 'Meta Ads Conversion Graph',
    url: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80',
    type: 'image/jpeg',
    size: 510000,
    altText: 'Performance growth marketing chart',
    createdAt: '2026-10-03',
  },
];

export const AdminMediaLibraryModule: React.FC = () => {
  const [mediaList, setMediaList] = useState<MediaAssetItem[]>(INITIAL_MEDIA);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');
  const [newAlt, setNewAlt] = useState('');

  const handleCopy = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl.trim() || !newName.trim()) return;
    const item: MediaAssetItem = {
      id: `m_${Date.now()}`,
      name: newName.trim(),
      url: newUrl.trim(),
      type: 'image/png',
      size: 250000,
      altText: newAlt.trim() || newName.trim(),
      createdAt: new Date().toISOString(),
    };
    setMediaList([item, ...mediaList]);
    setNewUrl('');
    setNewName('');
    setNewAlt('');
  };

  const handleDelete = (id: string) => {
    setMediaList(mediaList.filter(m => m.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="p-6 rounded-2xl bg-[#101626] border border-[#263249] space-y-4">
        <div>
          <h3 className="text-base font-bold text-white font-['Space_Grotesk']">
            Media & Asset Library
          </h3>
          <p className="text-xs text-[#A7B2C8]">
            Manage asset URLs for services, portfolio showcases, and company logos without bloating Firestore documents.
          </p>
        </div>

        <form onSubmit={handleAddMedia} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <input
            type="text"
            required
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Asset Name / Label"
            className="px-3.5 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-white text-xs"
          />
          <input
            type="url"
            required
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
            placeholder="HTTPS Image URL"
            className="px-3.5 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-white text-xs font-mono"
          />
          <div className="flex gap-2">
            <input
              type="text"
              value={newAlt}
              onChange={e => setNewAlt(e.target.value)}
              placeholder="Alt Text"
              className="w-full px-3.5 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-white text-xs"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#4F8CFF] text-white text-xs font-bold whitespace-nowrap"
            >
              Add
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {mediaList.map(item => (
          <div key={item.id} className="p-4 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-3">
            <div className="h-44 rounded-xl overflow-hidden bg-[#080B14] border border-[#263249] relative group">
              <img src={item.url} alt={item.altText} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(item.url, item.id)}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold flex items-center gap-1"
                >
                  {copiedId === item.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === item.id ? 'Copied' : 'Copy URL'}</span>
                </button>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-[#141C2E] text-white"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <div>
                <h4 className="font-bold text-white truncate max-w-[180px]">{item.name}</h4>
                <span className="text-[10px] text-slate-400">alt: {item.altText}</span>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="p-1 text-slate-400 hover:text-rose-400"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
