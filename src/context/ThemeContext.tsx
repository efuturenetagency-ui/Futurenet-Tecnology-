import React, { createContext, useContext, useEffect, useState } from 'react';
import { SiteSettings, SiteColors, ThemeId } from '../types';
import { INITIAL_SITE_SETTINGS } from '../lib/seedData';
import { getSiteSettings, updateSiteSettings as persistSiteSettings } from '../lib/dataService';

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
  currentThemeId: ThemeId;
  setThemePreset: (id: ThemeId) => Promise<void>;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>(() => {
    return (localStorage.getItem('ft_theme_preset') as ThemeId) || 'cyber_dark';
  });
  const [loading, setLoading] = useState(true);

  const applyThemeVariables = (colors: SiteColors) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
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

  const load = async () => {
    try {
      const data = await getSiteSettings();
      setSettings(data);
      applyThemeVariables(data.colors);
    } catch (e) {
      console.warn('Using initial settings');
      applyThemeVariables(INITIAL_SITE_SETTINGS.colors);
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
      await updateSettings({ colors: selected.colors });
    }
  };

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const updated = await persistSiteSettings(newSettings);
    setSettings(updated);
    applyThemeVariables(updated.colors);
  };

  return (
    <ThemeContext.Provider
      value={{
        settings,
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
