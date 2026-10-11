import React from 'react';
import { Package, ArrowRight } from 'lucide-react';
import { ServiceItem } from '../../../types';

export const AdminPricingPackagesModule: React.FC<{
  services: ServiceItem[];
  onNavigateToServices: () => void;
}> = ({ services, onNavigateToServices }) => {
  const packagedServices = services.filter(s => s.packages && s.packages.length > 0);

  return (
    <div className="space-y-6 max-w-4xl animate-fade-in">
      <div className="p-6 rounded-2xl bg-[#101626] border border-[#263249] flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
            Pricing & Service Packages
          </h3>
          <p className="text-xs text-[#A7B2C8]">
            Tiered package structures (Starter, Growth, Enterprise Pro) configured for catalog services.
          </p>
        </div>
        <button
          onClick={onNavigateToServices}
          className="px-4 py-2 rounded-xl bg-[#4F8CFF] text-white text-xs font-bold flex items-center gap-1.5"
        >
          <span>Manage in Services</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-4">
        {packagedServices.map(s => (
          <div key={s.id} className="p-5 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-4">
            <div className="flex items-center justify-between border-b border-[#263249] pb-3">
              <div>
                <h4 className="text-sm font-bold text-white font-['Space_Grotesk']">{s.name}</h4>
                <span className="text-[11px] text-cyan-400 font-mono">{s.categoryName}</span>
              </div>
              <span className="text-xs text-slate-400 font-mono font-bold">
                {s.packages?.length} Package Tiers
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {s.packages?.map(pkg => (
                <div key={pkg.id} className="p-4 rounded-xl bg-[#080B14] border border-[#263249] space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white">{pkg.name}</span>
                    <span className="font-mono text-cyan-400 font-bold">${pkg.price}</span>
                  </div>
                  <p className="text-[11px] text-[#A7B2C8]">{pkg.description}</p>
                  <div className="text-[10px] text-violet-400 font-mono">
                    Turnaround: {pkg.deliveryDays} Business Days
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
