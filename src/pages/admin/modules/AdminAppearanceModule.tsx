import React, { useState } from 'react';
import {
  Sliders,
  Palette,
  Image,
  Sun,
  Moon,
  Sparkles,
  Layers,
  Save,
  CheckCircle2,
  DollarSign,
  Type,
  Eye,
  RotateCcw,
} from 'lucide-react';
import { useSiteSettings, DEFAULT_DARK_COLORS, DEFAULT_LIGHT_COLORS, THEME_PRESETS } from '../../../context/ThemeContext';
import { SiteColors, ThemeId } from '../../../types';

export const AdminAppearanceModule: React.FC = () => {
  const {
    settings,
    updateSettings,
    themeMode,
    toggleThemeMode,
    setThemeMode,
    currentThemeId,
    setThemePreset,
    currency,
    setCurrency,
  } = useSiteSettings();

  // Active sub-tab
  const [activeTab, setActiveTab] = useState<'branding' | 'theme' | 'palette' | 'currency'>('theme');

  // Form states
  const [brandName, setBrandName] = useState(settings.brandName || 'Futurent Technology');
  const [tagline, setTagline] = useState(settings.tagline || '');
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '');
  const [logoLightUrl, setLogoLightUrl] = useState(settings.logoLightUrl || '');
  const [logoDarkUrl, setLogoDarkUrl] = useState(settings.logoDarkUrl || '');
  const [logoWidth, setLogoWidth] = useState(settings.logoWidth || 160);
  const [logoMaxHeight, setLogoMaxHeight] = useState(settings.logoMaxHeight || 42);
  const [faviconUrl, setFaviconUrl] = useState(settings.faviconUrl || '');
  const [showBrandText, setShowBrandText] = useState(settings.showBrandText !== false);
  const [showTagline, setShowTagline] = useState(settings.showTagline !== false);

  // Theme & Cyber settings
  const [cyberStyleEnabled, setCyberStyleEnabled] = useState(settings.cyberStyleEnabled !== false);
  const [glowEffectsEnabled, setGlowEffectsEnabled] = useState(settings.glowEffectsEnabled !== false);
  const [futuristicBorders, setFuturisticBorders] = useState(settings.futuristicBorders !== false);

  // Currency Settings
  const [defaultCurrency, setDefaultCurrency] = useState<'USD' | 'BDT'>(
    settings.currencySettings?.defaultCurrency || 'USD'
  );
  const [usdToBdtRate, setUsdToBdtRate] = useState<number>(
    settings.currencySettings?.usdToBdtRate || 120
  );
  const [allowUserCurrencyToggle, setAllowUserCurrencyToggle] = useState(
    settings.currencySettings?.allowUserCurrencyToggle !== false
  );

  // Palettes (Light & Dark independent)
  const [paletteMode, setPaletteMode] = useState<'dark' | 'light'>('dark');
  const [darkColors, setDarkColors] = useState<SiteColors>(settings.darkColors || settings.colors || DEFAULT_DARK_COLORS);
  const [lightColors, setLightColors] = useState<SiteColors>(settings.lightColors || DEFAULT_LIGHT_COLORS);

  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const colorFields: { key: keyof SiteColors; label: string; desc: string }[] = [
    { key: 'primaryBg', label: 'Primary Canvas Background', desc: 'Main viewport page background' },
    { key: 'secondaryBg', label: 'Secondary / Panel Surface', desc: 'Headers, navigation backdrops and modaled panels' },
    { key: 'cardBg', label: 'Card & Container Surface', desc: 'Service cards, tiers, and technical units' },
    { key: 'primaryAccent', label: 'Primary Brand Accent', desc: 'Main interactive brand highlights and action buttons' },
    { key: 'secondaryAccent', label: 'Secondary Accent', desc: 'Complementary gradients and secondary highlights' },
    { key: 'neonCyan', label: 'Cyber Neon / Glow Tone', desc: 'Terminal highlights, cyber borders, and active indicators' },
    { key: 'primaryText', label: 'Primary High-Contrast Text', desc: 'Main titles, headlines, and prominent labels' },
    { key: 'secondaryText', label: 'Secondary Subdued Text', desc: 'Descriptions, metrics context, and subtitles' },
    { key: 'borders', label: 'Border Grids & Dividers', desc: 'Technical card borders and subtle dividers' },
  ];

  const handleDarkColorChange = (key: keyof SiteColors, val: string) => {
    setDarkColors(prev => ({ ...prev, [key]: val }));
  };

  const handleLightColorChange = (key: keyof SiteColors, val: string) => {
    setLightColors(prev => ({ ...prev, [key]: val }));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      await updateSettings({
        brandName: brandName.trim(),
        tagline: tagline.trim(),
        logoUrl: logoUrl.trim(),
        logoLightUrl: logoLightUrl.trim(),
        logoDarkUrl: logoDarkUrl.trim(),
        logoWidth: Number(logoWidth) || 160,
        logoMaxHeight: Number(logoMaxHeight) || 42,
        faviconUrl: faviconUrl.trim(),
        showBrandText,
        showTagline,
        cyberStyleEnabled,
        glowEffectsEnabled,
        futuristicBorders,
        colors: darkColors,
        darkColors,
        lightColors,
        currencySettings: {
          defaultCurrency,
          usdToBdtRate: Number(usdToBdtRate) || 120,
          allowUserCurrencyToggle,
        },
      });
      setSuccessMsg('Appearance and theme settings saved & published successfully!');
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (e: any) {
      console.error('Failed to save appearance settings:', e);
      alert('Error updating settings: ' + (e?.message || 'Unknown'));
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
            <Sliders className="w-4 h-4" />
            <span>Super Admin Design Suite</span>
          </div>
          <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white mt-1">
            Website Appearance & Theme Settings
          </h3>
          <p className="text-xs text-[#A7B2C8]">
            Full control over brand assets, Light/Dark styling, Cyber theme glow tokens, and multi-currency engine.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 cursor-pointer transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Persisting...' : 'Save & Publish Live'}</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#263249] pb-3">
        {[
          { id: 'theme', label: 'Theme & Cyber Style', icon: Sparkles },
          { id: 'branding', label: 'Logo & Brand Assets', icon: Image },
          { id: 'palette', label: 'Independent Color Palettes', icon: Palette },
          { id: 'currency', label: 'Currency Settings (USD/BDT)', icon: DollarSign },
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2.5 rounded-xl text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'bg-[#101626] border border-[#263249] text-[#A7B2C8] hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: THEME & CYBER STYLE */}
      {activeTab === 'theme' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-6">
            <h4 className="text-base font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span>Cyber Visual System & Aesthetic Modes</span>
            </h4>
            <p className="text-xs text-[#A7B2C8]">
              The public Cyber switcher button was moved to this admin panel. You decide whether Cyber glows and high-tech borders are enabled across the site.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#101626] border border-[#263249] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Enable Cyber Aesthetic</span>
                  <input
                    type="checkbox"
                    checked={cyberStyleEnabled}
                    onChange={e => setCyberStyleEnabled(e.target.checked)}
                    className="w-4 h-4 accent-cyan-400 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-[#A7B2C8]">
                  Applies high-tech cyber aesthetics, neon styling, and modern futuristic vibes across pages.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#101626] border border-[#263249] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Ambient Glow Rings</span>
                  <input
                    type="checkbox"
                    checked={glowEffectsEnabled}
                    onChange={e => setGlowEffectsEnabled(e.target.checked)}
                    className="w-4 h-4 accent-cyan-400 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-[#A7B2C8]">
                  Enables neon cyan and purple ambient glow effects beneath hero elements and featured tiers.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#101626] border border-[#263249] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Futuristic Technical Borders</span>
                  <input
                    type="checkbox"
                    checked={futuristicBorders}
                    onChange={e => setFuturisticBorders(e.target.checked)}
                    className="w-4 h-4 accent-cyan-400 cursor-pointer"
                  />
                </div>
                <p className="text-[11px] text-[#A7B2C8]">
                  Enforces fine-grid technical container lines and glowing active borders.
                </p>
              </div>
            </div>

            {/* Visual Presets Selector */}
            <div className="pt-4 border-t border-[#263249] space-y-4">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 block font-bold">
                Select Master Visual Preset:
              </span>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(Object.keys(THEME_PRESETS) as ThemeId[]).map(pId => {
                  const preset = THEME_PRESETS[pId];
                  const isSelected = currentThemeId === pId;
                  return (
                    <div
                      key={pId}
                      onClick={() => setThemePreset(pId)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-[#101626] border-cyan-400 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-400'
                          : 'bg-[#101626]/70 border-[#263249] hover:border-slate-500'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-white">{preset.name}</span>
                        {isSelected && (
                          <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#A7B2C8] leading-relaxed mb-3">
                        {preset.description}
                      </p>
                      <div className="flex gap-1.5 pt-1">
                        <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: preset.colors.primaryBg }} />
                        <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: preset.colors.primaryAccent }} />
                        <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: preset.colors.neonCyan }} />
                        <div className="w-5 h-5 rounded-full border border-white/20" style={{ backgroundColor: preset.colors.secondaryAccent }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BRANDING & LOGOS */}
      {activeTab === 'branding' && (
        <div className="p-6 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-6">
          <h4 className="text-base font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
            <Image className="w-4 h-4 text-cyan-400" />
            <span>Brand Identity & Header Logos</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Brand Name *</label>
              <input
                type="text"
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Agency Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Dark Mode Logo URL (Displayed on Dark Backgrounds)
              </label>
              <input
                type="text"
                placeholder="https://.../logo-dark.png (Optional)"
                value={logoDarkUrl}
                onChange={e => setLogoDarkUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Light Mode Logo URL (Displayed on Light Backgrounds)
              </label>
              <input
                type="text"
                placeholder="https://.../logo-light.png (Optional)"
                value={logoLightUrl}
                onChange={e => setLogoLightUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Fallback Master Logo URL
              </label>
              <input
                type="text"
                placeholder="https://.../logo.png"
                value={logoUrl}
                onChange={e => setLogoUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Favicon URL</label>
              <input
                type="text"
                placeholder="https://.../favicon.ico"
                value={faviconUrl}
                onChange={e => setFaviconUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Logo Max Height: <span className="font-mono text-cyan-300">{logoMaxHeight}px</span>
              </label>
              <input
                type="range"
                min="24"
                max="80"
                value={logoMaxHeight}
                onChange={e => setLogoMaxHeight(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Logo Max Width: <span className="font-mono text-cyan-300">{logoWidth}px</span>
              </label>
              <input
                type="range"
                min="80"
                max="280"
                value={logoWidth}
                onChange={e => setLogoWidth(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#263249] flex flex-wrap gap-6 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showBrandText}
                onChange={e => setShowBrandText(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 rounded"
              />
              <span className="text-slate-300 font-medium">Show brand text next to logo</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showTagline}
                onChange={e => setShowTagline(e.target.checked)}
                className="w-4 h-4 accent-cyan-400 rounded"
              />
              <span className="text-slate-300 font-medium">Show agency tagline under brand text</span>
            </label>
          </div>
        </div>
      )}

      {/* TAB 3: INDEPENDENT COLOR PALETTES */}
      {activeTab === 'palette' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h4 className="text-base font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-cyan-400" />
                  <span>Independent Light & Dark Color Palettes</span>
                </h4>
                <p className="text-xs text-[#A7B2C8]">
                  Configure distinct hexadecimal tokens for both Light Mode and Dark Mode.
                </p>
              </div>

              {/* Toggle Palette Target */}
              <div className="flex items-center bg-[#080B14] border border-[#263249] rounded-xl p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setPaletteMode('dark')}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer ${
                    paletteMode === 'dark'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Dark Palette</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaletteMode('light')}
                  className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 cursor-pointer ${
                    paletteMode === 'light'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light Palette</span>
                </button>
              </div>
            </div>

            {/* Color Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {colorFields.map(field => {
                const currentVal =
                  paletteMode === 'dark' ? darkColors[field.key] : lightColors[field.key];
                return (
                  <div
                    key={field.key}
                    className="p-4 rounded-xl bg-[#101626] border border-[#263249] space-y-2.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white font-['Space_Grotesk']">
                        {field.label}
                      </span>
                      <div
                        className="w-6 h-6 rounded-lg border border-white/20 shadow-inner"
                        style={{ backgroundColor: currentVal }}
                      />
                    </div>
                    <p className="text-[10px] text-[#A7B2C8]">{field.desc}</p>
                    <div className="flex items-center gap-2 pt-1">
                      <input
                        type="color"
                        value={currentVal}
                        onChange={e =>
                          paletteMode === 'dark'
                            ? handleDarkColorChange(field.key, e.target.value)
                            : handleLightColorChange(field.key, e.target.value)
                        }
                        className="w-8 h-8 rounded-lg border-0 bg-transparent cursor-pointer p-0"
                      />
                      <input
                        type="text"
                        value={currentVal}
                        onChange={e =>
                          paletteMode === 'dark'
                            ? handleDarkColorChange(field.key, e.target.value)
                            : handleLightColorChange(field.key, e.target.value)
                        }
                        className="w-full px-2.5 py-1.5 rounded-lg bg-[#080B14] border border-[#263249] text-white font-mono text-xs focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CURRENCY SETTINGS */}
      {activeTab === 'currency' && (
        <div className="p-6 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-6">
          <h4 className="text-base font-bold font-['Space_Grotesk'] text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-cyan-400" />
            <span>Multi-Currency Engine Configuration</span>
          </h4>
          <p className="text-xs text-[#A7B2C8]">
            Configure the conversion rate from USD ($) to Bangladeshi Taka (৳). Every pricing card, custom service estimation, subscription tier, and checkout form automatically respects this rate.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Default Currency for First-Time Visitors
              </label>
              <select
                value={defaultCurrency}
                onChange={e => setDefaultCurrency(e.target.value as 'USD' | 'BDT')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="USD">USD ($) — United States Dollar</option>
                <option value="BDT">BDT (৳) — Bangladeshi Taka</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                USD to BDT Exchange Rate (1 USD = X BDT) *
              </label>
              <input
                type="number"
                min="1"
                step="0.5"
                value={usdToBdtRate}
                onChange={e => setUsdToBdtRate(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                e.g. 120 means $100 converts to ৳12,000 BDT
              </span>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Public Header Currency Switcher
              </label>
              <div className="p-3 rounded-xl bg-[#080B14] border border-[#263249] flex items-center justify-between">
                <span className="text-xs text-white">Enable Switcher</span>
                <input
                  type="checkbox"
                  checked={allowUserCurrencyToggle}
                  onChange={e => setAllowUserCurrencyToggle(e.target.checked)}
                  className="w-4 h-4 accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
