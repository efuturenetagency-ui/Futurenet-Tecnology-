import React from 'react';
import { ShieldCheck, FileText, ArrowLeft } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
          LEGAL & COMPLIANCE
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-['Space_Grotesk'] text-white">
          Privacy Policy
        </h1>
        <p className="text-xs text-[#A7B2C8]">Last revised: October 2026</p>
      </div>

      <div className="p-8 rounded-3xl bg-[#101626] border border-[#263249] space-y-6 text-sm text-[#A7B2C8] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
            1. Information Collection
          </h2>
          <p>
            Futurent Technology collects client project requirements, names, company information, email addresses, phone numbers, and WhatsApp contact details solely for the purposes of evaluating, scoping, estimating, and delivering contracted software engineering and digital marketing services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
            2. Data Security & Storage
          </h2>
          <p>
            All submitted specifications and orders are stored in Google Cloud Firestore with granular attribute-based access control (ABAC). Unauthenticated public users are prohibited from querying or reading client order details or communications.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
            3. Communications Channels
          </h2>
          <p>
            Client inquiries via WhatsApp, email, or telephone are conducted with explicit consent for project execution. We do not sell or lease client contact information or technical intellectual property to third-party data brokers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
            4. Proprietary Rights
          </h2>
          <p>
            All codebases, design assets, and architectural documents developed for client projects become the exclusive property of the client upon fulfillment of agreed contractual terms.
          </p>
        </section>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="pt-36 pb-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-8">
      <div className="space-y-2">
        <span className="text-xs font-mono uppercase tracking-widest text-violet-400 font-bold">
          TERMS & CONDITIONS
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-['Space_Grotesk'] text-white">
          Terms of Service
        </h1>
        <p className="text-xs text-[#A7B2C8]">Effective: 2026</p>
      </div>

      <div className="p-8 rounded-3xl bg-[#101626] border border-[#263249] space-y-6 text-sm text-[#A7B2C8] leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
            1. Engagement Scope
          </h2>
          <p>
            Service orders submitted through the website represent initial project requests. Official contracts and financial agreements commence upon issuance and client acceptance of a formal Statement of Work (SOW).
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
            2. Delivery Estimates
          </h2>
          <p>
            Turnaround times and delivery estimates displayed across the catalog represent standard development velocity. Complex integrations or custom specifications may alter the delivery timeline as outlined in the customized SOW.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white font-['Space_Grotesk']">
            3. WhatsApp Communication
          </h2>
          <p>
            Direct WhatsApp discussions serve as informal consultative channels. All binding specifications, pricing, and deliverable commitments are memorialized in formal order records.
          </p>
        </section>
      </div>
    </div>
  );
};

export const NotFoundPage: React.FC = () => {
  return (
    <div className="pt-40 pb-32 px-4 sm:px-6 lg:px-8 max-w-md mx-auto text-center space-y-6">
      <div className="text-7xl font-extrabold font-mono text-cyan-400/40">404</div>
      <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-white">
        Coordinates Not Found
      </h1>
      <p className="text-sm text-[#A7B2C8]">
        The requested URL does not point to an active module or public resource on Futurent Technology.
      </p>
      <div className="pt-2">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#4F8CFF] hover:bg-blue-500 text-white font-semibold text-xs transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </a>
      </div>
    </div>
  );
};
