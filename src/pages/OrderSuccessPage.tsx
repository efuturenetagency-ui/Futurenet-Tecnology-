import React from 'react';
import {
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  FileText,
  UserCheck,
  Rocket,
  Printer,
} from 'lucide-react';
import { WhatsAppButton } from '../components/common/WhatsAppButton';

export const OrderSuccessPage: React.FC = () => {
  // Extract reference from URL
  const searchParams = new URLSearchParams(window.location.search);
  const orderRef = searchParams.get('ref') || 'FT-2026-LIVE';

  return (
    <div className="pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-12">
      {/* Success Badge & Headline */}
      <div className="printable-document-root p-8 sm:p-12 rounded-3xl bg-[#101626] border border-cyan-500/30 text-center space-y-6 shadow-[0_0_50px_rgba(34,211,238,0.15)]">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 animate-pulse">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-blue-500/10 text-cyan-400 border border-blue-500/30">
            OFFICIAL DATABASE RECORD CONFIRMED
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Space_Grotesk'] text-white">
            Order Submitted & Verified
          </h1>
          <p className="text-sm text-[#A7B2C8] max-w-lg mx-auto">
            Your project order has been verified and registered in our central Firestore database with an immutable timestamp.
          </p>
        </div>

        {/* Order Reference Box */}
        <div className="p-5 rounded-2xl bg-[#080B14] border border-[#263249] max-w-md mx-auto space-y-2 text-center">
          <span className="text-xs text-slate-400 uppercase tracking-widest block font-mono">
            Your Project Reference Code
          </span>
          <div className="text-2xl font-black font-mono text-cyan-400 tracking-wider">
            {orderRef}
          </div>
          <span className="text-[11px] text-[#A7B2C8] block">
            Please quote this reference in any subsequent communications.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => window.print()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30 font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4" /> Print A4 Receipt
          </button>
          <WhatsAppButton
            serviceName={`Order ${orderRef}`}
            customMessage={`Hello Futurent Technology, I just submitted project order reference ${orderRef}. I would like to confirm receipt and discuss kickoff details.`}
            variant="button"
            className="w-full sm:w-auto"
            showExplanation={false}
          />
          <a
            href="/services"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-[#263249] hover:bg-[#141C2E] text-slate-300 font-medium text-xs transition-colors text-center"
          >
            Explore More Services
          </a>
        </div>
      </div>

      {/* Execution Roadmap */}
      <div className="p-8 rounded-3xl bg-[#141C2E] border border-[#263249] space-y-6">
        <h2 className="text-lg font-bold font-['Space_Grotesk'] text-white">
          What Happens Next in Our Pipeline?
        </h2>

        <div className="space-y-4">
          <div className="flex gap-4 p-4 rounded-xl bg-[#080B14] border border-[#263249]/60">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
              01
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Requirement Verification & Review</h3>
              <p className="text-xs text-[#A7B2C8] mt-0.5">
                Our technical architects audit the deliverables, technical dependencies, and compatibility.
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-xl bg-[#080B14] border border-[#263249]/60">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
              02
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Manager & Lead Engineer Assignment</h3>
              <p className="text-xs text-[#A7B2C8] mt-0.5">
                A dedicated technical project manager will reach out via your preferred channel (WhatsApp or Email).
              </p>
            </div>
          </div>

          <div className="flex gap-4 p-4 rounded-xl bg-[#080B14] border border-[#263249]/60">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0">
              03
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Formal Quotation & Sprint Kickoff</h3>
              <p className="text-xs text-[#A7B2C8] mt-0.5">
                We formulate the exact Scope of Work (SOW), milestones, and release schedules upon mutual signoff.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
