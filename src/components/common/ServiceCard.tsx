import React from 'react';
import {
  ArrowRight,
  Check,
  Clock,
  Sparkles,
  Zap,
  TrendingUp,
  Code2,
  Cpu,
  Layers,
  ShoppingBag,
  Briefcase,
  Terminal,
  ShieldCheck,
  Monitor,
  Activity,
  Award,
  Globe,
  Sliders,
  Target,
  Calendar,
  Image,
  Video,
  Users,
  Compass,
  Building2,
  FolderKanban,
  Maximize2,
  Newspaper,
  GraduationCap,
  Home,
  Lock,
  BookOpen,
  UserCheck,
  Database,
  CreditCard,
  Package,
  FileText,
  CalendarCheck,
  LayoutGrid,
  Network,
  Workflow,
  PieChart,
  Wrench,
  HelpCircle,
  Megaphone,
  Share2,
} from 'lucide-react';
import { ServiceItem, ServicePackage } from '../../types';
import { WhatsAppButton } from './WhatsAppButton';

interface ServiceCardProps {
  service: ServiceItem;
  onOpenOrder: (service: ServiceItem, pkg?: ServicePackage) => void;
  featuredHighlight?: boolean;
}

// Icon mapping helper
const iconMap: Record<string, React.ElementType> = {
  Sliders,
  TrendingUp,
  Target,
  Zap,
  Activity,
  Layers,
  Calendar,
  Image,
  Video,
  Users,
  Compass,
  Briefcase,
  Building2,
  ShoppingBag,
  FolderKanban,
  Maximize2,
  Newspaper,
  GraduationCap,
  Home,
  Clock,
  Lock,
  BookOpen,
  Globe,
  Terminal,
  ShieldCheck,
  Award,
  UserCheck,
  Database,
  CreditCard,
  Package,
  FileText,
  Monitor,
  CalendarCheck,
  LayoutGrid,
  Cpu,
  Network,
  Sparkles,
  Code2,
  Workflow,
  PieChart,
  Wrench,
  HelpCircle,
  Megaphone,
  Share2,
};

export const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  onOpenOrder,
  featuredHighlight = false,
}) => {
  const IconComponent = iconMap[service.icon] || Sparkles;

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-2xl bg-[#141C2E] border p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_35px_rgba(79,140,255,0.15)] ${
        featuredHighlight || service.isFeatured
          ? 'border-cyan-500/40 shadow-[0_0_20px_rgba(34,211,238,0.08)]'
          : 'border-[#263249] hover:border-blue-500/40'
      }`}
    >
      {/* Top badges & Icon */}
      <div>
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-[#101626] border border-[#263249] flex items-center justify-center text-cyan-400 group-hover:text-blue-400 group-hover:border-cyan-500/40 transition-colors shadow-inner">
            <IconComponent className="w-6 h-6" />
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              {service.categoryName}
            </span>
            {service.isFeatured && (
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Featured
              </span>
            )}
          </div>
        </div>

        {/* Title & Slug Link */}
        <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors font-['Space_Grotesk'] mb-2">
          <a href={`/services/${service.slug}`} className="hover:underline">
            {service.name}
          </a>
        </h3>

        {/* Short Description */}
        <p className="text-sm text-[#A7B2C8] leading-relaxed mb-4 line-clamp-3">
          {service.shortDescription}
        </p>

        {/* Features preview */}
        {service.features && service.features.length > 0 && (
          <ul className="space-y-2 mb-6 border-t border-[#263249]/60 pt-4">
            {service.features.slice(0, 3).map((feat, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span className="truncate">{feat}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Pricing & Mandatory 2 Action Buttons */}
      <div className="pt-4 border-t border-[#263249] space-y-4">
        {/* Price & Delivery Info */}
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Investment</span>
            <span className="text-sm font-bold text-cyan-400 font-mono">
              {service.startingPriceLabel || (service.price ? `$${service.price}` : 'Custom Quote')}
            </span>
          </div>

          {service.deliveryEstimate && (
            <div className="text-right">
              <span className="text-slate-400 block text-[11px]">Turnaround</span>
              <span className="text-xs text-violet-300 font-medium flex items-center justify-end gap-1">
                <Clock className="w-3 h-3" />
                {service.deliveryEstimate}
              </span>
            </div>
          )}
        </div>

        {/* MANDATORY 2 ACTION BUTTONS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* BUTTON A: ORDER NOW */}
          <button
            type="button"
            onClick={() => onOpenOrder(service)}
            className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] hover:opacity-95 text-white font-semibold text-xs transition-all shadow-[0_0_15px_rgba(79,140,255,0.25)] active:scale-95 cursor-pointer"
          >
            <span>Order Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* BUTTON B: MESSAGE ON WHATSAPP */}
          <WhatsAppButton
            serviceName={service.name}
            variant="outline"
            className="w-full !py-2.5 !text-xs"
          />
        </div>

        {/* Deep Dive Details link */}
        <div className="text-center">
          <a
            href={`/services/${service.slug}`}
            className="inline-flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300 transition-colors"
          >
            <span>View Full Service Specifications & Packages</span>
            <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
