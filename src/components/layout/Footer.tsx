import React from 'react';
import {
  MapPin,
  Mail,
  Phone,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  MessageSquare,
} from 'lucide-react';
import { useSiteSettings } from '../../context/ThemeContext';
import { WhatsAppButton } from '../common/WhatsAppButton';
import { ServiceCategory } from '../../types';

interface FooterProps {
  categories: ServiceCategory[];
  onOpenOrderModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ categories, onOpenOrderModal }) => {
  const { settings } = useSiteSettings();

  return (
    <footer className="relative bg-[#080B14] border-t border-[#263249] text-[#A7B2C8] overflow-hidden">
      {/* Background ambient gradient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />

      {/* Top CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 border-b border-[#263249]/60">
        <div className="relative rounded-3xl bg-gradient-to-r from-[#101626] via-[#141C2E] to-[#101626] border border-[#263249] p-8 sm:p-12 overflow-hidden shadow-2xl">
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8 text-center lg:text-left">
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                <Sparkles className="w-3.5 h-3.5" /> High-Throughput Engineering
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white">
                Ready to accelerate your technological advantage?
              </h2>
              <p className="text-sm text-[#A7B2C8]">
                Whether you need a full enterprise system, custom web app, or hyper-targeted Meta ad campaigns, Futurent delivers production excellence.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button
                type="button"
                onClick={onOpenOrderModal}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] hover:opacity-95 text-white font-bold text-sm shadow-[0_0_25px_rgba(79,140,255,0.35)] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Initiate Project</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <WhatsAppButton variant="button" className="w-full sm:w-auto" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4F8CFF] to-[#22D3EE] p-[1.5px]">
                <div className="w-full h-full bg-[#080B14] rounded-[10px] flex items-center justify-center font-['Space_Grotesk'] font-black text-cyan-400 text-base">
                  FT
                </div>
              </div>
              <span className="font-['Space_Grotesk'] font-bold text-xl text-white">
                {settings.brandName || 'Futurent Technology'}
              </span>
            </div>

            <p className="text-sm text-[#A7B2C8] leading-relaxed max-w-sm">
              {settings.tagline ||
                'Building Digital Experiences That Move Your Business Forward with strategic digital marketing, modern websites, and custom software.'}
            </p>

            <div className="space-y-2 text-xs pt-2">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>{settings.officeAddress}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <a href={`mailto:${settings.supportEmail}`} className="hover:text-white transition-colors">
                  {settings.supportEmail}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <a href={`tel:${settings.supportPhone}`} className="hover:text-white transition-colors">
                  {settings.supportPhone}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                <span>{settings.workingHours}</span>
              </div>
            </div>
          </div>

          {/* Service Categories */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Service Pillars
            </h4>
            <ul className="space-y-2 text-sm">
              {categories.slice(0, 5).map(cat => (
                <li key={cat.id}>
                  <a
                    href={`/services?category=${cat.slug}`}
                    className="hover:text-cyan-300 transition-colors"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
              <li>
                <a href="/custom-service" className="text-violet-400 hover:text-violet-300">
                  Custom Technology Scope
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Company Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Agency
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/" className="hover:text-cyan-300 transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/#about" className="hover:text-cyan-300 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="/services" className="hover:text-cyan-300 transition-colors">
                  All Services (47)
                </a>
              </li>
              <li>
                <a href="/custom-service" className="hover:text-cyan-300 transition-colors">
                  Custom Project Wizard
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-cyan-300 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Direct WhatsApp & Admin */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white">
              Direct Channels
            </h4>
            <p className="text-xs text-[#A7B2C8]">
              Instant coordination with engineering team on WhatsApp:
            </p>
            <WhatsAppButton serviceName="General Consultation" variant="button" className="w-full !py-2.5 !text-xs" />
            <div className="pt-2">
              <a
                href="/admin"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-300 transition-colors"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin Login & CMS</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar & Legal */}
      <div className="border-t border-[#263249]/60 bg-[#06080F]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} {settings.brandName || 'Futurent Technology'}. All rights reserved. Production Full-Stack IT Platform.
          </div>
          <div className="flex items-center gap-6">
            <a href="/privacy-policy" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </a>
            <a href="/admin" className="hover:text-cyan-400 transition-colors">
              Admin CMS
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
