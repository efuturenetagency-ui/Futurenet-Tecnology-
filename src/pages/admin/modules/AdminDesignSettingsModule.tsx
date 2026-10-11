import React, { useState } from 'react';
import {
  Palette,
  Save,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Sliders,
  Eye,
} from 'lucide-react';
import { useSiteSettings } from '../../../context/ThemeContext';
import { SiteColors } from '../../../types';

export const AdminDesignSettingsModule: React.FC = () => {
  const { settings, updateSettings } = useSiteSettings();
  const [colors, setColors] = useState<SiteColors>({ ...settings.colors });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const colorFields: { key: keyof SiteColors; label: string; desc: string }[] = [
    { key: 'primaryBg', label: 'Primary Background', desc: 'Main canvas background (#080B14)' },
    { key: 'secondaryBg', label: 'Secondary Background', desc: 'Panels & modal canvas (#101626)' },
    { key: 'cardBg', label: 'Card Background', desc: 'Service cards & content blocks (#141C2E)' },
    { key: 'primaryAccent', label: 'Primary Accent', desc: 'Brand blue & primary action buttons (#4F8CFF)' },
    { key: 'secondaryAccent', label: 'Secondary Accent', desc: 'Purple gradients & highlights (#8B5CF6)' },
    { key: 'neonCyan', label: 'Neon Cyan Accent', desc: 'Glow rings, borders, and badges (#22D3EE)' },
    { key: 'primaryText', label: 'Primary Text', desc: 'Headings and high-contrast labels (#F8FAFC)' },
    { key: 'secondaryText', label: 'Secondary Text', desc: 'Subtitles & body descriptions (#A7B2C8)' },
    { key: 'borders', label: 'Border Grids', desc: 'Subtle technical container dividers (#263249)' },
  ];

  const handleColorChange = (key: keyof SiteColors, val: string) => {
    setColors(prev => ({ ...prev, [key]: val }));
  };

  const handleResetToDefault = () => {
    const defaults: SiteColors = {
      primaryBg: '#080B14',
      secondaryBg: '#101626',
      cardBg: '#141C2E',
      primaryAccent: '#4F8CFF',
      secondaryAccent: '#8B5CF6',
      neonCyan: '#22D3EE',
      primaryText: '#F8FAFC',
      secondaryText: '#A7B2C8',
      borders: '#263249',
    };
    setColors(defaults);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateSettings({ colors });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error('Error saving colors:', e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Intro Header */}
      <div className="p-6 rounded-2xl bg-[#101626] border border-[#263249] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-semibold uppercase">
            <Palette className="w-4 h-4" />
            <span>Theme & Color System</span>
          </div>
          <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white mt-1">
            Visual Design Settings
          </h3>
          <p className="text-xs text-[#A7B2C8]">
            Configure the 2026 Dark Futuristic design tokens. All adjustments sync directly to the public website via dynamic CSS variables.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetToDefault}
            className="px-3.5 py-2 rounded-xl border border-[#263249] hover:bg-[#141C2E] text-slate-300 text-xs font-medium flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Default 2026 Palette</span>
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Applying...' : 'Apply Live Theme'}</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>Colors updated successfully! Live website theme re-rendered.</span>
        </div>
      )}

      {/* Color Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {colorFields.map(field => (
          <div
            key={field.key}
            className="p-5 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-3"
          >
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white font-['Space_Grotesk']">
                {field.label}
              </label>
              <div
                className="w-7 h-7 rounded-lg border border-white/20 shadow-inner"
                style={{ backgroundColor: colors[field.key] }}
              />
            </div>

            <p className="text-[11px] text-[#A7B2C8] leading-tight">{field.desc}</p>

            <div className="flex items-center gap-3 pt-1">
              <input
                type="color"
                value={colors[field.key]}
                onChange={e => handleColorChange(field.key, e.target.value)}
                className="w-9 h-9 rounded-lg border-0 bg-transparent cursor-pointer p-0"
              />
              <input
                type="text"
                value={colors[field.key]}
                onChange={e => handleColorChange(field.key, e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg bg-[#080B14] border border-[#263249] text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Live Preview Box */}
      <div className="p-8 rounded-3xl border space-y-6" style={{ backgroundColor: colors.secondaryBg, borderColor: colors.borders }}>
        <div className="flex items-center justify-between border-b pb-4" style={{ borderColor: colors.borders }}>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4" style={{ color: colors.neonCyan }} />
            <h4 className="text-sm font-bold font-['Space_Grotesk']" style={{ color: colors.primaryText }}>
              Live Theme Preview Box
            </h4>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded" style={{ backgroundColor: colors.cardBg, color: colors.neonCyan }}>
            Real-Time Sample
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Sample Card */}
          <div
            className="p-6 rounded-2xl border space-y-4"
            style={{ backgroundColor: colors.cardBg, borderColor: colors.borders }}
          >
            <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold" style={{ backgroundColor: colors.primaryBg, color: colors.neonCyan }}>
              FT
            </div>
            <h5 className="text-base font-bold font-['Space_Grotesk']" style={{ color: colors.primaryText }}>
              Next-Gen Cloud Architecture
            </h5>
            <p className="text-xs leading-relaxed" style={{ color: colors.secondaryText }}>
              High-throughput data synchronization with real-time Firestore persistence and zero-trust security.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${colors.primaryAccent}, ${colors.secondaryAccent})`,
                }}
              >
                Sample Button
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-xl text-xs font-semibold border cursor-pointer"
                style={{ borderColor: colors.neonCyan, color: colors.neonCyan }}
              >
                Ghost Accent
              </button>
            </div>
          </div>

          {/* Sample Metrics / Tag */}
          <div
            className="p-6 rounded-2xl border flex flex-col justify-between"
            style={{ backgroundColor: colors.primaryBg, borderColor: colors.borders }}
          >
            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider" style={{ color: colors.neonCyan }}>
                Metric Visualization
              </span>
              <div className="text-3xl font-extrabold font-mono" style={{ color: colors.primaryAccent }}>
                $4,800.00
              </div>
              <p className="text-xs" style={{ color: colors.secondaryText }}>
                Simulated agreed project budget representation with current color tokens.
              </p>
            </div>

            <div className="pt-4 border-t flex justify-between text-xs" style={{ borderColor: colors.borders, color: colors.secondaryText }}>
              <span>Primary Text Contrast</span>
              <strong style={{ color: colors.primaryText }}>Accessible 2026</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
