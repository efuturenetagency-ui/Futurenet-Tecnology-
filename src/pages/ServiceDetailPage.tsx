import React from 'react';
import {
  ArrowLeft,
  Check,
  Clock,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  HelpCircle,
  PackageCheck,
  FileCheck,
} from 'lucide-react';
import { ServiceItem, ServicePackage } from '../types';
import { WhatsAppButton } from '../components/common/WhatsAppButton';
import { useSiteSettings } from '../context/ThemeContext';

interface ServiceDetailPageProps {
  service: ServiceItem | null;
  onOpenOrderModal: (service: ServiceItem, pkg?: ServicePackage) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({
  service,
  onOpenOrderModal,
}) => {
  const { formatPrice } = useSiteSettings();
  if (!service) {
    return (
      <div className="pt-40 pb-24 text-center space-y-4 max-w-md mx-auto px-4">
        <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-white">Service Not Found</h2>
        <p className="text-sm text-[#A7B2C8]">
          The requested service catalog item does not exist or may have been updated.
        </p>
        <a
          href="/services"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F8CFF] text-white text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to All Services</span>
        </a>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Breadcrumb & Navigation */}
      <div>
        <a
          href="/services"
          className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-cyan-300 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Services</span>
        </a>

        {/* Hero Service Header */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#101626] border border-[#263249] relative overflow-hidden space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-blue-500/10 text-cyan-400 border border-blue-500/30">
              {service.categoryName}
            </span>
            {service.isFeatured && (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Featured Service
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-['Space_Grotesk'] text-white">
            {service.name}
          </h1>

          <p className="text-base sm:text-lg text-[#A7B2C8] max-w-3xl leading-relaxed">
            {service.shortDescription}
          </p>

          {/* Pricing & Mandatory 2 Action Buttons Header Bar */}
          <div className="pt-6 border-t border-[#263249] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex items-center gap-8">
              <div>
                <span className="text-xs text-slate-400 block uppercase tracking-wider">Starting Rate</span>
                <span className="text-2xl font-bold font-mono text-cyan-400">
                  {service.price ? formatPrice(service.price) : service.startingPriceLabel || 'Custom Scope'}
                </span>
              </div>

              {service.deliveryEstimate && (
                <div>
                  <span className="text-xs text-slate-400 block uppercase tracking-wider">Estimated Delivery</span>
                  <span className="text-sm font-semibold text-violet-300 flex items-center gap-1.5 mt-1">
                    <Clock className="w-4 h-4" />
                    {service.deliveryEstimate}
                  </span>
                </div>
              )}
            </div>

            {/* MANDATORY TWO ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                onClick={() => onOpenOrderModal(service)}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] hover:opacity-95 text-white font-bold text-sm tracking-wide shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <span>Order Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <WhatsAppButton
                serviceName={service.name}
                variant="outline"
                className="w-full sm:w-auto"
                showExplanation={false}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Full Description & Features */}
        <div className="lg:col-span-2 space-y-10">
          <div className="p-8 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-4">
            <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white">
              Service Overview & Technical Approach
            </h2>
            <div className="text-sm sm:text-base text-[#A7B2C8] leading-relaxed whitespace-pre-line space-y-4">
              {service.fullDescription}
            </div>
          </div>

          {/* Key Deliverables / Features */}
          {service.features && service.features.length > 0 && (
            <div className="p-8 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-6">
              <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                Included Deliverables & Capabilities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.features.map((feature, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-3.5 rounded-xl bg-[#080B14] border border-[#263249]/80"
                  >
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-200">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Package Options if Available */}
          {service.packages && service.packages.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-['Space_Grotesk'] text-white">
                Available Package Tiers
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {service.packages.map(pkg => (
                  <div
                    key={pkg.id}
                    className={`rounded-2xl p-6 border flex flex-col justify-between space-y-6 ${
                      pkg.isPopular
                        ? 'bg-[#101626] border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.15)]'
                        : 'bg-[#141C2E] border-[#263249]'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white font-['Space_Grotesk']">
                          {pkg.name}
                        </h3>
                        {pkg.isPopular && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            Recommended
                          </span>
                        )}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold font-mono text-cyan-400">
                          {formatPrice(pkg.price)}
                        </span>
                        <span className="text-xs text-[#A7B2C8]">/ {pkg.deliveryDays} Days Turnaround</span>
                      </div>
                      <p className="text-xs text-[#A7B2C8]">{pkg.description}</p>
                      <ul className="space-y-2 pt-2 border-t border-[#263249]/60">
                        {pkg.features.map((f, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                            <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenOrderModal(service, pkg)}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>Select {pkg.name} Tier</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Execution Card & WhatsApp Notice */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#101626] border border-[#263249] space-y-6 sticky top-28">
            <h3 className="text-base font-bold text-white font-['Space_Grotesk'] border-b border-[#263249] pb-3">
              Project Execution Guarantee
            </h3>

            <div className="space-y-4 text-xs text-[#A7B2C8]">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>Formal Order Reference assigned in Cloud Firestore immediately upon submission.</span>
              </div>
              <div className="flex items-start gap-3">
                <FileCheck className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>Dedicated Technical Lead assigned for project scoping and sprint updates.</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="w-4 h-4 text-violet-400 flex-shrink-0 mt-0.5" />
                <span>Strict milestone timelines and delivery schedule agreed before deposit.</span>
              </div>
            </div>

            {/* Sticky Actions */}
            <div className="pt-2 space-y-3">
              <button
                type="button"
                onClick={() => onOpenOrderModal(service)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Order {service.name}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <WhatsAppButton
                serviceName={service.name}
                variant="button"
                className="w-full !py-3"
                showExplanation={true}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
