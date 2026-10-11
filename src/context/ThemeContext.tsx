import React, { createContext, useContext, useEffect, useState } from 'react';
import { SiteSettings, SiteColors, ThemeId } from '../types';
import { INITIAL_SITE_SETTINGS } from '../lib/seedData';
import { getSiteSettings, updateSiteSettings as persistSiteSettings } from '../lib/dataService';

export type ThemeMode = 'dark' | 'light';
export type CurrencyCode = 'USD' | 'BDT';

export const DEFAULT_DARK_COLORS: SiteColors = {
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

export const DEFAULT_LIGHT_COLORS: SiteColors = {
  primaryBg: '#F8FAFC',
  secondaryBg: '#FFFFFF',
  cardBg: '#FFFFFF',
  primaryAccent: '#2563EB',
  secondaryAccent: '#7C3AED',
  neonCyan: '#0284C7',
  primaryText: '#0F172A',
  secondaryText: '#475569',
  borders: '#E2E8F0',
};

export const THEME_PRESETS: Record<ThemeId, { name: string; description: string; colors: SiteColors }> = {
  cyber_dark: {
    name: 'Cyber Dark (2026)',
    description: 'Deep navy obsidian background with electric neon cyan and violet glow',
    colors: {
      primaryBg: '#080B14',
      secondaryBg: '#101626',
      cardBg: '#141C2E',
      primaryAccent: '#4F8CFF',
      secondaryAccent: '#8B5CF6',
      neonCyan: '#22D3EE',
      primaryText: '#F8FAFC',
      secondaryText: '#A7B2C8',
      borders: '#263249',
    },
  },
  neon_matrix: {
    name: 'Neon Matrix',
    description: 'High-contrast pitch dark canvas with emerald neon luminescence and high-tech borders',
    colors: {
      primaryBg: '#050B08',
      secondaryBg: '#0B1610',
      cardBg: '#0F2117',
      primaryAccent: '#10B981',
      secondaryAccent: '#065F46',
      neonCyan: '#34D399',
      primaryText: '#ECFDF5',
      secondaryText: '#A7F3D0',
      borders: '#064E3B',
    },
  },
  clean_minimal: {
    name: 'Clean Minimalist',
    description: 'Ultra-modern deep carbon monochrome with crisp ice-white typography',
    colors: {
      primaryBg: '#09090B',
      secondaryBg: '#18181B',
      cardBg: '#27272A',
      primaryAccent: '#6366F1',
      secondaryAccent: '#A855F7',
      neonCyan: '#38BDF8',
      primaryText: '#FFFFFF',
      secondaryText: '#D4D4D8',
      borders: '#3F3F46',
    },
  },
};

interface ThemeContextType {
  settings: SiteSettings;
  themeMode: ThemeMode;
  toggleThemeMode: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  usdToBdtRate: number;
  formatPrice: (amountInUsd: number, customBdtPrice?: number) => string;
  convertPrice: (amountInUsd: number, customBdtPrice?: number) => { amount: number; currency: CurrencyCode; formatted: string };
  isCyberEnabled: boolean;
  currentThemeId: ThemeId;
  setThemePreset: (id: ThemeId) => Promise<void>;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);

  // 1. Two Global Themes: Light Mode and Dark Mode
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ft_theme_mode');
      if (saved === 'light' || saved === 'dark') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
      }
    }
    return 'dark';
  });

  // 2. Currency Selector (USD & BDT)
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ft_currency');
      if (saved === 'USD' || saved === 'BDT') return saved;
    }
    return 'USD';
  });

  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>(() => {
    return (typeof window !== 'undefined' && (localStorage.getItem('ft_theme_preset') as ThemeId)) || 'cyber_dark';
  });
  const [loading, setLoading] = useState(true);

  const applyThemeVariables = (colors: SiteColors, mode: ThemeMode) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    // Set class attribute for tailwind / CSS targeting
    if (mode === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
      root.setAttribute('data-theme', 'dark');
    }

    root.style.setProperty('--color-primary-bg', colors.primaryBg);
    root.style.setProperty('--color-secondary-bg', colors.secondaryBg);
    root.style.setProperty('--color-card-bg', colors.cardBg);
    root.style.setProperty('--color-primary-accent', colors.primaryAccent);
    root.style.setProperty('--color-secondary-accent', colors.secondaryAccent);
    root.style.setProperty('--color-neon-cyan', colors.neonCyan);
    root.style.setProperty('--color-primary-text', colors.primaryText);
    root.style.setProperty('--color-secondary-text', colors.secondaryText);
    root.style.setProperty('--color-borders', colors.borders);
  };

  const getEffectiveColors = (set: SiteSettings, mode: ThemeMode): SiteColors => {
    if (mode === 'light') {
      return set.lightColors || DEFAULT_LIGHT_COLORS;
    }
    return set.darkColors || set.colors || DEFAULT_DARK_COLORS;
  };

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem('ft_theme_mode', mode);
    } catch {}
    const colors = getEffectiveColors(settings, mode);
    applyThemeVariables(colors, mode);
  };

  const toggleThemeMode = () => {
    const nextMode: ThemeMode = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(nextMode);
  };

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    try {
      localStorage.setItem('ft_currency', c);
    } catch {}
  };

  const usdToBdtRate = settings.currencySettings?.usdToBdtRate || 120;

  const convertPrice = (amountInUsd: number, customBdtPrice?: number) => {
    if (currency === 'BDT') {
      const fixedBdt = customBdtPrice !== undefined && customBdtPrice !== null ? customBdtPrice : undefined;
      const amount = fixedBdt !== undefined ? fixedBdt : Math.round(amountInUsd * usdToBdtRate);
      return {
        amount,
        currency: 'BDT' as CurrencyCode,
        formatted: `৳${amount.toLocaleString()}`,
      };
    }
    return {
      amount: amountInUsd,
      currency: 'USD' as CurrencyCode,
      formatted: `$${amountInUsd.toLocaleString()}`,
    };
  };

  const formatPrice = (amountInUsd: number, customBdtPrice?: number): string => {
    return convertPrice(amountInUsd, customBdtPrice).formatted;
  };

  const load = async () => {
    try {
      const data = await getSiteSettings();
      setSettings(data);
      const activeColors = getEffectiveColors(data, themeMode);
      applyThemeVariables(activeColors, themeMode);
      if (data.currencySettings?.defaultCurrency && !localStorage.getItem('ft_currency')) {
        setCurrencyState(data.currencySettings.defaultCurrency);
      }
    } catch (e) {
      console.warn('Using initial settings');
      const activeColors = getEffectiveColors(INITIAL_SITE_SETTINGS, themeMode);
      applyThemeVariables(activeColors, themeMode);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const setThemePreset = async (id: ThemeId) => {
    setCurrentThemeId(id);
    localStorage.setItem('ft_theme_preset', id);
    const selected = THEME_PRESETS[id];
    if (selected) {
      if (themeMode === 'dark') {
        await updateSettings({ colors: selected.colors, darkColors: selected.colors });
      } else {
        await updateSettings({ colors: selected.colors });
      }
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const updated = await persistSiteSettings(newSettings);
    setSettings(updated);
    const activeColors = getEffectiveColors(updated, themeMode);
    applyThemeVariables(activeColors, themeMode);
  };

  return (
    <ThemeContext.Provider
      value={{
        settings,
        themeMode,
        toggleThemeMode,
        setThemeMode,
        currency,
        setCurrency,
        usdToBdtRate,
        formatPrice,
        convertPrice,
        isCyberEnabled: settings.cyberStyleEnabled !== false,
        currentThemeId,
        setThemePreset,
        updateSettings,
        loading,
        refreshSettings: load,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export function useSiteSettings() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useSiteSettings must be used within ThemeProvider');
  }
  return context;
}

