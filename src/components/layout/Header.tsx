import React, { useState, useEffect } from 'react';
import {
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Shield,
  Layers,
  Code2,
  Cpu,
  Megaphone,
  Share2,
  Sun,
  Moon,
} from 'lucide-react';
import { useSiteSettings } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { ServiceCategory } from '../../types';

interface HeaderProps {
  currentPath: string;
  categories: ServiceCategory[];
  onOpenOrderModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, categories }) => {
  const { settings, themeMode, toggleThemeMode, currency, setCurrency } = useSiteSettings();
  const { language, setLanguage, t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAboutClick = (e: React.MouseEvent) => {
    if (window.location.pathname === '/') {
      e.preventDefault();
      const aboutEl = document.getElementById('about');
      if (aboutEl) {
        aboutEl.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = 'about';
      }
    }
  };

  const navLinks = [
    { name: t.home, path: '/' },
    { name: t.aboutUs, path: '/#about', isAnchor: true },
    { name: t.services, path: '/services', hasDropdown: true },
    { name: t.subscriptions, path: '/subscriptions' },
    { name: t.contactUs, path: '/contact' },
  ];

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'facebook-marketing':
        return Megaphone;
      case 'social-media-marketing':
        return Share2;
      case 'website-development':
        return Code2;
      case 'software-development':
        return Cpu;
      default:
        return Layers;
    }
  };

  // Select appropriate logo based on theme and settings
  const activeLogo =
    themeMode === 'light'
      ? settings.logoLightUrl || settings.logoUrl
      : settings.logoDarkUrl || settings.logoUrl;

  const logoMaxHeight = settings.logoMaxHeight || 42;
  const logoWidth = settings.logoWidth || 160;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#080B14]/90 backdrop-blur-xl border-b border-[#263249]/80 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
          : 'bg-transparent border-b border-white/5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo - Configurable with Fallback */}
          <a href="/" className="flex items-center gap-3 group shrink-0">
            {activeLogo ? (
              <img
                src={activeLogo}
                alt={settings.brandName || 'Futurent Technology'}
                style={{
                  maxHeight: `${logoMaxHeight}px`,
                  maxWidth: `${logoWidth}px`,
                  objectFit: 'contain',
                }}
                className="transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-[#4F8CFF] via-[#8B5CF6] to-[#22D3EE] p-[1.5px] transition-transform duration-300 group-hover:scale-105 shadow-lg shadow-blue-500/20">
                <div className="w-full h-full bg-[#080B14] rounded-[10px] flex items-center justify-center">
                  <span className="font-['Space_Grotesk'] font-black text-transparent bg-clip-text bg-gradient-to-tr from-[#22D3EE] to-[#4F8CFF] text-lg">
                    FT
                  </span>
                </div>
              </div>
            )}

            {settings.showBrandText !== false && (
              <div className="flex flex-col">
                <span className="font-['Space_Grotesk'] font-bold text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  {settings.brandName || 'Futurent Technology'}
                </span>
                {settings.showTagline !== false && (
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#A7B2C8]">
                    {settings.tagline || 'Next-Gen IT Agency'}
                  </span>
                )}
              </div>
            )}
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => {
              const isActive =
                link.isAnchor
                  ? false
                  : currentPath === link.path;

              if (link.hasDropdown) {
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setServicesDropdownOpen(true)}
                    onMouseLeave={() => setServicesDropdownOpen(false)}
                  >
                    <a
                      href={link.path}
                      className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? 'text-cyan-300 bg-white/5'
                          : 'text-[#A7B2C8] hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span>{link.name}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          servicesDropdownOpen ? 'rotate-180 text-cyan-400' : ''
                        }`}
                      />
                    </a>

                    {/* Services Mega Dropdown */}
                    {servicesDropdownOpen && (
                      <div className="absolute top-full left-0 w-80 pt-2 animate-fade-in">
                        <div className="rounded-2xl bg-[#101626] border border-[#263249] p-3 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-xl">
                          <div className="px-3 py-2 text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-[#263249]/60 mb-2">
                            Service Categories
                          </div>
                          <div className="space-y-1">
                            {categories.map(cat => {
                              const CatIcon = getCategoryIcon(cat.slug);
                              return (
                                <a
                                  key={cat.id}
                                  href={`/services?category=${cat.slug}`}
                                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#141C2E] group/item transition-colors"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-[#080B14] border border-[#263249] flex items-center justify-center text-cyan-400 group-hover/item:border-cyan-400">
                                    <CatIcon className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="text-xs font-semibold text-white group-hover/item:text-cyan-300">
                                      {cat.name}
                                    </div>
                                    <div className="text-[11px] text-[#A7B2C8] line-clamp-1">
                                      {cat.description}
                                    </div>
                                  </div>
                                </a>
                              );
                            })}
                          </div>

                          <div className="mt-3 pt-2 border-t border-[#263249]/60 px-2 flex justify-between items-center">
                            <a
                              href="/services"
                              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                            >
                              <span>View All 47 Services</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href="/custom-service"
                              className="text-xs font-medium text-violet-400 hover:text-violet-300"
                            >
                              Custom Scopes
                            </a>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <a
                  key={link.name}
                  href={link.path}
                  onClick={link.isAnchor ? handleAboutClick : undefined}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-cyan-300 bg-white/5 font-semibold'
                      : 'text-[#A7B2C8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </nav>

          {/* Desktop Right Actions - Streamlined & Professional */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Currency Selector (USD & BDT) */}
            <div className="flex items-center bg-[#101626] border border-[#263249] rounded-xl p-1 text-xs shadow-inner">
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                  currency === 'USD'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="United States Dollar ($)"
              >
                $ USD
              </button>
              <button
                type="button"
                onClick={() => setCurrency('BDT')}
                className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-all cursor-pointer ${
                  currency === 'BDT'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Bangladeshi Taka (৳)"
              >
                ৳ BDT
              </button>
            </div>

            {/* Global Light / Dark Theme Switcher */}
            <button
              type="button"
              onClick={toggleThemeMode}
              title={themeMode === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2.5 rounded-xl bg-[#101626] border border-[#263249] hover:border-cyan-400 text-slate-300 hover:text-cyan-300 transition-colors flex items-center justify-center cursor-pointer"
            >
              {themeMode === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-500 hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* Language Switcher (EN / BN) */}
            <div className="flex items-center bg-[#101626] border border-[#263249] rounded-xl p-1 text-xs">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-colors cursor-pointer ${
                  language === 'en'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('bn')}
                className={`px-2.5 py-1 rounded-lg font-mono font-bold transition-colors cursor-pointer ${
                  language === 'bn'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                বাং
              </button>
            </div>

            {/* Admin Dashboard Entry */}
            <a
              href="/admin"
              title="Administrator Portal"
              className={`p-2.5 rounded-xl border border-[#263249] hover:border-cyan-400 text-slate-400 hover:text-cyan-300 transition-colors ${
                isAuthenticated ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300' : 'bg-[#141C2E]'
              }`}
            >
              <Shield className="w-4 h-4" />
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Compact Light/Dark switch on Mobile */}
            <button
              type="button"
              onClick={toggleThemeMode}
              className="p-2 rounded-xl bg-[#141C2E] border border-[#263249] text-slate-300"
              title="Toggle Light/Dark Theme"
            >
              {themeMode === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-400" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl bg-[#141C2E] border border-[#263249] text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#080B14] border-b border-[#263249] px-6 py-6 space-y-4 animate-fade-in shadow-2xl">
          <nav className="flex flex-col space-y-2">
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.path}
                onClick={e => {
                  setMobileMenuOpen(false);
                  if (link.isAnchor) handleAboutClick(e);
                }}
                className={`px-4 py-3 rounded-xl text-base font-medium ${
                  currentPath === link.path
                    ? 'text-cyan-300 bg-white/10 font-bold'
                    : 'text-[#A7B2C8] hover:text-white hover:bg-white/5'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          <div className="pt-4 border-t border-[#263249] flex flex-col gap-3">
            {/* Currency switch on mobile */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#101626] border border-[#263249]">
              <span className="text-xs text-slate-400 font-mono">Currency:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrency('USD')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                    currency === 'USD' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
                  }`}
                >
                  USD ($)
                </button>
                <button
                  type="button"
                  onClick={() => setCurrency('BDT')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                    currency === 'BDT' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
                  }`}
                >
                  BDT (৳)
                </button>
              </div>
            </div>

            {/* Language switch on mobile */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-[#101626] border border-[#263249]">
              <span className="text-xs text-slate-400 font-mono">Language:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                    language === 'en' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('bn')}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-bold ${
                    language === 'bn' ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400'
                  }`}
                >
                  বাংলা
                </button>
              </div>
            </div>

            <a
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full py-2.5 rounded-xl border border-[#263249] bg-[#101626] text-slate-300 font-medium text-xs text-center flex items-center justify-center gap-2"
            >
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Admin Portal ({isAuthenticated ? 'Signed In' : 'Sign In'})</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
