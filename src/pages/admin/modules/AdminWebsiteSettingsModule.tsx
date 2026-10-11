import React, { useState } from 'react';
import {
  Image as ImageIcon,
  Palette,
  Layers,
  Menu,
  Type,
  DollarSign,
  Printer,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Eye,
  Upload,
  Sun,
  Moon,
  Sparkles,
  Sliders,
  Check,
  ChevronDown,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { useSiteSettings, DEFAULT_DARK_COLORS, DEFAULT_LIGHT_COLORS, THEME_PRESETS } from '../../../context/ThemeContext';
import { PageSectionItem, SiteColors, SiteSettings, ThemeId } from '../../../types';
import { savePageSection } from '../../../lib/dataService';

interface WebsiteSettingsModuleProps {
  sections: PageSectionItem[];
  onSectionsUpdated: (sections: PageSectionItem[]) => void;
}

type SettingsSectionId =
  | 'branding'
  | 'sections'
  | 'theme'
  | 'navigation'
  | 'typography'
  | 'currency'
  | 'print';

export const AdminWebsiteSettingsModule: React.FC<WebsiteSettingsModuleProps> = ({
  sections,
  onSectionsUpdated,
}) => {
  const { settings, updateSettings, themeMode, toggleThemeMode, usdToBdtRate } = useSiteSettings();

  // Manage which single section is active/open (opens independently)
  const [activeSection, setActiveSection] = useState<SettingsSectionId>('branding');

  // Form states initialized from settings
  // 1. Branding
  const [logoUrl, setLogoUrl] = useState(settings.logoUrl || '');
  const [logoLightUrl, setLogoLightUrl] = useState(settings.logoLightUrl || '');
  const [logoDarkUrl, setLogoDarkUrl] = useState(settings.logoDarkUrl || '');
  const [logoWidth, setLogoWidth] = useState<number>(settings.logoWidth || 140);
  const [logoMaxHeight, setLogoMaxHeight] = useState<number>(settings.logoMaxHeight || 42);
  const [logoAlignment, setLogoAlignment] = useState<'left' | 'center'>(settings.logoAlignment || 'left');
  const [showBrandText, setShowBrandText] = useState<boolean>(settings.showBrandText !== false);
  const [showTagline, setShowTagline] = useState<boolean>(settings.showTagline !== false);
  const [brandName, setBrandName] = useState(settings.brandName || 'Futurent Technology');
  const [tagline, setTagline] = useState(settings.tagline || 'Building Digital Experiences That Move Your Business Forward');

  // 2. Theme & Colors
  const [darkColors, setDarkColors] = useState<SiteColors>({
    ...(settings.darkColors || settings.colors || DEFAULT_DARK_COLORS),
  });
  const [lightColors, setLightColors] = useState<SiteColors>({
    ...(settings.lightColors || DEFAULT_LIGHT_COLORS),
  });
  const [cyberStyleEnabled, setCyberStyleEnabled] = useState<boolean>(
    settings.cyberStyleEnabled !== false
  );

  // 3. Typography
  const [headingFont, setHeadingFont] = useState(settings.typography?.headingFont || 'Space Grotesk');
  const [bodyFont, setBodyFont] = useState(settings.typography?.bodyFont || 'Plus Jakarta Sans');
  const [headingWeight, setHeadingWeight] = useState(settings.typography?.headingWeight || '700');
  const [baseSize, setBaseSize] = useState(settings.typography?.baseSize || '16px');

  // 4. Currency
  const [defaultCurrency, setDefaultCurrency] = useState<'USD' | 'BDT'>(
    settings.currencySettings?.defaultCurrency || 'USD'
  );
  const [exchangeRate, setExchangeRate] = useState<number>(
    settings.currencySettings?.usdToBdtRate || 120
  );

  // 5. Print Settings
  const [printCompany, setPrintCompany] = useState(
    settings.printSettings?.companyName || 'Futurent Technology'
  );
  const [printTagline, setPrintTagline] = useState(
    settings.printSettings?.tagline || 'Next-Generation Full-Stack IT Agency & Digital Engineering'
  );
  const [printAddress, setPrintAddress] = useState(
    settings.printSettings?.address || settings.officeAddress || 'Innovation Tower, Level 14, Tech District'
  );
  const [printPhone, setPrintPhone] = useState(
    settings.printSettings?.phone || settings.supportPhone || '+1 (800) 555-3888'
  );
  const [printEmail, setPrintEmail] = useState(
    settings.printSettings?.email || settings.supportEmail || 'billing@futurenttech.com'
  );
  const [printTaxId, setPrintTaxId] = useState(
    settings.printSettings?.taxId || 'BIN-9482710384'
  );
  const [printFooterNotice, setPrintFooterNotice] = useState(
    settings.printSettings?.footerNotice ||
      'Thank you for partnering with Futurent Technology. Computer generated official A4 document. All rights reserved.'
  );

  // Feedback & Saving state
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Logo file upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'primary' | 'light' | 'dark') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setSaveError('Logo image file exceeds maximum allowed size of 2MB.');
      setTimeout(() => setSaveError(null), 4000);
      return;
    }

    // Validate type
    const validTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setSaveError('Please upload a valid image file (PNG, JPG, SVG, or WebP).');
      setTimeout(() => setSaveError(null), 4000);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (target === 'primary') setLogoUrl(result);
      if (target === 'light') setLogoLightUrl(result);
      if (target === 'dark') setLogoDarkUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const updated: Partial<SiteSettings> = {
        brandName: brandName.trim(),
        tagline: tagline.trim(),
        logoUrl: logoUrl.trim(),
        logoLightUrl: logoLightUrl.trim(),
        logoDarkUrl: logoDarkUrl.trim(),
        logoWidth: Number(logoWidth) || 140,
        logoMaxHeight: Number(logoMaxHeight) || 42,
        logoAlignment,
        showBrandText,
        showTagline,
        cyberStyleEnabled,
        darkColors,
        lightColors,
        colors: darkColors,
        typography: {
          headingFont,
          bodyFont,
          baseSize,
          headingWeight,
        },
        currencySettings: {
          defaultCurrency,
          usdToBdtRate: Number(exchangeRate) || 120,
        },
        printSettings: {
          companyName: printCompany.trim(),
          tagline: printTagline.trim(),
          address: printAddress.trim(),
          phone: printPhone.trim(),
          email: printEmail.trim(),
          taxId: printTaxId.trim(),
          footerNotice: printFooterNotice.trim(),
          paperSize: 'A4',
          orientation: 'portrait',
        },
      };

      await updateSettings(updated);
      setSaveSuccess('Website appearance & branding settings saved successfully to Firestore!');
      setTimeout(() => setSaveSuccess(null), 3500);
    } catch (err: any) {
      console.error('Failed to save settings:', err);
      setSaveError(err.message || 'Failed to persist settings.');
      setTimeout(() => setSaveError(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDefaults = () => {
    if (!window.confirm('Reset appearance and branding options to system defaults?')) return;
    setDarkColors(DEFAULT_DARK_COLORS);
    setLightColors(DEFAULT_LIGHT_COLORS);
    setCyberStyleEnabled(true);
    setLogoWidth(140);
    setLogoMaxHeight(42);
    setLogoAlignment('left');
    setShowBrandText(true);
    setShowTagline(true);
    setHeadingFont('Space Grotesk');
    setBodyFont('Plus Jakarta Sans');
    setHeadingWeight('700');
    setBaseSize('16px');
    setExchangeRate(120);
    setDefaultCurrency('USD');
  };

  const handleSectionToggle = async (sec: PageSectionItem) => {
    const updated = { ...sec, isEnabled: !sec.isEnabled };
    await savePageSection(updated);
    onSectionsUpdated(sections.map(s => (s.id === sec.id ? updated : s)));
  };

  const handleSectionTitleChange = async (sec: PageSectionItem, title: string, subtitle?: string, badge?: string) => {
    const updated: PageSectionItem = {
      ...sec,
      title: title.trim(),
      subtitle: subtitle?.trim() || undefined,
      content: {
        ...sec.content,
        badge: badge?.trim() || undefined,
      },
    };
    await savePageSection(updated);
    onSectionsUpdated(sections.map(s => (s.id === sec.id ? updated : s)));
  };

  // Section tabs configuration
  const sectionsList: { id: SettingsSectionId; title: string; subtitle: string; icon: React.ElementType }[] = [
    {
      id: 'branding',
      title: '1. Logo & Branding',
      subtitle: 'Upload primary, light and dark logos, manage dimensions & name visibility',
      icon: ImageIcon,
    },
    {
      id: 'sections',
      title: '2. Homepage Sections',
      subtitle: 'Control visibility, titles, badges, and reorder all sections (including About Us)',
      icon: Layers,
    },
    {
      id: 'theme',
      title: '3. Theme Settings',
      subtitle: 'Light & Dark mode palettes, cyber styling toggle, and contrast tokens',
      icon: Palette,
    },
    {
      id: 'navigation',
      title: '4. Header & Navigation',
      subtitle: 'Clean menu links, logo placement, and header display settings',
      icon: Menu,
    },
    {
      id: 'typography',
      title: '5. Typography & Fonts',
      subtitle: 'Heading and body font pairings, scale, and typographic weight',
      icon: Type,
    },
    {
      id: 'currency',
      title: '6. Currency & Pricing Display',
      subtitle: 'USD & BDT currency conversion rate and pricing formatting rules',
      icon: DollarSign,
    },
    {
      id: 'print',
      title: '7. Print Settings',
      subtitle: 'A4 document layout, invoice branding, company tax ID, and footer notices',
      icon: Printer,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Top Command Bar */}
      <div className="p-6 rounded-3xl bg-[#101626] border border-[#263249] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Sliders className="w-4 h-4" />
            <span>Website Appearance & Branding Console</span>
          </div>
          <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white mt-1">
            Super Admin Visual & Branding Customization
          </h2>
          <p className="text-xs text-[#A7B2C8] mt-0.5">
            Independently manage logo branding, homepage sections, light/dark themes, currencies, and professional A4 print templates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="px-4 py-2.5 rounded-xl border border-[#263249] hover:bg-[#141C2E] text-slate-300 text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            disabled={isSaving}
            onClick={handleSaveAll}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] hover:opacity-95 text-white text-xs font-bold shadow-lg shadow-blue-500/25 flex items-center gap-2 cursor-pointer active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Changes...' : 'Save & Publish Live'}</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-3 animate-fade-in shadow-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {saveError && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3 animate-fade-in shadow-md">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{saveError}</span>
        </div>
      )}

      {/* Independent Section Navigation Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 bg-[#080B14] p-2 rounded-2xl border border-[#263249]">
        {sectionsList.map(sec => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => setActiveSection(sec.id)}
              className={`p-3 rounded-xl flex flex-col items-center justify-center text-center transition-all cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-md font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-[#101626]'
              }`}
            >
              <Icon className="w-4 h-4 mb-1.5" />
              <span className="text-xs line-clamp-1">{sec.title.split('. ')[1]}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* 1. LOGO & BRANDING SECTION */}
      {/* ========================================================================= */}
      {activeSection === 'branding' && (
        <div className="p-8 rounded-3xl bg-[#101626] border border-[#263249] space-y-8 animate-fade-in shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#263249] gap-2">
            <div>
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                Company Logo & Visual Identity
              </h3>
              <p className="text-xs text-[#A7B2C8]">
                Upload, replace, and configure the primary logo displayed across public navigation and footers.
              </p>
            </div>
            <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
              Validated PNG / SVG / JPG / WebP &bull; Max 2MB
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Upload Controls Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Primary Logo */}
              <div className="p-5 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-3">
                <label className="block text-xs font-bold text-white uppercase tracking-wider">
                  Primary Logo (Image URL or File Upload)
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="https://example.com/logo.png or data:image/..."
                    value={logoUrl}
                    onChange={e => setLogoUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-[#263249] text-white text-xs focus:outline-none focus:border-cyan-400 font-mono"
                  />
                  <label className="px-4 py-2.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => handleFileUpload(e, 'primary')}
                    />
                  </label>
                </div>
                <p className="text-[11px] text-[#A7B2C8]">
                  Used as default logo across the site. If blank, sleek FT badge fallback is rendered automatically.
                </p>
              </div>

              {/* Light & Dark Variant Logos (Optional) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                    <Sun className="w-3.5 h-3.5" /> Light Mode Logo (Optional)
                  </div>
                  <input
                    type="text"
                    placeholder="Dark-colored logo on white background"
                    value={logoLightUrl}
                    onChange={e => setLogoLightUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-white text-xs font-mono"
                  />
                  <label className="w-full py-2 rounded-xl border border-[#263249] hover:bg-[#080B14] text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer">
                    <Upload className="w-3 h-3 text-amber-400" />
                    <span>Upload Light Variant</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => handleFileUpload(e, 'light')}
                    />
                  </label>
                </div>

                <div className="p-5 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-3">
                  <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold">
                    <Moon className="w-3.5 h-3.5" /> Dark Mode Logo (Optional)
                  </div>
                  <input
                    type="text"
                    placeholder="White / luminous logo on obsidian background"
                    value={logoDarkUrl}
                    onChange={e => setLogoDarkUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-white text-xs font-mono"
                  />
                  <label className="w-full py-2 rounded-xl border border-[#263249] hover:bg-[#080B14] text-slate-300 text-xs font-medium flex items-center justify-center gap-1.5 cursor-pointer">
                    <Upload className="w-3 h-3 text-cyan-400" />
                    <span>Upload Dark Variant</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={e => handleFileUpload(e, 'dark')}
                    />
                  </label>
                </div>
              </div>

              {/* Logo Dimensions & Spacing Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#141C2E] border border-[#263249]">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Max Height: <span className="text-cyan-400 font-mono">{logoMaxHeight}px</span>
                  </label>
                  <input
                    type="range"
                    min="24"
                    max="80"
                    value={logoMaxHeight}
                    onChange={e => setLogoMaxHeight(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Max Width: <span className="text-cyan-400 font-mono">{logoWidth}px</span>
                  </label>
                  <input
                    type="range"
                    min="80"
                    max="280"
                    value={logoWidth}
                    onChange={e => setLogoWidth(Number(e.target.value))}
                    className="w-full accent-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Header Alignment
                  </label>
                  <select
                    value={logoAlignment}
                    onChange={e => setLogoAlignment(e.target.value as 'left' | 'center')}
                    className="w-full px-3 py-1.5 rounded-lg bg-[#080B14] border border-[#263249] text-white text-xs font-medium"
                  >
                    <option value="left">Left Aligned (Standard)</option>
                    <option value="center">Centered</option>
                  </select>
                </div>
              </div>

              {/* Company Name & Tagline Text Controls */}
              <div className="p-5 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Company Name</label>
                    <input
                      type="text"
                      value={brandName}
                      onChange={e => setBrandName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-[#263249] text-white text-xs font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={e => setTagline(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-[#263249] text-white text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-6 pt-2 border-t border-[#263249]/60">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={showBrandText}
                      onChange={e => setShowBrandText(e.target.checked)}
                      className="rounded accent-cyan-400"
                    />
                    <span>Show Brand Name Text beside Logo</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={showTagline}
                      onChange={e => setShowTagline(e.target.checked)}
                      className="rounded accent-cyan-400"
                    />
                    <span>Show Tagline below Brand Name</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Live Interactive Preview Box */}
            <div className="space-y-4">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Live Header Bar Preview
              </span>
              <div className="p-6 rounded-2xl bg-[#080B14] border border-[#263249] flex flex-col items-center justify-center min-h-[220px] text-center space-y-3 relative overflow-hidden">
                <div className="absolute top-2 right-2 text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  Preview
                </div>

                {logoUrl ? (
                  <img
                    src={logoUrl}
                    alt="Logo Preview"
                    style={{
                      maxHeight: `${logoMaxHeight}px`,
                      maxWidth: `${logoWidth}px`,
                      objectFit: 'contain',
                    }}
                    className="shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4F8CFF] to-[#22D3EE] p-[1.5px]">
                    <div className="w-full h-full bg-[#080B14] rounded-[10px] flex items-center justify-center font-bold text-cyan-400 text-sm">
                      FT
                    </div>
                  </div>
                )}

                {showBrandText && (
                  <div>
                    <span className="font-['Space_Grotesk'] font-bold text-white text-base block">
                      {brandName || 'Futurent Technology'}
                    </span>
                    {showTagline && (
                      <span className="text-[10px] font-mono text-slate-400 tracking-wider uppercase block">
                        {tagline || 'Next-Gen IT Agency'}
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-[#141C2E] border border-[#263249] text-[11px] text-[#A7B2C8] space-y-1 leading-relaxed">
                <strong className="text-white block">Aspect Ratio Integrity:</strong>
                Images preserve native width/height ratios without distortion or pixel stretching.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. HOMEPAGE SECTIONS (INCLUDING ABOUT SECTION) */}
      {/* ========================================================================= */}
      {activeSection === 'sections' && (
        <div className="p-8 rounded-3xl bg-[#101626] border border-[#263249] space-y-6 animate-fade-in shadow-xl">
          <div className="pb-4 border-b border-[#263249] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                Homepage Sections & About Customization
              </h3>
              <p className="text-xs text-[#A7B2C8]">
                Configure visibility, order, and titles for all homepage segments, including the integrated About Us section.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {sections.map(sec => (
              <div
                key={sec.id}
                className={`p-5 rounded-2xl border transition-all ${
                  sec.isEnabled
                    ? 'bg-[#141C2E] border-[#263249]'
                    : 'bg-[#080B14] border-[#263249]/40 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-cyan-400">
                        Section #{sec.order}
                      </span>
                      <h4 className="text-sm font-bold text-white font-['Space_Grotesk']">
                        {sec.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/10 text-blue-300 border border-blue-500/30">
                        {sec.sectionType}
                      </span>
                    </div>
                    {sec.subtitle && (
                      <p className="text-xs text-[#A7B2C8] max-w-2xl">{sec.subtitle}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleSectionToggle(sec)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold cursor-pointer border ${
                        sec.isEnabled
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                      }`}
                    >
                      {sec.isEnabled ? 'Visible on Homepage' : 'Hidden'}
                    </button>
                  </div>
                </div>

                {/* Inline Editing for About Us section */}
                {sec.sectionType === 'AboutUs' && (
                  <div className="mt-4 pt-4 border-t border-[#263249]/60 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">About Section Heading</label>
                      <input
                        type="text"
                        defaultValue={sec.title}
                        onBlur={e => handleSectionTitleChange(sec, e.target.value, sec.subtitle, sec.content?.badge)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#080B14] border border-[#263249] text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-300 mb-1">About Badge Text</label>
                      <input
                        type="text"
                        defaultValue={sec.content?.badge || 'WHO WE ARE • FUTURE-PROOF IT ARCHITECTURE'}
                        onBlur={e => handleSectionTitleChange(sec, sec.title, sec.subtitle, e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg bg-[#080B14] border border-[#263249] text-white"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. THEME SETTINGS (LIGHT & DARK PALETTES + CYBER STYLE TOGGLE) */}
      {/* ========================================================================= */}
      {activeSection === 'theme' && (
        <div className="p-8 rounded-3xl bg-[#101626] border border-[#263249] space-y-8 animate-fade-in shadow-xl">
          <div className="pb-4 border-b border-[#263249] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
                Global Theme Palettes & Cyber Visual Styling
              </h3>
              <p className="text-xs text-[#A7B2C8]">
                Configure the Light Mode and Dark Mode palettes, and toggle the Cyber futuristic styling engine.
              </p>
            </div>
            <button
              type="button"
              onClick={toggleThemeMode}
              className="px-3.5 py-1.5 rounded-xl border border-[#263249] text-xs font-semibold flex items-center gap-2 bg-[#141C2E] text-slate-300 hover:text-white"
            >
              <span>Currently Viewing: {themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>

          {/* Cyber Futuristic Style Master Switch (Admin-Controlled) */}
          <div className="p-6 rounded-2xl bg-[#141C2E] border border-cyan-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Cyber Aesthetic & Futuristic Visual Style Engine</span>
              </div>
              <p className="text-xs text-[#A7B2C8] max-w-xl">
                When enabled, renders futuristic glows, circuit badges, and ambient cyber gradients. When disabled, defaults to clean minimalist corporate agency styling.
              </p>
            </div>
            <label className="flex items-center gap-3 cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={cyberStyleEnabled}
                onChange={e => setCyberStyleEnabled(e.target.checked)}
                className="w-5 h-5 rounded accent-cyan-400"
              />
              <span className="text-xs font-bold text-white">
                {cyberStyleEnabled ? 'Cyber Style Active' : 'Minimalist Clean Style'}
              </span>
            </label>
          </div>

          {/* Dark Mode Color Palette */}
          <div className="space-y-4">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
              Dark Mode Color Palette Tokens
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { key: 'primaryBg', label: 'Primary Background' },
                { key: 'secondaryBg', label: 'Secondary / Surface Canvas' },
                { key: 'cardBg', label: 'Card & Container Background' },
                { key: 'primaryAccent', label: 'Primary Accent (Blue)' },
                { key: 'secondaryAccent', label: 'Secondary Accent (Purple)' },
                { key: 'neonCyan', label: 'Neon Cyan Highlight' },
                { key: 'primaryText', label: 'Primary Text' },
                { key: 'secondaryText', label: 'Muted Text' },
                { key: 'borders', label: 'Border Grids' },
              ].map(field => (
                <div key={field.key} className="p-3.5 rounded-xl bg-[#080B14] border border-[#263249] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-300 block">{field.label}</span>
                    <span className="text-xs font-mono text-cyan-300 font-bold">
                      {darkColors[field.key as keyof SiteColors]}
                    </span>
                  </div>
                  <input
                    type="color"
                    value={darkColors[field.key as keyof SiteColors]}
                    onChange={e =>
                      setDarkColors(prev => ({ ...prev, [field.key]: e.target.value }))
                    }
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Light Mode Color Palette */}
          <div className="space-y-4 pt-4 border-t border-[#263249]">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
              Light Mode Color Palette Tokens
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { key: 'primaryBg', label: 'Primary Canvas (Light)' },
                { key: 'secondaryBg', label: 'Surface Background' },
                { key: 'cardBg', label: 'Card Background' },
                { key: 'primaryAccent', label: 'Primary Action Blue' },
                { key: 'secondaryAccent', label: 'Secondary Purple' },
                { key: 'neonCyan', label: 'Cyan Accent' },
                { key: 'primaryText', label: 'Primary Text (Dark)' },
                { key: 'secondaryText', label: 'Muted Body Text' },
                { key: 'borders', label: 'Card Borders' },
              ].map(field => (
                <div key={field.key} className="p-3.5 rounded-xl bg-[#080B14] border border-[#263249] flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-300 block">{field.label}</span>
                    <span className="text-xs font-mono text-amber-300 font-bold">
                      {lightColors[field.key as keyof SiteColors]}
                    </span>
                  </div>
                  <input
                    type="color"
                    value={lightColors[field.key as keyof SiteColors]}
                    onChange={e =>
                      setLightColors(prev => ({ ...prev, [field.key]: e.target.value }))
                    }
                    className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. HEADER & NAVIGATION */}
      {/* ========================================================================= */}
      {activeSection === 'navigation' && (
        <div className="p-8 rounded-3xl bg-[#101626] border border-[#263249] space-y-6 animate-fade-in shadow-xl">
          <div className="pb-4 border-b border-[#263249]">
            <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
              Public Navigation Management
            </h3>
            <p className="text-xs text-[#A7B2C8]">
              Verified streamlined header navigation. Uncluttered layout without Cyber or direct WhatsApp buttons in header.
            </p>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Home', path: '/', desc: 'Landing and hero showcase' },
              { name: 'About Us', path: '/#about', desc: 'Smooth scrolls directly to homepage About section' },
              { name: 'Services', path: '/services', desc: 'Categorized service catalog with mega dropdown' },
              { name: 'Subscriptions', path: '/subscriptions', desc: 'Monthly and annual retainers' },
              { name: 'Contact Us', path: '/contact', desc: 'Inquiry forms and physical headquarters information' },
            ].map((link, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#141C2E] border border-[#263249] flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-white">{link.name}</span>
                  <span className="text-[11px] text-[#A7B2C8] block font-mono mt-0.5">{link.path} &bull; {link.desc}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-[10px] font-mono font-bold">
                  Active
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. TYPOGRAPHY & FONT SETTINGS */}
      {/* ========================================================================= */}
      {activeSection === 'typography' && (
        <div className="p-8 rounded-3xl bg-[#101626] border border-[#263249] space-y-6 animate-fade-in shadow-xl">
          <div className="pb-4 border-b border-[#263249]">
            <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
              Typography & Font Scales
            </h3>
            <p className="text-xs text-[#A7B2C8]">
              Configure heading and body typography tokens across the application.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-3">
              <label className="block text-xs font-semibold text-slate-300">Heading Font Family</label>
              <select
                value={headingFont}
                onChange={e => setHeadingFont(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-[#263249] text-white text-xs"
              >
                <option value="Space Grotesk">Space Grotesk (Futuristic Geometric)</option>
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (Modern Editorial)</option>
                <option value="Inter">Inter (Ultra-Legible)</option>
                <option value="Outfit">Outfit (Clean Sans)</option>
              </select>
            </div>

            <div className="p-5 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-3">
              <label className="block text-xs font-semibold text-slate-300">Body Font Family</label>
              <select
                value={bodyFont}
                onChange={e => setBodyFont(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-[#263249] text-white text-xs"
              >
                <option value="Plus Jakarta Sans">Plus Jakarta Sans (Recommended)</option>
                <option value="Inter">Inter (High Contrast)</option>
                <option value="Roboto">Roboto</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. CURRENCY & PRICING DISPLAY */}
      {/* ========================================================================= */}
      {activeSection === 'currency' && (
        <div className="p-8 rounded-3xl bg-[#101626] border border-[#263249] space-y-8 animate-fade-in shadow-xl">
          <div className="pb-4 border-b border-[#263249]">
            <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
              Currency & Exchange Rate Management
            </h3>
            <p className="text-xs text-[#A7B2C8]">
              Configure USD and BDT conversion rates, default public display currencies, and checkout validation rules.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-3">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                USD to BDT Exchange Conversion Rate
              </label>
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-400">1 USD =</span>
                <input
                  type="number"
                  min="50"
                  max="200"
                  value={exchangeRate}
                  onChange={e => setExchangeRate(Number(e.target.value))}
                  className="w-32 px-3 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-cyan-300 font-mono font-bold text-base focus:outline-none focus:border-cyan-400"
                />
                <span className="text-xs font-mono text-slate-400">BDT (৳)</span>
              </div>
              <p className="text-[11px] text-[#A7B2C8]">
                Used when visitors toggle the public currency switcher to BDT. Server validates final payable amounts securely.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-3">
              <label className="block text-xs font-bold text-white uppercase tracking-wider">
                Default Public Currency
              </label>
              <select
                value={defaultCurrency}
                onChange={e => setDefaultCurrency(e.target.value as 'USD' | 'BDT')}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080B14] border border-[#263249] text-white text-xs font-bold"
              >
                <option value="USD">USD — US Dollar ($)</option>
                <option value="BDT">BDT — Bangladeshi Taka (৳)</option>
              </select>
              <p className="text-[11px] text-[#A7B2C8]">
                New visitors will see prices in this default currency until they manually switch.
              </p>
            </div>
          </div>

          {/* Quick Conversion Preview Calculator */}
          <div className="p-5 rounded-2xl bg-[#080B14] border border-[#263249] space-y-3">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider block">
              Sample Price Conversion Preview
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center font-mono text-xs">
              <div className="p-3 rounded-xl bg-[#101626] border border-[#263249]">
                <div className="text-slate-400">$100 USD</div>
                <div className="text-emerald-400 font-bold text-sm mt-1">৳{(100 * exchangeRate).toLocaleString()} BDT</div>
              </div>
              <div className="p-3 rounded-xl bg-[#101626] border border-[#263249]">
                <div className="text-slate-400">$450 USD</div>
                <div className="text-emerald-400 font-bold text-sm mt-1">৳{(450 * exchangeRate).toLocaleString()} BDT</div>
              </div>
              <div className="p-3 rounded-xl bg-[#101626] border border-[#263249]">
                <div className="text-slate-400">$1,500 USD</div>
                <div className="text-emerald-400 font-bold text-sm mt-1">৳{(1500 * exchangeRate).toLocaleString()} BDT</div>
              </div>
              <div className="p-3 rounded-xl bg-[#101626] border border-[#263249]">
                <div className="text-slate-400">$3,500 USD</div>
                <div className="text-emerald-400 font-bold text-sm mt-1">৳{(3500 * exchangeRate).toLocaleString()} BDT</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. PRINT SETTINGS (PROFESSIONAL A4 DOCUMENTS) */}
      {/* ========================================================================= */}
      {activeSection === 'print' && (
        <div className="p-8 rounded-3xl bg-[#101626] border border-[#263249] space-y-6 animate-fade-in shadow-xl">
          <div className="pb-4 border-b border-[#263249]">
            <h3 className="text-lg font-bold font-['Space_Grotesk'] text-white">
              Professional A4 Print Layout & Branding
            </h3>
            <p className="text-xs text-[#A7B2C8]">
              Configure company identification, tax/BIN numbers, and official footers appearing on printed invoices, order dockets, and receipts.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Company Legal Name on Print</label>
              <input
                type="text"
                value={printCompany}
                onChange={e => setPrintCompany(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Company Subtitle / Scope</label>
              <input
                type="text"
                value={printTagline}
                onChange={e => setPrintTagline(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Corporate Physical Address</label>
              <input
                type="text"
                value={printAddress}
                onChange={e => setPrintAddress(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Official Tax / BIN Number</label>
              <input
                type="text"
                value={printTaxId}
                onChange={e => setPrintTaxId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Billing Support Email</label>
              <input
                type="text"
                value={printEmail}
                onChange={e => setPrintEmail(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-white"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Official Telephone</label>
              <input
                type="text"
                value={printPhone}
                onChange={e => setPrintPhone(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Official A4 Footer Notice & Legal Disclaimer</label>
            <textarea
              rows={2}
              value={printFooterNotice}
              onChange={e => setPrintFooterNotice(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-[#080B14] border border-[#263249] text-white text-xs leading-relaxed"
            />
          </div>

          <div className="p-4 rounded-xl bg-[#141C2E] border border-[#263249] flex items-center justify-between text-xs">
            <span className="text-slate-400">Default Paper Dimension:</span>
            <span className="text-cyan-300 font-mono font-bold">Standard A4 Portrait (210mm &times; 297mm)</span>
          </div>
        </div>
      )}
    </div>
  );
};
