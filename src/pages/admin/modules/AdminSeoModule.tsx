import React, { useState } from 'react';
import { Globe, Save, CheckCircle2 } from 'lucide-react';
import { useSiteSettings } from '../../../context/ThemeContext';

export const AdminSeoModule: React.FC = () => {
  const { settings, updateSettings } = useSiteSettings();
  const [metaTitle, setMetaTitle] = useState(settings.seo?.metaTitle || '');
  const [metaDesc, setMetaDesc] = useState(settings.seo?.metaDescription || '');
  const [keywords, setKeywords] = useState(settings.seo?.keywords || '');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings({
        seo: {
          metaTitle: metaTitle.trim(),
          metaDescription: metaDesc.trim(),
          keywords: keywords.trim(),
        },
      });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl animate-fade-in">
      <div className="p-6 rounded-2xl bg-[#101626] border border-[#263249] space-y-1">
        <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">SEO & Social Meta Tags</h3>
        <p className="text-xs text-[#A7B2C8]">Configure canonical page titles, meta descriptions, and OpenGraph social preview tags.</p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>SEO configuration updated!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-medium mb-1">Global Meta Title *</label>
          <input
            type="text"
            required
            value={metaTitle}
            onChange={e => setMetaTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">Global Meta Description *</label>
          <textarea
            rows={3}
            required
            value={metaDesc}
            onChange={e => setMetaDesc(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs resize-none"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">Search Keywords (Comma-separated)</label>
          <input
            type="text"
            value={keywords}
            onChange={e => setKeywords(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs"
          />
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white font-bold"
          >
            {isSaving ? 'Saving...' : 'Save SEO Configuration'}
          </button>
        </div>
      </form>
    </div>
  );
};
