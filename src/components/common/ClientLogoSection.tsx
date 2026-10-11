import React, { useState, useEffect } from 'react';
import { Sparkles, Building2, ExternalLink } from 'lucide-react';
import { getClientLogos } from '../../lib/dataService';
import { ClientLogoItem } from '../../types';

export const ClientLogoSection: React.FC = () => {
  const [logos, setLogos] = useState<ClientLogoItem[]>([]);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const list = await getClientLogos();
        setLogos(list.filter(l => l.isEnabled));
      } catch (e) {
        console.error('Error fetching logos:', e);
      }
    };
    fetchLogos();
  }, []);

  if (logos.length === 0) return null;

  return (
    <section className="py-12 border-y border-[#263249]/60 bg-[#080B14]/80 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <span className="text-[11px] font-mono font-bold tracking-widest text-[#A7B2C8] uppercase">
            Trusted by Forward-Thinking Enterprises & Growth Leaders
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center justify-items-center">
          {logos.map(logo => (
            <a
              key={logo.id}
              href={logo.websiteUrl || '#'}
              target={logo.websiteUrl ? '_blank' : '_self'}
              rel="noreferrer"
              className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-[#101626]/40 border border-transparent hover:border-[#263249] transition-all hover:scale-105"
            >
              <div className="h-10 w-28 flex items-center justify-center">
                <img
                  src={logo.logoUrl}
                  alt={logo.altText}
                  className="max-h-full max-w-full object-contain filter grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                />
              </div>
              <span className="text-[10px] text-slate-500 font-mono mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {logo.clientName}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
