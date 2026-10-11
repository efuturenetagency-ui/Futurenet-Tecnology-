import React from 'react';
import { FileText, Eye, CheckCircle2 } from 'lucide-react';

const STATIC_PAGES = [
  { path: '/', name: 'Home Page', status: 'Published', sectionsCount: 9 },
  { path: '/about', name: 'About Us', status: 'Published', sectionsCount: 4 },
  { path: '/services', name: 'Services Catalog', status: 'Published', sectionsCount: 47 },
  { path: '/custom-service', name: 'Custom Service Wizard', status: 'Published', sectionsCount: 5 },
  { path: '/contact', name: 'Contact Us', status: 'Published', sectionsCount: 2 },
  { path: '/privacy-policy', name: 'Privacy Policy', status: 'Published', sectionsCount: 1 },
  { path: '/terms', name: 'Terms of Service', status: 'Published', sectionsCount: 1 },
  { path: '/order/success', name: 'Order Confirmation', status: 'Published', sectionsCount: 1 },
];

export const AdminPagesModule: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <div className="p-6 rounded-2xl bg-[#101626] border border-[#263249] space-y-1">
        <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">Public Website Pages</h3>
        <p className="text-xs text-[#A7B2C8]">All 8 active public routes and their publishing states.</p>
      </div>

      <div className="rounded-2xl bg-[#101626] border border-[#263249] overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#080B14] border-b border-[#263249] text-[#A7B2C8] uppercase font-mono">
            <tr>
              <th className="py-3 px-4">Route Path</th>
              <th className="py-3 px-4">Page Name</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#263249]/60">
            {STATIC_PAGES.map(p => (
              <tr key={p.path} className="hover:bg-[#141C2E]/60">
                <td className="py-3 px-4 font-mono text-cyan-400 font-bold">{p.path}</td>
                <td className="py-3 px-4 text-white font-medium">{p.name}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold text-[10px] uppercase">
                    {p.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <a
                    href={p.path}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-[#080B14] border border-[#263249] text-slate-300 hover:text-cyan-300 inline-block"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
