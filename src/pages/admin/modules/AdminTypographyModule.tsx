import React, { useState } from 'react';
import { Type, Save, CheckCircle2 } from 'lucide-react';
import { useSiteSettings } from '../../../context/ThemeContext';

export const AdminTypographyModule: React.FC = () => {
  const { settings, updateSettings } = useSiteSettings();
  const [headingFont, setHeadingFont] = useState(settings.typography.headingFont || 'Space Grotesk');
  const [bodyFont, setBodyFont] = useState(settings.typography.bodyFont || 'Plus Jakarta Sans');
  const [baseSize, setBaseSize] = useState(settings.typography.baseSize || '16px');
  const [headingWeight, setHeadingWeight] = useState(settings.typography.headingWeight || '700');
  const [banglaFont, setBanglaFont] = useState('Hind Siliguri');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateSettings({
        typography: {
          headingFont,
          bodyFont,
          baseSize,
          headingWeight,
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
        <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">Typography Configuration</h3>
        <p className="text-xs text-[#A7B2C8]">Configure font families, font sizes, heading weights, and multi-language Bangla support.</p>
      </div>

      {success && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Typography tokens saved to database!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-300 font-medium mb-1">English Heading Font</label>
            <select
              value={headingFont}
              onChange={e => setHeadingFont(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white"
            >
              <option value="Space Grotesk">Space Grotesk (Futuristic Tech)</option>
              <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
              <option value="Inter">Inter Modern</option>
              <option value="JetBrains Mono">JetBrains Mono</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">English Body Font</label>
            <select
              value={bodyFont}
              onChange={e => setBodyFont(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white"
            >
              <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
              <option value="Inter">Inter</option>
              <option value="system-ui">System UI</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Bangla Font Support</label>
            <select
              value={banglaFont}
              onChange={e => setBanglaFont(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white"
            >
              <option value="Hind Siliguri">Hind Siliguri (Modern Clean)</option>
              <option value="Noto Sans Bengali">Noto Sans Bengali</option>
              <option value="SolaimanLipi">SolaimanLipi</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Base Font Size</label>
            <select
              value={baseSize}
              onChange={e => setBaseSize(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#080B14] border border-[#263249] text-white"
            >
              <option value="15px">15px (Compact)</option>
              <option value="16px">16px (Standard Default)</option>
              <option value="17px">17px (High Readability)</option>
            </select>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white font-bold"
          >
            {isSaving ? 'Saving...' : 'Save Typography'}
          </button>
        </div>
      </form>
    </div>
  );
};
