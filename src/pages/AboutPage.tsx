import React from 'react';
import {
  Sparkles,
  ShieldCheck,
  Zap,
  Cpu,
  Layers,
  ArrowRight,
  Code2,
  Lock,
  Globe2,
} from 'lucide-react';
import { WhatsAppButton } from '../components/common/WhatsAppButton';

export const AboutPage: React.FC<{ onOpenOrderModal: () => void }> = ({ onOpenOrderModal }) => {
  return (
    <div className="pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <span className="inline-block px-3.5 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
          WHO WE ARE • FUTURE-PROOF IT ARCHITECTURE
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold font-['Space_Grotesk'] text-white">
          Engineering High-Performance Digital Foundations.
        </h1>
        <p className="text-base sm:text-lg text-[#A7B2C8] leading-relaxed">
          Futurent Technology is an elite full-stack technology agency and digital consultancy. We engineer robust custom web applications, scalable enterprise software, and conversion-driven digital marketing infrastructure for modern organizations worldwide.
        </p>
      </div>

      {/* Core Values / Engineering Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-8 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-cyan-400">
            <Cpu className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
            Zero-Bloat Architecture
          </h3>
          <p className="text-sm text-[#A7B2C8] leading-relaxed">
            We reject fragile boilerplate and slow templates. Every application is built with modern, maintainable TypeScript, clean component structures, and verified database schemas.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
            Security & Zero-Trust Access
          </h3>
          <p className="text-sm text-[#A7B2C8] leading-relaxed">
            Database access rules are audited with attribute-based access control, strict server timestamp validation, and payload limits to eliminate injection and data leakage risks.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-[#141C2E] border border-[#263249] space-y-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Zap className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold font-['Space_Grotesk'] text-white">
            Commercial Return on Investment
          </h3>
          <p className="text-sm text-[#A7B2C8] leading-relaxed">
            Whether running Meta conversion campaigns or deploying an enterprise CRM, our measures of success are real conversions, throughput speed, and business growth.
          </p>
        </div>
      </div>

      {/* Tech Stack Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#101626] border border-[#263249] space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
            FOUNDATIONAL TECHNOLOGIES
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white">
            Engineered With Modern Industry Standards
          </h2>
          <p className="text-xs sm:text-sm text-[#A7B2C8]">
            We deploy production-grade software using trusted cloud ecosystems.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 text-center">
          {['React 19', 'TypeScript', 'Node.js', 'Cloud Firestore', 'Tailwind CSS', 'Meta CAPI', 'REST & GraphQL', 'Vite & Next.js', 'Google Cloud', 'OAuth 2.0', 'Redis Cache', 'Express & Fastify'].map((tech, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#080B14] border border-[#263249] text-xs font-mono text-slate-300 font-medium">
              {tech}
            </div>
          ))}
        </div>
      </div>

      {/* Direct CTA */}
      <div className="rounded-3xl bg-gradient-to-r from-[#141C2E] to-[#101626] border border-[#263249] p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div>
          <h3 className="text-2xl font-bold font-['Space_Grotesk'] text-white">
            Have an ambitious technical initiative?
          </h3>
          <p className="text-sm text-[#A7B2C8] mt-1">
            Discuss your requirements directly with our technical lead.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <button
            type="button"
            onClick={onOpenOrderModal}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-[#4F8CFF] to-[#8B5CF6] text-white font-bold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
          >
            <span>Order A Service</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <WhatsAppButton serviceName="Agency Inquiry" variant="outline" className="w-full sm:w-auto" />
        </div>
      </div>
    </div>
  );
};
