import React from 'react';
import { Menu, CheckCircle2 } from 'lucide-react';

export const AdminNavigationModule: React.FC = () => {
  const items = [
    { label: 'Home', link: '/', enabled: true, order: 1 },
    { label: 'About Us', link: '/about', enabled: true, order: 2 },
    { label: 'Services (Mega Dropdown)', link: '/services', enabled: true, order: 3 },
    { label: 'Custom Service', link: '/custom-service', enabled: true, order: 4 },
    { label: 'Contact Us', link: '/contact', enabled: true, order: 5 },
    { label: 'Get Started CTA Button', link: '#order-modal', enabled: true, order: 6 },
    { label: 'Direct WhatsApp Button', link: 'https://wa.me/...', enabled: true, order: 7 },
  ];

  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div className="p-6 rounded-2xl bg-[#101626] border border-[#263249] space-y-1">
        <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">Header Navigation Items</h3>
        <p className="text-xs text-[#A7B2C8]">Active navigation structure rendered in the public header.</p>
      </div>

      <div className="space-y-2">
        {items.map(item => (
          <div key={item.label} className="p-4 rounded-xl bg-[#141C2E] border border-[#263249] flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="font-mono text-cyan-400 font-bold">0{item.order}</span>
              <div>
                <span className="font-bold text-white block">{item.label}</span>
                <span className="font-mono text-slate-400 text-[11px]">{item.link}</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-semibold">
              Active
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const AdminFooterModule: React.FC = () => {
  return (
    <div className="space-y-6 max-w-3xl animate-fade-in">
      <div className="p-6 rounded-2xl bg-[#101626] border border-[#263249] space-y-1">
        <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">Footer Layout & Columns</h3>
        <p className="text-xs text-[#A7B2C8]">Configure links, newsletter notices, and copyright metadata rendered in the global footer.</p>
      </div>

      <div className="p-6 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-4 text-xs text-[#A7B2C8]">
        <div className="flex justify-between items-center pb-3 border-b border-[#263249]">
          <span className="font-bold text-white">Column 1: Brand & Slogan</span>
          <span className="text-cyan-400 font-mono">Futurent Technology</span>
        </div>
        <div className="flex justify-between items-center pb-3 border-b border-[#263249]">
          <span className="font-bold text-white">Column 2: Service Pillars</span>
          <span className="text-cyan-400 font-mono">5 Top Categories (Dynamic)</span>
        </div>
        <div className="flex justify-between items-center pb-3 border-b border-[#263249]">
          <span className="font-bold text-white">Column 3: Agency Links</span>
          <span className="text-cyan-400 font-mono">Home, About, Services, Custom, Contact</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-bold text-white">Column 4: Direct Channels</span>
          <span className="text-emerald-400 font-mono">WhatsApp Button & Admin Login</span>
        </div>
      </div>
    </div>
  );
};
